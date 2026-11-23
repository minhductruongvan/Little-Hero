    (() => {
      "use strict";

      const STORAGE_KEY = "little-hero-new-home-v1";
      const localHosts = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);
      const languageConfig = (code) => window.LittleHeroLanguages.find((language) => language.code === code) || window.LittleHeroLanguages[0];
      const languageSpeechLocale = () => languageConfig(state.language).speechLocale;
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
        { id: "sample-review-routine", author: "Nguyễn Minh Anh", avatar: "parent-avatar-woman-1.jpg", stars: 5, title: "Bé hào hứng học mỗi tối", body: "Các tình huống gần gũi nên con dễ hiểu và chịu kể lại cách mình sẽ làm. Gia đình mình thường cùng con chọn một bài trước giờ đi ngủ." },
        { id: "sample-review-practice", author: "Trần Thu Hà", avatar: "parent-avatar-woman-2.jpg", stars: 5, title: "Dễ học cùng con", body: "Bài học ngắn, phần lựa chọn giúp bố mẹ có thêm chủ đề để trò chuyện với con. Bé thích nhất các nhân vật trong câu chuyện." },
        { id: "sample-review-family", author: "Lê Quang Huy", avatar: "parent-avatar-man.jpg", stars: 4, title: "Một hoạt động hữu ích cho cả nhà", body: "Nội dung nhẹ nhàng, phù hợp để bố mẹ cùng con luyện cách xử lý những tình huống thường gặp ở trường và khi đi chơi." },
        { id: "sample-review-progress", author: "Phạm Thảo Nhi", avatar: "parent-avatar-woman-3.jpg", stars: 5, title: "Con nhớ được điều đã học", body: "Sau khi học về an toàn, con chủ động nhắc lại cần tìm người lớn đáng tin cậy khi thấy lo lắng. Cả nhà có thêm cách ôn bài vui vẻ." }
      ].map((review) => ({ ...review, isSample: true, helpful: 0 }));
      const { categories, lessonFollowUps, questSpecs, challengeSpecs } = window.LittleHeroLessonCatalog;
      const lessons = [
        ...window.LittleHeroLessonCatalog.lessons,
        ...window.LittleHeroAdditionalLessons,
        ...window.LittleHeroSocialCreativeLessons
      ];
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
      const localizedChildName = (name = state.childName) =>
        name && name !== "Bé" ? name : languageConfig(state.language).friend;
      let activeSubscription = null;
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
        state.language = window.LittleHeroLanguages.some(({ code }) => code === state.language) ? state.language : "vi";
        document.documentElement.lang = state.language;
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
      let displayedXp = state.xp;
      const xpFlightQueue = [];
      let xpFlightActive = false;
      let recentXpOrigin = null;
      let recentXpOriginTimer = 0;
      const renderXpValue = (pulse = false, levelUp = false) => {
        const counter = $("#xpValue");
        const level = Math.floor(displayedXp / 100) + 1;
        const progress = displayedXp % 100;
        counter.textContent = String(displayedXp);
        counter.title = translateString(`Cấp ${level}`);
        const progressBar = $(".header-level-progress");
        const progressFill = $("#headerLevelProgress");
        progressBar.setAttribute("aria-valuenow", String(progress));
        progressBar.setAttribute("aria-label", translateString(`Tiến độ cấp ${level}`));
        progressFill.style.width = `${progress}%`;
        if (!pulse) return;
        counter.classList.remove("xp-count-pulse", "xp-level-pulse");
        void counter.offsetWidth;
        counter.classList.add(levelUp ? "xp-level-pulse" : "xp-count-pulse");
      };
      document.addEventListener("click", (event) => {
        if (!(event.target instanceof Element)) return;
        const source = event.target.closest("button,[role='button']");
        if (!source) return;
        const rect = source.getBoundingClientRect();
        recentXpOrigin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        window.clearTimeout(recentXpOriginTimer);
        recentXpOriginTimer = window.setTimeout(() => { recentXpOrigin = null; }, 1800);
      }, true);
      const xpFlightOrigin = (source) => {
        const activeElement = document.activeElement instanceof HTMLElement && document.activeElement !== document.body
          ? document.activeElement
          : null;
        const originElement = source instanceof Element ? source : activeElement;
        const rect = originElement?.getBoundingClientRect();
        if (rect && rect.width && rect.height) return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        if (recentXpOrigin) return recentXpOrigin;
        const counter = $("#xpValue").getBoundingClientRect();
        return { x: counter.left + counter.width / 2, y: counter.top + counter.height / 2 };
      };
      const animateXpStar = (origin, index) => new Promise((resolve) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          window.setTimeout(resolve, 70);
          return;
        }
        const counter = $("#xpValue").getBoundingClientRect();
        const targetX = counter.left + counter.width / 2;
        const targetY = counter.top + counter.height / 2;
        const angle = index * 2.4;
        const spread = 5 + index % 4 * 3;
        const startX = origin.x + Math.cos(angle) * spread;
        const startY = origin.y + Math.sin(angle) * spread;
        const star = document.createElement("span");
        star.className = "xp-flight-star";
        star.setAttribute("aria-hidden", "true");
        star.textContent = "⭐";
        star.style.left = `${startX - 12}px`;
        star.style.top = `${startY - 12}px`;
        star.style.setProperty("--xp-flight-x", `${targetX - startX}px`);
        star.style.setProperty("--xp-flight-y", `${targetY - startY}px`);
        document.body.appendChild(star);
        let settled = false;
        let timer = 0;
        const finish = () => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timer);
          star.remove();
          resolve();
        };
        star.addEventListener("animationend", finish, { once: true });
        timer = window.setTimeout(finish, 900);
      });
      const runXpFlightQueue = async () => {
        if (xpFlightActive) return;
        xpFlightActive = true;
        while (xpFlightQueue.length) {
          const reward = xpFlightQueue.shift();
          const flights = Array.from({ length: reward.amount }, (_, index) => new Promise((resolve) => {
            window.setTimeout(() => {
              animateXpStar(reward.origin, index).then(() => {
                const previousLevel = Math.floor(displayedXp / 100) + 1;
                displayedXp += 1;
                renderXpValue(true, Math.floor(displayedXp / 100) + 1 > previousLevel);
                resolve();
              });
            }, index * 75);
          }));
          await Promise.all(flights);
        }
        xpFlightActive = false;
        displayedXp = state.xp;
        renderXpValue();
      };
      const awardXp = (amount, source) => {
        const value = Number(amount);
        const reward = Number.isFinite(value) ? Math.floor(value) : 0;
        if (reward < 1) return;
        state.xp += reward;
        xpFlightQueue.push({ amount: reward, origin: xpFlightOrigin(source) });
        void runXpFlightQueue();
      };
      const celebrateCorrectAnswer = (source) => {
        if (!(source instanceof HTMLElement) || !source.isConnected
          || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const bounds = source.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        const burst = document.createElement("span");
        burst.className = "answer-celebration";
        burst.setAttribute("aria-hidden", "true");
        burst.style.left = `${bounds.left + bounds.width / 2}px`;
        burst.style.top = `${bounds.top + bounds.height / 2}px`;
        [
          [-42, -28], [0, -42], [42, -28], [52, 4],
          [38, 38], [0, 48], [-38, 38], [-52, 4]
        ].forEach(([x, y], index) => {
          const particle = document.createElement("span");
          particle.textContent = ["✦", "★", "✧", "●"][index % 4];
          particle.style.setProperty("--answer-burst-x", `${x}px`);
          particle.style.setProperty("--answer-burst-y", `${y}px`);
          burst.append(particle);
        });
        document.body.append(burst);
        source.classList.remove("answer-celebrated");
        void source.offsetWidth;
        source.classList.add("answer-celebrated");
        window.setTimeout(() => {
          burst.remove();
          source.classList.remove("answer-celebrated");
        }, 850);
      };
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
      const appDialog = $("#appDialog");
      appDialog.addEventListener("cancel", (event) => {
        if (appDialog.dataset.childOnboarding === "true") event.preventDefault();
      });
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
            <p>Thông tin này giúp gợi ý bài học và ghép nhóm đấu trường phù hợp với độ tuổi.</p></div></div>
          <form id="childOnboardingForm">
            <fieldset class="onboarding-group"><legend>Bé thuộc nhóm tuổi nào?</legend>
              <label class="onboarding-age-option"><input type="radio" name="ageGroup" value="3-6"><span><strong>3–6 tuổi</strong><small>Bài học gần gũi, từng bước</small></span></label>
              <label class="onboarding-age-option"><input type="radio" name="ageGroup" value="7-10"><span><strong>7–10 tuổi</strong><small>Tình huống và thử thách đa dạng</small></span></label>
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
        const onboardingError = $("#onboardingError", form);
        const clearOnboardingError = () => {
          onboardingError.textContent = "";
          onboardingError.hidden = true;
        };
        form.querySelectorAll('input[name="ageGroup"]').forEach((input) => input.addEventListener("change", () => {
          clearOnboardingError();
          ageSelect.innerHTML = renderAgeOptions(input.value, input.value === "3-6" ? 6 : 7);
          updateInterestOptions(input.value);
        }));
        form.querySelectorAll('input[name="interest"]').forEach((input) => input.addEventListener("change", clearOnboardingError));
        updateInterestOptions(ageGroup);
        ageSelect.addEventListener("change", () => {
          clearOnboardingError();
          const group = Number(ageSelect.value) <= 6 ? "3-6" : "7-10";
          const radio = form.querySelector(`input[name="ageGroup"][value="${group}"]`);
          if (radio) radio.checked = true;
        });
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          const selectedAgeGroup = form.querySelector('input[name="ageGroup"]:checked')?.value;
          const selectedInterests = [...form.querySelectorAll('input[name="interest"]:checked')].map((input) => input.value);
          const age = Number(ageSelect.value);
          if (!selectedAgeGroup) {
            onboardingError.textContent = "Hãy chọn nhóm tuổi phù hợp với bé nhé.";
            onboardingError.hidden = false;
            return;
          }
          if (!selectedInterests.length) {
            onboardingError.textContent = "Hãy chọn ít nhất một chủ đề bé yêu thích nhé.";
            onboardingError.hidden = false;
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
      const showOnboardingIfNeeded = () => {
        if (state.authenticated && !state.onboardingComplete) openChildOnboarding();
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
          toast(translateString("Trình duyệt chưa hỗ trợ giọng đọc."));
          onComplete?.();
          return false;
        }
        window.speechSynthesis.cancel();
        activeSpeech = null;
        updateSpeechControls(false);
        const utterance = new SpeechSynthesisUtterance(translateString(text));
        utterance.lang = languageSpeechLocale();
        utterance.rate = 0.92;
        const speechPrefix = languageSpeechLocale().split("-")[0].toLowerCase();
        const preferredVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith(speechPrefix));
        if (!preferredVoice) {
          toast(translateString("Thiết bị chưa cài giọng đọc cho ngôn ngữ đã chọn."));
          onComplete?.();
          return false;
        }
        if (preferredVoice) utterance.voice = preferredVoice;
        activeSpeech = utterance;
        updateSpeechControls(true);
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
          if (event.error !== "canceled" && event.error !== "interrupted") toast(translateString("Không thể phát giọng đọc trên thiết bị này."));
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
      const ageCategories = Object.fromEntries(["3-6", "7-10"].map((group) => [
        group,
        [...new Set(lessons.filter((lesson) => lesson.ageGroup === group).map((lesson) => lesson.category))]
      ]));
      const currentAgeGroup = () => state.age <= 6 ? "3-6" : "7-10";
      const currentAgeLabel = () => currentAgeGroup() === "3-6" ? "3–6 tuổi" : "7–10 tuổi";
      const ageAppropriateCategories = () => state.authenticated
        ? categories.filter((category) => ageCategories[currentAgeGroup()].includes(category.id))
        : categories;
      const ageAppropriateLessons = () => {
        const available = lessons
          .filter((lesson) => !state.authenticated || lesson.ageGroup === currentAgeGroup())
          .map((lesson) => ({ ...lesson, age: state.authenticated ? currentAgeLabel() : lesson.age }));
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
          caption: "GÓI THÁNG",
          badge: "BẮT ĐẦU NHẸ NHÀNG",
          image: "./frontend/assets/emotion-classroom.png",
          imageAlt: "Hero và bạn cùng học trong lớp mỹ thuật",
          price: 49000,
          durationDays: 30,
          features: ["Mở khóa toàn bộ bài học Premium", "Truyện tương tác và trò chơi", "Sao thưởng sau mỗi bài"]
        },
        yearly: {
          name: "Cùng Hero Mỗi Ngày – Gói năm",
          title: "Cùng Hero Mỗi Ngày",
          caption: "GÓI NĂM",
          badge: "TIẾT KIỆM HƠN",
          image: "./frontend/assets/safety-supermarket.png",
          imageAlt: "Hero thực hành kỹ năng an toàn tại quầy thông tin",
          price: 399000,
          durationDays: 365,
          features: ["Toàn bộ nội dung gói tháng", "Báo cáo tiến độ dành cho phụ huynh", "Tiết kiệm 189.000đ so với gia hạn theo tháng"]
        }
      };
      const PAYMENT_CONFIG = {
        bankName: "MB BANK",
        accountName: "MB BANK",
        accountNumber: "16030616032006"
      };
      const refreshActiveSubscription = async () => {
        if (!state.authenticated || state.demoAccount || !state.accountEmail) {
          activeSubscription = null;
          return null;
        }
        const email = state.accountEmail;
        const token = leaderboardToken();
        if (!token) {
          activeSubscription = null;
          return null;
        }
        const response = await fetch(apiUrl("/api/premium/status"), {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await response.json();
        if (response.status === 401) {
          activeSubscription = null;
          try { sessionStorage.removeItem(leaderboardTokenKey(email)); }
          catch (error) { console.warn("Không thể xóa phiên đăng nhập đã hết hạn.", error); }
          throw new Error(result.error || "Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.");
        }
        if (!response.ok) throw new Error(result.error || "Không thể tải trạng thái gói Premium.");
        if (state.accountEmail !== email || leaderboardToken() !== token) return activeSubscription;
        activeSubscription = result.subscription;
        return activeSubscription;
      };
      const hasActivePremium = () => state.demoAccount || Boolean(activeSubscription
        && activeSubscription.status === "active"
        && ["monthly", "yearly"].includes(activeSubscription.plan)
        && Number.isFinite(Date.parse(activeSubscription.expiresAt || ""))
        && Date.parse(activeSubscription.expiresAt) > Date.now());
      const hasYearlyPremium = () => state.demoAccount || (hasActivePremium() && activeSubscription.plan === "yearly");
      const isPremiumLesson = (lesson) => lesson.premium === true;
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
        $("#childName").textContent = localizedChildName();
        $("#accountMenu").hidden = !state.authenticated;
        $("#headerAvatar").textContent = state.closet?.gender === "girl" ? "👧" : "🧒";
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
        $("#accountMenuName").textContent = state.childName && state.childName !== "Bé" ? state.childName : "Tài khoản";
        $("#accountMenuGreeting").textContent = state.childName && state.childName !== "Bé" ? `Xin chào, ${state.childName}` : "Chào bạn nhỏ";
        $("#accountBtn").hidden = state.authenticated;
        $("#accountBtn").textContent = "Đăng nhập / đăng ký";
        $("#logoutBtn").hidden = !state.authenticated;
        document.body.dataset.authenticated = String(state.authenticated);
        $("#upgradeBtn").textContent = hasActivePremium() ? "♛ Premium của bé" : "♛ Premium";
        if (!xpFlightActive && !xpFlightQueue.length) displayedXp = state.xp;
        renderXpValue();
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
            const ratingLabel = translateTemplate("{stars} trên 5 sao", { stars });
            const author = String(review.author).trim();
            const avatar = review.avatar
              ? `<img src="./frontend/assets/${escapeHtml(review.avatar)}" alt="" loading="lazy" decoding="async">`
              : escapeHtml(Array.from(author)[0] || "L");
            return `<article class="testimonial-card" style="--testimonial-bg:${background};--testimonial-color:${color}">
              <div class="testimonial-person"><span class="testimonial-avatar" aria-hidden="true">${avatar}</span><span class="testimonial-meta"><span class="testimonial-name">${escapeHtml(author)}</span><span class="review-stars" aria-label="${ratingLabel}">${"★".repeat(stars)}${"☆".repeat(5 - stars)}</span></span></div>
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
        const dropdown = $("#lessonDropdown");
        if (!dropdown) return;
        dropdown.innerHTML = ageAppropriateCategories().map((category) =>
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
        emotion: { src: "./frontend/assets/emotion-calm-room.png", width: 1024, height: 765, alt: "Các bạn nhỏ cùng Hero nhận biết cảm xúc trong phòng chơi" },
        social: { src: "./frontend/assets/emotion-classroom.png", width: 1024, height: 637, alt: "Hero và bạn cùng học trong lớp mỹ thuật" },
        safety: { src: "./frontend/assets/safety-supermarket.png", width: 1024, height: 541, alt: "Hero thực hành kỹ năng an toàn tại quầy thông tin" },
        health: { src: "./frontend/assets/lesson-handwashing.png", width: 1024, height: 572, alt: "Hero hướng dẫn Mia rửa tay trong bếp" },
        thinking: { src: "./frontend/assets/emotion-calm-room.png", width: 1024, height: 765, alt: "Các bạn nhỏ cùng Hero suy nghĩ và giải quyết tình huống" },
        care: { src: "./frontend/assets/lesson-playground-cleanup.png", width: 1024, height: 572, alt: "Hero và Linh cùng giữ sân chơi sạch đẹp" },
        creative: { src: "./frontend/assets/lesson-safe-bicycle.png", width: 1024, height: 765, alt: "Hero và bố hướng dẫn Bin tập xe an toàn" },
        community: { src: "./frontend/assets/safety-supermarket.png", width: 1024, height: 541, alt: "Hero thực hành nhận biết và xử lý tình huống an toàn" }
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
          <img class="lesson-art-image" src="${image.src}" width="${image.width}" height="${image.height}" alt="${escapeHtml(image.alt)}" loading="lazy">
          <span class="lesson-emoji" aria-hidden="true">${lesson.icon}</span><span class="lesson-note">✦ TÌNH HUỐNG GẦN GŨI</span>
        </div><div class="lesson-copy"><span class="tag">${category.icon} ${escapeHtml(category.name)}</span>
          <h3>${escapeHtml(lesson.title)}</h3>
          <div class="lesson-meta"><span>⭐ +${lesson.reward}</span></div>
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
      let arenaLeaderboardAgeGroup = currentAgeGroup();
      let leaderboardViewProvince = state.leaderboardProvince || "Đà Nẵng";
      const leaderboardProvinceOptions = () => window.LittleHeroLocations.provinces.map(({ name }) =>
        `<option value="${escapeHtml(name)}" ${leaderboardViewProvince === name ? "selected" : ""}>${escapeHtml(name)}</option>`
      ).join("");
      const leaderboardAgeGroupControl = (id) => `
        <label class="leaderboard-view-control" id="${id}Wrap"><span>Xem nhóm tuổi</span>
          <select id="${id}" aria-label="Chọn nhóm tuổi để xem bảng xếp hạng">
            <option value="3-6" ${arenaLeaderboardAgeGroup === "3-6" ? "selected" : ""}>3–6 tuổi</option>
            <option value="7-10" ${arenaLeaderboardAgeGroup === "7-10" ? "selected" : ""}>7–10 tuổi</option>
          </select>
        </label>`;
      const leaderboardLocationControl = (id) => `
        <label class="leaderboard-view-control" id="${id}Wrap"><span>Xem bảng theo tỉnh/thành</span>
          <select id="${id}" aria-label="Chọn tỉnh/thành để xem bảng xếp hạng">${leaderboardProvinceOptions()}</select>
        </label>`;
      const leaderboardScopeLabel = (mode, ageGroup = currentAgeGroup()) => {
        const groupLabel = translateTemplate("Nhóm {age} tuổi", { age: ageGroup.replace("-", "–") });
        const region = window.LittleHeroLocations.regions[window.LittleHeroLocations.regionByProvince[leaderboardViewProvince]];
        return ({
          duel: groupLabel,
          region: `${translateString(region)} · ${groupLabel}`,
          city: `${translateString(leaderboardViewProvince)} · ${groupLabel}`,
          nation: `${translateString("Toàn quốc")} · ${groupLabel}`
        }[mode]);
      };
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
      const renderLeaderboardResult = (root, result, offline = false) => {
        const players = (Array.isArray(result.players) ? result.players : []).slice(0, 10);
        const medals = ["🥇", "🥈", "🥉"];
        const podium = $("#leaderboardPodium", root);
        if (podium) {
          podium.hidden = false;
          podium.innerHTML = players.length
            ? players.slice(0, 3).map((player, index) =>
              `<div class="leader-podium-place place-${index + 1} ${player.isCurrentUser ? "is-you" : ""}">
                <span class="podium-medal">${medals[index]}</span><span class="podium-avatar">${escapeHtml(player.name.slice(0, 1).toLocaleUpperCase("vi"))}</span>
                <strong>${escapeHtml(player.name)}</strong><small>${escapeHtml(player.province)} · ${player.ageGroup.replace("-", "–")} tuổi</small>
                <b>${Number(player.points).toLocaleString(languageSpeechLocale())} RP</b><span class="podium-rank">#${player.rank}</span>
              </div>`
            ).join("")
            : `<div class="leaderboard-empty">
                <span aria-hidden="true">${offline ? "⚠️" : "🏆"}</span>
                <strong>${offline ? "Không thể tải bảng xếp hạng" : "Chưa có dữ liệu công khai"}</strong>
                ${offline ? "<p>Hãy thử lại khi kết nối máy chủ ổn định.</p>" : ""}
              </div>`;
        }
        $("#leaderboard", root).innerHTML = players.slice(3).map((player) =>
          `<div class="leader-row ${player.isCurrentUser ? "is-you" : ""}">
            <span class="medal">#${player.rank}</span>
            <span><span class="leader-name">${escapeHtml(player.name)}</span><br><span class="leader-sub">${escapeHtml(player.province)} · Nhóm ${player.ageGroup.replace("-", "–")} tuổi</span></span>
            <span class="leader-score">${Number(player.points).toLocaleString(languageSpeechLocale())} RP</span>
          </div>`
        ).join("");
        const you = $("#leaderYou", root);
        if (you) {
          you.innerHTML = result.you
            ? `<div class="leader-row"><span class="medal">🌟</span><span><span class="leader-name">Hạng của bé</span><br><span class="leader-sub">${escapeHtml(result.you.name)} · ${Number(result.you.points).toLocaleString(languageSpeechLocale())} RP</span></span><span class="leader-score">#${Number(result.you.rank).toLocaleString(languageSpeechLocale())}</span></div>`
            : "";
        }
        const updated = new Date(result.updatedAt);
        const message = offline
          ? "Chưa thể tải bảng xếp hạng. Vui lòng thử lại sau."
          : players.length
            ? `Cập nhật lúc ${updated.toLocaleTimeString(languageSpeechLocale(), { hour: "2-digit", minute: "2-digit", second: "2-digit" })} · tự làm mới mỗi 10 giây`
            : "";
        leaderboardStatus(root, message, offline);
      };
      const fetchLeaderboardWithRetry = async (url, token) => {
        for (let attempt = 0; attempt < 2; attempt += 1) {
          try {
            const response = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            if (response.status < 500 || attempt === 1) return response;
          } catch (error) {
            if (attempt === 1) {
              const networkError = new Error("Không thể kết nối máy chủ bảng xếp hạng.");
              networkError.name = "LeaderboardNetworkError";
              throw networkError;
            }
          }
          await new Promise((resolve) => window.setTimeout(resolve, 700));
        }
        throw new Error("Không thể kết nối máy chủ bảng xếp hạng.");
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
          await renderLeaderboard(
            route === "arena" ? $("#routeView") : document,
            arenaMode,
            route === "arena" ? arenaLeaderboardAgeGroup : currentAgeGroup()
          );
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
      const renderLeaderboard = async (root = document, mode = arenaMode, ageGroup = currentAgeGroup()) => {
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
        url.searchParams.set("ageGroup", ageGroup);
        if (province) url.searchParams.set("province", province);
        leaderboardStatus(root, "Đang cập nhật bảng xếp hạng…");
        try {
          const token = leaderboardToken();
          const response = await fetchLeaderboardWithRetry(url, token);
          if (requestId !== leaderboardRequestId) return;
          if (response.status >= 500) {
            console.error("Máy chủ bảng xếp hạng phản hồi lỗi.", response.status);
            renderLeaderboardResult(root, { players: [], you: null }, true);
            return;
          }
          const result = await response.json();
          if (!response.ok) {
            leaderboardStatus(root, result.error || "Không thể tải bảng xếp hạng.", true);
            return;
          }
          if (requestId !== leaderboardRequestId) return;
          renderLeaderboardResult(root, result);
        } catch (error) {
          if (requestId !== leaderboardRequestId) return;
          console.error("Không thể tải bảng xếp hạng.", error);
          if (error.name === "LeaderboardNetworkError") {
            renderLeaderboardResult(root, { players: [], you: null }, true);
            return;
          }
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
        buttons.forEach((button) => { button.disabled = true; button.classList.remove("try-again"); });
        recordLearningAttempt(lesson, answerIndex);
        if (answerIndex === lesson.correct) {
          buttons[answerIndex].classList.add("correct");
          celebrateCorrectAnswer(buttons[answerIndex]);
          const firstCompletion = !state.completed.includes(lesson.id);
          if (firstCompletion) {
            state.completed.push(lesson.id);
            awardXp(lesson.reward, buttons[answerIndex]);
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
          feedback.textContent = "";
          speak(translateString("Không sao, con hãy thử lại nhé."));
          buttons.forEach((button) => { button.disabled = false; });
        }
      };

      const openLesson = (lessonId) => {
        const lesson = lessonById(lessonId);
        if (!lesson) return;
        const category = categories.find((item) => item.id === lesson.category);
        showDialog(`<div class="dialog-head"><div><span class="tag">${category.icon} ${category.name}</span><h2 id="dialogTitle">${lesson.icon} ${lesson.title}</h2><p>${lesson.age} · ${lesson.duration} · Cùng bé thử nghĩ nhé.</p></div><button class="close-btn" data-close aria-label="Đóng">×</button></div>
          <div class="story-box"><strong>📖 Câu chuyện</strong><br>${lesson.story}</div>
          <div class="thinking-prompts"><strong style="font-size:11px">Gợi ý để bé suy nghĩ</strong>${lesson.prompts.slice(0, 1).map((text) => `<div>${text}</div>`).join("")}</div>
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
          <label class="form-label">Tên hiển thị của bé<input id="nameInput" maxlength="24" placeholder="Nhập tên bé" value="${escapeHtml(localizedChildName())}"></label>
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
        awardXp(challenge.reward);
        persist();
        toast(`Đã ghi nhận nỗ lực của bé · +${challenge.reward} sao! Hãy cùng phụ huynh thực hành nhé.`);
      };

      const openTutor = () => {
        setRoute("tutor");
      };

      const openPricing = () => {
        showDialog(`<div class="dialog-head"><div><span class="kicker">GÓI HỌC PREMIUM</span><h2 id="dialogTitle">Mở rộng hành trình khám phá</h2><p>49.000đ/tháng hoặc 399.000đ/năm.</p></div><button class="close-btn" data-close aria-label="Đóng">×</button></div>
          <div class="story-box"><strong>👑 Gói tháng:</strong> mở toàn bộ bài học Premium (khoảng một nửa thư viện) và trò chơi.<br><strong>👑 Gói năm:</strong> toàn bộ quyền lợi gói tháng và báo cáo tiến độ phụ huynh.</div>
          <p class="note">Tải ảnh bill ở bước thanh toán để mở Premium ngay. Hệ thống hiện chưa đối soát giao dịch với ngân hàng.</p>
          <button class="btn btn-primary" id="pricingOk">Đã hiểu</button>`);
        $("#pricingOk").addEventListener("click", closeDialog);
      };

      const openSound = () => {
        const supported = "speechSynthesis" in window;
        showDialog(`<div class="dialog-head"><div><span class="kicker">ÂM THANH & GIỌNG ĐỌC</span><h2 id="dialogTitle">Nghe Hero đọc nội dung</h2><p>Giọng đọc phụ thuộc trình duyệt và ngôn ngữ đã cài.</p></div><button class="close-btn" data-close aria-label="Đóng">×</button></div>
          <div class="story-box">${supported ? "Trình duyệt có hỗ trợ đọc văn bản. Nhấn nút dưới để nghe thử lời chào theo ngôn ngữ đã chọn." : "Trình duyệt này chưa hỗ trợ giọng đọc tự động."}</div>
          <button class="btn btn-mint" id="voicePreview" ${supported ? "" : "disabled"}>♫ Nghe Hero chào</button>
          <p class="note">Đoạn thử được đọc trực tiếp trên thiết bị, không phát âm thanh nếu chưa được người dùng bấm.</p>`);
        $("#voicePreview").addEventListener("click", () => {
          if (supported) {
            const language = languageConfig(state.language);
            const greeting = language.greeting(state.childName || language.friend);
            speak(greeting);
            state.sound = true;
            persist();
          }
        });
      };

      let arenaMode = "duel";
      let arenaOpponent = null;
      let arenaMatchTimeout = null;
      let arenaSearchRequestId = 0;
      let arenaSearchRequest = null;
      let arenaMatchLesson = null;
      let arenaMatchChoice = null;
      let arenaDemoSessionToken = "";
      const arenaMatchmakingToken = async () => {
        const accountToken = leaderboardToken();
        if (accountToken) return accountToken;
        if (!state.authenticated || !state.demoAccount) return "";
        if (arenaDemoSessionToken) return arenaDemoSessionToken;
        const response = await fetch(apiUrl("/api/arena/matchmaking/demo-session"), { method: "POST" });
        const result = await response.json();
        if (!response.ok || typeof result.token !== "string" || !result.token) {
          throw new Error(result.error || "Không thể mở phiên trải nghiệm lúc này.");
        }
        arenaDemoSessionToken = result.token;
        return arenaDemoSessionToken;
      };
      const releaseArenaSearch = async () => {
        if (arenaSearchRequest) {
          try { await arenaSearchRequest; }
          catch (error) { console.warn("Không thể hoàn tất yêu cầu ghép trận đang chờ trước khi hủy.", error); }
          arenaSearchRequest = null;
        }
        const token = leaderboardToken() || (state.demoAccount ? arenaDemoSessionToken : "");
        if (!token) return;
        try {
          const response = await fetch(apiUrl("/api/arena/matchmaking"), {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!response.ok && response.status !== 401) throw new Error(`HTTP ${response.status}`);
        } catch (error) {
          console.error("Không thể hủy tìm trận trên máy chủ.", error);
        }
      };
      const openQuiz = () => {
        const available = ageAppropriateLessons();
        const lesson = available[Math.floor(Math.random() * available.length)];
        showDialog(`<div class="dialog-head"><div><span class="kicker">THỬ THÁCH TÌNH HUỐNG</span><h2 id="dialogTitle">Một câu hỏi cùng Hero</h2><p>${lesson.age} · Tình huống: ${lesson.title}</p></div><button class="close-btn" data-close aria-label="Đóng">×</button></div>
          <div class="story-box">${lesson.story}</div><button class="btn btn-light btn-small" id="quizSpeak">♫ Nghe đề bài và các phương án</button><div class="answer-list">${lesson.answers.map((answer, index) => `<button class="answer" data-quiz-answer="${index}">${answer}</button>`).join("")}</div>
          <div class="feedback" id="quizFeedback" aria-live="polite"></div>`);
        $("#quizSpeak").addEventListener("click", () => speak(`${lesson.title}. ${lesson.story} Các phương án. ${lesson.answers.map((answer, index) => `Phương án ${index + 1}: ${answer}`).join(". ")}`));
        $("#dialogContent").querySelectorAll("[data-quiz-answer]").forEach((button) => button.addEventListener("click", () => {
          const index = Number(button.dataset.quizAnswer);
          const buttons = [...$("#dialogContent").querySelectorAll("[data-quiz-answer]")];
          if (index === lesson.correct) {
            buttons.forEach((item) => { item.disabled = true; });
            state.quiz += 1;
            state.dailyQuiz += 1;
            button.classList.add("correct");
            celebrateCorrectAnswer(button);
            awardXp(5, button);
            state.rp += 25;
            $("#quizFeedback").textContent = "Kết quả thành công! Bé chọn cách an toàn. +5 sao · +25 RP 🌟";
            speak(`Tuyệt vời! Con đã chọn cách phù hợp. ${lesson.prompts[2] || lesson.goal}`);
          } else {
            button.classList.add("try-again");
            button.disabled = true;
            $("#quizFeedback").textContent = "";
            speak(`Không sao, con thử lại nhé. ${lesson.prompts[1] || lesson.goal}`);
            window.setTimeout(() => { if (button.isConnected) button.disabled = false; }, 250);
          }
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
      const accountFeatureRoutes = new Set(["map", "lesson", "quiz", "games", "quests", "achievements", "child", "parents", "arena", "arena-match", "payment", "premium-success"]);
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
        vi: { home: "Trang chủ", map: "Bản đồ ốc đảo", emotions: "Bản đồ cảm xúc", lessons: "Kho bài học", stories: "Truyện tranh", storybook: "Sách truyện", games: "Trò chơi", quests: "Nhiệm vụ hằng ngày", quiz: "Bài ôn tập", achievements: "Tường thành tích", child: "Của bé", reviews: "Đánh giá ứng dụng", forum: "Diễn đàn", faq: "Câu hỏi thường gặp", language: "Ngôn ngữ", tutor: "Hỏi Hero", parents: "Góc phụ huynh", "parent-news": "Tin tức", auth: "Tài khoản", pricing: "Gói Premium", payment: "Thanh toán Premium", arena: "Đấu trường" },
        en: { home: "Home", map: "Island map", emotions: "Emotion map", lessons: "Lessons", stories: "Stories", storybook: "Storybook", games: "Games", quests: "Daily quests", quiz: "Review activities", achievements: "Achievements", child: "My space", reviews: "App reviews", forum: "Community", faq: "FAQs", language: "Language", tutor: "Ask Hero", parents: "Parent corner", "parent-news": "News", auth: "Account", pricing: "Premium plans", payment: "Premium payment", arena: "Challenge arena" }
      };
      const pageTitle = (name) => translateString(localizedTitles.vi[name] || name);
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
        "Phương án": "Option",
        "Đang nghe… khi bé ngừng nói, Hero sẽ tự xử lý câu trả lời.": "Listening… Hero will check your answer when you finish speaking.",
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
        " phút": " min",
        " ngày": " days",
        "✦ HỌC KỸ NĂNG SỐNG QUA TRẢI NGHIỆM · 3–10 TUỔI": "✦ LIFE SKILLS THROUGH EXPERIENCE · AGES 3–10",
        "▶ \u00a0Bắt đầu bài học": "▶ \u00a0Start a lesson",
        "Khám phá chủ đề →": "Explore this topic →",
        "Tiến bộ nhỏ cũng đáng tự hào.": "Every bit of progress is worth celebrating.",
        "Chọn một bài học để Hero tìm hoạt động phù hợp cùng bé.": "Choose a lesson and Hero will find an activity that suits you.",
        "Thành phố Hồ Chí Minh": "Ho Chi Minh City",
        "Cài đặt giọng đọc": "Voice settings",
        "Âm thanh": "Sound",
        "Đổi giao diện": "Switch theme",
        "Điều hướng chính": "Main navigation",
        "Sao tích lũy": "Stars earned",
        "Tiến độ cấp ": "Progress to level ",
        "Tiến độ ": "Progress ",
        "Tiến độ cấp độ": "Level progress",
        "Chuyển sang giao diện tối": "Switch to dark theme",
        "Chuyển sang giao diện sáng": "Switch to light theme",
        "Hero cá nhân hóa": "Your personalized Hero",
        "Hero đồng hành cùng bé": "Hero is here to help",
        "Chọn nhóm tuổi để xem bảng xếp hạng": "Choose an age group to view the leaderboard",
        "Chọn tỉnh/thành để xem bảng xếp hạng": "Choose a province or city to view the leaderboard",
        "Chọn cảm xúc": "Choose a feeling",
        "Nhiệm vụ và tiến độ được lưu trên thiết bị hiện tại.": "Quests and progress are saved on this device.",
        "Khám phá 8 ốc đảo kỹ năng; chọn một hòn đảo để mở bài học. Rê chuột hoặc dùng phím Tab để xem nội dung điểm dừng.": "Explore 8 skill islands and select one to open a lesson. Hover or use Tab to preview each stop.",
        "✨ Chọn một ốc đảo để bắt đầu": "✨ Choose an island to get started",
        "Di chuột, chạm hoặc dùng phím Tab để hiện tên chủ đề và bài học, rồi chọn đảo để bắt đầu.": "Hover, tap, or use Tab to preview a topic and lesson, then select an island to begin.",
        "Bản đồ chi tiết gồm 8 ốc đảo và các bài học": "Detailed map with 8 islands and lessons",
        "Bắt đầu bài học": "Start a lesson",
        "▶ Bắt đầu bài học": "▶ Start a lesson",
        "ĐIỂM ": "STOP ",
        "Nhận thưởng": "Claim reward",
        "Tin nhắn trò chuyện": "Chat messages",
        "Bật micro, nói câu hỏi rồi nhấn lần nữa để gửi": "Turn on the microphone, ask your question, then press again to send.",
        "Đăng nhập để bắt đầu bài học và lưu tiến độ của bé.": "Sign in to start lessons and save your child's progress.",
        "Thích": "Like",
        "Yêu thích": "Love",
        "Vỗ tay": "Applaud",
        "Đồng cảm": "Support",
        "Các bạn nhỏ cùng Hero nhận biết cảm xúc trong phòng chơi": "Children learn to recognize feelings with Hero in a playroom",
        "Hero và bạn cùng học trong lớp mỹ thuật": "Hero and a friend learn together in an art classroom",
        "Hero thực hành kỹ năng an toàn tại quầy thông tin": "Hero practices safety skills at an information desk",
        "Hero hướng dẫn Mia rửa tay trong bếp": "Hero shows Mia how to wash her hands in the kitchen",
        "Các bạn nhỏ cùng Hero suy nghĩ và giải quyết tình huống": "Children and Hero think through a situation together",
        "Hero và Linh cùng giữ sân chơi sạch đẹp": "Hero and Linh keep the playground clean",
        "Hero và bố hướng dẫn Bin tập xe an toàn": "Hero and Dad teach Bin to ride a bike safely",
        "Hero thực hành nhận biết và xử lý tình huống an toàn": "Hero practices recognizing and handling a safety situation",
        "Họ và tên phụ huynh": "Parent's full name",
        "Số điện thoại (+84)": "Phone number (+84)",
        "Mật khẩu (từ 8 ký tự)": "Password (at least 8 characters)",
        "Nhập lại mật khẩu": "Re-enter password",
        "Nhập mã 6 chữ số": "Enter the 6-digit code",
        "Từ 8 đến 128 ký tự": "8 to 128 characters",
        "Mở menu": "Open menu",
        "Mở hồ sơ của bé": "Open your child's profile",
        "Nghe Hero chào": "Hear Hero say hello",
        "Chế độ xem trước": "Preview mode",
        "🏝️Tất cả chủ đề": "🏝️All topics",
        "🌐Tất cả chủ đề": "🌐All topics",
        "🗺️Bản đồ khám phá": "🗺️Discovery map",
        "💛Bản đồ cảm xúc": "💛Feelings map",
        "🧩Ôn tập cùng Hero": "🧩Practice with Hero",
        "🏅Huy hiệu của bé": "🏅Your badges",
        "👨‍👩‍👧 Góc phụ huynh": "👨‍👩‍👧 Parents' corner",
        "Đăng nhập để học →": "Sign in to learn →",
        "Đăng nhập / đăng ký để tham gia": "Sign in / Register to join",
        "Trò chơi thuộc thư viện Premium": "Games are part of the Premium library",
        "Xem các gói Premium →": "View Premium plans →",
        "Về kho bài học": "Back to the lesson library",
        "THÁCH THỨC": "CHALLENGES",
        "TIẾT KIỆM HƠN": "SAVE MORE",
        "/tháng": "/month",
        "/năm": "/year",
        "Thông tin chuyển khoản": "Bank transfer details",
        "Ngân hàng": "Bank",
        "Người nhận": "Account holder",
        "Số tài khoản": "Account number",
        "Số tiền": "Amount",
        "Nội dung": "Transfer note",
        "Sao chép số tài khoản": "Copy account number",
        "Sao chép nội dung": "Copy transfer note",
        "←Chọn gói khác": "←Change plan",
        "❔Hỏi đáp thanh toán": "❔Payment FAQs",
        "Ảnh bill đã chọn": "Selected receipt image",
        "Tải ảnh bill chuyển khoản": "Upload transfer receipt",
        "🖼️ Chọn ảnh bill từ thiết bị": "🖼️ Choose a receipt image",
        "Xem trước ảnh (tài khoản trải nghiệm)": "Preview image (demo account)",
        "Tiếp tục trải nghiệm Premium": "Continue with Premium",
        "Xác nhận & mở Premium": "Confirm & unlock Premium",
        "THANH TOÁN AN TOÀN": "SECURE CHECKOUT",
        "Tình huống gần gũi": "Everyday scenario",
        "Đọc tình huống rồi chọn cách xử lý phù hợp.": "Read the scenario and choose a helpful response.",
        "Con sẽ chọn cách nào?": "What would you choose?",
        "Chọn cách con nghĩ là phù hợp nhé.": "Choose the response you think is best.",
        "♫ Nghe tình huống": "♫ Listen to the scenario",
        "Câu tiếp theo →": "Next question →",
        "Hoàn thành →": "Finish →",
        "Câu chuyện tiếp theo · Câu ": "Next story · Question ",
        "Đọc tình huống rồi chọn một phương án phù hợp.": "Read the scenario and choose a helpful response.",
        "Góc riêng để bé xem hành trình và chọn hoạt động tiếp theo.": "A space to follow your learning journey and choose what to do next.",
        "Mỗi bước con thử sức đều đáng tự hào.": "Every step you take is worth celebrating.",
        "Cấp ": "Level ",
        " sao": " stars",
        " đến cấp tiếp theo": " to the next level",
        "Bản đồ khám phá": "Discovery map",
        "Bản đồ cảm xúc": "Feelings map",
        "Ôn tập cùng Hero": "Practice with Hero",
        "Huy hiệu của bé": "Your badges",
        "Góc phụ huynh": "Parents' corner",
        "Đang cố gắng": "In progress",
        "Đã mở khóa": "Unlocked",
        "Bước đầu tiên": "First steps",
        "Hoàn thành bài học đầu tiên": "Complete your first lesson",
        "Ngày chăm chỉ": "Learning streak",
        "Học xong bài trong một ngày": "Complete a lesson in one day",
        "Người suy nghĩ": "Thoughtful thinker",
        "Hoàn thành một bài kiểm tra": "Complete a quiz",
        "Người bạn tốt": "Kind friend",
        "Xác nhận một thử thách ngoài đời": "Complete an offline challenge",
        "Nhà khám phá": "Explorer",
        "Hoàn thành ba chủ đề": "Complete three topics",
        "Ngôi sao nhỏ": "Little star",
        "Tích lũy 50 sao": "Earn 50 stars",
        " lần": " times",
        " mốc": " milestones",
        "Bạn muốn chia sẻ điều gì?": "What would you like to share?",
        "Trạng thái": "What's on your mind?",
        "Chia sẻ một khoảnh khắc học tập vui vẻ…": "Share a happy learning moment…",
        "🖼️ Ảnh / video": "🖼️ Photo / video",
        "Đăng lên bảng tin": "Post to the community",
        "Ảnh/video chỉ xem được trong phiên trình duyệt này, không tải lên máy chủ. Không chia sẻ thông tin riêng tư của trẻ.": "Photos and videos are only available during this browser session and are not uploaded. Do not share a child's private information.",
        "Cộng đồng an toàn": "A safe community",
        "Bài viết chỉ lưu trên thiết bị này. Chỉ chia sẻ nội dung phù hợp và tránh đăng thông tin nhận dạng trẻ.": "Posts are saved only on this device. Share appropriate content and avoid identifying a child.",
        "Tương tác": "Interactions",
        "Thích, cảm xúc, bình luận và đăng lại chỉ hiển thị trên thiết bị này.": "Likes, reactions, comments, and reposts are visible only on this device.",
        "Chào mừng đến bảng tin Little Hero": "Welcome to the Little Hero community",
        "Chưa có bài chia sẻ. Hãy đăng trạng thái đầu tiên.": "No posts yet. Share the first update.",
        "Bài mẫu": "Sample post",
        " · Cộng đồng Little Hero": " · Little Hero community",
        " · đã đăng lại": " · reposted",
        " · Lưu trên thiết bị": " · Saved on this device",
        " cảm xúc": " reactions",
        " bình luận": " comments",
        " lượt chia sẻ": " shares",
        "💚 Đã thích": "💚 Liked",
        "♡ Thích": "♡ Like",
        "💬 Bình luận": "💬 Comment",
        "↗ Chia sẻ": "↗ Share",
        "⟳ Đăng lại": "⟳ Repost",
        "Yêu thích": "Love",
        "Vỗ tay": "Applause",
        "Đồng cảm": "Support",
        "Thả cảm xúc": "Add a reaction",
        "Viết bình luận": "Write a comment",
        "Viết bình luận tử tế…": "Write a kind comment…",
        "Gửi": "Send",
        "Gia đình Mây": "Cloud Family",
        "Gia đình Thỏ": "Rabbit Family",
        "Gia đình Cầu Vồng": "Rainbow Family",
        "Nhà Thỏ": "Rabbit House",
        "Hôm nay bé đã biết chờ đến lượt và nhường bạn chọn trò chơi trước. Một hành động nhỏ mà cả nhà đều vui! 🌱": "Today, the child waited for their turn and let a friend choose the game first. A small act that made the whole family happy! 🌱",
        "Cùng ghi nhận những điều tử tế mỗi ngày nhé! 💚": "Let's notice kind acts every day! 💚",
        "Cả nhà vừa cùng Hero ôn lại quy tắc an toàn khi đi chơi: luôn ở gần người lớn và nhờ cô chú đáng tin cậy giúp đỡ khi cần. 🛡️": "Our family reviewed safety rules with Hero: stay near an adult and ask a trusted grown-up for help when needed. 🛡️",
        "Ôn lại cùng nhau giúp bé nhớ lâu hơn ạ!": "Reviewing together helps children remember!",
        "Góc đọc truyện cuối tuần: bé tự chọn cách giúp bạn trong câu chuyện rồi kể lại vì sao mình chọn như vậy. 📚✨": "Weekend story time: the child chose how to help a friend in the story and explained why. 📚✨",
        "Thật vui khi được nghe suy nghĩ của các bé!": "It's lovely to hear what children are thinking!",
        "Một số câu hỏi thường gặp về cách sử dụng Little Hero.": "Answers to common questions about using Little Hero.",
        "Little Hero phù hợp với độ tuổi nào?": "What ages is Little Hero for?",
        "Nội dung hướng đến trẻ 3–10 tuổi. Phụ huynh nên đồng hành và điều chỉnh hoạt động theo khả năng của mỗi bé.": "Little Hero is designed for children ages 3–10. Parents should join in and adapt activities to each child's abilities.",
        "Làm sao để lưu tiến độ?": "How is progress saved?",
        "Tiến độ học được lưu trong trình duyệt trên thiết bị hiện tại; tài khoản đăng nhập lưu ở máy chủ nhưng tiến độ chưa đồng bộ giữa các thiết bị.": "Learning progress is saved in this browser. Account details are stored on the server, but progress is not yet synced between devices.",
        "Làm sao để khôi phục mật khẩu?": "How can I reset my password?",
        "Tại trang đăng nhập, chọn “Quên mật khẩu?” rồi nhận mã xác minh qua email hoặc số điện thoại đã đăng ký. Máy chủ cần được cấu hình dịch vụ gửi email hoặc SMS.": "On the sign-in page, choose “Forgot password?” to receive a verification code by email or phone. The server must be configured to send email or SMS.",
        "Các tình huống có thay thế tư vấn chuyên gia không?": "Does this replace professional advice?",
        "Không. Nội dung là gợi ý giáo dục tổng quát, không thay thế tư vấn của chuyên gia giáo dục, tâm lý hoặc y tế.": "No. This is general educational guidance, not a substitute for advice from an education, mental health, or medical professional.",
        "Đăng nhập Google đã hoạt động chưa?": "Is Google sign-in available?",
        "Chưa. Cần tạo Google OAuth Client ID và dịch vụ máy chủ xác thực token trước khi đưa đăng nhập thật vào sử dụng.": "Not yet. A Google OAuth client ID and a server-side token verification service must be set up before Google sign-in can be enabled.",
        "Thanh toán Premium có thể chuyển khoản chưa?": "Can I pay for Premium by bank transfer?",
        "Có thể chuyển khoản theo thông tin tại trang thanh toán. Sau khi chuyển, tải ảnh bill lên để mở Premium ngay. Hệ thống chưa đối soát ảnh với ngân hàng.": "Yes. Use the bank details on the payment page, then upload a receipt image to unlock Premium. Receipts are not verified with the bank.",
        "Ứng dụng lưu những thông tin nào?": "What information does the app store?",
        "Họ tên phụ huynh, email, số điện thoại, trạng thái Premium và ảnh bill mới nhất được lưu trong SQLite trên máy chủ; ảnh cũ được thay thế khi tải ảnh mới. Hồ sơ và tiến độ học của bé vẫn lưu cục bộ trên trình duyệt. Hosting miễn phí hiện dùng dữ liệu tạm nên thông tin máy chủ có thể mất khi khởi động lại hoặc triển khai lại.": "A parent's name, email, phone number, Premium status, and latest receipt image are stored in server-side SQLite; a new receipt replaces the old one. A child's profile and progress stay in this browser. The current free hosting uses temporary storage, so server data may be lost after a restart or redeployment.",
        "Chào mừng trở lại!": "Welcome back!",
        "Đăng nhập để tiếp tục hành trình cùng Hero": "Sign in to continue your journey with Hero",
        "Đăng nhập để tiếp tục hành trình; nếu chưa có tài khoản, chọn đăng ký bên dưới.": "Sign in to continue your journey, or register below to create an account.",
        "Email đã đăng ký": "Registered email",
        "Mật khẩu": "Password",
        "Hiện mật khẩu": "Show password",
        "Ghi nhớ email": "Remember email",
        "Quên mật khẩu?": "Forgot password?",
        "Bạn chưa có tài khoản?": "Don't have an account?",
        "Đăng ký ngay": "Register now",
        "Hoặc vào với tài khoản trải nghiệm": "Or continue with a demo account",
        "Tạo tài khoản mới": "Create a new account",
        "Cùng bé bắt đầu hành trình khám phá nhé!": "Start an adventure of discovery with your child!",
        "Xem trước các công cụ đồng hành cùng gia đình. Dữ liệu hồ sơ và tiến độ chỉ hiển thị sau khi đăng nhập và xác nhận phụ huynh.": "Preview tools for supporting your family. Profile and progress details appear after a parent signs in and confirms access.",
        "Xem bài học đã hoàn thành, thời gian học và các kỹ năng bé đang khám phá.": "Review completed lessons, learning time, and the skills your child is exploring.",
        "Quản lý hồ sơ": "Manage profiles",
        "Tạo hồ sơ riêng cho từng bé và chuyển đổi giữa các hành trình học tập.": "Create a profile for each child and switch between learning journeys.",
        "Đồng hành an toàn": "Safe support",
        "Tham khảo cài đặt thời gian, nội dung và hoạt động thực hành tại nhà.": "Explore time and content settings, plus activities to practice at home.",
        "Đăng nhập để tiếp tục": "Sign in to continue",
        "Đấu trường nhóm 3–6 tuổi · nội dung và câu hỏi được chọn theo độ tuổi của bé.": "Challenge arena for ages 3–6 · activities and questions are tailored to your child's age.",
        "Đấu trường nhóm 7–10 tuổi · nội dung và câu hỏi được chọn theo độ tuổi của bé.": "Challenge arena for ages 7–10 · activities and questions are tailored to your child's age.",
        "Tìm người chơi thật cùng nhóm tuổi; nếu chưa có, sau 10 giây hệ thống sẽ bắt đầu thử thách với bot.": "Searching for a real player in your age group. If none is available, a challenge against a bot will start after 10 seconds.",
        "👤 \u00a0Hồ sơ của bé": "👤 Your profile",
        "🏅 \u00a0Thành tích": "🏅 Achievements",
        "🗺️ \u00a0Bản đồ học tập": "🗺️ Learning map",
        "💛 \u00a0Bản đồ cảm xúc": "💛 Feelings map",
        "🧩 \u00a0Ôn luyện": "🧩 Practice",
        "📔 \u00a0Nhật ký học tập": "📔 Learning journal",
        "📰 \u00a0Bài viết cho ba mẹ": "📰 Articles for parents",
        "❔ \u00a0Trợ giúp": "❔ Help",
        "💬 \u00a0Bảng tin trên thiết bị này": "💬 Community board on this device",
        "Các bạn nhỏ cùng Hero nhận biết cảm xúc trong phòng chơi": "Children learn to recognize feelings with Hero in a playroom",
        "Tính năng truyện đọc đang được đội ngũ LITTLE HERO xây dựng và phát triển": "The LITTLE HERO team is developing the story feature",
        "♫ Nghe Hero chào": "♫ Hear Hero say hello",
        "CÙNG CON HỌC ĐIỀU HAY": "LEARN GOOD THINGS TOGETHER",
        "Học qua tình huống,": "Learn through real-life situations,",
        "thực hành ngoài đời.": "and practice in everyday life.",
        "Phụ huynh có thể cùng bé thử một việc nhỏ mỗi ngày và ghi nhận nỗ lực của con. Trải nghiệm xác nhận trong trang này chỉ lưu trên thiết bị hiện tại.": "Parents can try one small activity with their child each day and celebrate their effort. Confirmed activities on this page are saved only on this device.",
        "Xác nhận": "Confirm",
        "Nhà Hero": "Home",
        "Học tập": "Learning",
        "Thử thách": "Challenges",
        "Của bé": "My space",
        "Mỗi hoạt động là một cơ hội để bé tự suy nghĩ, chọn cách xử lý và học thêm điều hữu ích cho cuộc sống.": "Every activity gives children a chance to think for themselves, choose how to respond, and learn something useful for everyday life.",
        "Chào bạn! Sẵn sàng chưa? ✨": "Hello, friend! Ready to explore? ✨",
        "✦ Dũng cảm thử điều mới": "✦ Be brave and try something new",
        "+10 sao chờ bé!": "+10 stars are waiting for you!",
        "🎯 Nhiệm vụ hôm nay": "🎯 Today's quests",
        "Nhiệm vụ hôm nay": "Today's quests",
        "Mỗi bước nhỏ đều đáng khen.": "Every small step deserves a cheer.",
        "Nhận sao ✨": "Collect stars ✨",
        "MỘT THẾ GIỚI HỌC TẬP CÙNG HERO": "A WORLD OF LEARNING WITH HERO",
        "Little Hero là nền tảng học kỹ năng sống qua hình ảnh, tình huống thực tế và trò chơi tương tác, giúp trẻ tự tin, an toàn và trưởng thành hơn mỗi ngày.": "Little Hero helps children build life skills through illustrations, real-life scenarios, and interactive games, growing more confident and capable every day.",
        "Hình ảnh sinh động, gần gũi với trẻ.": "Bright, familiar illustrations made for children.",
        "Nội dung lành mạnh, có người lớn đồng hành.": "Child-friendly content with an adult alongside.",
        "Học mà chơi, nhớ lâu hơn.": "Learning through play helps ideas stick.",
        "Phát triển tư duy": "Build thinking skills",
        "Giúp trẻ hiểu và xử lý tình huống tốt hơn.": "Help children understand situations and respond thoughtfully.",
        "Tự tin & độc lập": "Confidence & independence",
        "Trẻ biết tự chăm sóc và đưa ra quyết định.": "Children learn to care for themselves and make decisions.",
        "Giao tiếp & ứng xử": "Communication & kindness",
        "Trẻ biết yêu thương, tôn trọng mọi người.": "Children learn to care for and respect others.",
        "Hành trang tương lai": "Skills for the future",
        "Nền tảng quan trọng để trưởng thành hạnh phúc.": "A foundation for growing up happy and capable.",
        "Gắn kết gia đình": "Stronger family bonds",
        "Cùng học — cùng chơi — cùng phát triển.": "Learn together, play together, and grow together.",
        "Đọc bài viết liên quan →": "Read a related article →",
        "HỌC QUA TRẢI NGHIỆM · TIẾN BỘ TỪNG BƯỚC": "LEARN BY DOING · GROW STEP BY STEP",
        "Mỗi bài học giúp bé khám phá tình huống, lựa chọn cách ứng xử và cùng Hero tiến bộ.": "Each lesson helps children explore a situation, choose how to respond, and grow with Hero.",
        "Xem tình huống": "Explore a scenario",
        "Bé xem câu chuyện gần gũi trong cuộc sống.": "See a story inspired by everyday life.",
        "Chọn phản ứng": "Choose a response",
        "Bé chọn cách xử lý phù hợp cho tình huống.": "Choose a helpful response to the situation.",
        "Chơi mini game": "Play a mini-game",
        "Bé học qua trò chơi tương tác vui nhộn.": "Learn through fun, interactive games.",
        "Nhận phần thưởng": "Earn rewards",
        "Bé tích lũy sao và ghi nhận nỗ lực.": "Collect stars and celebrate each effort.",
        "Khám phá khóa học": "Explore lessons",
        "HỌC MỘT CHÚT, LỚN MỘT CHÚT": "LEARN A LITTLE, GROW A LITTLE",
        "Gợi ý học tập hôm nay": "Today's learning pick",
        "Tình huống gần gũi để bé tập cách ứng xử an toàn.": "A familiar scenario to practice making safe choices.",
        "Đổi gợi ý ↻": "Show another suggestion ↻",
        "Đấu trường nhóm": "Challenge arena · age group",
        "THI ĐUA LÀNH MẠNH": "FRIENDLY CHALLENGES",
        "Cùng bạn chinh phục thử thách": "Take on challenges with friends",
        "Cùng ôn bài, luyện suy nghĩ và ghi nhận nỗ lực mỗi ngày.": "Review, practice thinking, and celebrate progress every day.",
        "HERO ARENA · HỌC QUA THỬ THÁCH": "HERO ARENA · LEARN THROUGH CHALLENGES",
        "Chơi vui, rèn kỹ năng, tự tin hơn.": "Play, practice life skills, and grow in confidence.",
        "Cùng Hero xử lý tình huống gần gũi, tích lũy điểm RP và khám phá cách lựa chọn an toàn. Mỗi lượt chơi là một cơ hội học hỏi — không áp lực thắng thua.": "Work through familiar situations with Hero, earn RP, and explore safe choices. Every round is a chance to learn—there's no pressure to win or lose.",
        "Cách tham gia Hero Arena": "How to play Hero Arena",
        "Chọn thử thách": "Choose a challenge",
        "Đấu cùng nhóm tuổi": "Match with your age group",
        "Suy nghĩ & lựa chọn": "Think & choose",
        "Luyện kỹ năng sống": "Practice life skills",
        "Nhận điểm RP": "Earn RP",
        "Ghi nhận nỗ lực": "Celebrate your effort",
        "điểm rèn luyện của bé": "Your practice points",
        "Đấu 1v1": "1v1",
        "Khu vực": "Region",
        "Thành phố": "City",
        "Toàn quốc": "Nationwide",
        "⚡ Bắt đầu thử thách": "⚡ Start a challenge",
        "Nhóm tuổi · thành tích RP": "Age group · RP standings",
        "Truyện tương tác": "Interactive stories",
        "GÓC CHIA SẺ GIA ĐÌNH": "FAMILY STORIES",
        "Phản hồi chỉ hiển thị khi được người dùng gửi; chúng tôi không tạo nhận xét thay phụ huynh.": "Only submitted feedback is shown; we never write reviews on a parent's behalf.",
        "GÓI HỌC LINH HOẠT": "FLEXIBLE PLANS",
        "Bắt đầu miễn phí, nâng cấp khi sẵn sàng": "Start for free and upgrade when you're ready",
        "Phụ huynh có thể chọn gói phù hợp với gia đình.": "Parents can choose a plan that works for their family.",
        "Hành trang Tự Tin": "Confident Steps",
        "Mở khóa toàn bộ bài học Premium (khoảng một nửa thư viện)": "Unlock all Premium lessons (about half of the library)",
        "Trò chơi tương tác": "Interactive games",
        "49.000đ": "VND 49,000",
        "/ tháng": "/ month",
        "Cùng Hero Mỗi Ngày": "Every Day with Hero",
        "399.000đ": "VND 399,000",
        "/ năm": "/ year",
        "8 bài học nền tảng luôn miễn phí.": "Eight foundational lessons are always free.",
        "CHUYẾN PHIÊU LƯU ĐANG CHỜ BÉ": "YOUR ADVENTURE IS WAITING",
        "Đăng ký ngay để bé nhận những bài học thú vị và phần thưởng hấp dẫn mỗi ngày.": "Sign up so your child can enjoy fun lessons and exciting rewards every day.",
        "Tạo tài khoản miễn phí": "Create a free account",
        "Cùng Little Hero đồng hành trong hành trình lớn khôn của bé.": "Join Little Hero in supporting your child's growth.",
        "Cùng bé học điều hay mỗi ngày": "Learning something good together every day",
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
        "Chưa thể tải bảng xếp hạng. Vui lòng thử lại sau.": "Could not load the leaderboard. Please try again later.",
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
        "Chọn gói tháng hoặc năm, tải ảnh bill lên ở bước thanh toán để mở khóa nội dung.": "Choose a monthly or yearly plan and upload a receipt image at checkout to unlock this content.",
        "Báo cáo tiến độ chi tiết chỉ mở sau khi tải ảnh bill của gói năm lên.": "Detailed progress reports unlock after you upload a receipt image for the yearly plan.",
        "Có thể chuyển khoản theo thông tin tại trang thanh toán. Sau khi chuyển, tải ảnh bill lên để mở Premium ngay. Hệ thống chưa đối soát ảnh với ngân hàng.": "You can transfer using the payment details on the checkout page. Upload a receipt image after transferring to unlock Premium immediately. The image is not checked against bank records.",
        "Ba mẹ có thể xem thông tin gói. Tải ảnh bill lên để mở Premium ngay; giao dịch chưa được đối soát tự động với ngân hàng.": "You can review the plans. Upload a receipt image to unlock Premium immediately; transfers are not automatically checked with the bank.",
        "Chọn thời hạn phù hợp. Tải ảnh bill lên ở bước thanh toán để mở Premium ngay.": "Choose a plan duration. Upload a receipt image at checkout to unlock Premium immediately.",
        "Sau khi chuyển khoản, tải ảnh bill lên và nhấn xác nhận để mở Premium ngay. Ảnh được lưu riêng theo tài khoản; hệ thống chưa đối soát ảnh với ngân hàng, nên chỉ tải bill của giao dịch thực tế. Hãy kiểm tra kỹ người nhận và số tiền trước khi chuyển.": "After transferring, upload your receipt image and confirm to unlock Premium immediately. The image is stored with your account but is not checked against bank records; only upload a receipt for a real transfer. Check the recipient and amount before sending money.",
        "Mở ứng dụng ngân hàng, chọn chuyển khoản đến MB Bank rồi nhập đúng người nhận, số tài khoản, số tiền và nội dung bên trên. Sau khi chuyển khoản thành công, tải ảnh bill lên để xác nhận. Ảnh chưa được đối soát tự động với ngân hàng; hãy kiểm tra kỹ thông tin trước khi chuyển.": "Open your banking app, choose a transfer to MB Bank, and enter the recipient, account number, amount, and transfer note shown above. After the transfer succeeds, upload the receipt to confirm. Receipts are not automatically verified with the bank; check all details before sending.",
        "Họ tên phụ huynh, email, số điện thoại, trạng thái Premium và ảnh bill mới nhất được lưu trong SQLite trên máy chủ; ảnh cũ được thay thế khi tải ảnh mới. Hồ sơ và tiến độ học của bé vẫn lưu cục bộ trên trình duyệt. Hosting miễn phí hiện dùng dữ liệu tạm nên thông tin máy chủ có thể mất khi khởi động lại hoặc triển khai lại.": "A parent's name, email, phone number, Premium status, and latest receipt image are stored in server-side SQLite; uploading a new image replaces the old one. A child's profile and learning progress remain in this browser. The current free hosting uses temporary storage, so server data may be lost on restart or redeployment.",
        "Tải ảnh bill chuyển khoản": "Upload transfer receipt",
        "🖼️ Chọn ảnh bill từ thiết bị": "🖼️ Choose a receipt image",
        "Chọn ảnh bill PNG, JPEG hoặc WebP (tối đa 5 MB). Sau khi gửi ảnh, Premium được mở ngay.": "Choose a PNG, JPEG, or WebP receipt image (up to 5 MB). Premium unlocks immediately after upload.",
        "Chế độ trải nghiệm: Premium đã mở. Có thể chọn ảnh để xem trước trên thiết bị; ảnh không được gửi lên máy chủ và không thực hiện thanh toán.": "Demo mode: Premium is unlocked. Select an image to preview on this device; it is not sent to the server and no payment is made.",
        "Ảnh được chọn để xem trước trên thiết bị; không tải lên máy chủ.": "Image selected for preview on this device; it is not uploaded to the server.",
        "Tiếp tục trải nghiệm Premium": "Continue trying Premium",
        "Xem trước ảnh (tài khoản trải nghiệm)": "Preview image (demo account)",
        "Premium đã mở cho tài khoản trải nghiệm.": "Premium is unlocked for the demo account.",
        "Tài khoản trải nghiệm được dùng các tính năng Premium mà không cần chuyển khoản.": "The demo account can use Premium features without making a payment.",
        "Ảnh bill chỉ được xem trước trên thiết bị; không có giao dịch hoặc tải ảnh lên máy chủ.": "The receipt image is only previewed on this device; no payment is made and no image is uploaded to the server.",
        "Hãy đăng nhập tài khoản để tải ảnh bill và kích hoạt Premium.": "Sign in to upload a receipt and activate Premium.",
        "Xác nhận & mở Premium": "Confirm & unlock Premium",
        "Tệp phải là ảnh PNG, JPEG hoặc WebP.": "The file must be a PNG, JPEG, or WebP image.",
        "Ảnh bill phải có dung lượng từ 1 byte đến 5 MB.": "The receipt image must be between 1 byte and 5 MB.",
        "Đang tải ảnh bill và kích hoạt Premium…": "Uploading receipt and activating Premium…",
        "Phiên đăng nhập không hợp lệ. Hãy đăng nhập lại rồi thử lại.": "Your session is invalid. Sign in again and retry.",
        "Máy chủ chưa kích hoạt gói Premium. Vui lòng thử lại.": "The server has not activated Premium. Please try again.",
        "Không thể gửi ảnh bill. Vui lòng thử lại.": "Could not upload the receipt. Please try again.",
        "Gói Premium đang hoạt động": "Premium is active",
        "Chưa có gói Premium đang hoạt động": "No active Premium plan",
        "Ảnh bill đã được gửi và gói Premium đã mở. Bé có thể tiếp tục khám phá các bài học.": "The receipt image was uploaded and Premium is active. Your child can continue exploring lessons.",
        "Gói Premium sẽ được mở ngay khi máy chủ nhận ảnh bill.": "Premium unlocks as soon as the server receives the receipt image.",
        "Tùy chọn ngôn ngữ": "Language settings",
        "GIA ĐÌNH": "FAMILY",
        "HỖ TRỢ GIA ĐÌNH": "FAMILY SUPPORT",
        "ĐÁNH GIÁ ỨNG DỤNG": "APP REVIEWS",
        "KHO BÀI HỌC": "LESSON LIBRARY",
        "THỬ THÁCH": "CHALLENGES",
        "Chọn cảm xúc gần với con nhất hôm nay. Cảm xúc nào cũng bình thường; đây là hoạt động học tập, không phải công cụ chẩn đoán.": "Choose the feeling closest to yours today. All feelings are normal; this is a learning activity, not a diagnostic tool.",
        "Chọn một cảm xúc": "Choose a feeling",
        "Vui vẻ": "Happy",
        "Buồn": "Sad",
        "Tức giận": "Angry",
        "Lo lắng": "Worried",
        "Bình yên": "Calm",
        "Hero nhắn con": "A message from Hero",
        "Con có thể thử:": "You could try:",
        "Vui quá! Con có thể kể với người thân điều làm con vui nhé.": "How wonderful! You can tell someone in your family what made you happy.",
        "Niềm vui có thể lan tỏa. Con muốn chia sẻ điều làm mình vui với ai đó con tin tưởng không?": "Happiness can be shared. Would you like to tell someone you trust what made you happy?",
        "Con thử vẽ điều làm mình vui nhé.": "Try drawing something that makes you happy.",
        "Con muốn chia sẻ niềm vui với người con tin tưởng nhé.": "Share your happiness with someone you trust.",
        "Buồn cũng không sao. Con có thể nói với người lớn con tin nhé.": "It's okay to feel sad. You can talk to an adult you trust.",
        "Buồn là cảm xúc bình thường. Con có thể gọi tên điều làm mình buồn và tìm người lớn tin cậy để chia sẻ.": "Sadness is a normal feeling. You can name what made you sad and share it with a trusted adult.",
        "Con thử vẽ hoặc kể điều làm mình buồn nhé.": "Try drawing or talking about what made you sad.",
        "Con có thể kể với người lớn con tin điều khiến mình buồn.": "Tell an adult you trust what made you sad.",
        "Tức giận là cảm xúc bình thường. Mình cùng dừng lại và thở chậm nhé.": "Anger is a normal feeling. Let's pause and take a slow breath.",
        "Khi tức giận, con có thể tạm dừng, thở chậm và nói với người lớn tin cậy điều mình cần.": "When you're angry, you can pause, breathe slowly, and tell a trusted adult what you need.",
        "Con thử hít vào nhẹ nhàng, rồi thở ra chậm ba lần.": "Try breathing in gently, then breathe out slowly three times.",
        "Con có thể thở chậm vài lần rồi nói điều mình cần với người lớn tin cậy.": "Take a few slow breaths, then tell a trusted adult what you need.",
        "Khi lo lắng, con hãy tìm người lớn con tin và kể cho họ nghe nhé.": "When you feel worried, find an adult you trust and tell them.",
        "Con có thể gọi tên điều khiến mình lo lắng và cùng người lớn tin cậy nghĩ về bước tiếp theo.": "Name what is worrying you and think about a next step with a trusted adult.",
        "Con kể với người lớn con tin điều khiến mình lo nhé.": "Tell an adult you trust what is worrying you.",
        "Con có thể viết ra điều mình lo và nhờ người lớn tin cậy cùng tìm cách xử lý.": "Write down what is worrying you and ask a trusted adult to help.",
        "Thật dễ chịu khi thấy bình yên. Con có thể tận hưởng khoảnh khắc này nhé.": "It's lovely to feel calm. You can enjoy this moment.",
        "Con thử để ý điều gì đang giúp mình cảm thấy bình yên hôm nay nhé.": "Notice what is helping you feel calm today.",
        "Con thử để ý hơi thở chậm rãi của mình nhé.": "Notice your slow, steady breathing.",
        "Con có thể ghi nhớ điều đang giúp mình cảm thấy bình yên.": "Remember what is helping you feel calm."
      }).sort(([sourceA], [sourceB]) => sourceB.length - sourceA.length));
      const englishUiTextByEnglish = new Map(
        [...englishUiText].map(([source, translated]) => [translated, source])
      );
      const localizedTextState = new WeakMap();
      const localizedAttributeState = new WeakMap();
      const lessonLocaleText = window.LittleHeroLessonLocaleText;
      const translateString = (source) => {
        if (state.language === "vi") return source;
        const languageTranslations = window.LittleHeroTranslations[state.language] || window.LittleHeroTranslations.en;
        const canonicalSource = englishUiTextByEnglish.get(source) || source;
        const exactLessonTranslation = lessonLocaleText instanceof Map
          ? lessonLocaleText.get(canonicalSource)?.[state.language]
          : lessonLocaleText?.[canonicalSource]?.[state.language];
        const exactTranslation = exactLessonTranslation
          || languageTranslations.get(source)
          || languageTranslations.get(canonicalSource)
          || (state.language === "en" ? englishUiText.get(canonicalSource) || englishUiText.get(source) : "");
        if (exactTranslation) return exactTranslation;
        return canonicalSource;
      };
      const translateTemplate = (template, values) => Object.entries(values).reduce(
        (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
        translateString(template)
      );
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
      const pageShell = (name, description, body) => `
        <button class="route-back" type="button" data-route-back>← Quay lại</button>
        <div class="page-heading"><h1>${escapeHtml(pageTitle(name))}</h1>${description ? `<p>${description}</p>` : ""}</div>${body}`;
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
          window.clearTimeout(arenaMatchTimeout);
          arenaMatchTimeout = null;
        }
        if (route === "arena" && targetRoute !== "arena") {
          arenaSearchRequestId += 1;
          void releaseArenaSearch();
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
          const locked = state.authenticated && isPremiumLesson(lesson) && !hasActivePremium();
          const actionLabel = !state.authenticated
            ? "Đăng nhập để học →"
            : locked
              ? "🔒 Xem gói Premium"
              : `${state.completed.includes(lesson.id) ? "Học lại" : "Bắt đầu bài học"} →`;
          return `<article class="catalog-card"><div class="catalog-art" style="--lesson-color:${category.color}">
              <img src="${image.src}" alt="${escapeHtml(image.alt)}" loading="lazy"><span aria-hidden="true">${lesson.icon}</span>
            </div><div class="catalog-card-copy"><span class="kicker">${category.name}</span><h3>${escapeHtml(lesson.title)}</h3>
            </div><button class="btn ${locked ? "btn-light" : "btn-mint"} btn-small" data-route="${!state.authenticated ? `lesson/${lesson.id}` : locked ? "pricing" : `lesson/${lesson.id}`}">${actionLabel}</button></article>`;
        }).join("");
        const chips = allowedCategories.map((category) => routeLink(`lessons/${category.id}`, `${category.icon} ${category.name}`)).join("");
        const message = unavailableCategory ? "Chủ đề này chưa nằm trong nhóm tuổi của bé. Đây là các nội dung phù hợp hơn:" : "Chọn bài học phù hợp với độ tuổi và chủ đề bé quan tâm.";
        $("#routeView").innerHTML = pageShell("lessons", message, `<div class="page-actions">${routeLink("lessons", "Tất cả chủ đề", "🏝️")}${chips}</div><div class="lesson-catalog">${cards}</div>`);
      };
      const renderEmotionMap = () => {
        const emotions = [
          {
            id: "happy", label: "Vui vẻ", icon: "😊",
            messages: ["Vui quá! Con có thể kể với người thân điều làm con vui nhé.", "Niềm vui có thể lan tỏa. Con muốn chia sẻ điều làm mình vui với ai đó con tin tưởng không?"],
            activities: ["Con thử vẽ điều làm mình vui nhé.", "Con muốn chia sẻ niềm vui với người con tin tưởng nhé."]
          },
          {
            id: "sad", label: "Buồn", icon: "😟",
            messages: ["Buồn cũng không sao. Con có thể nói với người lớn con tin nhé.", "Buồn là cảm xúc bình thường. Con có thể gọi tên điều làm mình buồn và tìm người lớn tin cậy để chia sẻ."],
            activities: ["Con thử vẽ hoặc kể điều làm mình buồn nhé.", "Con có thể kể với người lớn con tin điều khiến mình buồn."]
          },
          {
            id: "angry", label: "Tức giận", icon: "😠",
            messages: ["Tức giận là cảm xúc bình thường. Mình cùng dừng lại và thở chậm nhé.", "Khi tức giận, con có thể tạm dừng, thở chậm và nói với người lớn tin cậy điều mình cần."],
            activities: ["Con thử hít vào nhẹ nhàng, rồi thở ra chậm ba lần.", "Con có thể thở chậm vài lần rồi nói điều mình cần với người lớn tin cậy."]
          },
          {
            id: "worried", label: "Lo lắng", icon: "😰",
            messages: ["Khi lo lắng, con hãy tìm người lớn con tin và kể cho họ nghe nhé.", "Con có thể gọi tên điều khiến mình lo lắng và cùng người lớn tin cậy nghĩ về bước tiếp theo."],
            activities: ["Con kể với người lớn con tin điều khiến mình lo nhé.", "Con có thể viết ra điều mình lo và nhờ người lớn tin cậy cùng tìm cách xử lý."]
          },
          {
            id: "calm", label: "Bình yên", icon: "😌",
            messages: ["Thật dễ chịu khi thấy bình yên. Con có thể tận hưởng khoảnh khắc này nhé.", "Con thử để ý điều gì đang giúp mình cảm thấy bình yên hôm nay nhé."],
            activities: ["Con thử để ý hơi thở chậm rãi của mình nhé.", "Con có thể ghi nhớ điều đang giúp mình cảm thấy bình yên."]
          }
        ];
        $("#routeView").innerHTML = pageShell("emotions", "Chọn cảm xúc gần với con nhất hôm nay. Cảm xúc nào cũng bình thường; đây là hoạt động học tập, không phải công cụ chẩn đoán.", `
          <section class="emotion-map" aria-label="Bản đồ cảm xúc">
            <h2 class="emotion-map-prompt">Chọn một cảm xúc</h2>
            <div class="emotion-map-options" role="group" aria-label="Chọn cảm xúc">
              ${emotions.map((emotion) => `<button type="button" class="emotion-map-option" data-emotion="${emotion.id}" aria-pressed="false">
                <span class="emotion-map-face" aria-hidden="true">${emotion.icon}</span><span>${emotion.label}</span>
              </button>`).join("")}
            </div>
            <section class="emotion-map-response" id="emotionMapResponse" aria-live="polite" hidden>
              <span class="emotion-map-hero" aria-hidden="true">🦸</span>
              <div><span class="kicker">Hero nhắn con</span><p id="emotionMapMessage"></p>
                <div class="emotion-map-activity"><strong>Con có thể thử:</strong> <span id="emotionMapActivity"></span></div>
              </div>
            </section>
          </section>`);
        $("#routeView").querySelectorAll("[data-emotion]").forEach((button) => {
          button.addEventListener("click", () => {
            const emotion = emotions.find((item) => item.id === button.dataset.emotion);
            if (!emotion) return;
            $("#routeView").querySelectorAll("[data-emotion]").forEach((option) => {
              const selected = option === button;
              option.classList.toggle("is-selected", selected);
              option.setAttribute("aria-pressed", String(selected));
            });
            const ageIndex = state.age <= 6 ? 0 : 1;
            $("#emotionMapMessage").textContent = translateString(emotion.messages[ageIndex]);
            $("#emotionMapActivity").textContent = translateString(emotion.activities[ageIndex]);
            $("#emotionMapResponse").hidden = false;
          });
        });
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
        if (["action-give", "action-hug"].includes(movement)) {
          moveLessonActor(scene, protagonist, towardPartner * meetDistance, { gesture: "meet", duration: 1100 });
          moveLessonActor(scene, partner, -towardPartner * meetDistance, { gesture: "meet", duration: 1100 });
          return;
        }
        if (["action-jump", "action-wave", "action-clap", "action-sweep", "action-carry", "action-fold", "action-tidy", "action-dance", "action-point", "action-read", "action-draw", "action-drink", "action-eat", "action-brush-teeth"].includes(movement)) {
          return;
        }
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
      const animateSceneChoice = (sceneId, heroId, friendId, propId, answer, lesson, correct, choiceIndex = -1, question = null) => {
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
        const fallbackMovement = actionForAnswer(answer, correct, lesson);
        const actionPlan = window.LittleHeroCharacterEngine?.resolve({
          answer, choiceIndex, question, lesson, correct,
          fallbackAction: fallbackMovement,
          fallbackEmotion: emotionForAnswer(answer, correct, fallbackMovement)
        }) || {
          action: fallbackMovement,
          emotion: emotionForAnswer(answer, correct, fallbackMovement),
          partnerAction: "",
          objectIcon: "",
          target: ""
        };
        const movement = actionPlan.action;
        const partnerMovement = actionPlan.partnerAction || (correct
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
          }[movement] || "action-warn"));
        const responseEmotion = correct
          ? ["action-apologize", "action-assist", "action-greet", "action-handshake", "action-pickup"].includes(movement) ? "happy" : "calm"
          : emotionForAnswer(answer, false, movement);
        const involvedActors = new Set([lead, companion, ...mentioned]);
        involvedActors.forEach((actor) => {
          const actorMovement = actor === lead ? movement : partnerMovement;
          const actorEmotion = actor === lead ? actionPlan.emotion : responseEmotion;
          if (window.LittleHeroCharacterEngine) {
            window.LittleHeroCharacterEngine.play(actor, {
              action: actorMovement,
              emotion: actorEmotion
            }, setCharacterExpression);
          } else {
            actor.classList.add(actorMovement, `mood-${actorEmotion}`);
            setCharacterExpression(actor, actorEmotion);
          }
        });
        if (lead.querySelector(".lesson-character-svg")) {
          choreographLessonAnswer(scene, lead, companion, movement);
        }
        window.LittleHeroCharacterEngine?.showObject(lead, companion, actionPlan);
        const stranger = scene.querySelector("#sceneThirdActor");
        if (stranger?.querySelector(".actor-name")?.textContent.trim() === "Người lạ") {
          stranger.classList.remove("action-protect", "action-stay", "mood-happy", "mood-sad", "mood-concerned");
          stranger.classList.add(
            ["action-protect", "action-approach"].includes(movement) || !correct ? "action-step-back" : "action-stay",
            "mood-concerned"
          );
          setCharacterExpression(stranger, "concerned");
        }
        const sceneProp = $(`#${propId}`);
        const objectIsHeld = ["action-carry", "action-give", "action-fold", "action-tidy"].includes(movement);
        if (sceneProp) sceneProp.textContent = correct ? (objectIsHeld ? "" : (actionPlan.objectIcon || propForChoice(answer, lesson))) : "⚡";
        scene.dataset.activeAction = movement.replace(/^action-/, "");
        if (actionPlan.target) scene.dataset.actionTarget = actionPlan.target;
      };

      const renderLessonRoute = (lessonId) => {
        const sourceLesson = lessonById(lessonId);
        if (!sourceLesson) { $("#routeView").innerHTML = pageShell("lessons", "Không tìm thấy bài học này.", routeLink("lessons", "Xem kho bài học", "🏝️")); return; }
        if (!state.authenticated) {
          pendingAuthRoute = `lesson/${lessonId}`;
          setRoute("auth");
          toast("Đăng nhập để bắt đầu bài học và lưu tiến độ của bé.");
          return;
        }
        if (sourceLesson.ageGroup !== currentAgeGroup()) {
          $("#routeView").innerHTML = pageShell("lessons", "Bài học này dành cho nhóm tuổi khác. Hero đã chọn sẵn các bài phù hợp với bé.", routeLink("lessons", "Xem bài học phù hợp", "🏝️"));
          return;
        }
        if (isPremiumLesson(sourceLesson) && !hasActivePremium()) {
          renderLockedPlanPage("Bài học này thuộc thư viện Premium", "Chọn gói tháng hoặc năm, tải ảnh bill lên ở bước thanh toán để mở khóa nội dung.");
          return;
        }
        const lesson = { ...sourceLesson, age: currentAgeLabel() };
        const category = categories.find((item) => item.id === lesson.category);
        const scene = getScene(lesson);
        const shuffleQuestionAnswers = (question) => {
          const answerCount = question.answers.length;
          if (answerCount < 2) return question;
          const answerOrder = Array.from({ length: answerCount }, (_, index) => index);
          for (let index = answerCount - 1; index > 0; index -= 1) {
            const swapIndex = Math.floor(Math.random() * (index + 1));
            [answerOrder[index], answerOrder[swapIndex]] = [answerOrder[swapIndex], answerOrder[index]];
          }
          const correctIndex = Number.isInteger(question.correct)
            && question.correct >= 0
            && question.correct < answerCount
            ? question.correct
            : 0;
          const shuffled = {
            ...question,
            answers: answerOrder.map((index) => question.answers[index]),
            correct: answerOrder.indexOf(correctIndex)
          };
          ["animations", "answerAnimations", "answerActions"].forEach((key) => {
            if (Array.isArray(question[key]) && question[key].length === answerCount) {
              shuffled[key] = answerOrder.map((index) => question[key][index]);
            }
          });
          return shuffled;
        };
        const questions = [
          {
            story: lesson.story,
            prompt: "Bé sẽ chọn cách nào?",
            answers: lesson.answers,
            correct: lesson.correct,
            answerAnimations: lesson.answerAnimations,
            answerActions: lesson.answerActions
          },
          ...(lessonFollowUps[lesson.id] || []).map((question) => ({ ...question, correct: Number.isInteger(question.correct) ? question.correct : 0 }))
        ].map(shuffleQuestionAnswers);
        let questionIndex = 0;
        const done = state.completed.includes(lesson.id);
        $("#routeView").innerHTML = pageShell("lessons", `${category.icon} ${category.name} · ${lesson.age} · ${lesson.duration}`, `
          <p class="lesson-demo-notice" role="note">Hiện tại đây chỉ là giao diện demo, LITTLE HERO sẽ được phát triển và nâng cấp trong tương lai.</p>
          <div class="lesson-layout">
            <div class="lesson-scene-column">
              <div class="lesson-progress"><span>📖 Mạch câu chuyện</span><span id="questionProgress">Câu hỏi 1/${questions.length}${done ? " · Đã hoàn thành, có thể luyện tập lại" : ""}</span></div>
              <article class="scene-card">
                <div class="scene ${scene.type} scene-${scene.variant} scene-lesson-${lesson.category}${scene.thirdCharacter ? " scene-with-third-character" : ""}" id="lessonScene">
                    ${renderSceneBackdrop(scene)}
                    <span class="scene-kicker">📍 ${scene.place}</span><span class="scene-prop" id="sceneProp">${scene.prop}</span>
                    ${scene.thirdCharacter ? renderSceneActor("sceneThirdActor", scene.thirdCharacter.name, false, scene.thirdCharacter, true) : ""}
                    ${renderSceneActor("lessonProtagonist", scene.protagonist.name, false, scene.protagonist, true)}
                    ${renderSceneActor("lessonPartner", scene.friend.name, false, scene.friend, true)}
                </div>
              </article>
              <div class="lesson-context"><span class="kicker">HỌC QUA TRẢI NGHIỆM</span><h3>${escapeHtml(lesson.goal)}</h3>
                <div class="lesson-meta"><span>♧ ${lesson.age}</span><span>◷ ${lesson.duration}</span></div>
                <strong>🌱 Thử thách ngoài đời</strong><p>${escapeHtml(lesson.activity)}</p>
              </div>
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
                <p class="lesson-feedback" id="lessonRouteFeedback" aria-live="polite"></p>
                <details class="lesson-hint">
                  <summary>💡 Gợi ý để bé suy nghĩ</summary>
                  <div>${lesson.prompts.slice(0, 1).map((prompt) => `<p>${escapeHtml(prompt)}</p>`).join("")}</div>
                </details>
                <p class="lesson-safety-note" id="lessonSafetyNote" hidden>Nếu tình huống xảy ra ngoài đời và bé cảm thấy không an toàn, hãy rời đi và báo ngay người lớn đáng tin cậy.</p>
                <button class="btn btn-light btn-small" data-route="lessons/${category.id}">← Quay lại chủ đề</button>
              </div>
            </section>
          </div>
        `, "BÀI HỌC TƯƠNG TÁC");
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const voiceStatus = $("#lessonVoiceStatus");
        const voiceButton = $("#lessonVoiceAnswer");
        let voiceConsentGranted = false;
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
          $("#lessonScene")?.querySelectorAll(".character-held-object").forEach((object) => object.remove());
          $("#lessonScene")?.removeAttribute("data-active-action");
          $("#lessonScene")?.removeAttribute("data-action-target");
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
          $("#lessonRouteFeedback").textContent = "";
          $("#lessonSafetyNote").hidden = true;
          voiceStatus.textContent = "";
          $("#lessonChoices").innerHTML = question.answers.map((answer, index) =>
            `<button type="button" class="lesson-choice" data-choice="${index}"><span class="choice-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(answer)}</span></button>`
          ).join("");
          $("#lessonChoices").querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => {
            if (button.disabled) return;
            stopLessonRecognition();
            $("#lessonSafetyNote").hidden = false;
            const choice = Number(button.dataset.choice);
            const correct = choice === question.correct;
            if (state.authenticated) recordLearningAttempt(lesson, choice, questionIndex, question.correct);
            const choices = [...$("#lessonChoices").querySelectorAll("[data-choice]")];
            choices.forEach((option) => { option.disabled = true; });
            const selectedAnswer = question.answers[choice];
            const selectedAnswerText = translateString(selectedAnswer);
            animateSceneChoice("lessonScene", "lessonProtagonist", "lessonPartner", "sceneProp", selectedAnswer, lesson, correct, choice, question);
            speak(correct
              ? `${translateString("Tuyệt vời! Con đã chọn cách phù hợp:")} ${selectedAnswerText}.`
              : translateString("Không sao, con hãy thử lại nhé."));
            window.setTimeout(() => {
              if (!button.isConnected) return;
              if (!correct) {
                button.classList.add("incorrect");
                if (state.authenticated) {
                  state.lessonMistakes = state.lessonMistakes || {};
                  state.lessonMistakes[lesson.id] = (state.lessonMistakes[lesson.id] || 0) + 1;
                  persist();
                }
                $("#lessonRouteFeedback").textContent = "";
                choices.forEach((option) => { option.disabled = false; });
                return;
              }
              button.classList.add("correct");
              celebrateCorrectAnswer(button);
              if (state.authenticated) awardXp(3, button);
              $("#lessonChoices").querySelectorAll("[data-choice]").forEach((option) => { option.disabled = true; });
              if (questionIndex < questions.length - 1) {
                const responsePrompt = translateString(lesson.prompts[2] || "Con đã chọn cách phù hợp.");
                $("#lessonRouteFeedback").textContent = state.authenticated
                  ? translateTemplate("Đúng rồi! {prompt} +3 sao 🌟", { prompt: responsePrompt })
                  : translateTemplate("Đúng rồi! {prompt} Đăng nhập để lưu tiến độ nhé.", { prompt: responsePrompt });
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
                awardXp(lesson.reward, button);
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
              speak(`${translateString("Chúc mừng con đã hoàn thành bài học")} ${translateString(lesson.title)}! ${translateString("Bé nhận được")} ${firstCompletion ? lesson.reward : 0} ${translateString("ngôi sao")}.`);
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
          const spokenOptionLabel = translateString("Phương án");
          speak(`${translateString(question.story)} ${translateString(question.prompt)} ${question.answers.map((answer, index) => `${spokenOptionLabel} ${index + 1}: ${translateString(answer)}`).join(". ")}`);
        };
        renderQuestion();
        $("#lessonSpeak").addEventListener("click", () => {
          const question = questions[questionIndex];
          const spokenOptionLabel = translateString("Phương án");
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
          if (!voiceConsentGranted) {
            const consent = window.confirm("Trả lời bằng giọng nói là tùy chọn. Âm thanh có thể được xử lý bởi dịch vụ nhận diện của trình duyệt; Little Hero không lưu bản ghi hoặc bản chép. Bé có thể chọn đáp án bằng nút thay thế. Cho phép dùng micro lần này?");
            if (!consent) {
              voiceStatus.textContent = "Không bật micro. Bé có thể chọn một phương án bằng nút nhé.";
              return;
            }
            voiceConsentGranted = true;
          }

          const recognition = new SpeechRecognition();
          let handledResult = false;
          let transcript = "";
          let speechCandidates = [];
          let receivedSpeech = false;
          let recognitionFailed = false;
          recognition.lang = languageSpeechLocale();
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
                speak(translateString("Không sao, con hãy thử lại nhé."));
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
        $("#routeView").innerHTML = page === "stories"
          ? `<button class="route-back" type="button" data-route-back>← Quay lại</button>
            <div class="page-heading stories-page-heading"><span class="kicker stories-page-kicker">LITTLE HERO - GÓC TRUYỆN TRANH</span></div>
            ${storyComingSoonNotice}`
          : pageShell(page, "", storyComingSoonNotice);
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
        awardXp(miniGames[gameId].reward);
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
        $("#routeView").innerHTML = pageShell("games", "Chọn một trò chơi ngắn để luyện tư duy và thư giãn sau giờ học. Không có thi đấu trực tuyến hay thu thập thông tin trẻ.", body);
      };

      const renderQuestPage = () => {
        renderQuests();
        const rows = questSpecs.map((quest) => {
          const value = dailyProgress(quest.id);
          const claimed = state.questClaims.includes(`${currentDay()}:${quest.id}`);
          const progressText = translateTemplate("Tiến độ: {value}/{goal} · Thưởng {reward} ⭐", {
            value,
            goal: quest.target,
            reward: quest.reward
          });
          return `<article class="score-card"><span class="catalog-icon" style="--tile:#fff2d7">${quest.icon}</span><h3 class="quest-card-title">${quest.label}</h3>
            <p class="note">${progressText}</p><div class="progress"><i style="width:${Math.round(value / quest.target * 100)}%"></i></div>
            <button class="btn btn-small ${claimed ? "btn-light" : "btn-mint"}" style="margin-top:12px" data-claim-quest="${quest.id}" ${state.authenticated && (claimed || value < quest.target) ? "disabled" : ""}>${translateString(claimed ? "Đã nhận" : "Nhận thưởng")}</button></article>`;
        }).join("");
        const stats = `<span class="stat-pill">🎮 ${state.dailyLessons}/3 ${translateString("bài học")}</span><span class="stat-pill">⏱ ${Math.floor(state.sessionSeconds / 60)}/10 ${translateString("phút")}</span><span class="stat-pill">📝 ${state.dailyQuiz}/1 ${translateString("bài kiểm tra")}</span>`;
        $("#routeView").innerHTML = pageShell("quests", "Nhiệm vụ và tiến độ được lưu trên thiết bị hiện tại.", `<div class="page-actions">${stats}</div><div class="lesson-catalog">${rows}</div>`);
      };

      const quizFormats = [
        { id: "choice", icon: "🧭", title: "Chọn cách phù hợp", description: "Đọc tình huống, chọn cách xử lý an toàn. Có thể thử lại." },
        { id: "matching", icon: "🔗", title: "Nối chủ đề với điều đã học", description: "Ghép các chủ đề kỹ năng với mục tiêu phù hợp." },
        { id: "ordering", icon: "🔢", title: "Sắp xếp các bước", description: "Sắp xếp hành động theo thứ tự hợp lý." },
        { id: "memory", icon: "🃏", title: "Lật thẻ tìm cặp", description: "Lật thẻ, ghi nhớ vị trí và tìm cặp chủ đề với điều đã học." },
        { id: "creative", icon: "💡", title: "Xưởng ý tưởng", description: "Tưởng tượng cách giải quyết tình huống và chia sẻ ý tưởng của con." }
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
        awardXp(10);
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
        } else if (mode === "memory") {
          const pairs = shuffleItems(availableCategories).slice(0, 3).map((category) => ({
            id: category.id,
            name: category.name,
            icon: category.icon,
            goal: lessonById(category.lesson).goal
          }));
          const cards = shuffleItems(pairs.flatMap((pair) => [
            { pairId: pair.id, icon: pair.icon, label: pair.name },
            { pairId: pair.id, icon: "✨", label: pair.goal }
          ]));
          quizRun = { mode, cards, flipped: [], matched: [], moves: 0, resolving: false, message: "" };
        } else if (mode === "creative") {
          quizRun = { mode, lesson: shuffleItems(availableLessons)[0] };
        }
        renderQuizPage();
      };
      const renderQuizPage = () => {
        const intro = `<div class="quiz-format-grid">${quizFormats.map((format) => `
          <article class="quiz-format-card"><span class="quiz-format-icon">${format.icon}</span><h2>${format.title}</h2><p>${format.description}</p>
            <button type="button" class="btn btn-mint btn-small" data-quiz-start="${format.id}">Bắt đầu</button>
          </article>`).join("")}</div>`;
        if (!quizRun) {
          $("#routeView").innerHTML = pageShell("quiz", "Chọn một cách ôn tập phù hợp với bé.", intro);
          return;
        }
        if (quizRun.completed) {
          $("#routeView").innerHTML = pageShell("quiz", "Bé đã hoàn thành một lượt ôn tập.", `
            <section class="quiz-result"><span>🏆</span><h2>Con làm tốt lắm!</h2><p>Con nhận thêm 10 sao và 25 điểm RP. Hãy chọn một dạng khác để tiếp tục luyện tập.</p>
              <button type="button" class="btn btn-mint" data-quiz-reset>Chọn dạng ôn tập khác</button></section>
          `);
          return;
        }
        if (quizRun.mode === "choice") {
          const lesson = quizRun.questions[quizRun.round];
          const answers = lesson.answers.map((answer, index) => `<button type="button" class="lesson-choice quiz-answer ${quizRun.selected === index ? "correct" : ""} ${quizRun.wrong === index ? "incorrect" : ""}" data-quiz-answer="${index}" ${quizRun.selected !== null ? "disabled" : ""}>${escapeHtml(answer)}</button>`).join("");
          $("#routeView").innerHTML = pageShell("quiz", "Đọc tình huống rồi chọn cách xử lý phù hợp.", `
            <section class="quiz-task score-card">
              <div class="lesson-progress"><span>🧠 Câu ${quizRun.round + 1}/${quizRun.questions.length}</span><span>⭐ ${state.xp} · Lv ${Math.floor(state.xp / 100) + 1}</span></div>
              <span class="kicker">${escapeHtml(lesson.title)}</span><p class="quiz-story">${escapeHtml(lesson.story)}</p>
              <h2 class="quiz-question">Con sẽ chọn cách nào?</h2><div class="quiz-answer-list">${answers}</div>
              <p class="quiz-feedback" role="status">${quizRun.selected !== null
                ? `Chính xác! ${lesson.prompts[2] || lesson.goal}`
                : quizRun.wrong !== null
                  ? ""
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
          return;
        }
        if (quizRun.mode === "memory") {
          const matched = new Set(quizRun.matched);
          const cards = quizRun.cards.map((card, index) => {
            const isOpen = quizRun.flipped.includes(index) || matched.has(card.pairId);
            return `<button type="button" class="quiz-memory-card ${isOpen ? "is-open" : ""} ${matched.has(card.pairId) ? "is-matched" : ""}"
                data-quiz-memory-card="${index}" aria-label="${isOpen ? escapeHtml(card.label) : "Lật thẻ bí mật"}"
                aria-pressed="${isOpen}" ${matched.has(card.pairId) || quizRun.resolving ? "disabled" : ""}>
              <span aria-hidden="true">${isOpen ? card.icon : "❔"}</span>
              <strong>${isOpen ? escapeHtml(card.label) : "Thẻ bí mật"}</strong>
            </button>`;
          }).join("");
          $("#routeView").innerHTML = pageShell("quiz", "Lật hai thẻ mỗi lượt để tìm chủ đề và điều bé đã học.", `
            <section class="quiz-task score-card">
              <div class="lesson-progress"><span>🃏 Đã tìm ${quizRun.matched.length}/${quizRun.cards.length / 2} cặp</span><span>🔎 ${quizRun.moves} lượt lật</span></div>
              <div class="quiz-memory-board">${cards}</div>
              <p class="quiz-feedback" role="status">${escapeHtml(quizRun.message || "Con thử ghi nhớ vị trí các thẻ nhé!")}</p>
            </section>`, "THỬ THÁCH TRÍ NHỚ");
          return;
        }
        if (quizRun.mode === "creative") {
          const lesson = quizRun.lesson;
          $("#routeView").innerHTML = pageShell("quiz", "Một tình huống mới đang chờ ý tưởng của bé.", `
            <section class="quiz-task score-card">
              <div class="lesson-progress"><span>💡 Xưởng ý tưởng</span><span>${escapeHtml(lesson.icon)} ${escapeHtml(lesson.title)}</span></div>
              <p class="quiz-story">${escapeHtml(lesson.story)}</p>
              <h2 class="quiz-question">Nếu là con, con sẽ nghĩ ra cách nào?</h2>
              <p class="creative-prompt">${escapeHtml(lesson.prompts[3] || lesson.activity)}</p>
              <label class="creative-response-label" for="creativeQuizResponse">Ý tưởng của con
                <textarea id="creativeQuizResponse" maxlength="240" rows="3" placeholder="Con có thể viết hoặc kể cho người lớn nghe..."></textarea>
              </label>
              <p class="creative-privacy-note">Câu trả lời chỉ dùng trong lượt chơi này, không được gửi hay lưu lại.</p>
              <p class="quiz-feedback" id="creativeQuizFeedback" role="status">Mỗi ý tưởng đều đáng để khám phá. Hãy nghĩ thêm một chút nhé!</p>
              <div class="page-actions">
                <button type="button" class="btn btn-light btn-small" id="creativeQuizSpeak">♫ Nghe tình huống</button>
                <button type="button" class="btn btn-mint btn-small" id="completeCreativeQuiz">Hoàn thành ý tưởng →</button>
              </div>
            </section>`, "SÁNG TẠO CÙNG HERO");
          $("#creativeQuizSpeak").addEventListener("click", () => speak(`${lesson.title}. ${lesson.story} ${lesson.prompts[3] || lesson.activity}`));
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
            <small class="achievement-count">${translateTemplate("Tiến độ: {current} / {goal} {unit}", {
              current: Math.min(progress, goal),
              goal,
              unit: translateString(goal === 1 ? "lần" : "mốc")
            })}</small>
          </article>`;
        }).join("");
        const overview = translateTemplate("Bé đã khám phá {lessons} bài, tích lũy {stars} sao và có chuỗi {days} ngày.", {
          lessons: completedCount(),
          stars: state.xp,
          days: streak()
        });
        $("#routeView").innerHTML = pageShell("achievements", overview, `<div class="achievement-grid">${badges}</div>`);
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
        $("#routeView").innerHTML = pageShell("forum", "", `
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
          </div>`);
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
          ["Thanh toán Premium có thể chuyển khoản chưa?", "Có thể chuyển khoản theo thông tin tại trang thanh toán. Sau khi chuyển, tải ảnh bill lên để mở Premium ngay. Hệ thống chưa đối soát ảnh với ngân hàng."],
          ["Ứng dụng lưu những thông tin nào?", "Họ tên phụ huynh, email, số điện thoại, trạng thái Premium và ảnh bill mới nhất được lưu trong SQLite trên máy chủ; ảnh cũ được thay thế khi tải ảnh mới. Hồ sơ và tiến độ học của bé vẫn lưu cục bộ trên trình duyệt. Hosting miễn phí hiện dùng dữ liệu tạm nên thông tin máy chủ có thể mất khi khởi động lại hoặc triển khai lại."]
        ];
        $("#routeView").innerHTML = pageShell("faq", "Một số câu hỏi thường gặp về cách sử dụng Little Hero.", `<div class="faq-grid">${questions.map(([question, answer]) => `<details class="faq-card"><summary>${question}</summary><p>${answer}</p></details>`).join("")}</div>`);
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
          const stars = Number(review.stars) || 0;
          const ratingLabel = translateTemplate("{stars} trên 5 sao", { stars });
          return `<article class="store-review ${review.isSample ? "is-sample" : ""}">
            <span class="review-stars" aria-label="${ratingLabel}">${"★".repeat(stars)}${"☆".repeat(5 - stars)}</span>
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
                <label class="form-label">Tên hiển thị *<input name="author" required maxlength="50" value="${escapeHtml(localizedChildName())}" placeholder="Tên người đánh giá"></label>
                <label class="form-label">Số sao</label><div class="stars-input" id="starsInput">${[1,2,3,4,5].map((star) => `<button type="button" data-star="${star}" aria-label="${star} sao">${star <= selectedStars ? "★" : "☆"}</button>`).join("")}</div>
                <label class="form-label">Tiêu đề<input name="title" maxlength="70" placeholder="Tóm tắt trải nghiệm"></label>
                <label class="form-label">Nhận xét<textarea name="review" required maxlength="400" placeholder="Chia sẻ trải nghiệm thực tế của bạn…"></textarea></label>
                <button class="btn btn-mint btn-small">Gửi đánh giá</button>
                <p class="note" style="margin-top:10px">Lưu cục bộ trên thiết bị. Tên và trải nghiệm chưa được xác minh; không đồng bộ hoặc đăng lên Google Play/App Store.</p>
              </form>
            </div>
          </div>`);
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
        $("#routeView").innerHTML = pageShell("language", "Chọn ngôn ngữ cho giao diện, nội dung, câu trả lời của Hero và giọng đọc.", `
          <div class="score-card"><h3 style="font-size:15px">Ngôn ngữ giao diện</h3><div class="language-options">
            ${window.LittleHeroLanguages.map(({ code, flag, label }) => `<button class="pick-card" data-language="${code}" aria-pressed="${state.language === code}"><span class="pick-icon">${flag}</span><strong>${label}</strong></button>`).join("")}
          </div><p class="note" style="margin-top:12px">Giọng đọc dùng giọng tổng hợp có sẵn trên thiết bị; khả năng phát âm tùy thuộc vào các giọng đã cài đặt.</p></div>`);
        $("#routeView").querySelectorAll("[data-language]").forEach((button) => button.addEventListener("click", () => {
          state.language = window.LittleHeroLanguages.some(({ code }) => code === button.dataset.language)
            ? button.dataset.language
            : "vi";
          document.documentElement.lang = state.language;
          translateElement(document.body);
          persist();
          setRoute(route, { restore: true, pop: true });
        }));
      };

      const renderArenaPage = () => {
        const ageGroup = currentAgeGroup();
        const ageGroupLabel = ageGroup.replace("-", "–");
        arenaLeaderboardAgeGroup = ageGroup;
        const provinces = window.LittleHeroLocations.provinces;
        const modes = [["duel", "Cùng nhóm tuổi"], ["region", "Miền"], ["city", "Tỉnh/thành"], ["nation", "Toàn quốc"]];
        const provinceOptions = provinces.map(({ name }) =>
          `<option value="${escapeHtml(name)}" ${state.leaderboardProvince === name ? "selected" : ""}>${escapeHtml(name)}</option>`
        ).join("");
        $("#routeView").innerHTML = pageShell("arena", translateTemplate("Đấu trường nhóm {age} tuổi · nội dung và câu hỏi được chọn theo độ tuổi của bé.", { age: ageGroupLabel }), `
          <div class="arena-grid">
            <article class="arena-card">
              <span class="kicker">${translateTemplate("HERO ARENA · NHÓM {age} TUỔI", { age: ageGroupLabel })}</span><h3>Thi đấu qua tình huống kỹ năng</h3>
              <p>Mỗi lượt là một tình huống kỹ năng cùng Hero. Điểm RP được xếp hạng theo nhóm tuổi, tỉnh/thành, miền hoặc toàn quốc.</p>
              <div class="rank-big"><strong>${Number(state.rp).toLocaleString(languageSpeechLocale())}</strong><span>RP của bé</span></div>
              <div class="arena-tabs" id="arenaPageTabs">${modes.map(([id, label]) => `<button class="arena-tab ${arenaMode === id ? "active" : ""}" data-mode="${id}" aria-pressed="${arenaMode === id}">${label}</button>`).join("")}</div>
              <div class="arena-search" id="arenaSearchStatus" aria-live="polite"><p class="note">Tìm người chơi thật cùng nhóm tuổi; nếu chưa có, sau 10 giây hệ thống sẽ bắt đầu thử thách với bot.</p></div>
              <button class="btn btn-mint" id="arenaFindOpponent">⚡ Bắt đầu thử thách</button>
            </article>
            <article class="leader-card">
              <div class="leader-title"><h3>🏆 Bảng vinh danh</h3><span id="leaderScope"></span></div>
              <div class="leader-controls">
                <div class="leaderboard-filters">
                  ${leaderboardAgeGroupControl("arenaLeaderboardAgeGroup")}
                  ${leaderboardLocationControl("arenaLeaderboardProvince")}
                </div>
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
                  ` : state.demoAccount
                    ? ""
                    : `<a class="btn btn-primary btn-small" href="#/auth" data-route="auth">Đăng nhập / đăng ký để tham gia</a>`}
                </form>
              </div>
              <p class="leaderboard-status" id="leaderboardStatus" aria-live="polite"></p>
              <div class="leaderboard-podium" id="leaderboardPodium"></div>
              <div id="leaderboard"></div><div class="leader-you" id="leaderYou"></div>
            </article>
          </div>`);
        const setLeaderboardScope = () => {
          $("#leaderScope", $("#routeView")).textContent = leaderboardScopeLabel(arenaMode, arenaLeaderboardAgeGroup);
          $("#arenaLeaderboardProvinceWrap").hidden = !["region", "city"].includes(arenaMode);
        };
        const refreshLeaderboard = () => {
          setLeaderboardScope();
          renderLeaderboard($("#routeView"), arenaMode, arenaLeaderboardAgeGroup);
        };
        refreshLeaderboard();
        if (arenaLeaderboardInterval) window.clearInterval(arenaLeaderboardInterval);
        arenaLeaderboardInterval = window.setInterval(() => {
          if (route === "arena" && document.visibilityState === "visible") refreshLeaderboard();
        }, 10000);
        if (arenaMatchTimeout) { window.clearTimeout(arenaMatchTimeout); arenaMatchTimeout = null; }
        $("#arenaPageTabs").addEventListener("click", (event) => {
          const tab = event.target.closest("[data-mode]");
          if (!tab) return;
          if (arenaMatchTimeout) { window.clearTimeout(arenaMatchTimeout); arenaMatchTimeout = null; }
          arenaSearchRequestId += 1;
          void releaseArenaSearch();
          arenaOpponent = null;
          $("#arenaFindOpponent").disabled = false;
          $("#arenaSearchStatus").innerHTML = '<p class="note">Tìm người chơi thật cùng nhóm tuổi; nếu chưa có, sau 10 giây hệ thống sẽ bắt đầu thử thách với bot.</p>';
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
        $("#arenaLeaderboardAgeGroup").addEventListener("change", (event) => {
          arenaLeaderboardAgeGroup = event.currentTarget.value;
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
          if (arenaMatchTimeout) window.clearTimeout(arenaMatchTimeout);
          const button = event.currentTarget;
          button.disabled = true;
          arenaOpponent = null;
          const requestId = ++arenaSearchRequestId;
          const searchStartedAt = Date.now();
          $("#arenaSearchStatus").innerHTML = '<div class="arena-spinner" role="status" aria-label="Đang tìm đối thủ"></div><p class="arena-result">Đang tìm người chơi cùng nhóm tuổi… <span id="arenaCountdown">10</span></p><button class="btn btn-light btn-small" id="cancelArenaSearch" type="button">Hủy tìm</button>';
          const checkForOpponent = async () => {
            if (requestId !== arenaSearchRequestId) return;
            if (route !== "arena") {
              void releaseArenaSearch();
              return;
            }
            try {
              const token = await arenaMatchmakingToken();
              if (!token) {
                $("#arenaSearchStatus").innerHTML = '<p class="note">Hãy đăng nhập hoặc dùng tài khoản trải nghiệm để tham gia thử thách với người chơi.</p>';
                button.disabled = false;
                return;
              }
              if (requestId !== arenaSearchRequestId || route !== "arena") return;
              arenaSearchRequest = fetch(apiUrl("/api/arena/matchmaking"), {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                  ageGroup: currentAgeGroup(),
                  allowBot: Date.now() - searchStartedAt >= 10000
                })
              }).then(async (response) => ({ response, result: await response.json() }));
              const { response, result } = await arenaSearchRequest;
              arenaSearchRequest = null;
              if (requestId !== arenaSearchRequestId) return;
              if (route !== "arena") {
                void releaseArenaSearch();
                return;
              }
              if (response.status === 401) {
                if (state.demoAccount) {
                  arenaDemoSessionToken = "";
                } else {
                  try { sessionStorage.removeItem(leaderboardTokenKey(state.accountEmail)); }
                  catch (error) { console.warn("Không thể xóa phiên đăng nhập đã hết hạn.", error); }
                }
              }
              if (!response.ok) throw new Error(result.error || "Không thể bắt đầu thử thách lúc này.");
              if (result.status === "matched" && result.match?.opponent) {
                arenaOpponent = result.match.opponent;
                arenaMatchTimeout = null;
                $("#arenaSearchStatus").innerHTML = `<div class="arena-result">✨ ${translateTemplate("Đối thủ đã sẵn sàng: {name}", { name: escapeHtml(arenaOpponent.name) })}<br><button class="btn btn-mint btn-small" id="startArenaMatch" style="margin-top:9px">Vào trận →</button></div>`;
                return;
              }
              const secondsLeft = Math.max(0, 10 - Math.floor((Date.now() - searchStartedAt) / 1000));
              const countdown = $("#arenaCountdown");
              if (countdown) countdown.textContent = String(secondsLeft);
              arenaMatchTimeout = window.setTimeout(checkForOpponent, 1000);
            } catch (error) {
              arenaSearchRequest = null;
              if (requestId !== arenaSearchRequestId || route !== "arena") return;
              console.error("Không thể ghép trận đấu trường.", error);
              $("#arenaSearchStatus").innerHTML = `<p class="note">${escapeHtml(error.message || "Không thể bắt đầu thử thách lúc này. Vui lòng thử lại.")}</p>`;
              button.disabled = false;
              void releaseArenaSearch();
            }
          };
          void checkForOpponent();
        });
        $("#routeView").addEventListener("click", (event) => {
          if (event.target.closest("#cancelArenaSearch")) {
            if (arenaMatchTimeout) window.clearTimeout(arenaMatchTimeout);
            arenaMatchTimeout = null;
            arenaSearchRequestId += 1;
            void releaseArenaSearch();
            arenaOpponent = null;
            $("#arenaFindOpponent").disabled = false;
            $("#arenaSearchStatus").innerHTML = '<p class="note">Đã hủy tìm thử thách. Bé có thể bắt đầu lại khi sẵn sàng.</p>';
            return;
          }
          if (!event.target.closest("#startArenaMatch")) return;
          if (!arenaOpponent) return;
          const availableLessons = ageAppropriateLessons();
          arenaMatchLesson = availableLessons[Math.floor(Math.random() * availableLessons.length)];
          arenaMatchChoice = null;
          setRoute("arena-match");
        });
      };

      const renderArenaMatchPage = () => {
        if (!arenaOpponent) {
          toast("Hãy bắt đầu thử thách từ đấu trường trước khi vào lượt chơi.");
          setRoute("arena");
          return;
        }
        const availableLessons = ageAppropriateLessons();
        const lesson = arenaMatchLesson && ageCategories[currentAgeGroup()].includes(arenaMatchLesson.category)
          ? arenaMatchLesson
          : availableLessons[Math.floor(Math.random() * availableLessons.length)];
        arenaMatchLesson = lesson;
        const scene = getScene(lesson);
        const opponent = arenaOpponent;
        const opponentType = opponent.type === "player" ? "người chơi thật" : "bot";
        $("#routeView").innerHTML = pageShell("arena", translateTemplate("Thử thách với {name}. Mỗi câu chỉ chọn một phương án.", { name: escapeHtml(opponent.name) }), `
          <article class="score-card">
            <div class="lesson-progress"><span>⚔ ${escapeHtml(opponent.name)} · ${escapeHtml(opponent.level)}</span><span>${arenaMatchChoice === null ? `Đối thủ: ${opponentType}` : "Lựa chọn đã khóa"}</span></div>
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
          if (success) celebrateCorrectAnswer(button);
          $("#arenaMatchFeedback").textContent = success
            ? "Đúng rồi! Đáp án đã khóa, bé nhận +10 ⭐ và +25 RP."
            : "";
          if (success) { awardXp(10, button); state.rp += 25; }
          else { state.xp = Math.max(0, state.xp - 3); state.rp = Math.max(0, state.rp - 5); }
          state.quiz += 1;
          state.dailyQuiz += 1;
          persist();
          speak(success ? `Kết quả thành công! ${lesson.prompts[2]}` : `Kết quả chưa thành công. ${lesson.prompts[1]} Câu đấu đã khóa.`);
          $("#arenaMatchFeedback").insertAdjacentHTML("afterend", '<button class="btn btn-mint btn-small" id="leaveArenaAfterResult">Kết thúc lượt đấu →</button>');
          $("#leaveArenaAfterResult").addEventListener("click", () => {
            arenaOpponent = null;
            void releaseArenaSearch();
            setRoute("arena");
          });
        });
        $("#leaveArenaMatch").addEventListener("click", () => {
          arenaOpponent = null;
          void releaseArenaSearch();
          setRoute("arena");
        });
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
          renderStats();
          showOnboardingIfNeeded();
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
            try { await refreshActiveSubscription(); }
            catch (error) {
              console.error("Không thể tải trạng thái gói Premium sau khi đăng nhập.", error);
              toast("Đã đăng nhập, nhưng chưa tải được trạng thái gói Premium. Hãy tải lại trang hoặc thử lại sau.");
            }
            const nextRoute = pendingAuthRoute || "home";
            pendingAuthRoute = "";
            persist();
            setRoute(nextRoute);
            showOnboardingIfNeeded();
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

      const formatPlanPrice = (price) => new Intl.NumberFormat(languageSpeechLocale(), {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0
      }).format(price);
      const renderPaymentPage = (planId = "monthly") => {
        const plan = subscriptionPlans[planId] || subscriptionPlans.monthly;
        const priceText = formatPlanPrice(plan.price);
        const durationText = translateString(planId === "yearly" ? "năm" : "tháng");
        const transferNote = planId === "yearly" ? "LITTLEHERO NAM" : "LITTLEHERO THANG";
        const featureList = plan.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("");
        const isDemoCheckout = state.demoAccount;
        const canSelectReceipt = isDemoCheckout || (state.authenticated && Boolean(leaderboardToken()));
        const uploadPrompt = isDemoCheckout
          ? "Chế độ trải nghiệm: Premium đã mở. Có thể chọn ảnh để xem trước trên thiết bị; ảnh không được gửi lên máy chủ và không thực hiện thanh toán."
          : canSelectReceipt
          ? "Chọn ảnh bill PNG, JPEG hoặc WebP (tối đa 5 MB). Sau khi gửi ảnh, Premium được mở ngay."
          : state.authenticated
            ? "Phiên đăng nhập không hợp lệ. Hãy đăng xuất rồi đăng nhập lại để tải bill."
            : "Hãy đăng nhập tài khoản để tải ảnh bill và kích hoạt Premium.";
        $("#routeView").innerHTML = pageShell("payment", translateTemplate("Gói đã chọn: {name} · {price}", {
          name: translateString(plan.name),
          price: priceText
        }), `
          <article class="settings-card checkout-pending">
            <span class="catalog-icon" aria-hidden="true">💳</span>
            <h2>${escapeHtml(plan.name)}</h2>
            <p class="price">${priceText} <span>/${durationText}</span></p>
            <ul class="features">${featureList}</ul>
            ${isDemoCheckout
              ? `<div class="payment-note">Chế độ trải nghiệm: Premium đã mở. Không cần chuyển khoản; ảnh chỉ để xem trước trên thiết bị và sẽ không được gửi lên máy chủ.</div>`
              : `<h3 class="payment-section-title">Thông tin chuyển khoản</h3>
                <div class="payment-details">
                  <div class="payment-row"><span>Ngân hàng</span><strong>${PAYMENT_CONFIG.bankName}</strong></div>
                  <div class="payment-row"><span>Người nhận</span><strong>${PAYMENT_CONFIG.accountName}</strong></div>
                  <div class="payment-row"><span>Số tài khoản</span><strong id="paymentAccountNumber">${PAYMENT_CONFIG.accountNumber}</strong></div>
                  <div class="payment-row"><span>Số tiền</span><strong>${priceText}</strong></div>
                  <div class="payment-row"><span>Nội dung</span><strong id="paymentTransferNote">${transferNote}</strong></div>
                </div>
                <div class="page-actions payment-copy-actions"><button class="btn btn-light btn-small" id="copyPaymentAccount" type="button">Sao chép số tài khoản</button><button class="btn btn-light btn-small" id="copyPaymentNote" type="button">Sao chép nội dung</button></div>
                <div class="payment-note">Mở ứng dụng ngân hàng, chọn chuyển khoản đến MB Bank rồi nhập đúng người nhận, số tài khoản, số tiền và nội dung bên trên. Sau khi chuyển khoản thành công, tải ảnh bill lên để xác nhận. Ảnh chưa được đối soát tự động với ngân hàng; hãy kiểm tra kỹ thông tin trước khi chuyển.</div>`}
            <form class="payment-upload-form" id="paymentConfirmForm">
              <h3 class="payment-section-title">${isDemoCheckout ? "Xem trước ảnh (tài khoản trải nghiệm)" : "Tải ảnh bill chuyển khoản"}</h3>
              <label class="payment-upload-label" for="paymentReceipt">
                <span>🖼️ Chọn ảnh bill từ thiết bị</span>
                <input id="paymentReceipt" name="receipt" type="file" accept="image/png,image/jpeg,image/webp" required ${canSelectReceipt ? "" : "disabled"}>
              </label>
              <img class="payment-receipt-preview" id="paymentReceiptPreview" alt="Ảnh bill đã chọn" hidden>
              <p class="payment-upload-status" id="paymentUploadStatus" role="status" aria-live="polite">${escapeHtml(uploadPrompt)}</p>
              <button class="btn btn-primary" id="paymentConfirmBtn" type="submit" disabled>${isDemoCheckout ? "Tiếp tục trải nghiệm Premium" : "Xác nhận & mở Premium"}</button>
            </form>
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
        const copyAccountButton = $("#copyPaymentAccount");
        const copyNoteButton = $("#copyPaymentNote");
        copyAccountButton?.addEventListener("click", () => copyPaymentValue(PAYMENT_CONFIG.accountNumber, "Số tài khoản"));
        copyNoteButton?.addEventListener("click", () => copyPaymentValue(transferNote, "Nội dung chuyển khoản"));
        const form = $("#paymentConfirmForm");
        const receiptInput = $("#paymentReceipt", form);
        const confirmButton = $("#paymentConfirmBtn", form);
        const status = $("#paymentUploadStatus", form);
        const preview = $("#paymentReceiptPreview", form);
        let previewUrl = "";
        receiptInput.addEventListener("change", () => {
          const file = receiptInput.files[0];
          confirmButton.disabled = true;
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          previewUrl = "";
          preview.hidden = true;
          preview.removeAttribute("src");
          confirmButton.disabled = true;
          if (!file) {
            status.textContent = uploadPrompt;
            return;
          }
          if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
            status.textContent = "Tệp phải là ảnh PNG, JPEG hoặc WebP.";
            return;
          }
          if (file.size === 0 || file.size > 5 * 1024 * 1024) {
            status.textContent = "Ảnh bill phải có dung lượng từ 1 byte đến 5 MB.";
            return;
          }
          if (!canSelectReceipt) {
            status.textContent = uploadPrompt;
            return;
          }
          previewUrl = URL.createObjectURL(file);
          preview.src = previewUrl;
          preview.hidden = false;
          status.textContent = isDemoCheckout
            ? "Ảnh được chọn để xem trước trên thiết bị; không tải lên máy chủ."
            : `Đã chọn ${file.name}. Nhấn xác nhận để mở gói Premium ngay.`;
          confirmButton.disabled = false;
        });
        form.addEventListener("submit", async (event) => {
          event.preventDefault();
          const file = receiptInput.files[0];
          if (isDemoCheckout) {
            if (!file || !canSelectReceipt) {
              status.textContent = uploadPrompt;
              return;
            }
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setRoute("premium-success");
            return;
          }
          const token = leaderboardToken();
          if (!canSelectReceipt || !file || !token) {
            status.textContent = canSelectReceipt
              ? "Phiên đăng nhập không hợp lệ. Hãy đăng nhập lại rồi thử lại."
              : uploadPrompt;
            return;
          }
          confirmButton.disabled = true;
          status.textContent = "Đang tải ảnh bill và kích hoạt Premium…";
          try {
            const response = await fetch(apiUrl(`/api/premium/receipt?plan=${encodeURIComponent(planId)}`), {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": file.type
              },
              body: file
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Không thể gửi ảnh bill. Vui lòng thử lại.");
            activeSubscription = result.subscription;
            if (!hasActivePremium()) throw new Error("Máy chủ chưa kích hoạt gói Premium. Vui lòng thử lại.");
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setRoute("premium-success");
          } catch (error) {
            console.error("Không thể tải bill và kích hoạt Premium.", error);
            status.textContent = error.message || "Không thể gửi ảnh bill. Vui lòng thử lại.";
            confirmButton.disabled = false;
          }
        });
      };

      const renderPremiumSuccessPage = () => {
        const isDemoPremium = state.demoAccount;
        const plan = activeSubscription && subscriptionPlans[activeSubscription.plan];
        $("#routeView").innerHTML = pageShell("pricing", "Thông tin gói Premium của bé.", `
          <article class="score-card" style="max-width:680px;text-align:center">
            <div style="font-size:42px">♛</div><h2 style="margin:4px 0">${isDemoPremium ? "Premium đã mở cho tài khoản trải nghiệm." : hasActivePremium() ? "Gói Premium đang hoạt động" : "Chưa có gói Premium đang hoạt động"}</h2>
            <p>${isDemoPremium ? "Tài khoản trải nghiệm được dùng các tính năng Premium mà không cần chuyển khoản." : hasActivePremium() ? `Gói ${escapeHtml(plan.name)} có hiệu lực đến ${new Date(activeSubscription.expiresAt).toLocaleDateString(languageSpeechLocale())}.` : "Chọn gói và gửi ảnh bill để mở quyền lợi Premium."}</p>
            <div class="story-box">${isDemoPremium ? "Ảnh bill chỉ được xem trước trên thiết bị; không có giao dịch hoặc tải ảnh lên máy chủ." : hasActivePremium() ? "Ảnh bill đã được gửi và gói Premium đã mở. Bé có thể tiếp tục khám phá các bài học." : "Gói Premium sẽ được mở ngay khi máy chủ nhận ảnh bill."}</div>
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
          return {
            text: translateString("Nếu con hoặc ai đó đang gặp nguy hiểm ngay lúc này, hãy tìm người lớn đáng tin cậy ở gần và liên hệ dịch vụ khẩn cấp tại nơi con sống. Hero chỉ có thể chia sẻ hướng dẫn chung, không thay thế người hỗ trợ trực tiếp."),
            route: "parent-news",
            label: translateString("Xem cẩm nang an toàn")
          };
        }
        if (state.language !== "vi") {
          return {
            text: translateString("Hiện mình chưa kết nối được trợ lý AI trực tuyến. Hãy thử lại sau hoặc mở hướng dẫn sử dụng."),
            route: "faq",
            label: translateString("Xem hướng dẫn sử dụng")
          };
        }
        if (destination?.route === "parents") {
          return { text: "Ba mẹ có thể quản lý hồ sơ từng bé, xem nhật ký thực hành, thời gian sử dụng, biểu đồ tiến độ và gợi ý hoạt động tại khu vực phụ huynh. Dữ liệu hiện được lưu trên thiết bị này.", ...destination };
        }
        if (destination?.route === "map") {
          return { text: "Bản đồ có 8 ốc đảo kỹ năng. Chọn một điểm dừng để mở tình huống và bắt đầu bài học.", ...destination };
        }
        if (destination?.route === "pricing" || destination?.route === "payment") {
          return { text: "Ba mẹ có thể xem thông tin gói. Tải ảnh bill lên để mở Premium ngay; giao dịch chưa được đối soát tự động với ngân hàng.", ...destination };
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
              <article class="chat-message assistant">${escapeHtml(languageConfig(state.language).greeting(languageConfig(state.language).friend))}</article>
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
            const fallbackText = state.language === "vi"
              ? `AI trực tuyến chưa khả dụng (${detail}). Hero vẫn có thể hướng dẫn cơ bản: ${fallback.text}`
              : fallback.text;
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
          voiceButton.title = translateString("Bật micro, nói câu hỏi rồi nhấn lần nữa để gửi");
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
          activeRecognition.lang = languageSpeechLocale();
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
            $("#routeView").innerHTML = pageShell("map", "Khám phá 8 ốc đảo kỹ năng; chọn một hòn đảo để mở bài học. Rê chuột hoặc dùng phím Tab để xem nội dung điểm dừng.", `<div class="map-guide"><div><strong>✨ Chọn một ốc đảo để bắt đầu</strong><p>Di chuột, chạm hoặc dùng phím Tab để hiện tên chủ đề và bài học, rồi chọn đảo để bắt đầu.</p></div></div><div class="journey-map detailed" id="mapPageIslands" aria-label="Bản đồ chi tiết gồm 8 ốc đảo và các bài học"></div>`);
            renderJourneyMap($("#mapPageIslands"), true);
          },
          emotions: renderEmotionMap,
          lessons: renderLessonCatalog,
          stories: renderStoriesPage,
          storybook: () => renderStoriesPage("storybook"),
          games: () => {
            if (!hasActivePremium()) {
              renderLockedPlanPage("Trò chơi thuộc thư viện Premium", "Chọn gói tháng hoặc năm, tải ảnh bill lên ở bước thanh toán để mở khóa nội dung.");
              return;
            }
            renderGamesPage();
          },
          quests: renderQuestPage,
          quiz: renderQuizPage,
          achievements: renderAchievementsPage,
          child: () => {
            const level = Math.floor(state.xp / 100) + 1;
            const progress = state.xp % 100;
            const displayName = state.childName && state.childName !== "Bé"
              ? state.childName
              : languageConfig(state.language).friend;
            $("#routeView").innerHTML = pageShell("child", "Góc riêng để bé xem hành trình và chọn hoạt động tiếp theo.", `
              <div class="child-profile-page">
                <section class="child-profile-banner">
                  <span class="child-profile-avatar" aria-hidden="true">${state.closet?.gender === "girl" ? "👧" : "🧒"}</span>
                  <div><span class="kicker">${currentAgeLabel()}</span><h2>${escapeHtml(translateTemplate("Chào {name}!", { name: displayName }))}</h2><p>Mỗi bước con thử sức đều đáng tự hào.</p></div>
                </section>
                <section class="child-profile-level" aria-label="Tiến độ cấp độ">
                  <div><strong>⭐ ${state.xp} sao</strong><span>Cấp ${level} · ${progress}% đến cấp tiếp theo</span></div>
                  <div class="progress"><i style="width:${progress}%"></i></div>
                </section>
                <div class="child-profile-links">
                  ${routeLink("map", "Bản đồ khám phá", "🗺️")}
                  ${routeLink("emotions", "Bản đồ cảm xúc", "💛")}
                  ${routeLink("quiz", "Ôn tập cùng Hero", "🧩")}
                  ${routeLink("achievements", "Huy hiệu của bé", "🏅")}
                  ${routeLink("quests", "Nhiệm vụ hôm nay", "🎯")}
                  <a class="btn btn-light btn-small" href="#/parents" data-route="parents" data-parent>👨‍👩‍👧 Góc phụ huynh</a>
                </div>
              </div>`);
          },
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
                <div class="subscription-action"><strong>${formatPlanPrice(plan.price)} <span>/${translateString(id === "yearly" ? "năm" : "tháng")}</span></strong><button class="btn btn-primary btn-small" data-route="payment/${id}">Chọn hành trình</button></div>
              </article>`).join("");
            $("#routeView").innerHTML = pageShell("pricing", "Chọn thời hạn phù hợp. Tải ảnh bill lên ở bước thanh toán để mở Premium ngay.", `
              <div class="subscription-list">${planRows}</div>
              <div class="free-plan-note"><span>${translateTemplate("{count} bài học miễn phí; nội dung Premium chiếm khoảng một nửa kho bài học.", { count: lessons.filter((lesson) => !isPremiumLesson(lesson)).length })}</span><button class="text-link" id="freePlanBtn">Khám phá nội dung miễn phí →</button></div>`, "");
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
                renderLockedPlanPage("Báo cáo phụ huynh thuộc gói năm", "Báo cáo tiến độ chi tiết chỉ mở sau khi tải ảnh bill của gói năm lên.");
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
          const label = new Date(`${day}T00:00:00`).toLocaleDateString(languageSpeechLocale(), { weekday: "short" });
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
        const labels = points.map((point) => `<text x="${point.x}" y="198" text-anchor="middle">${escapeHtml(new Date(`${point.day}T00:00:00`).toLocaleDateString(languageSpeechLocale(), { weekday: "short" }))}</text>`).join("");
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
            const date = new Date(entry.at).toLocaleString(languageSpeechLocale(), { dateStyle: "short", timeStyle: "short" });
            return `<article><span>${escapeHtml(lesson?.title || "Bài học")}<small>${escapeHtml(answer)} · ${escapeHtml(date)}</small></span><span aria-label="${entry.correct ? "Lựa chọn phù hợp" : "Lần thử cần luyện tập"}">${entry.correct ? "✅" : "🌱"}</span></article>`;
          }).join("")
          : `<p class="note">Nhật ký sẽ ghi lại lựa chọn của bé khi bé thực hành tình huống.</p>`;
        $("#routeView").innerHTML = pageShell("parents", "Theo dõi hồ sơ, tiến độ và hoạt động học tập của từng bé. Dữ liệu được lưu trên thiết bị này.", `
          <div class="parent-dashboard">
            <div class="parent-profile-bar">
              <label for="parentProfileSelect">👨‍👩‍👧 Hồ sơ đang xem
                <select id="parentProfileSelect">${state.children.map((profile) => `<option value="${escapeHtml(profile.id)}" ${profile.id === state.activeChildId ? "selected" : ""}>${escapeHtml(localizedChildName(profile.name))} · ${Number(profile.age) || 6} tuổi</option>`).join("")}</select>
              </label>
              <span class="stat-pill">Dữ liệu trên thiết bị · riêng tư</span><div class="parent-hero" id="parentHero" aria-hidden="true"></div>
            </div>
            <div class="parent-grid">
              <section class="parent-panel">
                <h2>👧 Hồ sơ của con</h2><p>Tạo nhiều hồ sơ và chuyển đổi để xem tiến trình riêng của mỗi trẻ.</p>
                <form class="profile-add" id="profileDetailsForm">
                  <input name="name" maxlength="40" required aria-label="Tên hoặc biệt danh" value="${escapeHtml(localizedChildName(child?.name || state.childName))}" placeholder="Tên hoặc biệt danh">
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
                <h2>📈 Tổng quan tiến độ</h2><p>Chỉ số tổng hợp từ dữ liệu thực hành của ${escapeHtml(localizedChildName(child?.name || state.childName))}.</p>
                <div class="parent-stats"><div><strong>${completedCount()}</strong><span>Bài hoàn thành</span></div><div><strong>${attempts.length}</strong><span>Lượt thực hành</span></div><div><strong>${state.xp}</strong><span>Sao tích lũy</span></div></div>
                <p class="note" style="margin:12px 0 0">Chuỗi ngày học: ${streak()} ngày · Hôm nay: ${minutesToday} phút dùng app.</p>
              </section>
            </div>
            <div class="parent-grid">
              <section class="parent-panel"><h2>⏱ Thời gian sử dụng & học</h2><p>7 ngày gần nhất · xanh là thời gian app mở, cam là thời gian ở trang bài học.</p>
                <div style="display:flex;gap:16px;font-size:11px"><span>🟩 Sử dụng ứng dụng</span><span>🟧 Ở trang bài học</span></div>${renderUsageChart()}
              </section>
              <section class="parent-panel"><h2>🎯 Kết quả theo thời gian</h2><p>Tỷ lệ lựa chọn đúng trong các lượt bé đã thực hành mỗi ngày.</p>${renderScoreChart()}
              </section>
            </div>
            <div class="parent-grid">
              <section class="parent-panel"><h2>🕸 Chỉ số nhóm kỹ năng</h2><p>Radar dựa trên tỷ lệ lựa chọn phù hợp ở các tình huống đã làm.</p>
                <div class="parent-radar">${radar.svg}<div class="skill-list">${radar.list}</div></div>
              </section>
              <section class="parent-panel"><h2>💛 Bài học bé quan tâm</h2><p>Sắp xếp theo số lượt bé đã chọn thực hành, không suy diễn cảm xúc/thích thú.</p>${recommendations}
                <div class="page-actions">${routeLink("lessons", "Khám phá bài học", "📚")}${routeLink("parent-news", "Cẩm nang gia đình", "📰")}</div>
              </section>
            </div>
            <section class="parent-panel"><h2>🌱 Gợi ý bước tiếp theo</h2>
              <p>${repeatedDifficulty ? "Các lượt gần đây có nhiều lựa chọn chưa phù hợp trong cùng một chủ đề. Ba mẹ có thể cùng con thực hành lại khi con sẵn sàng." : "Chọn một nội dung vừa sức, khuyến khích con tự suy nghĩ và trao đổi sau bài học."}</p>
              ${repeatedDifficulty ? `<p class="note">Lưu ý để ba mẹ quan tâm: ${escapeHtml(lessonById(recentMisses[0].lessonId)?.title || "một chủ đề")} có từ hai lượt chọn cần luyện tập trong sáu lượt gần đây. Đây chỉ là gợi ý đồng hành, không phải đánh giá chuyên môn.</p>` : ""}
              <div class="page-actions">${routeLink(`lesson/${ageAppropriateLessons().find((lesson) => !state.completed.includes(lesson.id))?.id || ageAppropriateLessons()[0].id}`, "Mở bài học gợi ý", "▶")}${routeLink("parent-news", "Xem gợi ý trò chuyện", "💬")}</div>
              <p class="note">Gợi ý được suy ra từ nhật ký cục bộ; chưa có AI Tutor, cá nhân hóa máy chủ hoặc cảnh báo đẩy.</p>
            </section>
            <div class="parent-grid">
              <section class="parent-panel"><h2>📔 Nhật ký lựa chọn</h2><p>Xem các tình huống bé đã thực hành gần đây.</p><div class="learning-log">${history}</div></section>
              <section class="parent-panel"><h2>💬 Gợi ý trò chuyện cùng con</h2><p>Câu hỏi gợi mở để lắng nghe, không phán xét hay áp đặt.</p>
                <div class="story-box">“${escapeHtml(coachPrompt)}”</div>
                <div class="thinking-prompts"><div>“Con muốn ba/mẹ lắng nghe hay cùng con nghĩ cách giải quyết?”</div><div>“Nếu thử lại, con muốn chọn điều gì khác?”</div><div>“Con cần người lớn giúp gì để cảm thấy an toàn?”</div></div>
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
                ${minutesToday >= dailyLimit ? `<p class="note">Đã chạm mục tiêu thời gian ba mẹ chọn hôm nay. Hãy cùng bé nghỉ mắt/đổi hoạt động; website chưa tự khóa ứng dụng.</p>` : ""}
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
          { id: "brand-story", kind: "Thương hiệu", group: "product", thumbnail: "news-hero-story.svg", alt: "Hero khám phá con đường câu chuyện LITTLE HERO", title: "LITTLE HERO biến tình huống thường ngày thành bài học tương tác", excerpt: "Cùng Hero khám phá cách một câu chuyện ngắn khuyến khích trẻ quan sát, suy nghĩ và trò chuyện với gia đình.", body: ["Mỗi bài học LITTLE HERO bắt đầu bằng một tình huống gần gũi. Bé quan sát câu chuyện, cân nhắc lựa chọn và xem diễn biến tiếp theo trong một môi trường luyện tập an toàn.", "Ứng dụng khuyến khích trẻ gọi tên cảm xúc, suy nghĩ từng bước và tìm người lớn đáng tin cậy khi cần. Nội dung không thay thế sự đồng hành trực tiếp của gia đình."] },
          { id: "skill-future", kind: "Sản phẩm", group: "product", thumbnail: "news-skill-map.svg", alt: "Bản đồ kỹ năng LITTLE HERO với những hòn đảo đầy màu sắc", title: "Bản đồ 8 chủ đề kỹ năng mở ra hành trình khám phá của bé", excerpt: "Từ cảm xúc đến an toàn, mỗi ốc đảo LITTLE HERO gợi ý một chủ đề để gia đình cùng tìm hiểu.", body: ["Bản đồ LITTLE HERO kết nối các chủ đề cảm xúc, giao tiếp, an toàn, sức khỏe, tư duy, trách nhiệm, sáng tạo và cộng đồng.", "Gia đình chọn một điểm dừng theo sở thích của bé; mỗi chủ đề dẫn đến bài học phù hợp độ tuổi và hoạt động thực hành."] },
          { id: "skill-thinking", kind: "Tính năng", group: "features", thumbnail: "news-thinking-quiz.svg", alt: "Thẻ ôn tập và bóng đèn ý tưởng của LITTLE HERO", title: "Bài ôn tập LITTLE HERO khuyến khích bé tự tìm lời giải", excerpt: "Chọn đáp án, nối cặp, sắp xếp và lật thẻ giúp bé ôn bài theo nhiều cách.", body: ["Bài ôn tập LITTLE HERO có nhiều hình thức ngắn để trẻ nhớ lại điều vừa học: chọn cách phù hợp, nối chủ đề, sắp xếp bước, tìm cặp thẻ và sáng tạo ý tưởng.", "Phần Xưởng ý tưởng chỉ dùng câu trả lời trong lượt chơi hiện tại; nội dung không được gửi lên máy chủ hoặc lưu lại."] },
          { id: "skill-confidence", kind: "Tính năng", group: "features", thumbnail: "news-age-path.svg", alt: "Các bậc hành trình học tập được thiết kế theo độ tuổi", title: "Bài học được gợi ý theo độ tuổi và chủ đề bé yêu thích", excerpt: "Hành trình LITTLE HERO giúp gia đình chọn bài học phù hợp với giai đoạn phát triển của trẻ.", body: ["Khi thiết lập hồ sơ, phụ huynh chọn độ tuổi và chủ đề bé quan tâm. LITTLE HERO dùng lựa chọn này để gợi ý hành trình học tập phù hợp.", "Các bài học chia kỹ năng thành tình huống nhỏ, giúp bé dễ theo dõi và có cơ hội thử lại cùng người lớn."] },
          { id: "skill-communication", kind: "Tính năng", group: "features", thumbnail: "news-family-play.svg", alt: "Gia đình cùng trò chuyện sau khi xem một câu chuyện LITTLE HERO", title: "Một bài học LITTLE HERO có thể trở thành cuộc trò chuyện gia đình", excerpt: "Câu hỏi gợi mở giúp trẻ kể suy nghĩ và liên hệ điều vừa học với cuộc sống.", body: ["Sau mỗi câu chuyện, phụ huynh có thể hỏi bé nhân vật đang cảm thấy thế nào hoặc bé sẽ tìm ai để nhờ giúp.", "Hãy lắng nghe câu trả lời, ghi nhận nỗ lực và cùng thực hành cách xử lý phù hợp với độ tuổi."] },
          { id: "skill-family", kind: "Hướng dẫn", group: "guide", thumbnail: "news-parent-guide.svg", alt: "Cẩm nang đồng hành cùng bé trên ứng dụng LITTLE HERO", title: "Bắt đầu cùng LITTLE HERO: hướng dẫn ngắn cho phụ huynh", excerpt: "Thiết lập hồ sơ, chọn chủ đề bé yêu thích rồi cùng Hero bắt đầu bài học đầu tiên.", body: ["Phụ huynh có thể tạo hồ sơ cho bé, chọn nhóm tuổi và chủ đề yêu thích để cá nhân hóa gợi ý.", "Bắt đầu bằng bài học ngắn, trò chuyện sau mỗi lựa chọn và dừng lại nếu trẻ cần nghỉ."] }
        ];
        const articleBody = (article) => article.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
        $("#routeView").innerHTML = pageShell("parent-news", "", `
          <div id="parentNewsContent">
            <div class="parent-news-toolbar"><h2><span aria-hidden="true">✦</span>Tin mới về LITTLE HERO</h2><input class="parent-news-search" id="parentNewsSearch" type="search" placeholder="⌕  Tìm bài viết..." aria-label="Tìm bài viết"></div>
            <div class="parent-news-filters" role="group" aria-label="Lọc bài viết">
              <button type="button" data-news-filter="all" aria-pressed="true">Tất cả</button>
              <button type="button" data-news-filter="product" aria-pressed="false">Sản phẩm</button>
              <button type="button" data-news-filter="features" aria-pressed="false">Tính năng</button>
              <button type="button" data-news-filter="guide" aria-pressed="false">Hướng dẫn</button>
            </div>
            <div class="parent-articles">${articles.map((article) => `<article class="parent-article news-card" data-article-id="${article.id}" data-group="${article.group}" data-search="${escapeHtml(translateString(`${article.title} ${article.excerpt} ${article.kind}`).toLocaleLowerCase(languageSpeechLocale()))}">
              <div class="parent-article-art"><img src="./frontend/assets/${article.thumbnail}" alt="${escapeHtml(translateString(article.alt))}"></div>
              <div class="parent-article-content"><span class="parent-news-label">${escapeHtml(article.kind)}</span><h2>${escapeHtml(article.title)}</h2><p>${escapeHtml(article.excerpt)}</p><details><summary>Đọc bài viết →</summary>${articleBody(article)}</details></div>
            </article>`).join("")}<p class="parent-articles-empty" id="parentNewsEmpty" hidden>Không tìm thấy bài viết phù hợp. Thử từ khóa hoặc danh mục khác nhé.</p></div>
          </div>`, "");
        const content = $("#parentNewsContent");
        const cards = [...content.querySelectorAll(".news-card")];
        const search = $("#parentNewsSearch");
        const empty = $("#parentNewsEmpty");
        let activeFilter = "all";
        const updateVisibleArticles = () => {
          const query = search.value.trim().toLocaleLowerCase(languageSpeechLocale());
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
        $("#themeBtn").title = translateString(state.darkMode ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối");
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
            celebrateCorrectAnswer(miniGameAnswer);
          } else {
            run.feedback = "";
            speak(`${run.id === "feelings" ? "Mỗi người có thể cảm thấy khác nhau." : round.hint} Bé thử lại nha!`);
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
            awardXp(quest.reward, claimQuest);
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
            celebrateCorrectAnswer(quizAnswer);
            awardXp(3, quizAnswer);
            speak(`Đúng rồi! ${lesson.prompts[2] || lesson.goal}`);
          } else {
            quizRun.wrong = answer;
            speak(translateString("Không sao, con hãy thử lại nhé."));
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
            celebrateCorrectAnswer(matchGoal);
            awardXp(3, matchGoal);
            if (quizRun.matched.length === quizRun.pairs.length) finishQuiz();
          } else {
            quizRun.message = "";
            speak(translateString("Không sao, con hãy thử lại nhé."));
          }
          quizRun.selected = null;
          persist();
          renderQuizPage();
          return;
        }
        const quizMemoryCard = event.target.closest("#routeView [data-quiz-memory-card]");
        if (quizMemoryCard && quizRun?.mode === "memory" && !quizRun.resolving) {
          const index = Number(quizMemoryCard.dataset.quizMemoryCard);
          if (!Number.isInteger(index) || index < 0 || index >= quizRun.cards.length || quizRun.flipped.includes(index)) return;
          quizRun.flipped.push(index);
          if (quizRun.flipped.length < 2) {
            renderQuizPage();
            return;
          }
          quizRun.moves += 1;
          const [first, second] = quizRun.flipped;
          if (quizRun.cards[first].pairId === quizRun.cards[second].pairId) {
            quizRun.matched.push(quizRun.cards[first].pairId);
            quizRun.flipped = [];
            quizRun.message = "Tìm thấy một cặp rồi! Con nhớ rất giỏi.";
            celebrateCorrectAnswer(quizMemoryCard);
            awardXp(2, quizMemoryCard);
            if (quizRun.matched.length === quizRun.cards.length / 2) finishQuiz();
            persist();
            renderQuizPage();
          } else {
            quizRun.resolving = true;
            quizRun.message = "";
            speak(translateString("Không sao, con hãy thử lại nhé."));
            const activeRun = quizRun;
            renderQuizPage();
            window.setTimeout(() => {
              if (quizRun !== activeRun) return;
              quizRun.flipped = [];
              quizRun.resolving = false;
              quizRun.message = "";
              if (route === "quiz") renderQuizPage();
            }, 900);
          }
          return;
        }
        if (event.target.closest("#completeCreativeQuiz") && quizRun?.mode === "creative") {
          const response = $("#creativeQuizResponse");
          if (!response.value.trim()) {
            $("#creativeQuizFeedback").textContent = "Con thử viết một ý tưởng hoặc kể cho người lớn nghe trước nhé.";
            response.focus();
            return;
          }
          finishQuiz();
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
            const checkButton = event.target.closest("#checkQuizOrder");
            celebrateCorrectAnswer(checkButton);
            awardXp(5, checkButton);
            finishQuiz();
          } else {
            quizRun.message = "";
            speak(translateString("Không sao, con hãy thử lại nhé."));
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
          if (reward) { awardXp(reward, claimButton); persist(); toast(`Bé nhận được ${reward} sao nhiệm vụ! 🌟`); }
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
        activeSubscription = null;
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
        if (!("speechSynthesis" in window)) { toast("Trình duyệt chưa hỗ trợ giọng đọc."); return; }
        const language = languageConfig(state.language);
        const greeting = language.greeting(state.childName || language.friend);
        speak(greeting);
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
      $("#arenaStart").addEventListener("click", () => setRoute("arena"));

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
      if (state.authenticated && !state.demoAccount) {
        refreshActiveSubscription()
          .then(() => renderRoute())
          .catch((error) => console.error("Không thể khôi phục trạng thái gói Premium.", error));
      }
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
