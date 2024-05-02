export class InMemoryCache<T = never> {
  private cache: Map<string, { value: T; expiresAt: number }>;
  private ttl: number;

  constructor(options: { ttl: number }) {
    this.cache = new Map();
    this.ttl = options.ttl;
  }

  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, { expiresAt: expireAt }] of this.cache.entries()) {
      if (now > expireAt) {
        this.cache.delete(key);
      }
    }
  }

  set(key: string, value: T): void {
    this.cleanExpiredCache();

    const expiresAt = Date.now() + this.ttl;
    this.cache.set(key, { value, expiresAt });
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;

    const now = Date.now();
    if (now > item.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }
}
