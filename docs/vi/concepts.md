# Khái niệm & giải thích dễ hiểu

[← Về trang chủ](../../README.md) · [Quickstart](quickstart.md) · [Tham chiếu API](reference.md) · [Xử lý lỗi](errors.md)

Trang này giải thích **bằng ngôn ngữ đời thường** proxy xoay IP là gì và ý nghĩa các con số bạn nhận về, để bạn dùng API đúng cách.

---

## 1. Proxy xoay IP (rotating proxy) là gì?

Hãy tưởng tượng proxy như một **người trung gian**: thay vì bạn trực tiếp truy cập website, bạn nhờ proxy truy cập hộ. Website sẽ chỉ thấy **IP của proxy** (`public_ip`), không thấy IP thật của bạn.

TMProxy là proxy **xoay (rotating)**: sau một khoảng thời gian, hoặc khi bạn chủ động gọi `/get-new-proxy`, IP công khai sẽ **đổi sang một IP khác**. Rất hữu ích khi bạn cần nhiều IP khác nhau (thu thập dữ liệu, kiểm thử, quản lý nhiều tài khoản...).

```
Bạn ──▶ Proxy (public_ip = 123.45.67.89) ──▶ Website
        (đổi IP sau timeout hoặc khi bạn xin proxy mới)
```

---

## 2. Hai cách kết nối: `https` và `socks5`

Mỗi proxy trả về 2 địa chỉ dạng `host:port`:

- **`https`** — proxy HTTP/HTTPS, phù hợp cho hầu hết trình duyệt, thư viện HTTP, `curl -x`.
- **`socks5`** — proxy SOCKS5, linh hoạt hơn (hỗ trợ mọi loại traffic TCP, một số phần mềm bắt buộc dùng SOCKS5).

Dùng kèm **`username`** và **`password`** để xác thực. Ví dụ định dạng đầy đủ: `http://username:password@host:port`.

> Ngoài ra còn có **`ip_allow`**: nếu tài khoản bạn cấu hình theo kiểu "cho phép IP" (IP whitelist), đây là IP được phép kết nối proxy mà **không cần** username/password.

---

## 3. `timeout` — proxy sống được bao lâu?

`timeout` là **số giây** một proxy tồn tại trước khi hệ thống tự đổi IP.

- Ví dụ `timeout: 600` → proxy giữ nguyên IP trong 10 phút.
- **`timeout: 0`** → proxy **vĩnh viễn (lifetime)**, IP không tự đổi cho tới khi bạn chủ động xin proxy mới.

---

## 4. `next_request` — vì sao phải chờ giữa 2 lần đổi IP?

`next_request` là **số giây tối thiểu** bạn phải chờ trước khi được phép gọi `/get-new-proxy` lần kế tiếp.

Đây là cơ chế **chống spam đổi IP**. Nếu bạn gọi `/get-new-proxy` quá sớm (chưa đủ `next_request` giây), API sẽ **từ chối** và yêu cầu chờ thêm.

**Quy tắc vàng:** sau mỗi lần lấy proxy, đọc giá trị `next_request` và đặt hẹn giờ chờ đúng bằng đó (thường cộng thêm 1–2 giây cho chắc) rồi mới xin proxy mới.

```
get-new-proxy ──▶ nhận next_request = 60
   │
   └── chờ >= 60 giây ──▶ get-new-proxy (được phép) ──▶ nhận IP mới
```

> `base_next_request` trong `/stats` là giá trị cơ bản theo gói của bạn.

---

## 5. `expired_at` — hạn dùng

- Trong kết quả proxy: `expired_at` là thời điểm **proxy hiện tại** hết hiệu lực.
- Trong `/stats`: `expired_at` là hạn dùng của **cả gói / `api_key`**.

Định dạng thời gian là **`HH:mm:ss dd/mm/yyyy`** (giờ Việt Nam), ví dụ `12:30:17 08/07/2026` nghĩa là 12 giờ 30 phút ngày 08/07/2026.

---

## 6. Hạn mức mỗi ngày: `max_ip_per_day` và `ip_used_today`

Xem trong `/stats`:

- **`max_ip_per_day`** — số lần đổi IP tối đa **trong một ngày** theo gói.
- **`ip_used_today`** — số lần bạn đã đổi IP **hôm nay**.

Khi `ip_used_today` chạm `max_ip_per_day`, bạn không thể xin thêm IP mới cho tới khi sang ngày mới. Hãy dùng `/stats` để theo dõi và tránh bị gián đoạn.

---

## 7. `id_location` và `id_isp` — chọn tỉnh & nhà mạng

- **`id_location`** — mã tỉnh/vị trí, lấy từ endpoint [`/location`](reference.md#1-location--danh-sách-vị-trí).
- **`id_isp`** — mã nhà mạng, lấy từ endpoint [`/isp`](reference.md#2-isp--danh-sách-nhà-mạng).
- Đặt **`0`** cho cả hai để hệ thống **chọn ngẫu nhiên** (thường có nhiều IP nhất, nhanh nhất).

Một số vị trí ghi kèm "Thread: High/Low" — đại khái là **số lượng IP sẵn có** ở vị trí đó nhiều hay ít.

---

## 8. Luồng dùng điển hình

```
1. /stats            → kiểm tra key còn hạn, còn lượt đổi IP không
2. /location, /isp   → (tuỳ chọn) chọn tỉnh & nhà mạng
3. /get-new-proxy    → nhận proxy + đọc next_request, timeout
4. Dùng proxy gửi request
5. Chờ >= next_request giây
6. Lặp lại bước 3 khi cần IP mới
```

---

Sẵn sàng xem chi tiết từng tham số? → **[Tham chiếu API đầy đủ](reference.md)**
