export function createId(prefix) {
  const suffix = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().replace(/-/g, "").slice(0, 12) : `${Date.now()}`;
  return `${prefix}_${suffix}`;
}
