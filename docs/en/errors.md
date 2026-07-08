# Error handling

[← Home](../../README.md) · [Quickstart](quickstart.md) · [Concepts](concepts.md) · [API Reference](reference.md)

## How to detect errors

Every response has a `code` field:

- `code: 0` → **success**.
- Non-zero `code` → **error**. Read `message` for the reason (Vietnamese). On error, `data` fields are usually empty.

Example of a real error response:

```json
{
  "code": 5,
  "message": "retry after 239 second(s)",
  "data": { "https": "", "socks5": "", "public_ip": "" }
}
```

---

## Error code table (verified in practice)

| `code` | `message` (example) | Meaning | Fix |
|:------:|---------------------|---------|-----|
| `0` | `""` | Success | — |
| `5` | `retry after 239 second(s)` | Called `/get-new-proxy` too soon | Wait the seconds in `message` (or `next_request`), then retry |
| `27` | `Hiện không có proxy trên api này` | No proxy has been created on this `api_key` yet | Call `/get-new-proxy` first |

> ℹ️ TMProxy does not publish a full list of error codes. This table lists codes **observed in real testing**. If you hit a different code, read `message` — it usually describes the cause clearly. Feel free to open an issue to extend this table.

---

## Common situations

### 1. "retry after N second(s)" (`code: 5`)

The most common error. You're trying to rotate faster than allowed.

**Correct handling:** after each successful `/get-new-proxy`, store `next_request` and wait that many seconds (add 1–2 for safety) before the next call.

```python
import time
# ... call get-new-proxy, get data ...
time.sleep(data["next_request"] + 2)
# now it's safe to call again
```

### 2. "No proxy on this api" (`code: 27`)

Happens when calling `/get-current-proxy` before any proxy exists. Call `/get-new-proxy` first.

### 3. Wrong or expired `api_key`

If the `api_key` is wrong or the plan expired, the API returns a non-zero `code` with a descriptive `message`. Double-check the key and use `/stats` to see `expired_at`.

### 4. Daily rotation limit reached

If your plan has a limit (`max_ip_per_day > 0`) and `ip_used_today` reached it, you can't get a new IP until the next day. Use `/stats` to monitor.

---

## Defensive coding tips

- **Always check `code`** before reading `data`.
- **Respect `next_request`** to avoid `code: 5`.
- **Never hard-code** wait times — always read them from the response.
- **Log `message`** whenever `code != 0` for easier debugging.
- **Retry with backoff**, don't hammer the endpoint.

See [examples/](../../examples/) for samples with error handling built in.
