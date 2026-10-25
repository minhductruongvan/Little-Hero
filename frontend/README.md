# Little Hero frontend

`little-hero.html` vẫn là trang vào ứng dụng. Trang này tải các tệp frontend theo thứ tự dưới đây, vì vậy không nên mở trực tiếp một mô-đun JavaScript riêng lẻ.

## Tệp ứng dụng

- `css/little-hero.css` — stylesheet dùng chung cho toàn bộ giao diện Little Hero.
- `js/little-hero-app.js` — định tuyến trang, trạng thái lưu cục bộ, render giao diện và xử lý tương tác.
- `js/modules/lesson-catalog.js` — danh mục chủ đề, bài học, câu hỏi tiếp nối, nhiệm vụ và thử thách.
- `js/modules/character-model.js` — chuẩn hóa tủ đồ và dựng nhân vật SVG chia khớp cơ thể để có thể hoạt họa.
- `js/modules/scene-model.js` — cấu hình bối cảnh theo bài học, hình nền SVG và nhân vật trong cảnh.

Hero, bạn bè và người thân trong các cảnh dùng chung mô hình SVG; cấu hình giới tính, tóc, trang phục, vóc dáng người lớn/trẻ em truyền qua hồ sơ từng nhân vật. Các chủ đề ninja, học viện, bóng đêm và robot là trang phục minh họa nguyên bản, không sao chép nhân vật hoặc logo phim hoạt hình.

Các tệp trong `frontend/` không thay thế các tệp frontend thử nghiệm đã có (`data.js`, `auth.js`, `comics.js`, `voice.js`, `style.css`); ứng dụng Little Hero chính sử dụng riêng các tệp có tiền tố `little-hero` và thư mục `js/modules`.

## Backend

Backend hiện có ở `../backend/server.js`; backend phục vụ giao diện và API Gemini/tài khoản trên cùng địa chỉ `http://127.0.0.1:5500`.

Chạy backend từ thư mục gốc bằng `node backend/server.js`, cấu hình API key qua biến môi trường và mở `http://127.0.0.1:5500/`. Không chạy VS Code Live Server cùng cổng `5500`; xem `../backend/README.md` để biết chi tiết.
