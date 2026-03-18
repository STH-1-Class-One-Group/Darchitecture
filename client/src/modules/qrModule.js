export function isSafeQrDomain(url) {
  try {
    const parsed = new URL(url);
    return ["tashu.kr", "daejeon.go.kr"].includes(parsed.hostname);
  } catch (error) {
    return false;
  }
}
