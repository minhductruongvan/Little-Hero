# Little Hero frontend

`little-hero.html` vẫn là trang vào ứng dụng. Trang này tải các tệp frontend theo thứ tự dưới đây, vì vậy không nên mở trực tiếp một mô-đun JavaScript riêng lẻ.

## Tệp ứng dụng

- `css/little-hero.css` — stylesheet dùng chung cho toàn bộ giao diện Little Hero.
- `js/little-hero-app.js` — định tuyến trang, trạng thái lưu cục bộ, render giao diện và xử lý tương tác.
- `js/motion.js` — hiệu ứng chuyển động GSAP cho các trang, thẻ nội dung được cập nhật động và điểm lấp lánh Lottie; hai thư viện được tải từ CDN trong trang chính.
- `js/modules/lesson-catalog.js` — danh mục chủ đề, bài học, câu hỏi tiếp nối, nhiệm vụ và thử thách.
- `js/modules/character-model.js` — chuẩn hóa tủ đồ, hiển thị Hero PNG mặc định và dựng các biến thể SVG cho tủ đồ.
- `assets/little-hero-logo.png` — logo Little Hero dùng chung ở đầu trang và chân trang.
- `assets/hero-character.png` — ảnh Hero mặc định, hiển thị trong vòng nền và bóng đổ SVG.
- `js/modules/scene-model.js` — cấu hình bối cảnh theo bài học và nhân vật trong cảnh; bài học an toàn dùng ảnh siêu thị riêng và hiệu ứng phản hồi khi chọn cách xử lý phù hợp.
- `assets/safety-supermarket.png` — minh họa siêu thị do người dùng cung cấp cho bài học an toàn; Hero và nhân viên được hiển thị trực tiếp từ ảnh.
- Bài học chia màn hình giữa hoạt cảnh và câu hỏi, có gợi ý thu gọn, phản hồi giọng nói và lời mời đọc truyện cùng chủ đề sau khi hoàn thành. Bài ôn tập gồm chọn cách phù hợp, nối cặp và sắp xếp thứ tự; không dùng video hoặc hoạt cảnh.
- Khách chưa đăng nhập có thể mở các trang ở chế độ xem trước; các thao tác ghi tiến độ, gửi nội dung, trả lời câu hỏi hoặc thay đổi hồ sơ yêu cầu đăng nhập. Khu vực phụ huynh chỉ hiển thị phần giới thiệu trước khi đăng nhập và xác nhận phụ huynh.

Hero mặc định dùng ảnh PNG tham chiếu; các nhân vật và trang phục tùy chỉnh trong cảnh vẫn dùng mô hình SVG với cấu hình giới tính, tóc, trang phục và vóc dáng người lớn/trẻ em. Các chủ đề ninja, học viện, bóng đêm và robot là trang phục minh họa nguyên bản, không sao chép nhân vật hoặc logo phim hoạt hình.

Khi đăng nhập lần đầu (hoặc thêm hồ sơ bé mới), ứng dụng hỏi nhóm tuổi 3–6/7–10, độ tuổi cụ thể và chủ đề quan tâm. Lựa chọn được lưu theo hồ sơ trên thiết bị, dùng để lọc bài học, truyện, bài ôn tập và tình huống trong đấu trường; chủ đề yêu thích được ưu tiên trong gợi ý.

Các tệp trong `frontend/` không thay thế các tệp frontend thử nghiệm đã có (`data.js`, `auth.js`, `comics.js`, `voice.js`, `style.css`); ứng dụng Little Hero chính sử dụng riêng các tệp có tiền tố `little-hero` và thư mục `js/modules`.

Các hiệu ứng chuyển động tự tắt khi thiết bị bật tùy chọn giảm chuyển động; nếu CDN không khả dụng, các chức năng chính của ứng dụng vẫn hoạt động bình thường.

Đăng ký và đăng nhập tài khoản thật dùng các API trong `../backend/server.js`; thông tin tài khoản được lưu trong SQLite trên máy chủ, mật khẩu được băm, còn tiến độ học tập vẫn lưu cục bộ theo tài khoản trên trình duyệt. Khôi phục mật khẩu gửi mã xác minh qua email (Resend) hoặc SMS (Twilio) khi backend đã được cấu hình thông tin nhà cung cấp; xem `../backend/README.md`. Ảnh minh họa truyện tải từ Unsplash nên cần kết nối Internet; phần lật sách, hiệu ứng và nội dung chữ vẫn dùng được khi ảnh không tải được.

Phản hồi và đọc nội dung bài học dùng Web Speech của trình duyệt, có thể cần HTTPS hoặc localhost và trình duyệt hỗ trợ giọng đọc tiếng Việt. Lời mời đọc truyện sau bài học là gợi ý theo chủ đề, không phải nội dung AI tạo trực tiếp.

## Backend

Backend hiện có ở `../backend/server.js`, phục vụ API Gemini và tài khoản trên cổng `31377`.

Có thể mở giao diện bằng VS Code Live Server tại `http://127.0.0.1:5500/little-hero.html`; frontend tự gọi backend tại `127.0.0.1:31377`. Cả Live Server lẫn backend cần được chạy đồng thời. Xem `../backend/README.md` để cấu hình API key và chạy máy chủ.
