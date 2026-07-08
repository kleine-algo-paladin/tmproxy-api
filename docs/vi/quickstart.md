# Bắt đầu nhanh (Quickstart)

[← Về trang chủ](../../README.md) · [Khái niệm](concepts.md) · [Tham chiếu API](reference.md) · [Xử lý lỗi](errors.md)

Hướng dẫn này giúp bạn lấy **proxy đầu tiên** và dùng nó để gửi request chỉ trong vài phút.

---

## Bước 0 — Chuẩn bị

Bạn cần:

1. Một tài khoản TMProxy và một **`api_key`** (mua/lấy tại trang quản lý TMProxy).
2. Công cụ gửi HTTP: `curl`, Postman, hoặc code Python/Node.js.

> 🔒 **Đừng dán `api_key` thẳng vào code chia sẻ công khai.** Hãy để trong biến môi trường.

---

## Bước 1 — Kiểm tra `api_key` bằng endpoint `/stats`

Đây là cách nhanh nhất để xác nhận `api_key` hợp lệ và xem gói của bạn:

```bash
curl -X POST https://tmproxy.com/api/proxy/stats \
  -H "Content-Type: application/json" \
  -d '{"api_key": "API_KEY_CUA_BAN"}'
```

Nếu trả về `"code": 0`, key hợp lệ. Bạn sẽ thấy `max_ip_per_day` (số IP đổi được mỗi ngày), `ip_used_today`, `expired_at` (hạn dùng)...

---

## Bước 2 — Xin một proxy mới bằng `/get-new-proxy`

```bash
curl -X POST https://tmproxy.com/api/proxy/get-new-proxy \
  -H "Content-Type: application/json" \
  -d '{"api_key": "API_KEY_CUA_BAN", "id_location": 0, "id_isp": 0}'
```

- `id_location: 0` và `id_isp: 0` nghĩa là **ngẫu nhiên** (để hệ thống tự chọn). Muốn chọn cụ thể, xem Bước 4.

Kết quả (rút gọn):

```json
{
  "code": 0,
  "message": "",
  "data": {
    "https": "123.45.67.89:12345",
    "socks5": "123.45.67.89:12346",
    "username": "user123",
    "password": "pass123",
    "public_ip": "123.45.67.89",
    "timeout": 3600,
    "next_request": 239,
    "expired_at": "12:30:17 08/07/2026"
  }
}
```

Ghi lại `https` (hoặc `socks5`), `username`, `password` — đó là proxy của bạn.

---

## Bước 3 — Dùng proxy để gửi request

Dùng proxy HTTPS vừa nhận để truy cập internet qua IP của proxy:

```bash
curl -x http://user123:pass123@123.45.67.89:12345 https://api.ipify.org
```

Nếu thấy trả về đúng `public_ip` ở trên, tức là bạn đã đi qua proxy thành công. 🎉

> ⏱️ Muốn **đổi sang IP khác**? Chờ ít nhất `next_request` giây rồi gọi lại `/get-new-proxy`. Xem [Khái niệm](concepts.md) để hiểu vì sao phải chờ.

---

## Bước 4 — (Tuỳ chọn) Chọn tỉnh & nhà mạng cụ thể

Lấy danh sách vị trí và nhà mạng:

```bash
curl -X POST https://tmproxy.com/api/proxy/location -H "Content-Type: application/json" -d '{}'
curl -X POST https://tmproxy.com/api/proxy/isp      -H "Content-Type: application/json" -d '{}'
```

Rồi truyền `id_location` và `id_isp` mong muốn vào `/get-new-proxy`:

```bash
curl -X POST https://tmproxy.com/api/proxy/get-new-proxy \
  -H "Content-Type: application/json" \
  -d '{"api_key": "API_KEY_CUA_BAN", "id_location": 2, "id_isp": 1}'
```

---

## Tiếp theo

- Hiểu sâu hơn: **[Khái niệm & giải thích dễ hiểu](concepts.md)**
- Chi tiết mọi tham số: **[Tham chiếu API](reference.md)**
- Gặp lỗi? **[Xử lý lỗi](errors.md)**
- Code mẫu Python/Node.js: **[examples/](../../examples/)**
