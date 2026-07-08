# Xử lý lỗi

[← Về trang chủ](../../README.md) · [Quickstart](quickstart.md) · [Khái niệm](concepts.md) · [Tham chiếu API](reference.md)

## Cách nhận biết lỗi

Mọi phản hồi đều có trường `code`:

- `code: 0` → **thành công**.
- `code` khác `0` → **lỗi**. Đọc `message` để biết lý do (message bằng tiếng Việt). Khi lỗi, các trường trong `data` thường rỗng.

Ví dụ một phản hồi lỗi thật:

```json
{
  "code": 5,
  "message": "retry after 239 second(s)",
  "data": { "https": "", "socks5": "", "public_ip": "" }
}
```

---

## Bảng mã lỗi (đã kiểm chứng thực tế)

| `code` | `message` (ví dụ) | Ý nghĩa | Cách khắc phục |
|:------:|-------------------|---------|----------------|
| `0` | `""` | Thành công | — |
| `5` | `retry after 239 second(s)` | Gọi `/get-new-proxy` quá sớm, chưa đủ thời gian chờ | Chờ đúng số giây trong `message` (hoặc `next_request`) rồi gọi lại |
| `27` | `Hiện không có proxy trên api này` | Chưa có proxy nào được tạo trên `api_key` này | Gọi `/get-new-proxy` để tạo proxy trước |

> ℹ️ TMProxy không công bố danh sách mã lỗi đầy đủ. Bảng trên là các mã **đã gặp thực tế** khi test. Nếu bạn gặp mã khác, hãy đọc `message` — thường mô tả rõ nguyên nhân. Có thể mở issue để bổ sung vào bảng này.

---

## Các tình huống thường gặp

### 1. "retry after N second(s)" (`code: 5`)

Đây là lỗi phổ biến nhất. Bạn đang cố đổi IP nhanh hơn mức cho phép.

**Cách xử lý đúng:** sau mỗi lần `/get-new-proxy` thành công, lưu lại `next_request` và chờ đủ số giây đó (nên cộng thêm 1–2 giây) trước khi gọi lần kế tiếp.

```python
import time
# ... gọi get-new-proxy, nhận data ...
time.sleep(data["next_request"] + 2)
# giờ mới an toàn gọi lại
```

### 2. "Hiện không có proxy trên api này" (`code: 27`)

Xảy ra khi gọi `/get-current-proxy` nhưng chưa từng tạo proxy. Hãy gọi `/get-new-proxy` trước.

### 3. `api_key` sai hoặc hết hạn

Nếu `api_key` không đúng hoặc gói đã hết hạn, API sẽ trả `code` khác `0` với `message` mô tả. Kiểm tra lại key và dùng `/stats` xem `expired_at`.

### 4. Hết lượt đổi IP trong ngày

Nếu gói có giới hạn (`max_ip_per_day > 0`) và `ip_used_today` đã chạm giới hạn, bạn không thể xin thêm IP mới cho tới hôm sau. Dùng `/stats` để theo dõi.

---

## Mẹo lập trình phòng thủ

- **Luôn kiểm tra `code`** trước khi đọc `data`.
- **Tôn trọng `next_request`** để tránh `code: 5`.
- **Không hard-code** thời gian chờ — luôn đọc từ response.
- **Ghi log `message`** khi `code != 0` để dễ debug.
- **Thử lại có kiểm soát** (retry với backoff) thay vì gọi liên tục.

Xem [examples/](../../examples/) để có code mẫu đã xử lý lỗi sẵn.
