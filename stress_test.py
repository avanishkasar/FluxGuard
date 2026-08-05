import requests
import time

BASE = "http://localhost:8000"

print("FluxGuard Stress Test")
print(f"Sending 15 requests to /api/search (limit is 10 per 60s)\n")

for i in range(1, 16):
    res = requests.get(f"{BASE}/api/search?q=test")
    remaining = res.headers.get("X-RateLimit-Remaining", "N/A")
    status = "✅ OK" if res.status_code == 200 else "❌ BLOCKED (429)"
    print(f"Request {i:02d} → {res.status_code} | Remaining: {remaining} | {status}")
    time.sleep(0.1)

print("\nDone. Check the dashboard at http://localhost:8000")
