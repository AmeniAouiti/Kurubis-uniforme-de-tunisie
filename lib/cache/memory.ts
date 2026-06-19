type CacheEntry<T> = { data: T; at: number };

const store = new Map<string, CacheEntry<unknown>>();
const TTL_MS = 5 * 60 * 1000;

export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  return entry.data;
}

export function cacheSet<T>(key: string, data: T) {
  store.set(key, { data, at: Date.now() });
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(`cache:${key}`, JSON.stringify({ data, at: Date.now() }));
    } catch {
      /* quota */
    }
  }
}

export function cacheGetSession<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`cache:${key}`);
    if (!raw) return null;
    const { data, at } = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() - at > TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

export function cacheInvalidate(key: string) {
  store.delete(key);
  if (typeof window !== "undefined") sessionStorage.removeItem(`cache:${key}`);
}
