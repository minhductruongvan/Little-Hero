# Little Hero frontend

`little-hero.html` vẫn là trang vào ứng dụng. Trang này tải các tệp frontend theo thứ tự dưới đây, vì vậy không nên mở trực tiếp một mô-đun JavaScript riêng lẻ.

## Tệp ứng dụng

- `css/little-hero.css` — stylesheet dùng chung cho toàn bộ giao diện Little Hero; dùng Google Fonts `Be Vietnam Pro`, thống nhất thang chữ theo desktop/mobile và định dạng hai thẻ gói học với giá cùng CTA căn đáy.
- `css/character-animation.css` — hoạt ảnh cho SVG dự phòng trong cảnh bài học và nhân vật ở đấu trường; tôn trọng tùy chọn giảm chuyển động.
- `js/little-hero-app.js` — định tuyến trang, trạng thái lưu cục bộ, render giao diện và xử lý tương tác.
- `js/motion.js` — hiệu ứng chuyển động GSAP cho các trang, thẻ nội dung được cập nhật động và điểm lấp lánh Lottie; hai thư viện được tải từ CDN trong trang chính.
- `js/modules/lesson-catalog.js` — danh mục chủ đề, bài học, câu hỏi tiếp nối, nhiệm vụ và thử thách.
- `js/modules/expanded-lesson-catalog.js` — 52 bài học bổ sung cho các chủ đề cảm xúc, an toàn, sức khỏe, tư duy, trách nhiệm/môi trường và cộng đồng; trang chính tải mô-đun này ngay sau danh mục bài học.
- `js/modules/social-creative-lesson-catalog.js` — 20 bài học xã hội/giao tiếp và sáng tạo/khám phá; từng bài được gắn nhóm tuổi 3–6 hoặc 7–10 và quyền truy cập miễn phí/Premium.
- `js/modules/lesson-locales-core.js` và `js/modules/lesson-locales-expanded.js` — bảng dịch cục bộ cho nội dung bài học; được tải sau các danh mục và trước `languages.js`/ứng dụng.
- `js/modules/character-model.js` — dựng Hero trang chủ và SVG dự phòng cho nhân vật bài học khi Web Component chưa tải; Hero trang chủ tiếp tục dùng renderer này.
- `../../little-hero-character.js` — Web Component nhân vật hoạt hình dùng riêng trong cảnh bài học; hỗ trợ hành động, cảm xúc, đạo cụ và tùy chỉnh ngoại hình.
- `js/modules/character-animation-engine.js` — suy luận hành động/cảm xúc từ đáp án hoặc metadata, chuyển kế hoạch tới Web Component bài học và điều khiển SVG dự phòng/đấu trường bằng Web Animations API.
- `assets/little-hero-logo.png` — logo Little Hero dùng chung ở đầu trang và chân trang.
- `assets/hero-character.png` — ảnh Hero mặc định, hiển thị trong vòng nền và bóng đổ SVG.
- `assets/learning-journey.png` — ảnh giới thiệu các bước học tập cùng Little Hero trên trang chủ.
- `assets/emotion-calm-room.png`, `assets/emotion-classroom.png`, `assets/safety-supermarket.png` — ảnh chủ đề dùng cho khóa học gợi ý trên trang chủ và các thẻ trong kho bài học.
- `assets/lesson-playground-cleanup.png`, `assets/lesson-safe-bicycle.png`, `assets/lesson-handwashing.png` — ảnh minh họa và khung cảnh của các bài học giữ sân chơi sạch, tập xe an toàn và rửa tay.
- `assets/parent-avatar-woman-1.jpg`, `assets/parent-avatar-woman-2.jpg`, `assets/parent-avatar-woman-3.jpg`, `assets/parent-avatar-man.jpg` — ảnh chân dung minh họa cho các thẻ chia sẻ của phụ huynh trên trang chủ.
- `js/modules/scene-model.js` — dựng dàn nhân vật và cảm xúc ban đầu theo tên, vai trò và diễn biến trong từng câu chuyện; chỉ cảnh bài học dùng `<little-hero>`, còn Hero trang chủ và nhân vật ở đấu trường giữ renderer SVG cũ.
- Hệ thống chọn hành động theo đáp án và cảm xúc an toàn theo hành động/tính đúng sai, không suy cảm xúc từ từ khóa trong câu trả lời; các nhân vật được nhắc đến cùng phối hợp trong cảnh. Hero trang chủ không bị thay đổi.
- Đáp án mỗi lượt học được xáo trộn cùng metadata chuyển động, đồng thời cập nhật chỉ số đáp án đúng nên thứ tự hiển thị không cố định.
- Bài học chia màn hình giữa hoạt cảnh và câu hỏi, có gợi ý thu gọn và phản hồi giọng nói. Bài ôn tập có chọn cách phù hợp, nối cặp, sắp xếp thứ tự, lật thẻ ghi nhớ và xưởng ý tưởng; nội dung trả lời sáng tạo chỉ dùng trong lượt chơi, không gửi lên máy chủ hoặc lưu lại. Không dùng video hay hoạt cảnh trong bài ôn tập.
- Trang truyện hiển thị thông báo tính năng đang được LITTLE HERO xây dựng; các tình huống kể trong bài học vẫn được giữ lại.
- Banner truyện giữ tỷ lệ ảnh gốc và giới hạn chiều rộng hiển thị theo độ phân giải ảnh nguồn để tránh bị phóng to mờ.
- Bảng xếp hạng chỉ hiển thị điểm của tài khoản thật đã đồng ý công khai biệt danh và điểm; nếu chưa có người tham gia trong phạm vi đang xem, danh sách sẽ để trống. Tài khoản trải nghiệm có quyền dùng Premium cục bộ; ảnh bill ở chế độ này chỉ xem trước trên thiết bị, không tải lên và không xử lý thanh toán.
- Khách chưa đăng nhập có thể mở các trang ở chế độ xem trước; các thao tác ghi tiến độ, gửi nội dung, trả lời câu hỏi hoặc thay đổi hồ sơ yêu cầu đăng nhập. Khu vực phụ huynh chỉ hiển thị phần giới thiệu trước khi đăng nhập và xác nhận phụ huynh.

Hero trang chủ giữ nguyên thiết kế hiện tại; giao diện đổi trang phục Hero đã được gỡ bỏ. Nhân vật trong cảnh bài học dùng mô hình SVG độc lập, giữ diễn hoạt theo câu chuyện và đồng bộ nhận diện trẻ em với logo LITTLE HERO: tóc nâu, trang phục xanh, ngôi sao vàng và áo choàng đỏ; bé gái có tóc hai bím cùng hoa cài. Nhân vật người lớn giữ trang phục riêng. Các chủ đề ninja, học viện, bóng đêm và robot là trang phục minh họa nguyên bản, không sao chép nhân vật hoặc logo phim hoạt hình.

Khi đăng nhập lần đầu (hoặc thêm hồ sơ bé mới), ứng dụng hỏi nhóm tuổi 3–6/7–10, độ tuổi cụ thể và chủ đề quan tâm. Lựa chọn được lưu theo hồ sơ trên thiết bị, dùng để lọc bài học, bài ôn tập và tình huống trong đấu trường; chủ đề yêu thích được ưu tiên trong gợi ý.

Các tệp trong `frontend/` không thay thế các tệp frontend thử nghiệm đã có (`data.js`, `auth.js`, `comics.js`, `voice.js`, `style.css`); ứng dụng Little Hero chính sử dụng riêng các tệp có tiền tố `little-hero` và thư mục `js/modules`.

Các hiệu ứng chuyển động tự tắt khi thiết bị bật tùy chọn giảm chuyển động; nếu CDN không khả dụng, các chức năng chính của ứng dụng vẫn hoạt động bình thường.

Đăng ký và đăng nhập tài khoản thật dùng các API trong `../backend/server.js`; thông tin tài khoản được lưu trong SQLite trên máy chủ, mật khẩu được băm, còn tiến độ học tập vẫn lưu cục bộ theo tài khoản trên trình duyệt. Khôi phục mật khẩu gửi mã xác minh qua email (Resend) hoặc SMS (Twilio) khi backend đã được cấu hình thông tin nhà cung cấp; xem `../backend/README.md`.

Giao diện có 11 lựa chọn ngôn ngữ. Ngôn ngữ đã chọn được gửi cùng yêu cầu AI và dùng cho định dạng số/ngày, nhận diện giọng nói cùng giọng đọc Web Speech của trình duyệt. Nếu thiết bị không có giọng đọc khớp locale đã chọn, ứng dụng báo rõ thay vì phát bằng giọng ngôn ngữ khác. Bản dịch giao diện, tin tức, ôn tập và một phần nội dung bài học được lưu cục bộ trong ứng dụng; không gọi dịch vụ dịch bên ngoài. Khi AI trực tuyến không khả dụng, câu trả lời dự phòng cũng dùng bản dịch cục bộ. Chưa phải toàn bộ nội dung biên tập và phản hồi theo tình huống đã có bản dịch chuẩn ở cả 10 ngôn ngữ bổ sung; giọng đọc phụ thuộc voice được cài trên thiết bị.

## Backend

Backend hiện có ở `../backend/server.js`, phục vụ API Gemini và tài khoản trên cổng `31377`.

Có thể mở giao diện bằng VS Code Live Server tại `http://127.0.0.1:5500/little-hero.html`; frontend tự gọi backend tại `127.0.0.1:31377`. Cả Live Server lẫn backend cần được chạy đồng thời. Xem `../backend/README.md` để cấu hình API key và chạy máy chủ.
