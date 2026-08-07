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

## Screenshots

### 1. Landing Interface (Dashboard)
The landing section features a minimalist, pixel-perfect design to provide a clean and professional introduction to the project.
![Landing Interface](https://github.com/avanishkasar/FluxGuard/blob/master/flux1.png?raw=true)

### 2. Live Rate Limiter Visualization (Result Dashboard)
A real-time dashboard displaying active IP addresses, their current request count within the 60-second window, and their current rate-limit status.
![Live Traffic Visualization](https://github.com/avanishkasar/FluxGuard/blob/master/flux2.png?raw=true)
