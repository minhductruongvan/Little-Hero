# Little Hero frontend

`little-hero.html` vẫn là trang vào ứng dụng. Trang này tải các tệp frontend theo thứ tự dưới đây, vì vậy không nên mở trực tiếp một mô-đun JavaScript riêng lẻ.

## Tệp ứng dụng

- `css/little-hero.css` — stylesheet dùng chung cho toàn bộ giao diện Little Hero; font dùng Google Fonts `Be Vietnam Pro`, khai báo tập trung cho trang và các điều khiển.
- `js/little-hero-app.js` — định tuyến trang, trạng thái lưu cục bộ, render giao diện và xử lý tương tác.
- `js/motion.js` — hiệu ứng chuyển động GSAP cho các trang, thẻ nội dung được cập nhật động và điểm lấp lánh Lottie; hai thư viện được tải từ CDN trong trang chính.
- `js/modules/lesson-catalog.js` — danh mục chủ đề, bài học, câu hỏi tiếp nối, nhiệm vụ và thử thách.
- `js/modules/expanded-lesson-catalog.js` — 52 bài học bổ sung cho các chủ đề cảm xúc, an toàn, sức khỏe, tư duy, trách nhiệm/môi trường và cộng đồng; trang chính tải mô-đun này ngay sau danh mục bài học.
- `js/modules/social-creative-lesson-catalog.js` — 20 bài học xã hội/giao tiếp và sáng tạo/khám phá; từng bài được gắn nhóm tuổi 3–6 hoặc 7–10 và quyền truy cập miễn phí/Premium.
- `js/modules/character-model.js` — dựng Hero trang chủ và tạo bộ nhân vật bài học dạng hoạt hình với nét mặt cùng tay/chân có khớp chuyển động.
- `assets/little-hero-logo.png` — logo Little Hero dùng chung ở đầu trang và chân trang.
- `assets/hero-character.png` — ảnh Hero mặc định, hiển thị trong vòng nền và bóng đổ SVG.
- `assets/learning-journey.png` — ảnh giới thiệu các bước học tập cùng Little Hero trên trang chủ.
- `assets/emotion-calm-room.png`, `assets/emotion-classroom.png`, `assets/safety-supermarket.png` — ảnh chủ đề dùng cho khóa học gợi ý trên trang chủ và các thẻ trong kho bài học.
- `assets/lesson-playground-cleanup.png`, `assets/lesson-safe-bicycle.png`, `assets/lesson-handwashing.png` — ảnh minh họa và khung cảnh của các bài học giữ sân chơi sạch, tập xe an toàn và rửa tay.
- `js/modules/scene-model.js` — cấu hình bối cảnh và nhân vật chính/phụ theo từng bài học; cảnh dùng SVG riêng và không đưa Hero vào hoạt cảnh bài học.
- Hoạt cảnh bài học dùng bộ nhân vật SVG hoạt hình mới, tách biệt Hero, được phân biệt qua khuôn mặt, tóc, trang phục và vai trò. Hệ thống đọc tên/vai trò cùng hành động trong đáp án để nhân vật được nhắc tới thể hiện biểu cảm và cử chỉ tương ứng; nhân vật còn lại phối hợp tương tác. Các hoạt động gồm đi, chạy, cúi nhặt, rửa tay, xin lỗi, bắt tay, báo người lớn và tự bảo vệ. Đáp án chưa phù hợp tạo phản ứng nhắc nhở an toàn thay vì cổ vũ hành vi nguy hiểm. Hero trang chủ và mô hình ở đấu trường vẫn giữ nguyên.
- Bài học chia màn hình giữa hoạt cảnh và câu hỏi, có gợi ý thu gọn và phản hồi giọng nói. Bài ôn tập gồm chọn cách phù hợp, nối cặp và sắp xếp thứ tự; không dùng video hoặc hoạt cảnh.
- Các trang bài học hiển thị ghi chú đây là giao diện demo; nút quay lại điều hướng về trang trước trong lịch sử ứng dụng.
- Trang truyện hiển thị thông báo tính năng đang được LITTLE HERO xây dựng; các tình huống kể trong bài học vẫn được giữ lại.
- Banner truyện giữ tỷ lệ ảnh gốc và giới hạn chiều rộng hiển thị theo độ phân giải ảnh nguồn để tránh bị phóng to mờ.
- Bảng xếp hạng công khai cho khách và người đăng ký. Khi chưa có điểm thật được chia sẻ trong phạm vi đang xem, giao diện hiển thị thứ hạng minh họa có ghi nhãn; điểm của người chơi chỉ được đồng bộ sau khi phụ huynh đồng ý công khai.
- Khách chưa đăng nhập có thể mở các trang ở chế độ xem trước; các thao tác ghi tiến độ, gửi nội dung, trả lời câu hỏi hoặc thay đổi hồ sơ yêu cầu đăng nhập. Khu vực phụ huynh chỉ hiển thị phần giới thiệu trước khi đăng nhập và xác nhận phụ huynh.

Hero trang chủ giữ nguyên thiết kế hiện tại; giao diện đổi trang phục Hero đã được gỡ bỏ. Nhân vật trong cảnh bài học dùng mô hình SVG độc lập với cấu hình tên, giới tính, tóc, trang phục và vóc dáng người lớn/trẻ em. Nhân vật bài học không dùng hình Hero hay đồ họa nhân vật trước đây. Các chủ đề ninja, học viện, bóng đêm và robot là trang phục minh họa nguyên bản, không sao chép nhân vật hoặc logo phim hoạt hình.

Khi đăng nhập lần đầu (hoặc thêm hồ sơ bé mới), ứng dụng hỏi nhóm tuổi 3–6/7–10, độ tuổi cụ thể và chủ đề quan tâm. Lựa chọn được lưu theo hồ sơ trên thiết bị, dùng để lọc bài học, bài ôn tập và tình huống trong đấu trường; chủ đề yêu thích được ưu tiên trong gợi ý.

Các tệp trong `frontend/` không thay thế các tệp frontend thử nghiệm đã có (`data.js`, `auth.js`, `comics.js`, `voice.js`, `style.css`); ứng dụng Little Hero chính sử dụng riêng các tệp có tiền tố `little-hero` và thư mục `js/modules`.

Các hiệu ứng chuyển động tự tắt khi thiết bị bật tùy chọn giảm chuyển động; nếu CDN không khả dụng, các chức năng chính của ứng dụng vẫn hoạt động bình thường.

Đăng ký và đăng nhập tài khoản thật dùng các API trong `../backend/server.js`; thông tin tài khoản được lưu trong SQLite trên máy chủ, mật khẩu được băm, còn tiến độ học tập vẫn lưu cục bộ theo tài khoản trên trình duyệt. Khôi phục mật khẩu gửi mã xác minh qua email (Resend) hoặc SMS (Twilio) khi backend đã được cấu hình thông tin nhà cung cấp; xem `../backend/README.md`.

Phản hồi và đọc nội dung bài học dùng Web Speech của trình duyệt, có thể cần HTTPS hoặc localhost. Ngôn ngữ đã chọn được gửi cùng yêu cầu AI, đồng thời đặt ngôn ngữ nhận diện/đọc giọng nói (tiếng Việt hoặc English); giọng đọc khả dụng tùy thiết bị. Một số nội dung biên tập của bài học vẫn đang được viết bằng tiếng Việt.

## Backend

Backend hiện có ở `../backend/server.js`, phục vụ API Gemini và tài khoản trên cổng `31377`.

Có thể mở giao diện bằng VS Code Live Server tại `http://127.0.0.1:5500/little-hero.html`; frontend tự gọi backend tại `127.0.0.1:31377`. Cả Live Server lẫn backend cần được chạy đồng thời. Xem `../backend/README.md` để cấu hình API key và chạy máy chủ.
