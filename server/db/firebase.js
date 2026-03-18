const crypto = require("crypto");

const db = {
  users: new Map(),
  rides: new Map(),
  reports: new Map(),
  pointLogs: new Map(),
  quizResults: new Map(),
  usageLogs: new Map()
};

function uid(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

module.exports = {
  db,
  uid
};
