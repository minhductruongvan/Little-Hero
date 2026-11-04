# Backend Little Hero

Máy chủ Node.js phục vụ website, xác thực tài khoản và chuyển câu hỏi tới Gemini. API key chỉ được đọc ở backend qua biến môi trường `GEMINI_API_KEY`; không đặt key trong HTML/JavaScript và không commit key vào Git.

## Chạy trên Windows

1. Cài Node.js phiên bản 22.13 trở lên và cài dependency ở thư mục gốc bằng `npm install`.
2. Trong PowerShell, nhập API key mới tại dấu nhắc ẩn để dùng trong cửa sổ hiện tại:

   ```powershell
   $secureKey = Read-Host "Gemini API key" -AsSecureString
   $env:GEMINI_API_KEY = [System.Net.NetworkCredential]::new("", $secureKey).Password
   node backend/server.js
   ```

   Biến chỉ có hiệu lực trong phiên PowerShell này. Không gửi API key qua chat, không ghi key vào source hoặc tệp theo dõi Git.

3. Mở `http://127.0.0.1:31377/`. Backend Node.js sẽ phục vụ website cùng API Gemini và tài khoản.

Cổng mặc định là `3000`; đặt `PORT=31377` trong PowerShell trước khi chạy để dùng địa chỉ trên. API gồm `GET /api/health`, `POST /api/chat`, `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/recovery/request` và `POST /api/auth/recovery/reset`.

### Dùng giao diện qua VS Code Live Server ở cổng 5500

Chạy backend với API key Gemini và `PORT=31377`. Trong terminal khác, dùng Live Server mở `little-hero.html` tại `http://127.0.0.1:5500/little-hero.html`. Giao diện tự gửi yêu cầu AI và tài khoản tới backend trên cổng 31377; cần để cả hai máy chủ chạy. Backend cho phép yêu cầu API từ `localhost:5500` và `127.0.0.1:5500`.

## Triển khai API cho website GitHub Pages

GitHub Pages chỉ phục vụ file tĩnh, không chạy được API Node.js. Repository có `render.yaml` để tạo dịch vụ API miễn phí trên Render:

1. Tạo Web Service từ repository này trên Render và chọn dùng Blueprint (`render.yaml`).
2. Chờ Render triển khai dịch vụ và báo Healthy. Render cấp URL HTTPS dạng `https://<tên-dịch-vụ>.onrender.com`; Blueprint hiện đặt tên là `little-hero-api`.
3. Frontend dùng `https://little-hero-api.onrender.com` trong `frontend/js/config.js`. Nếu Render cấp hostname khác, thay URL ở tệp đó bằng URL đang hiển thị trong trang dịch vụ Render. Backend cho phép yêu cầu từ `https://littlehero.id.vn` và `https://www.littlehero.id.vn`.
4. Kiểm tra URL API bằng cách mở `<URL-Render>/api/health`, rồi thử đăng ký trên website. Có thể cấu hình custom domain `api.littlehero.id.vn` sau; khi đó cần cập nhật DNS CNAME và URL trong `frontend/js/config.js`.

Gói miễn phí tự dừng khi không có lưu lượng trong một thời gian và dùng filesystem tạm. Tài khoản được lưu trong SQLite cục bộ để đăng ký rồi đăng nhập khi dịch vụ đang chạy, nhưng tài khoản có thể mất khi dịch vụ ngủ, khởi động lại hoặc triển khai lại. Không dùng cấu hình này nếu cần giữ tài khoản ổn định lâu dài; việc đó cần một nơi lưu dữ liệu bền vững.

Không đổi bản ghi của domain gốc `littlehero.id.vn`; domain đó tiếp tục phục vụ GitHub Pages. Không triển khai API trên gói không có ổ lưu trữ bền vững, vì dữ liệu tài khoản có thể mất khi dịch vụ khởi động lại. Nếu cần dùng Gemini, cấu hình `GEMINI_API_KEY` riêng trong Render Environment; không đưa key vào repository.

## Hỏi Hero AI

Hỏi Hero gửi câu hỏi tới Gemini bằng API key chỉ có trên backend, sau đó truyền nội dung trả lời theo dạng streaming. Đặt biến môi trường `GEMINI_API_KEY` cho tiến trình backend (hoặc mục Environment của Render) để bật AI; `GET /api/health` báo `configured: false` nếu chưa có key. Hero có thể trả lời chủ đề tổng quát và hướng dẫn các tính năng Little Hero, nhưng không có khả năng tra cứu web trực tiếp hay đảm bảo mọi câu trả lời luôn chính xác. Những câu hỏi liên quan tới ứng dụng có thể kèm nút mở khu vực phù hợp.

Trên trình duyệt hỗ trợ Web Speech, người dùng có thể nhấn nút micro, nói câu hỏi rồi nhấn lại để gửi; Hero sẽ đọc câu trả lời. Nút “Hội thoại rảnh tay” bật chế độ nhận diện tiếng Việt liên tục: sau khoảng lặng, câu hỏi được gửi tới Gemini, câu trả lời được đọc thành tiếng rồi micro tự nghe lượt tiếp theo. Cần cấp quyền micro, dùng HTTPS hoặc localhost; có thể tắt chế độ bất cứ lúc nào. Nhận diện và đọc giọng nói do trình duyệt/hệ điều hành cung cấp, nên khả năng và giọng tiếng Việt tùy thiết bị.

Có thể đính kèm tối đa 3 ảnh, video MP4/MPEG/MOV/AVI/FLV/MPG/WebM/WMV/3GPP hoặc tệp PDF/TXT/CSV. Giới hạn là 10 MB mỗi tệp và 12 MB tổng dung lượng mỗi lượt. Tệp và nội dung trò chuyện được gửi tới Google Gemini để xử lý; ứng dụng không lưu lịch sử chat vào máy chủ. Không gửi mật khẩu, địa chỉ hoặc thông tin riêng tư của trẻ.

## Tài khoản và dữ liệu

Tài khoản được lưu trong cơ sở dữ liệu SQLite ngoài thư mục website tại `~/.little-hero/accounts.sqlite` trên máy chạy backend. Đặt `LITTLE_HERO_DATABASE_FILE` để chọn đường dẫn khác. Nếu tìm thấy `accounts.json` cũ (hoặc đường dẫn `LITTLE_HERO_AUTH_FILE` cũ) và cơ sở dữ liệu mới chưa có tài khoản, backend tự nhập dữ liệu đó vào SQLite. Mật khẩu được băm bằng scrypt, không lưu dạng văn bản; tệp cơ sở dữ liệu được giới hạn quyền đọc trên hệ điều hành hỗ trợ. API tài khoản chấp nhận email và số điện thoại Việt Nam bắt đầu bằng `+84`.

### Cấu hình gửi mã khôi phục mật khẩu

Khôi phục mật khẩu xác minh quyền truy cập email hoặc số điện thoại trước khi đổi mật khẩu. Máy chủ không gửi mã nếu nhà cung cấp của kênh đang dùng chưa được cấu hình:

- Email: đặt `RESEND_API_KEY` và `LITTLE_HERO_EMAIL_FROM` (địa chỉ gửi đã xác minh với Resend).
- SMS: đặt `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` và `TWILIO_PHONE_NUMBER` (số gửi được Twilio cấp).

Các biến môi trường phải được cấu hình riêng trong terminal hoặc bảng điều khiển của nhà cung cấp hosting; không đưa thông tin xác thực vào Git. Mã xác minh có hiệu lực 10 phút, giới hạn 5 lần nhập và mỗi kênh/địa chỉ chỉ gửi một mã mỗi phút. Mã và phiên khôi phục nằm trong bộ nhớ của máy chủ; nếu máy chủ khởi động lại, người dùng cần yêu cầu mã mới.

Tiến độ học, thời gian sử dụng, cấp độ, nhật ký và hồ sơ bé lưu riêng trong trình duyệt theo email đã đăng nhập; hiện không đồng bộ giữa các thiết bị. Cần chạy backend và truy cập trang qua localhost để sử dụng AI hoặc xác thực.
