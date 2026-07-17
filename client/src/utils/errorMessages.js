const statusMessages = {
  400: "Please check your input and try again.",
  401: "Your session has expired. Please log in again.",
  403: "You don't have permission to perform this action.",
  404: "The requested information could not be found.",
  409: "A record with the same details already exists.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again later.",
  502: "Our service is temporarily unavailable. Please try again later.",
  503: "Our service is temporarily unavailable. Please try again later.",
};

const technicalPatterns = [
  { pattern: /^cast to objectid failed/i, replacement: "The requested resource was not found." },
  { pattern: /^E11000 duplicate key/i, replacement: "A record with this value already exists." },
  { pattern: /^jwt (malformed|invalid)/i, replacement: "Session invalid. Please log in again." },
  { pattern: /^jwt expired/i, replacement: "Session expired. Please log in again." },
  { pattern: /^internal server error/i, replacement: "Something went wrong on our end. Please try again later." },
  { pattern: /^validation failed/i, replacement: "Please check your input and try again." },
  { pattern: /^cannot (read|destructure)/i, replacement: "Something unexpected happened. Please try again." },
  { pattern: /^network error/i, replacement: "Unable to connect to the server. Please check your internet connection." },
  { pattern: /^timeout of \d+ms exceeded/i, replacement: "The request took too long. Please try again." },
  { pattern: /^connect (econnrefused|etimedout)/i, replacement: "Unable to connect to the server. Please check your internet connection." },
];

const friendlyOverrides = [
  { pattern: /bad request/i, replacement: "Please check your input and try again." },
  { pattern: /not authorized|not found|forbidden/i, replacement: "Something went wrong. Please try again." },
  { pattern: /target.*not found/i, replacement: "The item you're looking for could not be found." },
  { pattern: /record.*not found/i, replacement: "The item you're looking for could not be found." },
  { pattern: /invalid credentials/i, replacement: "The email or password you entered is incorrect. Please try again." },
  { pattern: /invalid otp|invalid code/i, replacement: "The code you entered is incorrect. Please try again." },
  { pattern: /too many requests|rate limit/i, replacement: "Too many requests. Please wait a moment and try again." },
  { pattern: /already (approved|rejected)/i, replacement: "This action has already been completed." },
];

function isTechnicalMessage(msg) {
  return technicalPatterns.some(({ pattern }) => pattern.test(msg));
}

function getFriendlyForTechnical(msg) {
  const match = technicalPatterns.find(({ pattern }) => pattern.test(msg));
  return match ? match.replacement : null;
}

function getFriendlyOverride(msg) {
  const match = friendlyOverrides.find(({ pattern }) => pattern.test(msg));
  return match ? match.replacement : null;
}

export function extractError(err) {
  const response = err?.response;
  const data = response?.data;
  const status = response?.status;
  const backendMessage = data?.message;

  if (backendMessage && !isTechnicalMessage(backendMessage)) {
    const friendlyOverride = getFriendlyOverride(backendMessage);
    if (friendlyOverride) return friendlyOverride;
    return backendMessage;
  }

  if (backendMessage) {
    const friendly = getFriendlyForTechnical(backendMessage);
    if (friendly) return friendly;
  }

  if (status && statusMessages[status]) {
    return statusMessages[status];
  }

  if (err?.code === "ECONNABORTED") {
    return "The request took too long. Please try again.";
  }

  if (!response && err?.message) {
    const friendly = getFriendlyForTechnical(err.message);
    if (friendly) return friendly;
  }

  return "Something unexpected happened. Please try again.";
}
