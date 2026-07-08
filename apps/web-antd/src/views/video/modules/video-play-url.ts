export function buildVideoPlayUrl(url?: string, token?: null | string) {
  if (!url || !token) {
    return url || '';
  }
  return `${url}${url.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`;
}
