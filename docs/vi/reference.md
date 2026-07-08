# Tham chiếu API đầy đủ

[← Về trang chủ](../../README.md) · [Quickstart](quickstart.md) · [Khái niệm](concepts.md) · [Xử lý lỗi](errors.md)

- **Base URL:** `https://tmproxy.com/api/proxy/`
- **Phương thức:** `POST` cho tất cả endpoint
- **Header:** `Content-Type: application/json`
- **Xác thực:** truyền `api_key` trong body

Mọi phản hồi có dạng chung:

```json
{ "code": 0, "message": "", "data": { } }
```

- `code` = `0`: thành công. Khác `0`: lỗi (xem [Xử lý lỗi](errors.md)).
- `message`: mô tả bằng tiếng Việt khi có lỗi.
- `data`: dữ liệu trả về.

> 💡 Các ví dụ dưới đây là **response thật** đã kiểm chứng bằng `api_key` test.

---

## 1. `/location` — Danh sách vị trí

Lấy danh sách tỉnh/vị trí có thể chọn khi xin proxy.

**Request**

```json
{}
```

**Response (thật, rút gọn)**

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

| Trường | Kiểu | Ý nghĩa |
|--------|------|---------|
| `id_location` | int | Mã vị trí, dùng cho `/get-new-proxy` |
| `name` | string | Tên hiển thị. `Thread: Low/Moderate/High/Very High` = mức độ sẵn có của IP |

> `id_location: 1` (Random) để hệ thống tự chọn.

---

## 2. `/isp` — Danh sách nhà mạng

**Request**

```json
{}
```

**Response (thật)**

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

| Trường | Kiểu | Ý nghĩa |
|--------|------|---------|
| `id_isp` | int | Mã nhà mạng, dùng cho `/get-new-proxy` |
| `name` | string | Tên nhà mạng. `id_isp: 0` = ngẫu nhiên |

---

## 3. `/get-new-proxy` — Xin proxy mới (đổi IP)

**Request**

```json
{
  "api_key": "API_KEY_CUA_BAN",
  "id_location": 0,
  "id_isp": 0
}
```

| Tham số | Kiểu | Bắt buộc | Ý nghĩa |
|---------|------|:--------:|---------|
| `api_key` | string | ✅ | Khoá API của bạn |
| `id_location` | int | ✅ | Mã vị trí (`0` = ngẫu nhiên) |
| `id_isp` | int | ✅ | Mã nhà mạng (`0` = ngẫu nhiên) |

**Response (thật)**

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

| Trường | Kiểu | Ý nghĩa |
|--------|------|---------|
| `public_ip` | string | IP công khai của proxy (website đích nhìn thấy IP này) |
| `https` | string | Địa chỉ proxy HTTP/HTTPS dạng `host:port` |
| `socks5` | string | Địa chỉ proxy SOCKS5 dạng `host:port` |
| `username` | string | Tên đăng nhập proxy |
| `password` | string | Mật khẩu proxy |
| `ip_allow` | string | IP được phép kết nối proxy không cần user/pass (IP whitelist) |
| `isp_name` | string | Tên nhà mạng của proxy |
| `location_name` | string | Tên vị trí của proxy |
| `timeout` | int | Số giây proxy sống trước khi tự đổi IP (`0` = vĩnh viễn) |
| `next_request` | int | Số giây tối thiểu phải chờ trước khi xin proxy mới |
| `expired_at` | string | Thời điểm proxy hết hạn, dạng `HH:mm:ss dd/mm/yyyy` |

> ⚠️ Gọi lại quá sớm (chưa đủ `next_request` giây) sẽ nhận `code: 5` — "retry after N second(s)".

**Cách dùng proxy nhận được:**

```bash
# HTTP/HTTPS
curl -x http://tmproxyAnTns:u39m0TufKi@113.170.177.194:33919 https://api.ipify.org
# SOCKS5
curl -x socks5://tmproxyAnTns:u39m0TufKi@113.170.177.194:33919 https://api.ipify.org
```

---

## 4. `/get-current-proxy` — Xem proxy hiện tại

Trả về proxy **đang dùng** mà **không** tạo IP mới (không tốn lượt đổi IP).

**Request**

```json
{ "api_key": "API_KEY_CUA_BAN" }
```

**Response** — cấu trúc `data` giống hệt `/get-new-proxy`.

Nếu api chưa từng có proxy, trả về `code: 27` — "Hiện không có proxy trên api này".

---

## 5. `/stats` — Thông tin gói & thống kê

**Request**

```json
{ "api_key": "API_KEY_CUA_BAN" }
```

**Response (thật)**

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

| Trường | Kiểu | Ý nghĩa |
|--------|------|---------|
| `plan` | string | Tên gói dịch vụ |
| `price_per_day` | int | Giá mỗi ngày (VND) |
| `expired_at` | string | Hạn dùng của `api_key`, dạng `HH:mm:ss dd/mm/yyyy` |
| `id_location` / `id_isp` | int | Cấu hình vị trí/nhà mạng hiện tại |
| `timeout` | int | Thời gian sống mặc định của proxy (giây) |
| `base_next_request` | int | Khoảng chờ cơ bản giữa 2 lần đổi IP (giây) |
| `max_ip_per_day` | int | Giới hạn số IP đổi mỗi ngày (`0` = không giới hạn theo lượt) |
| `ip_used_today` | int | Số IP đã đổi hôm nay |
| `note` | string | Ghi chú của `api_key` (đặt bằng `/note`) |

---

## 6. `/note` — Ghi chú cho api_key

Đặt/đổi ghi chú (nhãn) cho `api_key` để dễ quản lý nhiều key.

**Request**

```json
{
  "api_key": "API_KEY_CUA_BAN",
  "note": "Proxy cho dự án A"
}
```

| Tham số | Kiểu | Bắt buộc | Ý nghĩa |
|---------|------|:--------:|---------|
| `api_key` | string | ✅ | Khoá API |
| `note` | string | ✅ | Nội dung ghi chú |

**Response**

```json
{ "code": 0, "message": "" }
```

---

Gặp mã lỗi lạ? → **[Xử lý lỗi](errors.md)**
