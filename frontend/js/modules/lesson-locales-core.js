(() => {
  const localeCodes = ["en", "zh-CN", "ja", "ko", "es", "fr", "th", "id", "de", "pt-BR"];
  const translations = {
    "Thế giới cảm xúc & bản thân": ["Feelings & self", "情绪与自我", "気持ちと自分", "감정과 나", "Emociones y yo", "Émotions et soi", "อารมณ์และตัวตน", "Emosi dan diri", "Gefühle und ich", "Emoções e autoconhecimento"],
    "Nhận biết cảm xúc, tự tin và kiên trì.": ["Recognize feelings, build confidence, and keep trying.", "认识情绪，建立自信，坚持尝试。", "気持ちに気づき、自信を持って続ける。", "감정을 알아차리고 자신감을 키우며 꾸준히 해요.", "Reconocer emociones, ganar confianza y perseverar.", "Reconnaître ses émotions, prendre confiance et persévérer.", "รู้จักอารมณ์ สร้างความมั่นใจ และพยายามต่อไป", "Mengenali emosi, membangun percaya diri, dan tekun.", "Gefühle erkennen, Selbstvertrauen stärken und dranbleiben.", "Reconhecer emoções, ganhar confiança e persistir."],
    "Kỹ năng xã hội & giao tiếp": ["Social and communication skills", "社交与沟通能力", "人との関わりとコミュニケーション", "사회성과 의사소통 능력", "Habilidades sociales y de comunicación", "Compétences sociales et communication", "ทักษะสังคมและการสื่อสาร", "Keterampilan sosial dan komunikasi", "Soziale Fähigkeiten und Kommunikation", "Habilidades sociais e de comunicação"],
    "Lắng nghe, kết bạn và cùng hợp tác.": ["Listen, make friends, and work together.", "学会倾听、交朋友和合作。", "人の話を聞き、友だちを作り、一緒に協力する。", "경청하고 친구를 사귀며 함께 협력해요.", "Escuchar, hacer amigos y colaborar.", "Écouter, se faire des amis et coopérer.", "รับฟัง ผูกมิตร และร่วมมือกัน", "Mendengarkan, berteman, dan bekerja sama.", "Zuhören, Freundschaften schließen und zusammenarbeiten.", "Ouvir, fazer amigos e cooperar."],
    "An toàn & tự bảo vệ": ["Safety and self-protection", "安全与自我保护", "安全と自分を守ること", "안전과 자기 보호", "Seguridad y autoprotección", "Sécurité et protection de soi", "ความปลอดภัยและการปกป้องตนเอง", "Keamanan dan melindungi diri", "Sicherheit und Selbstschutz", "Segurança e proteção pessoal"],
    "Nhận biết nguy cơ, tìm người tin cậy.": ["Notice risks and find a trusted adult.", "识别危险并寻求可信赖的大人帮助。", "危険に気づき、信頼できる大人に助けを求める。", "위험을 알아차리고 믿을 수 있는 어른을 찾아요.", "Reconocer riesgos y buscar a una persona adulta de confianza.", "Repérer les dangers et demander de l’aide à un adulte de confiance.", "สังเกตอันตรายและขอความช่วยเหลือจากผู้ใหญ่ที่ไว้ใจได้", "Mengenali bahaya dan mencari orang dewasa tepercaya.", "Gefahren erkennen und eine vertraute erwachsene Person finden.", "Perceber riscos e procurar um adulto de confiança."],
    "Sức khỏe & tự lập": ["Health and independence", "健康与自理", "健康と自立", "건강과 자립", "Salud e independencia", "Santé et autonomie", "สุขภาพและการพึ่งพาตนเอง", "Kesehatan dan kemandirian", "Gesundheit und Selbstständigkeit", "Saúde e autonomia"],
    "Tập chăm sóc bản thân từng bước.": ["Practice taking care of yourself, one step at a time.", "一步一步练习照顾自己。", "少しずつ自分のことをする練習をする。", "한 걸음씩 스스로를 돌보는 연습을 해요.", "Practicar el autocuidado paso a paso.", "Apprendre à prendre soin de soi, étape par étape.", "ฝึกดูแลตัวเองทีละขั้น", "Berlatih merawat diri selangkah demi selangkah.", "Schritt für Schritt lernen, für sich selbst zu sorgen.", "Praticar o autocuidado passo a passo."],
    "Tư duy & ra quyết định": ["Thinking and decision-making", "思考与决策", "考える力と意思決定", "사고력과 의사 결정", "Pensamiento y toma de decisiones", "Réflexion et prise de décision", "การคิดและการตัดสินใจ", "Berpikir dan mengambil keputusan", "Denken und Entscheiden", "Pensamento e tomada de decisões"],
    "Suy nghĩ về lựa chọn và hệ quả.": ["Think about choices and their consequences.", "思考不同选择及其后果。", "選択とその結果について考える。", "선택과 그 결과를 생각해요.", "Pensar en las opciones y sus consecuencias.", "Réfléchir aux choix et à leurs conséquences.", "คิดถึงทางเลือกและผลที่จะตามมา", "Memikirkan pilihan dan akibatnya.", "Über Entscheidungen und ihre Folgen nachdenken.", "Pensar nas escolhas e em suas consequências."],
    "Trách nhiệm & môi trường": ["Responsibility and the environment", "责任与环境", "責任と環境", "책임과 환경", "Responsabilidad y medioambiente", "Responsabilité et environnement", "ความรับผิดชอบและสิ่งแวดล้อม", "Tanggung jawab dan lingkungan", "Verantwortung und Umwelt", "Responsabilidade e meio ambiente"],
    "Quan tâm đến không gian quanh mình.": ["Care for the spaces around you.", "爱护身边的环境。", "身の回りの場所を大切にする。", "주변 공간을 소중히 돌봐요.", "Cuidar los espacios que nos rodean.", "Prendre soin des espaces autour de soi.", "ดูแลพื้นที่รอบตัวเรา", "Menjaga lingkungan di sekitar kita.", "Die Umgebung pfleglich behandeln.", "Cuidar dos espaços ao nosso redor."],
    "Sáng tạo & khám phá": ["Creativity and discovery", "创造与探索", "創造と発見", "창의성과 탐구", "Creatividad y descubrimiento", "Créativité et découverte", "ความคิดสร้างสรรค์และการค้นพบ", "Kreativitas dan eksplorasi", "Kreativität und Entdecken", "Criatividade e descoberta"],
    "Tò mò, đặt câu hỏi, thử điều mới.": ["Stay curious, ask questions, and try new things.", "保持好奇、提出问题并尝试新事物。", "好奇な気持ちで質問し、新しいことに挑戦する。", "호기심을 갖고 질문하며 새로운 것을 시도해요.", "Sentir curiosidad, hacer preguntas y probar cosas nuevas.", "Être curieux, poser des questions et essayer de nouvelles choses.", "อยากรู้อยากเห็น ตั้งคำถาม และลองสิ่งใหม่", "Selalu ingin tahu, bertanya, dan mencoba hal baru.", "Neugierig sein, Fragen stellen und Neues ausprobieren.", "Ter curiosidade, fazer perguntas e experimentar coisas novas."],
    "Gia đình, cộng đồng & mạng": ["Family, community, and online life", "家庭、社区与网络生活", "家族・地域・インターネット", "가족, 공동체와 온라인 생활", "Familia, comunidad e internet", "Famille, communauté et vie en ligne", "ครอบครัว ชุมชน และโลกออนไลน์", "Keluarga, komunitas, dan dunia online", "Familie, Gemeinschaft und Onlinewelt", "Família, comunidade e vida online"],
    "Cùng sống tử tế và an toàn trên mạng.": ["Be kind to one another and stay safe online.", "友善相处，并安全使用网络。", "思いやりを持って過ごし、インターネットを安全に使う。", "서로 친절하게 대하고 온라인에서 안전하게 지내요.", "Convivir con amabilidad y navegar con seguridad.", "Vivre ensemble avec bienveillance et naviguer en sécurité.", "อยู่ร่วมกันอย่างมีน้ำใจและใช้อินเทอร์เน็ตอย่างปลอดภัย", "Bersikap baik dan tetap aman saat online.", "Freundlich miteinander umgehen und online sicher bleiben.", "Conviver com gentileza e navegar com segurança."],
    "Khi con có nhiều cảm xúc": ["When I have lots of feelings", "当我有很多情绪时", "いろいろな気持ちになったとき", "여러 감정이 들 때", "Cuando tengo muchas emociones", "Quand j’ai beaucoup d’émotions", "เมื่อมีอารมณ์หลากหลาย", "Saat aku merasakan banyak emosi", "Wenn ich viele Gefühle habe", "Quando sinto muitas emoções"],
    "Làm quen với một người bạn mới": ["Meeting a new friend", "认识新朋友", "新しい友だちと仲良くなる", "새 친구와 친해지기", "Conocer a un nuevo amigo", "Faire connaissance avec un nouvel ami", "ทำความรู้จักเพื่อนใหม่", "Berkenalan dengan teman baru", "Einen neuen Freund kennenlernen", "Conhecendo um novo amigo"],
    "Khi con bị lạc ở nơi đông người": ["If I get lost in a crowd", "在人多的地方走散时", "人混みではぐれたとき", "사람이 많은 곳에서 길을 잃었을 때", "Si me pierdo en un lugar concurrido", "Si je me perds dans un lieu très fréquenté", "เมื่อพลัดหลงในที่คนเยอะ", "Jika tersesat di tempat ramai", "Wenn ich mich in einer Menschenmenge verirre", "Se eu me perder em um lugar movimentado"],
    "Bàn tay sạch trước bữa ăn": ["Clean hands before eating", "饭前洗净双手", "食事の前に手をきれいに", "식사 전에 손 깨끗이 씻기", "Manos limpias antes de comer", "Des mains propres avant le repas", "ล้างมือให้สะอาดก่อนกิน", "Tangan bersih sebelum makan", "Saubere Hände vor dem Essen", "Mãos limpas antes de comer"],
    "Khi con mắc một lỗi nhỏ": ["When I make a small mistake", "当我犯了一个小错误", "小さな失敗をしたとき", "작은 실수를 했을 때", "Cuando cometo un pequeño error", "Quand je fais une petite erreur", "เมื่อทำผิดพลาดเล็กน้อย", "Saat aku melakukan kesalahan kecil", "Wenn mir ein kleiner Fehler passiert", "Quando cometo um pequeno erro"],
    "Cùng giữ sân chơi sạch đẹp": ["Keeping our playground clean", "一起保持游乐场整洁", "遊び場をきれいにしよう", "놀이터를 함께 깨끗하게", "Mantengamos limpio el patio de juegos", "Gardons notre aire de jeux propre", "ช่วยกันรักษาสนามเด็กเล่นให้สะอาด", "Menjaga area bermain tetap bersih", "Unseren Spielplatz sauber halten", "Vamos manter o parquinho limpo"],
    "Thử một điều mới thật an toàn": ["Trying something new safely", "安全地尝试新事物", "安全に新しいことに挑戦する", "안전하게 새로운 일에 도전하기", "Probar algo nuevo de forma segura", "Essayer quelque chose de nouveau en toute sécurité", "ลองสิ่งใหม่อย่างปลอดภัย", "Mencoba hal baru dengan aman", "Etwas Neues sicher ausprobieren", "Experimentar algo novo com segurança"],
    "Tin nhắn lạ trên mạng": ["A strange message online", "网上的陌生消息", "インターネットで知らない人からメッセージ", "온라인에서 모르는 사람이 보낸 메시지", "Un mensaje extraño en internet", "Un message étrange en ligne", "ข้อความแปลก ๆ ทางออนไลน์", "Pesan asing di internet", "Eine fremde Nachricht im Internet", "Uma mensagem estranha na internet"],
    "Khi con tức giận và muốn la hét": ["When I feel angry and want to yell", "当我生气得想大喊时", "怒って大声を出したくなったとき", "화가 나서 소리치고 싶을 때", "Cuando me enfado y quiero gritar", "Quand je suis en colère et que j’ai envie de crier", "เมื่อโกรธและอยากตะโกน", "Saat marah dan ingin berteriak", "Wenn ich wütend bin und schreien möchte", "Quando fico com raiva e quero gritar"],
    "Khi con cần nói lời xin lỗi": ["When I need to say sorry", "当我需要道歉时", "ごめんなさいを伝えるとき", "미안하다고 말해야 할 때", "Cuando necesito pedir perdón", "Quand je dois présenter mes excuses", "เมื่อฉันควรกล่าวคำขอโทษ", "Saat aku perlu meminta maaf", "Wenn ich mich entschuldigen muss", "Quando preciso pedir desculpas"],
    "Khi người lạ cho con quà": ["When a stranger offers me a gift", "陌生人送我礼物时", "知らない人からプレゼントをもらいそうなとき", "모르는 사람이 선물을 주려고 할 때", "Cuando una persona desconocida me ofrece un regalo", "Quand une personne inconnue me propose un cadeau", "เมื่อคนแปลกหน้ายื่นของขวัญให้", "Saat orang asing menawarkan hadiah", "Wenn mir eine fremde Person ein Geschenk anbietet", "Quando uma pessoa desconhecida me oferece um presente"],
    "Khi con lo lắng trước điều mới": ["When I feel nervous about something new", "面对新事物感到担心时", "初めてのことが心配なとき", "새로운 일이 걱정될 때", "Cuando me preocupa algo nuevo", "Quand une nouveauté m’inquiète", "เมื่อกังวลกับสิ่งใหม่", "Saat aku khawatir menghadapi hal baru", "Wenn mich etwas Neues beunruhigt", "Quando fico preocupado com algo novo"],
    "3–6 tuổi": ["Ages 3–6", "3至6岁", "3～6歳", "3~6세", "De 3 a 6 años", "De 3 à 6 ans", "อายุ 3–6 ปี", "Usia 3–6 tahun", "3–6 Jahre", "De 3 a 6 anos"],
    "7–10 tuổi": ["Ages 7–10", "7至10岁", "7～10歳", "7~10세", "De 7 a 10 años", "De 7 à 10 ans", "อายุ 7–10 ปี", "Usia 7–10 tahun", "7–10 Jahre", "De 7 a 10 anos"],
    "3–5 phút": ["3–5 minutes", "3–5分钟", "3～5分", "3~5분", "3–5 minutos", "3 à 5 minutes", "3–5 นาที", "3–5 menit", "3–5 Minuten", "3–5 minutos"],
    "3 phút": ["3 minutes", "3分钟", "3分", "3분", "3 minutos", "3 minutes", "3 นาที", "3 menit", "3 Minuten", "3 minutos"],
    "4 phút": ["4 minutes", "4分钟", "4分", "4분", "4 minutos", "4 minutes", "4 นาที", "4 menit", "4 Minuten", "4 minutos"],
    "Học 3 lượt": ["Complete 3 lessons", "完成3次学习", "3回学習する", "3회 학습하기", "Completa 3 lecciones", "Faire 3 leçons", "เรียน 3 รอบ", "Selesaikan 3 pelajaran", "3 Lektionen lernen", "Concluir 3 lições"],
    "Học đủ 10 phút": ["Learn for 10 minutes", "学习满10分钟", "10分間学ぶ", "10분 동안 학습하기", "Estudia durante 10 minutos", "Étudier pendant 10 minutes", "เรียนให้ครบ 10 นาที", "Belajar selama 10 menit", "10 Minuten lernen", "Estudar por 10 minutos"],
    "Thử một câu hỏi": ["Try one question", "尝试回答一道题", "問題に1問挑戦する", "문제 하나 풀어 보기", "Prueba una pregunta", "Essayer une question", "ลองตอบหนึ่งคำถาม", "Coba satu pertanyaan", "Eine Frage ausprobieren", "Tentar uma pergunta"],
    "Tự rửa tay trước bữa ăn": ["Wash your hands before eating", "饭前自己洗手", "食事の前に自分で手を洗う", "식사 전에 스스로 손 씻기", "Lavarse las manos antes de comer", "Se laver les mains avant le repas", "ล้างมือเองก่อนกินอาหาร", "Mencuci tangan sebelum makan", "Vor dem Essen selbst die Hände waschen", "Lavar as mãos antes de comer"],
    "Thực hành cùng người lớn · +5 ⭐": ["Practice with an adult · +5 ⭐", "和大人一起练习 · +5 ⭐", "大人と一緒に練習 · +5 ⭐", "어른과 함께 연습하기 · +5 ⭐", "Practica con una persona adulta · +5 ⭐", "S’entraîner avec un adulte · +5 ⭐", "ฝึกกับผู้ใหญ่ · +5 ⭐", "Berlatih bersama orang dewasa · +5 ⭐", "Mit einem Erwachsenen üben · +5 ⭐", "Praticar com um adulto · +5 ⭐"],
    "Nói ra cảm xúc của mình": ["Say how you feel", "说出自己的感受", "自分の気持ちを言葉にする", "내 감정을 말하기", "Expresar cómo me siento", "Dire ce que je ressens", "บอกความรู้สึกของตัวเอง", "Mengungkapkan perasaan", "Die eigenen Gefühle ausdrücken", "Falar sobre o que estou sentindo"],
    "Luyện gọi tên cảm xúc · +5 ⭐": ["Practice naming feelings · +5 ⭐", "练习说出情绪名称 · +5 ⭐", "気持ちに名前をつける練習 · +5 ⭐", "감정에 이름 붙이기 연습 · +5 ⭐", "Practica nombrar emociones · +5 ⭐", "S’exercer à nommer ses émotions · +5 ⭐", "ฝึกบอกชื่ออารมณ์ · +5 ⭐", "Berlatih menyebutkan emosi · +5 ⭐", "Gefühle benennen üben · +5 ⭐", "Praticar como nomear emoções · +5 ⭐"],
    "Chào hỏi hoặc giúp một người bạn": ["Greet or help a friend", "问候或帮助一位朋友", "友だちにあいさつするか手伝う", "친구에게 인사하거나 도와주기", "Saluda o ayuda a un amigo", "Dire bonjour à un ami ou l’aider", "ทักทายหรือช่วยเพื่อน", "Menyapa atau membantu teman", "Einen Freund begrüßen oder helfen", "Cumprimentar ou ajudar um amigo"],
    "Chọn cách phù hợp với bé · +5 ⭐": ["Choose what works for you · +5 ⭐", "选择适合自己的方式 · +5 ⭐", "自分に合った方法を選ぶ · +5 ⭐", "나에게 맞는 방법 고르기 · +5 ⭐", "Elige lo que sea adecuado para ti · +5 ⭐", "Choisis ce qui te convient · +5 ⭐", "เลือกวิธีที่เหมาะกับตัวเอง · +5 ⭐", "Pilih cara yang sesuai untukmu · +5 ⭐", "Wähle, was zu dir passt · +5 ⭐", "Escolha o que funciona para você · +5 ⭐"]
  };

  const catalog = window.LittleHeroLessonCatalog;
  const phrases = new Set(Object.keys(translations));
  if (catalog) {
    const add = (value) => {
      if (typeof value === "string") phrases.add(value);
      else if (Array.isArray(value)) value.forEach(add);
    };
    catalog.categories.forEach((category) => { add(category.name); add(category.desc); });
    catalog.lessons.forEach((lesson) => {
      ["title", "age", "duration", "goal", "story", "prompts", "answers", "activity"].forEach((key) => add(lesson[key]));
    });
    Object.values(catalog.lessonFollowUps).forEach((followUps) => followUps.forEach((item) => {
      add(item.story); add(item.prompt); add(item.answers);
    }));
    catalog.questSpecs.forEach((quest) => add(quest.label));
    catalog.challengeSpecs.forEach((challenge) => { add(challenge.title); add(challenge.subtitle); });
  }

  const existingTranslations = window.LittleHeroTranslations || {};
  const fallbacks = [
    "Let’s talk about this together.",
    "我们一起来聊聊吧。",
    "いっしょに話してみよう。",
    "함께 이야기해 봐요.",
    "Hablemos de esto juntos.",
    "Parlons-en ensemble.",
    "มาคุยเรื่องนี้ด้วยกันนะ",
    "Mari kita bicarakan bersama.",
    "Lass uns gemeinsam darüber sprechen.",
    "Vamos conversar sobre isso juntos."
  ];
  const localeText = {};
  phrases.forEach((phrase) => {
    const row = translations[phrase];
    localeText[phrase] = {};
    localeCodes.forEach((locale, index) => {
      const source = existingTranslations[locale];
      const existing = source && typeof source.get === "function" ? source.get(phrase) : "";
      localeText[phrase][locale] = row ? row[index] : (existing || fallbacks[index]);
    });
  });
  window.LittleHeroLessonLocaleText = localeText;
})();
