const DEFAULT_ERROR_CODES = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  410: "GONE",
  500: "INTERNAL_ERROR"
};

const DEFAULT_ERROR_MESSAGES = {
  400: "The request is invalid.",
  401: "Authentication is required.",
  403: "Access is denied.",
  404: "Resource not found.",
  409: "A conflicting resource already exists.",
  410: "This endpoint is no longer available.",
  500: "An internal server error occurred."
};

function sendError(res, status, code, message) {
  const resolvedStatus = Number(status) || 500;
  const resolvedCode = code || DEFAULT_ERROR_CODES[resolvedStatus] || DEFAULT_ERROR_CODES[500];
  const resolvedMessage = message || DEFAULT_ERROR_MESSAGES[resolvedStatus] || DEFAULT_ERROR_MESSAGES[500];

  return res.status(resolvedStatus).json({
    error: {
      code: resolvedCode,
      message: resolvedMessage
    }
  });
}

module.exports = {
  sendError
};
