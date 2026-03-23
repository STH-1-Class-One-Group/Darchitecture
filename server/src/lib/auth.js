import { createRemoteJWKSet, jwtVerify } from "jose";

const FIREBASE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

function getProjectId(env) {
  return env.FIREBASE_PROJECT_ID;
}

function normalizeClaims(payload) {
  return {
    uid: payload.sub,
    name: payload.name || payload.displayName || "",
    email: payload.email || "",
    picture: payload.picture || ""
  };
}

export async function verifyFirebaseToken(env, authorizationHeader) {
  const header = authorizationHeader || "";
  const match = header.match(/^Bearer (.+)$/);

  if (!match) {
    throw new Error("missing_token");
  }

  const projectId = getProjectId(env);
  if (!projectId) {
    throw new Error("missing_project_id");
  }

  const token = match[1];
  const { payload } = await jwtVerify(token, FIREBASE_JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId
  });

  return normalizeClaims(payload);
}

export async function authRequired(c, next) {
  try {
    const user = await verifyFirebaseToken(c.env, c.req.header("Authorization"));
    c.set("user", user);
    return await next();
  } catch (error) {
    const code = error?.message || "invalid_token";
    return c.json({ error: code }, 401);
  }
}

export { normalizeClaims };
