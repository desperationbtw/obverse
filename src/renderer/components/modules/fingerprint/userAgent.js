const UserAgent = require("user-agents");

function randomUserAgent() {
  const userAgent = new UserAgent();
  return userAgent.userAgent;
}

export { randomUserAgent };
