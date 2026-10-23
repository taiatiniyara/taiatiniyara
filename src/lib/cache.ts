// Edge cache for public HTML. Cache API entries are per data centre, so "purge" only clears the
// colo that served the save; everywhere else a page is at most TTL seconds stale.
// ponytail: upgrade to zone purge-by-URL (API token + zone id) if 60 s staleness ever matters.
export const TTL = 60;

export const purge = (origin: string, paths: string[]) =>
  Promise.all(paths.map((p) => caches.default.delete(new Request(origin + p))));
