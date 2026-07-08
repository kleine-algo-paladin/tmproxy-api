# TMProxy API — Tài liệu / Documentation

> Tài liệu song ngữ, dễ hiểu cho **TMProxy API** — dịch vụ proxy xoay IP (rotating proxy) tại Việt Nam.
> Bilingual, beginner-friendly documentation for the **TMProxy API** — a Vietnamese rotating-proxy service.

🇻🇳 **Tiếng Việt** · 🇬🇧 [English below ↓](#-english)

---

## 🇻🇳 Tiếng Việt

TMProxy cung cấp API để **lấy proxy mới, xem proxy hiện tại, xem thống kê** và cấu hình theo tỉnh/nhà mạng. Tài liệu này giải thích từng endpoint kèm ví dụ, và **giải thích dễ hiểu** cách proxy xoay IP hoạt động.

### Thông tin cơ bản

| Mục | Giá trị |
|-----|---------|
| **Base URL** | `https://tmproxy.com/api/proxy/` |
| **Phương thức** | `POST` (tất cả endpoint) |
| **Content-Type** | `application/json` |
| **Xác thực** | Truyền `api_key` trong body JSON |
| **Định dạng trả về** | JSON `{ code, message, data }` — `code: 0` là thành công |

### Bắt đầu từ đâu?

1. 📘 **[Bắt đầu nhanh (Quickstart)](docs/vi/quickstart.md)** — lấy proxy đầu tiên trong 5 phút
2. 💡 **[Khái niệm & giải thích dễ hiểu](docs/vi/concepts.md)** — proxy xoay IP là gì, `timeout` / `next_request` / `expired_at` nghĩa là gì
3. 📖 **[Tham chiếu API đầy đủ](docs/vi/reference.md)** — chi tiết 6 endpoint
4. ⚠️ **[Xử lý lỗi](docs/vi/errors.md)** — mã lỗi và cách khắc phục
5. 💻 **[Code mẫu](examples/)** — Python, Node.js, cURL chạy được ngay

### Tổng quan 6 endpoint

| Endpoint | Chức năng |
|----------|-----------|
| `POST /location` | Lấy danh sách tỉnh/vị trí có thể chọn |
| `POST /isp` | Lấy danh sách nhà mạng (ISP) |
| `POST /get-new-proxy` | Xin một proxy **mới** (đổi IP) |
| `POST /get-current-proxy` | Xem proxy **đang dùng** hiện tại |
| `POST /stats` | Xem thông tin gói & thống kê của `api_key` |
| `POST /note` | Ghi chú (đặt tên) cho `api_key` |

📚 **Tài liệu API gốc:** [docs.tmproxy.com/tmproxy-apis](https://docs.tmproxy.com/tmproxy-apis/) · 🌐 **Trang chủ:** [tmproxy.com](https://tmproxy.com)

---

## 🇬🇧 English

TMProxy provides an API to **request a new proxy, view the current proxy, read usage stats**, and configure by province/ISP. This documentation explains every endpoint with examples, plus a **beginner-friendly explanation** of how rotating proxies work.

### Basics

| Item | Value |
|------|-------|
| **Base URL** | `https://tmproxy.com/api/proxy/` |
| **Method** | `POST` (all endpoints) |
| **Content-Type** | `application/json` |
| **Authentication** | Pass your `api_key` in the JSON body |
| **Response format** | JSON `{ code, message, data }` — `code: 0` means success |

### Where to start

1. 📘 **[Quickstart](docs/en/quickstart.md)** — get your first proxy in 5 minutes
2. 💡 **[Concepts explained simply](docs/en/concepts.md)** — what rotating proxies are, meaning of `timeout` / `next_request` / `expired_at`
3. 📖 **[Full API Reference](docs/en/reference.md)** — all 6 endpoints in detail
4. ⚠️ **[Error handling](docs/en/errors.md)** — error codes and fixes
5. 💻 **[Code examples](examples/)** — ready-to-run Python, Node.js, cURL

### The 6 endpoints at a glance

| Endpoint | Purpose |
|----------|---------|
| `POST /location` | List selectable provinces/locations |
| `POST /isp` | List available ISPs (carriers) |
| `POST /get-new-proxy` | Request a **new** proxy (rotate IP) |
| `POST /get-current-proxy` | View the **currently active** proxy |
| `POST /stats` | View plan info & stats for an `api_key` |
| `POST /note` | Set a note (label) for an `api_key` |

📚 **Official API docs:** [docs.tmproxy.com/tmproxy-apis](https://docs.tmproxy.com/tmproxy-apis/) · 🌐 **Website:** [tmproxy.com](https://tmproxy.com)

---

## ⚠️ Bảo mật / Security

- **KHÔNG** commit `api_key` thật vào Git. Dùng biến môi trường (`.env`) — xem `.gitignore`.
- **DO NOT** commit your real `api_key`. Use environment variables (`.env`) — see `.gitignore`.

## License

Tài liệu cộng đồng, không phải tài liệu chính thức của TMProxy / Community docs, not officially affiliated with TMProxy. MIT for the docs/code in this repo.
