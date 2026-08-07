from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from limiter import is_allowed, get_stats, reset_ip

app = FastAPI(title="FluxGuard - Rate Limiter")


app.mount("/assets", StaticFiles(directory="assets"), name="assets")

# --- Middleware ---
# Runs before every single request. Checks if the IP is allowed.
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    ip = request.client.host

    # Skip rate limiting for the dashboard and stats endpoints
    if request.url.path in ["/", "/stats"] or request.url.path.startswith("/reset") or request.url.path.startswith("/assets"):
        return await call_next(request)

    allowed, remaining = is_allowed(ip)

    if not allowed:
        return JSONResponse(
            status_code=429,
            content={"error": "Rate limit exceeded. Try again in 60 seconds."},
            headers={
                "X-RateLimit-Limit": "10",
                "X-RateLimit-Remaining": "0",
                "Retry-After": "60",
            },
        )

    response = await call_next(request)
    response.headers["X-RateLimit-Limit"] = "10"
    response.headers["X-RateLimit-Remaining"] = str(remaining)
    return response


# --- Dashboard ---
@app.get("/", response_class=HTMLResponse)
async def dashboard():
    with open("index.html") as f:
        return f.read()


# --- Stats API (used by dashboard to refresh data) ---
@app.get("/stats")
async def stats():
    return get_stats()


# --- Reset a specific IP (for testing) ---
@app.post("/reset/{ip}")
async def reset(ip: str):
    reset_ip(ip)
    return {"message": f"Reset rate limit for {ip}"}


# --- Sample API endpoints to test the rate limiter ---
@app.get("/api/search")
async def search(q: str = ""):
    return {"query": q, "results": ["result_1", "result_2", "result_3"]}


@app.get("/api/data")
async def data():
    return {"message": "Here is your data", "status": "ok"}
