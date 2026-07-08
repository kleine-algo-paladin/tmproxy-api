#!/usr/bin/env bash
# TMProxy API — ví dụ cURL / cURL examples
# Chạy / Run:  export TMPROXY_API_KEY="your_api_key"; bash examples.sh
set -euo pipefail

BASE="https://tmproxy.com/api/proxy"
KEY="${TMPROXY_API_KEY:?Thiếu TMPROXY_API_KEY / Missing TMPROXY_API_KEY}"

echo "===== /stats — kiểm tra key ====="
curl -s -X POST "$BASE/stats" \
  -H "Content-Type: application/json" \
  -d "{\"api_key\":\"$KEY\"}"
echo -e "\n"

echo "===== /location — danh sách vị trí ====="
curl -s -X POST "$BASE/location" -H "Content-Type: application/json" -d '{}'
echo -e "\n"

echo "===== /isp — danh sách nhà mạng ====="
curl -s -X POST "$BASE/isp" -H "Content-Type: application/json" -d '{}'
echo -e "\n"

echo "===== /get-new-proxy — xin proxy mới (ngẫu nhiên) ====="
# Lưu response để lấy thông tin proxy (cần jq: sudo apt install jq)
RESP=$(curl -s -X POST "$BASE/get-new-proxy" \
  -H "Content-Type: application/json" \
  -d "{\"api_key\":\"$KEY\",\"id_location\":0,\"id_isp\":0}")
echo "$RESP"
echo -e "\n"

# Trích giá trị từ JSON — ưu tiên jq, không có thì fallback grep/sed (không cần cài gì).
get_str() { # $1=json $2=key
  if command -v jq >/dev/null 2>&1; then
    echo "$1" | jq -r ".data.$2"
  else
    echo "$1" | grep -oE "\"$2\":\"[^\"]*\"" | head -1 | sed -E "s/.*:\"([^\"]*)\"/\1/"
  fi
}
CODE=$(echo "$RESP" | grep -oE '"code":[0-9]+' | head -1 | grep -oE '[0-9]+')
if [ "$CODE" = "0" ]; then
  HTTPS=$(get_str "$RESP" https)
  USER=$(get_str "$RESP" username)
  PASS=$(get_str "$RESP" password)
  PUBIP=$(get_str "$RESP" public_ip)
  echo "===== Kiểm chứng: gọi ipify qua proxy (mong đợi $PUBIP) ====="
  curl -s -x "http://$USER:$PASS@$HTTPS" https://api.ipify.org
  echo -e "\n"
else
  echo "Lỗi code=$CODE — xem message ở response phía trên."
fi
