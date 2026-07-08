# Quickstart

[← Home](../../README.md) · [Concepts](concepts.md) · [API Reference](reference.md) · [Errors](errors.md)

This guide gets you your **first proxy** and shows you how to route a request through it in a few minutes.

---

## Step 0 — Prerequisites

You need:

1. A TMProxy account and an **`api_key`** (from the TMProxy dashboard).
2. An HTTP client: `curl`, Postman, or Python/Node.js.

> 🔒 **Never paste your `api_key` into publicly shared code.** Keep it in an environment variable.

---

## Step 1 — Verify your `api_key` with `/stats`

Fastest way to confirm the key is valid and inspect your plan:

```bash
curl -X POST https://tmproxy.com/api/proxy/stats \
  -H "Content-Type: application/json" \
  -d '{"api_key": "YOUR_API_KEY"}'
```

If it returns `"code": 0`, the key is valid. You'll see `max_ip_per_day`, `ip_used_today`, `expired_at`, and more.

---

## Step 2 — Request a new proxy with `/get-new-proxy`

```bash
curl -X POST https://tmproxy.com/api/proxy/get-new-proxy \
  -H "Content-Type: application/json" \
  -d '{"api_key": "YOUR_API_KEY", "id_location": 0, "id_isp": 0}'
```

- `id_location: 0` and `id_isp: 0` mean **random** (let the system choose). To target a specific one, see Step 4.

Response (trimmed):

```json
{
  "code": 0,
  "message": "",
  "data": {
    "https": "113.170.177.194:33919",
    "socks5": "113.170.177.194:33919",
    "username": "tmproxyAnTns",
    "password": "u39m0TufKi",
    "public_ip": "113.170.177.194",
    "timeout": 3600,
    "next_request": 239,
    "expired_at": "12:30:17 08/07/2026"
  }
}
```

Save `https` (or `socks5`), `username`, and `password` — that's your proxy.

---

## Step 3 — Route a request through the proxy

```bash
curl -x http://tmproxyAnTns:u39m0TufKi@113.170.177.194:33919 https://api.ipify.org
```

If it returns the `public_ip` from above, your traffic went through the proxy. 🎉

> ⏱️ Want a **different IP**? Wait at least `next_request` seconds, then call `/get-new-proxy` again. See [Concepts](concepts.md) for why the wait exists.

---

## Step 4 — (Optional) Pick a specific province & ISP

List locations and ISPs:

```bash
curl -X POST https://tmproxy.com/api/proxy/location -H "Content-Type: application/json" -d '{}'
curl -X POST https://tmproxy.com/api/proxy/isp      -H "Content-Type: application/json" -d '{}'
```

Then pass the desired `id_location` and `id_isp`:

```bash
curl -X POST https://tmproxy.com/api/proxy/get-new-proxy \
  -H "Content-Type: application/json" \
  -d '{"api_key": "YOUR_API_KEY", "id_location": 9, "id_isp": 1}'
```

---

## Next

- Go deeper: **[Concepts explained simply](concepts.md)**
- Every parameter: **[API Reference](reference.md)**
- Hit an error? **[Error handling](errors.md)**
- Python/Node.js samples: **[examples/](../../examples/)**
