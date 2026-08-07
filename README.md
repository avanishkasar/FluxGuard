# FluxGuard

A robust API rate limiter built using the **Sliding Window algorithm** with Redis. 

I built this project specifically to test my system design skills and deeply understand how distributed systems handle traffic spikes, prevent abuse, and manage state efficiently. 

## The Architecture
- **Algorithm:** Sliding Window (Atomic Lua scripts prevent race conditions)
- **Backend:** FastAPI + Redis (fakeredis for local testing)
- **Frontend:** React + Tailwind (Note: The UI design is sourced for presentability, but the core system design, architecture, and logic are entirely my own work).

## How it works
1. Extracts client IP.
2. Removes requests older than the 60-second window.
3. Checks if the remaining requests exceed the limit (10).
4. If exceeded, returns `429 Too Many Requests`. Otherwise, logs the request.

## Run Locally
```bash
# Start backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Stress Test
```bash
python stress_test.py
```
*Screenshots of the system blocking traffic will be added here.*
