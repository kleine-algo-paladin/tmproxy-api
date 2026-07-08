# Full API Reference

[← Home](../../README.md) · [Quickstart](quickstart.md) · [Concepts](concepts.md) · [Errors](errors.md)

- **Base URL:** `https://tmproxy.com/api/proxy/`
- **Method:** `POST` for all endpoints
- **Header:** `Content-Type: application/json`
- **Auth:** pass `api_key` in the body

Every response shares this shape:

```json
{ "code": 0, "message": "", "data": { } }
```

- `code` = `0`: success. Non-zero: error (see [Errors](errors.md)).
- `message`: human-readable description (Vietnamese) on error.
- `data`: the payload.

> 💡 The examples below are **real, verified responses** captured with a test `api_key`.

---

## 1. `/location` — Locations list

List selectable provinces/locations for requesting a proxy.

**Request**

```json
{}
```

**Response (real, trimmed)**

```json
{
  "code": 0,
  "message": "",
  "data": {
    "locations": [
      { "id_location": 1,  "name": "1. Random" },
      { "id_location": 9,  "name": "9. TP Ho Chi Minh (Thread: Very High)" },
      { "id_location": 10, "name": "10. Ha Noi (Thread: High)" },
      { "id_location": 14, "name": "14. Tay Ninh (Thread: High)" }
    ]
  }
}
```

| Field | Type | Meaning |
|-------|------|---------|
| `id_location` | int | Location code, used in `/get-new-proxy` |
| `name` | string | Display name. `Thread: Low/Moderate/High/Very High` = IP availability |

> `id_location: 1` (Random) lets the system choose.

---

## 2. `/isp` — ISP list

**Request**

```json
{}
```

**Response (real)**

```json
{
  "code": 0,
  "message": "",
  "data": {
    "list_isp": [
      { "id_isp": 0, "name": "Random" },
      { "id_isp": 1, "name": "Viettel" },
      { "id_isp": 2, "name": "VNPT" }
    ]
  }
}
```

| Field | Type | Meaning |
|-------|------|---------|
| `id_isp` | int | ISP code, used in `/get-new-proxy` |
| `name` | string | ISP name. `id_isp: 0` = random |

---

## 3. `/get-new-proxy` — Request a new proxy (rotate IP)

**Request**

```json
{
  "api_key": "YOUR_API_KEY",
  "id_location": 0,
  "id_isp": 0
}
```

| Param | Type | Required | Meaning |
|-------|------|:--------:|---------|
| `api_key` | string | ✅ | Your API key |
| `id_location` | int | ✅ | Location code (`0` = random) |
| `id_isp` | int | ✅ | ISP code (`0` = random) |

**Response (real)**

```json
{
  "code": 0,
  "message": "",
  "data": {
    "ip_allow": "171.250.164.241",
    "isp_name": "VNPT",
    "location_name": "Tay Ninh",
    "socks5": "113.170.177.194:33919",
    "https": "113.170.177.194:33919",
    "timeout": 3600,
    "next_request": 239,
    "expired_at": "12:30:17 08/07/2026",
    "username": "tmproxyAnTns",
    "password": "u39m0TufKi",
    "public_ip": "113.170.177.194"
  }
}
```

| Field | Type | Meaning |
|-------|------|---------|
| `public_ip` | string | The proxy's public IP (what the target site sees) |
| `https` | string | HTTP/HTTPS proxy address `host:port` |
| `socks5` | string | SOCKS5 proxy address `host:port` |
| `username` | string | Proxy username |
| `password` | string | Proxy password |
| `ip_allow` | string | IP allowed to connect without user/pass (whitelist) |
| `isp_name` | string | Proxy's ISP name |
| `location_name` | string | Proxy's location name |
| `timeout` | int | Seconds the proxy lives before auto-rotating (`0` = lifetime) |
| `next_request` | int | Minimum seconds to wait before requesting a new proxy |
| `expired_at` | string | Proxy expiry, format `HH:mm:ss dd/mm/yyyy` |

> ⚠️ Calling again too early (before `next_request` seconds) returns `code: 5` — "retry after N second(s)".

**Using the proxy you got:**

```bash
# HTTP/HTTPS
curl -x http://tmproxyAnTns:u39m0TufKi@113.170.177.194:33919 https://api.ipify.org
# SOCKS5
curl -x socks5://tmproxyAnTns:u39m0TufKi@113.170.177.194:33919 https://api.ipify.org
```

---

## 4. `/get-current-proxy` — Get current proxy

Returns the **currently active** proxy **without** creating a new IP (does not consume a rotation).

**Request**

```json
{ "api_key": "YOUR_API_KEY" }
```

**Response** — `data` has the same shape as `/get-new-proxy`.

If the api never had a proxy, it returns `code: 27` — "Hiện không có proxy trên api này" (no proxy on this api).

---

## 5. `/stats` — Plan info & statistics

**Request**

```json
{ "api_key": "YOUR_API_KEY" }
```

**Response (real)**

```json
{
  "code": 0,
  "message": "",
  "data": {
    "id_isp": 0,
    "id_location": 1,
    "expired_at": "23:18:04 03/08/2026",
    "plan": "Đổi IP",
    "price_per_day": 8000,
    "timeout": 3600,
    "base_next_request": 240,
    "note": "API KEY",
    "api_key": "xxxxxxxxxxxxxxxx",
    "max_ip_per_day": 0,
    "ip_used_today": 0
  }
}
```

| Field | Type | Meaning |
|-------|------|---------|
| `plan` | string | Plan name |
| `price_per_day` | int | Price per day (VND) |
| `expired_at` | string | `api_key` expiry, format `HH:mm:ss dd/mm/yyyy` |
| `id_location` / `id_isp` | int | Current location/ISP config |
| `timeout` | int | Default proxy lifetime (seconds) |
| `base_next_request` | int | Base wait between rotations (seconds) |
| `max_ip_per_day` | int | Max IP rotations per day (`0` = no per-count limit) |
| `ip_used_today` | int | Rotations used today |
| `note` | string | The `api_key` note (set via `/note`) |

---

## 6. `/note` — Set a note for the api_key

Set/update a label for the `api_key` to manage multiple keys.

**Request**

```json
{
  "api_key": "YOUR_API_KEY",
  "note": "Proxy for project A"
}
```

| Param | Type | Required | Meaning |
|-------|------|:--------:|---------|
| `api_key` | string | ✅ | API key |
| `note` | string | ✅ | Note content |

**Response**

```json
{ "code": 0, "message": "" }
```

---

Got a strange code? → **[Error handling](errors.md)**
