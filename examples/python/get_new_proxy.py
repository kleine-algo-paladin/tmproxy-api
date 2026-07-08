"""
TMProxy API — ví dụ Python / Python example.

Chạy / Run:
    export TMPROXY_API_KEY="your_api_key"   # PowerShell: $env:TMPROXY_API_KEY="..."
    pip install requests
    python get_new_proxy.py

Luồng: /stats -> /get-new-proxy -> kiểm chứng IP qua proxy.
Flow:  /stats -> /get-new-proxy -> verify IP through the proxy.
"""

import os
import sys
import requests

# Đảm bảo in được tiếng Việt/UTF-8 trên console Windows (cp1252).
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

BASE_URL = "https://tmproxy.com/api/proxy"
API_KEY = os.environ.get("TMPROXY_API_KEY")


def call(endpoint: str, payload: dict) -> dict:
    """Gọi một endpoint và trả về JSON, kèm kiểm tra lỗi `code`."""
    resp = requests.post(f"{BASE_URL}/{endpoint}",
                         json=payload, timeout=30)
    resp.raise_for_status()
    body = resp.json()
    if body.get("code") != 0:
        raise RuntimeError(
            f"[{endpoint}] code={body.get('code')} message={body.get('message')!r}"
        )
    return body.get("data", {})


def main() -> None:
    if not API_KEY:
        sys.exit("Thiếu biến môi trường TMPROXY_API_KEY / Missing TMPROXY_API_KEY")

    # 1) Kiểm tra key & xem hạn mức
    stats = call("stats", {"api_key": API_KEY})
    print(f"Plan: {stats.get('plan')} | het han: {stats.get('expired_at')} "
          f"| da dung hom nay: {stats.get('ip_used_today')}/{stats.get('max_ip_per_day')}")

    # 2) Xin proxy mới (0/0 = ngau nhien)
    proxy = call("get-new-proxy",
                 {"api_key": API_KEY, "id_location": 0, "id_isp": 0})
    print(f"Proxy: {proxy['https']} ({proxy['location_name']}/{proxy['isp_name']}) "
          f"public_ip={proxy['public_ip']} next_request={proxy['next_request']}s")

    # 3) Kiem chung: goi ipify qua proxy
    proxy_url = f"http://{proxy['username']}:{proxy['password']}@{proxy['https']}"
    seen_ip = requests.get("https://api.ipify.org",
                           proxies={"http": proxy_url, "https": proxy_url},
                           timeout=30).text
    ok = seen_ip == proxy["public_ip"]
    print(f"IP qua proxy: {seen_ip} -> {'[OK]' if ok else '[KHONG KHOP]'}")

    # 4) Neu muon doi IP tiep, phai cho next_request giay:
    #    import time; time.sleep(proxy["next_request"] + 2)


if __name__ == "__main__":
    main()
