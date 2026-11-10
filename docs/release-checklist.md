# Danh sách phát hành Google Play

## Đã hoàn tất trong dự án

- [x] Android package và tên ứng dụng
- [x] Biểu tượng 512×512, feature graphic 1024×500
- [x] Bộ ảnh màn hình 1080×1920
- [x] AAB release đã ký và xác minh
- [x] Android lint không có cảnh báo, TypeScript build, unit test và audit dependency
- [x] Chính sách quyền riêng tư và điều khoản sử dụng
- [x] Nội dung mô tả cửa hàng
- [x] Không có quảng cáo, tài khoản, phân tích hoặc API bên thứ ba
- [x] Sao lưu dữ liệu ứng dụng bị tắt

## Việc cần chủ tài khoản thực hiện

1. Thay tên nhà phát triển và email hỗ trợ trong hồ sơ.
2. Đưa `public/privacy.html` và `public/eula.html` lên một tên miền HTTPS công khai.
3. Tạo ứng dụng trong Play Console với package `app.cubicflow.solver`.
4. Bật Play App Signing và tải `release/Cubic-Flow-1.0.0-play.aab` lên Internal testing.
5. Hoàn thành App content: quyền riêng tư, Data safety, xếp hạng nội dung, quảng cáo, đối tượng mục tiêu, chính sách dữ liệu.
6. Chọn ứng dụng là công cụ/giáo dục, miễn phí, không quảng cáo.
7. Kiểm tra trên ít nhất một máy Android thật: camera, nhập tay, xoay màn hình, quay lại, đọc màn hình, chế độ tối.
8. Nếu dùng tài khoản cá nhân tạo sau 13/11/2023, chạy closed test với tối thiểu 12 tester duy nhất liên tục 14 ngày trước khi xin quyền Production theo quy định hiện hành.
9. Chuẩn bị mục tiêu tải thử: ít nhất 20 người, trong đó có 12 người duy nhất duy trì tham gia.
10. Sao lưu `release/cubicflow-upload.jks` và `release/keystore.properties` ở nơi an toàn. Mất upload key có thể làm chậm các bản cập nhật.

## Kiểm tra trước mỗi bản cập nhật

```powershell
npm.cmd test
npm.cmd run android:sync
cd android
.\gradlew.bat lintDebug bundleRelease
```

Tăng `versionCode` và `versionName` trong `android/app/build.gradle`.

## Tài liệu tham chiếu

- Google Play testing requirements: https://support.google.com/googleplay/android-developer/answer/14151465
- Data safety: https://support.google.com/googleplay/android-developer/answer/10787469
- Preview assets: https://support.google.com/googleplay/android-developer/answer/9866151
- Target API requirements: https://developer.android.com/google/play/requirements/target-sdk
