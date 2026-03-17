const safeDomains = ['tashu.or.kr', 'tashu.go.kr', 'daejeon.go.kr'];

export function isSafeQrUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return safeDomains.some((domain) => url.hostname.includes(domain));
  } catch (error) {
    return false;
  }
}