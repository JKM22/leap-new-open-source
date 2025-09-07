interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private requests = new Map<string, RateLimitEntry>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  checkLimit(clientId: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.requests.get(clientId);

    if (!entry || entry.resetTime <= now) {
      // Reset or create new entry
      const resetTime = now + this.config.windowMs;
      this.requests.set(clientId, { count: 1, resetTime });
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime
      };
    }

    if (entry.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      };
    }

    entry.count++;
    this.requests.set(clientId, entry);

    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime
    };
  }

  cleanup() {
    const now = Date.now();
    for (const [clientId, entry] of this.requests.entries()) {
      if (entry.resetTime <= now) {
        this.requests.delete(clientId);
      }
    }
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10 // 10 requests per minute
});

// Cleanup expired entries every minute
setInterval(() => {
  rateLimiter.cleanup();
}, 60 * 1000);
