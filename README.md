# FluxGuard

A production-style API rate limiter built with FastAPI and Redis (Sliding Window algorithm).

## How it works

Every incoming request goes through middleware that checks a Redis sorted set:
1. Remove timestamps older than 60 seconds
2. Count how many remain — if ≥ 10, reject with `429 Too Many Requests`
3. Otherwise add the current timestamp and allow the request

Returns standard headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`

## Run locally

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Open `http://localhost:8000` → live dashboard

## Test it

```bash
python stress_test.py
```

Sends 15 requests — first 10 pass, last 5 are blocked with 429.

## File structure

```
FluxGuard/
├── main.py          → FastAPI app + middleware + routes
├── limiter.py       → Sliding window logic (Redis/fakeredis)
├── dashboard.html   → Live monitoring UI
├── stress_test.py   → Test script to trigger rate limits
└── requirements.txt
```

## Algorithms comparison

| Algorithm | Pros | Cons |
|---|---|---|
| Fixed Window | Simple | Burst at window boundary |
| Token Bucket | Allows bursts | State harder to manage |
| **Sliding Window** ← (this project) | **No boundary burst, fair** | Slightly more memory |

## Stack

- Python · FastAPI · fakeredis (swap with real Redis for production)
