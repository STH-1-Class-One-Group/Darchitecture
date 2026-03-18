// Prototype smoke test placeholder.
// Run: node test/prototype_test_v1.test.js

const http = require("http");

http.get("http://localhost:4000/health", (res) => {
  if (res.statusCode !== 200) {
    console.error("Health check failed", res.statusCode);
    process.exit(1);
  }
  console.log("Health check OK");
  process.exit(0);
}).on("error", (err) => {
  console.error("Health check error", err.message);
  process.exit(1);
});
