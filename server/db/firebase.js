const crypto = require("crypto");

function uid(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

module.exports = {
  uid
};
