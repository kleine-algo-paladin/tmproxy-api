# Concepts explained simply

[← Home](../../README.md) · [Quickstart](quickstart.md) · [API Reference](reference.md) · [Errors](errors.md)

This page explains **in plain language** what a rotating proxy is and what the numbers you get back mean, so you use the API correctly.

---

## 1. What is a rotating proxy?

Think of a proxy as a **middleman**: instead of accessing a website directly, you ask the proxy to do it for you. The website only sees the **proxy's IP** (`public_ip`), not your real IP.

TMProxy is a **rotating** proxy: after a period of time, or when you call `/get-new-proxy`, the public IP **changes to a different one**. Useful when you need many different IPs (scraping, testing, managing multiple accounts, etc.).

```
You ──▶ Proxy (public_ip = 113.170.177.194) ──▶ Website
        (IP changes after timeout or when you request a new proxy)
```

---

## 2. Two connection types: `https` and `socks5`

Each proxy returns two `host:port` addresses:

- **`https`** — HTTP/HTTPS proxy, works with most browsers, HTTP libraries, and `curl -x`.
- **`socks5`** — SOCKS5 proxy, more flexible (any TCP traffic; some software requires SOCKS5).

Authenticate with **`username`** and **`password`**. Full form: `http://username:password@host:port`.

> There is also **`ip_allow`**: if your account uses IP whitelisting, this is the IP allowed to connect **without** username/password.

---

## 3. `timeout` — how long does a proxy live?

`timeout` is the **number of seconds** a proxy exists before the system rotates its IP.

- `timeout: 3600` → the proxy keeps its IP for 1 hour.
- **`timeout: 0`** → **lifetime** proxy; the IP won't rotate until you request a new one.

---

## 4. `next_request` — why wait between rotations?

`next_request` is the **minimum number of seconds** you must wait before calling `/get-new-proxy` again.

It's an **anti-spam** mechanism. If you call `/get-new-proxy` too early, the API **rejects** it with `code: 5` ("retry after N second(s)").

**Golden rule:** after each proxy request, read `next_request` and wait exactly that long (add 1–2 seconds for safety) before requesting again.

```
get-new-proxy ──▶ next_request = 239
   │
   └── wait >= 239s ──▶ get-new-proxy (allowed) ──▶ new IP
```

> `base_next_request` in `/stats` is the base value for your plan.

---

## 5. `expired_at` — expiry time

- In a proxy response: `expired_at` is when the **current proxy** expires.
- In `/stats`: `expired_at` is the expiry of the **whole plan / `api_key`**.

The format is **`HH:mm:ss dd/mm/yyyy`** (Vietnam time), e.g. `12:30:17 08/07/2026` means 12:30:17 on 8 July 2026.

---

## 6. Daily quota: `max_ip_per_day` and `ip_used_today`

From `/stats`:

- **`max_ip_per_day`** — max IP rotations **per day** for your plan (`0` = no per-count limit).
- **`ip_used_today`** — rotations you've used **today**.

When `ip_used_today` reaches `max_ip_per_day`, you can't get a new IP until the next day. Use `/stats` to monitor.

---

## 7. `id_location` and `id_isp` — pick province & ISP

- **`id_location`** — location/province code, from [`/location`](reference.md#1-location--locations-list).
- **`id_isp`** — ISP code, from [`/isp`](reference.md#2-isp--isp-list).
- Set both to **`0`** (or `id_location: 1` = Random) to let the system **choose randomly** (usually most IPs, fastest).

Some locations show "Thread: Moderate/High/Very High" — roughly the **IP availability** at that location.

---

## 8. Typical usage flow

```
1. /stats            → check the key is valid and has rotations left
2. /location, /isp   → (optional) pick province & ISP
3. /get-new-proxy    → get a proxy + read next_request, timeout
4. Send requests through the proxy
5. Wait >= next_request seconds
6. Repeat step 3 when you need a new IP
```

---

Ready for parameter details? → **[Full API Reference](reference.md)**
