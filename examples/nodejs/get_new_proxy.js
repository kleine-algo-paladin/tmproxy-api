/**
 * TMProxy API — ví dụ Node.js / Node.js example.
 *
 * Chạy / Run:
 *   export TMPROXY_API_KEY="your_api_key"   // PowerShell: $env:TMPROXY_API_KEY="..."
 *   node get_new_proxy.js
 *
 * Dùng global fetch (Node 18+) cho API + module http built-in để kiểm chứng proxy.
 * KHÔNG cần cài thêm gói nào.
 * Uses global fetch (Node 18+) for the API + the built-in http module to verify
 * the proxy. NO extra packages required.
 */

const http = require("node:http");

const BASE_URL = "https://tmproxy.com/api/proxy";
const API_KEY = process.env.TMPROXY_API_KEY;

async function call(endpoint, payload) {
  const resp = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await resp.json();
  if (body.code !== 0) {
    throw new Error(`[${endpoint}] code=${body.code} message=${JSON.stringify(body.message)}`);
  }
  return body.data || {};
}

async function main() {
  if (!API_KEY) {
    console.error("Thiếu TMPROXY_API_KEY / Missing TMPROXY_API_KEY");
    process.exit(1);
  }

  // 1) Kiểm tra key & hạn mức
  const stats = await call("stats", { api_key: API_KEY });
  console.log(`Plan: ${stats.plan} | het han: ${stats.expired_at} ` +
              `| da dung: ${stats.ip_used_today}/${stats.max_ip_per_day}`);

  // 2) Xin proxy mới
  const proxy = await call("get-new-proxy",
    { api_key: API_KEY, id_location: 0, id_isp: 0 });
  console.log(`Proxy: ${proxy.https} (${proxy.location_name}/${proxy.isp_name}) ` +
              `public_ip=${proxy.public_ip} next_request=${proxy.next_request}s`);

  // 3) Kiểm chứng: gọi http://api.ipify.org qua proxy HTTP bằng module http built-in.
  try {
    const [pHost, pPort] = proxy.https.split(":");
    const auth = "Basic " + Buffer.from(`${proxy.username}:${proxy.password}`).toString("base64");
    const seenIp = await new Promise((resolve, reject) => {
      const req = http.get(
        {
          host: pHost,
          port: Number(pPort),
          path: "http://api.ipify.org/",          // proxy HTTP nhận URL tuyệt đối
          headers: { Host: "api.ipify.org", "Proxy-Authorization": auth },
        },
        (res) => {
          let data = "";
          res.on("data", (c) => (data += c));
          res.on("end", () => resolve(data.trim()));
        }
      );
      req.on("error", reject);
      req.setTimeout(30000, () => req.destroy(new Error("timeout")));
    });
    const ok = seenIp === proxy.public_ip;
    console.log(`IP qua proxy: ${seenIp} -> ${ok ? "[OK]" : "[KHONG KHOP]"}`);
  } catch (e) {
    console.log("Bo qua buoc kiem chung:", e.message);
  }

  // 4) Muốn đổi IP tiếp: await new Promise(r => setTimeout(r, (proxy.next_request + 2) * 1000));
}

main().catch((e) => { console.error(e.message); process.exit(1); });
