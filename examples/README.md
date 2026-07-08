# Code mẫu / Code examples

Các ví dụ chạy được cho TMProxy API. **Đặt `api_key` qua biến môi trường**, đừng ghi thẳng vào file.

```bash
# Linux / macOS
export TMPROXY_API_KEY="your_api_key"
# Windows PowerShell
$env:TMPROXY_API_KEY = "your_api_key"
```

| Ngôn ngữ | File | Chạy |
|----------|------|------|
| Python   | [`python/get_new_proxy.py`](python/get_new_proxy.py) | `python python/get_new_proxy.py` |
| Node.js  | [`nodejs/get_new_proxy.js`](nodejs/get_new_proxy.js) | `node nodejs/get_new_proxy.js` |
| cURL     | [`curl/examples.sh`](curl/examples.sh) | `bash curl/examples.sh` |

Mỗi ví dụ: gọi `/stats` → `/get-new-proxy` → kiểm chứng proxy bằng cách gọi `api.ipify.org` qua proxy, có xử lý lỗi `code != 0` và tôn trọng `next_request`.
