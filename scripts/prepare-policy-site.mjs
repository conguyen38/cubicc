import { cp, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const outputDir = path.join(root, "policy-site");

await mkdir(outputDir, { recursive: true });
await cp(path.join(publicDir, "privacy.html"), path.join(outputDir, "privacy.html"));
await cp(path.join(publicDir, "eula.html"), path.join(outputDir, "eula.html"));

const index = `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#5d45eb" />
    <title>Cubic Flow · Trang thông tin</title>
    <style>
      :root { color-scheme: light dark; font-family: "Segoe UI", sans-serif; }
      * { box-sizing: border-box; }
      body { min-height: 100vh; display: grid; place-items: center; margin: 0; padding: 24px; color: #202338; background: radial-gradient(circle at 80% 10%, #c8f5f7 0, transparent 34%), #f7f8fc; }
      main { width: min(680px, 100%); padding: clamp(28px, 7vw, 60px); border-radius: 32px; color: white; background: linear-gradient(145deg, #1b153c, #5d45eb 55%, #16aebf); box-shadow: 0 30px 80px #30208038; }
      .cube { display: inline-grid; place-items: center; width: 72px; height: 72px; margin-bottom: 24px; border: 2px solid #ffffff55; border-radius: 22px; background: #ffffff18; font-size: 30px; }
      .eyebrow { margin: 0 0 8px; color: #7dedef; font-size: 13px; font-weight: 800; letter-spacing: .16em; }
      h1 { margin: 0; font-size: clamp(42px, 10vw, 72px); line-height: .95; letter-spacing: -.05em; }
      p { max-width: 500px; margin: 22px 0 30px; color: #e6e2ff; font-size: 18px; line-height: 1.65; }
      nav { display: flex; flex-wrap: wrap; gap: 12px; }
      a { padding: 13px 18px; border: 1px solid #ffffff35; border-radius: 14px; color: white; background: #ffffff14; font-weight: 700; text-decoration: none; }
      a.primary { color: #322689; background: white; }
      footer { margin-top: 32px; color: #b9b3d9; font-size: 13px; }
      @media (prefers-color-scheme: dark) { body { background: radial-gradient(circle at 80% 10%, #164a53 0, transparent 34%), #111421; } }
    </style>
  </head>
  <body>
    <main>
      <div class="cube" aria-hidden="true">◩</div>
      <p class="eyebrow">3 × 3 CUBE COMPANION</p>
      <h1>Cubic Flow</h1>
      <p>Quét màu, giải khối Rubik 3×3 từng bước và luyện tốc độ hoàn toàn ngoại tuyến.</p>
      <nav aria-label="Trang pháp lý">
        <a class="primary" href="privacy.html">Chính sách quyền riêng tư</a>
        <a href="eula.html">Điều khoản sử dụng</a>
      </nav>
      <footer>Dữ liệu được xử lý trên thiết bị · Không quảng cáo · Không tài khoản</footer>
    </main>
  </body>
</html>
`;

await writeFile(path.join(outputDir, "index.html"), index, "utf8");

const deploymentNotes = `# Triển khai trang chính sách

Thư mục này là một website tĩnh. Có thể triển khai nguyên thư mục lên GitHub Pages, Netlify Drop, Cloudflare Pages hoặc Vercel.

Sau khi triển khai, URL cần nhập vào Google Play là:

\`\`\`text
https://ten-mien-cua-ban/privacy.html
\`\`\`

Trước khi công bố:

1. Cập nhật email hỗ trợ chính thức trong \`privacy.html\` và \`eula.html\`.
2. Mở cả hai trang bằng cửa sổ ẩn danh để xác nhận URL truy cập công khai, không cần đăng nhập.
3. Giữ URL ổn định khi ứng dụng được cập nhật.

## GitHub Pages

Tạo repository công khai, tải nội dung của thư mục \`policy-site\` lên nhánh \`main\`, sau đó chọn **Settings → Pages → Deploy from a branch → main → / (root)**.

## Netlify Drop

Mở Netlify Drop, kéo thả thư mục \`policy-site\`, sau đó đổi tên site nếu cần. Netlify cấp một URL HTTPS công khai ngay.
`;

await writeFile(path.join(outputDir, "README.md"), deploymentNotes, "utf8");
