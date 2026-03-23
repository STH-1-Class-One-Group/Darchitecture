import { SignJWT, importPKCS8 } from "jose";

const OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const FIRESTORE_SCOPE = "https://www.googleapis.com/auth/datastore";

const accessTokenCache = {
  token: null,
  expiresAt: 0
};

function getProjectId(env) {
  return env.FIREBASE_PROJECT_ID || env.project_id || env.PROJECT_ID;
}

function getServiceAccount(env) {
  const raw = env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    }
    return parsed;
  }

  const clientEmail = env.FIREBASE_CLIENT_EMAIL;
  const privateKey = env.FIREBASE_PRIVATE_KEY;

  if (clientEmail && privateKey) {
    return {
      project_id: getProjectId(env),
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, "\n")
    };
  }

  throw new Error(
    "Missing Firebase service account. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY."
  );
}

function getFirestoreRoot(env) {
  const projectId = getProjectId(env);
  if (!projectId) {
    throw new Error("Missing FIREBASE_PROJECT_ID.");
  }

  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
}

function encodeValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map((item) => encodeValue(item)) } };
  }
  if (value instanceof Date) {
    return { timestampValue: value.toISOString() };
  }

  switch (typeof value) {
    case "string":
      return { stringValue: value };
    case "number":
      return Number.isInteger(value)
        ? { integerValue: String(value) }
        : { doubleValue: value };
    case "boolean":
      return { booleanValue: value };
    case "object":
      return { mapValue: { fields: encodeFields(value) } };
    default:
      return { stringValue: String(value) };
  }
}

function encodeFields(data = {}) {
  return Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, encodeValue(value)])
  );
}

function decodeValue(value) {
  if (!value || typeof value !== "object") return null;
  if (Object.prototype.hasOwnProperty.call(value, "nullValue")) return null;
  if (Object.prototype.hasOwnProperty.call(value, "stringValue")) return value.stringValue;
  if (Object.prototype.hasOwnProperty.call(value, "booleanValue")) return Boolean(value.booleanValue);
  if (Object.prototype.hasOwnProperty.call(value, "integerValue")) return Number(value.integerValue);
  if (Object.prototype.hasOwnProperty.call(value, "doubleValue")) return Number(value.doubleValue);
  if (Object.prototype.hasOwnProperty.call(value, "timestampValue")) {
    const time = new Date(value.timestampValue).getTime();
    return Number.isNaN(time) ? value.timestampValue : time;
  }
  if (Object.prototype.hasOwnProperty.call(value, "arrayValue")) {
    return (value.arrayValue?.values || []).map((item) => decodeValue(item));
  }
  if (Object.prototype.hasOwnProperty.call(value, "mapValue")) {
    return decodeFields(value.mapValue?.fields || {});
  }
  if (Object.prototype.hasOwnProperty.call(value, "referenceValue")) return value.referenceValue;
  return null;
}

function decodeFields(fields = {}) {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]));
}

function decodeDocument(document) {
  if (!document) return null;
  const id = document.name?.split("/").pop() || document.id || null;
  return {
    id,
    ...decodeFields(document.fields || {})
  };
}

async function getAccessToken(env) {
  const now = Math.floor(Date.now() / 1000);
  if (accessTokenCache.token && accessTokenCache.expiresAt - 60 > now) {
    return accessTokenCache.token;
  }

  const account = getServiceAccount(env);
  const privateKey = await importPKCS8(account.private_key, "RS256");
  const assertion = await new SignJWT({ scope: FIRESTORE_SCOPE })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(account.client_email)
    .setSubject(account.client_email)
    .setAudience(OAUTH_TOKEN_URL)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(privateKey);

  const response = await fetch(OAUTH_TOKEN_URL, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Google access token: ${await response.text()}`);
  }

  const payload = await response.json();
  accessTokenCache.token = payload.access_token;
  accessTokenCache.expiresAt = now + Number(payload.expires_in || 3600);

  return accessTokenCache.token;
}

async function firestoreRequest(env, path, init = {}) {
  const token = await getAccessToken(env);
  const root = getFirestoreRoot(env);
  const response = await fetch(`${root}/${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...(init.headers || {})
    }
  });

  return response;
}

async function getDocument(env, collectionName, documentId) {
  const response = await firestoreRequest(env, `${collectionName}/${documentId}`);
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Failed to read document ${collectionName}/${documentId}: ${await response.text()}`);
  }
  return decodeDocument(await response.json());
}

async function setDocument(env, collectionName, documentId, data) {
  const response = await firestoreRequest(env, `${collectionName}/${documentId}`, {
    method: "PATCH",
    body: JSON.stringify({ fields: encodeFields(data) })
  });

  if (!response.ok) {
    throw new Error(`Failed to write document ${collectionName}/${documentId}: ${await response.text()}`);
  }

  return { id: documentId, ...data };
}

async function deleteDocument(env, collectionName, documentId) {
  const response = await firestoreRequest(env, `${collectionName}/${documentId}`, {
    method: "DELETE"
  });

  if (!response.ok && response.status !== 404) {
    throw new Error(`Failed to delete document ${collectionName}/${documentId}: ${await response.text()}`);
  }

  return true;
}

async function listDocumentsByField(env, collectionName, fieldPath, value, orderByField = "createdAt") {
  const response = await firestoreRequest(env, ":runQuery", {
    method: "POST",
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: collectionName }],
        where: {
          fieldFilter: {
            field: { fieldPath },
            op: "EQUAL",
            value: encodeValue(value)
          }
        },
        orderBy: [
          {
            field: { fieldPath: orderByField },
            direction: "DESCENDING"
          }
        ]
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to query collection ${collectionName}: ${await response.text()}`);
  }

  const rows = await response.json();
  return rows
    .map((row) => decodeDocument(row.document))
    .filter(Boolean)
    .sort((left, right) => {
      const leftValue = Number(left?.[orderByField] || 0);
      const rightValue = Number(right?.[orderByField] || 0);
      return rightValue - leftValue;
    });
}

export {
  decodeDocument,
  deleteDocument,
  encodeFields,
  encodeValue,
  firestoreRequest,
  getDocument,
  getFirestoreRoot,
  getProjectId,
  listDocumentsByField,
  setDocument
};
