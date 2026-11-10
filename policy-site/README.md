# Triển khai trang chính sách

Thư mục này là một website tĩnh. Có thể triển khai nguyên thư mục lên GitHub Pages, Netlify Drop, Cloudflare Pages hoặc Vercel.

Sau khi triển khai, URL cần nhập vào Google Play là:

```text
https://ten-mien-cua-ban/privacy.html
```

Trước khi công bố:

1. Cập nhật email hỗ trợ chính thức trong `privacy.html` và `eula.html`.
2. Mở cả hai trang bằng cửa sổ ẩn danh để xác nhận URL truy cập công khai, không cần đăng nhập.
3. Giữ URL ổn định khi ứng dụng được cập nhật.

## GitHub Pages

Tạo repository công khai, tải nội dung của thư mục `policy-site` lên nhánh `main`, sau đó chọn **Settings → Pages → Deploy from a branch → main → / (root)**.

## Netlify Drop

Mở Netlify Drop, kéo thả thư mục `policy-site`, sau đó đổi tên site nếu cần. Netlify cấp một URL HTTPS công khai ngay.
