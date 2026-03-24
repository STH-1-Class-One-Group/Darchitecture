const { spawnSync } = require("node:child_process");

const env = {
  ...process.env,
  EXPO_USE_NODE_EXTERNALS: "0",
  EXPO_OFFLINE: "1",
  EXPO_NO_DEPENDENCY_VALIDATION: "1"
};

const result = spawnSync("npx", ["expo", "export", "--platform", "web"], {
  stdio: "inherit",
  env,
  shell: process.platform === "win32"
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
