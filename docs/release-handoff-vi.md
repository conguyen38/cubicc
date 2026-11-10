# Bàn giao phát hành Cubic Flow 1.0.0

## Tệp chính

- AAB để tải lên Google Play: `release/Cubic-Flow-1.0.0-play.aab`
- APK để kiểm tra trên máy Android: `release/Cubic-Flow-1.0.0-test.apk`
- Checksum: `release/SHA256SUMS.txt`
- Khóa upload riêng tư: `release/cubicflow-upload.jks`
- Cấu hình mật khẩu khóa: `release/keystore.properties`

Hai tệp khóa không được gửi qua email, chat, mã nguồn công khai hoặc dịch vụ lưu trữ công cộng. Hãy sao lưu cả hai ở nơi được mã hóa và giữ thêm một bản sao ngoại tuyến.

## Thông số gói

- Tên: Cubic Flow
- Package ID: `app.cubicflow.solver`
- Phiên bản: `1.0.0`
- Version code: `1`
- Min SDK: 24
- Target SDK: 36
- Quyền khai báo: Camera
- Quyền mạng: Không

## Bằng chứng kiểm tra

- 11 unit/integration test đều đạt.
- TypeScript và Vite production build đạt.
- Android lint: không có lỗi hoặc cảnh báo.
- AAB và APK release ký bằng một chứng thư RSA 4096-bit.
- APK xác minh bằng APK Signature Scheme v2.
- AAB xác minh bằng `jarsigner`.
- Không có quyền `INTERNET` trong APK.
- Camera feature được đánh dấu không bắt buộc.

## Trình tự đưa lên Play Console

1. Tạo ứng dụng mới với package ID `app.cubicflow.solver`.
2. Bật Play App Signing.
3. Tạo bản phát hành Internal testing và tải `Cubic-Flow-1.0.0-play.aab`.
4. Điền hồ sơ bằng `docs/store-listing-vi.md` và tải ảnh trong `store-assets/`.
5. Khai báo Data safety là ứng dụng không thu thập hoặc chia sẻ dữ liệu; camera được xử lý cục bộ.
6. Nhập URL HTTPS công khai của chính sách quyền riêng tư.
7. Cài APK hoặc bản tải từ internal testing trên điện thoại thật và kiểm tra camera, quét sáu mặt, nhập tay, giải, bấm giờ, xoay màn hình và chế độ tối.
8. Nếu tài khoản cá nhân được tạo sau ngày 13/11/2023, chạy closed test theo yêu cầu hiện hành của Google Play trước khi mở Production.

## Thông tin còn chờ chủ tài khoản

- Tên nhà phát triển chính thức
- Email hỗ trợ chính thức
- URL HTTPS của chính sách quyền riêng tư sau khi triển khai
