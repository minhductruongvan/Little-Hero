(() => {
  window.LittleHeroLessonCatalog = (() => {
      const categories = [
        { id: "emotion", icon: "🎨", name: "Thế giới cảm xúc & bản thân", desc: "Nhận biết cảm xúc, tự tin và kiên trì.", color: "#fff0d9", lesson: "emotion" },
        { id: "social", icon: "🤝", name: "Kỹ năng xã hội & giao tiếp", desc: "Lắng nghe, kết bạn và cùng hợp tác.", color: "#e2f4ea", lesson: "social" },
        { id: "safety", icon: "🛡️", name: "An toàn & tự bảo vệ", desc: "Nhận biết nguy cơ, tìm người tin cậy.", color: "#e8eaff", lesson: "safety" },
        { id: "health", icon: "🍏", name: "Sức khỏe & tự lập", desc: "Tập chăm sóc bản thân từng bước.", color: "#e0f5ed", lesson: "health" },
        { id: "thinking", icon: "🧩", name: "Tư duy & ra quyết định", desc: "Suy nghĩ về lựa chọn và hệ quả.", color: "#f1eafa", lesson: "thinking" },
        { id: "care", icon: "🌿", name: "Trách nhiệm & môi trường", desc: "Quan tâm đến không gian quanh mình.", color: "#e6f2dc", lesson: "care" },
        { id: "creative", icon: "💡", name: "Sáng tạo & khám phá", desc: "Tò mò, đặt câu hỏi, thử điều mới.", color: "#fff2c8", lesson: "creative" },
        { id: "community", icon: "🌐", name: "Gia đình, cộng đồng & mạng", desc: "Cùng sống tử tế và an toàn trên mạng.", color: "#e4f0fa", lesson: "community" }
      ];

      const lessons = [
        {
          id: "emotion", category: "emotion", title: "Khi con có nhiều cảm xúc", icon: "🎭", age: "4–8 tuổi", duration: "3–5 phút",
          goal: "Nhận biết, gọi tên cảm xúc và thể hiện cảm xúc theo cách an toàn.",
          story: "Hôm nay Na vui vì được cô khen bức tranh. Khi tranh bị rách, Na buồn và tức giận. Ngày mai lớp biểu diễn, Na lại thấy lo lắng.",
          prompts: ["Na có thể đang vui, buồn, giận dữ hoặc lo lắng.", "Điều gì đã khiến mỗi cảm xúc xuất hiện?", "Na có thể nói cảm xúc và nhờ cô giúp thay vì làm đau bạn.", "Chọn một cảm xúc bé từng trải qua và kể với người lớn."],
          answers: ["Na nói: “Mình buồn vì tranh bị rách”, rồi nhờ cô giúp.", "Na giấu cảm xúc và giật lại đồ của bạn.", "Na tự trách mình và không nói với ai."],
          correct: 0, reward: 10, color: "#fff0d9", activity: "Cùng bé chọn một biểu tượng cảm xúc và kể: “Hôm nay con cảm thấy… vì…”"
        },
        {
          id: "social", category: "social", title: "Làm quen với một người bạn mới", icon: "🧒", age: "4–8 tuổi", duration: "3–5 phút",
          goal: "Bắt đầu một cuộc trò chuyện thân thiện và tôn trọng lựa chọn của bạn.",
          story: "Nam mới đến lớp và đang ngồi xếp hình một mình. Hà muốn chơi cùng nhưng còn ngại chưa biết mở lời thế nào.",
          prompts: ["Hà muốn kết bạn nhưng cũng hơi lo lắng.", "Nam có thể cần thời gian để làm quen với lớp.", "Hà có thể chào bạn, giới thiệu mình và hỏi: “Mình chơi cùng được không?”", "Bé thử chào một người bạn và tôn trọng câu trả lời của bạn."],
          answers: ["Mỉm cười chào bạn, hỏi bạn có muốn chơi cùng không.", "Giật lấy đồ chơi để bạn phải chú ý.", "Bắt bạn phải chơi cùng mình ngay."],
          correct: 0, reward: 10, color: "#e2f4ea", activity: "Cùng bé tập nói lời chào và một câu hỏi thân thiện."
        },
        {
          id: "safety", category: "safety", title: "Khi con bị lạc ở nơi đông người", icon: "🛡️", age: "4–8 tuổi", duration: "4 phút",
          goal: "Biết đứng ở nơi an toàn và tìm người lớn có trách nhiệm hỗ trợ.",
          story: "Ở siêu thị, Bin không nhìn thấy mẹ. Gần đó có quầy thông tin và một lối đi ra bãi xe.",
          prompts: ["Bin có thể thấy sợ hãi hoặc bối rối.", "Chạy lung tung có thể khiến Bin khó tìm người thân hơn.", "Bin đứng ở chỗ an toàn, nhờ nhân viên siêu thị hoặc bảo vệ giúp gọi người thân.", "Cùng người lớn xác định một điểm hẹn an toàn ở nơi đông người."],
          answers: ["Đứng ở nơi an toàn và nhờ nhân viên hoặc bảo vệ hỗ trợ.", "Đi theo một người lạ tự nhận là quen với gia đình.", "Tự đi ra bãi xe để tìm người thân."],
          correct: 0, reward: 12, color: "#e8eaff", activity: "Cùng phụ huynh chọn điểm hẹn an toàn khi đi nơi đông người."
        },
        {
          id: "health", category: "health", title: "Bàn tay sạch trước bữa ăn", icon: "🧼", age: "4–8 tuổi", duration: "3 phút",
          goal: "Tạo thói quen vệ sinh cá nhân với sự hướng dẫn phù hợp.",
          story: "Sau khi chơi ngoài sân, đến giờ ăn trưa. Đôi tay của Mia đã dính đất.",
          prompts: ["Mia có thể đang đói và muốn ăn ngay.", "Vi trùng nhỏ có thể bám trên bàn tay sau khi chơi.", "Mia rửa tay với xà phòng và nhờ người lớn giúp nếu cần.", "Cùng hát một bài ngắn trong lúc rửa tay."],
          answers: ["Rửa tay với xà phòng trước khi ngồi vào bàn.", "Lau tay qua loa vào áo rồi ăn luôn.", "Chờ đến khi ăn xong mới rửa tay."],
          correct: 0, reward: 10, color: "#e0f5ed", activity: "Cùng bé thực hành sáu bước rửa tay và hát một bài ngắn."
        },
        {
          id: "thinking", category: "thinking", title: "Khi con mắc một lỗi nhỏ", icon: "🧩", age: "4–8 tuổi", duration: "4 phút",
          goal: "Nhận trách nhiệm phù hợp và tìm người lớn hỗ trợ để sửa sai.",
          story: "An vô ý làm đổ nước lên bàn học và thấy vài quyển sách bị ướt. An lo bị mắng.",
          prompts: ["An có thể đang lo lắng hoặc xấu hổ.", "Nếu báo người lớn sớm, sách có thể được lau khô.", "An nói thật và nhờ người lớn giúp khắc phục.", "Bé nghĩ một câu nói khi cần báo người lớn về lỗi nhỏ."],
          answers: ["Báo người lớn và xin giúp lau nước, kiểm tra sách.", "Giấu sự việc và để nước thấm thêm.", "Tự dùng đồ điện gần chỗ nước để sấy sách."],
          correct: 0, reward: 10, color: "#f1eafa", activity: "Cùng bé luyện nói: “Con lỡ làm… Ba/mẹ giúp con sửa nhé?”"
        },
        {
          id: "care", category: "care", title: "Cùng giữ sân chơi sạch đẹp", icon: "🌿", age: "4–8 tuổi", duration: "3 phút",
          goal: "Thực hành trách nhiệm phù hợp với không gian chung.",
          story: "Sau giờ ăn nhẹ, Linh thấy vỏ bánh trên tay và một chiếc thùng rác ở gần đó.",
          prompts: ["Linh có thể đang muốn chạy đi chơi.", "Vỏ bánh để trên sân có thể làm bẩn nơi mọi người cùng vui chơi.", "Linh bỏ rác đúng nơi quy định rồi quay lại trò chơi.", "Bé cùng người lớn nhặt một món rác an toàn và bỏ đúng thùng."],
          answers: ["Bỏ vỏ bánh vào thùng rác gần đó.", "Để vỏ bánh xuống sân vì sẽ có người khác dọn.", "Ném vỏ bánh thật xa để khỏi phải cầm."],
          correct: 0, reward: 10, color: "#e6f2dc", activity: "Cùng bé tìm thùng rác và phân loại một món rác phù hợp."
        },
        {
          id: "creative", category: "creative", title: "Thử một điều mới thật an toàn", icon: "💡", age: "4–8 tuổi", duration: "4 phút",
          goal: "Gọi tên sự lo lắng và tìm sự hỗ trợ khi thử điều mới.",
          story: "Bin muốn tập đi xe đạp nhưng lo sẽ mất thăng bằng. Bố đang ở bên cạnh và có thể giúp.",
          prompts: ["Bin vừa háo hức vừa có thể lo lắng.", "Đây là kỹ năng mới nên Bin có thể cần thời gian luyện tập.", "Bin nhờ bố hỗ trợ, đội mũ bảo hiểm và tập ở nơi an toàn.", "Bé kể về một điều mới muốn thử và ai có thể đồng hành."],
          answers: ["Nhờ người lớn hỗ trợ và dùng đồ bảo hộ phù hợp.", "Tập một mình ở con đường có nhiều xe.", "Không bao giờ thử và cũng không chia sẻ điều mình lo."],
          correct: 0, reward: 10, color: "#fff2c8", activity: "Cùng bé chọn một điều mới, nhỏ và phù hợp để thử với người lớn."
        },
        {
          id: "community", category: "community", title: "Tin nhắn lạ trên mạng", icon: "🌐", age: "4–8 tuổi", duration: "4 phút",
          goal: "Bảo vệ thông tin cá nhân và báo cho người lớn đáng tin cậy.",
          story: "Khi dùng máy tính bảng cùng bố, Mia nhận tin nhắn từ một tài khoản không quen hỏi địa chỉ nhà.",
          prompts: ["Mia có thể tò mò hoặc hơi lo lắng.", "Địa chỉ nhà là thông tin riêng tư cần được bảo vệ.", "Mia không trả lời, không gửi thông tin và báo ngay cho bố.", "Cùng người lớn nhắc lại ba thông tin cá nhân không chia sẻ với người lạ."],
          answers: ["Không trả lời và báo ngay cho người lớn đang đồng hành.", "Gửi địa chỉ để người lạ biết mình ở đâu.", "Tiếp tục trò chuyện và giữ bí mật với bố mẹ."],
          correct: 0, reward: 12, color: "#e4f0fa", activity: "Cùng bé nhắc lại: không chia sẻ địa chỉ, mật khẩu hoặc thông tin riêng tư."
        },
        {
          id: "calm", category: "emotion", title: "Khi con tức giận và muốn la hét", icon: "🌬️", age: "4–8 tuổi", duration: "4 phút",
          goal: "Nhận ra dấu hiệu tức giận và chọn cách bình tĩnh, không làm tổn thương người khác.",
          story: "Em của Bo vô tình làm đổ tòa lâu đài Bo vừa xây. Bo thấy mặt nóng lên, hai tay nắm chặt và muốn hét thật to.",
          prompts: ["Bo có thể đang tức giận hoặc thất vọng.", "Bo buồn vì đã dành nhiều thời gian xây lâu đài.", "Bo tạm dừng, hít thở chậm rồi nói cảm xúc và nhờ em giúp xây lại.", "Bé chọn một cách an toàn giúp mình bình tĩnh khi khó chịu."],
          answers: ["Tạm dừng, thở chậm và nói rõ điều khiến mình buồn.", "Đẩy em rồi hét thật to.", "Ném đồ chơi để mọi người biết mình đang giận."],
          correct: 0, reward: 10, color: "#fff0d9", activity: "Cùng bé chọn ba cách bình tĩnh: thở chậm, uống nước hoặc nhờ người lớn."
        },
        {
          id: "sorry", category: "social", title: "Khi con cần nói lời xin lỗi", icon: "💛", age: "4–8 tuổi", duration: "4 phút",
          goal: "Nhận trách nhiệm và đề nghị một cách sửa sai phù hợp.",
          story: "An vô tình làm đổ tòa tháp bạn Bình vừa xây. Bình buồn, còn An ngại xin lỗi vì sợ bạn giận.",
          prompts: ["An có thể cảm thấy áy náy hoặc lo lắng.", "Hành động của An làm Bình buồn dù đó không phải cố ý.", "An xin lỗi, nói rõ việc đã xảy ra và hỏi xem có thể giúp xây lại không.", "Bé nghĩ cách sửa sai nếu vô tình làm ảnh hưởng đến người khác."],
          answers: ["Xin lỗi chân thành và hỏi bạn muốn được giúp thế nào.", "Nói rằng bạn không nên buồn vì đó chỉ là đồ chơi.", "Ép bạn tha thứ ngay để hai người chơi tiếp."],
          correct: 0, reward: 10, color: "#e2f4ea", activity: "Cùng bé tập nói lời xin lỗi và đề nghị một cách khắc phục."
        },
        {
          id: "stranger", category: "safety", title: "Khi người lạ cho con quà", icon: "🎁", age: "4–8 tuổi", duration: "4 phút",
          goal: "Giữ khoảng cách an toàn và nhờ người lớn đáng tin cậy hỗ trợ.",
          story: "Ở gần cổng công viên, một người Mia không quen mời em đi theo để nhận một món quà. Mẹ đang ở bên trong khu vui chơi.",
          prompts: ["Mia có thể thấy tò mò hoặc ngại từ chối.", "Mia không biết người lạ là ai và không nên tự đi theo.", "Mia từ chối, đi về phía mẹ hoặc nhân viên nơi công cộng và kể lại sự việc.", "Bé xác định người lớn đáng tin cậy có thể tìm đến khi cần."],
          answers: ["Không đi theo, giữ khoảng cách và báo cho mẹ ngay.", "Đi theo người đó để xem có món quà gì.", "Giữ bí mật vì người đó đã dặn không kể."],
          correct: 0, reward: 12, color: "#e8eaff", activity: "Cùng bé nhắc lại người lớn đáng tin cậy bé có thể tìm đến ở nơi công cộng."
        },
        {
          id: "new-thing", category: "health", title: "Khi con lo lắng trước điều mới", icon: "🚲", age: "4–8 tuổi", duration: "4 phút",
          goal: "Nhận biết nỗi lo và tìm sự hỗ trợ phù hợp trước một trải nghiệm mới.",
          story: "Bin muốn tập đi xe đạp nhưng hơi sợ ngã. Bố đang ở cạnh và có thể giúp Bin chọn nơi tập an toàn.",
          prompts: ["Bin có thể vừa hào hứng vừa lo lắng.", "Đây là trải nghiệm mới nên Bin chưa biết điều gì sẽ xảy ra.", "Bin chia sẻ nỗi lo, đội mũ bảo hiểm và nhờ bố hỗ trợ.", "Bé kể về một điều mới muốn thử cùng người lớn."],
          answers: ["Chia sẻ nỗi lo và thử từng bước ở nơi an toàn với người lớn.", "Tập một mình trên con đường đông xe.", "Giấu nỗi lo và làm điều mình chưa sẵn sàng."],
          correct: 0, reward: 10, color: "#e0f5ed", activity: "Cùng bé chọn một trải nghiệm mới, nhỏ và an toàn để thử."
        }
      ];

      const lessonFollowUps = {
        emotion: [
          { story: "Cô giáo giúp Na dán lại bức tranh. Na vẫn còn hơi buồn vì vết rách nhìn thấy rõ.", prompt: "Na muốn bình tĩnh và nói với cô điều mình cần. Bé gợi ý gì?", answers: ["Na nói mình vẫn buồn và hỏi cô cách sửa tranh.", "Na giấu tranh đi rồi trách bạn làm hỏng.", "Na bỏ đi mà không nói với cô."] },
          { story: "Đến lượt biểu diễn ngày mai, Na thấy hồi hộp nhưng đã biết chia sẻ cảm xúc với cô.", prompt: "Na có thể chuẩn bị thế nào để tự tin hơn?", answers: ["Na tập thử cùng cô hoặc người thân và hít thở chậm.", "Na tự nhủ mình không được phép lo lắng.", "Na trốn buổi biểu diễn mà không nói với ai."] }
        ],
        social: [
          { story: "Nam đồng ý chơi cùng Hà. Trên đường đến góc đọc sách, Nam làm rơi vài quyển truyện và hơi bối rối.", prompt: "Hero có thể giúp bạn thế nào?", answers: ["Hero cúi xuống nhặt sách và đưa lại cho Nam.", "Hero cười bạn vì làm rơi sách.", "Hero giả vờ không thấy rồi bỏ đi."] },
          { story: "Nam nhận lại sách và cảm ơn Hero. Sau đó, Nam muốn nghỉ một lát trong khi Hà vẫn muốn chơi tiếp.", prompt: "Hà nên phản hồi thế nào?", answers: ["Hà đồng ý cho Nam nghỉ và hỏi bạn khi nào muốn chơi lại.", "Hà giận dỗi và ép Nam chơi tiếp.", "Hà giấu đồ chơi để Nam phải ở lại."] }
        ],
        safety: [
          { story: "Nhân viên quầy thông tin đưa Bin tới khu vực hỗ trợ có camera và gọi loa tìm mẹ.", prompt: "Trong lúc chờ, Bin nên làm gì?", answers: ["Ở cạnh nhân viên tại điểm hỗ trợ và chờ người thân.", "Tự đi ra bãi xe tìm mẹ.", "Đi theo người lạ nói rằng biết mẹ của Bin."] },
          { story: "Mẹ Bin đã tới quầy thông tin. Hai mẹ con muốn thống nhất cách làm nếu lạc nhau lần nữa.", prompt: "Kế hoạch nào giúp Bin an toàn hơn?", answers: ["Cùng chọn điểm hẹn và nhớ tìm nhân viên có đồng phục.", "Bin tự ra ngoài tìm nếu không thấy mẹ.", "Bin đi theo bất cứ ai biết tên mình."] }
        ],
        health: [
          { story: "Mia làm ướt tay dưới vòi nước và lấy xà phòng. Bọt đã phủ quanh các ngón tay.", prompt: "Mia nên làm gì tiếp để rửa tay kỹ?", answers: ["Chà hai lòng bàn tay, kẽ ngón và đầu ngón tay.", "Rửa xà phòng chỉ ở một lòng bàn tay.", "Lau tay vào áo khi vẫn còn xà phòng."] },
          { story: "Mia rửa sạch bọt và chuẩn bị lau khô tay trước khi ăn.", prompt: "Cách nào giúp Mia giữ tay sạch?", answers: ["Dùng khăn sạch lau khô rồi ngồi vào bàn ăn.", "Lau tay vào quần áo vừa chơi ngoài sân.", "Chạm tay bẩn vào thức ăn trước khi lau."] }
        ],
        thinking: [
          { story: "An đã báo với mẹ về cốc nước bị đổ. Mẹ cùng An chuyển sách ra chỗ khô.", prompt: "An nên làm gì để khắc phục an toàn?", answers: ["Nhờ mẹ giúp thấm nước bằng khăn và tránh xa ổ điện.", "Cắm máy sấy cạnh chỗ nước để hong sách.", "Giấu những quyển sách ướt vào ngăn bàn."] },
          { story: "Sách đã được lau khô. An muốn hạn chế sự cố tương tự khi học.", prompt: "An có thể làm gì lần tới?", answers: ["Đặt cốc nước xa sách và nhờ người lớn hỗ trợ.", "Đặt cốc sát mép bàn để tiện lấy.", "Không nói với ai nếu lại có nước đổ."] }
        ],
        care: [
          { story: "Linh bỏ vỏ bánh vào thùng rác. Bạn Linh cũng đang cầm một chiếc vỏ khác.", prompt: "Linh có thể nhắc bạn thế nào cho thân thiện?", answers: ["Mời bạn cùng bỏ rác vào thùng để sân chơi sạch.", "Giật vỏ bánh khỏi tay bạn.", "Mắng bạn trước mọi người."] },
          { story: "Hai bạn đã dọn sạch chỗ ngồi và muốn tiếp tục chơi.", prompt: "Linh nên làm gì nếu thấy mảnh rác sắc nhọn trên sân?", answers: ["Không chạm vào và báo người lớn đến xử lý.", "Nhặt bằng tay không rồi chạy đi.", "Đá mảnh rác sang chỗ khác."] }
        ],
        creative: [
          { story: "Bin đội mũ bảo hiểm vừa vặn và tập giữ thăng bằng ở lối đi vắng cùng bố.", prompt: "Nếu Bin thấy khó giữ thăng bằng, cách nào phù hợp?", answers: ["Dừng lại, nói với bố và tập từng bước.", "Tăng tốc để khỏi bị ngã.", "Tiếp tục dù đang thấy không an toàn."] },
          { story: "Bin đã đi được một đoạn ngắn và muốn thử thêm một lần nữa.", prompt: "Bin nên làm gì trước khi tiếp tục?", answers: ["Hỏi bố kiểm tra khu vực và tiếp tục khi sẵn sàng.", "Tự đi ra đường để thử thách mình.", "Tháo mũ vì đã đi được một lần."] }
        ],
        community: [
          { story: "Mia không trả lời tin nhắn lạ và báo cho bố. Bố giúp em chặn tài khoản đó.", prompt: "Nếu tài khoản khác tiếp tục nhắn, Mia nên làm gì?", answers: ["Không phản hồi, lưu lại để báo bố và nhờ bố hỗ trợ.", "Trả lời để hỏi người đó muốn gì.", "Gửi ảnh để người đó nhận ra Mia."] },
          { story: "Bố và Mia cùng xem lại cách bảo vệ tài khoản trên máy tính bảng.", prompt: "Thông tin nào Mia cần giữ riêng tư?", answers: ["Mật khẩu, địa chỉ nhà và thông tin liên hệ.", "Tên nhân vật trong câu chuyện.", "Màu sắc Mia thích vẽ."] }
        ],
        calm: [
          { story: "Bo dừng lại và hít thở chậm. Em của Bo đứng cạnh tòa lâu đài bị đổ.", prompt: "Bo có thể nói gì để cùng em giải quyết?", answers: ["Bo nói mình buồn và hỏi em có muốn cùng xây lại không.", "Bo hét vào em để em phải sửa ngay.", "Bo ném thêm đồ chơi xuống sàn."] },
          { story: "Hai anh em bắt đầu xếp lại các khối gỗ. Bo vẫn thấy hơi khó chịu.", prompt: "Nếu cảm xúc vẫn mạnh, Bo nên làm gì?", answers: ["Xin nghỉ một chút và nhờ người lớn ở gần hỗ trợ.", "Cố chơi tiếp dù đang muốn làm đau em.", "Đổ lỗi cho em rồi bỏ đi."] }
        ],
        sorry: [
          { story: "An xin lỗi Bình và hỏi bạn có muốn cùng xây lại tòa tháp không.", prompt: "Bình chưa muốn chơi ngay. An nên làm gì?", answers: ["Cho Bình thời gian và lắng nghe bạn.", "Bắt Bình phải tha thứ ngay.", "Nói rằng Bình đang làm quá lên."] },
          { story: "Một lúc sau, Bình đồng ý cùng An xếp lại các khối gỗ.", prompt: "Hai bạn có thể làm gì để tránh đổ tháp lần nữa?", answers: ["Cùng thống nhất chỗ đặt tháp và cẩn thận khi đi ngang.", "An giữ hết khối gỗ để tự quyết định.", "Hai bạn đổ lỗi cho nhau nếu tháp lại ngã."] }
        ],
        stranger: [
          { story: "Mia từ chối món quà và đi về phía mẹ ở khu vui chơi.", prompt: "Mia nên kể gì với mẹ?", answers: ["Kể rõ người đó đã nói gì và chỉ vị trí người đó.", "Giữ bí mật vì đã nhận lời người lạ.", "Quay lại một mình để hỏi về món quà."] },
          { story: "Mẹ cảm ơn Mia đã kể và cùng em nhắc lại quy tắc an toàn.", prompt: "Nếu người lạ tiếp tục gọi Mia, em nên làm gì?", answers: ["Ở cạnh mẹ hoặc nhân viên tin cậy và nhờ giúp đỡ.", "Đi theo để người đó không buồn.", "Nhận quà nhưng không nói với mẹ."] }
        ],
        "new-thing": [
          { story: "Bin nói với bố rằng em sợ ngã. Bố kiểm tra mũ bảo hiểm và chọn lối tập bằng phẳng.", prompt: "Bin nên làm gì nếu vẫn chưa thấy sẵn sàng?", answers: ["Nói với bố và bắt đầu bằng một bước nhỏ khi sẵn sàng.", "Cố tập một mình để không phải chờ.", "Giấu bố rằng em đang sợ."] },
          { story: "Bin tập từng đoạn ngắn cùng bố và dừng lại nghỉ khi mỏi.", prompt: "Khi muốn tập tiếp, Bin nên làm gì?", answers: ["Kiểm tra an toàn cùng bố rồi mới tập tiếp.", "Đi nhanh hơn dù đang mệt.", "Bỏ mũ bảo hiểm cho dễ chịu."] }
        ]
      };

      const questSpecs = [
        { id: "lessons", icon: "🎮", label: "Học 3 lượt", target: 3, reward: 20 },
        { id: "minutes", icon: "⏱", label: "Học đủ 10 phút", target: 10, reward: 20 },
        { id: "quiz", icon: "📝", label: "Thử một câu hỏi", target: 1, reward: 30 }
      ];
      const challengeSpecs = [
        { id: "wash", icon: "🫧", title: "Tự rửa tay trước bữa ăn", subtitle: "Thực hành cùng người lớn · +5 ⭐", reward: 5 },
        { id: "words", icon: "💬", title: "Nói ra cảm xúc của mình", subtitle: "Luyện gọi tên cảm xúc · +5 ⭐", reward: 5 },
        { id: "kind", icon: "🤝", title: "Chào hỏi hoặc giúp một người bạn", subtitle: "Chọn cách phù hợp với bé · +5 ⭐", reward: 5 }
      ];
      return { categories, lessons, lessonFollowUps, questSpecs, challengeSpecs };
  })();
})();
