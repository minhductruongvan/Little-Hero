# Backend Little Hero

Máy chủ Node.js phục vụ website, xác thực tài khoản và chuyển câu hỏi tới Gemini. API key chỉ được đọc ở backend qua biến môi trường `GEMINI_API_KEY`; không đặt key trong HTML/JavaScript và không commit key vào Git.

## Chạy trên Windows

1. Cài Node.js phiên bản 18 trở lên và cài dependency ở thư mục gốc bằng `npm install`.
2. Trong PowerShell, nhập API key mới tại dấu nhắc ẩn để dùng trong cửa sổ hiện tại:

   ```powershell
   $secureKey = Read-Host "Gemini API key" -AsSecureString
   $env:GEMINI_API_KEY = [System.Net.NetworkCredential]::new("", $secureKey).Password
   node backend/server.js
   ```

   Biến chỉ có hiệu lực trong phiên PowerShell này. Không gửi API key qua chat, không ghi key vào source hoặc tệp theo dõi Git.

3. Mở `http://127.0.0.1:5500/`. Backend Node.js sẽ vừa phục vụ ứng dụng Little Hero vừa xử lý API Gemini và tài khoản.

Cổng mặc định là `5500`; có thể thay đổi bằng biến môi trường `PORT`. API gồm `GET /api/health`, `POST /api/chat`, `POST /api/auth/register` và `POST /api/auth/login`. Không chạy VS Code Live Server trên cổng 5500 cùng lúc: một cổng chỉ có thể được một máy chủ chiếm dụng tại một thời điểm. Thay vào đó hãy khởi chạy backend này và truy cập địa chỉ trên.

## Hỏi Hero AI

Hỏi Hero sử dụng `gemini-3.8-flash` theo dạng streaming để hiển thị câu trả lời ngay khi model tạo từng phần; câu trả lời mặc định bằng tiếng Việt. Những từ khóa liên quan tới trang/tính năng trong ứng dụng sẽ kèm nút mở khu vực phù hợp. Trợ lý hỗ trợ nhập văn bản, nhận diện giọng nói và đọc câu trả lời bằng tính năng của trình duyệt; khả năng dùng micro tùy thiết bị, quyền truy cập và hỗ trợ trình duyệt. Khi bật micro, nói câu hỏi rồi bấm nút dừng để gửi; nếu trình duyệt tạm kết thúc phiên nhận diện, ứng dụng sẽ tự kết nối lại trong khi nút vẫn đang bật.

Có thể đính kèm tối đa 3 ảnh, video MP4/MPEG/MOV/AVI/FLV/MPG/WebM/WMV/3GPP hoặc tệp PDF/TXT/CSV. Giới hạn là 10 MB mỗi tệp và 12 MB tổng dung lượng mỗi lượt. Tệp và nội dung trò chuyện được gửi tới Google Gemini để xử lý; ứng dụng không lưu lịch sử chat vào máy chủ. Không gửi mật khẩu, địa chỉ hoặc thông tin riêng tư của trẻ.

## Tài khoản và dữ liệu

Tài khoản được lưu ngoài thư mục website tại `~/.little-hero/accounts.json` trên máy chạy backend. Có thể đặt `LITTLE_HERO_AUTH_FILE` để chọn đường dẫn khác. Mật khẩu được băm bằng scrypt, không lưu dạng văn bản. API tài khoản chấp nhận Gmail và số điện thoại Việt Nam bắt đầu bằng `+84`.

Tiến độ học, thời gian sử dụng, cấp độ, nhật ký và hồ sơ bé lưu riêng trong trình duyệt theo Gmail đã đăng nhập; hiện không đồng bộ giữa các thiết bị. Cần chạy backend và truy cập trang qua localhost để sử dụng AI hoặc xác thực.
