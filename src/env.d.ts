/// <reference path="../.astro/types.d.ts" />
// The Workers runtime exposes the zone cache as caches.default; the DOM lib does not know it.
interface CacheStorage {
  default: Cache;
}
