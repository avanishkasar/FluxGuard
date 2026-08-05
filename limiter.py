import time
import fakeredis

# Using fakeredis so you can run this locally without installing Redis.
# When deploying to production, swap this with:
#   import redis
#   r = redis.Redis(host="localhost", port=6379)
r = fakeredis.FakeRedis()

WINDOW_SECONDS = 60   # Rolling time window
MAX_REQUESTS   = 10   # Max requests per IP per window


def is_allowed(ip: str) -> tuple[bool, int]:
    """
    Sliding window check for a given IP.
    Returns (allowed: bool, remaining: int)
    """
    key = f"ratelimit:{ip}"
    now = int(time.time() * 1000)           # Current time in milliseconds
    window_start = now - WINDOW_SECONDS * 1000

    pipe = r.pipeline()
    pipe.zremrangebyscore(key, 0, window_start)   # Remove expired timestamps
    pipe.zcard(key)                               # Count remaining in window
    pipe.zadd(key, {str(now): now})               # Add current request
    pipe.expire(key, WINDOW_SECONDS)              # Auto-cleanup
    results = pipe.execute()

    count_before_this_request = results[1]

    if count_before_this_request >= MAX_REQUESTS:
        # Remove the timestamp we just added since we're rejecting
        r.zrem(key, str(now))
        return False, 0

    remaining = MAX_REQUESTS - count_before_this_request - 1
    return True, remaining


def get_stats() -> dict:
    """
    Returns current request counts for all tracked IPs.
    Used by the dashboard.
    """
    stats = {}
    now = int(time.time() * 1000)
    window_start = now - WINDOW_SECONDS * 1000

    for key in r.scan_iter("ratelimit:*"):
        ip = key.decode().replace("ratelimit:", "")
        count = r.zcount(key, window_start, now)
        stats[ip] = {
            "requests_in_window": int(count),
            "limit": MAX_REQUESTS,
            "remaining": max(0, MAX_REQUESTS - int(count)),
        }

    return stats


def reset_ip(ip: str):
    """Clears rate limit data for a specific IP. Useful for testing."""
    r.delete(f"ratelimit:{ip}")
