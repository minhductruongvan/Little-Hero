(() => {
  const localeCodes = ["en", "zh-CN", "ja", "ko", "es", "fr", "th", "id", "de", "pt-BR"];
  const fieldFallbacks = {
    title: [
      "Let’s learn together",
      "一起来学习吧",
      "いっしょに学ぼう",
      "함께 배워 봐요",
      "Aprendamos juntos",
      "Apprenons ensemble",
      "มาเรียนรู้ด้วยกันนะ",
      "Mari belajar bersama",
      "Lass uns gemeinsam lernen",
      "Vamos aprender juntos"
    ],
    goal: [
      "Practice understanding feelings, making safe choices, and asking a trusted adult for help.",
      "练习理解感受、做出安全的选择，并在需要时向可信赖的大人求助。",
      "気持ちを理解し、安全な選択をして、必要なときは信頼できる大人に助けを求める練習をしましょう。",
      "감정을 이해하고 안전한 선택을 하며, 필요할 때 믿을 수 있는 어른에게 도움을 요청하는 연습을 해요.",
      "Practicar cómo comprender las emociones, elegir opciones seguras y pedir ayuda a una persona adulta de confianza.",
      "Apprendre à comprendre les émotions, à faire des choix sûrs et à demander l’aide d’un adulte de confiance.",
      "ฝึกเข้าใจความรู้สึก เลือกสิ่งที่ปลอดภัย และขอความช่วยเหลือจากผู้ใหญ่ที่ไว้ใจได้",
      "Berlatih memahami perasaan, memilih tindakan yang aman, dan meminta bantuan orang dewasa tepercaya.",
      "Übe, Gefühle zu verstehen, sichere Entscheidungen zu treffen und eine vertraute erwachsene Person um Hilfe zu bitten.",
      "Praticar como compreender sentimentos, fazer escolhas seguras e pedir ajuda a um adulto de confiança."
    ],
    story: [
      "A child faces a situation and explores a kind, safe way to respond.",
      "孩子遇到一个情境，并一起想出友善、安全的应对方式。",
      "子どもがある場面に出会い、思いやりのある安全な対応を考えます。",
      "아이가 어떤 상황을 만나고 친절하고 안전하게 대처하는 방법을 생각해요.",
      "Un niño se encuentra en una situación y busca una forma amable y segura de responder.",
      "Un enfant rencontre une situation et cherche une façon bienveillante et sûre d’y répondre.",
      "เด็กพบสถานการณ์หนึ่งและลองคิดหาวิธีตอบสนองอย่างมีน้ำใจและปลอดภัย",
      "Anak menghadapi suatu situasi dan mencari cara yang baik serta aman untuk merespons.",
      "Ein Kind erlebt eine Situation und überlegt, wie es freundlich und sicher reagieren kann.",
      "Uma criança vivencia uma situação e pensa em uma forma gentil e segura de reagir."
    ],
    prompts: [
      "Talk about what happened, consider how everyone feels, and choose a safe, respectful response.",
      "聊一聊发生了什么，想想每个人的感受，并选择安全、尊重他人的做法。",
      "何が起きたかを話し、みんなの気持ちを考えて、安全で相手を尊重する対応を選びましょう。",
      "무슨 일이 있었는지 이야기하고, 모두의 기분을 생각한 뒤 안전하고 서로 존중하는 방법을 골라요.",
      "Hablen de lo ocurrido, piensen en cómo se siente cada persona y elijan una respuesta segura y respetuosa.",
      "Parlez de ce qui s’est passé, pensez aux émotions de chacun et choisissez une réponse sûre et respectueuse.",
      "พูดคุยว่าเกิดอะไรขึ้น ลองคิดถึงความรู้สึกของทุกคน และเลือกวิธีตอบสนองที่ปลอดภัยและเคารพกัน",
      "Bicarakan apa yang terjadi, pikirkan perasaan semua orang, lalu pilih respons yang aman dan saling menghormati.",
      "Sprecht darüber, was passiert ist, denkt an die Gefühle aller und wählt eine sichere und respektvolle Reaktion.",
      "Conversem sobre o que aconteceu, pensem nos sentimentos de todos e escolham uma resposta segura e respeitosa."
    ],
    answers: [
      "Choose a safe, respectful response and ask a trusted adult for help when needed.",
      "选择安全、尊重他人的做法，并在需要时向可信赖的大人求助。",
      "安全で相手を尊重する対応を選び、必要なときは信頼できる大人に助けを求めましょう。",
      "안전하고 서로 존중하는 방법을 고르고, 필요하면 믿을 수 있는 어른에게 도움을 요청해요.",
      "Elige una respuesta segura y respetuosa, y pide ayuda a una persona adulta de confianza cuando la necesites.",
      "Choisis une réponse sûre et respectueuse, et demande de l’aide à un adulte de confiance si nécessaire.",
      "เลือกวิธีที่ปลอดภัยและเคารพกัน และขอความช่วยเหลือจากผู้ใหญ่ที่ไว้ใจได้เมื่อจำเป็น",
      "Pilih respons yang aman dan saling menghormati, lalu mintalah bantuan orang dewasa tepercaya jika perlu.",
      "Wähle eine sichere und respektvolle Reaktion und bitte bei Bedarf eine vertraute erwachsene Person um Hilfe.",
      "Escolha uma resposta segura e respeitosa e peça ajuda a um adulto de confiança quando precisar."
    ],
    activity: [
      "Try a short activity together with a trusted adult.",
      "和可信赖的大人一起做一个简短的活动。",
      "信頼できる大人と一緒に、短い活動をしてみましょう。",
      "믿을 수 있는 어른과 함께 짧은 활동을 해 봐요.",
      "Prueba una actividad breve junto con una persona adulta de confianza.",
      "Faites une courte activité avec un adulte de confiance.",
      "ลองทำกิจกรรมสั้น ๆ ร่วมกับผู้ใหญ่ที่ไว้ใจได้",
      "Cobalah kegiatan singkat bersama orang dewasa tepercaya.",
      "Probiere gemeinsam mit einer vertrauten erwachsenen Person eine kurze Aktivität aus.",
      "Faça uma atividade curta junto com um adulto de confiança."
    ]
  };
  const simpleTranslations = {
    "3–6 tuổi": ["Ages 3–6", "3至6岁", "3～6歳", "3~6세", "De 3 a 6 años", "De 3 à 6 ans", "อายุ 3–6 ปี", "Usia 3–6 tahun", "3–6 Jahre", "De 3 a 6 anos"],
    "7–10 tuổi": ["Ages 7–10", "7至10岁", "7～10歳", "7~10세", "De 7 a 10 años", "De 7 à 10 ans", "อายุ 7–10 ปี", "Usia 7–10 tahun", "7–10 Jahre", "De 7 a 10 anos"],
    "3–5 phút": ["3–5 minutes", "3–5分钟", "3～5分", "3~5분", "3–5 minutos", "3 à 5 minutes", "3–5 นาที", "3–5 menit", "3–5 Minuten", "3–5 minutos"],
    "4–6 phút": ["4–6 minutes", "4–6分钟", "4～6分", "4~6분", "4–6 minutos", "4 à 6 minutes", "4–6 นาที", "4–6 menit", "4–6 Minuten", "4–6 minutos"]
  };
  const existing = window.LittleHeroLessonLocaleText;
  const localeText = existing && typeof existing === "object" && !Array.isArray(existing)
    ? Object.assign({}, existing)
    : {};
  const catalogs = [
    window.LittleHeroAdditionalLessons,
    window.LittleHeroSocialCreativeLessons
  ].filter(Array.isArray);
  const phrases = new Map();

  catalogs.forEach((catalog) => catalog.forEach((record) => {
    ["title", "age", "duration", "goal", "story", "prompts", "answers", "activity"].forEach((field) => {
      const value = record[field];
      (Array.isArray(value) ? value : [value]).forEach((phrase) => {
        if (typeof phrase === "string") phrases.set(phrase, field);
      });
    });
  }));

  const translations = window.LittleHeroTranslations || {};
  const getExistingTranslation = (locale, phrase) => {
    const table = translations[locale];
    if (table && typeof table.get === "function") return table.get(phrase);
    if (table && typeof table === "object") return table[phrase];
    return "";
  };

  phrases.forEach((field, phrase) => {
    const prior = localeText[phrase] && typeof localeText[phrase] === "object"
      ? localeText[phrase]
      : {};
    const row = {};
    localeCodes.forEach((locale, index) => {
      const priorValue = prior[locale];
      const dictionaryValue = getExistingTranslation(locale, phrase);
      const fallback = fieldFallbacks[field] || fieldFallbacks.prompts;
      const value = simpleTranslations[phrase]
        ? simpleTranslations[phrase][index]
        : (typeof priorValue === "string" && priorValue && priorValue !== phrase
          ? priorValue
          : (typeof dictionaryValue === "string" && dictionaryValue && dictionaryValue !== phrase
            ? dictionaryValue
            : fallback[index]));
      row[locale] = value;
    });
    localeText[phrase] = row;
  });

  window.LittleHeroLessonLocaleText = localeText;
})();
