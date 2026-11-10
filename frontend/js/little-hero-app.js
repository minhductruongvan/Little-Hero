    (() => {
      "use strict";

      const STORAGE_KEY = "little-hero-new-home-v1";
      const localHosts = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);
      const API_BASE = location.port === "5500"
        ? "http://127.0.0.1:31377"
        : localHosts.has(location.hostname)
          ? ""
          : (window.LITTLE_HERO_API_BASE || "");
      const apiUrl = (path) => `${API_BASE}${path}`;
      const localFileAuthMessage = location.protocol === "file:"
        ? "Bạn đang mở website trực tiếp bằng file:// nên trình duyệt chặn kết nối tài khoản. Hãy truy cập https://littlehero.id.vn hoặc chạy website qua Live Server cùng backend."
        : "";
      const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const DEMO_ACCOUNT = Object.freeze({
        email: "demo@littlehero.id.vn",
        password: "littlehero-demo",
        name: "Khách Little Hero"
      });
      const sampleForumPosts = [
        {
          id: "sample-forum-kindness",
          author: "Gia đình Mây",
          date: "Bài mẫu",
          body: "Hôm nay bé đã biết chờ đến lượt và nhường bạn chọn trò chơi trước. Một hành động nhỏ mà cả nhà đều vui! 🌱",
          isSample: true,
          liked: false,
          myReaction: "",
          reactionCounts: { "❤️": 8, "👍": 12, "👏": 6, "🤗": 3 },
          comments: [{ author: "Gia đình Thỏ", body: "Cùng ghi nhận những điều tử tế mỗi ngày nhé! 💚" }],
          shares: 2
        },
        {
          id: "sample-forum-safety",
          author: "Nhà Thỏ",
          date: "Bài mẫu",
          body: "Cả nhà vừa cùng Hero ôn lại quy tắc an toàn khi đi chơi: luôn ở gần người lớn và nhờ cô chú đáng tin cậy giúp đỡ khi cần. 🛡️",
          isSample: true,
          liked: false,
          myReaction: "",
          reactionCounts: { "❤️": 10, "👍": 7, "👏": 4, "🤗": 5 },
          comments: [{ author: "Gia đình Mây", body: "Ôn lại cùng nhau giúp bé nhớ lâu hơn ạ!" }],
          shares: 1
        },
        {
          id: "sample-forum-reading",
          author: "Gia đình Cầu Vồng",
          date: "Bài mẫu",
          body: "Góc đọc truyện cuối tuần: bé tự chọn cách giúp bạn trong câu chuyện rồi kể lại vì sao mình chọn như vậy. 📚✨",
          isSample: true,
          liked: false,
          myReaction: "",
          reactionCounts: { "❤️": 5, "👍": 9, "👏": 8, "🤗": 2 },
          comments: [{ author: "Nhà Thỏ", body: "Thật vui khi được nghe suy nghĩ của các bé!" }],
          shares: 3
        }
      ];
      const sampleReviews = [
        { id: "sample-review-routine", author: "Nguyễn Minh Anh", stars: 5, title: "Bé hào hứng học mỗi tối", body: "Các tình huống gần gũi nên con dễ hiểu và chịu kể lại cách mình sẽ làm. Gia đình mình thường cùng con chọn một bài trước giờ đi ngủ." },
        { id: "sample-review-practice", author: "Trần Thu Hà", stars: 5, title: "Dễ học cùng con", body: "Bài học ngắn, phần lựa chọn giúp bố mẹ có thêm chủ đề để trò chuyện với con. Bé thích nhất các nhân vật trong câu chuyện." },
        { id: "sample-review-family", author: "Lê Quang Huy", stars: 4, title: "Một hoạt động hữu ích cho cả nhà", body: "Nội dung nhẹ nhàng, phù hợp để bố mẹ cùng con luyện cách xử lý những tình huống thường gặp ở trường và khi đi chơi." },
        { id: "sample-review-progress", author: "Phạm Thảo Nhi", stars: 5, title: "Con nhớ được điều đã học", body: "Sau khi học về an toàn, con chủ động nhắc lại cần tìm người lớn đáng tin cậy khi thấy lo lắng. Cả nhà có thêm cách ôn bài vui vẻ." }
      ].map((review) => ({ ...review, isSample: true, helpful: 0 }));
      const { categories, lessonFollowUps, questSpecs, challengeSpecs } = window.LittleHeroLessonCatalog;
      const lessons = [...window.LittleHeroLessonCatalog.lessons, ...window.LittleHeroAdditionalLessons];
      const freshState = () => ({
        childName: "",
        leaderboardName: "",
        leaderboardProvince: "",
        leaderboardOptIn: false,
        age: 6,
        ageGroup: "3-6",
        interests: [],
        onboardingComplete: false,
        xp: 0,
        rp: 0,
        completed: [],
        completedDays: [],
        challenges: [],
        gameRewards: [],
        quiz: 0,
        sessionSeconds: 0,
        studySeconds: 0,
        dailyLessons: 0,
        dailyQuiz: 0,
        lessonMistakes: {},
        sessionDay: new Date().toLocaleDateString("sv-SE"),
        questClaims: [],
        outfit: 0,
        sound: false,
        darkMode: false,
        language: "vi",
        premium: false,
        premiumStatus: "inactive",
        premiumPlan: "",
        premiumExpiresAt: "",
        authenticated: false,
        demoAccount: false,
        accountEmail: "",
        dailyReviews: [],
        lastRoute: "",
        lastHomeScroll: 0,
        reviews: [],
        forumPosts: sampleForumPosts.map((post) => ({
          ...post,
          reactionCounts: { ...post.reactionCounts },
          comments: post.comments.map((comment) => ({ ...comment }))
        })),
        children: [],
        activeChildId: "",
        learningHistory: [],
        dailyUsage: {},
        dailyStudy: {},
        parentControls: { dailyLimit: 60, blockPurchases: true, safeContent: true, notifyLearning: true, notifyPractice: true },
        closet: { gender: "boy", hair: "curly", hairColor: "#624337", shirt: "#4ba6c5", pants: "#386b83", shoes: "#de6549", accessory: "cape", outfit: "classic" }
      });
      let state = freshState();
      let verifiedSubscription = null;
      const forumMediaUrls = new Map();
      let activeLessonRecognition = null;
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        if (stored && typeof stored === "object") state = { ...state, ...stored };
      } catch (error) {
        console.warn("Không thể đọc tiến độ Little Hero từ thiết bị.", error);
      }

      const childProgressFields = ["childName", "leaderboardName", "leaderboardProvince", "leaderboardOptIn", "age", "ageGroup", "interests", "onboardingComplete", "xp", "rp", "completed", "completedDays", "challenges", "gameRewards", "quiz", "sessionSeconds", "studySeconds", "dailyLessons", "dailyQuiz", "lessonMistakes", "sessionDay", "questClaims", "closet", "learningHistory", "dailyUsage", "dailyStudy"];
      const accountProgressFields = [...childProgressFields, "children", "activeChildId", "premium", "premiumStatus", "premiumPlan", "premiumExpiresAt", "parentControls", "reviews", "forumPosts", "dailyReviews"];
      const accountStorageKey = (email) => `${STORAGE_KEY}:account:${email}`;
      const leaderboardTokenKey = (email) => `${STORAGE_KEY}:leaderboard-token:${email}`;
      const leaderboardToken = () => {
        if (!state.authenticated || !state.accountEmail) return "";
        try { return sessionStorage.getItem(leaderboardTokenKey(state.accountEmail)) || ""; }
        catch (error) {
          console.warn("Không thể đọc phiên bảng xếp hạng.", error);
          return "";
        }
      };
      const normalizeProgressState = () => {
        if (!Array.isArray(state.children) || !state.children.length) {
          const childId = "child-1";
          state.children = [{ id: childId, name: state.childName || "Bé", age: 6, ...Object.fromEntries(childProgressFields.map((key) => [key, state[key]])) }];
          state.activeChildId = childId;
        }
        state.children.forEach((child) => {
          child.age = Math.max(3, Math.min(10, Number(child.age) || 6));
        });
        state.activeChildId = state.children.some((child) => child.id === state.activeChildId) ? state.activeChildId : state.children[0].id;
        const activeChild = state.children.find((child) => child.id === state.activeChildId);
        childProgressFields.forEach((key) => {
          if (activeChild[key] !== undefined) state[key] = activeChild[key];
        });
        state.childName = activeChild.name || state.childName;
        state.learningHistory = Array.isArray(state.learningHistory) ? state.learningHistory : [];
        state.gameRewards = Array.isArray(state.gameRewards) ? state.gameRewards : [];
        state.age = Math.max(3, Math.min(10, Number(state.age) || 6));
        state.ageGroup = state.age <= 6 ? "3-6" : "7-10";
        state.interests = Array.isArray(state.interests)
          ? state.interests.filter((id) => ["emotion", "social", "safety", "health", "thinking", "care", "creative", "community"].includes(id))
          : [];
        state.onboardingComplete = state.onboardingComplete === true;
        state.dailyUsage = state.dailyUsage && typeof state.dailyUsage === "object" ? state.dailyUsage : {};
        state.dailyStudy = state.dailyStudy && typeof state.dailyStudy === "object" ? state.dailyStudy : {};
        state.studySeconds = Number(state.studySeconds) || 0;
        state.language = state.language === "en" ? "en" : "vi";
        state.leaderboardName = typeof state.leaderboardName === "string" ? state.leaderboardName.slice(0, 24) : "";
        state.leaderboardProvince = window.LittleHeroLocations.regionByProvince[state.leaderboardProvince] ? state.leaderboardProvince : "";
        state.leaderboardOptIn = state.leaderboardOptIn === true;
        state.parentControls = { ...freshState().parentControls, ...(state.parentControls || {}) };
        state.premium = false;
        state.premiumStatus = "inactive";
        state.premiumPlan = "";
        state.premiumExpiresAt = "";
      };
      const loadAccountProgress = (email, accountName = "") => {
        let savedProgress = null;
        try {
          savedProgress = JSON.parse(localStorage.getItem(accountStorageKey(email)) || "null");
        } catch (error) {
          console.warn("Không thể đọc tiến độ của tài khoản Little Hero.", error);
        }
        const defaults = freshState();
        accountProgressFields.forEach((key) => {
          state[key] = savedProgress && savedProgress[key] !== undefined ? savedProgress[key] : defaults[key];
        });
        state.accountEmail = email;
        state.authenticated = true;
        state.demoAccount = false;
        if (!savedProgress && accountName) state.childName = accountName;
        normalizeProgressState();
      };
      const savedDemoAccount = state.authenticated === true && state.demoAccount === true;
      const savedAccountEmail = state.authenticated === true && typeof state.accountEmail === "string"
        ? state.accountEmail.trim().toLowerCase()
        : "";
      if (savedDemoAccount) {
        state.accountEmail = "";
        normalizeProgressState();
      } else if (savedAccountEmail.length <= 254 && validEmail(savedAccountEmail)) {
        loadAccountProgress(savedAccountEmail);
      } else {
        const defaults = freshState();
        accountProgressFields.forEach((key) => { state[key] = defaults[key]; });
        state.accountEmail = "";
        state.authenticated = false;
        state.demoAccount = false;
        normalizeProgressState();
      }
      document.documentElement.lang = state.language;
      state.reviews = (state.reviews || []).filter((review) => {
        const author = String(review.author || "").trim();
        const normalizedAuthor = author.toLocaleLowerCase();
        return author
          && normalizedAuthor !== "người dùng trên thiết bị"
          && normalizedAuthor !== "gia đình little hero"
          && !review.isSample
          && !String(review.id || "").startsWith("sample-review-")
          && !author.startsWith("Đánh giá mẫu");
      });
      const seededPostIds = new Set((state.forumPosts || []).map((post) => post.id));
      state.forumPosts = [...sampleForumPosts.filter((post) => !seededPostIds.has(post.id)), ...(state.forumPosts || [])];

      const $ = (selector, root = document) => root.querySelector(selector);
      const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      })[char]);
      const { safeWardrobe, renderHeroCharacterSvg, renderLessonCharacterSvg, setCharacterExpression } = window.createLittleHeroCharacterModel({ freshState, escapeHtml });
      const persist = () => {
        const child = state.children.find((entry) => entry.id === state.activeChildId);
        if (child) {
          child.name = state.childName || child.name;
          childProgressFields.forEach((key) => { child[key] = state[key]; });
        }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
          if (state.authenticated && state.accountEmail) {
            const accountProgress = Object.fromEntries(accountProgressFields.map((key) => [key, state[key]]));
            localStorage.setItem(accountStorageKey(state.accountEmail), JSON.stringify(accountProgress));
          }
        } catch (error) {
          console.warn("Không thể lưu tiến độ Little Hero trên thiết bị.", error);
          toast("Không lưu được tiến độ trên thiết bị này. Bé vẫn có thể tiếp tục trải nghiệm.");
        }
        queueLeaderboardSync();
        renderStats();
      };
      let parentUnlocked = false;
      const toast = (message) => {
        const region = $("#toastRegion");
        region.innerHTML = `<div class="toast" role="status">${escapeHtml(message)}</div>`;
        window.setTimeout(() => { region.innerHTML = ""; }, 3400);
      };
      const showDialog = (content) => {
        const dialog = $("#appDialog");
        dialog.dataset.parentConfirmation = "false";
        dialog.dataset.childOnboarding = "false";
        $("#dialogContent").innerHTML = content;
        if (!dialog.open) dialog.showModal();
      };
      const openChildOnboarding = () => {
        const dialog = $("#appDialog");
        const ageGroup = state.age <= 6 ? "3-6" : "7-10";
        const updateInterestOptions = (group) => {
          const allowed = ageCategories[group];
          form.querySelectorAll('input[name="interest"]').forEach((input) => {
            const available = allowed.includes(input.value);
            input.disabled = !available;
            input.closest("label").hidden = !available;
            if (!available) input.checked = false;
          });
        };
        const groupOptions = (group) => group === "3-6"
          ? [3, 4, 5, 6]
          : [7, 8, 9, 10];
        const renderAgeOptions = (group, selectedAge) => groupOptions(group).map((age) =>
          `<option value="${age}" ${age === selectedAge ? "selected" : ""}>${age} tuổi</option>`
        ).join("");
        const interestOptions = [
          ["emotion", "Cảm xúc & tự tin"], ["social", "Kết bạn & giao tiếp"], ["safety", "An toàn & tự bảo vệ"],
          ["health", "Sức khỏe & tự lập"], ["thinking", "Tư duy & quyết định"], ["care", "Trách nhiệm & môi trường"],
          ["creative", "Sáng tạo & khám phá"], ["community", "Cộng đồng & an toàn mạng"]
        ];
        showDialog(`<div class="dialog-inner onboarding-dialog">
          <div class="dialog-head"><div><span class="kicker">BẮT ĐẦU HÀNH TRÌNH</span><h2 id="dialogTitle">Cùng Hero chọn hành trình cho bé</h2>
            <p>Thông tin này giúp gợi ý bài học và ghép nhóm đấu trường phù hợp với độ tuổi.</p></div>
            <button class="onboarding-dismiss" id="dismissChildOnboarding" type="button" aria-label="Để thiết lập độ tuổi sau">Để sau</button></div>
          <form id="childOnboardingForm">
            <fieldset class="onboarding-group"><legend>Bé thuộc nhóm tuổi nào?</legend>
              <label class="onboarding-age-option"><input type="radio" name="ageGroup" value="3-6" ${ageGroup === "3-6" ? "checked" : ""}><span><strong>3–6 tuổi</strong><small>Bài học gần gũi, từng bước</small></span></label>
              <label class="onboarding-age-option"><input type="radio" name="ageGroup" value="7-10" ${ageGroup === "7-10" ? "checked" : ""}><span><strong>7–10 tuổi</strong><small>Tình huống và thử thách đa dạng</small></span></label>
            </fieldset>
            <label class="form-label" for="onboardingAge">Độ tuổi của bé
              <select id="onboardingAge" name="age" required>${renderAgeOptions(ageGroup, Math.max(ageGroup === "3-6" ? 3 : 7, Math.min(ageGroup === "3-6" ? 6 : 10, state.age)))}</select>
            </label>
            <fieldset class="onboarding-group"><legend>Bé quan tâm đến chủ đề nào? <span>(chọn một hoặc nhiều)</span></legend>
              <div class="onboarding-interests">${interestOptions.map(([id, label]) => `<label><input type="checkbox" name="interest" value="${id}" ${state.interests.includes(id) ? "checked" : ""}><span>${label}</span></label>`).join("")}</div>
            </fieldset>
            <p class="onboarding-error" id="onboardingError" role="alert" hidden></p>
            <button class="btn btn-mint" type="submit">Lưu lựa chọn & bắt đầu học →</button>
          </form>
        </div>`);
        dialog.dataset.childOnboarding = "true";
        const form = $("#childOnboardingForm", dialog);
        const ageSelect = $("#onboardingAge", form);
        $("#dismissChildOnboarding", dialog).addEventListener("click", () => {
          state.onboardingComplete = true;
          dialog.dataset.childOnboarding = "false";
          persist();
          closeDialog();
        });
        form.querySelectorAll('input[name="ageGroup"]').forEach((input) => input.addEventListener("change", () => {
          ageSelect.innerHTML = renderAgeOptions(input.value, input.value === "3-6" ? 6 : 7);
          updateInterestOptions(input.value);
        }));
        updateInterestOptions(ageGroup);
        ageSelect.addEventListener("change", () => {
          const group = Number(ageSelect.value) <= 6 ? "3-6" : "7-10";
          const radio = form.querySelector(`input[name="ageGroup"][value="${group}"]`);
          if (radio) radio.checked = true;
        });
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          const selectedInterests = [...form.querySelectorAll('input[name="interest"]:checked')].map((input) => input.value);
          const age = Number(ageSelect.value);
          if (!selectedInterests.length) {
            const error = $("#onboardingError", form);
            error.textContent = "Hãy chọn ít nhất một chủ đề bé yêu thích nhé.";
            error.hidden = false;
            return;
          }
          if (!Number.isInteger(age) || age < 3 || age > 10) return;
          const child = state.children.find((entry) => entry.id === state.activeChildId);
          state.age = age;
          state.ageGroup = age <= 6 ? "3-6" : "7-10";
          state.interests = selectedInterests;
          state.onboardingComplete = true;
          if (child) {
            child.age = age;
            childProgressFields.forEach((key) => { child[key] = state[key]; });
          }
          dialog.dataset.childOnboarding = "false";
          closeDialog();
          persist();
          renderDropdown();
          renderIslands();
          renderFeatured();
          renderStories();
          setRoute(route, { restore: true, pop: true });
          toast(`Đã lưu hành trình cho bé ${age} tuổi.`);
        });
      };
      const showOnboardingIfNeeded = (force = false) => {
        if (state.authenticated && (force || !state.onboardingComplete)) openChildOnboarding();
      };
      let activeSpeech = null;
      const updateSpeechControls = (speaking) => {
        const stopButton = $("#lessonStopSpeech");
        if (!stopButton) return;
        stopButton.disabled = !speaking;
        stopButton.setAttribute("aria-pressed", String(speaking));
      };
      const stopSpeech = () => {
        if (!("speechSynthesis" in window)) return;
        activeSpeech = null;
        window.speechSynthesis.cancel();
        updateSpeechControls(false);
      };
      window.addEventListener("pagehide", stopSpeech);
      const speak = (text, onComplete) => {
        if (!("speechSynthesis" in window)) {
          toast("Trình duyệt chưa hỗ trợ giọng đọc. Bé vẫn có thể đọc nội dung trên màn hình.");
          onComplete?.();
          return false;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        activeSpeech = utterance;
        updateSpeechControls(true);
        utterance.lang = state.language === "en" ? "en-US" : "vi-VN";
        utterance.rate = 0.92;
        const speechPrefix = state.language === "en" ? "en" : "vi";
        const preferredVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith(speechPrefix));
        if (preferredVoice) utterance.voice = preferredVoice;
        let completed = false;
        const finishSpeech = () => {
          if (completed) return;
          completed = true;
          if (activeSpeech !== utterance) return;
          activeSpeech = null;
          updateSpeechControls(false);
          onComplete?.();
        };
        utterance.onerror = (event) => {
          if (event.error !== "canceled" && event.error !== "interrupted") toast("Không thể phát giọng đọc trên thiết bị này.");
          finishSpeech();
        };
        utterance.onend = finishSpeech;
        window.speechSynthesis.speak(utterance);
        return true;
      };
      const closeDialog = () => {
        if ($("#appDialog").dataset.childOnboarding === "true") return;
        $("#appDialog").close();
      };
      const closeParentConfirmation = () => {
        const dialog = $("#appDialog");
        if (dialog.dataset.parentConfirmation !== "true") { closeDialog(); return; }
        dialog.dataset.parentConfirmation = "false";
        closeDialog();
        if (route === "parents") setRoute("home");
      };
      const closeOpenDialog = () => {
        if ($("#appDialog").dataset.childOnboarding === "true") return;
        if ($("#appDialog").dataset.parentConfirmation === "true") closeParentConfirmation();
        else closeDialog();
      };
      const lessonById = (id) => lessons.find((lesson) => lesson.id === id);
      const ageCategories = {
        "3-6": ["emotion", "social", "safety", "health", "care", "creative"],
        "7-10": ["emotion", "social", "safety", "thinking", "care", "creative", "community"]
      };
      const currentAgeGroup = () => state.age <= 6 ? "3-6" : "7-10";
      const currentAgeLabel = () => currentAgeGroup() === "3-6" ? "3–6 tuổi" : "7–10 tuổi";
      const ageAppropriateCategories = () => categories.filter((category) => ageCategories[currentAgeGroup()].includes(category.id));
      const ageAppropriateLessons = () => {
        const available = lessons
          .filter((lesson) => ageCategories[currentAgeGroup()].includes(lesson.category))
          .map((lesson) => ({ ...lesson, age: currentAgeLabel() }));
        return available.sort((a, b) => Number(state.interests.includes(b.category)) - Number(state.interests.includes(a.category)));
      };
      const completedCount = () => state.completed.length;
      const currentDay = () => new Date().toLocaleDateString("sv-SE");
      const recordLearningAttempt = (lesson, choice, questionIndex = 0, correctIndex = lesson.correct) => {
        state.learningHistory.push({ lessonId: lesson.id, questionIndex, choice, correct: choice === correctIndex, at: new Date().toISOString() });
        state.learningHistory = state.learningHistory.slice(-500);
      };
      const subscriptionPlans = {
        monthly: {
          name: "Hành trang Tự Tin – Gói tháng",
          title: "Hành trang Tự Tin",
          caption: "GÓI THÁNG · HỌC VUI CÙNG HERO",
          badge: "BẮT ĐẦU NHẸ NHÀNG",
          image: "./frontend/assets/emotion-classroom.png",
          imageAlt: "Hero và bạn cùng học trong lớp mỹ thuật",
          price: 49000,
          durationDays: 30,
          features: ["12 bài học kỹ năng cốt lõi", "Truyện tương tác và trò chơi", "Sao thưởng sau mỗi bài"]
        },
        yearly: {
          name: "Cùng Hero Mỗi Ngày – Gói năm",
          title: "Cùng Hero Mỗi Ngày",
          caption: "GÓI NĂM · CẢ NHÀ CÙNG TIẾN BỘ",
          badge: "ĐỒNG HÀNH TRỌN NĂM",
          image: "./frontend/assets/safety-supermarket.png",
          imageAlt: "Hero thực hành kỹ năng an toàn tại quầy thông tin",
          price: 399000,
          durationDays: 365,
          features: ["Toàn bộ nội dung gói tháng", "Báo cáo tiến độ dành cho phụ huynh", "Tiết kiệm 189.000đ so với gia hạn theo tháng"]
        }
      };
      const PAYMENT_CONFIG = {
        bankName: "MB Bank",
        accountName: "LITTLE HERO",
        accountNumber: "16030616032006"
      };
      const freeLessonIds = new Set(categories.map((category) => category.lesson));
      const hasVerifiedPremium = () => Boolean(verifiedSubscription
        && verifiedSubscription.status === "active"
        && ["monthly", "yearly"].includes(verifiedSubscription.plan)
        && Number.isFinite(Date.parse(verifiedSubscription.expiresAt || ""))
        && Date.parse(verifiedSubscription.expiresAt) > Date.now());
      const hasYearlyPremium = () => hasVerifiedPremium() && verifiedSubscription.plan === "yearly";
      const isPremiumLesson = (lesson) => !freeLessonIds.has(lesson.id);
      const renderLockedPlanPage = (title, description) => {
        $("#routeView").innerHTML = pageShell("pricing", description, `
          <article class="locked-plan-panel">
            <span class="catalog-icon" aria-hidden="true">🔒</span>
            <div><h2>${escapeHtml(title)}</h2><p>${escapeHtml(description)}</p></div>
            <div class="page-actions"><a class="btn btn-primary" href="#/pricing" data-route="pricing">Xem các gói Premium →</a><a class="btn btn-light" href="#/lessons" data-route="lessons">Về kho bài học</a></div>
          </article>`, "QUYỀN TRUY CẬP");
      };
      const GOOGLE_CLIENT_ID = "";
      const refreshDay = () => {
        if (state.sessionDay !== currentDay()) {
          state.sessionDay = currentDay();
          state.sessionSeconds = 0;
          state.studySeconds = 0;
          state.dailyLessons = 0;
          state.dailyQuiz = 0;
          state.questClaims = state.questClaims.filter((claim) => claim.startsWith(`${state.sessionDay}:`));
          persist();
        }
      };
      const streak = () => {
        const days = new Set(state.completedDays);
        let count = 0;
        const cursor = new Date();
        if (!days.has(cursor.toLocaleDateString("sv-SE"))) cursor.setDate(cursor.getDate() - 1);
        while (days.has(cursor.toLocaleDateString("sv-SE"))) {
          count += 1;
          cursor.setDate(cursor.getDate() - 1);
        }
        return count;
      };
      const renderStats = () => {
        refreshDay();
        $("#childName").textContent = state.childName || "bạn nhỏ";
        const closet = safeWardrobe(state.closet);
        state.closet = closet;
        const wardrobeKey = JSON.stringify(closet);
        $(".mascot").style.setProperty("--hero-shirt", closet.shirt);
        $(".mascot").style.setProperty("--hero-pants", closet.pants);
        $(".mascot").style.setProperty("--hero-shoes", closet.shoes);
        $(".mascot").style.setProperty("--hero-cape", closet.accessory === "cape" ? closet.shirt : "#f49a69");
        if ($(".mascot").dataset.wardrobe !== wardrobeKey) {
          $(".mascot").innerHTML = renderHeroCharacterSvg(closet, { ariaLabel: "Hero cá nhân hóa" });
          $(".mascot").dataset.wardrobe = wardrobeKey;
        }
        ["ctaHero", "aboutHero", "journeyHero", "parentHero", "articleHero"].forEach((id) => {
          const mascot = $(`#${id}`);
          if (mascot && mascot.dataset.wardrobe !== wardrobeKey) {
            mascot.innerHTML = renderHeroCharacterSvg(closet, { ariaLabel: "Hero đồng hành cùng bé" });
            mascot.dataset.wardrobe = wardrobeKey;
          }
        });
        $("#accountMenuName").textContent = state.childName || "Tài khoản";
        $("#accountMenuGreeting").textContent = state.childName ? `Xin chào, ${state.childName}` : "Chào bạn nhỏ";
        $("#accountBtn").hidden = state.authenticated;
        $("#accountBtn").textContent = "Đăng nhập / đăng ký";
        $("#logoutBtn").hidden = !state.authenticated;
        document.body.dataset.authenticated = String(state.authenticated);
        $("#upgradeBtn").textContent = state.premium ? "♛ Premium của bé" : "♛ Premium";
        $("#xpValue").textContent = `${state.xp} · Lv ${Math.floor(state.xp / 100) + 1}`;
        $("#streakValue").textContent = `${streak()} ngày`;
        $("#timeToday").textContent = `${Math.floor(state.sessionSeconds / 60)} phút`;
        $("#journalLessons").textContent = completedCount();
        $("#journalStars").textContent = `${state.xp} ⭐`;
        $("#journalDays").textContent = state.completedDays.length;
        const savedReviews = (state.reviews || []).filter((review) => !review.isSample);
        const testimonialColors = [["#f2faf5", "#39a454"], ["#fff9ed", "#ff9d22"], ["#f1f9ff", "#1684e8"], ["#f8f1ff", "#9138e8"]];
        const homeReviews = savedReviews.length
          ? [...savedReviews].slice(-4).reverse()
          : sampleReviews;
        $("#homeTestimonials").innerHTML = homeReviews.length
          ? homeReviews.map((review, index) => {
            const [background, color] = testimonialColors[index % testimonialColors.length];
            const stars = Math.max(1, Math.min(5, Number(review.stars) || 0));
            const author = String(review.author).trim();
            return `<article class="testimonial-card" style="--testimonial-bg:${background};--testimonial-color:${color}">
              <div class="testimonial-person"><span class="testimonial-avatar" aria-hidden="true">${escapeHtml(Array.from(author)[0] || "L")}</span><span class="testimonial-meta"><span class="testimonial-name">${escapeHtml(author)}</span><span class="review-stars" aria-label="${stars} trên 5 sao">${"★".repeat(stars)}${"☆".repeat(5 - stars)}</span></span></div>
              <blockquote class="testimonial-quote">“${escapeHtml(review.body)}”</blockquote>
            </article>`;
          }).join("")
          : "";
        $("#journalTip").textContent = completedCount()
          ? "Cùng bé thử hoạt động ngoài đời trong bài vừa học, rồi khen nỗ lực của con."
          : "Chọn một bài học để Hero tìm hoạt động phù hợp cùng bé.";
        $("#rankPoints").textContent = `${state.rp} RP`;
        renderQuests();
        renderChallengeList();
      };

      const renderDropdown = () => {
        $("#lessonDropdown").innerHTML = ageAppropriateCategories().map((category) =>
          `<a href="#/lessons/${category.id}" data-route="lessons/${category.id}">${category.icon} &nbsp; ${category.name}</a>`
        ).join("");
      };
      const renderJourneyMap = (container, detailed = false) => {
        const islandColors = ["#f28b62", "#8d82d4", "#4ba9cf", "#46a87c", "#e7ad45", "#67a258", "#dc79ae", "#548fc2"];
        const stops = [
          [16, 19], [38, 14], [66, 24], [89, 44],
          [76, 62], [49, 68], [18, 83], [48, 89]
        ];
        const path = "M 160 117 C 225 57 305 55 380 90 S 570 96 666 152 S 820 208 893 270 S 828 357 761 388 S 620 433 486 421 S 300 427 182 516 S 330 580 475 551";
        const stopMarkup = ageAppropriateCategories().map((category) => {
          const index = categories.findIndex((item) => item.id === category.id);
          const lesson = lessonById(category.lesson);
          const done = Boolean(lesson && state.completed.includes(lesson.id));
          const [left, top] = stops[index];
          return `<button class="journey-stop" style="left:${left}%;top:${top}%;--island-left:${left}%;--island-top:${top}%;--island-color:${islandColors[index]}" data-lesson="${category.lesson}" data-category="${category.id}" title="${escapeHtml(lesson?.title || category.name)}" aria-label="${escapeHtml(category.name)}: ${escapeHtml(lesson?.title || category.name)}">
            <span class="number">ĐIỂM ${String(index + 1).padStart(2, "0")}</span><span class="island-icon" aria-hidden="true">${category.icon}</span>
            <h3>${escapeHtml(lesson?.title || category.name)}</h3><p>${escapeHtml(category.name)}</p>
            <span class="count">${done ? "✓ Đã hoàn thành" : "▶ Bắt đầu bài học"}</span>
          </button>`;
        }).join("");
        container.classList.toggle("detailed", detailed);
        container.innerHTML = `<svg class="journey-scenery" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="mapSea" x2="0" y2="1"><stop stop-color="#58c8e0"/><stop offset="1" stop-color="#128ac1"/></linearGradient>
            <linearGradient id="mapGrass" x2="0" y2="1"><stop stop-color="#b6e978"/><stop offset="1" stop-color="#66bd58"/></linearGradient>
            <filter id="mapShadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#255e6570"/></filter></defs>
          <rect width="1000" height="620" fill="url(#mapSea)"/>
          <path d="M0 355Q105 315 195 345T370 355T550 345T725 355T1000 330M0 544Q170 510 300 545T560 550T810 525T1000 548" fill="none" stroke="#b8efff77" stroke-width="8"/>
          <path d="M0 205Q115 185 210 205T390 204T600 198T790 211T1000 188" fill="none" stroke="#e5fbff70" stroke-width="4"/>
          <path d="M58 116Q62 47 140 54Q205 48 236 101Q262 135 225 163Q151 186 73 160Q44 145 58 116Z" fill="url(#mapGrass)" stroke="#fff8e6" stroke-width="20" filter="url(#mapShadow)"/>
          <path d="M269 81Q282 21 358 29Q435 22 467 72Q492 111 453 135Q380 158 296 130Q259 111 269 81Z" fill="url(#mapGrass)" stroke="#fff8e6" stroke-width="20" filter="url(#mapShadow)"/>
          <path d="M554 150Q563 77 650 83Q735 72 766 137Q789 177 742 207Q661 229 580 198Q544 179 554 150Z" fill="url(#mapGrass)" stroke="#fff8e6" stroke-width="20" filter="url(#mapShadow)"/>
          <path d="M784 265Q790 194 875 204Q959 201 981 254Q1002 303 950 326Q864 345 806 316Q777 297 784 265Z" fill="url(#mapGrass)" stroke="#fff8e6" stroke-width="20" filter="url(#mapShadow)"/>
          <path d="M651 384Q659 312 741 321Q820 316 851 372Q870 413 828 440Q748 463 674 432Q642 415 651 384Z" fill="url(#mapGrass)" stroke="#fff8e6" stroke-width="20" filter="url(#mapShadow)"/>
          <path d="M373 418Q380 346 465 354Q550 344 579 403Q601 445 555 474Q469 497 396 464Q365 448 373 418Z" fill="url(#mapGrass)" stroke="#fff8e6" stroke-width="20" filter="url(#mapShadow)"/>
          <path d="M75 512Q81 445 162 451Q244 442 276 499Q296 541 252 567Q172 590 99 559Q68 542 75 512Z" fill="url(#mapGrass)" stroke="#fff8e6" stroke-width="20" filter="url(#mapShadow)"/>
          <path d="M368 547Q375 483 454 489Q538 478 569 533Q589 572 546 599Q465 620 391 588Q359 572 368 547Z" fill="url(#mapGrass)" stroke="#fff8e6" stroke-width="20" filter="url(#mapShadow)"/>
          <g fill="none" stroke="#d3aa69" stroke-width="5" opacity=".9"><path d="M58 116Q62 47 140 54Q205 48 236 101Q262 135 225 163Q151 186 73 160Q44 145 58 116Z"/><path d="M269 81Q282 21 358 29Q435 22 467 72Q492 111 453 135Q380 158 296 130Q259 111 269 81Z"/><path d="M554 150Q563 77 650 83Q735 72 766 137Q789 177 742 207Q661 229 580 198Q544 179 554 150Z"/><path d="M784 265Q790 194 875 204Q959 201 981 254Q1002 303 950 326Q864 345 806 316Q777 297 784 265Z"/><path d="M651 384Q659 312 741 321Q820 316 851 372Q870 413 828 440Q748 463 674 432Q642 415 651 384Z"/><path d="M373 418Q380 346 465 354Q550 344 579 403Q601 445 555 474Q469 497 396 464Q365 448 373 418Z"/><path d="M75 512Q81 445 162 451Q244 442 276 499Q296 541 252 567Q172 590 99 559Q68 542 75 512Z"/><path d="M368 547Q375 483 454 489Q538 478 569 533Q589 572 546 599Q465 620 391 588Q359 572 368 547Z"/></g>
          <g fill="none" stroke="#b47b3c" stroke-width="12" stroke-linecap="round"><path d="M210 164Q259 110 299 114"/><path d="M458 129Q519 134 572 156"/><path d="M740 199Q798 211 811 249"/><path d="M807 326Q783 355 768 377"/><path d="M662 431Q611 436 568 438"/><path d="M389 464Q318 483 263 511"/><path d="M258 555Q314 575 381 558"/></g>
          <path d="M410 290C462 261 493 270 520 296S572 328 608 298" fill="none" stroke="#ffdf7b" stroke-width="9" stroke-linecap="round"/>
          <path d="M427 282C460 252 496 255 523 281" fill="none" stroke="#f47277" stroke-width="8" stroke-linecap="round"/><path d="M433 278C463 252 495 257 518 280" fill="none" stroke="#ffd55e" stroke-width="6" stroke-linecap="round"/><path d="M441 275C467 255 493 260 513 279" fill="none" stroke="#7bcb82" stroke-width="5" stroke-linecap="round"/>
          <g fill="#fff"><path d="M82 42q10-17 24 0q16-20 30 1q13-9 22 7H78q-8-4 4-8Z"/><path d="M704 61q10-19 25 0q17-20 31 1q14-10 22 7h-80q-8-4 2-8Z"/><path d="M900 107q9-17 22 0q14-18 28 1q12-8 19 6h-72q-7-4 3-7Z"/></g>
          <circle cx="522" cy="44" r="23" fill="#ffd95c"/><path d="M522 11v-9m0 85v-9m-33-34h-9m85 0h-9m-58-23-7-7m61 61-7-7m0-47 7-7m-61 61 7-7" stroke="#ffd95c" stroke-width="6" stroke-linecap="round"/>
          <g fill="#438d43"><circle cx="82" cy="89" r="20"/><circle cx="105" cy="75" r="27"/><circle cx="132" cy="90" r="24"/><circle cx="706" cy="121" r="21"/><circle cx="735" cy="112" r="29"/><circle cx="759" cy="126" r="22"/><circle cx="173" cy="472" r="22"/><circle cx="202" cy="462" r="28"/><circle cx="228" cy="481" r="23"/></g>
          <g fill="none" stroke="#805a37" stroke-linecap="round" stroke-linejoin="round">
            <path d="M131 112Q128 79 142 58" stroke-width="8"/><path d="M142 58Q109 37 95 53Q119 53 140 63M142 58Q143 27 166 23Q158 44 145 61M144 61Q171 43 189 56Q165 59 146 66M140 62Q112 62 108 81Q126 73 142 68" stroke="#367c47" stroke-width="6"/>
            <path d="M434 99Q430 68 442 47" stroke-width="8"/><path d="M442 47Q413 29 395 42Q421 42 440 52M442 47Q450 19 471 17Q459 39 446 52M444 51Q469 37 485 51Q463 52 446 57" stroke="#367c47" stroke-width="6"/>
            <path d="M884 300Q880 268 894 248" stroke-width="8"/><path d="M894 248Q866 228 850 243Q876 241 892 253M894 248Q902 220 923 218Q909 240 898 253M896 253Q922 237 939 250Q916 253 898 259" stroke="#367c47" stroke-width="6"/>
          </g>
          <g fill="#8c9aa0" stroke="#eef3d6" stroke-width="3"><path d="M76 143l15-20 18 18-8 10H82Z"/><path d="M317 114l13-17 17 15-5 12h-19Z"/><path d="M700 184l16-21 20 17-8 14h-22Z"/><path d="M690 410l12-16 17 15-4 11h-22Z"/></g>
          <g fill="none" stroke="#d7a45d" stroke-linecap="round"><path d="M217 151Q255 106 296 112M463 125Q518 130 568 154M747 206Q792 216 812 254M806 331Q783 354 769 379M657 428Q611 435 568 439M388 466Q319 482 263 511M257 554Q314 575 381 557" stroke-width="17" stroke-dasharray="4 8"/>
            <path d="M225 147l-2 12m13-25 0 13m12-24 2 13m13-19 2 12m13-15 1 12m196 26-1 12m15-10-2 12m15-7-2 12m15-3-2 12m171 31 5 10m13-5 5 11m-12 138-9-8m-7 22-10-6m-153 42-2 11m-20-11-2 11m-200 46-7-9m-15 19-7-9m116 73 1-12m18 13 1-12m18 11 1-12" stroke-width="3"/>
          </g>
          <g fill="#fff" opacity=".92"><path d="M282 249q10-9 18 0q-8 9-18 0Zm12 14q10-9 18 0q-8 9-18 0Zm-35 22q8-7 15 0q-7 7-15 0Z"/><path d="M767 502q10-9 18 0q-8 9-18 0Zm14 14q10-9 18 0q-8 9-18 0Z"/></g>
          <g fill="none" stroke="#e8fbff" stroke-width="3"><path d="M840 108h38l-17 13h-19Z"/><path d="M859 105v-30l18 30Z" fill="#fff"/><path d="M127 283h39l-17 13h-20Z"/><path d="M148 280v-29l18 29Z" fill="#fff"/></g>
          <g fill="#ffd967"><circle cx="42" cy="480" r="5"/><circle cx="55" cy="492" r="5"/><circle cx="30" cy="500" r="5"/><circle cx="926" cy="504" r="5"/><circle cx="943" cy="491" r="5"/><circle cx="955" cy="508" r="5"/></g>
        </svg><svg class="journey-path" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true"><path d="${path}" fill="none" stroke="#eaffdb" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/><path d="${path}" fill="none" stroke="#7cbb83" stroke-width="7" stroke-dasharray="1 17" stroke-linecap="round"/></svg>${stopMarkup}`;
      };
      const renderIslands = () => {
        const islandGrid = $("#islandGrid");
        if (islandGrid) renderJourneyMap(islandGrid);
      };
      const lessonImages = {
        emotion: { src: "./frontend/assets/emotion-calm-room.png", alt: "Các bạn nhỏ cùng Hero nhận biết cảm xúc trong phòng chơi" },
        social: { src: "./frontend/assets/emotion-classroom.png", alt: "Hero và bạn cùng học trong lớp mỹ thuật" },
        safety: { src: "./frontend/assets/safety-supermarket.png", alt: "Hero thực hành kỹ năng an toàn tại quầy thông tin" },
        health: { src: "./frontend/assets/lesson-handwashing.png", alt: "Hero hướng dẫn Mia rửa tay trong bếp" },
        thinking: { src: "./frontend/assets/emotion-calm-room.png", alt: "Các bạn nhỏ cùng Hero suy nghĩ và giải quyết tình huống" },
        care: { src: "./frontend/assets/lesson-playground-cleanup.png", alt: "Hero và Linh cùng giữ sân chơi sạch đẹp" },
        creative: { src: "./frontend/assets/lesson-safe-bicycle.png", alt: "Hero và bố hướng dẫn Bin tập xe an toàn" },
        community: { src: "./frontend/assets/safety-supermarket.png", alt: "Hero thực hành nhận biết và xử lý tình huống an toàn" }
      };
      const lessonSceneImages = {
        health: lessonImages.health,
        care: lessonImages.care,
        creative: lessonImages.creative
      };
      const lessonImage = (categoryId) => lessonImages[categoryId] || lessonImages.emotion;
      const renderFeatured = (lesson) => {
        const available = ageAppropriateLessons();
        if (!available.some((item) => item.id === lesson?.id)) {
          lesson = available.find((item) => !state.completed.includes(item.id)) || available[0];
        }
        const category = categories.find((item) => item.id === lesson.category);
        const image = lessonImage(lesson.category);
        $("#featuredLesson").innerHTML = `<div class="lesson-art" style="--lesson-color:${category.color}">
          <img class="lesson-art-image" src="${image.src}" alt="${escapeHtml(image.alt)}" loading="lazy">
          <span class="lesson-emoji" aria-hidden="true">${lesson.icon}</span><span class="lesson-note">✦ TÌNH HUỐNG GẦN GŨI</span>
        </div><div class="lesson-copy"><span class="tag">${category.icon} ${escapeHtml(category.name)}</span>
          <h3>${escapeHtml(lesson.title)}</h3><p>${escapeHtml(lesson.goal)}</p>
          <div class="lesson-meta"><span>♧ ${lesson.age}</span><span>◷ ${lesson.duration}</span><span>⭐ +${lesson.reward}</span></div>
          <button class="btn btn-mint btn-small" data-route="lessons/${category.id}">${state.completed.includes(lesson.id) ? "Xem lại chủ đề →" : "Khám phá chủ đề →"}</button>
        </div>`;
      };
      const storyComingSoonNotice = `<div class="story-coming-soon"><img src="./frontend/assets/stories-coming-soon.png" alt="Tính năng truyện đọc đang được đội ngũ LITTLE HERO xây dựng và phát triển" loading="lazy"></div>`;
      const renderStories = () => {
        $("#storyGrid").innerHTML = storyComingSoonNotice;
      };

      const dailyProgress = (id) => {
        if (id === "lessons") return Math.min(3, state.dailyLessons);
        if (id === "minutes") return Math.min(10, Math.floor(state.sessionSeconds / 60));
        return Math.min(1, state.dailyQuiz);
      };
      const renderQuests = () => {
        const progress = questSpecs.map((quest) => {
          const value = dailyProgress(quest.id);
          const claimed = state.questClaims.includes(`${currentDay()}:${quest.id}`);
          return `<div class="quest"><div class="quest-title"><span>${quest.icon} ${quest.label}</span><span>${claimed ? "✓ " : ""}${value}/${quest.target}</span></div>
            <div class="progress"><i style="width:${Math.round(value / quest.target * 100)}%"></i></div></div>`;
        }).join("");
        const allClaimed = questSpecs.every((quest) => state.questClaims.includes(`${currentDay()}:${quest.id}`));
        $("#dailyQuests").innerHTML = `<div class="quest-intro"><strong>🎯 Nhiệm vụ hôm nay</strong><span>Mỗi bước nhỏ đều đáng khen.</span></div>${progress}
          <button class="collect" id="claimQuests" ${allClaimed ? "disabled" : ""}>${allClaimed ? "Đã nhận ✓" : "Nhận sao ✨"}</button>`;
      };

      let leaderboardRequestId = 0;
      let leaderboardSyncTimer = null;
      let arenaLeaderboardInterval = null;
      const sampleLeaderboardNames = ["Mây Nhỏ", "Cá Heo", "Bé Sóc", "Thỏ Nâu", "Gấu Nhỏ", "Mầm Xanh", "Sao Mai", "Chim Non"];
      const exampleLeaderboardPlayers = window.LittleHeroLocations.provinces.flatMap(({ name: province }, provinceIndex) =>
        ["3-6", "7-10"].flatMap((ageGroup, ageIndex) =>
          sampleLeaderboardNames.slice(ageIndex * 4, ageIndex * 4 + 4).map((name, playerIndex) => ({
            name: `${name} ${String(provinceIndex + 1).padStart(2, "0")}`,
            province,
            ageGroup,
            points: 1900 - provinceIndex * 13 - ageIndex * 70 - playerIndex * 17
          }))
        )
      );
      let leaderboardViewProvince = state.leaderboardProvince || "Đà Nẵng";
      const leaderboardProvinceOptions = () => window.LittleHeroLocations.provinces.map(({ name }) =>
        `<option value="${escapeHtml(name)}" ${leaderboardViewProvince === name ? "selected" : ""}>${escapeHtml(name)}</option>`
      ).join("");
      const leaderboardLocationControl = (id) => `
        <label class="leaderboard-view-control" id="${id}Wrap"><span>Xem bảng theo tỉnh/thành</span>
          <select id="${id}" aria-label="Chọn tỉnh/thành để xem bảng xếp hạng">${leaderboardProvinceOptions()}</select>
        </label>`;
      const leaderboardScopeLabel = (mode) => ({
        duel: `Nhóm ${currentAgeLabel()}`,
        region: window.LittleHeroLocations.regions[window.LittleHeroLocations.regionByProvince[leaderboardViewProvince]],
        city: leaderboardViewProvince,
        nation: "Toàn quốc"
      }[mode]);
      const syncLeaderboardLocationControls = () => {
        ["homeLeaderboardProvince", "arenaLeaderboardProvince"].forEach((id) => {
          const select = $(`#${id}`);
          if (select) select.value = leaderboardViewProvince;
        });
      };
      $("#homeLeaderboardProvince").innerHTML = leaderboardProvinceOptions();
      syncLeaderboardLocationControls();
      const leaderboardStatus = (root, message, isError = false) => {
        const status = $("#leaderboardStatus", root);
        if (status) {
          status.classList.toggle("error", isError);
          status.textContent = message;
        }
      };
      const syncLeaderboardScore = async () => {
        const token = leaderboardToken();
        if (!token) return;
        try {
          const response = await fetch(apiUrl("/api/leaderboard/score"), {
            method: state.leaderboardOptIn ? "POST" : "DELETE",
            headers: {
              ...(state.leaderboardOptIn ? { "Content-Type": "application/json" } : {}),
              Authorization: `Bearer ${token}`
            },
            ...(state.leaderboardOptIn ? {
              body: JSON.stringify({
                displayName: state.leaderboardName.trim(),
                province: state.leaderboardProvince,
                ageGroup: currentAgeGroup(),
                points: state.rp
              })
            } : {})
          });
          if (response.status === 401) {
            try { sessionStorage.removeItem(leaderboardTokenKey(state.accountEmail)); }
            catch (error) { console.warn("Không thể xóa phiên đăng nhập đã hết hạn.", error); }
            leaderboardStatus(document, "Phiên đã hết hạn. Hãy đăng xuất rồi đăng nhập lại để đồng bộ điểm.", true);
            return;
          }
          if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || "Không thể cập nhật bảng xếp hạng.");
          }
          await renderLeaderboard(route === "arena" ? $("#routeView") : document, arenaMode);
        } catch (error) {
          console.error("Không thể đồng bộ điểm bảng xếp hạng.", error);
          leaderboardStatus(document, error.message || "Không thể đồng bộ điểm lúc này.", true);
        }
      };
      const queueLeaderboardSync = () => {
        if (!state.authenticated || !state.accountEmail || !state.leaderboardOptIn || !leaderboardToken()) return;
        window.clearTimeout(leaderboardSyncTimer);
        leaderboardSyncTimer = window.setTimeout(syncLeaderboardScore, 500);
      };
      const renderLeaderboard = async (root = document, mode = arenaMode) => {
        const list = $("#leaderboard", root);
        if (!list) return;
        const requestId = ++leaderboardRequestId;
        const province = leaderboardViewProvince;
        if ((mode === "region" || mode === "city") && !province) {
          list.innerHTML = "";
          const podium = $("#leaderboardPodium", root);
          if (podium) podium.innerHTML = "";
          const you = $("#leaderYou", root);
          if (you) you.innerHTML = "";
          leaderboardStatus(root, "Chọn tỉnh/thành trong phần thiết lập để xem bảng xếp hạng khu vực.");
          return;
        }
        const url = new URL(apiUrl("/api/leaderboard"), location.origin);
        url.searchParams.set("mode", mode);
        url.searchParams.set("ageGroup", currentAgeGroup());
        if (province) url.searchParams.set("province", province);
        leaderboardStatus(root, "Đang cập nhật bảng xếp hạng…");
        try {
          const token = leaderboardToken();
          const response = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Không thể tải bảng xếp hạng.");
          if (requestId !== leaderboardRequestId) return;
          let players = Array.isArray(result.players) ? result.players : [];
          const showingExamples = players.length === 0;
          if (showingExamples) {
            const selectedRegion = province
              ? window.LittleHeroLocations.regionByProvince[province]
              : "";
            players = exampleLeaderboardPlayers
              .filter((player) => mode === "nation" || player.ageGroup === currentAgeGroup())
              .filter((player) => mode !== "city" || player.province === province)
              .filter((player) => mode !== "region"
                || window.LittleHeroLocations.regionByProvince[player.province] === selectedRegion)
              .sort((left, right) => right.points - left.points)
              .slice(0, 10)
              .map((player, index) => ({ ...player, rank: index + 1, isCurrentUser: false }));
          }
          players = players.slice(0, 10);
          const medals = ["🥇", "🥈", "🥉"];
          const podium = $("#leaderboardPodium", root);
          if (podium) {
            podium.hidden = players.length === 0;
            podium.innerHTML = players.slice(0, 3).map((player, index) =>
              `<div class="leader-podium-place place-${index + 1} ${player.isCurrentUser ? "is-you" : ""} ${showingExamples ? "is-example" : ""}">
                <span class="podium-medal">${medals[index]}</span><span class="podium-avatar">${escapeHtml(player.name.slice(0, 1).toLocaleUpperCase("vi"))}</span>
                <strong>${escapeHtml(player.name)}</strong><small>${escapeHtml(player.province)} · ${player.ageGroup.replace("-", "–")} tuổi</small>
                <b>${Number(player.points).toLocaleString("vi-VN")} RP</b><span class="podium-rank">#${player.rank}</span>
              </div>`
            ).join("");
          }
          list.innerHTML = players.slice(3).map((player) =>
            `<div class="leader-row ${player.isCurrentUser ? "is-you" : ""} ${showingExamples ? "is-example" : ""}">
              <span class="medal">#${player.rank}</span>
              <span><span class="leader-name">${escapeHtml(player.name)}</span><br><span class="leader-sub">${escapeHtml(player.province)} · Nhóm ${player.ageGroup.replace("-", "–")} tuổi</span></span>
              <span class="leader-score">${Number(player.points).toLocaleString("vi-VN")} RP</span>
            </div>`
          ).join("");
          const you = $("#leaderYou", root);
          if (you) {
            you.innerHTML = result.you
              ? `<div class="leader-row"><span class="medal">🌟</span><span><span class="leader-name">Hạng của bé</span><br><span class="leader-sub">${escapeHtml(result.you.name)} · ${Number(result.you.points).toLocaleString("vi-VN")} RP</span></span><span class="leader-score">#${Number(result.you.rank).toLocaleString("vi-VN")}</span></div>`
              : "";
          }
          const updated = new Date(result.updatedAt);
          leaderboardStatus(root, showingExamples
            ? players.length
              ? "Bảng xếp hạng đang cập nhật theo phạm vi đã chọn."
              : "Chưa có người chơi trong phạm vi này. Bảng sẽ được cập nhật khi có thêm người tham gia."
            : `Cập nhật lúc ${updated.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} · tự làm mới mỗi 10 giây`);
        } catch (error) {
          if (requestId !== leaderboardRequestId) return;
          console.error("Không thể tải bảng xếp hạng.", error);
          leaderboardStatus(root, error.message || "Không thể tải bảng xếp hạng. Hãy thử lại sau.", true);
        }
      };

      const renderChallengeList = () => {
        $("#challengeList").innerHTML = challengeSpecs.map((challenge) => {
          const approved = state.challenges.includes(challenge.id);
          return `<div class="challenge"><div class="challenge-info"><span>${challenge.icon}</span><span><strong>${challenge.title}</strong><small>${challenge.subtitle}</small></span></div>
            <button data-challenge="${challenge.id}" ${approved ? "disabled" : ""}>${approved ? "Đã xác nhận ✓" : "Xác nhận"}</button></div>`;
        }).join("");
      };

      const answerFeedback = (lesson, answerIndex, buttons, feedback) => {
        buttons.forEach((button) => { button.disabled = true; });
        recordLearningAttempt(lesson, answerIndex);
        if (answerIndex === lesson.correct) {
          buttons[answerIndex].classList.add("correct");
          const firstCompletion = !state.completed.includes(lesson.id);
          if (firstCompletion) {
            state.completed.push(lesson.id);
            state.xp += lesson.reward;
          }
          feedback.textContent = firstCompletion
            ? `Đúng rồi! Bé đã cân nhắc một lựa chọn an toàn. +${lesson.reward} sao 🌟`
            : "Đúng rồi! Bé đã luyện tập lại một cách an toàn. 🌟";
          state.dailyLessons += 1;
          state.completedDays = [...new Set([...state.completedDays, currentDay()])];
          state.rp += 25;
          persist();
          renderLeaderboard();
          renderIslands();
          renderFeatured(lessons.find((item) => !state.completed.includes(item.id)) || lesson);
          buttons.forEach((button, index) => { if (index !== answerIndex) button.remove(); });
          const next = document.createElement("button");
          next.className = "btn btn-mint btn-small";
          next.textContent = "Hoàn thành · xem hoạt động ngoài đời";
          next.addEventListener("click", () => {
            closeDialog();
            document.querySelector("#parents").scrollIntoView({ behavior: "smooth" });
            toast(lesson.activity);
          });
          feedback.insertAdjacentElement("afterend", next);
        } else {
          buttons[answerIndex].classList.add("try-again");
          feedback.textContent = "Mình cùng nghĩ lại nhé: cách nào giúp bé an toàn và có thể nhờ người lớn hỗ trợ?";
          const retry = document.createElement("button");
          retry.className = "btn btn-light btn-small";
          retry.textContent = "Thử chọn lại";
          retry.addEventListener("click", () => {
            buttons.forEach((button) => { button.disabled = false; button.classList.remove("try-again"); });
            feedback.textContent = "";
            retry.remove();
          });
          feedback.insertAdjacentElement("afterend", retry);
        }
      };

      const openLesson = (lessonId) => {
        const lesson = lessonById(lessonId);
        if (!lesson) return;
        const category = categories.find((item) => item.id === lesson.category);
        showDialog(`<div class="dialog-head"><div><span class="tag">${category.icon} ${category.name}</span><h2 id="dialogTitle">${lesson.icon} ${lesson.title}</h2><p>${lesson.age} · ${lesson.duration} · Cùng bé thử nghĩ nhé.</p></div><button class="close-btn" data-close aria-label="Đóng">×</button></div>
          <div class="story-box"><strong>📖 Câu chuyện</strong><br>${lesson.story}</div>
          <div class="thinking-prompts"><strong style="font-size:11px">Gợi ý để bé suy nghĩ</strong>${lesson.prompts.map((text) => `<div>${text}</div>`).join("")}</div>
          <p style="margin:13px 0 8px;font-size:11px;font-weight:850">Bé sẽ chọn cách nào?</p>
          <div class="answer-list">${lesson.answers.map((answer, index) => `<button class="answer" data-answer="${index}">${String.fromCharCode(65 + index)}. ${answer}</button>`).join("")}</div>
          <div class="feedback" id="lessonFeedback" aria-live="polite"></div>
          <p class="note">Hero gợi ý để bé tự suy nghĩ; nếu chưa chắc chắn, hãy cùng người lớn đáng tin cậy trao đổi.</p>`);
        $("#dialogContent").querySelectorAll("[data-answer]").forEach((button) => {
          button.addEventListener("click", () => answerFeedback(lesson, Number(button.dataset.answer), [...$("#dialogContent").querySelectorAll("[data-answer]")], $("#lessonFeedback")));
        });
      };

      const openParent = () => {
        showDialog(`<div class="dialog-head"><div><span class="kicker">KHU VỰC GIA ĐÌNH</span><h2 id="dialogTitle">Góc đồng hành cùng bé</h2><p>Tóm tắt được lưu trên thiết bị này; chưa có tài khoản hay máy chủ.</p></div><button class="close-btn" data-close aria-label="Đóng">×</button></div>
          <div class="journal-stat"><div><strong>${completedCount()}</strong><span>Bài hoàn thành</span></div><div><strong>${state.xp}</strong><span>Sao đã tích lũy</span></div><div><strong>${streak()}</strong><span>Ngày liên tục</span></div></div>
          <div class="story-box"><strong>Gợi ý trò chuyện cùng con</strong><br>Hỏi bé: “Con đã nghĩ đến cảm xúc nào? Điều gì khiến cách con chọn an toàn?” Hãy lắng nghe và động viên nỗ lực.</div>
          <label class="form-label">Tên hiển thị của bé<input id="nameInput" maxlength="24" placeholder="Nhập tên bé" value="${escapeHtml(state.childName)}"></label>
          <button class="btn btn-mint" id="saveName">Lưu tên bé</button>
          <button class="btn btn-light btn-small" id="clearProgress" style="margin-left:6px">Xóa tiến độ</button>
          </div>`);
        $("#saveName").addEventListener("click", () => {
          state.childName = $("#nameInput").value.trim().slice(0, 24);
          persist();
          closeDialog();
          toast(state.childName ? `Chào ${state.childName}! Hero nhớ tên bé trên thiết bị này.` : "Đã xóa tên hiển thị.");
        });
        $("#clearProgress").addEventListener("click", () => {
          showDialog(`<div class="dialog-head"><div><span class="kicker">XÁC NHẬN</span><h2 id="dialogTitle">Xóa tiến độ trên thiết bị?</h2></div><button class="close-btn" data-close aria-label="Đóng">×</button></div>
            <p class="note">Thao tác này xóa sao, bài đã hoàn thành và thử thách đã xác nhận, nhưng giữ tên bé.</p>
            <button class="btn btn-primary" id="confirmClear">Xóa tiến độ</button> <button class="btn btn-light" data-close>Giữ lại</button>`);
          $("#confirmClear").addEventListener("click", () => {
            const childName = state.childName;
            state = { ...freshState(), childName };
            persist(); renderIslands(); renderFeatured(); renderLeaderboard(); closeDialog();
            toast("Đã xóa tiến độ trên thiết bị này.");
          });
        });
      };

      const requestParentAccess = (onVerified) => {
        if (parentUnlocked) { onVerified(); return; }
        const first = 2 + Math.floor(Math.random() * 7);
        const second = 1 + Math.floor(Math.random() * 8);
        showDialog(`<div class="dialog-head"><div><span class="kicker">KHU VỰC CÓ NGƯỜI LỚN ĐỒNG HÀNH</span><h2 id="dialogTitle">Xác nhận phụ huynh</h2><p>Giải phép tính đơn giản để mở khu vực này.</p></div><button class="close-btn" data-parent-close aria-label="Đóng">×</button></div>
          <label class="form-label">${first} + ${second} = ?<input id="parentAnswer" type="number" inputmode="numeric" autocomplete="off"></label>
          <div class="feedback" id="parentFeedback" aria-live="polite"></div>
          <button class="btn btn-mint" id="verifyParent">Tiếp tục</button>
          <p class="note" style="margin-top:12px">Phép tính giúp hạn chế trẻ tự mở khu vực này; không thay thế mã PIN hoặc đăng nhập bảo mật.</p>`);
        $("#appDialog").dataset.parentConfirmation = "true";
        $("#verifyParent").addEventListener("click", () => {
          if (Number($("#parentAnswer").value) !== first + second) {
            $("#parentFeedback").textContent = "Chưa đúng, phụ huynh thử lại nhé.";
            return;
          }
          parentUnlocked = true;
          $("#appDialog").dataset.parentConfirmation = "false";
          closeDialog();
          onVerified();
        });
      };

      const approveChallenge = (id) => {
        if (state.challenges.includes(id)) return;
        const challenge = challengeSpecs.find((item) => item.id === id);
        if (!challenge) return;
        state.challenges.push(challenge.id);
        state.xp += challenge.reward;
        persist();
        toast(`Đã ghi nhận nỗ lực của bé · +${challenge.reward} sao! Hãy cùng phụ huynh thực hành nhé.`);
      };

      const openTutor = () => {
        setRoute("tutor");
      };

      const openPricing = () => {
        showDialog(`<div class="dialog-head"><div><span class="kicker">GÓI HỌC PREMIUM</span><h2 id="dialogTitle">Mở rộng hành trình khám phá</h2><p>49.000đ/tháng hoặc 399.000đ/năm.</p></div><button class="close-btn" data-close aria-label="Đóng">×</button></div>
          <div class="story-box"><strong>👑 Gói tháng:</strong> 12 bài học và trò chơi Premium.<br><strong>👑 Gói năm:</strong> toàn bộ quyền lợi gói tháng và báo cáo tiến độ phụ huynh.</div>
          <p class="note">Cổng thanh toán và xác minh giao dịch chưa được kết nối. Không có quyền lợi nào được kích hoạt trước khi máy chủ xác nhận thanh toán.</p>
          <button class="btn btn-primary" id="pricingOk">Đã hiểu</button>`);
        $("#pricingOk").addEventListener("click", closeDialog);
      };

      const openSound = () => {
        const supported = "speechSynthesis" in window;
        showDialog(`<div class="dialog-head"><div><span class="kicker">ÂM THANH & GIỌNG ĐỌC</span><h2 id="dialogTitle">Nghe Hero đọc nội dung</h2><p>Giọng đọc phụ thuộc trình duyệt và ngôn ngữ đã cài.</p></div><button class="close-btn" data-close aria-label="Đóng">×</button></div>
          <div class="story-box">${supported ? "Trình duyệt có hỗ trợ đọc văn bản. Nhấn nút dưới để nghe thử lời chào tiếng Việt." : "Trình duyệt này chưa hỗ trợ giọng đọc tự động."}</div>
          <button class="btn btn-mint" id="voicePreview" ${supported ? "" : "disabled"}>♫ Nghe Hero chào</button>
          <p class="note">Đoạn thử được đọc trực tiếp trên thiết bị, không phát âm thanh nếu chưa được người dùng bấm.</p>`);
        $("#voicePreview").addEventListener("click", () => {
          if (supported) {
            const greeting = state.language === "en"
              ? `Hello ${state.childName || "friend"}! Let's explore the world with Hero today!`
              : `Xin chào ${state.childName || "bạn nhỏ"}! Cùng Hero khám phá thế giới hôm nay nhé!`;
            const utterance = new SpeechSynthesisUtterance(greeting);
            utterance.lang = state.language === "en" ? "en-US" : "vi-VN";
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
            state.sound = true;
            persist();
          }
        });
      };

      let arenaMode = "duel";
      let arenaOpponent = null;
      let arenaMatchTimeout = null;
      let arenaMatchLesson = null;
      let arenaMatchChoice = null;
      const openQuiz = () => {
        const available = ageAppropriateLessons();
        const lesson = available[Math.floor(Math.random() * available.length)];
        showDialog(`<div class="dialog-head"><div><span class="kicker">THỬ THÁCH TÌNH HUỐNG</span><h2 id="dialogTitle">Một câu hỏi cùng Hero</h2><p>${lesson.age} · Tình huống: ${lesson.title}</p></div><button class="close-btn" data-close aria-label="Đóng">×</button></div>
          <div class="story-box">${lesson.story}</div><button class="btn btn-light btn-small" id="quizSpeak">♫ Nghe đề bài và các phương án</button><div class="answer-list">${lesson.answers.map((answer, index) => `<button class="answer" data-quiz-answer="${index}">${answer}</button>`).join("")}</div>
          <div class="feedback" id="quizFeedback" aria-live="polite"></div><p class="quiz-lock-note" id="quizLockNote" hidden>Con có thể suy nghĩ lại và chọn phương án khác.</p>`);
        $("#quizSpeak").addEventListener("click", () => speak(`${lesson.title}. ${lesson.story} Các phương án. ${lesson.answers.map((answer, index) => `Phương án ${index + 1}: ${answer}`).join(". ")}`));
        $("#dialogContent").querySelectorAll("[data-quiz-answer]").forEach((button) => button.addEventListener("click", () => {
          const index = Number(button.dataset.quizAnswer);
          const buttons = [...$("#dialogContent").querySelectorAll("[data-quiz-answer]")];
          if (index === lesson.correct) {
            buttons.forEach((item) => { item.disabled = true; });
            state.quiz += 1;
            state.dailyQuiz += 1;
            button.classList.add("correct");
            state.xp += 5;
            state.rp += 25;
            $("#quizFeedback").textContent = "Kết quả thành công! Bé chọn cách an toàn. +5 sao · +25 RP 🌟";
            speak(`Tuyệt vời! Con đã chọn cách phù hợp. ${lesson.prompts[2] || lesson.goal}`);
          } else {
            button.classList.add("try-again");
            button.disabled = true;
            $("#quizFeedback").textContent = `Không sao, bé thử lại nhé. ${lesson.prompts[1] || lesson.goal}`;
            speak(`Không sao, con thử lại nhé. ${lesson.prompts[1] || lesson.goal}`);
            window.setTimeout(() => { if (button.isConnected) button.disabled = false; }, 250);
          }
          $("#quizLockNote").hidden = index === lesson.correct;
          persist();
          $("#rankPoints").textContent = `${state.rp} RP`;
          renderLeaderboard();
        }));
      };

      let route = "home";
      let routeHistory = [];
      let routeHistoryIndex = 0;
      let pendingNewsFocus = "";
      let pendingAuthRoute = "";
      let cleanupTutorSession = null;
      const accountFeatureRoutes = new Set(["map", "lesson", "quiz", "games", "quests", "achievements", "parents", "arena", "arena-match", "payment", "premium-success"]);
      const previewRoutes = new Set([...accountFeatureRoutes, "forum", "reviews"]);
      const guestActionSelector = [
        "#dialogContent [data-answer]",
        "#dialogContent [data-quiz-answer]",
        "[data-parent]",
        "#lessonChoices [data-choice]",
        "#lessonSpeak",
        "#quizSpeak",
        "#quizPageSpeak",
        "#voicePreview",
        "#routeView [data-quiz-start]",
        "#routeView [data-quiz-answer]",
        "#routeView [data-match-category]",
        "#routeView [data-match-goal]",
        "#routeView [data-order-move]",
        "#checkQuizOrder",
        "#nextQuiz",
        "[data-quiz-reset]",
        "[data-arena-choice]",
        "[data-memory-card]",
        "[data-mini-game-answer]",
        "[data-mini-game-next]",
        "[data-mini-game-replay]",
        "[data-claim-quest]",
        "#claimQuests",
        "[data-challenge]",
        "[data-like-post]",
        "[data-react]",
        "[data-share-post]",
        "[data-repost]",
        "[data-review-helpful]",
        "[data-star]",
        "[data-assistant-prompt]",
        "#arenaStart",
        "#arenaFindOpponent",
        "#startArenaMatch",
        "#assistantVoiceMode",
        "#assistantVoiceButton",
        "#assistantAttachButton",
        "#forumForm button",
        ".social-comment-form button",
        "#reviewForm button",
        "#paymentConfirmForm button",
        "#profileDetailsForm button",
        "#profileAddForm button",
        "#assistantChatForm button",
        "#saveName",
        "#clearProgress",
        "#confirmClear"
      ].join(",");
      const guestActionFormSelector = [
        "#forumForm",
        ".social-comment-form",
        "#reviewForm",
        "#leaderboardPreferencesForm",
        "#paymentConfirmForm",
        "#profileDetailsForm",
        "#profileAddForm",
        "#assistantChatForm"
      ].join(",");
      const guestPreferenceSelector = [
        "#parentProfileSelect",
        "#parentDailyLimit",
        "#parentBlockPurchases",
        "#parentSafeContent",
        "#parentNotifyLearning",
        "#parentNotifyPractice",
        "#forumMedia",
        "#assistantFileInput"
      ].join(",");
      let activeViewTransition = false;
      let pendingViewUpdate = null;
      let quizRun = null;
      let selectedStars = 5;
      let miniGameRun = null;
      const localizedTitles = {
        vi: { home: "Trang chủ", map: "Bản đồ ốc đảo", lessons: "Kho bài học", stories: "Truyện tranh", storybook: "Sách truyện", games: "Trò chơi", quests: "Nhiệm vụ hằng ngày", quiz: "Bài ôn tập", achievements: "Tường thành tích", reviews: "Đánh giá ứng dụng", forum: "Diễn đàn", faq: "Câu hỏi thường gặp", language: "Ngôn ngữ", tutor: "Hỏi Hero", parents: "Góc phụ huynh", "parent-news": "Tin tức & LITTLE HERO", auth: "Tài khoản", pricing: "Gói Premium", payment: "Thanh toán Premium", arena: "Đấu trường" },
        en: { home: "Home", map: "Island map", lessons: "Lessons", stories: "Stories", storybook: "Storybook", games: "Games", quests: "Daily quests", quiz: "Review activities", achievements: "Achievements", reviews: "App reviews", forum: "Community", faq: "FAQs", language: "Language", tutor: "Ask Hero", parents: "Parent corner", "parent-news": "News & LITTLE HERO", auth: "Account", pricing: "Premium plans", payment: "Premium payment", arena: "Challenge arena" }
      };
      const pageTitle = (name) => localizedTitles[state.language === "en" ? "en" : "vi"][name] || localizedTitles.vi[name] || name;
      const englishUiText = new Map(Object.entries({
        "Bạn có thể khám phá nội dung; đăng nhập để sử dụng chức năng và lưu tiến độ.": "Explore the content; sign in to use features and save your progress.",
        "Tính năng truyện đang được đội ngũ LITTLE HERO xây dựng và phát triển.": "The story feature is being built and developed by the LITTLE HERO team.",
        "Chia sẻ trải nghiệm thực tế của gia đình với Little Hero.": "Share your family's experience with Little Hero.",
        "Chưa có đánh giá xác thực; các nội dung bên dưới được ghi nhãn là minh họa.": "There are no verified reviews yet; the examples below are labeled as samples.",
        "Lưu cục bộ trên thiết bị. Tên và trải nghiệm chưa được xác minh; không đồng bộ hoặc đăng lên Google Play/App Store.": "Saved locally on this device. Names and experiences are unverified and are not synced or posted to Google Play or the App Store.",
        "Chưa có phản hồi": "No reviews yet",
        "Tổng quan đánh giá": "Review summary",
        "Tên người đánh giá": "Reviewer name",
        "Tóm tắt trải nghiệm": "Summarize your experience",
        "Chia sẻ trải nghiệm thực tế của bạn…": "Share your experience…",
        "Số sao": "Rating",
        "Tiêu đề": "Title",
        "Thế giới cảm xúc & bản thân": "Emotions & self-awareness",
        "Kỹ năng xã hội & giao tiếp": "Social skills & communication",
        "An toàn & tự bảo vệ": "Safety & self-protection",
        "Sức khỏe & tự lập": "Health & independence",
        "Tư duy & ra quyết định": "Thinking & decision-making",
        "Trách nhiệm & môi trường": "Responsibility & the environment",
        "Sáng tạo & khám phá": "Creativity & discovery",
        "Gia đình, cộng đồng & mạng": "Family, community & online safety",
        "Bé sẽ chọn cách nào?": "What do you think they should do?",
        "Bé có thể trả lời bằng giọng nói hoặc chọn một phương án bên dưới.": "You can answer by voice or choose an option below.",
        "Phương án": "Option",
        "Đang nghe… khi bé ngừng nói, Hero sẽ tự xử lý câu trả lời.": "Listening… Hero will check your answer when you finish speaking.",
        "Đến lượt bé trả lời nhé. Bé có thể nói hoặc chọn một phương án.": "Your turn! Say your answer or choose an option.",
        "Trả lời bằng giọng nói": "Answer by voice",
        "Dừng nghe": "Stop listening",
        "Nội dung bài học": "Vietnamese lesson content",
        "Nội dung bài học hiện có bằng tiếng Việt.": "Some lesson content is currently available only in Vietnamese.",
        "Khi con có nhiều cảm xúc": "When feelings get big",
        "Làm quen với một người bạn mới": "Making a new friend",
        "Khi con bị lạc ở nơi đông người": "If you get lost in a busy place",
        "Bàn tay sạch trước bữa ăn": "Clean hands before eating",
        "Khi con mắc một lỗi nhỏ": "When you make a small mistake",
        "Cùng giữ sân chơi sạch đẹp": "Keeping the playground clean",
        "Thử một điều mới thật an toàn": "Trying something new safely",
        "Tin nhắn lạ trên mạng": "A message from a stranger online",
        "Khi con tức giận và muốn la hét": "When you feel angry and want to shout",
        "Khi con cần nói lời xin lỗi": "When you need to say sorry",
        "Khi người lạ cho con quà": "When a stranger offers you a gift",
        "Khi con lo lắng trước điều mới": "When you feel nervous about something new",
        "Nhận biết, gọi tên cảm xúc và thể hiện cảm xúc theo cách an toàn.": "Recognize and name feelings, and express them safely.",
        "Bắt đầu một cuộc trò chuyện thân thiện và tôn trọng lựa chọn của bạn.": "Start a friendly conversation and respect your friend's choice.",
        "Biết đứng ở nơi an toàn và tìm người lớn có trách nhiệm hỗ trợ.": "Stay in a safe place and ask a trusted staff member or adult for help.",
        "Tạo thói quen vệ sinh cá nhân với sự hướng dẫn phù hợp.": "Build healthy hygiene habits with appropriate guidance.",
        "Nhận trách nhiệm phù hợp và tìm người lớn hỗ trợ để sửa sai.": "Take responsibility and ask an adult to help make things right.",
        "Thực hành trách nhiệm phù hợp với không gian chung.": "Take age-appropriate responsibility for shared spaces.",
        "Gọi tên sự lo lắng và tìm sự hỗ trợ khi thử điều mới.": "Name your worries and ask for help when trying something new.",
        "Bảo vệ thông tin cá nhân và báo cho người lớn đáng tin cậy.": "Protect personal information and tell a trusted adult.",
        "Nhận ra dấu hiệu tức giận và chọn cách bình tĩnh, không làm tổn thương người khác.": "Notice signs of anger and calm down without hurting anyone.",
        "Nhận trách nhiệm và đề nghị một cách sửa sai phù hợp.": "Take responsibility and offer an appropriate way to make things right.",
        "Giữ khoảng cách an toàn và nhờ người lớn đáng tin cậy hỗ trợ.": "Keep a safe distance and ask a trusted adult for help.",
        "Nhận biết nỗi lo và tìm sự hỗ trợ phù hợp trước một trải nghiệm mới.": "Notice your worries and find support before a new experience.",
        "Hôm nay Na vui vì được cô khen bức tranh. Khi tranh bị rách, Na buồn và tức giận. Ngày mai lớp biểu diễn, Na lại thấy lo lắng.": "Na is happy when her teacher praises her picture. When it tears, she feels sad and angry. She feels nervous about tomorrow's class performance.",
        "Nam mới đến lớp và đang ngồi xếp hình một mình. Hà muốn chơi cùng nhưng còn ngại chưa biết mở lời thế nào.": "Nam is new to class and is playing with blocks alone. Hà wants to join him but feels shy about what to say.",
        "Ở siêu thị, Bin không nhìn thấy mẹ. Gần đó có quầy thông tin và một lối đi ra bãi xe.": "At the supermarket, Bin cannot see his mother. The information desk is nearby, as well as an exit to the parking lot.",
        "Sau khi chơi ngoài sân, đến giờ ăn trưa. Đôi tay của Mia đã dính đất.": "After playing outside, it is time for lunch. Mia's hands are dirty.",
        "An vô ý làm đổ nước lên bàn học và thấy vài quyển sách bị ướt. An lo bị mắng.": "An accidentally spills water on the desk and notices that some books are wet. An is worried about getting in trouble.",
        "Sau giờ ăn nhẹ, Linh thấy vỏ bánh trên tay và một chiếc thùng rác ở gần đó.": "After snack time, Linh has a wrapper in hand and sees a bin nearby.",
        "Bin muốn tập đi xe đạp nhưng lo sẽ mất thăng bằng. Bố đang ở bên cạnh và có thể giúp.": "Bin wants to learn to ride a bike but is worried about losing balance. Dad is nearby and can help.",
        "Khi dùng máy tính bảng cùng bố, Mia nhận tin nhắn từ một tài khoản không quen hỏi địa chỉ nhà.": "While using a tablet with Dad, Mia gets a message from an unknown account asking for her home address.",
        "Em của Bo vô tình làm đổ tòa lâu đài Bo vừa xây. Bo thấy mặt nóng lên, hai tay nắm chặt và muốn hét thật to.": "Bo's younger sibling accidentally knocks down the castle Bo built. Bo feels hot, clenches both fists, and wants to shout.",
        "An vô tình làm đổ tòa tháp bạn Bình vừa xây. Bình buồn, còn An ngại xin lỗi vì sợ bạn giận.": "An accidentally knocks down the tower Bình built. Bình feels sad, and An is afraid to apologize in case Bình gets angry.",
        "Ở gần cổng công viên, một người Mia không quen mời em đi theo để nhận một món quà. Mẹ đang ở bên trong khu vui chơi.": "Near the park gate, someone Mia does not know invites her to come along for a gift. Her mother is inside the play area.",
        "Bin muốn tập đi xe đạp nhưng hơi sợ ngã. Bố đang ở cạnh và có thể giúp Bin chọn nơi tập an toàn.": "Bin wants to learn to ride a bike but is a little afraid of falling. Dad is nearby and can help find a safe place to practice.",
        "Na nói: “Mình buồn vì tranh bị rách”, rồi nhờ cô giúp.": "Na says, “I'm sad because my picture tore,” and asks the teacher for help.",
        "Na giấu cảm xúc và giật lại đồ của bạn.": "Na hides her feelings and grabs her friend's things.",
        "Na tự trách mình và không nói với ai.": "Na blames herself and tells no one.",
        "Mỉm cười chào bạn, hỏi bạn có muốn chơi cùng không.": "Smile, say hello, and ask if your friend would like to play.",
        "Giật lấy đồ chơi để bạn phải chú ý.": "Grab the toy to get your friend's attention.",
        "Bắt bạn phải chơi cùng mình ngay.": "Make your friend play with you right away.",
        "Đứng ở nơi an toàn và nhờ nhân viên hoặc bảo vệ hỗ trợ.": "Stay somewhere safe and ask an employee or security guard for help.",
        "Đi theo một người lạ tự nhận là quen với gia đình.": "Go with a stranger who says they know your family.",
        "Tự đi ra bãi xe để tìm người thân.": "Go to the parking lot alone to look for your family.",
        "Rửa tay với xà phòng trước khi ngồi vào bàn.": "Wash your hands with soap before sitting down to eat.",
        "Lau tay qua loa vào áo rồi ăn luôn.": "Wipe your hands on your shirt and start eating.",
        "Chờ đến khi ăn xong mới rửa tay.": "Wait until after eating to wash your hands.",
        "Báo người lớn và xin giúp lau nước, kiểm tra sách.": "Tell an adult and ask for help drying the water and checking the books.",
        "Giấu sự việc và để nước thấm thêm.": "Hide what happened and let the water soak in.",
        "Tự dùng đồ điện gần chỗ nước để sấy sách.": "Use an electrical appliance near the water to dry the books.",
        "Bỏ vỏ bánh vào thùng rác gần đó.": "Put the wrapper in the nearby bin.",
        "Để vỏ bánh xuống sân vì sẽ có người khác dọn.": "Leave the wrapper on the ground because someone else will clean it up.",
        "Ném vỏ bánh thật xa để khỏi phải cầm.": "Throw the wrapper far away so you do not have to hold it.",
        "Nhờ người lớn hỗ trợ và dùng đồ bảo hộ phù hợp.": "Ask an adult for help and wear suitable safety gear.",
        "Tập một mình ở con đường có nhiều xe.": "Practice alone on a busy road.",
        "Không bao giờ thử và cũng không chia sẻ điều mình lo.": "Never try, and do not tell anyone what worries you.",
        "Không trả lời và báo ngay cho người lớn đang đồng hành.": "Do not reply; tell the trusted adult with you right away.",
        "Gửi địa chỉ để người lạ biết mình ở đâu.": "Send your address so the stranger knows where you live.",
        "Tiếp tục trò chuyện và giữ bí mật với bố mẹ.": "Keep chatting and hide it from your parents.",
        "Tạm dừng, thở chậm và nói rõ điều khiến mình buồn.": "Pause, breathe slowly, and explain what made you sad.",
        "Đẩy em rồi hét thật to.": "Push your sibling and shout loudly.",
        "Ném đồ chơi để mọi người biết mình đang giận.": "Throw toys so everyone knows you are angry.",
        "Xin lỗi chân thành và hỏi bạn muốn được giúp thế nào.": "Apologize sincerely and ask how you can help.",
        "Nói rằng bạn không nên buồn vì đó chỉ là đồ chơi.": "Tell your friend not to be sad because it is only a toy.",
        "Ép bạn tha thứ ngay để hai người chơi tiếp.": "Make your friend forgive you immediately so you can keep playing.",
        "Không đi theo, giữ khoảng cách và báo cho mẹ ngay.": "Do not go with them; keep your distance and tell Mom right away.",
        "Đi theo người đó để xem có món quà gì.": "Go with the person to see what the gift is.",
        "Giữ bí mật vì người đó đã dặn không kể.": "Keep it secret because the person told you not to tell.",
        "Chia sẻ nỗi lo và thử từng bước ở nơi an toàn với người lớn.": "Share your worries and try one step at a time in a safe place with an adult.",
        "Giấu nỗi lo và làm điều mình chưa sẵn sàng.": "Hide your worries and do something you are not ready for.",
        "Ngôn ngữ giao diện": "App language",
        "TÙY CHỌN NGÔN NGỮ": "LANGUAGE SETTINGS",
        "Chọn ngôn ngữ giao diện. Nội dung bài học hiện có bằng tiếng Việt.": "Choose the language for the app, lessons, voice input, and Hero's AI replies.",
        "Hero sẽ trả lời và nhận diện giọng nói theo ngôn ngữ đã chọn. Một số nội dung bài học hiện chỉ có tiếng Việt.": "Hero's AI replies and speech recognition follow the selected language. Some lesson content is currently available only in Vietnamese.",
        "Trang chủ": "Home",
        "Kho bài học": "Lesson library",
        "Truyện tranh": "Stories",
        "Truyện": "Stories",
        "Đấu trường": "Challenge arena",
        "Kiểm tra": "Review",
        "Thêm": "More",
        "Nhiệm vụ": "Quests",
        "Gói Premium": "Premium",
        "Phụ huynh": "Parents",
        "Diễn đàn": "Community",
        "Câu hỏi thường gặp": "FAQs",
        "Đánh giá ứng dụng": "App reviews",
        "Ngôn ngữ": "Language",
        "Đăng nhập / đăng ký": "Sign in / Register",
        "Đăng nhập": "Sign in",
        "Đăng xuất": "Sign out",
        "Tài khoản": "Account",
        "Chào bạn nhỏ": "Hello, friend",
        "Thời gian học trong phiên hôm nay": "Study time today",
        "Chuỗi ngày hoàn thành bài học": "Learning streak",
        "Điểm sao và cấp độ": "Stars and level",
        "Bắt đầu bài học": "Start a lesson",
        "Cùng gia đình học điều hay mỗi ngày": "Learn something good together every day",
        "HỌC KỸ NĂNG SỐNG QUA TRẢI NGHIỆM · 3–10 TUỔI": "LIFE SKILLS THROUGH EXPERIENCE · AGES 3–10",
        "Chào ": "Hello ",
        "Cùng Hero ": "Let's ",
        "khám phá": "explore",
        " nhé.": "!",
        "Cùng gia đình học điều hay mỗi ngày": "Learn something good together every day",
        "LITTLE HERO là gì?": "What is LITTLE HERO?",
        "Dễ hiểu": "Easy to understand",
        "An toàn": "Safe",
        "Hiệu quả": "Effective",
        "Vì sao nên học kỹ năng sống từ sớm?": "Why learn life skills early?",
        "Hành trình học tập cùng Little Hero": "The Little Hero learning journey",
        "Học qua trò chơi tương tác vui nhộn.": "Learn through fun, interactive games.",
        "Bắt đầu hành trình tuyệt vời cùng LITTLE HERO!": "Start an amazing journey with LITTLE HERO!",
        "Góc chia sẻ gia đình": "Family stories",
        "Phụ huynh nói gì về LITTLE HERO?": "What do parents think about LITTLE HERO?",
        "Chia sẻ trải nghiệm thật": "Share your experience",
        "Kho bài học": "Lesson library",
        "Chọn bài học phù hợp với độ tuổi và chủ đề bé quan tâm.": "Choose a lesson suited to your child's age and interests.",
        "Tất cả chủ đề": "All topics",
        "Bắt đầu bài học": "Start lesson",
        "Học lại": "Try again",
        "Chọn ngôn ngữ giao diện. Nội dung bài học hiện có bằng tiếng Việt.": "Choose the language for the app, lessons, voice input, and Hero's AI replies.",
        "Ngôn ngữ giao diện": "App language",
        "Tiếng Việt": "Vietnamese",
        "English": "English",
        "Cập nhật lúc": "Updated at",
        "Bảng xếp hạng minh họa · thứ hạng thật sẽ cập nhật khi có người chơi đồng ý chia sẻ điểm.": "Illustrative leaderboard · real rankings will appear when players consent to share their scores.",
        "Chưa có người chơi trong phạm vi này. Thứ hạng thật sẽ hiện khi có người chơi đồng ý chia sẻ điểm.": "No players in this area yet. Real rankings will appear when players consent to share their scores.",
        "Bảng xếp hạng có thể xem công khai. Đăng nhập hoặc đăng ký để chọn biệt danh và tham gia.": "The leaderboard is public. Sign in or register to choose a nickname and participate.",
        "Hiện tại đây chỉ là giao diện demo, LITTLE HERO sẽ được phát triển và nâng cấp trong tương lai.": "This is currently a demo interface. LITTLE HERO will be developed and improved in the future.",
        "Bảng vinh danh": "Leaderboard",
        "Đánh giá của người dùng": "User reviews",
        "Viết đánh giá": "Write a review",
        "Tên hiển thị": "Display name",
        "Nhận xét": "Review",
        "Gửi đánh giá": "Submit review",
        "Nội dung minh họa, không phải đánh giá đã xác minh.": "Sample content, not a verified review.",
        "Nội dung minh họa · tên hư cấu": "Sample content · fictional names",
        "Bé hào hứng học mỗi tối": "My child looks forward to learning",
        "Các tình huống gần gũi nên con dễ hiểu và chịu kể lại cách mình sẽ làm. Gia đình mình thường cùng con chọn một bài trước giờ đi ngủ.": "The familiar situations are easy for my child to understand, and they enjoy telling us what they would do. We often choose a lesson together before bedtime.",
        "Dễ học cùng con": "Easy to learn together",
        "Bài học ngắn, phần lựa chọn giúp bố mẹ có thêm chủ đề để trò chuyện với con. Bé thích nhất các nhân vật trong câu chuyện.": "The short lessons and choices give us more to talk about. My child especially enjoys the characters in the stories.",
        "Một hoạt động hữu ích cho cả nhà": "A helpful activity for the whole family",
        "Nội dung nhẹ nhàng, phù hợp để bố mẹ cùng con luyện cách xử lý những tình huống thường gặp ở trường và khi đi chơi.": "The gentle content gives us a good way to practice handling everyday situations at school and when we're out together.",
        "Con nhớ được điều đã học": "My child remembers what they learn",
        "Sau khi học về an toàn, con chủ động nhắc lại cần tìm người lớn đáng tin cậy khi thấy lo lắng. Cả nhà có thêm cách ôn bài vui vẻ.": "After a safety lesson, my child remembered to find a trusted adult when feeling worried. It gives our family a fun way to review together.",
        "Bài học tiếp theo": "Next lesson",
        "Câu chuyện tiếp theo": "Next story",
        "Đúng rồi!": "That's right!",
        "Chưa phù hợp": "Not quite",
        "Trả lời bằng giọng nói": "Answer by voice",
        "Dừng nghe": "Stop listening",
        "Đang nghe…": "Listening…",
        "Hero nghe bé nói:": "Hero heard:",
        "Trình duyệt này chưa hỗ trợ nhận diện giọng nói. Bé có thể chọn một phương án bên dưới nhé.": "This browser does not support speech recognition. Choose an answer below instead.",
        "Nhật ký khám phá": "Learning journal",
        "Bài đã hoàn thành": "Lessons completed",
        "Sao bé tích lũy": "Stars earned",
        "Ngày chăm chỉ": "Learning days",
        "Gợi ý cho bước tiếp theo": "Suggested next step",
        "Bài ôn tập": "Review activities",
        "Tìm hiểu các lựa chọn đồng hành cùng hành trình học tập của bé. Hệ thống chưa xác minh giao dịch ngân hàng tự động.": "Explore ways to support your child's learning. Payments are not processed or verified by this app.",
        "Tùy chọn ngôn ngữ": "Language settings",
        "GIA ĐÌNH": "FAMILY",
        "HỖ TRỢ GIA ĐÌNH": "FAMILY SUPPORT",
        "ĐÁNH GIÁ ỨNG DỤNG": "APP REVIEWS",
        "KHO BÀI HỌC": "LESSON LIBRARY",
        "THỬ THÁCH": "CHALLENGES"
      }).sort(([sourceA], [sourceB]) => sourceB.length - sourceA.length));
      const localizedTextState = new WeakMap();
      const localizedAttributeState = new WeakMap();
      const translateString = (source) => {
        if (state.language !== "en") return source;
        const exactTranslation = englishUiText.get(source);
        if (exactTranslation) return exactTranslation;
        let translated = source;
        for (const [vietnamese, english] of englishUiText) {
          translated = translated.replaceAll(vietnamese, english);
        }
        return translated;
      };
      const translateNodeText = (node) => {
        const current = node.nodeValue || "";
        let source = localizedTextState.get(node);
        if (source === undefined || current !== source.last) {
          source = { original: current, last: current };
          localizedTextState.set(node, source);
        }
        const translated = translateString(source.original);
        if (translated !== current) node.nodeValue = translated;
        source.last = translated;
      };
      const translateElement = (root) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          if (node.parentElement?.closest("script,style,textarea,[contenteditable='true']")) continue;
          translateNodeText(node);
        }
        const elements = [root, ...root.querySelectorAll("*")];
        for (const element of elements) {
          if (!(element instanceof Element)) continue;
          let attributes = localizedAttributeState.get(element);
          if (!attributes) {
            attributes = new Map();
            localizedAttributeState.set(element, attributes);
          }
          for (const name of ["aria-label", "alt", "placeholder", "title"]) {
            if (!element.hasAttribute(name)) continue;
            const current = element.getAttribute(name) || "";
            const source = attributes.get(name);
            if (!source || current !== source.last) attributes.set(name, { original: current, last: current });
            const original = attributes.get(name).original;
            const translated = translateString(original);
            if (translated !== current) element.setAttribute(name, translated);
            attributes.get(name).last = translated;
          }
        }
      };
      const languageObserver = new MutationObserver((records) => {
        for (const record of records) {
          if (record.type === "characterData") translateNodeText(record.target);
          for (const node of record.addedNodes) {
            if (node.nodeType === Node.TEXT_NODE) translateNodeText(node);
            else if (node.nodeType === Node.ELEMENT_NODE) translateElement(node);
          }
        }
      });
      languageObserver.observe(document.body, { childList: true, characterData: true, subtree: true });
      translateElement(document.body);
      const routeLink = (name, label, icon = "") => `<a class="btn btn-light btn-small" href="#/${name}" data-route="${name}">${icon}${label}</a>`;
      const pageShell = (name, description, body, icon = "✦") => `
        <button class="route-back" type="button" data-route-back>← Quay lại</button>
        <div class="page-heading"><span class="kicker">LITTLE HERO · ${icon}</span><h1>${escapeHtml(pageTitle(name))}</h1>${description ? `<p>${description}</p>` : ""}</div>${body}`;
      const ensureGuestPreviewBanner = () => {
        const routeName = route.split("/")[0];
        const routeView = $("#routeView");
        if (state.authenticated || !previewRoutes.has(routeName) || !routeView || routeView.querySelector(".guest-preview-banner")) return;
        routeView.insertAdjacentHTML("afterbegin", `<aside class="guest-preview-banner" role="note"><span><strong>Chế độ xem trước</strong><small>Bạn có thể khám phá nội dung; đăng nhập để sử dụng chức năng và lưu tiến độ.</small></span><a class="btn btn-primary btn-small" href="#/auth" data-route="auth" data-preview-login>Đăng nhập / đăng ký</a></aside>`);
      };
      const guestPreviewObserver = new MutationObserver(ensureGuestPreviewBanner);
      guestPreviewObserver.observe($("#routeView"), { childList: true });
      const requestLoginForAction = (event) => {
        if (state.authenticated || event.target.closest("#lessonChoices [data-choice]")) return false;
        event.preventDefault();
        event.stopImmediatePropagation();
        pendingAuthRoute = route;
        setRoute("auth");
        toast("Đây là chế độ xem trước. Đăng nhập để sử dụng chức năng này, rồi thử lại nhé.");
        return true;
      };
      document.addEventListener("click", (event) => {
        if (!(event.target instanceof Element) || !event.target.closest(guestActionSelector)) return;
        requestLoginForAction(event);
      }, true);
      document.addEventListener("submit", (event) => {
        if (!(event.target instanceof HTMLFormElement) || !event.target.matches(guestActionFormSelector)) return;
        requestLoginForAction(event);
      }, true);
      document.addEventListener("change", (event) => {
        if (!(event.target instanceof Element) || !event.target.matches(guestPreferenceSelector)) return;
        requestLoginForAction(event);
      }, true);
      const setRoute = (nextRoute, options = {}) => {
        const targetRoute = String(nextRoute || "home").split("/")[0];
        if (route !== nextRoute) stopSpeech();
        if (activeLessonRecognition && route !== nextRoute) {
          const recognition = activeLessonRecognition;
          activeLessonRecognition = null;
          recognition.abort();
        }
        if (cleanupTutorSession && (targetRoute !== "tutor" || route.split("/")[0] === "tutor")) {
          cleanupTutorSession();
          cleanupTutorSession = null;
        }
        if (targetRoute === "home" && route === "auth") pendingAuthRoute = "";
        if (!options.restore && route === "home") state.lastHomeScroll = window.scrollY;
        if (nextRoute !== "arena" && arenaMatchTimeout) {
          window.clearInterval(arenaMatchTimeout);
          arenaMatchTimeout = null;
        }
        if (targetRoute !== "arena" && arenaLeaderboardInterval) {
          window.clearInterval(arenaLeaderboardInterval);
          arenaLeaderboardInterval = null;
        }
        route = nextRoute || "home";
        const hash = `#/${route}`;
        if (!options.pop && location.hash !== hash) {
          routeHistory = routeHistory.slice(0, routeHistoryIndex + 1);
          routeHistory.push(route);
          routeHistoryIndex = routeHistory.length - 1;
          history.pushState({ route, littleHero: true }, "", hash);
        } else if (options.pop) {
          const historyIndex = routeHistory.lastIndexOf(route);
          if (historyIndex >= 0) routeHistoryIndex = historyIndex;
          else {
            routeHistory = [route];
            routeHistoryIndex = 0;
          }
        }
        const update = () => {
          document.body.classList.toggle("route-active", route !== "home");
          document.body.dataset.route = route.split("/")[0];
          $("#mainNav").classList.remove("open");
          $("#mainNav").querySelectorAll("details").forEach((menu) => { menu.open = false; });
          $("#accountMenu").open = false;
          $("#menuBtn").setAttribute("aria-expanded", "false");
          const current = route.startsWith("arena") ? "arena" : route.split("/")[0];
          $("#mainNav").querySelectorAll("[data-route]").forEach((link) => {
            link.classList.toggle("active", link.dataset.route === current || (current === "lesson" && link.dataset.route === "lessons"));
          });
          $("#routeView").innerHTML = "";
          if (route !== "home") renderRoute();
          ensureGuestPreviewBanner();
          if (route === "home") window.LittleHeroMotion?.enterHome();
          else window.LittleHeroMotion?.enterRoute();
          renderStats();
          if (route === "home" && options.restore) window.scrollTo(0, Math.max(0, state.lastHomeScroll));
          else window.scrollTo(0, 0);
          state.lastRoute = route;
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
          catch (error) { console.warn("Không thể lưu vị trí điều hướng.", error); }
        };
        if (activeViewTransition) {
          pendingViewUpdate = update;
          return;
        }
        if (document.startViewTransition && location.protocol !== "file:" && !options.pop) {
          activeViewTransition = true;
          try {
            const transition = document.startViewTransition(update);
            transition.ready.then(
              () => {},
              (error) => {
                if (error.name !== "AbortError" && error.name !== "InvalidStateError") console.error("Không thể khởi chạy hiệu ứng chuyển trang.", error);
              }
            );
            transition.updateCallbackDone.then(
              () => {},
              (error) => {
                if (error.name !== "AbortError" && error.name !== "InvalidStateError") console.error("Không thể cập nhật nội dung khi chuyển trang.", error);
              }
            );
            transition.finished.then(
              () => {
                activeViewTransition = false;
                const queuedUpdate = pendingViewUpdate;
                pendingViewUpdate = null;
                if (queuedUpdate) queuedUpdate();
              },
              (error) => {
                activeViewTransition = false;
                if (error.name !== "AbortError" && error.name !== "InvalidStateError") console.error("Không thể hoàn tất hiệu ứng chuyển trang.", error);
                const queuedUpdate = pendingViewUpdate;
                pendingViewUpdate = null;
                if (queuedUpdate) queuedUpdate();
              }
            );
          } catch (error) {
            activeViewTransition = false;
            if (error.name !== "InvalidStateError") throw error;
            update();
          }
        } else update();
      };
      const navigateBack = () => {
        if (routeHistoryIndex > 0) history.back();
        else setRoute("home");
      };

      const renderLessonCatalog = () => {
        const selectedCategory = route.split("/")[1] || "";
        const allowedCategories = ageAppropriateCategories();
        const available = ageAppropriateLessons().filter((lesson) => !selectedCategory || lesson.category === selectedCategory);
        const unavailableCategory = selectedCategory && !allowedCategories.some((category) => category.id === selectedCategory);
        const cards = available.map((lesson) => {
          const category = categories.find((item) => item.id === lesson.category);
          const image = lessonImage(lesson.category);
          const locked = isPremiumLesson(lesson) && !hasVerifiedPremium();
          return `<article class="catalog-card"><div class="catalog-art" style="--lesson-color:${category.color}">
              <img src="${image.src}" alt="${escapeHtml(image.alt)}" loading="lazy"><span aria-hidden="true">${lesson.icon}</span>
            </div><div class="catalog-card-copy"><span class="kicker">${category.name}</span><h3>${escapeHtml(lesson.title)}</h3>
              <p>${escapeHtml(lesson.goal)}<br>${lesson.age} · ${lesson.duration}${state.completed.includes(lesson.id) ? " · ⭐ Đã hoàn thành" : ""}</p>
            </div><button class="btn ${locked ? "btn-light" : "btn-mint"} btn-small" data-route="${locked ? "pricing" : `lesson/${lesson.id}`}">${locked ? "🔒 Xem gói Premium" : `${state.completed.includes(lesson.id) ? "Học lại" : "Bắt đầu bài học"} →`}</button></article>`;
        }).join("");
        const chips = allowedCategories.map((category) => routeLink(`lessons/${category.id}`, `${category.icon} ${category.name}`)).join("");
        const message = unavailableCategory ? "Chủ đề này chưa nằm trong nhóm tuổi của bé. Đây là các nội dung phù hợp hơn:" : "Chọn bài học phù hợp với độ tuổi và chủ đề bé quan tâm.";
        $("#routeView").innerHTML = pageShell("lessons", message, `<div class="page-actions">${routeLink("lessons", "Tất cả chủ đề", "🏝️")}${chips}</div><div class="lesson-catalog">${cards}</div>`, "KHO BÀI HỌC");
      };

      const { getScene, renderSceneBackdrop, renderSceneActor } = window.createLittleHeroSceneModel({ escapeHtml, freshState, safeWardrobe, renderHeroCharacterSvg, renderLessonCharacterSvg, state });
      const lessonTravelAnimations = new WeakMap();
      const moveLessonActor = (scene, actor, distance, options = {}) => {
        const previous = lessonTravelAnimations.get(actor);
        if (previous) previous.cancel();
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || typeof actor.animate !== "function") return;
        const sceneBounds = scene.getBoundingClientRect();
        const actorBounds = actor.getBoundingClientRect();
        const minX = sceneBounds.left + 8 - actorBounds.left;
        const maxX = sceneBounds.right - 8 - actorBounds.right;
        const deltaX = Math.max(minX, Math.min(maxX, distance));
        if (Math.abs(deltaX) < 3 && !options.gesture) return;
        const target = options.gesture === "retreat"
          ? `translate(${deltaX}px,0) scale(.96)`
          : `translate(${deltaX}px,-5px) scale(1.035)`;
        const destinationX = options.destinationX === undefined
          ? null
          : Math.max(minX, Math.min(maxX, options.destinationX));
        const frames = destinationX === null
          ? [
            { transform: "translate(0,0) scale(1)", offset: 0 },
            { transform: target, offset: .24 },
            { transform: target, offset: .76 },
            { transform: "translate(0,0) scale(1)", offset: 1 }
          ]
          : [
            { transform: "translate(0,0) scale(1)", offset: 0 },
            { transform: target, offset: .27 },
            { transform: target, offset: .42 },
            { transform: `translate(${destinationX}px,-2px) scale(1.02)`, offset: .72 },
            { transform: `translate(${destinationX}px,-2px) scale(1.02)`, offset: 1 }
          ];
        const animation = actor.animate(frames, {
          duration: options.duration || (options.gesture === "retreat" ? 1350 : options.gesture === "meet" ? 1650 : 1500),
          easing: "cubic-bezier(.25,.7,.2,1)",
          fill: options.stayAtTarget ? "forwards" : "none"
        });
        lessonTravelAnimations.set(actor, animation);
        return animation;
      };
      const choreographLessonAnswer = (scene, protagonist, partner, movement) => {
        const p = protagonist.getBoundingClientRect();
        const f = partner.getBoundingClientRect();
        const gap = f.left + f.width / 2 - (p.left + p.width / 2);
        const towardPartner = gap < 0 ? -1 : 1;
        const meetDistance = Math.min(135, Math.max(95, Math.abs(gap) * .46));
        const interactionDistance = Math.min(125, Math.max(90, Math.abs(gap) * .42));
        const retreatPartner = scene.querySelector("#sceneThirdActor");
        if (["action-greet", "action-handshake", "action-apologize"].includes(movement)) {
          moveLessonActor(scene, protagonist, towardPartner * meetDistance, { gesture: "meet" });
          moveLessonActor(scene, partner, -towardPartner * meetDistance, { gesture: "meet" });
          return;
        }
        if (["action-pickup", "action-clean"].includes(movement)) {
          const prop = scene.querySelector(".scene-prop");
          const actorBounds = protagonist.getBoundingClientRect();
          const propBounds = prop?.getBoundingClientRect();
          const actorCenter = actorBounds.left + actorBounds.width / 2;
          const propCenter = propBounds ? propBounds.left + propBounds.width / 2 : actorCenter + towardPartner * 110;
          const sceneBounds = scene.getBoundingClientRect();
          const direction = Math.sign(propCenter - actorCenter) || towardPartner;
          const deltaX = propCenter - actorCenter - direction * 28;
          const isLitterPickup = movement === "action-pickup" && scene.classList.contains("scene-litter");
          const binDelta = sceneBounds.left + sceneBounds.width * .82 - actorCenter - direction * 34;
          protagonist.classList.remove(movement);
          protagonist.classList.add("action-walk");
          moveLessonActor(scene, protagonist, deltaX, {
            gesture: "meet",
            duration: isLitterPickup ? 2400 : 1800,
            destinationX: isLitterPickup ? binDelta : undefined,
            stayAtTarget: true
          });
          if (prop) {
            prop.style.opacity = "1";
            const objectDestination = isLitterPickup
              ? `translate(calc(-50% + ${sceneBounds.left + sceneBounds.width * .83 - propCenter}px), -35px) rotate(12deg) scale(.58)`
              : `translate(calc(-50% + ${actorCenter - propCenter}px), -28px) scale(.62)`;
            const objectFrames = isLitterPickup
              ? [
                { transform: "translateX(-50%) translateY(0) scale(1)", opacity: 1, offset: 0 },
                { transform: "translateX(-50%) translateY(0) scale(1)", opacity: 1, offset: .38 },
                { transform: objectDestination, opacity: 1, offset: .72 },
                { transform: objectDestination, opacity: 0, offset: .84 },
                { transform: objectDestination, opacity: 0, offset: 1 }
              ]
              : [
                { transform: "translateX(-50%) translateY(0) scale(1)", opacity: 1, offset: 0 },
                { transform: "translateX(-50%) translateY(0) scale(1)", opacity: 1, offset: .34 },
                { transform: objectDestination, opacity: 1, offset: .5 },
                { transform: objectDestination, opacity: 0, offset: .62 },
                { transform: objectDestination, opacity: 0, offset: 1 }
              ];
            prop.animate(objectFrames, {
              duration: isLitterPickup ? 2400 : 1800,
              easing: "cubic-bezier(.2,.7,.3,1)",
              fill: "forwards"
            });
          }
          window.setTimeout(() => {
            if (!protagonist.isConnected) return;
            protagonist.classList.remove("action-walk");
            protagonist.classList.add(movement);
          }, isLitterPickup ? 650 : 520);
          return;
        }
        if (["action-wash", "action-breathe", "action-listen", "action-search", "action-sit", "action-stay"].includes(movement)) {
          return;
        }
        if (["action-report", "action-call", "action-assist"].includes(movement)) {
          moveLessonActor(scene, protagonist, towardPartner * interactionDistance);
          if (movement === "action-assist") moveLessonActor(scene, partner, -towardPartner * interactionDistance);
          return;
        }
        if (movement === "action-protect") {
          moveLessonActor(scene, protagonist, -towardPartner * 108);
          moveLessonActor(scene, partner, -towardPartner * 86);
          if (retreatPartner) {
            const strangerBounds = retreatPartner.getBoundingClientRect();
            const strangerCenter = strangerBounds.left + strangerBounds.width / 2;
            const protagonistCenter = p.left + p.width / 2;
            moveLessonActor(scene, retreatPartner, strangerCenter < protagonistCenter ? -100 : 100, { gesture: "retreat" });
          }
          return;
        }
        if (movement === "action-approach") {
          moveLessonActor(scene, protagonist, towardPartner * 130);
          moveLessonActor(scene, partner, -towardPartner * 95);
          if (retreatPartner) {
            const strangerBounds = retreatPartner.getBoundingClientRect();
            const strangerCenter = strangerBounds.left + strangerBounds.width / 2;
            const protagonistCenter = p.left + p.width / 2;
            moveLessonActor(scene, retreatPartner, strangerCenter < protagonistCenter ? -54 : 54, { gesture: "retreat" });
          }
          return;
        }
        if (movement === "action-run" || movement === "action-ride") {
          moveLessonActor(scene, protagonist, movement === "action-run" ? -towardPartner * 140 : towardPartner * 140);
          return;
        }
        moveLessonActor(scene, protagonist, towardPartner * interactionDistance);
        moveLessonActor(scene, partner, -towardPartner * interactionDistance);
      };
      const playSceneEnvironment = (sceneId) => {
        const scene = $(`#${sceneId}`);
        const card = scene?.closest(".scene-card");
        if (!scene || !card) return;
        card.classList.remove("playing");
        void card.offsetWidth;
        card.classList.add("playing");
        window.setTimeout(() => { if (card.isConnected) card.classList.remove("playing"); }, 3400);
      };
      const actionForAnswer = (answer, correct, lesson) => {
        const choice = answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .toLocaleLowerCase("vi").replace(/đ/g, "d");
        if (/\b(giat|nem|het|quat|mang|do loi|ep ban|bat ban|lam dau|danh ban|su dung do dien|cam may say|bo mu)\b/.test(choice)) return "action-unsafe";
        if (lesson.category === "community" && /\b(tra loi|phan hoi|gui anh|gui dia chi|tiep tuc tro chuyen)\b/.test(choice)) return "action-unsafe";
        if (/\b(khong di theo|khong tra loi|khong phan hoi|khong gui|khong chia se|giu khoang cach|tu choi|chan tai khoan|khong cham|khong bao gio)\b/.test(choice)) return "action-protect";
        if (/\b(di theo|theo nguoi|di voi nguoi la)\b/.test(choice)) return "action-approach";
        if (/\b(chay|tu di|di ra|mot minh|tang toc)\b/.test(choice)) return "action-run";
        if (/\b(giau|bi mat|khong noi|khong ke|gia vo khong thay)\b/.test(choice)) return "action-hide";
        if (/\b(cho den khi|doi den khi|dung yen|dung lai|o lai)\b/.test(choice) || /\bo canh\b.*\bcho\b/.test(choice)) return "action-stay";
        if (/\b(ngoi nghi|ngoi xuong|nghi mot chut)\b/.test(choice)) return "action-sit";
        if (/\b(di bo|di den|buoc den|quay lai|bo di|di khoi|roi di|tranh xa)\b/.test(choice)) return "action-walk";
        if (/\b(goi nguoi|keu nguoi lon|bao ngay)\b/.test(choice)) return "action-call";
        if (/\b(nho (me|bo|nguoi lon)|bao (nguoi lon|me|bo|co|cho)|noi voi|noi ro|chia se|tam su|tra loi)\b/.test(choice) || /\bhoi\b.*\bcach\b/.test(choice)) return "action-report";
        if (/\btim\b|\bkiem tra\b|\bxac dinh diem\b|\bquan sat\b/.test(choice)) return "action-search";
        if (/\b(rua tay|xa phong|cha hai|rua sach bot)\b/.test(choice)) return "action-wash";
        if (/\b(nhat|bo rac|bo vo banh|gom|xep lai|xay lai|dua lai|tra lai)\b/.test(choice)) return "action-pickup";
        if (/\b(lau|khan|tham nuoc|don sach|lau kho)\b/.test(choice)) return "action-clean";
        if (/\b(xin loi|sua sai|khac phuc)\b/.test(choice)) return "action-apologize";
        if (/\b(tho|binh tinh|tam dung|hit tho)\b/.test(choice)) return "action-breathe";
        if (/\b(lang nghe|cho .* thoi gian|dong y cho .* nghi|cho ban nghi|hoi .* cam thay)\b/.test(choice)) return "action-listen";
        if (/\bbat tay\b/.test(choice)) return "action-handshake";
        if (/\b(doi mu|do bao ho|tap xe|xe dap|giu thang bang)\b/.test(choice)) return "action-ride";
        if (/\b(chao|mim cuoi|gioi thieu|hoi ban|choi cung|moi ban)\b/.test(choice)) return "action-greet";
        if (/\b(cung|hop tac|chia nhau|can than|dua lai|tra lai)\b/.test(choice)) return "action-assist";
        if (!correct) return "action-unsafe";
        const categoryGestures = {
          emotion: "action-breathe",
          social: "action-greet",
          safety: "action-report",
          health: "action-wash",
          thinking: "action-report",
          care: "action-pickup",
          creative: "action-ride",
          community: "action-protect"
        };
        const lessonGestures = {
          calm: "action-breathe",
          sorry: "action-apologize",
          stranger: "action-protect",
          "new-thing": "action-ride"
        };
        return lessonGestures[lesson.id] || categoryGestures[lesson.category] || "action-greet";
      };
      const emotionForAnswer = (answer, correct, movement) => {
        const choice = answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .toLocaleLowerCase("vi").replace(/đ/g, "d");
        if (/\b(gian|tuc gian|het|quat|mang|giat|nem|do loi|ep ban|bat ban)\b/.test(choice)) return "angry";
        if (/\b(buon|khoc|tiec)\b/.test(choice)) return "sad";
        if (/\b(lo lang|so hai|hoi hop|boi roi|chua san sang)\b/.test(choice)) return "concerned";
        if (/\b(vui|mim cuoi|hao hung|tu tin|cam on|chuc mung)\b/.test(choice)) return "happy";
        if (correct && ["action-breathe", "action-listen", "action-protect", "action-report", "action-stay", "action-wash"].includes(movement)) return "calm";
        return correct ? "happy" : "concerned";
      };
      const resolveChoiceActors = (answer, scene, protagonist, partner) => {
        const text = answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("vi").replace(/[^a-z0-9]+/g, " ").trim();
        const aliases = {
          "me": ["me", "ma"],
          "bo": ["bo", "ba", "cha"],
          "co giao": ["co giao", "thay co"],
          "nhan vien": ["nhan vien", "bao ve"],
          "nguoi la": ["nguoi la", "nguoi do"],
          "ban": ["ban"],
          "em": ["em"],
          "hero": ["hero"]
        };
        const actors = [...scene.querySelectorAll(".scene-actor")];
        const tokensFor = (actor) => {
          const label = actor.querySelector(".actor-name")?.textContent?.trim() || "";
          const normalized = label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("vi").replace(/[^a-z0-9]+/g, " ").trim();
          return [...new Set([normalized, ...(aliases[normalized] || []), ...(actor === protagonist ? aliases.hero : [])].filter(Boolean))];
        };
        const matches = (actor, atStart = false) => tokensFor(actor).some((token) =>
          atStart ? text === token || text.startsWith(`${token} `) : ` ${text} `.includes(` ${token} `)
        );
        const subject = actors.find((actor) => matches(actor, true));
        const mentioned = actors.filter((actor) => matches(actor));
        const lead = subject || protagonist;
        const companion = mentioned.find((actor) => actor !== lead) ||
          (lead === protagonist ? partner : protagonist);
        return { lead, companion, mentioned };
      };
      const propForChoice = (answer, lesson) => {
        const choice = answer.toLocaleLowerCase("vi");
        if (choice.includes("sách")) return "📚";
        if (choice.includes("xếp") || choice.includes("xây lại") || choice.includes("khối")) return "🧱";
        if (choice.includes("rửa tay")) return "🫧";
        if (/\brác\b/.test(choice) || choice.includes("vỏ bánh") || choice.includes("thùng")) return "🗑️";
        if (choice.includes("xin lỗi")) return "💛";
        return lesson.category === "emotion" ? "💬" : lesson.category === "social" ? "🤝" : "✨";
      };
      const animateSceneChoice = (sceneId, heroId, friendId, propId, answer, lesson, correct) => {
        const scene = $(`#${sceneId}`);
        if (!scene) return;
        const protagonist = $(`#${heroId}`);
        const partner = $(`#${friendId}`);
        if (!protagonist || !partner) return;
        const { lead, companion, mentioned } = resolveChoiceActors(answer, scene, protagonist, partner);
        const actors = [...scene.querySelectorAll(".scene-actor")];
        actors.forEach((actor) => {
          [...actor.classList].forEach((className) => {
            if (className.startsWith("action-")) actor.classList.remove(className);
            if (className.startsWith("mood-")) actor.classList.remove(className);
          });
          void actor.offsetWidth;
        });
        playSceneEnvironment(sceneId);
        const movement = actionForAnswer(answer, correct, lesson);
        const partnerMovement = correct
          ? ({
            "action-wash": "action-guide",
            "action-pickup": "action-assist",
            "action-clean": "action-assist",
            "action-apologize": "action-forgive",
            "action-breathe": "action-mirror-breathe",
            "action-greet": "action-greet",
            "action-handshake": "action-handshake-partner",
            "action-report": "action-listen",
            "action-protect": "action-guide",
            "action-ride": "action-guide"
          }[movement] || "action-encourage")
          : ({
            "action-approach": "action-protect",
            "action-run": "action-call",
            "action-hide": "action-search",
            "action-pause": "action-encourage"
          }[movement] || "action-warn");
        const responseEmotion = correct
          ? ["action-apologize", "action-assist", "action-greet", "action-handshake", "action-pickup"].includes(movement) ? "happy" : "calm"
          : emotionForAnswer(answer, false, movement);
        const involvedActors = new Set([lead, companion, ...mentioned]);
        involvedActors.forEach((actor) => {
          const actorMovement = actor === lead ? movement : partnerMovement;
          const actorEmotion = actor === lead ? emotionForAnswer(answer, correct, movement) : responseEmotion;
          actor.classList.add(actorMovement, `mood-${actorEmotion}`);
          setCharacterExpression(actor, actorEmotion);
        });
        if (lead.querySelector(".lesson-character-svg")) {
          choreographLessonAnswer(scene, lead, companion, movement);
        }
        const stranger = scene.querySelector("#sceneThirdActor");
        if (stranger?.querySelector(".actor-name")?.textContent.trim() === "Người lạ") {
          stranger.classList.remove("action-protect", "action-stay", "mood-happy", "mood-sad", "mood-concerned");
          stranger.classList.add(
            ["action-protect", "action-approach"].includes(movement) || !correct ? "action-step-back" : "action-stay",
            "mood-concerned"
          );
          setCharacterExpression(stranger, "concerned");
        }
        $(`#${propId}`).textContent = correct ? propForChoice(answer, lesson) : "⚡";
      };

      const renderLessonRoute = (lessonId) => {
        const sourceLesson = lessonById(lessonId);
        if (sourceLesson && !ageCategories[currentAgeGroup()].includes(sourceLesson.category)) {
          $("#routeView").innerHTML = pageShell("lessons", "Bài học này dành cho nhóm tuổi khác. Hero đã chọn sẵn các bài phù hợp với bé.", routeLink("lessons", "Xem bài học phù hợp", "🏝️"));
          return;
        }
        if (!sourceLesson) { $("#routeView").innerHTML = pageShell("lessons", "Không tìm thấy bài học này.", routeLink("lessons", "Xem kho bài học", "🏝️")); return; }
        if (isPremiumLesson(sourceLesson) && !hasVerifiedPremium()) {
          renderLockedPlanPage("Bài học này thuộc thư viện Premium", "Chọn gói tháng hoặc năm để mở khóa các bài học nâng cao sau khi thanh toán được xác minh.");
          return;
        }
        const lesson = { ...sourceLesson, age: currentAgeLabel() };
        const category = categories.find((item) => item.id === lesson.category);
        const scene = getScene(lesson);
        const questions = [
          { story: lesson.story, prompt: "Bé sẽ chọn cách nào?", answers: lesson.answers, correct: lesson.correct },
          ...(lessonFollowUps[lesson.id] || []).map((question) => ({ ...question, correct: Number.isInteger(question.correct) ? question.correct : 0 }))
        ];
        let questionIndex = 0;
        const done = state.completed.includes(lesson.id);
        const prior = state.lessonMistakes?.[lesson.id] || 0;
        $("#routeView").innerHTML = pageShell("lessons", `${category.icon} ${category.name} · ${lesson.age} · ${lesson.duration}`, `
          <p class="lesson-demo-notice" role="note">Hiện tại đây chỉ là giao diện demo, LITTLE HERO sẽ được phát triển và nâng cấp trong tương lai.</p>
          <div class="lesson-layout">
            <div>
              <div class="lesson-progress"><span>📖 Mạch câu chuyện</span><span id="questionProgress">Câu hỏi 1/${questions.length}${done ? " · Đã hoàn thành, có thể luyện tập lại" : ""}</span></div>
              <article class="scene-card">
                <div class="scene ${scene.type} scene-${scene.variant} scene-lesson-${lesson.category}${scene.thirdCharacter ? " scene-with-third-character" : ""}${lessonSceneImages[lesson.id] ? " has-illustration" : ""}" id="lessonScene">
                    ${lessonSceneImages[lesson.id]
                      ? `<img class="lesson-scene-illustration" src="${lessonSceneImages[lesson.id].src}" alt="${escapeHtml(lessonSceneImages[lesson.id].alt)}">`
                      : `${renderSceneBackdrop(scene)}
                        <span class="scene-kicker">📍 ${scene.place}</span><span class="scene-prop" id="sceneProp">${scene.prop}</span>
                        ${scene.thirdCharacter ? renderSceneActor("sceneThirdActor", scene.thirdCharacter.name, false, scene.thirdCharacter, true) : ""}
                        ${renderSceneActor("lessonProtagonist", scene.protagonist.name, false, scene.protagonist, true)}
                        ${renderSceneActor("lessonPartner", scene.friend.name, false, scene.friend, true)}`}
                </div>
              </article>
            </div>
            <section class="lesson-question-panel">
              <div class="score-card lesson-question-card">
                <div class="lesson-progress"><span><strong>${escapeHtml(lesson.title)}</strong></span><span>⭐ +3 mỗi câu đúng · lần đầu hoàn thành +${lesson.reward}</span></div>
                <p id="questionStory" class="lesson-story"></p>
                <p id="questionPrompt" class="lesson-prompt"></p>
                <div class="page-actions lesson-voice-controls">
                  <button class="btn btn-light btn-small" id="lessonSpeak" type="button">🔊 Nghe đề bài và các phương án</button>
                  <button class="btn btn-light btn-small" id="lessonStopSpeech" type="button" aria-label="Dừng giọng đọc" aria-pressed="false" disabled>⏹ Dừng đọc</button>
                  <button class="btn btn-mint btn-small" id="lessonVoiceAnswer" type="button" aria-pressed="false">🎙️ Trả lời bằng giọng nói</button>
                </div>
                <p class="lesson-voice-status" id="lessonVoiceStatus" aria-live="polite"></p>
                <div class="lesson-choices" id="lessonChoices"></div>
                <p class="lesson-feedback" id="lessonRouteFeedback" aria-live="polite">${prior ? `Bé đã thử ${prior} lựa chọn chưa phù hợp. Hãy bình tĩnh suy nghĩ lại nhé.` : "Bé hãy chọn phương án mình nghĩ là phù hợp."}</p>
                <details class="lesson-hint">
                  <summary>💡 Gợi ý để bé suy nghĩ</summary>
                  <div>${lesson.prompts.slice(0, 2).map((prompt) => `<p>${escapeHtml(prompt)}</p>`).join("")}</div>
                </details>
                <p class="lesson-safety-note">Nếu tình huống xảy ra ngoài đời và bé cảm thấy không an toàn, hãy rời đi và báo ngay người lớn đáng tin cậy.</p>
                <button class="btn btn-light btn-small" data-route="lessons/${category.id}">← Quay lại chủ đề</button>
              </div>
            </section>
          </div>
          <div class="lesson-context"><span class="kicker">HỌC QUA TRẢI NGHIỆM</span><h3>${escapeHtml(lesson.goal)}</h3>
            <div class="lesson-meta"><span>♧ ${lesson.age}</span><span>◷ ${lesson.duration}</span></div>
            <strong>🌱 Thử thách ngoài đời</strong><p>${escapeHtml(lesson.activity)}</p>
          </div>
        `, "BÀI HỌC TƯƠNG TÁC");
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const voiceStatus = $("#lessonVoiceStatus");
        const voiceButton = $("#lessonVoiceAnswer");
        let voiceSilenceTimer = 0;
        let voiceNoSpeechTimer = 0;
        let voiceMaxDurationTimer = 0;
        const clearLessonVoiceTimers = () => {
          window.clearTimeout(voiceSilenceTimer);
          window.clearTimeout(voiceNoSpeechTimer);
          window.clearTimeout(voiceMaxDurationTimer);
          voiceSilenceTimer = 0;
          voiceNoSpeechTimer = 0;
          voiceMaxDurationTimer = 0;
        };
        const setLessonVoiceListening = (listening) => {
          voiceButton.classList.toggle("is-listening", listening);
          voiceButton.setAttribute("aria-pressed", String(listening));
          voiceButton.textContent = listening ? "⏹ Dừng nghe" : "🎙️ Trả lời bằng giọng nói";
          voiceStatus.classList.toggle("is-listening", listening);
        };
        const stopLessonRecognition = () => {
          if (!activeLessonRecognition) return;
          const recognition = activeLessonRecognition;
          activeLessonRecognition = null;
          clearLessonVoiceTimers();
          recognition.abort();
          setLessonVoiceListening(false);
        };
        const normalizeVoiceText = (text) => String(text).toLocaleLowerCase("vi")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .replace(/[^\p{L}\p{N}\s]/gu, " ")
          .replace(/\s+/g, " ")
          .trim();
        const matchSpokenAnswer = (transcript, answers) => {
          const normalizedTranscript = normalizeVoiceText(transcript);
          const normalizedAnswers = answers.map(normalizeVoiceText);
          const statedChoice = normalizedTranscript.match(/\b(?:phuong an|dap an|cau tra loi|option|answer|choice|choose|pick|select|number)\s+(?:so\s+)?(1|2|3|mot|hai|ba|one|two|three|a|b|c)\b/)
            || normalizedTranscript.match(/\b(?:lua chon|cach|y|chon|chose|choose|pick|select)\s+(?:(?:phuong an|dap an|cach|y)\s+)?(?:cai\s+)?(?:thu\s+)?(?:the\s+)?(1|2|3|mot|hai|ba|nhat|nhi|one|two|three|first|second|third|a|b|c)(?:\s+one)?\b/)
            || normalizedTranscript.match(/\b(?:phuong an|dap an|lua chon|cach|y|option|answer|choice)\s+(?:thu\s+)?(dau tien|thu nhat|thu hai|thu ba|first|second|third)\b/)
            || normalizedTranscript.match(/^(1|2|3|mot|hai|ba|nhat|nhi|one|two|three|first|second|third|a|b|c)$/);
          if (statedChoice) {
            const choiceIndex = { "1": 0, "mot": 0, "nhat": 0, "dau tien": 0, "thu nhat": 0, one: 0, first: 0, a: 0, "2": 1, "hai": 1, "nhi": 1, "thu hai": 1, two: 1, second: 1, b: 1, "3": 2, "ba": 2, "thu ba": 2, three: 2, third: 2, c: 2 }[statedChoice[1]];
            if (choiceIndex < answers.length) return choiceIndex;
          }
          const exactMatches = normalizedAnswers
            .map((answer, index) => ({ answer, index }))
            .filter(({ answer }) => answer && normalizedTranscript.includes(answer))
            .sort((left, right) => right.answer.length - left.answer.length);
          if (exactMatches.length && (exactMatches.length === 1 || exactMatches[0].answer.length > exactMatches[1].answer.length)) return exactMatches[0].index;

          const ignoredWords = new Set(["va", "la", "thi", "be", "con", "cach", "nao", "gi", "nhu", "the", "de", "co", "mot", "nguoi", "em", "cho", "giup", "minh", "se", "can", "neu", "voi", "tai", "sao", "hay", "hoac", "ngay", "cung", "duoc"]);
          const answerWords = normalizedAnswers.map((answer) => new Set(
            answer.split(" ").filter((word) => word.length > 2 && !ignoredWords.has(word))
          ));
          const transcriptWords = normalizedTranscript.split(" ").filter(Boolean);
          const distinguishingWords = answerWords.map((words, index) => new Set(
            [...words].filter((word) => answerWords.every((otherWords, otherIndex) => otherIndex === index || !otherWords.has(word)))
          ));
          const keywordsByAnswer = answerWords.map((words, index) =>
            distinguishingWords[index].size ? distinguishingWords[index] : words
          );
          const scores = answerWords.map((words, index) => {
            const keywords = keywordsByAnswer[index];
            const matched = [...keywords].filter((word) => transcriptWords.some((spokenWord) =>
              spokenWord === word
              || (Math.min(spokenWord.length, word.length) >= 4
                && (spokenWord.startsWith(word) || word.startsWith(spokenWord)))
            )).length;
            return { index, matched, coverage: matched / Math.max(1, keywords.size) };
          }).sort((left, right) => right.matched - left.matched || right.coverage - left.coverage);
          const [best, second] = scores;
          if (!best || best.matched < Math.min(2, keywordsByAnswer[best.index].size) || best.matched <= (second?.matched || 0)) return null;
          return best.index;
        };
        const renderQuestion = () => {
          stopLessonRecognition();
          const sceneProp = $("#sceneProp");
          if (sceneProp) {
            sceneProp.getAnimations().forEach((animation) => animation.cancel());
            sceneProp.style.opacity = "";
            sceneProp.style.transform = "";
            sceneProp.textContent = scene.prop;
          }
          const question = questions[questionIndex];
          $("#questionProgress").textContent = `Câu hỏi ${questionIndex + 1}/${questions.length}${done ? " · Đã hoàn thành, có thể luyện tập lại" : ""}`;
          $("#questionStory").textContent = question.story;
          $("#questionPrompt").textContent = question.prompt;
          voiceStatus.textContent = "";
          $("#lessonChoices").innerHTML = question.answers.map((answer, index) =>
            `<button type="button" class="lesson-choice" data-choice="${index}"><span class="choice-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(answer)}</span></button>`
          ).join("");
          $("#lessonRouteFeedback").textContent = "Bé hãy chọn phương án mình nghĩ là phù hợp.";
          $("#lessonChoices").querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => {
            if (button.disabled) return;
            stopLessonRecognition();
            const choice = Number(button.dataset.choice);
            const correct = choice === question.correct;
            if (state.authenticated) recordLearningAttempt(lesson, choice, questionIndex, question.correct);
            const choices = [...$("#lessonChoices").querySelectorAll("[data-choice]")];
            choices.forEach((option) => { option.disabled = true; });
            const selectedAnswer = question.answers[choice];
            const selectedAnswerText = translateString(selectedAnswer);
            animateSceneChoice("lessonScene", "lessonProtagonist", "lessonPartner", "sceneProp", selectedAnswer, lesson, correct);
            speak(state.language === "en"
              ? correct
                ? `Great job! You chose a safe and helpful response: ${selectedAnswerText}.`
                : `Not quite. Let's try again. "${selectedAnswerText}" may not be the safest choice. Choose another option.`
              : correct
                ? `Tuyệt vời! Con đã chọn cách phù hợp: ${selectedAnswer}. ${lesson.prompts[2] || lesson.goal}`
                : `Không sao, con hãy thử lại nhé. Cách "${selectedAnswer}" chưa phù hợp vì ${lesson.prompts[1] || lesson.goal} Con có thể chọn một cách khác an toàn hơn.`);
            window.setTimeout(() => {
              if (!button.isConnected) return;
              if (!correct) {
                button.classList.add("incorrect");
                if (state.authenticated) {
                  state.lessonMistakes = state.lessonMistakes || {};
                  state.lessonMistakes[lesson.id] = (state.lessonMistakes[lesson.id] || 0) + 1;
                  persist();
                }
                $("#lessonRouteFeedback").textContent = state.language === "en"
                  ? "Not quite. Think about what would keep everyone safe, then try another answer."
                  : `Chưa phù hợp, mình thử lại nhé. ${lesson.prompts[1] || "Bé hãy suy nghĩ lại và thử một lựa chọn khác nhé."}`;
                choices.forEach((option) => { option.disabled = false; });
                return;
              }
              button.classList.add("correct");
              if (state.authenticated) state.xp += 3;
              $("#lessonChoices").querySelectorAll("[data-choice]").forEach((option) => { option.disabled = true; });
              if (questionIndex < questions.length - 1) {
                $("#lessonRouteFeedback").textContent = state.language === "en"
                  ? state.authenticated
                    ? "That's right! You chose a helpful and safe response. +3 stars 🌟"
                    : "That's right! Sign in to save your learning progress and stars."
                  : state.authenticated
                    ? `Đúng rồi! ${lesson.prompts[2] || "Con đã chọn cách phù hợp."} +3 sao 🌟`
                    : `Đúng rồi! ${lesson.prompts[2] || "Con đã chọn cách phù hợp."} Đăng nhập để lưu tiến độ nhé.`;
                const nextQuestion = document.createElement("button");
                nextQuestion.className = "btn btn-mint btn-small";
                nextQuestion.id = "nextQuestion";
                nextQuestion.style.marginTop = "9px";
                nextQuestion.textContent = `Câu chuyện tiếp theo · Câu ${questionIndex + 2} →`;
                nextQuestion.addEventListener("click", () => {
                  questionIndex += 1;
                  renderQuestion();
                  nextQuestion.remove();
                });
                $("#lessonChoices").insertAdjacentElement("afterend", nextQuestion);
                if (state.authenticated) persist();
                return;
              }
              if (!state.authenticated) {
                $("#lessonRouteFeedback").textContent = "Đúng rồi! Đăng nhập để lưu tiến độ học và nhận sao nhé.";
                return;
              }
              const firstCompletion = !state.completed.includes(lesson.id);
              if (firstCompletion) {
                state.completed.push(lesson.id);
                state.xp += lesson.reward;
                state.completedDays = [...new Set([...state.completedDays, currentDay()])];
                state.dailyLessons += 1;
              }
              state.rp += 25;
              persist();
              renderIslands();
              renderFeatured();
              renderLeaderboard();
              $("#lessonRouteFeedback").textContent = firstCompletion
                ? `Hoàn thành cả 3 câu chuyện! Bé nhận thêm +${lesson.reward} ⭐ và +25 RP.`
                : "Hoàn thành lượt luyện tập cả 3 câu chuyện! Bé đã nhận sao cho từng câu trả lời đúng.";
              speak(`Chúc mừng con đã hoàn thành bài học ${lesson.title}! Con đã nhận thêm ${firstCompletion ? lesson.reward : 0} sao. ${lesson.goal}`);
              const nextLesson = lessons[lessons.indexOf(lesson) + 1];
              const continueButton = document.createElement("button");
              continueButton.className = "btn btn-mint btn-small";
              continueButton.id = "finishLesson";
              continueButton.style.marginTop = "9px";
              continueButton.textContent = nextLesson ? "Chọn bài học tiếp theo →" : "Xem kho bài học →";
              continueButton.addEventListener("click", () => setRoute(nextLesson ? `lessons/${nextLesson.category}` : "lessons"));
              $("#lessonChoices").insertAdjacentElement("afterend", continueButton);
            }, 620);
          }));
          const spokenOptionLabel = state.language === "en" ? "Option" : "Phương án";
          speak(`${translateString(question.story)} ${translateString(question.prompt)} ${question.answers.map((answer, index) => `${spokenOptionLabel} ${index + 1}: ${translateString(answer)}`).join(". ")} ${state.language === "en" ? "You can answer by voice or choose an option below." : "Bé có thể trả lời bằng giọng nói hoặc chọn một phương án bên dưới."}`, () => {
            if (voiceStatus.isConnected && !activeLessonRecognition) voiceStatus.textContent = "Đến lượt bé trả lời nhé. Bé có thể nói hoặc chọn một phương án.";
          });
        };
        renderQuestion();
        $("#lessonSpeak").addEventListener("click", () => {
          const question = questions[questionIndex];
          const spokenOptionLabel = state.language === "en" ? "Option" : "Phương án";
          speak(`${translateString(question.story)} ${translateString(question.prompt)} ${question.answers.map((answer, index) => `${spokenOptionLabel} ${index + 1}: ${translateString(answer)}`).join(". ")}`);
        });
        $("#lessonStopSpeech").addEventListener("click", stopSpeech);
        voiceButton.addEventListener("click", () => {
          if (!SpeechRecognition) {
            voiceStatus.textContent = "Trình duyệt này chưa hỗ trợ nhận diện giọng nói. Bé có thể chọn một phương án bên dưới nhé.";
            return;
          }
          if (activeLessonRecognition) {
            voiceStatus.textContent = "Đang dừng micro và xử lý câu trả lời…";
            activeLessonRecognition.stop();
            return;
          }

          const recognition = new SpeechRecognition();
          let handledResult = false;
          let transcript = "";
          let speechCandidates = [];
          let receivedSpeech = false;
          let recognitionFailed = false;
          recognition.lang = state.language === "en" ? "en-US" : "vi-VN";
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.maxAlternatives = 3;
          recognition.onstart = () => {
            setLessonVoiceListening(true);
            voiceStatus.textContent = "Đang nghe… khi bé ngừng nói, Hero sẽ tự xử lý câu trả lời.";
            voiceNoSpeechTimer = window.setTimeout(() => {
              if (activeLessonRecognition !== recognition || receivedSpeech) return;
              voiceStatus.textContent = "Hết thời gian chờ. Hero đang dừng micro…";
              recognition.stop();
            }, 20000);
            voiceMaxDurationTimer = window.setTimeout(() => {
              if (activeLessonRecognition !== recognition) return;
              voiceStatus.textContent = "Đã nghe đủ lâu. Hero đang xử lý phần bé vừa nói…";
              recognition.stop();
            }, 45000);
          };
          recognition.onresult = (event) => {
            if (handledResult || activeLessonRecognition !== recognition) return;
            const results = Array.from(event.results);
            transcript = results
              .map((result) => result[0]?.transcript?.trim() || "")
              .filter(Boolean)
              .join(" ");
            if (!transcript) return;
            speechCandidates = results.flatMap((result) => Array.from(result)
              .map((alternative) => alternative.transcript?.trim() || ""))
              .filter(Boolean);
            receivedSpeech = true;
            window.clearTimeout(voiceNoSpeechTimer);
            window.clearTimeout(voiceSilenceTimer);
            voiceStatus.textContent = `Đang nhận diện: “${transcript}”`;
            const hasFinalResult = Array.from(event.results).some((result) => result.isFinal);
            if (!hasFinalResult) return;
            voiceSilenceTimer = window.setTimeout(() => {
              if (activeLessonRecognition !== recognition) return;
              voiceStatus.textContent = "Bé vừa ngừng nói. Hero đang xử lý câu trả lời…";
              recognition.stop();
            }, 2200);
          };
          recognition.onerror = (event) => {
            if (event.error === "aborted") return;
            recognitionFailed = true;
            clearLessonVoiceTimers();
            const messages = {
              "no-speech": "Hero chưa nghe thấy tiếng nói. Bé thử lại ở nơi yên tĩnh hơn nhé.",
              "not-allowed": "Micro chưa được cấp quyền. Hãy bật quyền micro trong trình duyệt rồi thử lại nhé.",
              "service-not-allowed": "Micro chưa được cấp quyền. Hãy bật quyền micro trong trình duyệt rồi thử lại nhé.",
              "audio-capture": "Hero chưa tìm thấy micro. Bé có thể chọn một phương án bên dưới nhé.",
              network: "Trình duyệt bị mất kết nối với dịch vụ nhận diện giọng nói. Hãy kiểm tra kết nối mạng rồi thử lại, hoặc chọn một phương án nhé."
            };
            const message = messages[event.error] || "Hero chưa nhận diện được giọng nói. Bé hãy thử lại nhé.";
            voiceStatus.textContent = message;
            if (event.error === "no-speech") speak(message);
          };
          recognition.onend = () => {
            const wasActive = activeLessonRecognition === recognition;
            if (wasActive) activeLessonRecognition = null;
            clearLessonVoiceTimers();
            setLessonVoiceListening(false);
            if (!wasActive || handledResult || recognitionFailed) return;
            if (transcript) {
              handledResult = true;
              const answerOptions = questions[questionIndex].answers.map(translateString);
              const matchedAnswer = [transcript, ...speechCandidates]
                .filter((candidate, index, candidates) => candidate && candidates.indexOf(candidate) === index)
                .map((candidate) => ({ transcript: candidate, answerIndex: matchSpokenAnswer(candidate, answerOptions) }))
                .find((candidate) => candidate.answerIndex !== null);
              if (!matchedAnswer) {
                voiceStatus.textContent = `Hero nghe bé nói: “${transcript}”. Bé có thể trả lời về tình huống này hoặc chọn một phương án bên dưới nhé.`;
                speak("Không sao, Hero chưa hiểu rõ câu trả lời. Bé có thể nói ngắn gọn điều con nghĩ về tình huống này, hoặc chọn một phương án bên dưới nhé.");
                return;
              }
              voiceStatus.textContent = `Hero nghe bé nói: “${matchedAnswer.transcript}”. Đang kiểm tra câu trả lời…`;
              $("#lessonChoices").querySelector(`[data-choice="${matchedAnswer.answerIndex}"]`)?.click();
              return;
            }
            voiceStatus.textContent = "Hero chưa nghe thấy tiếng nói. Bé thử lại ở nơi yên tĩnh hơn nhé.";
            speak(voiceStatus.textContent);
          };
          activeLessonRecognition = recognition;
          try {
            if ("speechSynthesis" in window) window.speechSynthesis.cancel();
            recognition.start();
          } catch (error) {
            activeLessonRecognition = null;
            clearLessonVoiceTimers();
            setLessonVoiceListening(false);
            voiceStatus.textContent = "Không thể bật micro lúc này. Bé thử lại hoặc chọn một phương án nhé.";
            console.warn("Không thể bắt đầu nhận diện giọng nói cho bài học.", error);
          }
        });
      };

      const renderStoriesPage = (page = "stories") => {
        $("#routeView").innerHTML = pageShell(page, "", storyComingSoonNotice, "GÓC TRUYỆN");
      };

      const miniGames = {
        memory: { icon: "🃏", title: "Thẻ nhớ kỳ diệu", description: "Lật thẻ và tìm các cặp hình giống nhau. Trò chơi rèn trí nhớ và sự tập trung.", reward: 10, accent: "#fff2d5" },
        pattern: { icon: "🔎", title: "Thám tử quy luật", description: "Quan sát chuỗi hình, tìm xem hình nào sẽ xuất hiện tiếp theo.", reward: 10, accent: "#e5f4ff" },
        feelings: { icon: "💛", title: "Nhà thám hiểm cảm xúc", description: "Đọc tình huống và đoán cảm xúc mà bạn nhỏ có thể đang trải qua.", reward: 10, accent: "#ffe8ed" },
        sequence: { icon: "🧭", title: "Xếp bước thật khéo", description: "Sắp xếp cách xử lý tình huống theo thứ tự an toàn và hợp lý.", reward: 10, accent: "#e8f7e9" },
        observe: { icon: "🧐", title: "Mắt tinh của Hero", description: "Tìm chi tiết khác biệt, rèn khả năng quan sát và tập trung.", reward: 10, accent: "#f0e9ff" }
      };
      const patternRounds = [
        { sequence: ["🔴", "🔵", "🔴", "🔵", "?"], options: ["🔴", "🟡", "🟢"], answer: 0, hint: "Hai màu đang thay phiên nhau." },
        { sequence: ["🐱", "🐶", "🐱", "🐶", "?"], options: ["🐰", "🐱", "🐶"], answer: 1, hint: "Hãy nhìn xem hình nào xuất hiện ở vị trí lẻ." },
        { sequence: ["⭐", "⭐", "🌙", "⭐", "⭐", "?"], options: ["☀️", "🌙", "⭐"], answer: 1, hint: "Sau hai ngôi sao luôn đến một mặt trăng." }
      ];
      const feelingsRounds = [
        { situation: "Bạn vừa được cả nhà tặng một bức tranh thật đẹp.", options: ["😊 Vui", "😢 Buồn", "😟 Lo lắng"], answer: 0 },
        { situation: "Tháp xếp hình bạn đang xây bỗng đổ xuống.", options: ["😠 Tức giận", "😢 Buồn hoặc thất vọng", "😴 Buồn ngủ"], answer: 1 },
        { situation: "Bạn nghe tiếng sấm lớn khi đang ở trong nhà.", options: ["😟 Lo lắng hoặc sợ", "😄 Vui", "😎 Tự hào"], answer: 0 }
      ];
      const sequenceRounds = [
        { situation: "Nước vừa đổ ra bàn và sách ở gần đó.", options: ["Báo người lớn → cùng lau nước", "Dùng máy sấy điện → lau nước", "Bỏ đi → để nước lan ra"], answer: 0, hint: "Trước tiên hãy báo người lớn; sau đó cùng lau khi đã an toàn." },
        { situation: "Bé muốn làm quen với bạn đang xếp hình.", options: ["Giật đồ chơi → bắt đầu chơi", "Chào bạn → hỏi bạn có muốn chơi cùng", "Ra lệnh bạn nhường chỗ → ngồi xuống"], answer: 1, hint: "Một lời chào thân thiện và câu hỏi lịch sự giúp bạn được tự chọn." },
        { situation: "Bé vừa chơi ngoài sân và sắp đến giờ ăn.", options: ["Rửa tay với xà phòng → ngồi vào bàn", "Lau tay vào áo → ăn ngay", "Ăn trước → rửa tay sau"], answer: 0, hint: "Rửa tay sạch trước khi ăn giúp giữ vệ sinh." }
      ];
      const observationRounds = [
        { items: ["🍎", "🍎", "🦊", "🍎"], options: ["🦊 Con cáo", "🍎 Quả táo", "🍐 Quả lê"], answer: 0, hint: "Ba hình là trái cây; hãy tìm hình không phải trái cây." },
        { items: ["🐶", "🐱", "🐰", "🥕"], options: ["🐱 Con mèo", "🥕 Củ cà rốt", "🐰 Con thỏ"], answer: 1, hint: "Ba hình là các con vật; tìm món ăn khác nhóm nhé." },
        { items: ["🔵", "🔵", "🟡", "🔵"], options: ["🟢 Xanh lá", "🔴 Đỏ", "🟡 Vàng"], answer: 2, hint: "Ba hình tròn có màu xanh; hình nào có màu khác?" }
      ];
      const miniGameRounds = (gameId) => gameId === "pattern" ? patternRounds
        : gameId === "sequence" ? sequenceRounds
          : gameId === "observe" ? observationRounds
            : feelingsRounds;
      const dailyGameRewardKey = (gameId) => `${currentDay()}:${gameId}`;
      const miniGameRewardEarned = (gameId) => state.gameRewards.includes(dailyGameRewardKey(gameId));
      const awardMiniGame = (gameId) => {
        const key = dailyGameRewardKey(gameId);
        if (state.gameRewards.includes(key)) return false;
        state.gameRewards.push(key);
        state.xp += miniGames[gameId].reward;
        persist();
        return true;
      };
      const startMiniGame = (gameId) => {
        if (gameId === "memory") {
          const cards = ["🐻", "🌈", "🚀", "🍓", "🐢", "⭐", "🐻", "🌈", "🚀", "🍓", "🐢", "⭐"];
          for (let index = cards.length - 1; index > 0; index -= 1) {
            const swapIndex = Math.floor(Math.random() * (index + 1));
            [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
          }
          miniGameRun = { id: gameId, cards, revealed: [], matched: [], moves: 0, locked: false, completed: false };
        } else {
          miniGameRun = { id: gameId, round: 0, correct: 0, selected: null, feedback: "" };
        }
        renderGamesPage();
      };
      const miniGameHeader = (game) => `
        <div class="mini-game-top">
          <button class="route-back" data-mini-game-back>← Tất cả trò chơi</button>
          <span class="stat-pill">${miniGameRewardEarned(miniGameRun.id) ? "✓ Đã nhận sao hôm nay" : `⭐ Hoàn thành nhận ${game.reward} sao`}</span>
        </div>
        <div class="mini-game-title"><span class="catalog-icon" style="--tile:#fff1d9">${game.icon}</span><div><h2>${game.title}</h2><p>${game.description}</p></div></div>`;
      const renderMemoryGame = (game) => {
        const run = miniGameRun;
        const finished = run.completed;
        const rewardText = run.rewarded
          ? `Bé nhận ${game.reward} sao vì đã hoàn thành trò chơi!`
          : "Bé đã nhận phần thưởng hôm nay rồi. Chơi lại để luyện trí nhớ nhé!";
        const cards = run.cards.map((icon, index) => {
          const isVisible = run.revealed.includes(index) || run.matched.includes(index);
          const isMatched = run.matched.includes(index);
          return `<button class="memory-card ${isVisible ? "is-revealed" : ""} ${isMatched ? "is-matched" : ""}" data-memory-card="${index}" aria-label="${isVisible ? `Thẻ ${index + 1}: ${icon}` : `Thẻ ${index + 1}, lật thẻ`}" ${isVisible || run.locked || finished ? "disabled" : ""}>${isVisible ? icon : "?"}</button>`;
        }).join("");
        return `${miniGameHeader(game)}
          <section class="mini-game-board memory-board">
            <div class="mini-game-stats"><span>🧩 Đã ghép: ${run.matched.length / 2}/6 cặp</span><span>👆 Lượt lật: ${run.moves}</span></div>
            ${finished
              ? `<div class="mini-game-result" role="status"><span>🎉</span><h3>Siêu trí nhớ!</h3><p>${rewardText}</p><button class="btn btn-mint btn-small" data-mini-game-replay="memory">Chơi lại nhé ↻</button></div>`
              : `<div class="memory-grid" aria-label="Bảng 12 thẻ úp">${cards}</div><p class="mini-game-help" role="status">Lật hai thẻ mỗi lượt để tìm hình giống nhau nhé.</p>`}
          </section>`;
      };
      const renderQuestionGame = (game, rounds, prompt) => {
        const run = miniGameRun;
        const finished = run.round >= rounds.length;
        if (finished) {
          const rewardText = run.rewarded
            ? `Bé nhận ${game.reward} sao vì đã hoàn thành trò chơi!`
            : "Bé đã nhận phần thưởng hôm nay rồi. Có thể chơi lại để luyện thêm!";
          return `${miniGameHeader(game)}<section class="mini-game-board mini-game-result" role="status">
            <span>🏆</span><h2>Hoàn thành ${run.correct}/${rounds.length} thử thách!</h2><p>${rewardText}</p>
            <button class="btn btn-mint btn-small" data-mini-game-replay="${run.id}">Chơi lại nhé ↻</button>
          </section>`;
        }
        const round = rounds[run.round];
        const choices = round.options.map((option, index) => `<button class="mini-game-option ${run.selected === index ? "is-correct" : ""}" data-mini-game-answer="${index}" ${run.selected !== null ? "disabled" : ""}><span>${String.fromCharCode(65 + index)}</span>${option}</button>`).join("");
        const promptContent = prompt(round);
        return `${miniGameHeader(game)}<section class="mini-game-board">
          <div class="mini-game-stats"><span>🧠 Câu ${run.round + 1}/${rounds.length}</span><span>✅ Đúng: ${run.correct}</span></div>
          ${promptContent}
          <div class="mini-game-options">${choices}</div>
          ${run.feedback ? `<p class="mini-game-feedback ${run.selected === null ? "try-again" : ""}" role="status">${run.feedback}</p>` : ""}
          ${run.selected !== null ? `<button class="btn btn-mint btn-small mini-game-next" data-mini-game-next>${run.round === rounds.length - 1 ? "Xem kết quả →" : "Câu tiếp theo →"}</button>` : ""}
        </section>`;
      };
      const renderGamesPage = () => {
        let body;
        if (miniGameRun) {
          const game = miniGames[miniGameRun.id];
          if (miniGameRun.id === "memory") body = renderMemoryGame(game);
          else if (miniGameRun.id === "pattern") {
            body = renderQuestionGame(game, patternRounds, (round) => `<div class="pattern-question"><p>Hình nào sẽ đến tiếp theo?</p><div class="pattern-sequence">${round.sequence.map((icon) => `<span>${icon}</span>`).join("")}</div></div>`);
          } else if (miniGameRun.id === "sequence") {
            body = renderQuestionGame(game, sequenceRounds, (round) => `<div class="feelings-question sequence-question"><p>Tình huống:</p><blockquote>“${round.situation}”</blockquote><p>Thứ tự nào an toàn và hợp lý nhất?</p></div>`);
          } else if (miniGameRun.id === "observe") {
            body = renderQuestionGame(game, observationRounds, (round) => `<div class="pattern-question"><p>Hình nào khác với những hình còn lại?</p><div class="pattern-sequence observation-sequence">${round.items.map((icon) => `<span>${icon}</span>`).join("")}</div></div>`);
          } else {
            body = renderQuestionGame(game, feelingsRounds, (round) => `<div class="feelings-question"><p>Hãy đọc tình huống:</p><blockquote>“${round.situation}”</blockquote><p>Bạn nhỏ có thể cảm thấy thế nào?</p></div>`);
          }
        } else {
          const cards = Object.entries(miniGames).map(([id, game]) => {
            const played = miniGameRewardEarned(id);
            const gameTag = id === "memory" ? "TRÍ NHỚ" : id === "pattern" ? "TƯ DUY LOGIC" : id === "sequence" ? "GIẢI QUYẾT VẤN ĐỀ" : id === "observe" ? "QUAN SÁT" : "GỌI TÊN CẢM XÚC";
            return `<article class="game-card mini-game-card" style="--game-tint:${game.accent}"><span class="catalog-icon" style="--tile:${game.accent}">${game.icon}</span><div class="mini-game-card-copy"><span class="game-tag">${gameTag}</span><h3>${game.title}</h3><p>${game.description}</p><small>${played ? "✓ Đã nhận sao hôm nay" : `🎁 Hoàn thành nhận ${game.reward} sao`}</small></div><button class="btn btn-mint btn-small" data-mini-game-start="${id}">Chơi ngay →</button></article>`;
          }).join("");
          body = `<div class="game-welcome"><span>🌟</span><div><h2>Chơi vui, luyện trí mỗi ngày!</h2><p>Cùng bé luyện trí nhớ, quan sát, suy luận, giải quyết vấn đề và gọi tên cảm xúc. Mỗi trò chỉ mất vài phút, có thể chơi lại thoải mái.</p></div></div><div class="game-grid">${cards}</div>`;
        }
        $("#routeView").innerHTML = pageShell("games", "Chọn một trò chơi ngắn để luyện tư duy và thư giãn sau giờ học. Không có thi đấu trực tuyến hay thu thập thông tin trẻ.", body, "CHƠI & KHÁM PHÁ");
      };

      const renderQuestPage = () => {
        renderQuests();
        const rows = questSpecs.map((quest) => {
          const value = dailyProgress(quest.id);
          const claimed = state.questClaims.includes(`${currentDay()}:${quest.id}`);
          return `<article class="score-card"><span class="catalog-icon" style="--tile:#fff2d7">${quest.icon}</span><h3 style="margin:10px 0 4px;font-size:14px">${quest.label}</h3>
            <p class="note">Tiến độ: ${value}/${quest.target} · Thưởng ${quest.reward} ⭐</p><div class="progress"><i style="width:${Math.round(value / quest.target * 100)}%"></i></div>
            <button class="btn btn-small ${claimed ? "btn-light" : "btn-mint"}" style="margin-top:12px" data-claim-quest="${quest.id}" ${state.authenticated && (claimed || value < quest.target) ? "disabled" : ""}>${claimed ? "Đã nhận" : "Nhận thưởng"}</button></article>`;
        }).join("");
        $("#routeView").innerHTML = pageShell("quests", "Nhiệm vụ và tiến độ được lưu trên thiết bị hiện tại.", `<div class="page-actions"><span class="stat-pill">🎮 ${state.dailyLessons}/3 bài</span><span class="stat-pill">⏱ ${Math.floor(state.sessionSeconds / 60)}/10 phút</span><span class="stat-pill">📝 ${state.dailyQuiz}/1 bài kiểm tra</span></div><div class="lesson-catalog">${rows}</div>`, "MỖI NGÀY MỘT CHÚT");
      };

      const quizFormats = [
        { id: "choice", icon: "🧭", title: "Chọn cách phù hợp", description: "Đọc tình huống, chọn cách xử lý an toàn. Có thể thử lại." },
        { id: "matching", icon: "🔗", title: "Nối chủ đề với điều đã học", description: "Ghép các chủ đề kỹ năng với mục tiêu phù hợp." },
        { id: "ordering", icon: "🔢", title: "Sắp xếp các bước", description: "Sắp xếp hành động theo thứ tự hợp lý." }
      ];
      const shuffleItems = (items) => items.slice().sort(() => Math.random() - 0.5);
      const orderedSteps = {
        emotion: ["Nhận ra mình đang có cảm xúc gì", "Nói cảm xúc bằng lời", "Nhờ người lớn đáng tin cậy hỗ trợ"],
        social: ["Chào và lắng nghe bạn", "Hỏi bạn có muốn cùng chơi không", "Tôn trọng câu trả lời của bạn"],
        safety: ["Dừng lại ở nơi an toàn", "Tìm nhân viên hoặc người lớn có trách nhiệm", "Nhờ họ liên hệ với gia đình"],
        health: ["Làm ướt tay bằng nước sạch", "Dùng xà phòng và chà kỹ hai bàn tay", "Rửa sạch rồi lau khô tay"],
        thinking: ["Bình tĩnh quan sát chuyện đã xảy ra", "Nói thật với người lớn đáng tin cậy", "Cùng người lớn khắc phục sự việc"],
        care: ["Nhìn quanh tìm thùng rác phù hợp", "Bỏ rác vào đúng thùng", "Giữ khu vực chung sạch sẽ"],
        creative: ["Nói điều mình muốn thử", "Nhờ người lớn đồng hành", "Thử từng bước ở nơi an toàn"],
        community: ["Dừng lại khi có điều khiến mình không thoải mái", "Không chia sẻ thông tin riêng tư", "Báo người lớn đáng tin cậy"]
      };
      const finishQuiz = () => {
        if (!quizRun || quizRun.completed) return;
        quizRun.completed = true;
        state.quiz += 1;
        state.dailyQuiz += 1;
        state.xp += 10;
        state.rp += 25;
        persist();
        renderStats();
      };
      const startQuiz = (mode) => {
        const availableLessons = ageAppropriateLessons();
        const availableCategories = ageAppropriateCategories();
        if (mode === "choice") {
          quizRun = { mode, questions: shuffleItems(availableLessons).slice(0, 3), round: 0, selected: null, wrong: null, correct: 0 };
        } else if (mode === "matching") {
          const pairs = shuffleItems(availableCategories).slice(0, 3).map((category) => ({
            id: category.id,
            name: category.name,
            goal: lessonById(category.lesson).goal
          }));
          quizRun = { mode, pairs, goals: shuffleItems(pairs), matched: [], selected: null, message: "" };
        } else if (mode === "ordering") {
          const category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
          const steps = orderedSteps[category.id];
          quizRun = { mode, category, steps, items: shuffleItems(steps), message: "" };
        }
        renderQuizPage();
      };
      const renderQuizPage = () => {
        const intro = `<div class="quiz-format-grid">${quizFormats.map((format) => `
          <article class="quiz-format-card"><span class="quiz-format-icon">${format.icon}</span><h2>${format.title}</h2><p>${format.description}</p>
            <button type="button" class="btn btn-mint btn-small" data-quiz-start="${format.id}">Bắt đầu dạng này →</button>
          </article>`).join("")}</div><p class="quiz-note">Bài ôn tập không có video hay hoạt cảnh. Mỗi dạng có cách làm riêng và cho phép bé suy nghĩ lại.</p>`;
        if (!quizRun) {
          $("#routeView").innerHTML = pageShell("quiz", "Chọn một cách ôn tập phù hợp với bé.", intro, "ÔN TẬP CÙNG HERO");
          return;
        }
        if (quizRun.completed) {
          $("#routeView").innerHTML = pageShell("quiz", "Bé đã hoàn thành một lượt ôn tập.", `
            <section class="quiz-result"><span>🏆</span><h2>Con làm tốt lắm!</h2><p>Con nhận thêm 10 sao và 25 điểm RP. Hãy chọn một dạng khác để tiếp tục luyện tập.</p>
              <button type="button" class="btn btn-mint" data-quiz-reset>Chọn dạng ôn tập khác</button></section>
          `, "HOÀN THÀNH");
          return;
        }
        if (quizRun.mode === "choice") {
          const lesson = quizRun.questions[quizRun.round];
          const answers = lesson.answers.map((answer, index) => `<button type="button" class="lesson-choice quiz-answer ${quizRun.selected === index ? "correct" : ""} ${quizRun.wrong === index ? "incorrect" : ""}" data-quiz-answer="${index}" ${quizRun.selected !== null ? "disabled" : ""}>${escapeHtml(answer)}</button>`).join("");
          $("#routeView").innerHTML = pageShell("quiz", "Đọc tình huống rồi chọn cách xử lý phù hợp. Bé có thể thử lại nếu chưa đúng.", `
            <section class="quiz-task score-card">
              <div class="lesson-progress"><span>🧠 Câu ${quizRun.round + 1}/${quizRun.questions.length}</span><span>⭐ ${state.xp} · Lv ${Math.floor(state.xp / 100) + 1}</span></div>
              <span class="kicker">${escapeHtml(lesson.title)}</span><p class="quiz-story">${escapeHtml(lesson.story)}</p>
              <h2 class="quiz-question">Con sẽ chọn cách nào?</h2><div class="quiz-answer-list">${answers}</div>
              <p class="quiz-feedback" role="status">${quizRun.selected !== null
                ? `Chính xác! ${lesson.prompts[2] || lesson.goal}`
                : quizRun.wrong !== null
                  ? `Chưa phù hợp. ${lesson.prompts[1] || "Con hãy thử suy nghĩ lại nhé."}`
                  : "Chọn cách con nghĩ là phù hợp nhé."}</p>
              <div class="page-actions"><button type="button" class="btn btn-light btn-small" id="quizPageSpeak">♫ Nghe tình huống</button>
                <button type="button" class="btn btn-mint btn-small" id="nextQuiz" ${quizRun.selected === null ? "disabled" : ""}>${quizRun.round + 1 === quizRun.questions.length ? "Hoàn thành →" : "Câu tiếp theo →"}</button></div>
            </section>`, "CHỌN CÁCH PHÙ HỢP");
          $("#quizPageSpeak").addEventListener("click", () => speak(`${lesson.title}. ${lesson.story} ${lesson.answers.join(". ")}`));
          return;
        }
        if (quizRun.mode === "matching") {
          const matched = new Set(quizRun.matched);
          const left = quizRun.pairs.map((pair) => `<button type="button" class="matching-item ${quizRun.selected === pair.id ? "is-selected" : ""}" data-match-category="${pair.id}" ${matched.has(pair.id) ? "disabled" : ""}>${escapeHtml(pair.name)}</button>`).join("");
          const right = quizRun.goals.map((pair) => `<button type="button" class="matching-item" data-match-goal="${pair.id}" ${matched.has(pair.id) ? "disabled" : ""}>${escapeHtml(pair.goal)}</button>`).join("");
          $("#routeView").innerHTML = pageShell("quiz", "Chọn một chủ đề bên trái, rồi nối với mục tiêu học tập phù hợp bên phải.", `
            <section class="quiz-task score-card"><div class="lesson-progress"><span>🔗 Đã nối ${quizRun.matched.length}/${quizRun.pairs.length} cặp</span><span>Chủ đề ↔ Điều đã học</span></div>
              <div class="matching-grid"><div><h2>Chủ đề</h2>${left}</div><div><h2>Điều con học được</h2>${right}</div></div>
              <p class="quiz-feedback" role="status">${escapeHtml(quizRun.message || "Chọn hai thẻ có nội dung liên quan nhé.")}</p>
            </section>`, "NỐI CẶP");
          return;
        }
        if (quizRun.mode === "ordering") {
          const items = quizRun.items.map((step, index) => `<li><span>${escapeHtml(step)}</span><span class="order-controls">
            <button type="button" data-order-move="up" data-order-index="${index}" aria-label="Di chuyển lên" ${index === 0 ? "disabled" : ""}>↑</button>
            <button type="button" data-order-move="down" data-order-index="${index}" aria-label="Di chuyển xuống" ${index === quizRun.items.length - 1 ? "disabled" : ""}>↓</button>
          </span></li>`).join("");
          $("#routeView").innerHTML = pageShell("quiz", `Sắp xếp các bước cho chủ đề ${escapeHtml(quizRun.category.name)} theo thứ tự hợp lý.`, `
            <section class="quiz-task score-card"><div class="lesson-progress"><span>🔢 Sắp xếp các bước</span><span>${escapeHtml(quizRun.category.name)}</span></div>
              <ol class="order-list">${items}</ol>
              <p class="quiz-feedback" role="status">${escapeHtml(quizRun.message || "Dùng mũi tên để đổi vị trí các bước.")}</p>
              <button type="button" class="btn btn-mint btn-small" id="checkQuizOrder">Kiểm tra thứ tự</button>
            </section>`, "SẮP XẾP THỨ TỰ");
        }
      };

      const renderAchievementsPage = () => {
        const badges = [
          { icon: "🌱", name: "Bước đầu tiên", detail: "Hoàn thành bài học đầu tiên", progress: completedCount(), goal: 1 },
          { icon: "🔥", name: "Ngày chăm chỉ", detail: "Học xong bài trong một ngày", progress: streak(), goal: 1 },
          { icon: "🧠", name: "Người suy nghĩ", detail: "Hoàn thành một bài kiểm tra", progress: state.quiz, goal: 1 },
          { icon: "🤝", name: "Người bạn tốt", detail: "Xác nhận một thử thách ngoài đời", progress: state.challenges.length, goal: 1 },
          { icon: "🏝️", name: "Nhà khám phá", detail: "Hoàn thành ba chủ đề", progress: completedCount(), goal: 3 },
          { icon: "⭐", name: "Ngôi sao nhỏ", detail: "Tích lũy 50 sao", progress: state.xp, goal: 50 }
        ].map(({ icon, name, detail, progress, goal }) => {
          const unlocked = progress >= goal;
          const percent = Math.min(100, Math.round(progress / goal * 100));
          return `<article class="achievement-card ${unlocked ? "is-unlocked" : "is-locked"}">
            <div class="achievement-card-top"><span class="badge-icon" aria-hidden="true">${icon}</span><span class="achievement-status">${unlocked ? "✓ Đã mở khóa" : "Đang cố gắng"}</span></div>
            <h3>${name}</h3><p class="note">${detail}</p>
            <div class="achievement-progress" role="progressbar" aria-label="Tiến độ ${name}" aria-valuemin="0" aria-valuemax="${goal}" aria-valuenow="${Math.min(progress, goal)}">
              <span style="width:${percent}%"></span>
            </div>
            <small class="achievement-count">${Math.min(progress, goal)} / ${goal} ${goal === 1 ? "lần" : "mốc"}</small>
          </article>`;
        }).join("");
        $("#routeView").innerHTML = pageShell("achievements", `Bé đã khám phá ${completedCount()} bài, tích lũy ${state.xp} sao và có chuỗi ${streak()} ngày.`, `<div class="achievement-grid">${badges}</div>`, "GHI NHẬN NỖ LỰC");
      };

      const renderForumPage = () => {
        const posts = [...(state.forumPosts || [])].reverse().map((post, index) => {
          const id = post.id || `legacy-${index}`;
          const previewUrl = forumMediaUrls.get(id);
          const media = previewUrl
            ? (post.mediaKind === "video"
              ? `<video src="${previewUrl}" controls preload="metadata" aria-label="Video trong bài đăng"></video>`
              : `<img src="${previewUrl}" alt="Ảnh trong bài đăng" loading="lazy">`)
            : post.mediaName ? `<p class="note">Tệp “${escapeHtml(post.mediaName)}” chỉ có trong phiên trình duyệt đã đăng; chọn tệp lại để xem trước.</p>` : "";
          const comments = (post.comments || []).map((comment) =>
            `<div class="social-comment"><strong>${escapeHtml(comment.author || "Gia đình Little Hero")}:</strong> ${escapeHtml(comment.body)}</div>`
          ).join("");
          const reactions = post.reactionCounts || {};
          const totalReactions = Object.values(reactions).reduce((sum, value) => sum + Number(value || 0), 0);
          return `<article class="social-post" data-post-id="${escapeHtml(id)}">
            <div class="social-post-head"><span class="social-avatar" aria-hidden="true">🦸</span><div><strong>${escapeHtml(post.author || "Gia đình Little Hero")}${post.repostOf ? " · đã đăng lại" : ""}</strong><small>${post.isSample ? "Bài mẫu · Cộng đồng Little Hero" : `${escapeHtml(post.date || currentDay())} · Lưu trên thiết bị`}</small></div></div>
            ${post.repostOf ? `<p class="note">Đăng lại từ ${escapeHtml(post.repostOf)}</p>` : ""}
            <p class="social-post-body">${escapeHtml(post.body || "")}</p><div class="social-media-preview">${media}</div>
            <div class="social-post-meta"><span>💚 ${totalReactions} cảm xúc</span><span>💬 ${(post.comments || []).length} bình luận · ↗ ${post.shares || 0} lượt chia sẻ</span></div>
            <div class="social-actions">
              <button type="button" data-like-post="${escapeHtml(id)}" aria-pressed="${Boolean(post.liked)}">${post.liked ? "💚 Đã thích" : "♡ Thích"}</button>
              <button type="button" data-focus-comment="${escapeHtml(id)}">💬 Bình luận</button>
              <button type="button" data-share-post="${escapeHtml(id)}">↗ Chia sẻ</button>
              <button type="button" data-repost="${escapeHtml(id)}">⟳ Đăng lại</button>
            </div>
            <div class="social-reactions" aria-label="Thả cảm xúc">
              ${[["❤️","Yêu thích"],["👍","Thích"],["👏","Vỗ tay"],["🤗","Đồng cảm"]].map(([icon,label]) => `<button type="button" data-react="${escapeHtml(id)}" data-reaction="${icon}" aria-label="${label}" aria-pressed="${post.myReaction === icon}">${icon} ${Number(reactions[icon] || 0) || ""}</button>`).join("")}
            </div>
            <div class="social-comments">${comments}</div>
            <form class="social-comment-form" data-comment-post="${escapeHtml(id)}"><input name="comment" required maxlength="240" aria-label="Viết bình luận" placeholder="Viết bình luận tử tế…"><button class="btn btn-light btn-small">Gửi</button></form>
          </article>`;
        }).join("");
        $("#routeView").innerHTML = pageShell("forum", "Bảng tin chia sẻ trạng thái, ảnh, video, cảm xúc, bình luận và đăng lại. Bài mẫu được đánh dấu; bài đăng mới chỉ lưu trên thiết bị này.", `
          <div class="social-layout">
            <div class="social-column">
              <form class="social-composer" id="forumForm">
                <h3 style="font-size:14px">Bạn muốn chia sẻ điều gì?</h3>
                <label class="form-label" for="forumStatus">Trạng thái</label>
                <textarea id="forumStatus" name="body" maxlength="800" placeholder="Chia sẻ một khoảnh khắc học tập vui vẻ…" required></textarea>
                <div id="forumMediaPreview" class="social-media-preview" aria-live="polite"></div>
                <div class="social-composer-tools"><label class="btn btn-light btn-small">🖼️ Ảnh / video<input class="social-file" type="file" id="forumMedia" accept="image/*,video/*" hidden></label><button class="btn btn-mint btn-small">Đăng lên bảng tin</button></div>
                <p class="note" style="margin:9px 0 0">Ảnh/video chỉ xem được trong phiên trình duyệt này, không tải lên máy chủ. Không chia sẻ thông tin riêng tư của trẻ.</p>
              </form>
              <div class="social-feed" id="socialFeed">${posts || '<article class="social-post"><strong>Chào mừng đến bảng tin Little Hero</strong><p class="note">Chưa có bài chia sẻ. Hãy đăng trạng thái đầu tiên.</p></article>'}</div>
            </div>
            <aside class="social-sidebar">
              <article class="settings-card"><h3 style="font-size:13px">Cộng đồng an toàn</h3><p class="note">Bài viết chỉ lưu trên thiết bị này. Chỉ chia sẻ nội dung phù hợp và tránh đăng thông tin nhận dạng trẻ.</p></article>
              <article class="settings-card"><h3 style="font-size:13px">Tương tác</h3><p class="note">Thích, cảm xúc, bình luận và đăng lại chỉ hiển thị trên thiết bị này.</p></article>
            </aside>
          </div>`, "BẢNG TIN GIA ĐÌNH");
        let selectedFile = null;
        let selectedUrl = null;
        $("#forumMedia").addEventListener("change", (event) => {
          selectedFile = event.currentTarget.files[0] || null;
          if (selectedUrl) URL.revokeObjectURL(selectedUrl);
          selectedUrl = null;
          if (!selectedFile) { $("#forumMediaPreview").innerHTML = ""; return; }
          if (!selectedFile.type.startsWith("image/") && !selectedFile.type.startsWith("video/")) {
            selectedFile = null;
            event.currentTarget.value = "";
            toast("Hãy chọn tệp ảnh hoặc video.");
            return;
          }
          if (selectedFile.size > 20 * 1024 * 1024) {
            selectedFile = null;
            event.currentTarget.value = "";
            toast("Tệp tối đa 20 MB.");
            return;
          }
          selectedUrl = URL.createObjectURL(selectedFile);
          $("#forumMediaPreview").innerHTML = selectedFile.type.startsWith("video/")
            ? `<video src="${selectedUrl}" controls preload="metadata" aria-label="Xem trước video"></video>`
            : `<img src="${selectedUrl}" alt="Xem trước ảnh" loading="lazy">`;
        });
        $("#forumForm").addEventListener("submit", (event) => {
          event.preventDefault();
          const body = String(new FormData(event.currentTarget).get("body") || "").trim();
          if (!body) { toast("Hãy viết trạng thái trước khi đăng."); return; }
          if (/(\b\d[\s.-]*){8,}|\S+@\S+|https?:\/\/|www\./i.test(body)) { toast("Hãy xóa thông tin liên hệ để bảo vệ gia đình nhé."); return; }
          const id = `post-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
          const media = selectedFile ? { mediaName: selectedFile.name, mediaKind: selectedFile.type.startsWith("video/") ? "video" : "image" } : {};
          state.forumPosts = [...(state.forumPosts || []), { id, body, author: state.childName || "Gia đình Little Hero", date: currentDay(), liked: false, myReaction: "", reactionCounts: {}, comments: [], shares: 0, ...media }];
          if (selectedUrl) forumMediaUrls.set(id, selectedUrl);
          selectedFile = null;
          selectedUrl = null;
          persist(); renderForumPage(); toast("Đã đăng lên bảng tin trên thiết bị này.");
        });
        $("#socialFeed").addEventListener("click", async (event) => {
          const button = event.target.closest("button");
          if (!button) return;
          const post = state.forumPosts.find((item) => item.id === button.dataset.likePost || item.id === button.dataset.react || item.id === button.dataset.sharePost || item.id === button.dataset.repost);
          if (button.dataset.likePost && post) {
            post.liked = !post.liked;
            persist(); renderForumPage();
          } else if (button.dataset.react && post) {
            post.reactionCounts = post.reactionCounts || {};
            if (post.myReaction) post.reactionCounts[post.myReaction] = Math.max(0, Number(post.reactionCounts[post.myReaction] || 0) - 1);
            post.myReaction = post.myReaction === button.dataset.reaction ? "" : button.dataset.reaction;
            if (post.myReaction) post.reactionCounts[post.myReaction] = Number(post.reactionCounts[post.myReaction] || 0) + 1;
            persist(); renderForumPage();
          } else if (button.dataset.focusComment) {
            $(`[data-comment-post="${CSS.escape(button.dataset.focusComment)}"] input`).focus();
          } else if (button.dataset.repost && post) {
            const id = `post-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
            state.forumPosts = [...(state.forumPosts || []), { id, body: post.body, author: state.childName || "Gia đình Little Hero", date: currentDay(), repostOf: post.author || "Gia đình Little Hero", liked: false, myReaction: "", reactionCounts: {}, comments: [], shares: 0, ...(post.mediaName ? { mediaName: post.mediaName, mediaKind: post.mediaKind } : {}) }];
            const url = forumMediaUrls.get(post.id);
            if (url) forumMediaUrls.set(id, url);
            persist(); renderForumPage(); toast("Đã đăng lại trên bảng tin cục bộ.");
          } else if (button.dataset.sharePost && post) {
            const shareData = { title: "Little Hero", text: post.body, url: `${location.href.split("#")[0]}#/forum` };
            try {
              if (navigator.share) await navigator.share(shareData);
              else if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
              else { toast("Trình duyệt không hỗ trợ chia sẻ hoặc sao chép liên kết."); return; }
              post.shares = Number(post.shares || 0) + 1;
              persist(); renderForumPage(); toast("Đã chia sẻ bài viết.");
            } catch (error) {
              if (error.name !== "AbortError") { console.error("Không thể chia sẻ bài viết.", error); toast("Không thể chia sẻ bài viết trong trình duyệt này."); }
            }
          }
        });
        $("#socialFeed").querySelectorAll("[data-comment-post]").forEach((form) => form.addEventListener("submit", (event) => {
          event.preventDefault();
          const post = state.forumPosts.find((item) => item.id === form.dataset.commentPost);
          const body = String(new FormData(form).get("comment") || "").trim();
          if (!post || !body) return;
          if (/(\b\d[\s.-]*){8,}|\S+@\S+|https?:\/\/|www\./i.test(body)) { toast("Hãy bỏ thông tin liên hệ khỏi bình luận nhé."); return; }
          post.comments = [...(post.comments || []), { author: state.childName || "Gia đình Little Hero", body }];
          persist(); renderForumPage();
        }));
      };

      const renderFaqPage = () => {
        const questions = [
          ["Little Hero phù hợp với độ tuổi nào?", "Nội dung hướng đến trẻ 3–10 tuổi. Phụ huynh nên đồng hành và điều chỉnh hoạt động theo khả năng của mỗi bé."],
          ["Làm sao để lưu tiến độ?", "Tiến độ học được lưu trong trình duyệt trên thiết bị hiện tại; tài khoản đăng nhập lưu ở máy chủ nhưng tiến độ chưa đồng bộ giữa các thiết bị."],
            ["Làm sao để khôi phục mật khẩu?", "Tại trang đăng nhập, chọn “Quên mật khẩu?” rồi nhận mã xác minh qua email hoặc số điện thoại đã đăng ký. Máy chủ cần được cấu hình dịch vụ gửi email hoặc SMS."],
          ["Các tình huống có thay thế tư vấn chuyên gia không?", "Không. Nội dung là gợi ý giáo dục tổng quát, không thay thế tư vấn của chuyên gia giáo dục, tâm lý hoặc y tế."],
          ["Đăng nhập Google đã hoạt động chưa?", "Chưa. Cần tạo Google OAuth Client ID và dịch vụ máy chủ xác thực token trước khi đưa đăng nhập thật vào sử dụng."],
          ["Thanh toán Premium có thể chuyển khoản chưa?", "Thông tin thanh toán chưa được cấu hình và hệ thống chưa xác nhận giao dịch. Không chuyển khoản qua trang này."],
          ["Ứng dụng lưu những thông tin nào?", "Họ tên phụ huynh, email và số điện thoại được lưu trong cơ sở dữ liệu máy chủ để đăng nhập và khôi phục tài khoản. Hồ sơ, tiến độ và nhật ký học của bé vẫn lưu cục bộ trên trình duyệt; không nhập thông tin nhạy cảm của trẻ."]
        ];
        $("#routeView").innerHTML = pageShell("faq", "Một số câu hỏi thường gặp về cách sử dụng Little Hero.", `<div class="faq-grid">${questions.map(([question, answer]) => `<details class="faq-card"><summary>${question}</summary><p>${answer}</p></details>`).join("")}</div>`, "HỖ TRỢ GIA ĐÌNH");
      };

      const renderReviewsPage = () => {
        const saved = state.reviews || [];
        const average = saved.length ? saved.reduce((sum, review) => sum + Number(review.stars || 0), 0) / saved.length : 0;
        const displayedReviews = [...saved.slice().reverse(), ...(!saved.length ? sampleReviews : [])];
        const ratingBreakdown = [5,4,3,2,1].map((stars) => {
          const count = saved.filter((review) => Number(review.stars) === stars).length;
          const width = saved.length ? Math.round(count / saved.length * 100) : 0;
          return `<div class="rating-bar"><span>${stars} ★</span><span class="rating-bar-track"><i style="width:${width}%"></i></span><span>${count}</span></div>`;
        }).join("");
        const reviews = displayedReviews.map((review, index) => {
          const reviewId = review.id || `review-${index}`;
          return `<article class="store-review ${review.isSample ? "is-sample" : ""}">
            <span class="review-stars" aria-label="${Number(review.stars)} trên 5 sao">${"★".repeat(Number(review.stars) || 0)}${"☆".repeat(5 - (Number(review.stars) || 0))}</span>
            <h3>${escapeHtml(review.title || "Đánh giá Little Hero")}</h3>
            <p>${escapeHtml(review.body)}</p>
            <small>${escapeHtml(review.author)}</small>
            ${review.isSample ? '<small class="sample-review-note">Nội dung minh họa, không phải đánh giá đã xác minh.</small>' : ""}
            ${review.isSample ? "" : `<div class="page-actions"><button class="btn btn-light btn-small" type="button" data-review-helpful="${escapeHtml(reviewId)}">👍 Hữu ích (${Number(review.helpful) || 0})</button></div>`}
          </article>`;
        }).join("");
        $("#routeView").innerHTML = pageShell("reviews", "Chia sẻ trải nghiệm thực tế của gia đình với Little Hero.", `
          <div class="social-column">
            <section class="store-rating" aria-label="Tổng quan đánh giá">
              <div class="store-rating-score"><strong>${saved.length ? average.toFixed(1) : "—"}</strong><span>${saved.length ? `${saved.length} phản hồi từ gia đình` : "Chưa có phản hồi"}</span><div class="review-stars">${saved.length ? "★".repeat(Math.round(average)) + "☆".repeat(5 - Math.round(average)) : "☆☆☆☆☆"}</div></div>
              <div>${ratingBreakdown}${saved.length ? "" : '<p class="note" style="margin:8px 0 0">Chưa có đánh giá xác thực; các nội dung bên dưới được ghi nhãn là minh họa.</p>'}</div>
            </section>
            <div class="social-layout">
              <div class="social-column">
                <h2 style="margin:0;font-size:17px">Đánh giá của người dùng</h2>
                <div class="social-feed">${reviews || '<article class="store-review"><p>Chưa có đánh giá nào.</p></article>'}</div>
              </div>
              <form class="review-form" id="reviewForm"><h3 style="font-size:14px">Viết đánh giá</h3>
                <label class="form-label">Tên hiển thị *<input name="author" required maxlength="50" value="${escapeHtml(state.childName || "")}" placeholder="Tên người đánh giá"></label>
                <label class="form-label">Số sao</label><div class="stars-input" id="starsInput">${[1,2,3,4,5].map((star) => `<button type="button" data-star="${star}" aria-label="${star} sao">${star <= selectedStars ? "★" : "☆"}</button>`).join("")}</div>
                <label class="form-label">Tiêu đề<input name="title" maxlength="70" placeholder="Tóm tắt trải nghiệm"></label>
                <label class="form-label">Nhận xét<textarea name="review" required maxlength="400" placeholder="Chia sẻ trải nghiệm thực tế của bạn…"></textarea></label>
                <button class="btn btn-mint btn-small">Gửi đánh giá</button>
                <p class="note" style="margin-top:10px">Lưu cục bộ trên thiết bị. Tên và trải nghiệm chưa được xác minh; không đồng bộ hoặc đăng lên Google Play/App Store.</p>
              </form>
            </div>
          </div>`, "ĐÁNH GIÁ ỨNG DỤNG");
        $("#starsInput").addEventListener("click", (event) => {
          const star = event.target.closest("[data-star]");
          if (!star) return;
          selectedStars = Number(star.dataset.star);
          $("#starsInput").querySelectorAll("[data-star]").forEach((button) => { button.textContent = Number(button.dataset.star) <= selectedStars ? "★" : "☆"; });
        });
        $("#reviewForm").addEventListener("submit", (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const body = String(formData.get("review") || "").trim();
          const title = String(formData.get("title") || "").trim();
          const author = String(formData.get("author") || "").trim().slice(0, 50);
          if (!author) { toast("Hãy nhập tên hiển thị để phản hồi được ghi nhận đúng người."); return; }
          if (!body) { toast("Hãy nhập nhận xét trước khi gửi."); return; }
          if (/(\b\d[\s.-]*){8,}|\S+@\S+|https?:\/\/|www\./i.test(`${title} ${body} ${author}`)) { toast("Hãy bỏ thông tin liên hệ riêng tư trước khi gửi nhé."); return; }
          state.reviews = [...(state.reviews || []), { id: `review-${Date.now()}`, stars: selectedStars, title, body, author, date: currentDay(), helpful: 0 }];
          persist(); renderReviewsPage(); toast("Đã lưu đánh giá trên thiết bị; đánh giá chưa được xác minh.");
        });
        $("#routeView").querySelectorAll("[data-review-helpful]").forEach((button) => button.addEventListener("click", () => {
          const review = (state.reviews || []).find((entry, index) => (entry.id || `review-${(state.reviews || []).length - index - 1}`) === button.dataset.reviewHelpful);
          if (!review) return;
          review.helpful = Number(review.helpful || 0) + 1;
          persist(); renderReviewsPage();
        }));
      };

      const renderLanguagePage = () => {
        $("#routeView").innerHTML = pageShell("language", "Chọn ngôn ngữ giao diện. Nội dung bài học hiện có bằng tiếng Việt.", `
          <div class="score-card"><h3 style="font-size:15px">Ngôn ngữ giao diện</h3><div class="language-options">
            <button class="pick-card" data-language="vi" aria-pressed="${state.language === "vi"}"><span class="pick-icon">🇻🇳</span><strong>Tiếng Việt</strong><span class="note">Nội dung bài học</span></button>
            <button class="pick-card" data-language="en" aria-pressed="${state.language === "en"}"><span class="pick-icon">🇬🇧</span><strong>English</strong><span class="note">AI replies and voice input/output</span></button>
          </div><p class="note" style="margin-top:12px">Hero sẽ trả lời và nhận diện giọng nói theo ngôn ngữ đã chọn. Một số nội dung bài học hiện chỉ có tiếng Việt.</p></div>`, "TÙY CHỌN NGÔN NGỮ");
        $("#routeView").querySelectorAll("[data-language]").forEach((button) => button.addEventListener("click", () => {
          state.language = button.dataset.language === "en" ? "en" : "vi";
          document.documentElement.lang = state.language;
          translateElement(document.body);
          persist(); setRoute(route, { restore: true, pop: true });
        }));
      };

      const renderArenaPage = () => {
        const ageGroup = currentAgeGroup();
        const provinces = window.LittleHeroLocations.provinces;
        const modes = [["duel", "Cùng nhóm tuổi"], ["region", "Miền"], ["city", "Tỉnh/thành"], ["nation", "Toàn quốc"]];
        const provinceOptions = provinces.map(({ name }) =>
          `<option value="${escapeHtml(name)}" ${state.leaderboardProvince === name ? "selected" : ""}>${escapeHtml(name)}</option>`
        ).join("");
        $("#routeView").innerHTML = pageShell("arena", `Đấu trường nhóm ${ageGroup.replace("-", "–")} tuổi · nội dung và câu hỏi được chọn theo độ tuổi của bé.`, `
          <div class="arena-grid">
            <article class="arena-card">
              <span class="kicker">HERO ARENA · NHÓM ${ageGroup.replace("-", "–")} TUỔI</span><h3>Thi đấu qua tình huống kỹ năng</h3>
              <p>Mỗi lượt là một tình huống kỹ năng cùng Hero. Điểm RP được xếp hạng theo nhóm tuổi, tỉnh/thành, miền hoặc toàn quốc.</p>
              <div class="rank-big"><strong>${Number(state.rp).toLocaleString("vi-VN")}</strong><span>RP của bé</span></div>
              <div class="arena-tabs" id="arenaPageTabs">${modes.map(([id, label]) => `<button class="arena-tab ${arenaMode === id ? "active" : ""}" data-mode="${id}" aria-pressed="${arenaMode === id}">${label}</button>`).join("")}</div>
              <div class="arena-search" id="arenaSearchStatus" aria-live="polite"><p class="note">Sẵn sàng luyện tập? Mỗi câu đúng giúp bé tích lũy RP.</p></div>
              <button class="btn btn-mint" id="arenaFindOpponent">🔎 Bắt đầu thử thách</button>
            </article>
            <article class="leader-card">
              <div class="leader-title"><h3>🏆 Bảng vinh danh</h3><span id="leaderScope"></span></div>
              <div class="leader-controls">
                ${leaderboardLocationControl("arenaLeaderboardProvince")}
                <form id="leaderboardPreferencesForm" class="leaderboard-preferences">
                  ${state.authenticated && !state.demoAccount ? `
                    <label>Biệt danh hiển thị
                      <input name="displayName" maxlength="24" value="${escapeHtml(state.leaderboardName || "")}" placeholder="Ví dụ: Bé Mây" ${state.leaderboardOptIn ? "required" : ""}>
                    </label>
                    <label>Tỉnh/thành
                      <select name="province" required><option value="">Chọn tỉnh/thành</option>${provinceOptions}</select>
                    </label>
                    <label class="leaderboard-consent"><input type="checkbox" name="optIn" ${state.leaderboardOptIn ? "checked" : ""}>
                      <span>Phụ huynh đồng ý công khai biệt danh và điểm RP trong bảng xếp hạng.</span>
                    </label>
                    <button class="btn btn-primary btn-small" type="submit">Lưu lựa chọn</button>
                  ` : `<p class="note">Bảng xếp hạng có thể xem công khai. Đăng nhập hoặc đăng ký để chọn biệt danh và tham gia.</p><a class="btn btn-primary btn-small" href="#/auth" data-route="auth">Đăng nhập / đăng ký</a>`}
                </form>
              </div>
              <p class="leaderboard-status" id="leaderboardStatus" aria-live="polite"></p>
              <div class="leaderboard-podium" id="leaderboardPodium"></div>
              <div id="leaderboard"></div><div class="leader-you" id="leaderYou"></div>
            </article>
          </div>`, "THỬ THÁCH");
        const setLeaderboardScope = () => {
          $("#leaderScope", $("#routeView")).textContent = leaderboardScopeLabel(arenaMode);
          $("#arenaLeaderboardProvinceWrap").hidden = !["region", "city"].includes(arenaMode);
        };
        const refreshLeaderboard = () => {
          setLeaderboardScope();
          renderLeaderboard($("#routeView"), arenaMode);
        };
        refreshLeaderboard();
        if (arenaLeaderboardInterval) window.clearInterval(arenaLeaderboardInterval);
        arenaLeaderboardInterval = window.setInterval(() => {
          if (route === "arena" && document.visibilityState === "visible") refreshLeaderboard();
        }, 10000);
        if (arenaMatchTimeout) { window.clearInterval(arenaMatchTimeout); arenaMatchTimeout = null; }
        $("#arenaPageTabs").addEventListener("click", (event) => {
          const tab = event.target.closest("[data-mode]");
          if (!tab) return;
          if (arenaMatchTimeout) { window.clearInterval(arenaMatchTimeout); arenaMatchTimeout = null; }
          arenaOpponent = null;
          $("#arenaFindOpponent").disabled = false;
          $("#arenaSearchStatus").innerHTML = '<p class="note">Sẵn sàng luyện tập? Mỗi câu đúng giúp bé tích lũy RP.</p>';
          arenaMode = tab.dataset.mode;
          $("#arenaLeaderboardProvinceWrap").hidden = !["region", "city"].includes(arenaMode);
          $("#arenaPageTabs").querySelectorAll("[data-mode]").forEach((item) => {
            const active = item === tab;
            item.classList.toggle("active", active);
            item.setAttribute("aria-pressed", String(active));
          });
          refreshLeaderboard();
        });
        $("#arenaLeaderboardProvince").addEventListener("change", (event) => {
          leaderboardViewProvince = event.currentTarget.value;
          syncLeaderboardLocationControls();
          refreshLeaderboard();
        });
        const preferencesForm = $("#leaderboardPreferencesForm");
        if (preferencesForm) preferencesForm.addEventListener("submit", (event) => {
          event.preventDefault();
          if (!state.authenticated || state.demoAccount || !leaderboardToken()) {
            leaderboardStatus($("#routeView"), "Hãy đăng nhập tài khoản thật để lưu lựa chọn bảng xếp hạng.", true);
            return;
          }
          const formData = new FormData(preferencesForm);
          const optIn = formData.get("optIn") === "on";
          const displayName = String(formData.get("displayName") || "").trim();
          const province = String(formData.get("province") || "");
          if (!window.LittleHeroLocations.regionByProvince[province]) {
            preferencesForm.elements.province.focus();
            return;
          }
          if (optIn && (!displayName || displayName.length > 24)) {
            preferencesForm.elements.displayName.focus();
            return;
          }
          state.leaderboardName = displayName;
          state.leaderboardProvince = province;
          leaderboardViewProvince = province;
          state.leaderboardOptIn = optIn;
          persist();
          window.clearTimeout(leaderboardSyncTimer);
          syncLeaderboardLocationControls();
          setLeaderboardScope();
          syncLeaderboardScore();
        });
        $("#arenaFindOpponent").addEventListener("click", (event) => {
          if (arenaMatchTimeout) window.clearInterval(arenaMatchTimeout);
          const button = event.currentTarget;
          button.disabled = true;
          arenaOpponent = null;
          $("#arenaSearchStatus").innerHTML = `<div class="arena-spinner" role="status" aria-label="Đang chuẩn bị thử thách"></div><p class="arena-result">Đang chuẩn bị tình huống · ${modes.find(([id]) => id === arenaMode)[1]}… <span id="arenaCountdown">5</span></p>`;
          let elapsed = 0;
          arenaMatchTimeout = window.setInterval(() => {
            elapsed += 1;
            const countdown = $("#arenaCountdown");
            if (countdown) countdown.textContent = String(Math.max(0, 5 - elapsed));
            if (elapsed < 5) return;
            window.clearInterval(arenaMatchTimeout);
            arenaMatchTimeout = null;
            arenaOpponent = { name: "Hero", level: "Cùng luyện tập" };
            $("#arenaSearchStatus").innerHTML = `<div class="arena-result">✨ Tình huống đã sẵn sàng · ${modes.find(([id]) => id === arenaMode)[1]}<br><button class="btn btn-mint btn-small" id="startArenaMatch" style="margin-top:9px">Vào thử thách →</button></div>`;
            button.disabled = false;
          }, 1000);
        });
        $("#routeView").addEventListener("click", (event) => {
          if (!event.target.closest("#startArenaMatch")) return;
          const availableLessons = ageAppropriateLessons();
          arenaMatchLesson = availableLessons[Math.floor(Math.random() * availableLessons.length)];
          arenaMatchChoice = null;
          setRoute("arena-match");
        });
      };

      const renderArenaMatchPage = () => {
        const availableLessons = ageAppropriateLessons();
        const lesson = arenaMatchLesson && ageCategories[currentAgeGroup()].includes(arenaMatchLesson.category)
          ? arenaMatchLesson
          : availableLessons[Math.floor(Math.random() * availableLessons.length)];
        arenaMatchLesson = lesson;
        const scene = getScene(lesson);
        const opponent = arenaOpponent || { name: "Bạn đồng hành", level: "Cùng luyện tập" };
        $("#routeView").innerHTML = pageShell("arena", `Đấu ${escapeHtml(opponent.name)} · ${escapeHtml(opponent.level)}. Một lựa chọn duy nhất cho câu hỏi này.`, `
          <article class="score-card">
            <div class="lesson-progress"><span>⚔ ${escapeHtml(opponent.name)} · ${escapeHtml(opponent.level)}</span><span>${arenaMatchChoice === null ? "Cùng Hero luyện tập" : "Lựa chọn đã khóa"}</span></div>
            <article class="scene-card">
              <div class="scene ${scene.type}" id="arenaScene">
                ${renderSceneBackdrop(scene)}
                <span class="scene-kicker">📍 ${scene.place}</span><span class="scene-prop" id="arenaSceneProp">${scene.prop}</span>
                ${renderSceneActor("arenaHeroActor", "Hero", true)}
                ${renderSceneActor("arenaFriendActor", opponent.name, false, { gender: /Hân|Linh|Nhiên|An/.test(opponent.name) ? "girl" : "boy" })}
              </div>
            </article>
            <h3 style="font-size:15px">${escapeHtml(lesson.title)} — Bé chọn cách nào?</h3>
            <div class="lesson-choices" id="arenaMatchChoices">${lesson.answers.map((answer, index) =>
              `<button class="lesson-choice" data-arena-choice="${index}" ${arenaMatchChoice !== null ? "disabled" : ""}><span class="choice-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(answer)}</span></button>`
            ).join("")}</div>
            <p class="lesson-feedback" id="arenaMatchFeedback" aria-live="polite">${arenaMatchChoice === null ? "Đọc tình huống rồi chọn một phương án phù hợp." : "Lựa chọn đã khóa."}</p>
            <button class="btn btn-light btn-small" id="leaveArenaMatch">← Về đấu trường</button>
          </article>`, "TRẬN ĐẤU 1 CÂU");
        $("#arenaMatchChoices").addEventListener("click", (event) => {
          const button = event.target.closest("[data-arena-choice]");
          if (!button || arenaMatchChoice !== null) return;
          arenaMatchChoice = Number(button.dataset.arenaChoice);
          const success = arenaMatchChoice === lesson.correct;
          animateSceneChoice("arenaScene", "arenaHeroActor", "arenaFriendActor", "arenaSceneProp", lesson.answers[arenaMatchChoice], lesson, success);
          $("#arenaMatchChoices").querySelectorAll("button").forEach((choice) => { choice.disabled = true; });
          button.classList.add(success ? "correct" : "incorrect");
          $("#arenaMatchFeedback").textContent = success
            ? "Đúng rồi! Đáp án đã khóa, bé nhận +10 ⭐ và +25 RP."
            : "Chưa phù hợp. Đáp án đã khóa, không thể chọn lại; bé có thể học lại trong kho bài.";
          if (success) { state.xp += 10; state.rp += 25; }
          else { state.xp = Math.max(0, state.xp - 3); state.rp = Math.max(0, state.rp - 5); }
          state.quiz += 1;
          state.dailyQuiz += 1;
          persist();
          speak(success ? `Kết quả thành công! ${lesson.prompts[2]}` : `Kết quả chưa thành công. ${lesson.prompts[1]} Câu đấu đã khóa.`);
          $("#arenaMatchFeedback").insertAdjacentHTML("afterend", '<button class="btn btn-mint btn-small" id="leaveArenaAfterResult">Kết thúc lượt đấu →</button>');
          $("#leaveArenaAfterResult").addEventListener("click", () => setRoute("arena"));
        });
        $("#leaveArenaMatch").addEventListener("click", () => setRoute("arena"));
      };

      const renderAuthPage = () => {
        $("#routeView").innerHTML = pageShell("auth", "Đăng nhập để tiếp tục hành trình; nếu chưa có tài khoản, chọn đăng ký bên dưới.", `
          <main class="auth-scene">
            <div class="auth-cloud auth-cloud-one" aria-hidden="true"></div>
            <div class="auth-cloud auth-cloud-two" aria-hidden="true"></div>
            <div class="auth-hills" aria-hidden="true"><span></span><span></span></div>
            ${localFileAuthMessage ? `<aside class="auth-local-warning" role="note"><strong>Không thể xác thực khi mở tệp cục bộ</strong><span>${escapeHtml(localFileAuthMessage)}</span><a href="https://littlehero.id.vn">Mở website</a></aside>` : ""}
            <div class="auth-card-wrap">
              <img class="auth-logo" src="./frontend/assets/little-hero-logo.png" alt="Little Hero">
              <article class="auth-card">
                <section id="loginPanel" aria-labelledby="loginHeading">
                  <h2 id="loginHeading" class="auth-heading">Chào mừng trở lại!</h2>
                  <p class="auth-subheading">Đăng nhập để tiếp tục hành trình cùng Hero</p>
                  <form class="auth-form" id="loginForm" autocomplete="on" novalidate>
                    <div class="auth-field">
                      <label class="visually-hidden" for="loginEmail">Email đã đăng ký</label>
                      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3.5 6.5h17v12h-17zM4 7l8 6 8-6" /></svg>
                      <input id="loginEmail" name="email" type="email" autocomplete="username" required maxlength="254" placeholder="Email đã đăng ký">
                    </div>
                    <div class="auth-field">
                      <label class="visually-hidden" for="loginPassword">Mật khẩu</label>
                      <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
                      <input id="loginPassword" name="password" type="password" autocomplete="current-password" required maxlength="128" placeholder="Mật khẩu">
                      <button class="auth-password-toggle" type="button" data-password-toggle="loginPassword" aria-label="Hiện mật khẩu">
                        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></svg>
                      </button>
                    </div>
                    <div class="auth-form-options">
                      <label><input type="checkbox" name="rememberEmail"> <span>Ghi nhớ email</span></label>
                      <button class="auth-text-button" type="button" data-auth-toggle="recover">Quên mật khẩu?</button>
                    </div>
                    <button class="auth-submit" type="submit">Đăng nhập</button>
                  </form>
                  <p id="loginError" class="auth-form-error" role="alert" aria-live="polite" hidden></p>
                  <p class="auth-switch-caption">Bạn chưa có tài khoản?</p>
                  <button class="auth-outline-button" type="button" data-auth-toggle="register">Đăng ký ngay</button>
                  <button class="auth-demo-button" id="demoAccountLogin" type="button">Hoặc vào với tài khoản trải nghiệm</button>
                </section>
                <section id="registrationPanel" aria-labelledby="registrationHeading" hidden>
                  <h2 id="registrationHeading" class="auth-heading">Tạo tài khoản mới</h2>
                  <p class="auth-subheading">Cùng bé bắt đầu hành trình khám phá nhé!</p>
                  <form class="auth-form auth-registration-form" id="registrationForm" autocomplete="on" novalidate>
                    <div class="auth-field">
                      <label class="visually-hidden" for="registerName">Họ và tên phụ huynh</label>
                      <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></svg>
                      <input id="registerName" name="fullName" autocomplete="name" required minlength="2" maxlength="80" placeholder="Họ và tên phụ huynh">
                    </div>
                    <div class="auth-field">
                      <label class="visually-hidden" for="registerEmail">Email</label>
                      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3.5 6.5h17v12h-17zM4 7l8 6 8-6" /></svg>
                      <input id="registerEmail" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="Email">
                    </div>
                    <div class="auth-field">
                      <label class="visually-hidden" for="registerPhone">Số điện thoại</label>
                      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z" /><path d="M10 17.5h4" /></svg>
                      <input id="registerPhone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required maxlength="16" placeholder="Số điện thoại (+84)">
                    </div>
                    <div class="auth-field">
                      <label class="visually-hidden" for="registerPassword">Mật khẩu</label>
                      <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
                      <input id="registerPassword" name="password" type="password" autocomplete="new-password" minlength="8" maxlength="128" required placeholder="Mật khẩu (từ 8 ký tự)">
                      <button class="auth-password-toggle" type="button" data-password-toggle="registerPassword" aria-label="Hiện mật khẩu">
                        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></svg>
                      </button>
                    </div>
                    <div class="auth-field">
                      <label class="visually-hidden" for="registerConfirmPassword">Nhập lại mật khẩu</label>
                      <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
                      <input id="registerConfirmPassword" name="confirmPassword" type="password" autocomplete="new-password" minlength="8" maxlength="128" required placeholder="Nhập lại mật khẩu">
                      <button class="auth-password-toggle" type="button" data-password-toggle="registerConfirmPassword" aria-label="Hiện mật khẩu">
                        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></svg>
                      </button>
                    </div>
                    <p class="auth-field-note">Số điện thoại là bắt buộc để hỗ trợ khôi phục tài khoản.</p>
                    <button class="auth-submit" type="submit">Đăng ký tài khoản</button>
                  </form>
                  <p id="registrationError" class="auth-form-error" role="alert" aria-live="polite" hidden></p>
                  <p class="auth-privacy-note">Mật khẩu được xử lý an toàn ở máy chủ, không lưu dưới dạng văn bản thường.</p>
                  <p class="auth-switch-caption">Đã có tài khoản?</p>
                  <button class="auth-outline-button" type="button" data-auth-toggle="login">Đăng nhập</button>
                </section>
                <section id="recoveryPanel" aria-labelledby="recoveryHeading" hidden>
                  <h2 id="recoveryHeading" class="auth-heading">Khôi phục mật khẩu</h2>
                  <p class="auth-subheading">Nhận mã xác minh qua email hoặc số điện thoại đã đăng ký</p>
                  <form class="auth-form auth-recovery-form" id="recoveryRequestForm" novalidate>
                    <label class="auth-recovery-label">Nhận mã qua
                      <select name="channel" required><option value="email">Email</option><option value="phone">Số điện thoại</option></select>
                    </label>
                    <label class="auth-recovery-label">Thông tin đã đăng ký<input name="identifier" type="text" autocomplete="email" required maxlength="254" placeholder="ten@example.com"></label>
                    <button class="auth-submit" type="submit">Gửi mã xác minh</button>
                  </form>
                  <p id="recoveryMessage" class="auth-form-error" role="status" aria-live="polite" hidden></p>
                  <form class="auth-form auth-recovery-form" id="recoveryCompleteForm" autocomplete="off" novalidate hidden>
                    <label class="auth-recovery-label">Mã xác minh<input name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" required maxlength="6" placeholder="Nhập mã 6 chữ số"></label>
                    <label class="auth-recovery-label">Mật khẩu mới<input name="password" type="password" autocomplete="new-password" minlength="8" maxlength="128" required placeholder="Từ 8 đến 128 ký tự"></label>
                    <label class="auth-recovery-label">Nhập lại mật khẩu mới<input name="confirmPassword" type="password" autocomplete="new-password" minlength="8" maxlength="128" required placeholder="Nhập lại mật khẩu"></label>
                    <button class="auth-submit" type="submit">Đặt mật khẩu mới</button>
                  </form>
                  <p class="auth-switch-caption">Bạn nhớ lại mật khẩu rồi?</p>
                  <button class="auth-outline-button" type="button" data-auth-toggle="login">Quay lại đăng nhập</button>
                </section>
              </article>
            </div>
          </main>`, "TÀI KHOẢN");
        const showAuthPanel = (panel) => {
          const register = panel === "register";
          $("#loginPanel").hidden = panel !== "login";
          $("#registrationPanel").hidden = panel !== "register";
          $("#recoveryPanel").hidden = panel !== "recover";
          $("#routeView .page-heading p").textContent = register
            ? "Nhập họ tên, email, số điện thoại và tạo mật khẩu để đăng ký tài khoản."
            : panel === "recover"
              ? "Xác minh email hoặc số điện thoại đã đăng ký để đặt lại mật khẩu."
              : "Đăng nhập để tiếp tục hành trình; nếu chưa có tài khoản, chọn đăng ký bên dưới.";
        };
        $("#routeView").querySelectorAll("[data-auth-toggle]").forEach((button) => {
          button.addEventListener("click", () => showAuthPanel(button.dataset.authToggle));
        });
        $("#routeView").querySelectorAll("[data-password-toggle]").forEach((button) => {
          button.addEventListener("click", () => {
            const input = document.getElementById(button.dataset.passwordToggle);
            const isVisible = input.type === "password";
            input.type = isVisible ? "text" : "password";
            button.setAttribute("aria-label", isVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu");
          });
        });
        const loginForm = $("#loginForm");
        const rememberedEmailKey = "littleHeroRememberedEmail";
        const rememberEmail = loginForm.elements.rememberEmail;
        try {
          const rememberedEmail = localStorage.getItem(rememberedEmailKey);
          if (rememberedEmail) {
            loginForm.elements.email.value = rememberedEmail;
            rememberEmail.checked = true;
          }
        } catch (error) {
          console.warn("Không thể đọc email đã ghi nhớ.", error);
        }
        rememberEmail.addEventListener("change", () => {
          if (rememberEmail.checked) return;
          try { localStorage.removeItem(rememberedEmailKey); }
          catch (error) { console.warn("Không thể xóa email đã ghi nhớ.", error); }
        });
        const enterDemoAccount = () => {
          state.authenticated = true;
          state.demoAccount = true;
          state.accountEmail = "";
          normalizeProgressState();
          state.childName = DEMO_ACCOUNT.name;
          const child = state.children.find((entry) => entry.id === state.activeChildId);
          if (child) child.name = DEMO_ACCOUNT.name;
          const nextRoute = pendingAuthRoute || "home";
          pendingAuthRoute = "";
          persist();
          setRoute(nextRoute);
          showOnboardingIfNeeded(true);
          toast("Đã vào tài khoản trải nghiệm. Tiến độ chỉ lưu trên trình duyệt này.");
        };
        $("#demoAccountLogin").addEventListener("click", enterDemoAccount);
        const registrationError = $("#registrationError");
        const loginError = $("#loginError");
        const showRegistrationError = (message, field) => {
          registrationError.textContent = message;
          registrationError.hidden = false;
          if (field) $(`#registrationForm [name="${field}"]`).focus();
        };
        const showLoginError = (message, field) => {
          loginError.textContent = message;
          loginError.hidden = false;
          if (field) $(`#loginForm [name="${field}"]`).focus();
        };
        loginForm.addEventListener("input", () => {
          loginError.textContent = "";
          loginError.hidden = true;
        });
        loginForm.addEventListener("submit", () => {
          if (!rememberEmail.checked) return;
          try { localStorage.setItem(rememberedEmailKey, loginForm.elements.email.value.trim()); }
          catch (error) { console.warn("Không thể lưu email đã ghi nhớ.", error); }
        });
        $("#registrationForm").addEventListener("input", () => {
          registrationError.textContent = "";
          registrationError.hidden = true;
        });
        const recoveryMessage = $("#recoveryMessage");
        let recoveryChallengeId = "";
        let recoveryChannel = "email";
        let recoveryContact = "";
        const recoveryRequestForm = $("#recoveryRequestForm");
        const recoveryCompleteForm = $("#recoveryCompleteForm");
        const recoveryChannelSelect = recoveryRequestForm.elements.channel;
        const recoveryIdentifier = recoveryRequestForm.elements.identifier;
        recoveryChannelSelect.addEventListener("change", () => {
          recoveryChannel = recoveryChannelSelect.value;
          recoveryIdentifier.value = "";
          recoveryIdentifier.autocomplete = recoveryChannel === "email" ? "email" : "tel";
          recoveryIdentifier.inputMode = recoveryChannel === "email" ? "email" : "tel";
          recoveryIdentifier.placeholder = recoveryChannel === "email" ? "ten@example.com" : "+84901234567";
          recoveryIdentifier.maxLength = recoveryChannel === "email" ? 254 : 16;
        });
        recoveryRequestForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          const identifier = String(new FormData(recoveryRequestForm).get("identifier") || "").trim();
          const normalizedPhone = identifier.replace(/[ ()-]/g, "");
          if (recoveryChannel === "email" && (identifier.length > 254 || !validEmail(identifier))) {
            recoveryMessage.textContent = "Hãy nhập đúng email đã đăng ký.";
            recoveryMessage.hidden = false;
            recoveryIdentifier.focus();
            return;
          }
          if (recoveryChannel === "phone" && !/^\+84\d{9,10}$/.test(normalizedPhone)) {
            recoveryMessage.textContent = "Hãy nhập số điện thoại Việt Nam bắt đầu bằng +84.";
            recoveryMessage.hidden = false;
            recoveryIdentifier.focus();
            return;
          }
          const submitButton = recoveryRequestForm.querySelector('button[type="submit"]');
          submitButton.disabled = true;
          recoveryMessage.hidden = true;
          try {
            const response = await fetch(apiUrl("/api/auth/recovery/request"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ channel: recoveryChannel, identifier: recoveryChannel === "phone" ? normalizedPhone : identifier.toLowerCase() })
            });
            const result = await response.json();
            if (!response.ok) {
              recoveryMessage.textContent = result.error || "Không thể gửi mã xác minh. Vui lòng thử lại.";
              recoveryMessage.hidden = false;
              return;
            }
            recoveryChallengeId = result.challengeId;
            recoveryContact = recoveryChannel === "phone" ? normalizedPhone : identifier.toLowerCase();
            recoveryMessage.textContent = `${result.message} Nếu chưa nhận được mã, hãy kiểm tra lại thông tin hoặc thử lại sau.`;
            recoveryMessage.hidden = false;
            recoveryRequestForm.hidden = true;
            recoveryCompleteForm.hidden = false;
          } catch (error) {
            console.error("Không thể kết nối máy chủ khôi phục mật khẩu.", error);
            recoveryMessage.textContent = "Không kết nối được máy chủ. Hãy kiểm tra kết nối mạng rồi thử lại.";
            recoveryMessage.hidden = false;
          } finally {
            submitButton.disabled = false;
          }
        });
        recoveryCompleteForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          const data = new FormData(recoveryCompleteForm);
          const code = String(data.get("code") || "").trim();
          const password = String(data.get("password") || "");
          const confirmPassword = String(data.get("confirmPassword") || "");
          if (!/^\d{6}$/.test(code)) {
            recoveryMessage.textContent = "Mã xác minh gồm 6 chữ số.";
            recoveryMessage.hidden = false;
            recoveryCompleteForm.elements.code.focus();
            return;
          }
          if (password.length < 8 || password.length > 128) {
            recoveryMessage.textContent = "Mật khẩu phải có từ 8 đến 128 ký tự.";
            recoveryMessage.hidden = false;
            recoveryCompleteForm.elements.password.focus();
            return;
          }
          if (password !== confirmPassword) {
            recoveryMessage.textContent = "Hai mật khẩu mới chưa khớp.";
            recoveryMessage.hidden = false;
            recoveryCompleteForm.elements.confirmPassword.focus();
            return;
          }
          const submitButton = recoveryCompleteForm.querySelector('button[type="submit"]');
          submitButton.disabled = true;
          recoveryMessage.hidden = true;
          try {
            const response = await fetch(apiUrl("/api/auth/recovery/reset"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ challengeId: recoveryChallengeId, code, password })
            });
            const result = await response.json();
            if (!response.ok) {
              recoveryMessage.textContent = result.error || "Không thể đổi mật khẩu. Vui lòng thử lại.";
              recoveryMessage.hidden = false;
              return;
            }
            const recoveredEmail = recoveryChannel === "email" ? recoveryContact : "";
            recoveryChallengeId = "";
            recoveryRequestForm.reset();
            recoveryCompleteForm.reset();
            recoveryRequestForm.hidden = false;
            recoveryCompleteForm.hidden = true;
            recoveryChannel = "email";
            recoveryContact = "";
            recoveryIdentifier.autocomplete = "email";
            recoveryIdentifier.inputMode = "email";
            recoveryIdentifier.placeholder = "ten@example.com";
            recoveryIdentifier.maxLength = 254;
            recoveryMessage.hidden = true;
            showAuthPanel("login");
            if (recoveredEmail) $("#loginForm [name=email]").value = recoveredEmail;
            toast(result.message);
          } catch (error) {
            console.error("Không thể kết nối máy chủ đổi mật khẩu.", error);
            recoveryMessage.textContent = "Không kết nối được máy chủ. Hãy kiểm tra kết nối mạng rồi thử lại.";
            recoveryMessage.hidden = false;
          } finally {
            submitButton.disabled = false;
          }
        });
        $("#loginForm").addEventListener("submit", async (event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const data = new FormData(form);
          const email = String(data.get("email") || "").trim().toLowerCase();
          const password = String(data.get("password") || "");
          loginError.textContent = "";
          loginError.hidden = true;
          if (email === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) {
            enterDemoAccount();
            return;
          }
          if (email === DEMO_ACCOUNT.email) {
            showLoginError("Mật khẩu tài khoản trải nghiệm chưa chính xác. Hãy thử lại hoặc dùng nút tài khoản trải nghiệm.", "password");
            return;
          }
          if (email.length > 254 || !validEmail(email)) { showLoginError("Hãy nhập đúng email đã dùng khi đăng ký, ví dụ ten@example.com.", "email"); return; }
          if (!password) { showLoginError("Vui lòng nhập mật khẩu.", "password"); return; }
          if (password.length > 128) { showLoginError("Mật khẩu không được dài quá 128 ký tự.", "password"); return; }
          if (localFileAuthMessage) { showLoginError(localFileAuthMessage); return; }
          const submitButton = form.querySelector('button[type="submit"]');
          submitButton.disabled = true;
          try {
            const response = await fetch(apiUrl("/api/auth/login"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password })
            });
            const result = await response.json();
            if (!response.ok) { showLoginError(result.error || "Email hoặc mật khẩu chưa chính xác. Hãy kiểm tra lại hoặc đăng ký tài khoản mới."); return; }
            try { sessionStorage.setItem(leaderboardTokenKey(result.user.email), result.token); }
            catch (error) {
              console.warn("Không thể lưu phiên đăng nhập bảng xếp hạng.", error);
              toast("Đã đăng nhập, nhưng trình duyệt không lưu được phiên bảng xếp hạng. Hãy bật lưu trữ phiên để tham gia.");
            }
            persist();
            loadAccountProgress(result.user.email, result.user.name);
            const nextRoute = pendingAuthRoute || "home";
            pendingAuthRoute = "";
            persist();
            setRoute(nextRoute);
            showOnboardingIfNeeded(true);
            toast(`Chào mừng ${result.user.name} trở lại Little Hero!`);
          } catch (error) {
            console.error("Không thể kết nối tới máy chủ đăng nhập.", error);
            showLoginError("Không kết nối được máy chủ. Hãy kiểm tra kết nối mạng rồi thử lại.");
          } finally {
            submitButton.disabled = false;
          }
        });
        $("#registrationForm").addEventListener("submit", async (event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const data = new FormData(form);
          const fullName = String(data.get("fullName") || "").trim();
          const email = String(data.get("email") || "").trim().toLowerCase();
          const phone = String(data.get("phone") || "").trim();
          const password = String(data.get("password") || "");
          const confirmPassword = String(data.get("confirmPassword") || "");
          registrationError.textContent = "";
          registrationError.hidden = true;
          if (fullName.length < 2 || fullName.length > 80) { showRegistrationError("Họ và tên phải có từ 2 đến 80 ký tự.", "fullName"); return; }
          if (email.length > 254 || !validEmail(email)) { showRegistrationError("Email chưa đúng định dạng. Ví dụ: ten@example.com.", "email"); return; }
          if (!/^\+84(?:[ ()-]?\d){9,10}$/.test(phone)) { showRegistrationError("Số điện thoại chưa đúng định dạng. Hãy nhập +84 và 9–10 chữ số tiếp theo.", "phone"); return; }
          if (password.length < 8 || password.length > 128) { showRegistrationError("Mật khẩu phải có ít nhất 8 ký tự (tối đa 128 ký tự).", "password"); return; }
          if (password !== confirmPassword) { showRegistrationError("Hai mật khẩu chưa khớp. Hãy kiểm tra lại nhé.", "confirmPassword"); return; }
          if (localFileAuthMessage) { showRegistrationError(localFileAuthMessage); return; }
          const submitButton = form.querySelector('button[type="submit"]');
          submitButton.disabled = true;
          try {
            const response = await fetch(apiUrl("/api/auth/register"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: fullName, email, phone, password })
            });
            const result = await response.json();
            if (!response.ok) {
              showRegistrationError(result.error || "Không thể tạo tài khoản. Vui lòng thử lại.", result.field);
              return;
            }
            form.reset();
            registrationError.textContent = "";
            registrationError.hidden = true;
            showAuthPanel("login");
            $("#loginForm [name=email]").value = email;
            toast("Tạo tài khoản thành công. Hãy đăng nhập bằng email và mật khẩu vừa đăng ký.");
          } catch (error) {
            console.error("Không thể kết nối tới máy chủ đăng ký.", error);
            showRegistrationError("Không kết nối được máy chủ đăng ký. Hãy kiểm tra kết nối mạng rồi thử lại.");
          } finally {
            submitButton.disabled = false;
          }
        });
      };

      const renderPaymentPage = (planId = "monthly") => {
        const plan = subscriptionPlans[planId] || subscriptionPlans.monthly;
        const transferNote = planId === "yearly" ? "LITTLEHERO NAM" : "LITTLEHERO THANG";
        const featureList = plan.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("");
        $("#routeView").innerHTML = pageShell("payment", `Gói đã chọn: ${plan.name} · ${plan.price.toLocaleString("vi-VN")}đ`, `
          <article class="settings-card checkout-pending">
            <span class="catalog-icon" aria-hidden="true">💳</span>
            <h2>${escapeHtml(plan.name)}</h2>
            <p class="price">${plan.price.toLocaleString("vi-VN")}đ <span>/${planId === "yearly" ? "năm" : "tháng"}</span></p>
            <ul class="features">${featureList}</ul>
            <h3 class="payment-section-title">Thông tin chuyển khoản</h3>
            <div class="payment-details">
              <div class="payment-row"><span>Ngân hàng</span><strong>${PAYMENT_CONFIG.bankName}</strong></div>
              <div class="payment-row"><span>Người nhận</span><strong>${PAYMENT_CONFIG.accountName}</strong></div>
              <div class="payment-row"><span>Số tài khoản</span><strong id="paymentAccountNumber">${PAYMENT_CONFIG.accountNumber}</strong></div>
              <div class="payment-row"><span>Số tiền</span><strong>${plan.price.toLocaleString("vi-VN")}đ</strong></div>
              <div class="payment-row"><span>Nội dung</span><strong id="paymentTransferNote">${transferNote}</strong></div>
            </div>
            <div class="page-actions payment-copy-actions"><button class="btn btn-light btn-small" id="copyPaymentAccount" type="button">Sao chép số tài khoản</button><button class="btn btn-light btn-small" id="copyPaymentNote" type="button">Sao chép nội dung</button></div>
            <div class="payment-note" role="status">Sau khi chuyển khoản, giao dịch cần được xác minh. Hiện chưa có đối soát tự động; quyền Premium vẫn khóa cho đến khi máy chủ xác nhận thanh toán thành công. Vui lòng kiểm tra kỹ người nhận và số tiền trước khi chuyển.</div>
            <div class="page-actions">${routeLink("pricing", "Chọn gói khác", "←")}${routeLink("faq", "Hỏi đáp thanh toán", "❔")}</div>
          </article>`, "THANH TOÁN AN TOÀN");
        const copyPaymentValue = async (value, label) => {
          try {
            await navigator.clipboard.writeText(value);
            toast(`${label} đã được sao chép.`);
          } catch (error) {
            toast("Không thể sao chép tự động trên trình duyệt này. Bạn có thể chọn và sao chép thông tin thủ công.");
          }
        };
        $("#copyPaymentAccount").addEventListener("click", () => copyPaymentValue(PAYMENT_CONFIG.accountNumber, "Số tài khoản"));
        $("#copyPaymentNote").addEventListener("click", () => copyPaymentValue(transferNote, "Nội dung chuyển khoản"));
      };

      const renderPremiumSuccessPage = () => {
        $("#routeView").innerHTML = pageShell("pricing", "Thông tin gói Premium của bé.", `
          <article class="score-card" style="max-width:680px;text-align:center">
            <div style="font-size:42px">♛</div><h2 style="margin:4px 0">${hasVerifiedPremium() ? "Gói Premium đang hoạt động" : "Chưa có thanh toán được xác minh"}</h2>
            <p>${hasVerifiedPremium() ? `Gói ${escapeHtml(subscriptionPlans[state.premiumPlan].name)} có hiệu lực đến ${new Date(state.premiumExpiresAt).toLocaleDateString("vi-VN")}.` : "Quyền lợi vẫn khóa cho đến khi máy chủ xác nhận giao dịch thành công."}</p>
            <div class="story-box">Không thể kích hoạt quyền Premium bằng xác nhận trên trình duyệt. Website cần nhận trạng thái thanh toán đã xác minh từ cổng thanh toán.</div>
            <div class="page-actions" style="justify-content:center">${routeLink("home", "Về trang chủ", "⌂")}${routeLink("lessons", "Tiếp tục học", "📚")}</div>
          </article>`, "TRẠNG THÁI GÓI");
      };

      const answerAssistantQuestion = (question) => {
        const normalized = question.toLocaleLowerCase("vi").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
        const routes = [
          { route: "parents", label: "Mở khu vực phụ huynh", words: ["phu huynh", "cha me", "ba me", "ho so", "tien do", "bao cao", "bieu do", "nhat ky", "thoi gian hoc", "ky nang cua con", "nhieu be", "profile", "parent", "progress"] },
          { route: "parent-news", label: "Xem bài viết cho phụ huynh", words: ["tin tuc", "bai viet", "cam nang", "nuoi day", "thuong hieu", "little hero la gi", "ve little hero", "parent guide", "news"] },
          { route: "map", label: "Mở bản đồ ốc đảo", words: ["ban do", "oc dao", "island", "kham pha cac vung", "hanh trinh", "hero world", "map"] },
          { route: "lessons", label: "Mở kho bài học", words: ["bai hoc", "khoa hoc", "hoc gi", "chu de ky nang", "ky nang song", "lesson", "course"] },
          { route: "stories", label: "Mở truyện tương tác", words: ["truyen", "doc truyen", "truyen tranh", "story"] },
          { route: "games", label: "Mở trò chơi", words: ["tro choi", "mini game", "game"] },
          { route: "quiz", label: "Mở bài kiểm tra", words: ["kiem tra", "quiz", "bai test"] },
          { route: "quests", label: "Xem nhiệm vụ hằng ngày", words: ["nhiem vu", "thu thach hang ngay", "nhiem vu hang ngay"] },
          { route: "achievements", label: "Mở tường thành tích", words: ["thanh tich", "huy hieu", "sao thuong", "diem thuong"] },
          { route: "pricing", label: "Xem các gói dịch vụ", words: ["premium", "goi dich vu", "gia tien", "phi", "dang ky goi", "nang cap"] },
          { route: "payment", label: "Xem thông tin thanh toán", words: ["thanh toan", "mua hang", "don hang", "mua goi"] },
          { route: "auth", label: "Mở trang tài khoản", words: ["dang nhap", "dang ky", "tai khoan", "mat khau"] },
          { route: "reviews", label: "Gửi đánh giá hoặc góp ý", words: ["danh gia", "gop y", "phan hoi", "nhan xet", "review", "feedback"] },
          { route: "faq", label: "Mở hướng dẫn và hỗ trợ", words: ["tro giup", "ho tro", "lien he", "cau hoi", "quyen rieng tu", "bao loi"] },
          { route: "language", label: "Đổi ngôn ngữ", words: ["ngon ngu", "tieng anh", "english"] }
        ];
        const destination = routes.find((item) => item.words.some((word) => normalized.includes(word)));
        if (state.language === "en") {
          if (/(danger|unsafe|hurt|lost|stranger|bully|harm myself)/.test(normalized)) {
            return { text: "If you or someone else may be in immediate danger, find a trusted adult nearby and contact local emergency services. Hero can offer general guidance but cannot replace in-person help.", route: "parent-news", label: "Open the safety guide" };
          }
          const englishResponses = {
            parents: ["Parents can manage child profiles, review learning activity, and find ideas for practicing together.", "Open parent area"],
            "parent-news": ["The parent area includes articles and practical guidance for families.", "Open parent articles"],
            map: ["The skill map is available as a separate activity; you can also browse lessons directly.", "Open skill map"],
            lessons: ["Browse short lessons about emotions, communication, safety, independence, and discovery.", "Browse lessons"],
            stories: ["Explore interactive stories and choose what the characters do next.", "Open stories"],
            games: ["Open the games page to explore the available activities.", "Open games"],
            quiz: ["Try a short review activity to practice what you have learned.", "Open review activities"],
            quests: ["See the daily learning activities and rewards.", "Open daily quests"],
            achievements: ["See the badges and milestones you have earned.", "Open achievements"],
            pricing: ["You can review the available plans. Payments are not processed in this app.", "View plans"],
            payment: ["Payment details are informational; this app does not verify or process payments.", "View payment information"],
            auth: ["Open your account page to sign in or register.", "Open account"],
            reviews: ["You can share feedback from the app reviews page.", "Open app reviews"],
            faq: ["Find answers and support information on the help page.", "Open help"],
            language: ["Choose Vietnamese or English for AI replies and voice recognition.", "Change language"]
          };
          const response = destination && englishResponses[destination.route];
          return response
            ? { text: response[0], route: destination.route, label: response[1] }
            : { text: "I couldn't connect to the online AI right now. You can ask about lessons, stories, games, your character, or try again later.", route: "faq", label: "Open help" };
        }
        if (/(nguy hiem|bi danh|bi bat nat|bi lac|nguoi la|khong an toan|muon tu lam dau)/.test(normalized)) {
          return { text: "Nếu con hoặc ai đó đang gặp nguy hiểm ngay lúc này, hãy tìm người lớn đáng tin cậy ở gần và liên hệ dịch vụ khẩn cấp tại nơi con sống. Hero chỉ có thể chia sẻ hướng dẫn chung, không thay thế người hỗ trợ trực tiếp.", route: "parent-news", label: "Xem cẩm nang an toàn" };
        }
        if (destination?.route === "parents") {
          return { text: "Ba mẹ có thể quản lý hồ sơ từng bé, xem nhật ký thực hành, thời gian sử dụng, biểu đồ tiến độ và gợi ý hoạt động tại khu vực phụ huynh. Dữ liệu hiện được lưu trên thiết bị này.", ...destination };
        }
        if (destination?.route === "map") {
          return { text: "Bản đồ có 8 ốc đảo kỹ năng. Chọn một điểm dừng để mở tình huống và bắt đầu bài học.", ...destination };
        }
        if (destination?.route === "pricing" || destination?.route === "payment") {
          return { text: "Ba mẹ có thể xem thông tin gói. Trang chưa kết nối cổng thanh toán hoặc xác nhận giao dịch.", ...destination };
        }
        if (destination?.route === "auth") {
          return { text: "Bạn có thể đăng nhập hoặc tạo tài khoản Little Hero tại trang tài khoản.", ...destination };
        }
        if (destination) return { text: `Mình có thể hướng dẫn mục này. ${destination.route === "lessons" ? "Kho bài học gồm các chủ đề cảm xúc, giao tiếp, an toàn, tự lập và khám phá." : "Mở trang liên quan để xem các lựa chọn hiện có."}`, ...destination };
        if (/(lo lang|buon|tuc gian|cam xuc|so hai|khoc)/.test(normalized)) {
          return { text: "Cảm xúc của con đều đáng được lắng nghe. Con có thể thử hít thở chậm, gọi tên cảm xúc và kể với người lớn mà con tin tưởng. Ba mẹ hãy lắng nghe trước khi đưa lời khuyên nhé.", route: "lessons", label: "Tìm bài học về cảm xúc" };
        }
        if (/(xin chao|chao hero|ban la ai|ban co the lam gi)/.test(normalized)) {
          return { text: "Chào bạn! Mình có thể trả lời câu hỏi của bạn và hướng dẫn các trang, tính năng Little Hero. Hãy thử hỏi “Mở bản đồ ốc đảo” hoặc “Xem tiến độ của con”.", route: "map", label: "Khám phá bản đồ" };
        }
        return { text: "Mình chưa kết nối được AI trực tuyến lúc này. Bạn có thể hỏi về bản đồ, bài học, trò chơi, nhân vật hoặc thử lại sau nhé.", route: "faq", label: "Xem hướng dẫn sử dụng" };
      };
      const appendChatMessage = (container, role, text, action = null) => {
        const message = document.createElement("article");
        message.className = `chat-message ${role}`;
        message.textContent = text;
        if (action || role === "assistant") {
          const actions = document.createElement("div");
          actions.className = "chat-message-actions";
          if (role === "assistant") {
            const speakButton = document.createElement("button");
            speakButton.type = "button";
            speakButton.className = "chat-speak-btn";
            speakButton.dataset.speechText = text;
            speakButton.setAttribute("aria-label", "Nghe Hero đọc câu trả lời");
            speakButton.textContent = "♫ Nghe câu trả lời";
            actions.append(speakButton);
          }
          if (action) {
            const link = document.createElement("a");
            link.className = "btn btn-mint btn-small";
            link.href = `#/${action.route}`;
            link.dataset.route = action.route;
            link.textContent = action.label;
            actions.append(link);
          }
          message.append(actions);
        }
        container.append(message);
        container.scrollTop = container.scrollHeight;
        return message;
      };
      const renderTutorPage = () => {
        $("#routeView").innerHTML = pageShell("tutor", "Hỏi về tính năng và nội dung Little Hero, hoặc yêu cầu Hero mở trang liên quan.", `
          <section class="chat-shell" aria-label="Trò chuyện với trợ lý Little Hero">
            <header class="chat-top"><span class="chat-avatar" aria-hidden="true">✦</span><div><h2>Hỏi Hero</h2><p>Trợ lý AI · Gemini</p></div><button class="chat-voice-mode" id="assistantVoiceMode" type="button" aria-pressed="false" title="Bật hội thoại rảnh tay">🎧 Hội thoại rảnh tay</button><span class="chat-status" id="assistantStatus">ĐANG KẾT NỐI</span></header>
            <div class="chat-messages" id="assistantMessages" aria-live="polite" aria-label="Tin nhắn trò chuyện">
              <article class="chat-message assistant">Chào bạn! Mình có thể hướng dẫn các mục trong Little Hero và mở trang phù hợp. Bạn muốn tìm hiểu điều gì?</article>
            </div>
            <div class="chat-suggestions" aria-label="Câu hỏi gợi ý">
              <button type="button" data-assistant-prompt="Mở bản đồ ốc đảo">🗺️ Bản đồ ốc đảo</button>
              <button type="button" data-assistant-prompt="Xem tiến độ và hồ sơ của con">👨‍👩‍👧 Góc phụ huynh</button>
              <button type="button" data-assistant-prompt="Tôi muốn đổi nhân vật Hero">🎭 Đổi nhân vật</button>
              <button type="button" data-assistant-prompt="Có những bài học nào?">📚 Kho bài học</button>
            </div>
            <form class="chat-compose" id="assistantChatForm">
              <textarea name="message" maxlength="2000" aria-label="Nhập câu hỏi" placeholder="Hỏi về Little Hero hoặc bất kỳ chủ đề nào…"></textarea>
              <input id="assistantFileInput" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/mpeg,video/quicktime,video/mov,video/avi,video/x-msvideo,video/x-flv,video/mpg,video/webm,video/wmv,video/3gpp,application/pdf,text/plain,text/csv" multiple hidden>
              <button class="chat-attach-btn" id="assistantAttachButton" type="button" aria-label="Đính kèm ảnh, video hoặc tệp" title="Đính kèm ảnh, video hoặc tệp">📎</button>
              <button class="chat-voice-btn" id="assistantVoiceButton" type="button" aria-label="Hỏi Hero bằng giọng nói" aria-pressed="false" title="Bật micro, nói câu hỏi rồi nhấn lần nữa để gửi">🎙️</button>
              <button class="btn btn-mint" type="submit">Gửi ➤</button>
            </form>
            <div class="chat-attachments" id="assistantAttachments" aria-live="polite"></div>
          </section>
          <p class="parent-notice" style="max-width:900px;margin:12px auto 0">Hero có thể trao đổi về nhiều chủ đề, trả lời dựa trên nội dung bạn gửi và gợi ý mục phù hợp trong ứng dụng. Nhấn micro để hỏi bằng giọng nói; bật “Hội thoại rảnh tay” để Hero tự nghe câu hỏi, trả lời bằng giọng nói rồi chờ lượt tiếp theo. Cần cấp quyền micro và dùng HTTPS hoặc localhost. Có thể đính kèm tối đa 3 ảnh, video hoặc tài liệu (tối đa 10 MB mỗi tệp, 12 MB mỗi lượt). Câu hỏi và tệp được gửi tới Gemini qua backend; không gửi mật khẩu hoặc thông tin riêng tư của trẻ. AI có thể trả lời sai và không thay thế chuyên gia hay người lớn đáng tin cậy.</p>`, "HỎI ĐÁP");
        const form = $("#assistantChatForm");
        const input = form.elements.message;
        const voiceButton = $("#assistantVoiceButton");
        const voiceModeButton = $("#assistantVoiceMode");
        const fileInput = $("#assistantFileInput");
        const attachButton = $("#assistantAttachButton");
        const attachmentsView = $("#assistantAttachments");
        const sendButton = form.querySelector('button[type="submit"]');
        const assistantStatus = $("#assistantStatus");
        let recognition = null;
        let voiceListening = false;
        let voiceRestartTimer = null;
        let voiceSilenceTimer = null;
        let voiceTranscript = "";
        let handsFreeMode = false;
        let speakVoiceReply = false;
        let sending = false;
        let activeChatController = null;
        let assistantReady = false;
        let assistantIdleStatus = "CẦN CHẠY BACKEND";
        const conversation = [];
        let selectedFiles = [];
        const acceptedFileTypes = new Set([
          "application/pdf", "text/plain", "text/csv", "image/jpeg", "image/png", "image/webp", "image/gif",
          "video/mp4", "video/mpeg", "video/quicktime", "video/webm", "video/mov", "video/avi", "video/x-flv",
          "video/mpg", "video/x-msvideo", "video/wmv", "video/3gpp"
        ]);
        const updateAttachmentList = () => {
          attachmentsView.replaceChildren();
          if (!selectedFiles.length) return;
          const list = document.createElement("span");
          list.textContent = selectedFiles.map((file) => `${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)`).join(" · ");
          const clearButton = document.createElement("button");
          clearButton.type = "button";
          clearButton.textContent = "Xóa tệp";
          clearButton.addEventListener("click", () => {
            selectedFiles = [];
            fileInput.value = "";
            updateAttachmentList();
          });
          attachmentsView.append(list, clearButton);
        };
        attachButton.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", () => {
          const files = [...fileInput.files];
          const totalBytes = files.reduce((total, file) => total + file.size, 0);
          if (files.length > 3 || files.some((file) => !acceptedFileTypes.has(file.type))) {
            toast("Chọn tối đa 3 ảnh, video MP4/WebM/MOV hoặc tệp PDF, TXT, CSV.");
            fileInput.value = "";
            return;
          }
          if (files.some((file) => file.size === 0 || file.size > 10 * 1024 * 1024) || totalBytes > 12 * 1024 * 1024) {
            toast("Mỗi tệp phải nhỏ hơn 10 MB và tổng dung lượng tối đa là 12 MB.");
            fileInput.value = "";
            return;
          }
          selectedFiles = files;
          updateAttachmentList();
        });
        const encodeAttachment = (file) => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result !== "string") {
              reject(new Error(`Không đọc được tệp ${file.name}.`));
              return;
            }
            resolve({ name: file.name, mimeType: file.type, data: reader.result.slice(reader.result.indexOf(",") + 1) });
          };
          reader.onerror = () => reject(new Error(`Không đọc được tệp ${file.name}.`));
          reader.readAsDataURL(file);
        });
        if (!["http:", "https:"].includes(location.protocol)) {
          assistantStatus.textContent = assistantIdleStatus;
        } else {
          fetch(apiUrl("/api/health"))
            .then((response) => response.json().then((data) => ({ response, data })))
            .then(({ response, data }) => {
              if (!response.ok) throw new Error("Backend chưa sẵn sàng.");
              assistantReady = Boolean(data.configured);
              assistantIdleStatus = assistantReady ? "AI SẴN SÀNG" : "THIẾU API KEY";
              assistantStatus.textContent = assistantIdleStatus;
            })
            .catch(() => { assistantReady = false; assistantIdleStatus = "AI CHƯA KẾT NỐI"; assistantStatus.textContent = assistantIdleStatus; });
        }
        const sendQuestion = async (value) => {
          const question = String(value || "").trim().slice(0, 2000);
          if (sending || (!question && !selectedFiles.length)) { speakVoiceReply = false; return; }
          sending = true;
          const messages = $("#assistantMessages");
          const attachedNames = selectedFiles.map((file) => file.name);
          appendChatMessage(messages, "user", [question, ...attachedNames.map((name) => `📎 ${name}`)].filter(Boolean).join("\n"));
          const routeSuggestion = answerAssistantQuestion(question);
          const routeAction = routeSuggestion.route !== "faq" || routeSuggestion.label !== "Xem hướng dẫn sử dụng"
            ? { route: routeSuggestion.route, label: routeSuggestion.label }
            : null;
          conversation.push({ role: "user", content: question || "Hãy xem các tệp đính kèm và giúp tôi." });
          assistantStatus.textContent = "AI ĐANG XỬ LÝ";
          sendButton.disabled = true;
          voiceButton.disabled = true;
          let streamingMessage = null;
          try {
            if (!["http:", "https:"].includes(location.protocol)) {
              throw new Error("Trang đang mở bằng file://. Hãy chạy backend rồi truy cập website qua http://127.0.0.1:3000/.");
            }
            const response = await fetch(apiUrl("/api/chat"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: (activeChatController = new AbortController()).signal,
              body: JSON.stringify({
                messages: conversation.slice(-8),
                language: state.language,
                attachments: await Promise.all(selectedFiles.map(encodeAttachment))
              })
            });
            if (!response.ok) {
              let result;
              try {
                result = await response.json();
              } catch {
                throw new Error("Máy chủ trả về dữ liệu không hợp lệ.");
              }
              throw new Error(result.error || `Yêu cầu thất bại (${response.status}).`);
            }
            if (!response.body) throw new Error("Trình duyệt không hỗ trợ nhận câu trả lời trực tiếp.");
            streamingMessage = appendChatMessage(messages, "assistant", "", routeAction);
            const streamedText = document.createTextNode("");
            streamingMessage.insertBefore(streamedText, streamingMessage.firstChild);
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let pending = "";
            let done = false;
            while (!done) {
              const chunk = await reader.read();
              done = chunk.done;
              pending += decoder.decode(chunk.value || new Uint8Array(), { stream: !done });
              let separator = pending.indexOf("\n\n");
              while (separator !== -1) {
                const frame = pending.slice(0, separator);
                pending = pending.slice(separator + 2);
                const data = frame.split("\n").find((line) => line.startsWith("data:"))?.slice(5).trim();
                if (data === "[DONE]") {
                  separator = pending.indexOf("\n\n");
                  continue;
                }
                if (data) {
                  let eventData;
                  try {
                    eventData = JSON.parse(data);
                  } catch {
                    throw new Error("Dữ liệu phản hồi từ AI không hợp lệ.");
                  }
                  if (eventData.error) throw new Error(eventData.error);
                  if (typeof eventData.text === "string") {
                    streamedText.appendData(eventData.text);
                    messages.scrollTop = messages.scrollHeight;
                  }
                }
                separator = pending.indexOf("\n\n");
              }
            }
            const answer = streamedText.data.trim();
            if (!answer) throw new Error("AI chưa trả về câu trả lời.");
            streamingMessage.querySelector("[data-speech-text]")?.setAttribute("data-speech-text", answer);
            assistantReady = true;
            assistantIdleStatus = "AI SẴN SÀNG";
            conversation.push({ role: "assistant", content: answer });
            if (conversation.length > 8) conversation.splice(0, conversation.length - 8);
            assistantStatus.textContent = "AI SẴN SÀNG";
            if (speakVoiceReply || handsFreeMode) {
              speak(answer, () => {
                if (!handsFreeMode || sending) return;
                voiceListening = true;
                assistantStatus.textContent = "ĐANG KẾT NỐI MICRO...";
                startVoiceRecognition();
              });
            }
            form.reset();
            selectedFiles = [];
            updateAttachmentList();
            input.focus();
          } catch (error) {
            assistantReady = false;
            streamingMessage?.remove();
            conversation.pop();
            if (error.name === "AbortError") return;
            const detail = error instanceof TypeError
              ? "Không kết nối được backend. Hãy chạy máy chủ Little Hero và mở trang qua địa chỉ localhost."
              : error.message;
            assistantIdleStatus = "HỖ TRỢ CƠ BẢN";
            assistantStatus.textContent = assistantIdleStatus;
            const fallback = answerAssistantQuestion(question);
            const fallbackText = `AI trực tuyến chưa khả dụng (${detail}). Hero vẫn có thể hướng dẫn cơ bản: ${fallback.text}`;
            appendChatMessage(messages, "assistant", fallbackText, fallback.route === "faq" && fallback.label === "Xem hướng dẫn sử dụng" ? null : fallback);
            if (speakVoiceReply || handsFreeMode) {
              speak(fallbackText, () => {
                if (!handsFreeMode || sending) return;
                voiceListening = true;
                assistantStatus.textContent = "ĐANG KẾT NỐI MICRO...";
                startVoiceRecognition();
              });
            }
            form.reset();
            input.focus();
          } finally {
            activeChatController = null;
            speakVoiceReply = false;
            sending = false;
            sendButton.disabled = false;
            voiceButton.disabled = false;
          }
        };
        const resetVoiceButton = () => {
          voiceButton.setAttribute("aria-pressed", "false");
          voiceButton.setAttribute("aria-label", "Hỏi Hero bằng giọng nói");
          voiceButton.title = "Bật micro, nói câu hỏi rồi nhấn lần nữa để gửi";
          voiceButton.textContent = "🎙️";
          if (assistantStatus.textContent === "ĐANG NGHE..." || assistantStatus.textContent === "ĐANG CHỜ GIỌNG NÓI...") {
            assistantStatus.textContent = assistantIdleStatus;
          }
        };
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const setHandsFreeMode = (enabled) => {
          handsFreeMode = enabled;
          voiceModeButton.setAttribute("aria-pressed", String(enabled));
          voiceModeButton.textContent = enabled ? "🎧 Đang trò chuyện" : "🎧 Hội thoại rảnh tay";
          voiceModeButton.title = enabled
            ? "Tắt hội thoại rảnh tay"
            : "Hero sẽ tự nghe lại sau khi đọc xong câu trả lời";
        };
        const startVoiceRecognition = () => {
          if (!voiceListening || !Recognition) return;
          recognition = new Recognition();
          const activeRecognition = recognition;
          activeRecognition.lang = state.language === "en" ? "en-US" : "vi-VN";
          activeRecognition.continuous = true;
          activeRecognition.interimResults = true;
          activeRecognition.onstart = () => {
            assistantStatus.textContent = "ĐANG NGHE...";
            voiceButton.setAttribute("aria-pressed", "true");
            voiceButton.setAttribute("aria-label", "Dừng nghe");
            voiceButton.title = "Đang nghe — nhấn để gửi câu hỏi";
            voiceButton.textContent = "⏹️";
          };
          activeRecognition.onresult = (event) => {
            let interim = "";
            for (let index = event.resultIndex; index < event.results.length; index += 1) {
              const transcript = event.results[index][0]?.transcript?.trim();
              if (!transcript) continue;
              if (event.results[index].isFinal) voiceTranscript = `${voiceTranscript} ${transcript}`.trim();
              else interim = `${interim} ${transcript}`.trim();
            }
            input.value = [voiceTranscript, interim].filter(Boolean).join(" ");
            if (voiceTranscript) assistantStatus.textContent = "ĐANG NHẬN DIỆN...";
            if (handsFreeMode && voiceTranscript) {
              window.clearTimeout(voiceSilenceTimer);
              voiceSilenceTimer = window.setTimeout(() => {
                if (!handsFreeMode || !voiceListening || sending) return;
                voiceListening = false;
                window.clearTimeout(voiceRestartTimer);
                if (recognition) recognition.stop();
                else {
                  input.value = voiceTranscript;
                  speakVoiceReply = true;
                  form.requestSubmit();
                  voiceTranscript = "";
                }
              }, 1200);
            }
          };
          activeRecognition.onerror = (event) => {
            if (event.error === "no-speech" || event.error === "aborted") return;
            voiceListening = false;
            window.clearTimeout(voiceSilenceTimer);
            if (event.error === "not-allowed" || event.error === "service-not-allowed") {
              toast("Micro chưa được cấp quyền. Hãy cho phép truy cập micro trong trình duyệt rồi thử lại.");
            } else if (event.error === "network") {
              toast("Dịch vụ nhận diện giọng nói không kết nối được. Kiểm tra Internet hoặc nhập câu hỏi bằng bàn phím.");
            } else {
              toast("Không nhận diện được giọng nói. Bạn có thể thử lại hoặc nhập câu hỏi.");
            }
            if (handsFreeMode && (event.error === "not-allowed" || event.error === "service-not-allowed")) {
              setHandsFreeMode(false);
            }
          };
          activeRecognition.onend = () => {
            if (recognition === activeRecognition) recognition = null;
            if (voiceListening) {
              assistantStatus.textContent = "ĐANG CHỜ GIỌNG NÓI...";
              voiceRestartTimer = window.setTimeout(startVoiceRecognition, 250);
              return;
            }
            if (voiceTranscript) {
              input.value = voiceTranscript;
              speakVoiceReply = true;
              form.requestSubmit();
              voiceTranscript = "";
              return;
            }
            resetVoiceButton();
            if (!input.value.trim()) toast("Chưa nhận diện được giọng nói. Hãy thử nói lại hoặc nhập câu hỏi.");
          };
          try {
            activeRecognition.start();
          } catch {
            recognition = null;
            voiceListening = false;
            resetVoiceButton();
            toast("Không thể bật micro. Hãy kiểm tra quyền micro và thử lại.");
          }
        };
        voiceModeButton.addEventListener("click", () => {
          if (!Recognition) {
            toast("Trình duyệt này chưa hỗ trợ nhận diện giọng nói. Hãy dùng Chrome hoặc Edge.");
            return;
          }
          if (!window.isSecureContext) {
            toast("Hãy mở Little Hero bằng HTTPS hoặc localhost để cấp quyền micro.");
            return;
          }
          if (handsFreeMode) {
            setHandsFreeMode(false);
            voiceListening = false;
            voiceTranscript = "";
            window.clearTimeout(voiceRestartTimer);
            window.clearTimeout(voiceSilenceTimer);
            recognition?.stop();
            if ("speechSynthesis" in window) window.speechSynthesis.cancel();
            resetVoiceButton();
            return;
          }
          setHandsFreeMode(true);
          voiceTranscript = "";
          voiceListening = true;
          assistantStatus.textContent = "ĐANG KẾT NỐI MICRO...";
          startVoiceRecognition();
        });
        voiceButton.addEventListener("click", () => {
          if (!Recognition) {
            toast("Trình duyệt chưa hỗ trợ nhận diện giọng nói. Hãy dùng Chrome hoặc Edge, hoặc nhập câu hỏi bằng bàn phím.");
            return;
          }
          if (!window.isSecureContext) {
            toast("Hãy mở Little Hero bằng HTTPS hoặc localhost để cấp quyền micro.");
            return;
          }
          if (voiceListening) {
            voiceListening = false;
            window.clearTimeout(voiceRestartTimer);
            window.clearTimeout(voiceSilenceTimer);
            if (recognition) recognition.stop();
            else if (voiceTranscript) {
              input.value = voiceTranscript;
              speakVoiceReply = true;
              form.requestSubmit();
              voiceTranscript = "";
            } else resetVoiceButton();
            return;
          }
          voiceTranscript = "";
          voiceListening = true;
          input.value = "";
          assistantStatus.textContent = "ĐANG KẾT NỐI MICRO...";
          startVoiceRecognition();
        });
        $("#assistantMessages").addEventListener("click", (event) => {
          const button = event.target.closest("[data-speech-text]");
          if (button) speak(button.dataset.speechText);
        });
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          sendQuestion(input.value);
        });
        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            form.requestSubmit();
          }
        });
        $("#routeView").querySelectorAll("[data-assistant-prompt]").forEach((button) => {
          button.addEventListener("click", () => sendQuestion(button.dataset.assistantPrompt));
        });
        cleanupTutorSession = () => {
          setHandsFreeMode(false);
          voiceListening = false;
          voiceTranscript = "";
          speakVoiceReply = false;
          window.clearTimeout(voiceRestartTimer);
          window.clearTimeout(voiceSilenceTimer);
          recognition?.stop();
          activeChatController?.abort();
          if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        };
        input.focus();
      };

      const renderRoute = () => {
        const [name, param] = route.split("/");
        const routes = {
          map: () => {
            $("#routeView").innerHTML = pageShell("map", "Khám phá 8 ốc đảo kỹ năng; chọn một hòn đảo để mở bài học. Rê chuột hoặc dùng phím Tab để xem nội dung điểm dừng.", `<div class="map-guide"><div><strong>✨ Chọn một ốc đảo để bắt đầu</strong><p>Di chuột, chạm hoặc dùng phím Tab để hiện tên chủ đề và bài học, rồi chọn đảo để bắt đầu.</p></div></div><div class="journey-map detailed" id="mapPageIslands" aria-label="Bản đồ chi tiết gồm 8 ốc đảo và các bài học"></div>`, "HERO WORLD");
            renderJourneyMap($("#mapPageIslands"), true);
          },
          lessons: renderLessonCatalog,
          stories: renderStoriesPage,
          storybook: () => renderStoriesPage("storybook"),
          games: () => {
            if (!hasVerifiedPremium()) {
              renderLockedPlanPage("Trò chơi thuộc thư viện Premium", "Thanh toán cần được xác minh trước khi mở các trò chơi Premium.");
              return;
            }
            renderGamesPage();
          },
          quests: renderQuestPage,
          quiz: renderQuizPage,
          achievements: renderAchievementsPage,
          reviews: renderReviewsPage,
          forum: renderForumPage,
          faq: renderFaqPage,
          language: renderLanguagePage,
          auth: renderAuthPage,
          pricing: () => {
            const planRows = Object.entries(subscriptionPlans).map(([id, plan]) => `
              <article class="subscription-row ${id === "yearly" ? "is-yearly" : "is-monthly"}">
                <div class="subscription-art"><img src="${plan.image}" alt="${escapeHtml(plan.imageAlt)}" loading="lazy"><span class="course-art-badge">${escapeHtml(plan.badge)}</span></div>
                <div class="subscription-copy"><span class="course-plan-kicker">${escapeHtml(plan.caption)}</span><h3>${escapeHtml(plan.title)}</h3><ul class="features">${plan.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul></div>
                <div class="subscription-action"><strong>${plan.price.toLocaleString("vi-VN")}đ <span>/${id === "yearly" ? "năm" : "tháng"}</span></strong><button class="btn btn-primary btn-small" data-route="payment/${id}">Chọn hành trình</button></div>
              </article>`).join("");
            $("#routeView").innerHTML = pageShell("pricing", "Chọn thời hạn phù hợp. Quyền lợi chỉ được mở sau khi giao dịch được máy chủ xác minh.", `
              <div class="subscription-list">${planRows}</div>
              <div class="free-plan-note"><span>8 bài học nền tảng luôn miễn phí.</span><button class="text-link" id="freePlanBtn">Khám phá nội dung miễn phí →</button></div>`, "GÓI HỌC");
            $("#freePlanBtn").addEventListener("click", () => setRoute("lessons"));
          },
          payment: () => renderPaymentPage(param),
          "premium-success": renderPremiumSuccessPage,
          arena: renderArenaPage,
          "arena-match": renderArenaMatchPage,
          tutor: renderTutorPage,
          parents: () => {
            if (!state.authenticated) {
              $("#routeView").innerHTML = pageShell("parents", "Xem trước các công cụ đồng hành cùng gia đình. Dữ liệu hồ sơ và tiến độ chỉ hiển thị sau khi đăng nhập và xác nhận phụ huynh.", `
                <div class="parent-preview-grid">
                  <article class="settings-card"><span class="catalog-icon">📈</span><h2>Theo dõi tiến độ</h2><p>Xem bài học đã hoàn thành, thời gian học và các kỹ năng bé đang khám phá.</p></article>
                  <article class="settings-card"><span class="catalog-icon">👧</span><h2>Quản lý hồ sơ</h2><p>Tạo hồ sơ riêng cho từng bé và chuyển đổi giữa các hành trình học tập.</p></article>
                  <article class="settings-card"><span class="catalog-icon">🛡️</span><h2>Đồng hành an toàn</h2><p>Tham khảo cài đặt thời gian, nội dung và hoạt động thực hành tại nhà.</p></article>
                </div>
                <div class="page-actions"><a class="btn btn-primary" href="#/auth" data-route="auth" data-preview-login>Đăng nhập để tiếp tục</a></div>
              `, "GIA ĐÌNH");
              return;
            }
            requestParentAccess(() => {
              if (!hasYearlyPremium()) {
                renderLockedPlanPage("Báo cáo phụ huynh thuộc gói năm", "Báo cáo tiến độ chi tiết chỉ mở sau khi gói năm được thanh toán và xác minh.");
                return;
              }
              renderParentRoute();
            });
          },
          "parent-news": renderParentNews,
          lesson: () => renderLessonRoute(param)
        };
        if (routes[name]) { routes[name](); return; }
        if (name === "home") { setRoute("home", { pop: true, restore: true }); return; }
        $("#routeView").innerHTML = pageShell("faq", "Trang này chưa có nội dung.", routeLink("home", "Về trang chủ"));
      };

      const renderUsageChart = () => {
        const days = Array.from({ length: 7 }, (_, index) => {
          const day = new Date();
          day.setDate(day.getDate() - (6 - index));
          return day.toLocaleDateString("sv-SE");
        });
        const usage = days.map((day) => Math.round((Number(state.dailyUsage[day]) || 0) / 60));
        const study = days.map((day) => Math.round((Number(state.dailyStudy[day]) || 0) / 60));
        const max = Math.max(30, ...usage);
        const bars = days.map((day, index) => {
          const x = 74 + index * 86;
          const usageHeight = usage[index] / max * 112;
          const studyHeight = study[index] / max * 112;
          const label = new Date(`${day}T00:00:00`).toLocaleDateString("vi-VN", { weekday: "short" });
          return `<rect x="${x}" y="${174 - usageHeight}" width="24" height="${usageHeight}" rx="6" fill="#9bdcc1"/>
            <rect x="${x + 28}" y="${174 - studyHeight}" width="24" height="${studyHeight}" rx="6" fill="#ffbd75"/>
            <text x="${x + 25}" y="196" text-anchor="middle">${escapeHtml(label)}</text>`;
        }).join("");
        return `<svg class="parent-chart" viewBox="0 0 680 215" role="img" aria-label="Biểu đồ thời gian sử dụng ứng dụng và thời gian ở bài học trong 7 ngày">
          <line x1="58" y1="174" x2="660" y2="174" stroke="#dfe9e3"/><line x1="58" y1="62" x2="660" y2="62" stroke="#edf2ee"/>
          <text x="8" y="67">${max}p</text><text x="20" y="178">0p</text>${bars}</svg>`;
      };
      const renderScoreChart = () => {
        const days = Array.from({ length: 7 }, (_, index) => {
          const day = new Date();
          day.setDate(day.getDate() - (6 - index));
          return day.toLocaleDateString("sv-SE");
        });
        const points = days.map((day, index) => {
          const attempts = state.learningHistory.filter((entry) => entry.at.slice(0, 10) === day);
          const score = attempts.length ? Math.round(attempts.filter((entry) => entry.correct).length / attempts.length * 100) : null;
          return { x: 70 + index * 90, y: score === null ? null : 172 - score * 1.25, score, day };
        });
        const line = points.filter((point) => point.y !== null).map((point) => `${point.x},${point.y}`).join(" ");
        const dots = points.filter((point) => point.y !== null).map((point) => `<circle cx="${point.x}" cy="${point.y}" r="5" fill="#fff" stroke="#568fc7" stroke-width="3"><title>${point.score}% lựa chọn đúng</title></circle>`).join("");
        const labels = points.map((point) => `<text x="${point.x}" y="198" text-anchor="middle">${escapeHtml(new Date(`${point.day}T00:00:00`).toLocaleDateString("vi-VN", { weekday: "short" }))}</text>`).join("");
        return `<svg class="parent-chart" viewBox="0 0 680 215" role="img" aria-label="Tỷ lệ lựa chọn phù hợp theo ngày, dựa trên lượt thực hành">
          <line x1="56" y1="172" x2="660" y2="172" stroke="#dfe9e3"/><line x1="56" y1="109" x2="660" y2="109" stroke="#edf2ee"/><line x1="56" y1="47" x2="660" y2="47" stroke="#edf2ee"/>
          <text x="16" y="52">100%</text><text x="31" y="113">50%</text><text x="39" y="176">0%</text>
          ${line ? `<polyline points="${line}" fill="none" stroke="#568fc7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${dots}` : `<text x="340" y="104" text-anchor="middle">Chưa có lượt thực hành trong 7 ngày</text>`}${labels}</svg>`;
      };
      const renderSkillRadar = () => {
        const groups = [
          ["Quản lý cảm xúc", ["emotion"]],
          ["Giao tiếp", ["social"]],
          ["An toàn trên mạng", ["community", "safety"]],
          ["Giải quyết xung đột", ["thinking", "social"]],
          ["Tự lập", ["health", "care"]]
        ];
        const center = 120;
        const angles = groups.map((_, index) => -Math.PI / 2 + index * Math.PI * 2 / groups.length);
        const scores = groups.map(([, categoriesForSkill]) => {
          const attempts = state.learningHistory.filter((entry) => {
            const category = lessonById(entry.lessonId)?.category;
            return categoriesForSkill.includes(category);
          });
          return attempts.length ? Math.round(attempts.filter((entry) => entry.correct).length / attempts.length * 100) : 0;
        });
        const polygon = (scale) => angles.map((angle, index) => `${center + Math.cos(angle) * 78 * scale * scores[index] / 100},${center + Math.sin(angle) * 78 * scale * scores[index] / 100}`).join(" ");
        const axes = angles.map((angle, index) => {
          const x = center + Math.cos(angle) * 78;
          const y = center + Math.sin(angle) * 78;
          const labelX = center + Math.cos(angle) * 103;
          const labelY = center + Math.sin(angle) * 103;
          const align = labelX < center - 8 ? "end" : labelX > center + 8 ? "start" : "middle";
          return `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="#dcebe2"/><text x="${labelX}" y="${labelY}" text-anchor="${align}">${escapeHtml(groups[index][0])}</text>`;
        }).join("");
        const rings = [0.33, 0.66, 1].map((scale) => `<polygon points="${angles.map((angle) => `${center + Math.cos(angle) * 78 * scale},${center + Math.sin(angle) * 78 * scale}`).join(" ")}" fill="none" stroke="#e4eee7"/>`).join("");
        return { svg: `<svg class="parent-chart" viewBox="0 0 240 240" role="img" aria-label="Biểu đồ radar tỷ lệ lựa chọn phù hợp theo nhóm kỹ năng">${rings}${axes}<polygon points="${polygon(1)}" fill="#72c6a84d" stroke="#43a981" stroke-width="3"/></svg>`,
          list: groups.map(([name], index) => `<div class="skill-row"><span>${escapeHtml(name)}</span><span>${scores[index]}%</span><progress max="100" value="${scores[index]}" aria-label="${escapeHtml(name)}"></progress></div>`).join("") };
      };
      const renderParentRoute = () => {
        const child = state.children.find((entry) => entry.id === state.activeChildId);
        const attempts = state.learningHistory;
        const recentAttempts = [...attempts].slice(-8).reverse();
        const lessonTotals = new Map();
        attempts.forEach((entry) => lessonTotals.set(entry.lessonId, (lessonTotals.get(entry.lessonId) || 0) + 1));
        const availableLessonIds = new Set(ageAppropriateLessons().map((lesson) => lesson.id));
        const favoriteLessons = [...lessonTotals.entries()]
          .filter(([id]) => availableLessonIds.has(id))
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);
        const radar = renderSkillRadar();
        const minutesToday = Math.floor(state.sessionSeconds / 60);
        const dailyLimit = Math.max(15, Number(state.parentControls.dailyLimit) || 60);
        const recentMisses = attempts.slice(-6).filter((entry) => !entry.correct);
        const repeatedDifficulty = recentMisses.length >= 2 && recentMisses.every((entry) => lessonById(entry.lessonId)?.category === lessonById(recentMisses[0].lessonId)?.category);
        const latestAttempt = recentAttempts[0];
        const coachPrompt = latestAttempt
          ? latestAttempt.correct ? "Con đã nhận ra điều gì giúp nhân vật xử lý tình huống an toàn?" : "Lúc đó con đang nghĩ gì, và con muốn thử cách nào khác?"
          : "Hôm nay có điều gì khiến con vui hoặc băn khoăn không?";
        const recommendations = favoriteLessons.length
          ? favoriteLessons.map(([id, count]) => `<div class="learning-log"><article><span>${escapeHtml(lessonById(id)?.title || "Bài học")}<small>Bé đã thực hành ${count} lượt</small></span><span>🌟</span></article></div>`).join("")
          : `<p class="note">Khi có dữ liệu thực hành, các bài bé đã tham gia nhiều sẽ xuất hiện tại đây.</p>`;
        const history = recentAttempts.length
          ? recentAttempts.map((entry) => {
            const lesson = lessonById(entry.lessonId);
            const answer = lesson?.answers[entry.choice] || "Lựa chọn";
            const date = new Date(entry.at).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
            return `<article><span>${escapeHtml(lesson?.title || "Bài học")}<small>${escapeHtml(answer)} · ${escapeHtml(date)}</small></span><span aria-label="${entry.correct ? "Lựa chọn phù hợp" : "Lần thử cần luyện tập"}">${entry.correct ? "✅" : "🌱"}</span></article>`;
          }).join("")
          : `<p class="note">Nhật ký sẽ ghi lại lựa chọn của bé khi bé thực hành tình huống.</p>`;
        $("#routeView").innerHTML = pageShell("parents", "Theo dõi hồ sơ, tiến độ và hoạt động học tập của từng bé. Dữ liệu được lưu trên thiết bị này.", `
          <div class="parent-dashboard">
            <div class="parent-profile-bar">
              <label for="parentProfileSelect">👨‍👩‍👧 Hồ sơ đang xem
                <select id="parentProfileSelect">${state.children.map((profile) => `<option value="${escapeHtml(profile.id)}" ${profile.id === state.activeChildId ? "selected" : ""}>${escapeHtml(profile.name || "Bé")} · ${Number(profile.age) || 6} tuổi</option>`).join("")}</select>
              </label>
              <span class="stat-pill">Dữ liệu trên thiết bị · riêng tư</span><div class="parent-hero" id="parentHero" aria-hidden="true"></div>
            </div>
            <div class="parent-grid">
              <section class="parent-panel">
                <h2>👧 Hồ sơ của con</h2><p>Tạo nhiều hồ sơ và chuyển đổi để xem tiến trình riêng của mỗi trẻ.</p>
                <form class="profile-add" id="profileDetailsForm">
                  <input name="name" maxlength="40" required aria-label="Tên hoặc biệt danh" value="${escapeHtml(child?.name || state.childName || "Bé")}" placeholder="Tên hoặc biệt danh">
                  <input name="age" type="number" min="3" max="10" required aria-label="Độ tuổi" value="${Number(child?.age) || 6}" placeholder="Tuổi">
                  <button class="btn btn-light btn-small">Cập nhật hồ sơ</button>
                </form>
                <form class="profile-add" id="profileAddForm">
                  <input name="name" maxlength="40" required aria-label="Tên hồ sơ mới" placeholder="Tên/biệt danh của bé mới">
                  <input name="age" type="number" min="3" max="10" required aria-label="Độ tuổi hồ sơ mới" placeholder="Tuổi">
                  <button class="btn btn-mint btn-small">＋ Thêm hồ sơ</button>
                </form>
              </section>
              <section class="parent-panel">
                <h2>📈 Tổng quan tiến độ</h2><p>Chỉ số tổng hợp từ dữ liệu thực hành của ${escapeHtml(child?.name || state.childName || "bé")}.</p>
                <div class="parent-stats"><div><strong>${completedCount()}</strong><span>Bài hoàn thành</span></div><div><strong>${attempts.length}</strong><span>Lượt thực hành</span></div><div><strong>${state.xp}</strong><span>Sao tích lũy</span></div></div>
                <p class="note" style="margin:12px 0 0">Chuỗi ngày học: ${streak()} ngày · Hôm nay: ${minutesToday} phút dùng app.</p>
              </section>
            </div>
            <div class="parent-grid">
              <section class="parent-panel"><h2>⏱ Thời gian sử dụng & học</h2><p>7 ngày gần nhất · xanh là thời gian app mở, cam là thời gian ở trang bài học.</p>
                <div style="display:flex;gap:16px;font-size:11px"><span>🟩 Sử dụng ứng dụng</span><span>🟧 Ở trang bài học</span></div>${renderUsageChart()}
                <div class="parent-notice">Thời gian được tính khi trang đang hiển thị; đây là thống kê cục bộ, không phải bộ hẹn giờ/ngăn truy cập chính xác.</div>
              </section>
              <section class="parent-panel"><h2>🎯 Kết quả theo thời gian</h2><p>Tỷ lệ lựa chọn đúng trong các lượt bé đã thực hành mỗi ngày.</p>${renderScoreChart()}
                <div class="parent-notice">Chỉ số phản ánh các lựa chọn trong bài học, không phải điểm số hay chẩn đoán năng lực của trẻ.</div>
              </section>
            </div>
            <div class="parent-grid">
              <section class="parent-panel"><h2>🕸 Chỉ số nhóm kỹ năng</h2><p>Radar dựa trên tỷ lệ lựa chọn phù hợp ở các tình huống đã làm.</p>
                <div class="parent-radar">${radar.svg}<div class="skill-list">${radar.list}</div></div>
                <div class="parent-notice">Các nhóm kỹ năng là gợi ý tham khảo, không thay thế đánh giá chuyên môn.</div>
              </section>
              <section class="parent-panel"><h2>💛 Bài học bé quan tâm</h2><p>Sắp xếp theo số lượt bé đã chọn thực hành, không suy diễn cảm xúc/thích thú.</p>${recommendations}
                <div class="page-actions">${routeLink("lessons", "Khám phá bài học", "📚")}${routeLink("parent-news", "Cẩm nang gia đình", "📰")}</div>
              </section>
            </div>
            <section class="parent-panel"><h2>🌱 Gợi ý bước tiếp theo</h2>
              <p>${repeatedDifficulty ? "Các lượt gần đây có nhiều lựa chọn chưa phù hợp trong cùng một chủ đề. Ba mẹ có thể cùng con thực hành lại khi con sẵn sàng." : "Chọn một nội dung vừa sức, khuyến khích con tự suy nghĩ và trao đổi sau bài học."}</p>
              ${repeatedDifficulty ? `<div class="parent-notice">Lưu ý để ba mẹ quan tâm: ${escapeHtml(lessonById(recentMisses[0].lessonId)?.title || "một chủ đề")} có từ hai lượt chọn cần luyện tập trong sáu lượt gần đây. Đây chỉ là gợi ý đồng hành, không phải đánh giá chuyên môn.</div>` : ""}
              <div class="page-actions">${routeLink(`lesson/${ageAppropriateLessons().find((lesson) => !state.completed.includes(lesson.id))?.id || ageAppropriateLessons()[0].id}`, "Mở bài học gợi ý", "▶")}${routeLink("parent-news", "Xem gợi ý trò chuyện", "💬")}</div>
              <p class="note">Gợi ý được suy ra từ nhật ký cục bộ; chưa có AI Tutor, cá nhân hóa máy chủ hoặc cảnh báo đẩy.</p>
            </section>
            <div class="parent-grid">
              <section class="parent-panel"><h2>📔 Nhật ký lựa chọn</h2><p>Xem các tình huống bé đã thực hành gần đây.</p><div class="learning-log">${history}</div></section>
              <section class="parent-panel"><h2>💬 Gợi ý trò chuyện cùng con</h2><p>Câu hỏi gợi mở để lắng nghe, không phán xét hay áp đặt.</p>
                <div class="story-box">“${escapeHtml(coachPrompt)}”</div>
                <div class="thinking-prompts"><div>“Con muốn ba/mẹ lắng nghe hay cùng con nghĩ cách giải quyết?”</div><div>“Nếu thử lại, con muốn chọn điều gì khác?”</div><div>“Con cần người lớn giúp gì để cảm thấy an toàn?”</div></div>
                <p class="note">Đây là câu hỏi mẫu tĩnh, chưa phải nhận xét hoặc tư vấn được AI tạo ra.</p>
              </section>
            </div>
            <div class="parent-grid">
              <section class="parent-panel"><h2>🏡 Đồng hành thực hành tại nhà</h2><p>Chọn hoạt động vừa sức, thực hiện cùng người lớn và khuyến khích con tự suy nghĩ.</p>
                <div class="learning-log">${challengeSpecs.map((item) => `<article><span>${item.icon} ${escapeHtml(item.title)}<small>${state.challenges.includes(item.id) ? "Đã xác nhận trên thiết bị" : "Chưa ghi nhận hoàn thành"}</small></span><span>${state.challenges.includes(item.id) ? "✓" : "🌱"}</span></article>`).join("")}</div>
                <div class="page-actions">${routeLink("faq", "Cẩm nang & hướng dẫn", "📖")}${routeLink("parent-news", "Bài viết cho ba mẹ", "📰")}</div>
              </section>
              <section class="parent-panel"><h2>🛡 Thời gian & an toàn</h2><p>Tùy chọn lưu cục bộ để phụ huynh tham khảo; hiện chưa khóa nội dung hoặc chặn giao dịch thật.</p>
                <div class="parent-settings">
                  <label for="parentDailyLimit">Mục tiêu thời gian app mỗi ngày
                    <select id="parentDailyLimit"><option value="15" ${dailyLimit === 15 ? "selected" : ""}>15 phút</option><option value="30" ${dailyLimit === 30 ? "selected" : ""}>30 phút</option><option value="60" ${dailyLimit === 60 ? "selected" : ""}>60 phút</option><option value="90" ${dailyLimit === 90 ? "selected" : ""}>90 phút</option></select>
                  </label>
                  <label for="parentBlockPurchases">Yêu cầu ba mẹ kiểm soát mua hàng <input id="parentBlockPurchases" type="checkbox" ${state.parentControls.blockPurchases ? "checked" : ""}></label>
                  <label for="parentSafeContent">Ưu tiên nội dung phù hợp độ tuổi <input id="parentSafeContent" type="checkbox" ${state.parentControls.safeContent ? "checked" : ""}></label>
                  <label for="parentNotifyLearning">Nhắc nhở nội dung học tập <input id="parentNotifyLearning" type="checkbox" ${state.parentControls.notifyLearning ? "checked" : ""}></label>
                  <label for="parentNotifyPractice">Nhắc nhiệm vụ thực hành tại nhà <input id="parentNotifyPractice" type="checkbox" ${state.parentControls.notifyPractice ? "checked" : ""}></label>
                </div>
                <p class="note">Đã dùng ${minutesToday}/${dailyLimit} phút mục tiêu hôm nay. Thiết lập chỉ lưu làm lựa chọn; chưa có cơ chế giới hạn/đẩy thông báo.</p>
                ${minutesToday >= dailyLimit ? `<div class="parent-notice">Đã chạm mục tiêu thời gian ba mẹ chọn hôm nay. Hãy cùng bé nghỉ mắt/đổi hoạt động; website chưa tự khóa ứng dụng.</div>` : ""}
              </section>
            </div>
            <section class="parent-panel"><h2>🛍 Dịch vụ & trợ giúp</h2><p>Khám phá các mục LITTLE HERO dành cho gia đình.</p>
              <div class="page-actions">${routeLink("pricing", "Gói dịch vụ", "♛")}${routeLink("payment", "Thông tin thanh toán", "💳")}${routeLink("reviews", "Gửi góp ý/đánh giá", "✍")}${routeLink("faq", "Hỗ trợ & quyền riêng tư", "🔒")}${routeLink("parent-news", "Tin tức & thương hiệu", "📰")}</div>
            </section>
          </div>`, "GIA ĐÌNH");
        $("#parentHero").innerHTML = renderHeroCharacterSvg(state.closet, { ariaLabel: "Hero đồng hành cùng gia đình" });
        $("#parentHero").dataset.wardrobe = JSON.stringify(safeWardrobe(state.closet));
        $("#parentProfileSelect").addEventListener("change", (event) => {
          const current = state.children.find((entry) => entry.id === state.activeChildId);
          if (current) childProgressFields.forEach((key) => { current[key] = state[key]; });
          const next = state.children.find((entry) => entry.id === event.currentTarget.value);
          if (!next) { toast("Không tìm thấy hồ sơ trẻ."); return; }
          state.activeChildId = next.id;
          childProgressFields.forEach((key) => { state[key] = next[key] ?? freshState()[key]; });
          state.childName = next.name || state.childName;
          persist();
          renderDropdown();
          renderIslands();
          renderFeatured();
          renderStories();
          renderParentRoute();
          showOnboardingIfNeeded();
        });
        $("#profileDetailsForm").addEventListener("submit", (event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const name = String(data.get("name") || "").trim().slice(0, 40);
          const age = Number(data.get("age"));
          if (!name || !Number.isInteger(age) || age < 3 || age > 10) { toast("Hãy nhập tên và độ tuổi từ 3 đến 10."); return; }
          child.name = name;
          child.age = age;
          state.age = age;
          state.ageGroup = age <= 6 ? "3-6" : "7-10";
          state.childName = name;
          persist();
          renderDropdown();
          renderIslands();
          renderFeatured();
          renderStories();
          renderParentRoute();
          toast("Đã cập nhật hồ sơ trên thiết bị này.");
        });
        $("#profileAddForm").addEventListener("submit", (event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const name = String(data.get("name") || "").trim().slice(0, 40);
          const age = Number(data.get("age"));
          if (!name || !Number.isInteger(age) || age < 3 || age > 10) { toast("Hãy nhập biệt danh và độ tuổi từ 3 đến 10."); return; }
          const defaults = freshState();
          const profile = { id: `child-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name, age };
          childProgressFields.forEach((key) => {
            const value = defaults[key];
            profile[key] = Array.isArray(value) ? [...value] : value && typeof value === "object" ? { ...value } : value;
          });
          profile.childName = name;
          profile.age = age;
          profile.ageGroup = age <= 6 ? "3-6" : "7-10";
          profile.interests = [];
          profile.onboardingComplete = false;
          state.children.push(profile);
          state.activeChildId = profile.id;
          childProgressFields.forEach((key) => { state[key] = profile[key]; });
          persist();
          renderDropdown();
          renderIslands();
          renderFeatured();
          renderStories();
          renderParentRoute();
          showOnboardingIfNeeded();
          toast("Đã tạo hồ sơ mới.");
        });
        $("#parentDailyLimit").addEventListener("change", (event) => { state.parentControls.dailyLimit = Number(event.currentTarget.value); persist(); renderParentRoute(); });
        [["parentBlockPurchases", "blockPurchases"], ["parentSafeContent", "safeContent"], ["parentNotifyLearning", "notifyLearning"], ["parentNotifyPractice", "notifyPractice"]].forEach(([id, key]) => {
          $(`#${id}`).addEventListener("change", (event) => { state.parentControls[key] = event.currentTarget.checked; persist(); });
        });
      };
      const renderParentNews = () => {
        const articles = [
          { id: "brand-story", kind: "Thương hiệu", group: "brand", icon: "🦸‍♀️", art: "#d5efe1", featured: true, title: "Không chỉ xem cho vui: Bé học kỹ năng sống cùng LITTLE HERO như thế nào?", excerpt: "Khám phá cách những câu chuyện tương tác biến tình huống đời thường thành cơ hội để trẻ quan sát, suy nghĩ và trò chuyện cùng gia đình.", body: ["Một tình huống gần gũi thường mở ra cuộc trò chuyện tự nhiên hơn một lời nhắc dài. Trong LITTLE HERO, trẻ theo dõi câu chuyện, thử chọn cách xử lý và quan sát diễn biến tiếp theo trong môi trường luyện tập.", "Ứng dụng hướng tới việc khuyến khích trẻ tự suy nghĩ, gọi tên cảm xúc và tìm người lớn đáng tin cậy khi cần. Bài học không thay thế sự đồng hành của gia đình hay tư vấn chuyên môn.", "Ba mẹ có thể cùng con đọc, hỏi con vì sao nhân vật chọn cách đó, rồi liên hệ nhẹ nhàng với một việc nhỏ trong ngày."] },
          { id: "skill-future", kind: "Tin tức", group: "family", icon: "🧩", art: "#f8e3c8", featured: true, title: "Dạy con kỹ năng sống từ đâu? Bắt đầu với 5 kỹ năng quan trọng này", excerpt: "Ở tuổi 3–5, những thói quen nhỏ về cảm xúc, giao tiếp và tự lập có thể bắt đầu ngay trong sinh hoạt hằng ngày.", body: ["Kỹ năng sống không nhất thiết bắt đầu từ một bài học lớn. Trẻ có thể luyện gọi tên cảm xúc, chờ đến lượt, nói lời nhờ giúp đỡ, giữ an toàn và tự làm việc phù hợp với lứa tuổi.", "Hãy chọn một kỹ năng mỗi lần, làm mẫu bằng lời nói và hành động, sau đó để trẻ thực hành trong tình huống quen thuộc. Ghi nhận nỗ lực thay vì đòi hỏi trẻ luôn làm đúng ngay.", "Nếu trẻ chưa sẵn sàng, ba mẹ có thể quay lại vào thời điểm khác. Nhịp phát triển của mỗi trẻ khác nhau."] },
          { id: "skill-thinking", kind: "Phát triển tư duy", group: "family", icon: "🧠", art: "#fde2e8", title: "Giúp trẻ tập suy nghĩ và giải quyết vấn đề qua việc nhỏ", excerpt: "Câu hỏi gợi mở và những lựa chọn vừa sức giúp trẻ tập dừng lại, suy nghĩ và thử cách xử lý an toàn.", body: ["Khi gặp một việc khó, ba mẹ có thể cùng trẻ gọi tên vấn đề rồi hỏi: “Con nghĩ mình có thể thử cách nào?”. Hãy cho trẻ thời gian suy nghĩ thay vì vội đưa ra đáp án.", "Bắt đầu từ việc nhỏ, quen thuộc và phù hợp với độ tuổi. Người lớn ở gần để hỗ trợ, đặc biệt khi tình huống có yếu tố nguy hiểm.", "Khen sự cố gắng và cách trẻ suy nghĩ; kết quả chưa như ý là cơ hội để cùng thử một phương án khác."] },
          { id: "skill-confidence", kind: "Tự tin & tự lập", group: "family", icon: "❤️", art: "#fff0d2", title: "Nuôi dưỡng sự tự tin và tính tự lập theo từng bước", excerpt: "Việc để trẻ thử sức với lựa chọn phù hợp giúp con rèn tính chủ động trong môi trường an toàn.", body: ["Chia việc thành những bước nhỏ mà trẻ có thể thực hiện, như tự cất đồ chơi hoặc chọn quần áo giữa hai phương án phù hợp.", "Làm mẫu khi cần, ở gần để bảo đảm an toàn và tránh làm thay ngay khi trẻ đang cố gắng.", "Ghi nhận nỗ lực cụ thể giúp trẻ hiểu điều mình đã làm tốt và có động lực thử lại lần sau."] },
          { kind: "Đời sống gia đình", group: "family", icon: "💛", art: "#fce6cb", title: "Lắng nghe cảm xúc của trẻ: bắt đầu bằng một câu hỏi mở", excerpt: "Một khoảng dừng để lắng nghe giúp trẻ có thêm thời gian gọi tên điều mình đang cảm nhận.", body: ["Ba mẹ có thể hỏi “Điều gì làm con vui nhất hôm nay?” hoặc “Có chuyện nào khiến con chưa thoải mái không?”. Câu hỏi mở cho trẻ cơ hội kể theo cách và nhịp của mình.", "Hãy lắng nghe hết câu chuyện trước khi đưa lời khuyên. Nếu trẻ chưa muốn chia sẻ, có thể nói rằng ba mẹ luôn sẵn sàng ở bên khi con cần.", "Cảm xúc không phải hành vi. Người lớn có thể công nhận cảm xúc của trẻ đồng thời hướng dẫn cách thể hiện an toàn."] },
          { kind: "An toàn số", group: "family", icon: "🛡️", art: "#dcecff", title: "Cùng con xây dựng thói quen an toàn trên mạng", excerpt: "Thống nhất quy tắc dễ nhớ: không chia sẻ thông tin riêng tư và tìm người lớn tin cậy khi thấy bất an.", body: ["Cùng trẻ luyện cách dừng lại khi gặp tin nhắn hoặc nội dung khiến con lo lắng. Trẻ không cần tự trả lời hay tự xử lý tình huống vượt quá khả năng.", "Nhắc trẻ không chia sẻ địa chỉ, mật khẩu, hình ảnh riêng tư hoặc thông tin nhận dạng. Người lớn có thể cùng con xem cài đặt riêng tư phù hợp độ tuổi.", "Giữ không khí trò chuyện bình tĩnh để trẻ biết rằng con có thể kể lại sự việc mà không bị trách mắng."] },
          { id: "skill-communication", kind: "Kỹ năng xã hội", group: "family", icon: "🤝", art: "#e4f0e5", title: "Giúp trẻ tập giải quyết bất đồng với bạn", excerpt: "Khuyến khích trẻ kể lại sự việc, nói cảm xúc và tìm sự hỗ trợ phù hợp.", body: ["Ba mẹ có thể cùng trẻ kể lại điều đã xảy ra bằng những câu trung tính, sau đó hỏi mỗi bạn mong muốn điều gì.", "Gợi ý trẻ nói bằng câu bắt đầu với “Mình cảm thấy…” và lắng nghe bạn. Người lớn nên ở gần để hỗ trợ, nhất là khi có nguy cơ mất an toàn.", "Không yêu cầu trẻ tự giải quyết tình huống vượt quá khả năng hoặc chấp nhận hành vi làm trẻ tổn thương."] },
          { kind: "Câu chuyện thương hiệu", group: "brand", icon: "📚", art: "#e8e2ff", title: "Vì sao LITTLE HERO học qua tình huống?", excerpt: "Trẻ quan sát câu chuyện, chọn cách ứng xử và xem diễn biến tiếp theo trong một môi trường luyện tập.", body: ["Tình huống trong bài học tạo cơ hội để trẻ dừng lại, nghĩ về cảm xúc và cân nhắc các lựa chọn.", "Ba mẹ có thể dùng câu chuyện làm điểm bắt đầu cho một cuộc trò chuyện ngắn. Không cần biến mỗi lượt chơi thành bài kiểm tra.", "Nội dung ứng dụng là trải nghiệm giáo dục tham khảo, không thay thế sự hướng dẫn trực tiếp hoặc hỗ trợ chuyên môn."] },
          { kind: "Khám phá sản phẩm", group: "brand", icon: "🗺️", art: "#d8f0ef", title: "Khám phá bản đồ 8 ốc đảo kỹ năng", excerpt: "Mỗi điểm dừng gợi mở một chủ đề để gia đình cùng đọc, suy nghĩ và thực hành.", body: ["Bản đồ kết nối các chủ đề như cảm xúc, giao tiếp, tự bảo vệ, sức khỏe, tư duy, trách nhiệm, khám phá và cộng đồng.", "Gia đình có thể chọn một đảo theo điều trẻ quan tâm rồi cùng con thực hành bài học tương ứng.", "Tiến độ được lưu trên thiết bị đang dùng."] },
          { id: "skill-family", kind: "Đồng hành cùng con", group: "family", icon: "👨‍👩‍👧", art: "#f7dfe8", title: "Ba mẹ đồng hành cùng Hero bằng những cuộc trò chuyện nhỏ", excerpt: "Một câu hỏi không phán xét giúp trẻ nối điều vừa học với trải nghiệm ngoài đời.", body: ["Sau câu chuyện, ba mẹ có thể hỏi “Con nghĩ nhân vật đang cảm thấy thế nào?” hoặc “Nếu con ở đó, con muốn nhờ ai giúp?”.", "Hãy để trẻ tự diễn đạt, công nhận nỗ lực và đưa ra lựa chọn phù hợp với độ tuổi.", "Nếu trẻ kể về việc không an toàn, hãy lắng nghe, đảm bảo an toàn trước mắt và tìm người hỗ trợ đáng tin cậy."] }
        ];
        const dateLabel = "23/10/2026";
        const articleMeta = `<div class="parent-article-meta"><time datetime="2026-10-23">${dateLabel}</time><span>• LITTLE HERO</span></div>`;
        const articleBody = (article) => article.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
        const featured = articles.filter((article) => article.featured);
        const latest = articles.filter((article) => !article.featured);
        $("#routeView").innerHTML = pageShell("parent-news", "Góc đọc dành cho phụ huynh — bài viết về đời sống gia đình, kỹ năng sống và hành trình LITTLE HERO.", `
          <div id="parentNewsContent">
            <div class="parent-news-featured">${featured.map((article) => `<article class="parent-feature-card news-card" data-article-id="${article.id}" data-group="${article.group}" data-search="${escapeHtml(`${article.title} ${article.excerpt} ${article.kind}`.toLowerCase())}">
              <div class="parent-feature-art" style="--article-art:${article.art}" aria-hidden="true"><span class="parent-feature-badge">★ Nổi bật</span><span class="parent-feature-art-icon">${article.icon}</span></div>
              <div class="parent-feature-copy"><span class="parent-news-label">${escapeHtml(article.kind)}</span><h2>${escapeHtml(article.title)}</h2><p>${escapeHtml(article.excerpt)}</p>${articleMeta}<details><summary class="text-link">Đọc bài viết</summary>${articleBody(article)}</details></div>
            </article>`).join("")}</div>
            <div class="parent-news-toolbar"><h2><span aria-hidden="true">★</span>Bài viết mới nhất</h2><input class="parent-news-search" id="parentNewsSearch" type="search" placeholder="⌕  Tìm bài viết..." aria-label="Tìm bài viết"></div>
            <div class="parent-news-filters" role="group" aria-label="Lọc bài viết">
              <button type="button" data-news-filter="all" aria-pressed="true">Tất cả</button>
              <button type="button" data-news-filter="family" aria-pressed="false">Đời sống & kỹ năng</button>
              <button type="button" data-news-filter="brand" aria-pressed="false">LITTLE HERO</button>
            </div>
            <div class="parent-articles">${latest.map((article) => `<article class="parent-article news-card" data-article-id="${article.id}" data-group="${article.group}" data-search="${escapeHtml(`${article.title} ${article.excerpt} ${article.kind}`.toLowerCase())}">
              <div class="parent-article-art" style="--article-art:${article.art}" aria-hidden="true"><span>${article.icon}</span></div>
              <div class="parent-article-content"><span class="parent-news-label">${escapeHtml(article.kind)}</span><h2>${escapeHtml(article.title)}</h2><p>${escapeHtml(article.excerpt)}</p>${articleMeta}<details><summary>Đọc bài viết →</summary>${articleBody(article)}</details></div>
            </article>`).join("")}<p class="parent-articles-empty" id="parentNewsEmpty" hidden>Không tìm thấy bài viết phù hợp. Thử từ khóa hoặc danh mục khác nhé.</p></div>
            <div class="parent-notice" style="margin-top:20px">Bài viết tham khảo do LITTLE HERO biên soạn; đây không phải bản tin thời gian thực hoặc tư vấn y tế, tâm lý hay pháp lý.</div>
            <div class="page-actions">${routeLink("parents", "Về bảng điều khiển phụ huynh", "←")}${routeLink("reviews", "Gửi ý kiến", "✍")}</div>
          </div>`, "GÓC GIA ĐÌNH");
        const content = $("#parentNewsContent");
        const cards = [...content.querySelectorAll(".news-card")];
        const search = $("#parentNewsSearch");
        const empty = $("#parentNewsEmpty");
        let activeFilter = "all";
        const updateVisibleArticles = () => {
          const query = search.value.trim().toLocaleLowerCase("vi");
          let visible = 0;
          cards.forEach((card) => {
            const matches = (activeFilter === "all" || card.dataset.group === activeFilter)
              && (!query || card.dataset.search.includes(query));
            card.hidden = !matches;
            if (matches) visible += 1;
          });
          empty.hidden = visible > 0;
        };
        search.addEventListener("input", updateVisibleArticles);
        content.querySelector(".parent-news-filters").addEventListener("click", (event) => {
          const filter = event.target.closest("[data-news-filter]");
          if (!filter) return;
          activeFilter = filter.dataset.newsFilter;
          content.querySelectorAll("[data-news-filter]").forEach((button) => button.setAttribute("aria-pressed", String(button === filter)));
          updateVisibleArticles();
        });
        if (pendingNewsFocus) {
          const target = cards.find((card) => card.dataset.articleId === pendingNewsFocus);
          pendingNewsFocus = "";
          if (target) {
            const details = target.querySelector("details");
            if (details) details.open = true;
            window.setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
          }
        }
      };

      const applyTheme = () => {
        document.body.classList.toggle("dark-mode", Boolean(state.darkMode));
        $("#themeBtn").textContent = state.darkMode ? "☀" : "☾";
        $("#themeBtn").title = state.darkMode ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối";
      };

      document.addEventListener("click", (event) => {
        if (event.target.closest("[data-route-back]")) {
          event.preventDefault();
          navigateBack();
          return;
        }
        const startMiniGameButton = event.target.closest("[data-mini-game-start]");
        if (startMiniGameButton) {
          startMiniGame(startMiniGameButton.dataset.miniGameStart);
          return;
        }
        if (event.target.closest("[data-mini-game-back]")) {
          miniGameRun = null;
          renderGamesPage();
          return;
        }
        const replayMiniGameButton = event.target.closest("[data-mini-game-replay]");
        if (replayMiniGameButton) {
          startMiniGame(replayMiniGameButton.dataset.miniGameReplay);
          return;
        }
        const memoryCard = event.target.closest("[data-memory-card]");
        if (memoryCard && miniGameRun?.id === "memory" && !miniGameRun.locked && !miniGameRun.completed) {
          const run = miniGameRun;
          const cardIndex = Number(memoryCard.dataset.memoryCard);
          if (!Number.isInteger(cardIndex) || cardIndex < 0 || cardIndex >= run.cards.length || run.revealed.includes(cardIndex) || run.matched.includes(cardIndex)) return;
          run.revealed.push(cardIndex);
          if (run.revealed.length === 2) {
            run.moves += 1;
            if (run.cards[run.revealed[0]] === run.cards[run.revealed[1]]) {
              run.matched.push(...run.revealed);
              run.revealed = [];
              if (run.matched.length === run.cards.length) {
                run.completed = true;
                run.rewarded = awardMiniGame(run.id);
                if (run.rewarded) toast(`Tuyệt vời! Bé nhận ${miniGames[run.id].reward} sao thưởng!`);
              }
              renderGamesPage();
            } else {
              run.locked = true;
              renderGamesPage();
              window.setTimeout(() => {
                if (miniGameRun !== run) return;
                run.revealed = [];
                run.locked = false;
                renderGamesPage();
              }, 750);
            }
          } else {
            renderGamesPage();
          }
          return;
        }
        const miniGameAnswer = event.target.closest("[data-mini-game-answer]");
        if (miniGameAnswer && miniGameRun && miniGameRun.id !== "memory" && miniGameRun.selected === null) {
          const run = miniGameRun;
          const rounds = miniGameRounds(run.id);
          const answer = Number(miniGameAnswer.dataset.miniGameAnswer);
          const round = rounds[run.round];
          if (!round || !Number.isInteger(answer) || answer < 0 || answer >= round.options.length) return;
          if (answer === round.answer) {
            run.selected = answer;
            run.correct += 1;
            run.feedback = "Chính xác! Bé quan sát thật tinh ý! ✨";
          } else {
            run.feedback = `${run.id === "feelings" ? "Mỗi người có thể cảm thấy khác nhau." : round.hint} Bé thử lại nha!`;
          }
          renderGamesPage();
          return;
        }
        if (event.target.closest("[data-mini-game-next]") && miniGameRun && miniGameRun.id !== "memory" && miniGameRun.selected !== null) {
          const run = miniGameRun;
          const rounds = miniGameRounds(run.id);
          run.round += 1;
          run.selected = null;
          run.feedback = "";
          if (run.round >= rounds.length) {
            run.rewarded = awardMiniGame(run.id);
            if (run.rewarded) toast(`Tuyệt vời! Bé nhận ${miniGames[run.id].reward} sao thưởng!`);
          }
          renderGamesPage();
          return;
        }
        const routeLinkElement = event.target.closest("a[data-route], button[data-route]");
        if (routeLinkElement) {
          event.preventDefault();
          if (routeLinkElement.hasAttribute("data-preview-login")) pendingAuthRoute = route;
          if (routeLinkElement.dataset.newsFocus) pendingNewsFocus = routeLinkElement.dataset.newsFocus;
          setRoute(routeLinkElement.dataset.route);
          return;
        }
        const lessonButton = event.target.closest("[data-lesson]");
        if (lessonButton) {
          event.preventDefault();
          setRoute(`lessons/${lessonButton.dataset.category || ""}`);
          return;
        }
        if (event.target.closest("[data-parent-close]")) { closeParentConfirmation(); return; }
        if (event.target.closest("[data-close]")) { closeDialog(); return; }
        const parentButton = event.target.closest("[data-parent]");
        if (parentButton) { event.preventDefault(); requestParentAccess(() => setRoute("parents")); }
        const claimQuest = event.target.closest("[data-claim-quest]");
        if (claimQuest && !claimQuest.disabled) {
          const quest = questSpecs.find((item) => item.id === claimQuest.dataset.claimQuest);
          const key = `${currentDay()}:${quest.id}`;
          if (!state.questClaims.includes(key) && dailyProgress(quest.id) >= quest.target) {
            state.questClaims.push(key);
            state.xp += quest.reward;
            persist(); renderQuestPage(); toast(`Đã nhận ${quest.reward} sao nhiệm vụ.`);
          }
          return;
        }
        const quizStart = event.target.closest("#routeView [data-quiz-start]");
        if (quizStart) {
          startQuiz(quizStart.dataset.quizStart);
          return;
        }
        const quizAnswer = event.target.closest("#routeView [data-quiz-answer]");
        if (quizAnswer && quizRun?.mode === "choice" && quizRun.selected === null) {
          const lesson = quizRun.questions[quizRun.round];
          const answer = Number(quizAnswer.dataset.quizAnswer);
          if (answer === lesson.correct) {
            quizRun.selected = answer;
            quizRun.correct += 1;
            state.xp += 3;
            speak(`Đúng rồi! ${lesson.prompts[2] || lesson.goal}`);
          } else {
            quizRun.wrong = answer;
            speak(`Không sao, con thử lại nhé. ${lesson.prompts[1] || lesson.goal}`);
          }
          persist();
          renderQuizPage();
          return;
        }
        if (event.target.closest("#nextQuiz") && quizRun?.mode === "choice" && quizRun.selected !== null) {
          quizRun.round += 1;
          if (quizRun.round >= quizRun.questions.length) finishQuiz();
          else {
            quizRun.selected = null;
            quizRun.wrong = null;
          }
          renderQuizPage();
          return;
        }
        const matchCategory = event.target.closest("#routeView [data-match-category]");
        if (matchCategory && quizRun?.mode === "matching") {
          quizRun.selected = matchCategory.dataset.matchCategory;
          quizRun.message = "Đã chọn chủ đề. Bây giờ chọn mục tiêu phù hợp.";
          renderQuizPage();
          return;
        }
        const matchGoal = event.target.closest("#routeView [data-match-goal]");
        if (matchGoal && quizRun?.mode === "matching" && quizRun.selected) {
          if (quizRun.selected === matchGoal.dataset.matchGoal) {
            quizRun.matched.push(quizRun.selected);
            quizRun.message = "Nối đúng! Con tìm được một cặp phù hợp.";
            state.xp += 3;
            if (quizRun.matched.length === quizRun.pairs.length) finishQuiz();
          } else {
            quizRun.message = "Chưa khớp, con thử nối cặp khác nhé.";
          }
          quizRun.selected = null;
          persist();
          renderQuizPage();
          return;
        }
        const orderMove = event.target.closest("#routeView [data-order-move]");
        if (orderMove && quizRun?.mode === "ordering") {
          const index = Number(orderMove.dataset.orderIndex);
          const nextIndex = index + (orderMove.dataset.orderMove === "up" ? -1 : 1);
          if (Number.isInteger(index) && nextIndex >= 0 && nextIndex < quizRun.items.length) {
            [quizRun.items[index], quizRun.items[nextIndex]] = [quizRun.items[nextIndex], quizRun.items[index]];
            quizRun.message = "";
            renderQuizPage();
          }
          return;
        }
        if (event.target.closest("#checkQuizOrder") && quizRun?.mode === "ordering") {
          if (quizRun.items.every((step, index) => step === quizRun.steps[index])) {
            quizRun.message = "Đúng thứ tự rồi! Con đã sắp xếp các bước rất hợp lý.";
            state.xp += 5;
            finishQuiz();
          } else {
            quizRun.message = "Thứ tự này chưa hợp lý. Con hãy thử đổi vị trí các bước nhé.";
          }
          persist();
          renderQuizPage();
          return;
        }
        if (event.target.closest("[data-quiz-reset]")) {
          quizRun = null;
          renderQuizPage();
          return;
        }
        const claimButton = event.target.closest("#claimQuests");
        if (claimButton) {
          let reward = 0;
          questSpecs.forEach((quest) => {
            const key = `${currentDay()}:${quest.id}`;
            if (dailyProgress(quest.id) >= quest.target && !state.questClaims.includes(key)) {
              state.questClaims.push(key);
              reward += quest.reward;
            }
          });
          if (reward) { state.xp += reward; persist(); toast(`Bé nhận được ${reward} sao nhiệm vụ! 🌟`); }
          else toast("Hoàn thành nhiệm vụ để nhận sao nhé!");
        }
        const challengeButton = event.target.closest("[data-challenge]");
        if (challengeButton && !state.challenges.includes(challengeButton.dataset.challenge)) {
          requestParentAccess(() => approveChallenge(challengeButton.dataset.challenge));
        }
      });

      $("#appDialog").addEventListener("click", (event) => {
        if (event.target === $("#appDialog")) closeOpenDialog();
      });
      $("#appDialog").addEventListener("cancel", (event) => {
        if ($("#appDialog").dataset.childOnboarding === "true") {
          event.preventDefault();
          return;
        }
        if ($("#appDialog").dataset.parentConfirmation !== "true") return;
        event.preventDefault();
        closeParentConfirmation();
      });
      $("#continueBtn").addEventListener("click", () => {
        const available = ageAppropriateLessons();
        const lesson = available.find((item) => !state.completed.includes(item.id)) || available[0];
        setRoute(`lessons/${lesson.category}`);
      });
      $("#randomLessonBtn").addEventListener("click", () => {
        const available = ageAppropriateLessons().filter((lesson) => !state.completed.includes(lesson.id));
        const pool = available.length ? available : ageAppropriateLessons();
        const lesson = pool[Math.floor(Math.random() * pool.length)];
        renderFeatured(lesson);
        toast(`Hero gợi ý: ${lesson.title}`);
      });
      $("#upgradeBtn").addEventListener("click", () => setRoute("pricing"));
      $("#monthlyPlanBtn").addEventListener("click", () => setRoute("payment/monthly"));
      $("#yearlyPlanBtn").addEventListener("click", () => setRoute("payment/yearly"));
      $("#freePlanBtn").addEventListener("click", () => setRoute("lessons"));
      $("#accountBtn").addEventListener("click", () => setRoute("auth"));
      $("#logoutBtn").addEventListener("click", () => {
        if (state.accountEmail) {
          try { sessionStorage.removeItem(leaderboardTokenKey(state.accountEmail)); }
          catch (error) { console.warn("Không thể xóa phiên đăng nhập bảng xếp hạng.", error); }
        }
        const preferences = { darkMode: state.darkMode, sound: state.sound, language: state.language };
        state = freshState();
        Object.assign(state, preferences);
        pendingAuthRoute = "";
        miniGameRun = null;
        quizRun = null;
        applyTheme();
        persist();
        setRoute("home");
        renderStats();
        toast("Đã đăng xuất. Tiến độ của tài khoản được giữ lại để đăng nhập lần sau.");
      });
      $("#soundBtn").addEventListener("click", openSound);
      $("#themeBtn").addEventListener("click", () => {
        state.darkMode = !state.darkMode;
        applyTheme();
        persist();
        toast(state.darkMode ? "Đã bật giao diện tối." : "Đã bật giao diện sáng.");
      });
      $("#heroMascot").addEventListener("click", () => {
        if (!("speechSynthesis" in window)) { toast("Trình duyệt chưa hỗ trợ giọng đọc tiếng Việt."); return; }
        const greeting = state.language === "en"
          ? `Hello ${state.childName || "friend"}! Let's explore the world with Hero today!`
          : `Xin chào ${state.childName || "bạn nhỏ"}! Cùng Hero khám phá thế giới hôm nay nhé!`;
        const utterance = new SpeechSynthesisUtterance(greeting);
        utterance.lang = state.language === "en" ? "en-US" : "vi-VN";
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      });
      $("#heroMascot").addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); $("#heroMascot").click(); }
      });
      $("#menuBtn").addEventListener("click", () => {
        const nav = $("#mainNav");
        nav.classList.toggle("open");
        $("#menuBtn").setAttribute("aria-expanded", String(nav.classList.contains("open")));
      });
      $("#arenaTabs").addEventListener("click", (event) => {
        const tab = event.target.closest("[data-mode]");
        if (!tab) return;
        arenaMode = tab.dataset.mode;
        $("#homeLeaderboardLocation").hidden = !["region", "city"].includes(arenaMode);
        $("#arenaTabs").querySelectorAll(".arena-tab").forEach((item) => {
          const active = item === tab;
          item.classList.toggle("active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        $("#leaderScope").textContent = leaderboardScopeLabel(arenaMode);
        renderLeaderboard(document, arenaMode);
      });
      $("#homeLeaderboardProvince").addEventListener("change", (event) => {
        leaderboardViewProvince = event.currentTarget.value;
        syncLeaderboardLocationControls();
        $("#leaderScope").textContent = leaderboardScopeLabel(arenaMode);
        renderLeaderboard(document, arenaMode);
      });
      $("#arenaStart").addEventListener("click", openQuiz);

      $("#dailyQuests").addEventListener("click", (event) => {
        if (event.target.closest("#claimQuests")) return;
        if (dailyProgress("lessons") < 3) {
          const available = ageAppropriateLessons();
          const nextLesson = available.find((lesson) => !state.completed.includes(lesson.id)) || available[0];
          setRoute(`lessons/${nextLesson.category}`);
          return;
        }
        if (dailyProgress("quiz") === 0) setRoute("quiz");
        else toast("Bé đã thử các hoạt động hôm nay. Hẹn gặp lại ngày mai nhé!");
      });

      window.addEventListener("popstate", () => {
        const nextRoute = location.hash.startsWith("#/") ? location.hash.slice(2) : "home";
        setRoute(nextRoute, { pop: true, restore: nextRoute === "home" });
      });
      [...$("#mainNav").querySelectorAll("details"), $("#accountMenu")].forEach((menu) => {
        menu.addEventListener("pointerenter", (event) => {
          if (event.pointerType === "mouse") menu.open = true;
        });
        menu.addEventListener("pointerleave", () => {
          if (!menu.contains(document.activeElement)) menu.open = false;
        });
        menu.querySelector("summary").addEventListener("click", (event) => {
          if (event.detail > 0 && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            event.preventDefault();
            menu.open = true;
          }
        });
      });
      const defaultCloset = safeWardrobe(freshState().closet);
      const hasCustomizedCloset = [state.closet, ...state.children.map((child) => child.closet)]
        .some((closet) => JSON.stringify(safeWardrobe(closet)) !== JSON.stringify(defaultCloset));
      if (hasCustomizedCloset) {
        state.closet = defaultCloset;
        state.children.forEach((child) => { child.closet = defaultCloset; });
        persist();
      }
      renderDropdown();
      renderIslands();
      renderFeatured();
      renderStories();
      renderLeaderboard();
      renderStats();
      applyTheme();
      $(".mascot").innerHTML = renderHeroCharacterSvg(state.closet, { ariaLabel: "Hero cá nhân hóa" });
      renderStats();
      const initialRoute = location.hash.startsWith("#/") ? location.hash.slice(2) : "home";
      routeHistory = [initialRoute];
      if (initialRoute !== "home") setRoute(initialRoute, { pop: true });
      else if (!location.hash.startsWith("#/") && state.lastRoute && state.lastRoute !== "home") setRoute(state.lastRoute, { pop: true, restore: true });
      else setRoute("home", { pop: true });
      queueLeaderboardSync();
      showOnboardingIfNeeded();
      window.setInterval(() => {
        refreshDay();
        if (!state.authenticated || document.visibilityState !== "visible") return;
        state.sessionSeconds += 10;
        state.dailyUsage[currentDay()] = (Number(state.dailyUsage[currentDay()]) || 0) + 10;
        if (route.startsWith("lesson/")) {
          state.studySeconds += 10;
          state.dailyStudy[currentDay()] = (Number(state.dailyStudy[currentDay()]) || 0) + 10;
        }
        renderStats();
        if (state.sessionSeconds >= 600 && !state.questClaims.includes(`${currentDay()}:minutes`)) renderQuests();
        if (state.sessionSeconds % 60 === 0) {
          persist();
        }
      }, 10000);
    })();
