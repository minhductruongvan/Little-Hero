    (() => {
      "use strict";

      const STORAGE_KEY = "little-hero-new-home-v1";
      const API_BASE = location.port === "5500" ? "http://127.0.0.1:31377" : "";
      const apiUrl = (path) => `${API_BASE}${path}`;
      const { categories, lessons, lessonFollowUps, questSpecs, challengeSpecs } = window.LittleHeroLessonCatalog;
      const freshState = () => ({
        childName: "",
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
        authenticated: false,
        accountEmail: "",
        dailyReviews: [],
        lastRoute: "",
        lastHomeScroll: 0,
        reviews: [],
        forumPosts: [],
        children: [],
        activeChildId: "",
        learningHistory: [],
        dailyUsage: {},
        dailyStudy: {},
        parentControls: { dailyLimit: 60, blockPurchases: true, safeContent: true, notifyLearning: true, notifyPractice: true },
        closet: { gender: "boy", hair: "curly", hairColor: "#624337", shirt: "#53b99d", pants: "#536f92", shoes: "#e98257", accessory: "cape", outfit: "classic" }
      });
      let state = freshState();
      const forumMediaUrls = new Map();
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        if (stored && typeof stored === "object") state = { ...state, ...stored };
      } catch (error) {
        console.warn("Không thể đọc tiến độ Little Hero từ thiết bị.", error);
      }

      const childProgressFields = ["childName", "xp", "rp", "completed", "completedDays", "challenges", "gameRewards", "quiz", "sessionSeconds", "studySeconds", "dailyLessons", "dailyQuiz", "lessonMistakes", "sessionDay", "questClaims", "closet", "learningHistory", "dailyUsage", "dailyStudy"];
      const accountProgressFields = [...childProgressFields, "children", "activeChildId", "premium", "parentControls", "reviews", "forumPosts", "dailyReviews"];
      const accountStorageKey = (email) => `${STORAGE_KEY}:account:${email}`;
      const normalizeProgressState = () => {
        if (!Array.isArray(state.children) || !state.children.length) {
          const childId = "child-1";
          state.children = [{ id: childId, name: state.childName || "Bé", age: 6, ...Object.fromEntries(childProgressFields.map((key) => [key, state[key]])) }];
          state.activeChildId = childId;
        }
        state.activeChildId = state.children.some((child) => child.id === state.activeChildId) ? state.activeChildId : state.children[0].id;
        const activeChild = state.children.find((child) => child.id === state.activeChildId);
        childProgressFields.forEach((key) => {
          if (activeChild[key] !== undefined) state[key] = activeChild[key];
        });
        state.childName = activeChild.name || state.childName;
        state.learningHistory = Array.isArray(state.learningHistory) ? state.learningHistory : [];
        state.gameRewards = Array.isArray(state.gameRewards) ? state.gameRewards : [];
        state.dailyUsage = state.dailyUsage && typeof state.dailyUsage === "object" ? state.dailyUsage : {};
        state.dailyStudy = state.dailyStudy && typeof state.dailyStudy === "object" ? state.dailyStudy : {};
        state.studySeconds = Number(state.studySeconds) || 0;
        state.parentControls = { ...freshState().parentControls, ...(state.parentControls || {}) };
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
        if (!savedProgress && accountName) state.childName = accountName;
        normalizeProgressState();
      };
      const savedAccountEmail = state.authenticated === true && typeof state.accountEmail === "string"
        ? state.accountEmail.trim().toLowerCase()
        : "";
      if (/^[^\s@]+@gmail\.com$/i.test(savedAccountEmail)) {
        loadAccountProgress(savedAccountEmail);
      } else {
        const defaults = freshState();
        accountProgressFields.forEach((key) => { state[key] = defaults[key]; });
        state.accountEmail = "";
        state.authenticated = false;
        normalizeProgressState();
      }

      const $ = (selector, root = document) => root.querySelector(selector);
      const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      })[char]);
      const { safeWardrobe, renderHeroCharacterSvg, setCharacterExpression } = window.createLittleHeroCharacterModel({ freshState, escapeHtml });
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
        $("#dialogContent").innerHTML = content;
        if (!dialog.open) dialog.showModal();
      };
      const speak = (text) => {
        if (!("speechSynthesis" in window)) {
          toast("Trình duyệt chưa hỗ trợ giọng đọc. Bé vẫn có thể đọc nội dung trên màn hình.");
          return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "vi-VN";
        utterance.rate = 0.92;
        const vietnameseVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith("vi"));
        if (vietnameseVoice) utterance.voice = vietnameseVoice;
        utterance.onerror = (event) => {
          if (event.error !== "canceled" && event.error !== "interrupted") toast("Không thể phát giọng đọc trên thiết bị này.");
        };
        window.speechSynthesis.speak(utterance);
      };
      const closeDialog = () => $("#appDialog").close();
      const closeParentConfirmation = () => {
        const dialog = $("#appDialog");
        if (dialog.dataset.parentConfirmation !== "true") { closeDialog(); return; }
        dialog.dataset.parentConfirmation = "false";
        closeDialog();
        if (route === "parents") setRoute("home");
      };
      const closeOpenDialog = () => {
        if ($("#appDialog").dataset.parentConfirmation === "true") closeParentConfirmation();
        else closeDialog();
      };
      const lessonById = (id) => lessons.find((lesson) => lesson.id === id);
      const completedCount = () => state.completed.length;
      const currentDay = () => new Date().toLocaleDateString("sv-SE");
      const recordLearningAttempt = (lesson, choice, questionIndex = 0, correctIndex = lesson.correct) => {
        state.learningHistory.push({ lessonId: lesson.id, questionIndex, choice, correct: choice === correctIndex, at: new Date().toISOString() });
        state.learningHistory = state.learningHistory.slice(-500);
      };
      const PAYMENT_CONFIG = {
        bankName: "MB BANK",
        bankCode: "970422",
        accountName: "LITTLE HERO",
        accountNumber: "16030616032006",
        amount: 99000,
        transferNote: "LITTLE HERO"
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
        document.body.dataset.authenticated = String(state.authenticated);
        $("#upgradeBtn").textContent = state.premium ? "♛ Premium của bé" : "♛ Premium";
        $("#xpValue").textContent = `${state.xp} · Lv ${Math.floor(state.xp / 100) + 1}`;
        $("#streakValue").textContent = `${streak()} ngày`;
        $("#timeToday").textContent = `${Math.floor(state.sessionSeconds / 60)} phút`;
        $("#journalLessons").textContent = completedCount();
        $("#journalStars").textContent = `${state.xp} ⭐`;
        $("#journalDays").textContent = state.completedDays.length;
        const savedReviews = state.reviews || [];
        const testimonialColors = [["#f2faf5", "#39a454", "👩🏻"], ["#fff9ed", "#ff9d22", "👩🏻‍🦰"], ["#f1f9ff", "#1684e8", "👨🏻"], ["#f8f1ff", "#9138e8", "👩🏽"]];
        $("#homeTestimonials").innerHTML = savedReviews.length
          ? [...savedReviews].slice(-4).reverse().map((review, index) => {
            const [background, color, avatar] = testimonialColors[index];
            const stars = Math.max(1, Math.min(5, Number(review.stars) || 0));
            return `<article class="testimonial-card" style="--testimonial-bg:${background};--testimonial-color:${color}">
              <div class="testimonial-person"><span class="testimonial-avatar" aria-hidden="true">${avatar}</span><span><span class="kicker">PHẢN HỒI TRÊN THIẾT BỊ</span><span class="review-stars" aria-label="${stars} trên 5 sao">${"★".repeat(stars)}${"☆".repeat(5 - stars)}</span></span></div>
              <blockquote class="testimonial-quote">“${escapeHtml(review.body)}”</blockquote>
              <div><div class="testimonial-name">${escapeHtml(review.author || "Phụ huynh")} · chưa xác minh</div><small class="note">Đánh giá lưu cục bộ · ${escapeHtml(review.date || "")}</small></div>
            </article>`;
          }).join("")
          : `<article class="testimonial-card" style="grid-column:1/-1;min-height:170px;align-items:center;text-align:center">
              <div class="testimonial-avatar" aria-hidden="true">💬</div><div><strong>Chưa có phản hồi trên thiết bị này</strong><p class="note">Mời ba mẹ chia sẻ trải nghiệm thật để câu chuyện của gia đình mình xuất hiện tại đây.</p></div>
              <a class="btn btn-light btn-small" href="#/reviews" data-route="reviews">Viết đánh giá đầu tiên</a>
            </article>`;
        $("#journalTip").textContent = completedCount()
          ? "Cùng bé thử hoạt động ngoài đời trong bài vừa học, rồi khen nỗ lực của con."
          : "Chọn một bài học để Hero tìm hoạt động phù hợp cùng bé.";
        $("#rankPoints").textContent = `${state.rp} RP`;
        renderQuests();
        renderChallengeList();
      };

      const renderDropdown = () => {
        $("#lessonDropdown").innerHTML = categories.map((category) =>
          `<a href="#/lesson/${category.lesson}" data-route="lesson/${category.lesson}">${category.icon} &nbsp; ${category.name}</a>`
        ).join("");
      };
      const renderJourneyMap = (container, detailed = false) => {
        const islandColors = ["#f28b62", "#8d82d4", "#4ba9cf", "#46a87c", "#e7ad45", "#67a258", "#dc79ae", "#548fc2"];
        const stops = [
          [16, 19], [38, 14], [66, 24], [89, 44],
          [76, 62], [49, 68], [18, 83], [48, 89]
        ];
        const path = "M 160 117 C 225 57 305 55 380 90 S 570 96 666 152 S 820 208 893 270 S 828 357 761 388 S 620 433 486 421 S 300 427 182 516 S 330 580 475 551";
        const stopMarkup = categories.map((category, index) => {
          const lesson = lessonById(category.lesson);
          const done = Boolean(lesson && state.completed.includes(lesson.id));
          const [left, top] = stops[index];
          return `<button class="journey-stop" style="left:${left}%;top:${top}%;--island-left:${left}%;--island-top:${top}%;--island-color:${islandColors[index]}" data-lesson="${category.lesson}" title="${escapeHtml(lesson?.title || category.name)}" aria-label="Bài ${String(index + 1)}: ${escapeHtml(lesson?.title || category.name)}">
            <span class="number">ĐIỂM ${String(index + 1).padStart(2, "0")}</span><span class="island-icon" aria-hidden="true">${category.icon}</span>
            <h3>${escapeHtml(lesson?.title || category.name)}</h3><p>${escapeHtml(category.name)}</p>
            <span class="island-hover-title" aria-hidden="true">${escapeHtml(category.name)}<br><strong>${escapeHtml(lesson?.title || category.name)}</strong><br>${done ? "✓ Đã hoàn thành" : "▶ Bắt đầu bài học"}</span>
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
        if (detailed) {
          const setStopEmphasis = (button, active) => {
            const isMobile = window.matchMedia("(max-width: 760px)").matches;
            button.style.zIndex = active ? "4" : "";
            button.style.transform = active ? isMobile ? "translate(-50%, calc(-50% - 4px)) scale(1.04)" : "translate(-50%, calc(-50% - 7px)) scale(1.08)" : "";
            button.style.boxShadow = active ? "0 15px 30px #244b4b55" : "";
            button.style.borderRadius = active ? "24px" : "";
            button.querySelector(".island-hover-title").style.display = active && !isMobile ? "block" : "";
          };
          container.querySelectorAll(".journey-stop").forEach((button) => {
            button.addEventListener("pointerenter", () => setStopEmphasis(button, true));
            button.addEventListener("pointerleave", () => setStopEmphasis(button, button.matches(":focus-visible")));
            button.addEventListener("focus", () => setStopEmphasis(button, true));
            button.addEventListener("blur", () => setStopEmphasis(button, false));
          });
        }
      };
      const renderIslands = () => {
        renderJourneyMap($("#islandGrid"));
      };
      const renderFeatured = (lesson = lessons.find((item) => !state.completed.includes(item.id)) || lessons[0]) => {
        const category = categories.find((item) => item.id === lesson.category);
        $("#featuredLesson").innerHTML = `<div class="lesson-art" style="background:linear-gradient(145deg,${category.color},#ffffff)">
          <span class="lesson-emoji">${lesson.icon}</span><span class="lesson-note">✦ TÌNH HUỐNG GẦN GŨI</span>
        </div><div class="lesson-copy"><span class="tag">${category.icon} ${escapeHtml(category.name)}</span>
          <h3>${escapeHtml(lesson.title)}</h3><p>${escapeHtml(lesson.goal)}</p>
          <div class="lesson-meta"><span>♧ ${lesson.age}</span><span>◷ ${lesson.duration}</span><span>⭐ +${lesson.reward}</span></div>
          <button class="btn btn-mint btn-small" data-route="lesson/${lesson.id}">${state.completed.includes(lesson.id) ? "↻ Học lại bài này" : "Bắt đầu câu chuyện →"}</button>
        </div>`;
      };
      const renderStories = () => {
        $("#storyGrid").innerHTML = ["emotion", "social", "safety"].map((id) => {
          const lesson = lessonById(id);
          const category = categories.find((item) => item.id === lesson.category);
          return `<article class="story-card"><div class="story-art" style="--story-bg:linear-gradient(145deg,${category.color},#fff)">
              <span class="story-art-icon">${lesson.icon}</span><span class="story-label">📖 TRUYỆN TƯƠNG TÁC · ${lesson.duration.toUpperCase()}</span>
            </div><div class="story-body"><span class="tag">${category.icon} ${category.name}</span><h3>${lesson.title}</h3>
              <p>${lesson.story}</p><button class="btn btn-light btn-small" data-route="lesson/${lesson.id}">Đọc & chọn cùng Hero →</button></div></article>`;
        }).join("");
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

      const leaderboardByMode = {
        duel: [["🥇", "Bảo An", 245], ["🥈", "Minh Khang", 215], ["🥉", "Gia Hân", 190], ["4", "Khánh Linh", 170], ["5", "Quang Huy", 150]],
        region: [["🥇", "Khánh Linh", 270], ["🥈", "An Nhiên", 235], ["🥉", "Quang Huy", 210], ["4", "Minh Khang", 185], ["5", "Bảo An", 160]],
        city: [["🥇", "Gia Hân", 295], ["🥈", "Bảo An", 250], ["🥉", "Khánh Linh", 225], ["4", "An Nhiên", 195], ["5", "Minh Khang", 175]],
        nation: [["🥇", "An Nhiên", 320], ["🥈", "Gia Hân", 280], ["🥉", "Minh Khang", 245], ["4", "Quang Huy", 220], ["5", "Khánh Linh", 195]],
        class: [["🥇", "Quang Huy", 180], ["🥈", "Bảo An", 160], ["🥉", "Minh Khang", 145], ["4", "Gia Hân", 130], ["5", "An Nhiên", 115]]
      };
      const renderLeaderboard = (root = document, mode = arenaMode) => {
        const leaders = leaderboardByMode[mode] || leaderboardByMode.duel;
        $("#leaderboard", root).innerHTML = leaders.map(([medal, name, points]) =>
          `<div class="leader-row"><span class="medal">${medal}</span><span><span class="leader-name">${name}</span><br><span class="leader-sub">Luyện tập chăm chỉ</span></span><span class="leader-score">${points} RP</span></div>`
        ).join("");
        const rank = Math.max(6, 2000 - Math.floor(state.rp / 10));
        $("#leaderYou", root).innerHTML = `<div class="leader-row"><span class="medal">🌟</span><span><span class="leader-name">${escapeHtml(state.childName || "Bé (bạn)")}</span><br><span class="leader-sub">Điểm của bé · ${state.rp} RP</span></span><span class="leader-score">#${rank.toLocaleString("vi-VN")}</span></div>`;
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
          renderIslands();
          renderFeatured(lessons.find((item) => !state.completed.includes(item.id)) || lesson);
          $("#leaderYou").innerHTML = `<div class="leader-row"><span class="medal">🌟</span><span><span class="leader-name">${escapeHtml(state.childName || "Bé (bạn)")}</span><br><span class="leader-sub">Điểm của bé · ${state.rp} RP</span></span><span class="leader-score">#${Math.max(6, 2000 - Math.floor(state.rp / 10)).toLocaleString("vi-VN")}</span></div>`;
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
        showDialog(`<div class="dialog-head"><div><span class="kicker">GÓI HỌC PREMIUM</span><h2 id="dialogTitle">Mở rộng hành trình khám phá</h2><p>99.000đ/tháng theo định hướng mô hình sản phẩm.</p></div><button class="close-btn" data-close aria-label="Đóng">×</button></div>
          <div class="story-box"><strong>👑 Gói dự kiến gồm:</strong><br>Mở rộng thư viện theo mục tiêu 80 bài · Truyện và hoạt động bổ sung · Nhật ký học tập nâng cao.</div>
          <p class="note">Thông tin ngân hàng, mã VietQR và cổng thanh toán chưa được cấu hình. Hiện chưa hỗ trợ chuyển khoản hoặc xác nhận giao dịch — không chuyển tiền qua trang này.</p>
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
            const utterance = new SpeechSynthesisUtterance(`Xin chào ${state.childName || "bạn nhỏ"}! Cùng Hero khám phá thế giới hôm nay nhé!`);
            utterance.lang = "vi-VN";
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
        const lesson = lessons[Math.floor(Math.random() * lessons.length)];
        showDialog(`<div class="dialog-head"><div><span class="kicker">THỬ THÁCH TÌNH HUỐNG</span><h2 id="dialogTitle">Một câu hỏi cùng Hero</h2><p>${lesson.age} · Tình huống: ${lesson.title}</p></div><button class="close-btn" data-close aria-label="Đóng">×</button></div>
          <div class="story-box">${lesson.story}</div><button class="btn btn-light btn-small" id="quizSpeak">♫ Nghe đề bài và các phương án</button><div class="answer-list">${lesson.answers.map((answer, index) => `<button class="answer" data-quiz-answer="${index}">${String.fromCharCode(65 + index)}. ${answer}</button>`).join("")}</div>
          <div class="feedback" id="quizFeedback" aria-live="polite"></div><p class="quiz-lock-note" id="quizLockNote" hidden>Câu trả lời đã được ghi nhận. Không thể chọn lại; hãy chuyển sang câu tiếp theo.</p><p class="note">Mỗi câu chỉ được chọn một lần.</p>`);
        $("#quizSpeak").addEventListener("click", () => speak(`${lesson.title}. ${lesson.story} Các phương án. ${lesson.answers.map((answer, index) => `Phương án ${index + 1}: ${answer}`).join(". ")}`));
        $("#dialogContent").querySelectorAll("[data-quiz-answer]").forEach((button) => button.addEventListener("click", () => {
          const index = Number(button.dataset.quizAnswer);
          const buttons = [...$("#dialogContent").querySelectorAll("[data-quiz-answer]")];
          buttons.forEach((item) => { item.disabled = true; });
          state.quiz += 1;
          state.dailyQuiz += 1;
          if (index === lesson.correct) {
            button.classList.add("correct");
            state.xp += 5;
            state.rp += 25;
            $("#quizFeedback").textContent = "Kết quả thành công! Bé chọn cách an toàn. +5 sao · +25 RP 🌟";
            speak(`Kết quả thành công! ${lesson.prompts[2]}`);
          } else {
            button.classList.add("try-again");
            state.xp = Math.max(0, state.xp - 3);
            state.rp = Math.max(0, state.rp - 5);
            $("#quizFeedback").textContent = "Kết quả chưa thành công. Câu này đã khóa; bé không thể đổi đáp án. Hãy xem gợi ý rồi sang câu tiếp theo.";
            speak(`Kết quả chưa thành công. ${lesson.prompts[1]} Hãy nhớ chọn cách an toàn và tìm người lớn đáng tin cậy.`);
          }
          $("#quizLockNote").hidden = false;
          persist();
          $("#rankPoints").textContent = `${state.rp} RP`;
          $("#leaderYou").innerHTML = `<div class="leader-row"><span class="medal">🌟</span><span><span class="leader-name">${escapeHtml(state.childName || "Bé (bạn)")}</span><br><span class="leader-sub">Điểm của bé · ${state.rp} RP</span></span><span class="leader-score">#${Math.max(6, 2000 - Math.floor(state.rp / 10)).toLocaleString("vi-VN")}</span></div>`;
        }));
      };

      let route = "home";
      let pendingNewsFocus = "";
      let pendingAuthRoute = "";
      const accountRequiredRoutes = new Set(["map", "lesson", "quiz", "games", "quests", "achievements", "parents", "arena", "arena-match", "payment", "premium-success", "wardrobe"]);
      let activeViewTransition = false;
      let pendingViewUpdate = null;
      let quizPageLesson = null;
      let quizPageChoice = null;
      let selectedStars = 5;
      let miniGameRun = null;
      const localizedTitles = {
        vi: { home: "Trang chủ", map: "Bản đồ ốc đảo", lessons: "Kho bài học", stories: "Truyện tranh", storybook: "Sách truyện", games: "Trò chơi", quests: "Nhiệm vụ hằng ngày", quiz: "Bài kiểm tra", achievements: "Tường thành tích", reviews: "Đánh giá ứng dụng", forum: "Diễn đàn", faq: "Câu hỏi thường gặp", wardrobe: "Tủ đồ của Hero", language: "Ngôn ngữ", parents: "Góc phụ huynh", "parent-news": "Tin tức & LITTLE HERO", auth: "Tài khoản", pricing: "Gói Premium", payment: "Thanh toán Premium", arena: "Đấu trường", tutor: "Hỏi Hero AI" },
        en: { home: "Home", map: "Island map", lessons: "Lessons", stories: "Stories", storybook: "Storybook", games: "Games", quests: "Daily quests", quiz: "Quiz", achievements: "Achievements", reviews: "App reviews", forum: "Community", faq: "FAQs", wardrobe: "Hero wardrobe", language: "Language", parents: "Parent corner", "parent-news": "News & LITTLE HERO", auth: "Account", pricing: "Premium plans", payment: "Premium payment", arena: "Challenge arena", tutor: "Ask Hero" }
      };
      const pageTitle = (name) => localizedTitles[state.language === "en" ? "en" : "vi"][name] || localizedTitles.vi[name] || name;
      const routeLink = (name, label, icon = "") => `<a class="btn btn-light btn-small" href="#/${name}" data-route="${name}">${icon}${label}</a>`;
      const pageShell = (name, description, body, icon = "✦") => `
        <button class="route-back" data-route="home">← ${pageTitle("home")}</button>
        <div class="page-heading"><span class="kicker">LITTLE HERO · ${icon}</span><h1>${escapeHtml(pageTitle(name))}</h1><p>${description}</p></div>${body}`;
      const setRoute = (nextRoute, options = {}) => {
        const targetRoute = String(nextRoute || "home").split("/")[0];
        if (!state.authenticated && accountRequiredRoutes.has(targetRoute)) {
          pendingAuthRoute = nextRoute;
          if (route !== "auth") setRoute("auth", { pop: options.pop });
          toast("Vui lòng đăng nhập để xem dữ liệu tài khoản và tiếp tục chức năng này.");
          return;
        }
        if (targetRoute === "home" && route === "auth") pendingAuthRoute = "";
        if (!options.restore && route === "home") state.lastHomeScroll = window.scrollY;
        if (nextRoute !== "arena" && arenaMatchTimeout) {
          window.clearInterval(arenaMatchTimeout);
          arenaMatchTimeout = null;
        }
        route = nextRoute || "home";
        const hash = `#/${route}`;
        if (!options.pop && location.hash !== hash) history.pushState({ route }, "", hash);
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

      const renderLessonCatalog = () => {
        const selectedCategory = route.split("/")[1] || "";
        const available = lessons.filter((lesson) => !selectedCategory || lesson.category === selectedCategory);
        const cards = available.map((lesson) => {
          const category = categories.find((item) => item.id === lesson.category);
          return `<article class="catalog-card"><span class="catalog-icon" style="--tile:${category.color}">${lesson.icon}</span>
            <div><span class="kicker">${category.name}</span><h3>${escapeHtml(lesson.title)}</h3>
              <p>${escapeHtml(lesson.goal)}<br>${lesson.age} · ${lesson.duration}${state.completed.includes(lesson.id) ? " · ⭐ Đã hoàn thành" : ""}</p>
            </div><button class="btn btn-mint btn-small" data-route="lesson/${lesson.id}">${state.completed.includes(lesson.id) ? "Học lại" : "Bắt đầu bài học"} →</button></article>`;
        }).join("");
        const chips = categories.map((category) => routeLink(`lessons/${category.id}`, `${category.icon} ${category.name}`)).join("");
        $("#routeView").innerHTML = pageShell("lessons", "Chọn một tình huống gần gũi và cùng Hero tìm cách xử lý an toàn.", `<div class="page-actions">${routeLink("lessons", "Tất cả chủ đề", "🏝️")}${chips}</div><div class="lesson-catalog">${cards}</div>`, "KHO BÀI HỌC");
      };

      const { getScene, renderSceneBackdrop, renderSceneActor } = window.createLittleHeroSceneModel({ escapeHtml, freshState, safeWardrobe, renderHeroCharacterSvg, state });
      const playSceneEnvironment = (sceneId) => {
        const scene = $(`#${sceneId}`);
        const card = scene?.closest(".scene-card");
        if (!scene || !card) return;
        card.classList.remove("playing");
        void card.offsetWidth;
        card.classList.add("playing");
        window.setTimeout(() => { if (card.isConnected) card.classList.remove("playing"); }, 3400);
      };
      const playSceneAnimation = (sceneId, actorIds, statusId, statusText) => {
        const scene = $(`#${sceneId}`);
        if (!scene) return;
        playSceneEnvironment(sceneId);
        actorIds.forEach((id, index) => {
          const actor = $(`#${id}`);
          if (!actor) return;
          actor.classList.remove("action-wave", "action-help", "action-calm", "action-unsafe", "action-approach", "action-celebrate", "action-walk", "action-run", "action-jump", "action-pickup", "action-receive");
          void actor.offsetWidth;
          actor.classList.add(index === 0 ? "action-walk" : "action-jump");
        });
        const status = $(`#${statusId}`);
        if (status) {
          const story = status.querySelector("#sceneStory");
          if (story) story.textContent = statusText;
          else status.textContent = `🎬 ${statusText}`;
        }
      };
      const movementForChoice = (answer, correct) => {
        const choice = answer.toLocaleLowerCase("vi");
        if (correct && ["nhặt", "gom", "xếp lại", "xây lại"].some((phrase) => choice.includes(phrase))) return "action-pickup";
        if (["chạy", "đi theo", "tự đi", "đi ra", "quay lại", "một mình"].some((phrase) => choice.includes(phrase))) return "action-run";
        if (["chào", "rửa tay", "bỏ vỏ bánh", "bắt đầu", "tìm thùng", "đến nơi"].some((phrase) => choice.includes(phrase))) return "action-walk";
        if (correct && ["chơi cùng", "vui vẻ", "cùng vui"].some((phrase) => choice.includes(phrase))) return "action-jump";
        return correct ? "action-help" : "action-unsafe";
      };
      const propForChoice = (answer, lesson) => {
        const choice = answer.toLocaleLowerCase("vi");
        if (choice.includes("sách")) return "📚";
        if (choice.includes("xếp") || choice.includes("xây lại") || choice.includes("khối")) return "🧱";
        if (choice.includes("rửa tay")) return "🫧";
        if (choice.includes("rác") || choice.includes("vỏ bánh") || choice.includes("thùng")) return "🗑️";
        if (choice.includes("xin lỗi")) return "💛";
        return lesson.category === "emotion" ? "💬" : lesson.category === "social" ? "🤝" : "✨";
      };

      const renderLessonRoute = (lessonId) => {
        const lesson = lessonById(lessonId);
        if (!lesson) { $("#routeView").innerHTML = pageShell("lessons", "Không tìm thấy bài học này.", routeLink("lessons", "Xem kho bài học", "🏝️")); return; }
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
          <div class="lesson-layout">
            <div>
              <div class="lesson-progress"><span>📖 Mạch câu chuyện</span><span id="questionProgress">Câu hỏi 1/3${done ? " · Đã hoàn thành, có thể luyện tập lại" : ""}</span></div>
              <article class="scene-card">
                <div class="scene ${scene.type}" id="lessonScene">
                  ${renderSceneBackdrop(scene)}
                  <span class="scene-kicker">📍 ${scene.place}</span><span class="scene-prop" id="sceneProp">${scene.prop}</span>
                  ${renderSceneActor("heroActor", "Hero", true)}
                  ${renderSceneActor("friendActor", scene.friend.name, false, scene.friend)}
                </div>
                <div class="scene-status" id="sceneStatus" aria-live="polite">🎬 <span><strong>Phim hoạt cảnh tương tác:</strong> <span id="sceneStory">${escapeHtml(lesson.story)}</span></span></div>
                <div class="scene-video-controls"><button id="lessonVideoPlay" type="button">▶ Xem phim tình huống</button><div class="scene-video-track" aria-hidden="true"><i></i></div><span>0:03</span></div>
              </article>
              <div class="score-card" style="margin-top:14px">
                <div class="lesson-progress"><span><strong>${escapeHtml(lesson.title)}</strong></span><span>⭐ +3 mỗi câu đúng · lần đầu hoàn thành +${lesson.reward} · sai −3</span></div>
                <p id="questionStory" style="margin:5px 0 11px;color:#687789;font-size:11px"></p>
                <p id="questionPrompt" style="margin:5px 0 11px;font-size:12px;font-weight:800"></p>
                <div class="page-actions"><button class="btn btn-light btn-small" id="sceneReplay">▶ Xem hoạt cảnh</button><button class="btn btn-light btn-small" id="lessonSpeak">♫ Nghe đề bài và 3 phương án</button></div>
                <div class="lesson-choices" id="lessonChoices"></div>
                <p class="lesson-feedback" id="lessonRouteFeedback" aria-live="polite">${prior ? `Bé đã thử ${prior} lựa chọn chưa phù hợp. Hãy bình tĩnh suy nghĩ lại nhé.` : "Bé hãy chọn phương án mình nghĩ là phù hợp."}</p>
              </div>
            </div>
            <aside>
              <div class="score-card"><span class="kicker">HỌC QUA TRẢI NGHIỆM</span><h3 style="margin:6px 0;font-size:16px">${escapeHtml(lesson.goal)}</h3>
                <div class="lesson-meta"><span>♧ ${lesson.age}</span><span>◷ ${lesson.duration}</span></div>
                <div class="thinking-prompts"><strong style="font-size:11px">Gợi ý để bé suy nghĩ</strong>${lesson.prompts.slice(0, 2).map((prompt) => `<div>${escapeHtml(prompt)}</div>`).join("")}</div>
                <p class="note">Nếu tình huống xảy ra ngoài đời và bé cảm thấy không an toàn, hãy rời đi và báo ngay người lớn đáng tin cậy.</p>
                <button class="btn btn-light btn-small" data-route="lessons">← Quay lại kho bài học</button>
              </div>
              <div class="score-card" style="margin-top:12px"><strong>🌱 Thử thách ngoài đời</strong><p style="margin:6px 0;color:#6c7988;font-size:10px">${escapeHtml(lesson.activity)}</p></div>
            </aside>
          </div>
        `, "BÀI HỌC TƯƠNG TÁC");
        $("#heroActor").style.setProperty("--hero-shirt", safeWardrobe(state.closet).shirt);
        $("#heroActor").style.setProperty("--hero-pants", safeWardrobe(state.closet).pants);
        $("#heroActor").style.setProperty("--hero-shoes", safeWardrobe(state.closet).shoes);
        $("#lessonVideoPlay").addEventListener("click", () => playSceneAnimation("lessonScene", ["heroActor", "friendActor"], "sceneStatus", "Hero bước đến trò chuyện cùng bạn."));
        const renderQuestion = () => {
          const question = questions[questionIndex];
          $("#questionProgress").textContent = `Câu hỏi ${questionIndex + 1}/${questions.length}${done ? " · Đã hoàn thành, có thể luyện tập lại" : ""}`;
          $("#questionStory").textContent = question.story;
          $("#questionPrompt").textContent = question.prompt;
          $("#sceneStory").textContent = question.story;
          $("#lessonChoices").innerHTML = question.answers.map((answer, index) =>
            `<button type="button" class="lesson-choice" data-choice="${index}"><span class="choice-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(answer)}</span></button>`
          ).join("");
          $("#lessonRouteFeedback").textContent = "Bé hãy chọn phương án mình nghĩ là phù hợp.";
          $("#lessonChoices").querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => {
            if (button.disabled) return;
            const choice = Number(button.dataset.choice);
            const correct = choice === question.correct;
            recordLearningAttempt(lesson, choice, questionIndex, question.correct);
            button.disabled = true;
            ["heroActor", "friendActor"].forEach((id) => {
              const actor = $(`#${id}`);
              actor.classList.remove("action-wave", "action-help", "action-calm", "action-unsafe", "action-approach", "action-celebrate", "action-walk", "action-run", "action-jump", "action-pickup", "action-receive");
              void actor.offsetWidth;
            });
            playSceneEnvironment("lessonScene");
            const selectedAnswer = question.answers[choice];
            const movement = movementForChoice(selectedAnswer, correct);
            $("#heroActor").classList.add(movement);
            $("#friendActor").classList.add(correct ? (movement === "action-pickup" ? "action-receive" : "action-wave") : "action-unsafe");
            setCharacterExpression($("#heroActor"), correct ? "happy" : "sad");
            setCharacterExpression($("#friendActor"), correct ? "happy" : ($("#friendActor").classList.contains("adult-actor") ? "angry" : "sad"));
            $("#sceneProp").textContent = correct ? propForChoice(selectedAnswer, lesson) : "⚡";
            $("#sceneStory").textContent = correct
              ? selectedAnswer
              : "Thử lại nhé: Cùng Hero suy nghĩ cách an toàn và phù hợp hơn.";
            speak(correct
              ? `Kết quả thành công! ${question.prompt}`
              : `Mình cùng nghĩ lại nhé. ${question.story} Hãy thử một phương án khác.`);
            window.setTimeout(() => {
              if (!button.isConnected) return;
              if (!correct) {
                button.classList.add("incorrect");
                state.xp = Math.max(0, state.xp - 3);
                state.rp = Math.max(0, state.rp - 5);
                state.lessonMistakes = state.lessonMistakes || {};
                state.lessonMistakes[lesson.id] = (state.lessonMistakes[lesson.id] || 0) + 1;
                persist();
                $("#lessonRouteFeedback").textContent = "Chưa phải lựa chọn phù hợp (−3 sao). Bé có thể bình tĩnh suy nghĩ và thử lại nhé.";
                window.setTimeout(() => { if (button.isConnected) button.disabled = false; }, 120);
                return;
              }
              button.classList.add("correct");
              state.xp += 3;
              $("#lessonChoices").querySelectorAll("[data-choice]").forEach((option) => { option.disabled = true; });
              if (questionIndex < questions.length - 1) {
                $("#lessonRouteFeedback").textContent = "Đúng rồi! +3 sao 🌟 Câu chuyện tiếp tục…";
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
                persist();
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
              const nextLesson = lessons[lessons.indexOf(lesson) + 1];
              const continueButton = document.createElement("button");
              continueButton.className = "btn btn-mint btn-small";
              continueButton.id = "finishLesson";
              continueButton.style.marginTop = "9px";
              continueButton.textContent = nextLesson ? `Câu chuyện tiếp theo: ${nextLesson.title} →` : "Xem kho bài học →";
              continueButton.addEventListener("click", () => setRoute(nextLesson ? `lesson/${nextLesson.id}` : "lessons"));
              $("#lessonChoices").insertAdjacentElement("afterend", continueButton);
            }, 620);
          }));
        };
        renderQuestion();
        $("#sceneReplay").addEventListener("click", () => {
          playSceneAnimation("lessonScene", ["heroActor", "friendActor"], "sceneStatus", "Hero bước tới chào hỏi và bắt đầu câu chuyện.");
        });
        $("#lessonSpeak").addEventListener("click", () => {
          const question = questions[questionIndex];
          speak(`${question.story} ${question.prompt} ${question.answers.map((answer, index) => `Phương án ${index + 1}: ${answer}`).join(". ")}`);
        });
      };

      const renderStoriesPage = () => {
        const stories = lessons.map((lesson) => {
          const category = categories.find((item) => item.id === lesson.category);
          return `<article class="storybook-card">
            <div class="storybook-cover" style="--book-bg:${category.color}"><span class="storybook-cover-icon" aria-hidden="true">${lesson.icon}</span><span class="story-label">TRUYỆN TRANH · ${escapeHtml(lesson.duration)}</span></div>
            <div class="storybook-card-copy"><span class="kicker">${category.icon} ${escapeHtml(category.name)}</span><h2>${escapeHtml(lesson.title)}</h2><p>${escapeHtml(lesson.story)}</p>
              <button class="btn btn-mint btn-small" data-route="storybook/${lesson.id}">📖 Mở sách truyện</button></div></article>`;
        }).join("");
        $("#routeView").innerHTML = pageShell("stories", "Mỗi câu chuyện ngắn được chia thành từng trang. Cùng bé lật sách, quan sát và sau đó thử tình huống tương tác.", `<div class="storybook-grid">${stories}</div>`, "GÓC TRUYỆN");
      };

      const storybookPages = new Map();
      const renderStorybookPage = (lessonId) => {
        const lesson = lessonById(lessonId);
        if (!lesson) {
          $("#routeView").innerHTML = pageShell("stories", "Không tìm thấy câu chuyện này.", routeLink("stories", "← Về thư viện truyện"));
          return;
        }
        const category = categories.find((item) => item.id === lesson.category);
        const pages = [
          { kicker: "BÌA TRUYỆN", title: lesson.title, text: lesson.goal, icon: lesson.icon },
          { kicker: "TRANG 1 · MỘT CHUYỆN NHỎ", title: "Chuyện bắt đầu", text: lesson.story, icon: lesson.icon },
          { kicker: "TRANG 2 · LẮNG NGHE", title: "Nhân vật đang nghĩ gì?", text: `${lesson.prompts[0]} ${lesson.prompts[1]}`, icon: "💭" },
          { kicker: "TRANG 3 · CÙNG NGHĨ", title: "Mình có thể làm gì?", text: `${lesson.prompts[2]} ${lesson.prompts[3] || ""}`.trim(), icon: "✨" }
        ];
        const pageIndex = Math.max(0, Math.min(pages.length - 1, storybookPages.get(lessonId) || 0));
        storybookPages.set(lessonId, pageIndex);
        const page = pages[pageIndex];
        $("#routeView").innerHTML = pageShell("storybook", `Truyện ${escapeHtml(category.name)} · ${escapeHtml(lesson.duration)} · Dùng nút hoặc phím mũi tên để lật trang.`, `
          <div class="storybook" id="storybook" tabindex="0" aria-label="Sách truyện ${escapeHtml(lesson.title)}">
            <div class="storybook-spread" id="storybookSpread" aria-live="polite">
              <div class="storybook-picture" style="--book-bg:${category.color}" role="img" aria-label="${escapeHtml(page.icon)}">
                <span class="storybook-picture-icon" aria-hidden="true">${page.icon}</span>
              </div>
              <article class="storybook-page-copy">
                <span class="kicker">${page.kicker}</span><h2>${escapeHtml(page.title)}</h2><p>${escapeHtml(page.text)}</p>
                <span class="storybook-page-number">LITTLE HERO · ${String(pageIndex + 1).padStart(2, "0")} / ${String(pages.length).padStart(2, "0")}</span>
              </article>
            </div>
            <div class="storybook-controls">
              <button class="btn btn-light btn-small" type="button" data-story-page="-1" ${pageIndex === 0 ? "disabled" : ""}>← Trang trước</button>
              <span class="storybook-counter">Trang ${pageIndex + 1} / ${pages.length}</span>
              ${pageIndex < pages.length - 1
                ? `<button class="btn btn-mint btn-small" type="button" data-story-page="1">Lật trang →</button>`
                : `<button class="btn btn-mint btn-small" type="button" data-route="lesson/${lesson.id}">Cùng Hero vào truyện →</button>`}
            </div>
          </div>
          <div class="page-actions">${routeLink("stories", "← Về thư viện truyện")}</div>`, "SÁCH TRUYỆN");
        const book = $("#storybook");
        book.addEventListener("click", (event) => {
          const turn = event.target.closest("[data-story-page]");
          if (!turn || turn.disabled) return;
          storybookPages.set(lessonId, pageIndex + Number(turn.dataset.storyPage));
          renderStorybookPage(lessonId);
          $("#storybook").focus();
        });
        book.addEventListener("keydown", (event) => {
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
          event.preventDefault();
          const direction = event.key === "ArrowRight" ? 1 : -1;
          const nextPage = Math.max(0, Math.min(pages.length - 1, pageIndex + direction));
          if (nextPage === pageIndex) return;
          storybookPages.set(lessonId, nextPage);
          renderStorybookPage(lessonId);
          $("#storybook").focus();
        });
      };

      const miniGames = {
        memory: { icon: "🃏", title: "Thẻ nhớ kỳ diệu", description: "Lật thẻ và tìm các cặp hình giống nhau. Trò chơi rèn trí nhớ và sự tập trung.", reward: 10 },
        pattern: { icon: "🔎", title: "Thám tử quy luật", description: "Quan sát chuỗi hình, tìm xem hình nào sẽ xuất hiện tiếp theo.", reward: 10 },
        feelings: { icon: "💛", title: "Nhà thám hiểm cảm xúc", description: "Đọc tình huống và đoán cảm xúc mà bạn nhỏ có thể đang trải qua.", reward: 10 }
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
          } else {
            body = renderQuestionGame(game, feelingsRounds, (round) => `<div class="feelings-question"><p>Hãy đọc tình huống:</p><blockquote>“${round.situation}”</blockquote><p>Bạn nhỏ có thể cảm thấy thế nào?</p></div>`);
          }
        } else {
          const cards = Object.entries(miniGames).map(([id, game]) => {
            const played = miniGameRewardEarned(id);
            return `<article class="game-card mini-game-card"><span class="catalog-icon" style="--tile:#fff1d9">${game.icon}</span><div class="mini-game-card-copy"><span class="game-tag">${id === "memory" ? "TRÍ NHỚ" : id === "pattern" ? "TƯ DUY LOGIC" : "GỌI TÊN CẢM XÚC"}</span><h3>${game.title}</h3><p>${game.description}</p><small>${played ? "✓ Đã nhận sao hôm nay" : `🎁 Hoàn thành nhận ${game.reward} sao`}</small></div><button class="btn btn-mint btn-small" data-mini-game-start="${id}">Chơi ngay →</button></article>`;
          }).join("");
          body = `<div class="game-welcome"><span>🌟</span><div><h2>Chơi vui, luyện trí mỗi ngày!</h2><p>Mỗi trò chỉ mất vài phút. Bé có thể thử lại thoải mái; mỗi trò thưởng sao một lần trong ngày.</p></div></div><div class="game-grid">${cards}</div>`;
        }
        $("#routeView").innerHTML = pageShell("games", "Chọn một trò chơi ngắn để luyện trí nhớ, quan sát và hiểu cảm xúc. Không có thi đấu trực tuyến hay thu thập thông tin trẻ.", body, "CHƠI & KHÁM PHÁ");
      };

      const renderQuestPage = () => {
        renderQuests();
        const rows = questSpecs.map((quest) => {
          const value = dailyProgress(quest.id);
          const claimed = state.questClaims.includes(`${currentDay()}:${quest.id}`);
          return `<article class="score-card"><span class="catalog-icon" style="--tile:#fff2d7">${quest.icon}</span><h3 style="margin:10px 0 4px;font-size:14px">${quest.label}</h3>
            <p class="note">Tiến độ: ${value}/${quest.target} · Thưởng ${quest.reward} ⭐</p><div class="progress"><i style="width:${Math.round(value / quest.target * 100)}%"></i></div>
            <button class="btn btn-small ${claimed ? "btn-light" : "btn-mint"}" style="margin-top:12px" data-claim-quest="${quest.id}" ${claimed || value < quest.target ? "disabled" : ""}>${claimed ? "Đã nhận" : "Nhận thưởng"}</button></article>`;
        }).join("");
        $("#routeView").innerHTML = pageShell("quests", "Nhiệm vụ và tiến độ được lưu trên thiết bị hiện tại.", `<div class="page-actions"><span class="stat-pill">🎮 ${state.dailyLessons}/3 bài</span><span class="stat-pill">⏱ ${Math.floor(state.sessionSeconds / 60)}/10 phút</span><span class="stat-pill">📝 ${state.dailyQuiz}/1 bài kiểm tra</span></div><div class="lesson-catalog">${rows}</div>`, "MỖI NGÀY MỘT CHÚT");
      };

      const renderQuizPage = () => {
        if (!quizPageLesson) quizPageLesson = lessons[Math.floor(Math.random() * lessons.length)];
        const lesson = quizPageLesson;
        $("#routeView").innerHTML = pageShell("quiz", "Cùng Hero suy nghĩ và chọn cách xử lý phù hợp trong từng tình huống.", `
          <article class="score-card quiz-center-card"><div class="lesson-progress"><span>🧠 Tình huống ${state.dailyQuiz + (quizPageChoice === null ? 1 : 0)}</span><span>⭐ ${state.xp} · Lv ${Math.floor(state.xp / 100) + 1}</span></div>
          <div class="story-box">${escapeHtml(lesson.story)}</div><button class="btn btn-light btn-small" id="quizPageSpeak">♫ Nghe đề bài và các phương án</button><h3 style="font-size:15px">Bé sẽ chọn cách nào?</h3>
          <div class="lesson-choices">${lesson.answers.map((answer, index) => `<button class="lesson-choice ${quizPageChoice === index ? (index === lesson.correct ? "correct" : "incorrect") : ""}" data-quiz-page="${index}" ${quizPageChoice !== null ? "disabled" : ""}><span class="choice-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(answer)}</span></button>`).join("")}</div>
          <p class="lesson-feedback" id="quizPageFeedback">${quizPageChoice === null ? "Chọn một phương án để xem phản hồi." : quizPageChoice === lesson.correct ? "Kết quả thành công! Bé chọn được cách an toàn. +5 ⭐" : "Kết quả chưa thành công. Câu này đã khóa, không thể chọn lại; hãy chuyển sang câu tiếp theo."}</p>
          ${quizPageChoice === null ? "" : '<p class="quiz-lock-note">Đáp án đã được ghi nhận và không thể thay đổi.</p>'}
          <div class="page-actions"><button class="btn btn-mint btn-small" id="nextQuiz" ${quizPageChoice === null ? "disabled" : ""}>Câu tiếp theo →</button>${routeLink("achievements", "Xem thành tích", "🏅")}</div></article>
        `, "ÔN TẬP QUA TÌNH HUỐNG");
        $("#quizPageSpeak").addEventListener("click", () => speak(`${lesson.title}. ${lesson.story} Các phương án. ${lesson.answers.map((answer, index) => `Phương án ${index + 1}: ${answer}`).join(". ")}`));
      };

      const renderAchievementsPage = () => {
        const badges = [
          ["🌱", "Bước đầu tiên", "Hoàn thành bài học đầu tiên", completedCount() >= 1],
          ["🔥", "Ngày chăm chỉ", "Học xong bài trong một ngày", streak() >= 1],
          ["🧠", "Người suy nghĩ", "Hoàn thành một bài kiểm tra", state.quiz >= 1],
          ["🤝", "Người bạn tốt", "Xác nhận một thử thách ngoài đời", state.challenges.length >= 1],
          ["🏝️", "Nhà khám phá", "Hoàn thành ba chủ đề", completedCount() >= 3],
          ["⭐", "Ngôi sao nhỏ", "Tích lũy 50 sao", state.xp >= 50]
        ].map(([icon, name, detail, unlocked]) => `<article class="achievement-card"><span class="badge-icon">${icon}</span><h3 style="margin:7px 0 4px;font-size:13px">${name} ${unlocked ? "✓" : "🔒"}</h3><p class="note">${detail}</p></article>`).join("");
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
            <div class="social-post-head"><span class="social-avatar" aria-hidden="true">🦸</span><div><strong>${escapeHtml(post.author || "Gia đình Little Hero")}${post.repostOf ? " · đã đăng lại" : ""}</strong><small>${escapeHtml(post.date || currentDay())} · Cộng đồng Little Hero · lưu trên thiết bị</small></div></div>
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
        $("#routeView").innerHTML = pageShell("forum", "Bảng tin chia sẻ trạng thái, ảnh, video, cảm xúc, bình luận và đăng lại. Nội dung được lưu trên thiết bị, không phát tán ra cộng đồng trực tuyến.", `
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
          ["Little Hero phù hợp với độ tuổi nào?", "Nội dung hướng đến trẻ 4–8 tuổi. Phụ huynh nên đồng hành và điều chỉnh hoạt động theo khả năng của mỗi bé."],
          ["Làm sao để lưu tiến độ?", "Tiến độ được lưu trong trình duyệt trên thiết bị hiện tại; chưa có tài khoản máy chủ hoặc đồng bộ."],
          ["Các tình huống có thay thế tư vấn chuyên gia không?", "Không. Nội dung là gợi ý giáo dục tổng quát, không thay thế tư vấn của chuyên gia giáo dục, tâm lý hoặc y tế."],
          ["Đăng nhập Google đã hoạt động chưa?", "Chưa. Cần tạo Google OAuth Client ID và dịch vụ máy chủ xác thực token trước khi đưa đăng nhập thật vào sử dụng."],
          ["Thanh toán Premium có thể chuyển khoản chưa?", "Thông tin thanh toán chưa được cấu hình và hệ thống chưa xác nhận giao dịch. Không chuyển khoản qua trang này."],
          ["Ứng dụng thu thập thông tin của trẻ không?", "Dữ liệu hiện được lưu trên thiết bị và chưa gửi lên máy chủ. Không nhập thông tin nhạy cảm của trẻ."]
        ];
        $("#routeView").innerHTML = pageShell("faq", "Một số câu hỏi thường gặp về cách sử dụng Little Hero.", `<div class="faq-grid">${questions.map(([question, answer]) => `<details class="faq-card"><summary>${question}</summary><p>${answer}</p></details>`).join("")}</div>`, "HỖ TRỢ GIA ĐÌNH");
      };

      const renderReviewsPage = () => {
        const saved = state.reviews || [];
        const average = saved.length ? saved.reduce((sum, review) => sum + Number(review.stars || 0), 0) / saved.length : 0;
        const ratingBreakdown = [5,4,3,2,1].map((stars) => {
          const count = saved.filter((review) => Number(review.stars) === stars).length;
          const width = saved.length ? Math.round(count / saved.length * 100) : 0;
          return `<div class="rating-bar"><span>${stars} ★</span><span class="rating-bar-track"><i style="width:${width}%"></i></span><span>${count}</span></div>`;
        }).join("");
        const reviews = saved.slice().reverse().map((review, index) => {
          const reviewId = review.id || `review-${index}`;
          return `<article class="store-review">
            <span class="review-stars" aria-label="${Number(review.stars)} trên 5 sao">${"★".repeat(Number(review.stars) || 0)}${"☆".repeat(5 - (Number(review.stars) || 0))}</span>
            <h3>${escapeHtml(review.title || "Đánh giá Little Hero")}</h3>
            <p>${escapeHtml(review.body)}</p>
            <small>${escapeHtml(review.author || "Người dùng trên thiết bị")} · ${escapeHtml(review.date || "Ngày gửi không rõ")} · lưu trên thiết bị</small>
            <div class="page-actions"><button class="btn btn-light btn-small" type="button" data-review-helpful="${escapeHtml(reviewId)}">👍 Hữu ích (${Number(review.helpful) || 0})</button></div>
          </article>`;
        }).join("");
        $("#routeView").innerHTML = pageShell("reviews", "Giao diện đánh giá tham khảo cửa hàng ứng dụng. Không có đánh giá Google Play/App Store được nhập hoặc xác minh; các bài dưới đây chỉ là phản hồi do người dùng nhập trên thiết bị này.", `
          <div class="social-column">
            <section class="store-rating" aria-label="Tổng quan đánh giá">
              <div class="store-rating-score"><strong>${saved.length ? average.toFixed(1) : "—"}</strong><span>${saved.length ? `${saved.length} đánh giá cục bộ` : "Chưa có đánh giá xác thực"}</span><div class="review-stars">${saved.length ? "★".repeat(Math.round(average)) + "☆".repeat(5 - Math.round(average)) : "☆☆☆☆☆"}</div></div>
              <div>${ratingBreakdown}<p class="note" style="margin:8px 0 0">Số liệu chỉ tổng hợp đánh giá trên thiết bị này, không phải xếp hạng chính thức trên kho ứng dụng.</p></div>
            </section>
            <div class="social-layout">
              <div class="social-column">
                <h2 style="margin:0;font-size:17px">Đánh giá của người dùng</h2>
                <div class="social-feed">${reviews || '<article class="store-review"><span class="kicker">CHƯA CÓ ĐÁNH GIÁ ĐÃ XÁC MINH</span><p>Chưa có phản hồi người dùng thật được cung cấp để hiển thị. Không hiển thị nhận xét mẫu hoặc đánh giá tự tạo.</p></article>'}</div>
              </div>
              <form class="review-form" id="reviewForm"><h3 style="font-size:14px">Viết đánh giá</h3>
                <label class="form-label">Tên hiển thị<input name="author" maxlength="50" value="${escapeHtml(state.childName || "")}" placeholder="Tên hiển thị (không bắt buộc)"></label>
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
          if (!body) { toast("Hãy nhập nhận xét trước khi gửi."); return; }
          if (/(\b\d[\s.-]*){8,}|\S+@\S+|https?:\/\/|www\./i.test(`${title} ${body} ${author}`)) { toast("Hãy bỏ thông tin liên hệ riêng tư trước khi gửi nhé."); return; }
          state.reviews = [...(state.reviews || []), { id: `review-${Date.now()}`, stars: selectedStars, title, body, author: author || "Người dùng trên thiết bị", date: currentDay(), helpful: 0 }];
          persist(); renderReviewsPage(); toast("Đã lưu đánh giá trên thiết bị; đánh giá chưa được xác minh.");
        });
        $("#routeView").querySelectorAll("[data-review-helpful]").forEach((button) => button.addEventListener("click", () => {
          const review = (state.reviews || []).find((entry, index) => (entry.id || `review-${(state.reviews || []).length - index - 1}`) === button.dataset.reviewHelpful);
          if (!review) return;
          review.helpful = Number(review.helpful || 0) + 1;
          persist(); renderReviewsPage();
        }));
      };

      const renderWardrobePage = () => {
        state.closet = { ...freshState().closet, ...(state.closet || {}) };
        const closet = state.closet;
        const choices = (name, title, options) => `<div class="wardrobe-field"><strong>${title}</strong><div class="avatar-picks">${options.map(([id, label, value]) => `<button type="button" class="pick-card" data-wardrobe="${name}" data-value="${value}" aria-pressed="${closet[name] === value}"><span class="pick-icon">${label}</span><span>${id}</span></button>`).join("")}</div></div>`;
        $("#routeView").innerHTML = pageShell("wardrobe", "Phối tóc, áo, quần, giày và chọn nhân vật. Lựa chọn lưu trên thiết bị này.", `
          <div class="wardrobe-grid"><div class="wardrobe-preview">
            <div class="avatar-stage" style="--hero-shirt:${closet.shirt};--hero-pants:${closet.pants};--hero-shoes:${closet.shoes};--hero-cape:${closet.accessory === "cape" ? closet.shirt : "#f49a69"}" data-gender="${closet.gender}" aria-label="Nhân vật Hero có thể tùy chỉnh">
              ${renderHeroCharacterSvg(closet, { ariaLabel: closet.gender === "boy" ? "Hero Bin" : "Hero Mia" })}
            </div>
            <p>${closet.gender === "boy" ? "Hero Bin" : "Hero Mia"} · Bộ đồ anh hùng</p></div>
          <div class="wardrobe-controls">
            ${choices("gender", "Giới tính nhân vật", [["Nam","👦🏻","boy"],["Nữ","👧🏻","girl"]])}
            ${choices("outfit", "Phong cách trang phục nguyên bản", [["Áo choàng Hero","🦸","hero"],["Ninja cam phiêu lưu","🥷","anime-orange"],["Ninja xanh đêm","🌙","anime-navy"],["Học viện hoa anh đào","🌸","anime-rose"],["Áo choàng bóng đêm","🕶️","anime-shadow"],["Bạn robot xanh","🤖","robot-blue"],["Nhà du hành","🚀","space"],["Cổ tích lấp lánh","🧚","fairy"],["Khủng long vui nhộn","🦖","dino"],["Nhà thám hiểm cổ điển","⭐","classic"]])}
            ${choices("hair", "Kiểu tóc", [["Ngắn","✂️","short"],["Xoăn","〰️","curly"],["Dài","💇🏻","long"],["Buộc đuôi ngựa","🎀","ponytail"],["Tết hai bên","🌼","braids"]])}
            ${choices("hairColor", "Màu tóc", [["Nâu","🤎","#624337"],["Đen","⚫","#302820"],["Hung","🟠","#b76532"],["Vàng mật ong","🟡","#d7a33e"],["Tím","🟣","#7257a5"]])}
            ${choices("shirt", "Màu áo", [["Xanh mint","🟢","#53b99d"],["Cam nắng","🟠","#f48665"],["Tím sao","🟣","#8d82d4"],["Xanh biển","🔵","#568fc7"],["Hồng","🩷","#e96fa2"],["Vàng","🟡","#f1c34e"]])}
            ${choices("pants", "Màu quần / váy", [["Xanh đậm","🔹","#5e7296"],["Tím","🟣","#8d82d4"],["Xanh lá","🟢","#578f72"],["Hồng","🩷","#e96fa2"]])}
            ${choices("shoes", "Màu giày", [["Vàng","🟡","#f3a552"],["Cam","🟠","#e98257"],["Xanh","🔵","#568fc7"],["Hồng","🩷","#e96fa2"]])}
            ${choices("accessory", "Phụ kiện", [["Ngôi sao","⭐","star"],["Áo choàng","🦸","cape"],["Kính","👓","glasses"],["Không dùng","○","none"]])}
          </div></div>`, "CÁ NHÂN HÓA NHÂN VẬT");
        $("#routeView").querySelectorAll("[data-wardrobe]").forEach((button) => button.addEventListener("click", () => {
          const field = button.dataset.wardrobe;
          state.closet[field] = button.dataset.value;
          if (field === "outfit") {
            const presets = {
              classic: ["#53b99d", "#536f92", "#e98257", "cape"],
              hero: ["#398bc8", "#345f7b", "#de6549", "cape"],
              "anime-orange": ["#e87836", "#354d62", "#d85e42", "cape"],
              "anime-navy": ["#3d536f", "#30384a", "#5a6676", "cape"],
              "anime-rose": ["#c77ba4", "#425c71", "#c56978", "cape"],
              "anime-shadow": ["#594b60", "#343344", "#53464a", "cape"],
              "robot-blue": ["#4ba6c5", "#386b83", "#448eaa", "none"],
              space: ["#568fc7", "#465d7b", "#568fc7", "glasses"],
              fairy: ["#d37eb1", "#806bb1", "#f3a552", "cape"],
              dino: ["#619b64", "#526b72", "#e98257", "cape"]
            }[button.dataset.value];
            [state.closet.shirt, state.closet.pants, state.closet.shoes, state.closet.accessory] = presets;
          }
          persist(); renderWardrobePage();
        }));
      };

      const renderLanguagePage = () => {
        $("#routeView").innerHTML = pageShell("language", "Chọn ngôn ngữ giao diện. Nội dung bài học hiện có bằng tiếng Việt.", `
          <div class="score-card"><h3 style="font-size:15px">Ngôn ngữ giao diện</h3><div class="language-options">
            <button class="pick-card" data-language="vi" aria-pressed="${state.language === "vi"}"><span class="pick-icon">🇻🇳</span><strong>Tiếng Việt</strong><span class="note">Nội dung bài học</span></button>
            <button class="pick-card" data-language="en" aria-pressed="${state.language === "en"}"><span class="pick-icon">🇬🇧</span><strong>English</strong><span class="note">Menu and page labels</span></button>
          </div><p class="note" style="margin-top:12px">Lựa chọn tiếng Anh dịch các nhãn điều hướng và tên trang; truyện và bài học vẫn bằng tiếng Việt.</p></div>`, "TÙY CHỌN NGÔN NGỮ");
        $("#routeView").querySelectorAll("[data-language]").forEach((button) => button.addEventListener("click", () => {
          state.language = button.dataset.language;
          persist(); setRoute(route, { restore: true, pop: true });
        }));
      };

      const renderArenaPage = () => {
        const contestants = {
          duel: [{ name: "Minh Khang", level: "Lv 2 · 1v1" }, { name: "Bảo An", level: "Lv 1 · 1v1" }, { name: "Gia Hân", level: "Lv 3 · 1v1" }],
          region: [{ name: "Khánh Linh", level: "Đà Nẵng · Lv 2" }, { name: "Quang Huy", level: "Quảng Nam · Lv 1" }, { name: "An Nhiên", level: "Huế · Lv 3" }],
          city: [{ name: "Gia Hân", level: "Đà Nẵng · Lv 3" }, { name: "Bảo An", level: "Đà Nẵng · Lv 2" }, { name: "Khánh Linh", level: "Đà Nẵng · Lv 2" }],
          nation: [{ name: "Minh Khang", level: "Miền Bắc · Lv 2" }, { name: "Gia Hân", level: "Miền Trung · Lv 3" }, { name: "Bảo An", level: "Miền Nam · Lv 1" }],
        };
        const modes = [["duel", "Đấu 1v1"], ["region", "Khu vực"], ["city", "Thành phố"], ["nation", "Toàn quốc"]];
        $("#routeView").innerHTML = pageShell("arena", "Chọn phạm vi thi đấu và cùng các bạn luyện tập qua tình huống kỹ năng.", `
          <div class="arena-grid">
            <article class="arena-card">
              <span class="kicker">HERO ARENA</span><h3>Thi đấu qua tình huống kỹ năng</h3>
              <p>Mỗi lượt có một tình huống, hoạt cảnh nhân vật 2D và một lần chọn đáp án. Chọn sai thì câu đấu sẽ khóa.</p>
              <div class="arena-tabs" id="arenaPageTabs">${modes.map(([id, label]) => `<button class="arena-tab ${arenaMode === id ? "active" : ""}" data-mode="${id}" aria-pressed="${arenaMode === id}">${label}</button>`).join("")}</div>
              <h4 style="margin:16px 0 5px;font-size:12px">Các bạn cùng thử thách</h4>
              <div class="arena-opponents" id="arenaOpponents"></div>
              <div class="arena-search" id="arenaSearchStatus" aria-live="polite"><p class="note">Chọn một phạm vi rồi bắt đầu thử thách cùng Hero.</p></div>
              <button class="btn btn-mint" id="arenaFindOpponent">🔎 Bắt đầu thử thách</button>
            </article>
            <article class="leader-card"><div class="leader-title"><h3>🏆 Bảng vinh danh</h3><span id="leaderScope">Bạn nhỏ · tuần này</span></div><div id="leaderboard"></div><div class="leader-you" id="leaderYou"></div></article>
          </div>`, "THỬ THÁCH");
        const renderOpponents = () => {
          $("#arenaOpponents").innerHTML = contestants[arenaMode].map((player) =>
            `<div class="opponent-card"><strong>🧒 ${player.name}</strong><small>${player.level}</small></div>`
          ).join("");
          $("#leaderScope", $("#routeView")).textContent = `${modes.find(([id]) => id === arenaMode)[1]} · tuần này`;
          renderLeaderboard($("#routeView"), arenaMode);
        };
        renderOpponents();
        if (arenaMatchTimeout) { window.clearInterval(arenaMatchTimeout); arenaMatchTimeout = null; }
        $("#arenaPageTabs").addEventListener("click", (event) => {
          const tab = event.target.closest("[data-mode]");
          if (!tab) return;
          if (arenaMatchTimeout) { window.clearInterval(arenaMatchTimeout); arenaMatchTimeout = null; }
          arenaOpponent = null;
          $("#arenaFindOpponent").disabled = false;
          $("#arenaSearchStatus").innerHTML = '<p class="note">Chọn một phạm vi rồi bắt đầu thử thách cùng Hero.</p>';
          arenaMode = tab.dataset.mode;
          $("#arenaPageTabs").querySelectorAll("[data-mode]").forEach((item) => {
            const active = item === tab;
            item.classList.toggle("active", active);
            item.setAttribute("aria-pressed", String(active));
          });
          renderOpponents();
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
            const pool = contestants[arenaMode];
            arenaOpponent = pool[Math.floor(Math.random() * pool.length)];
            $("#arenaSearchStatus").innerHTML = `<div class="arena-result">✨ Sẵn sàng luyện tập cùng ${escapeHtml(arenaOpponent.name)} · ${escapeHtml(arenaOpponent.level)}<br><button class="btn btn-mint btn-small" id="startArenaMatch" style="margin-top:9px">Vào thử thách →</button></div>`;
            button.disabled = false;
          }, 1000);
        });
        $("#routeView").addEventListener("click", (event) => {
          if (!event.target.closest("#startArenaMatch")) return;
          arenaMatchLesson = lessons[Math.floor(Math.random() * lessons.length)];
          arenaMatchChoice = null;
          setRoute("arena-match");
        });
      };

      const renderArenaMatchPage = () => {
        const lesson = arenaMatchLesson || lessons[Math.floor(Math.random() * lessons.length)];
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
              <div class="scene-status" id="arenaSceneStatus" aria-live="polite">🎬 <span><strong>Phim hoạt cảnh tương tác:</strong> ${escapeHtml(lesson.story)}</span></div>
              <div class="scene-video-controls"><button id="arenaVideoPlay" type="button">▶ Xem phim tình huống</button><div class="scene-video-track" aria-hidden="true"><i></i></div><span>0:03</span></div>
            </article>
            <h3 style="font-size:15px">${escapeHtml(lesson.title)} — Bé chọn cách nào?</h3>
            <div class="lesson-choices" id="arenaMatchChoices">${lesson.answers.map((answer, index) =>
              `<button class="lesson-choice" data-arena-choice="${index}" ${arenaMatchChoice !== null ? "disabled" : ""}><span class="choice-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(answer)}</span></button>`
            ).join("")}</div>
            <p class="lesson-feedback" id="arenaMatchFeedback" aria-live="polite">${arenaMatchChoice === null ? "Quan sát hoạt cảnh rồi chọn một phương án." : "Lựa chọn đã khóa."}</p>
            <button class="btn btn-light btn-small" id="leaveArenaMatch">← Về đấu trường</button>
          </article>`, "TRẬN ĐẤU 1 CÂU");
        $("#arenaVideoPlay").addEventListener("click", () => playSceneAnimation("arenaScene", ["arenaHeroActor", "arenaFriendActor"], "arenaSceneStatus", `${lesson.title}: ${lesson.story}`));
        $("#arenaMatchChoices").addEventListener("click", (event) => {
          const button = event.target.closest("[data-arena-choice]");
          if (!button || arenaMatchChoice !== null) return;
          arenaMatchChoice = Number(button.dataset.arenaChoice);
          const success = arenaMatchChoice === lesson.correct;
          const hero = $("#arenaHeroActor");
          const friend = $("#arenaFriendActor");
          [hero, friend].forEach((actor) => {
            actor.classList.remove("action-wave", "action-help", "action-calm", "action-unsafe", "action-approach", "action-celebrate", "action-walk", "action-run", "action-jump", "action-pickup", "action-receive");
            void actor.offsetWidth;
          });
          playSceneEnvironment("arenaScene");
          hero.classList.add(movementForChoice(lesson.answers[arenaMatchChoice], success));
          friend.classList.add(success ? "action-wave" : "action-unsafe");
          $("#arenaSceneProp").textContent = success ? "🤝" : "⚡";
          $("#arenaSceneStatus").textContent = success
            ? `🎬 Kết quả thành công: Hero và ${opponent.name} cùng chọn cách an toàn.`
            : "🎬 Kết quả chưa thành công: Hero nhận ra cần tìm cách an toàn hơn.";
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
          <div class="auth-layout"><article class="settings-card auth-card">
            <section id="loginPanel">
              <h3 style="font-size:17px">Đăng nhập Little Hero</h3>
              <form class="simple-form" id="loginForm" autocomplete="on">
                <label class="form-label">Gmail<input name="email" type="email" autocomplete="username" required placeholder="@gmail.com"></label>
                <label class="form-label">Mật khẩu<input name="password" type="password" autocomplete="current-password" required placeholder="Nhập mật khẩu"></label>
                <button class="btn btn-mint btn-small" type="submit">Đăng nhập</button>
              </form>
              <p><button class="auth-switch" type="button" data-auth-toggle="register">Chưa có tài khoản? Đăng ký</button></p>
            </section>
            <section id="registrationPanel" hidden>
              <h3 style="font-size:17px">Đăng ký tài khoản</h3>
              <form class="simple-form" id="registrationForm" autocomplete="on" novalidate>
                <label class="form-label">Họ và tên<input name="fullName" autocomplete="name" required maxlength="80" placeholder="Họ và tên của bạn"></label>
                <label class="form-label">Gmail<input name="email" type="email" autocomplete="email" required placeholder="@gmail.com"></label>
                <label class="form-label">Số điện thoại<input name="phone" type="tel" autocomplete="tel" inputmode="tel" required maxlength="16" placeholder="+84"></label>
                <label class="form-label">Mật khẩu<input name="password" type="password" autocomplete="new-password" minlength="8" required placeholder="Ít nhất 8 ký tự"></label>
                <label class="form-label">Xác nhận mật khẩu<input name="confirmPassword" type="password" autocomplete="new-password" minlength="8" required placeholder="Nhập lại mật khẩu"></label>
                <button class="btn btn-mint btn-small" type="submit">Tạo tài khoản</button>
              </form>
              <p id="registrationError" class="auth-form-error" role="alert" aria-live="polite" hidden></p>
              <p><button class="auth-switch" type="button" data-auth-toggle="login">Đã có tài khoản? Đăng nhập</button></p>
            </section>
          </article></div>`, "TÀI KHOẢN");
        const showAuthPanel = (panel) => {
          const register = panel === "register";
          $("#loginPanel").hidden = register;
          $("#registrationPanel").hidden = !register;
          $("#routeView .page-heading p").textContent = register
            ? "Nhập họ tên, Gmail, số điện thoại và tạo mật khẩu để đăng ký tài khoản."
            : "Đăng nhập để tiếp tục hành trình; nếu chưa có tài khoản, chọn đăng ký bên dưới.";
        };
        $("#routeView").querySelectorAll("[data-auth-toggle]").forEach((button) => {
          button.addEventListener("click", () => showAuthPanel(button.dataset.authToggle));
        });
        const registrationError = $("#registrationError");
        const showRegistrationError = (message, field) => {
          registrationError.textContent = message;
          registrationError.hidden = false;
          if (field) $(`#registrationForm [name="${field}"]`).focus();
        };
        $("#registrationForm").addEventListener("input", () => {
          registrationError.textContent = "";
          registrationError.hidden = true;
        });
        $("#loginForm").addEventListener("submit", async (event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const data = new FormData(form);
          try {
            const response = await fetch(apiUrl("/api/auth/login"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: data.get("email"), password: data.get("password") })
            });
            const result = await response.json();
            if (!response.ok) { toast(result.error || "Không thể đăng nhập. Vui lòng thử lại."); return; }
            persist();
            loadAccountProgress(result.user.email, result.user.name);
            const nextRoute = pendingAuthRoute || "home";
            pendingAuthRoute = "";
            persist();
            setRoute(nextRoute);
            toast(`Chào mừng ${result.user.name} trở lại Little Hero!`);
          } catch (error) {
            console.error("Không thể kết nối tới máy chủ đăng nhập.", error);
            toast("Không thể kết nối tới máy chủ. Hãy kiểm tra máy chủ và thử lại.");
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
          if (!fullName || fullName.length > 80) { showRegistrationError("Vui lòng nhập họ và tên (tối đa 80 ký tự).", "fullName"); return; }
          if (!/^[^\s@]+@gmail\.com$/i.test(email)) { showRegistrationError("Email chưa đúng định dạng. Hãy nhập địa chỉ Gmail hợp lệ, ví dụ ten@gmail.com.", "email"); return; }
          if (!/^\+84(?:[ ()-]?\d){9,10}$/.test(phone)) { showRegistrationError("Số điện thoại chưa đúng định dạng. Hãy nhập +84 và 9–10 chữ số tiếp theo.", "phone"); return; }
          if (password.length < 8 || password.length > 128) { showRegistrationError("Mật khẩu phải có ít nhất 8 ký tự (tối đa 128 ký tự).", "password"); return; }
          if (password !== confirmPassword) { showRegistrationError("Hai mật khẩu chưa khớp. Hãy kiểm tra lại nhé.", "confirmPassword"); return; }
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
            toast("Tạo tài khoản thành công. Hãy đăng nhập bằng Gmail và mật khẩu vừa đăng ký.");
          } catch (error) {
            console.error("Không thể kết nối tới máy chủ đăng ký.", error);
            showRegistrationError("Không thể kết nối máy chủ đăng ký. Hãy chạy backend bằng lệnh `node backend/server.js` rồi thử lại.");
          } finally {
            submitButton.disabled = false;
          }
        });
      };

      const renderPaymentPage = () => {
        const configured = Boolean(PAYMENT_CONFIG.bankCode && PAYMENT_CONFIG.accountNumber && PAYMENT_CONFIG.accountName);
        const qrPanel = configured
          ? `<div class="qr-placeholder"><img src="./little-hero-payment-qr.svg" width="220" height="220" alt="Mã VietQR MB Bank: 99.000 đồng, nội dung LITTLE HERO"><span class="note">Mã QR được lưu cục bộ cùng trang, không gửi số tài khoản tới dịch vụ tạo QR bên ngoài. Vui lòng kiểm tra tên người nhận LITTLE HERO trong ứng dụng ngân hàng trước khi xác nhận.</span></div>`
          : `<div class="qr-placeholder"><span class="qr-icon" aria-hidden="true">QR<br>CHƯA CẤU HÌNH</span><strong style="font-size:12px">Chưa thể tạo mã QR thanh toán</strong><span class="note">Cần thông tin ngân hàng và tài khoản công ty đã xác minh.</span></div>`;
        $("#routeView").innerHTML = pageShell("payment", "Gói Premium 99.000đ. Kiểm tra kỹ người nhận và số tiền trong ứng dụng ngân hàng trước khi chuyển.", `
          <div class="payment-grid"><article class="settings-card"><h3 style="font-size:15px">Thông tin thanh toán</h3>
            <div class="payment-details">
              <div class="payment-row"><span>Đơn vị thụ hưởng</span><strong>${escapeHtml(PAYMENT_CONFIG.accountName || "Chưa cấu hình tên công ty")}</strong></div>
              <div class="payment-row"><span>Ngân hàng</span><strong>${escapeHtml(PAYMENT_CONFIG.bankName || "Chưa cấu hình ngân hàng")}</strong></div>
              <div class="payment-row"><span>Số tài khoản</span><strong>${escapeHtml(PAYMENT_CONFIG.accountNumber || "Chưa cấu hình số tài khoản")}</strong></div>
              <div class="payment-row"><span>Số tiền</span><strong>${PAYMENT_CONFIG.amount.toLocaleString("vi-VN")}đ</strong></div>
              <div class="payment-row"><span>Nội dung chuyển khoản</span><strong>${escapeHtml(PAYMENT_CONFIG.transferNote)}</strong></div>
            </div>
            <p class="payment-note">${configured ? "Trang chỉ cung cấp thông tin chuyển khoản; chưa kết nối hệ thống xác nhận giao dịch. Vui lòng đối chiếu đúng tên người nhận, ngân hàng và số tiền trước khi xác nhận." : "Chưa có thông tin tài khoản để tạo QR thanh toán."}</p>
            <form class="payment-confirm" id="paymentConfirmForm">
              <label><input type="checkbox" name="transferred" required><span>Tôi đã tự chuyển khoản và kiểm tra đúng người nhận, số tiền, nội dung chuyển khoản. Đây là xác nhận của người dùng; website chưa kiểm tra giao dịch.</span></label>
              <button class="btn btn-primary" ${configured ? "" : "disabled"}>Xác nhận và tiếp tục đến Premium</button>
              <p class="note" style="margin:0">Thao tác này chỉ ghi nhận trạng thái trên thiết bị; không xác nhận tiền đã vào tài khoản và không kích hoạt quyền lợi Premium.</p>
            </form>
          </article><article>${qrPanel}<div class="page-actions">${routeLink("pricing", "Quay lại gói Premium", "←")}${routeLink("faq", "Hỏi đáp thanh toán", "❔")}</div></article></div>`, "THANH TOÁN AN TOÀN");
        $("#paymentConfirmForm").addEventListener("submit", (event) => {
          event.preventDefault();
          if (!configured) { toast("Chưa có thông tin thanh toán được cấu hình."); return; }
          if (!event.currentTarget.elements.transferred.checked) { toast("Hãy xác nhận đã kiểm tra thông tin trước khi tiếp tục."); return; }
          state.premium = true;
          state.premiumRequestedAt = currentDay();
          persist();
          setRoute("premium-success");
        });
      };

      const renderPremiumSuccessPage = () => {
        $("#routeView").innerHTML = pageShell("pricing", "Thông tin gói Premium của bé.", `
          <article class="score-card" style="max-width:680px;text-align:center">
            <div style="font-size:42px">♛</div><h2 style="margin:4px 0">Đã ghi nhận trạng thái Premium</h2>
            <p>${state.premium ? "Trạng thái được lưu cục bộ trên trình duyệt này." : "Chưa có xác nhận Premium trên thiết bị này."}</p>
            <div class="story-box">Lưu ý: website chưa kết nối ngân hàng hoặc cổng thanh toán để xác minh giao dịch. Đây không phải biên nhận và không xác nhận tiền đã được nhận; quyền lợi Premium thật chưa được cấp.</div>
            <div class="page-actions" style="justify-content:center">${routeLink("home", "Về trang chủ", "⌂")}${routeLink("lessons", "Tiếp tục học", "📚")}</div>
          </article>`, "TRẠNG THÁI GÓI");
      };

      const answerAssistantQuestion = (question) => {
        const normalized = question.toLocaleLowerCase("vi").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
        const routes = [
          { route: "parents", label: "Mở khu vực phụ huynh", words: ["phu huynh", "cha me", "ba me", "ho so", "tien do", "bao cao", "bieu do", "nhat ky", "thoi gian hoc", "ky nang cua con", "nhieu be", "profile"] },
          { route: "parent-news", label: "Xem bài viết cho phụ huynh", words: ["tin tuc", "bai viet", "cam nang", "nuoi day", "thuong hieu", "little hero la gi", "ve little hero"] },
          { route: "map", label: "Mở bản đồ ốc đảo", words: ["ban do", "oc dao", "island", "kham pha cac vung", "hanh trinh", "hero world"] },
          { route: "wardrobe", label: "Tùy chỉnh nhân vật Hero", words: ["nhan vat", "doi hero", "trang phuc", "tu do", "ca nhan hoa", "avatar", "doi mau ao"] },
          { route: "lessons", label: "Mở kho bài học", words: ["bai hoc", "khoa hoc", "hoc gi", "chu de ky nang", "ky nang song"] },
          { route: "stories", label: "Mở truyện tương tác", words: ["truyen", "doc truyen", "truyen tranh"] },
          { route: "games", label: "Mở trò chơi", words: ["tro choi", "mini game", "game"] },
          { route: "quiz", label: "Mở bài kiểm tra", words: ["kiem tra", "quiz", "bai test"] },
          { route: "quests", label: "Xem nhiệm vụ hằng ngày", words: ["nhiem vu", "thu thach hang ngay", "nhiem vu hang ngay"] },
          { route: "achievements", label: "Mở tường thành tích", words: ["thanh tich", "huy hieu", "sao thuong", "diem thuong"] },
          { route: "pricing", label: "Xem các gói dịch vụ", words: ["premium", "goi dich vu", "gia tien", "phi", "dang ky goi", "nang cap"] },
          { route: "payment", label: "Xem thông tin thanh toán", words: ["thanh toan", "mua hang", "don hang", "mua goi"] },
          { route: "auth", label: "Mở trang tài khoản", words: ["dang nhap", "dang ky", "tai khoan", "mat khau"] },
          { route: "reviews", label: "Gửi đánh giá hoặc góp ý", words: ["danh gia", "gop y", "phan hoi", "nhan xet"] },
          { route: "faq", label: "Mở hướng dẫn và hỗ trợ", words: ["tro giup", "ho tro", "lien he", "cau hoi", "quyen rieng tu", "bao loi"] },
          { route: "language", label: "Đổi ngôn ngữ", words: ["ngon ngu", "tieng anh", "english"] }
        ];
        const destination = routes.find((item) => item.words.some((word) => normalized.includes(word)));
        if (/(nguy hiem|bi danh|bi bat nat|bi lac|nguoi la|khong an toan|muon tu lam dau)/.test(normalized)) {
          return { text: "Nếu con hoặc ai đó đang gặp nguy hiểm ngay lúc này, hãy tìm người lớn đáng tin cậy ở gần và liên hệ dịch vụ khẩn cấp tại nơi con sống. Hero chỉ có thể chia sẻ hướng dẫn chung, không thay thế người hỗ trợ trực tiếp.", route: "parent-news", label: "Xem cẩm nang an toàn" };
        }
        if (destination?.route === "parents") {
          return { text: "Ba mẹ có thể quản lý hồ sơ từng bé, xem nhật ký thực hành, thời gian sử dụng, biểu đồ tiến độ và gợi ý hoạt động tại khu vực phụ huynh. Dữ liệu hiện được lưu trên thiết bị này.", ...destination };
        }
        if (destination?.route === "map") {
          return { text: "Bản đồ có 8 ốc đảo kỹ năng. Chọn một điểm dừng để mở tình huống và bắt đầu bài học.", ...destination };
        }
        if (destination?.route === "wardrobe") {
          return { text: "Trong tủ đồ, ba mẹ có thể chọn nhân vật, kiểu tóc, màu áo/quần/giày và phụ kiện. Hero cá nhân hóa cũng sẽ cập nhật trên trang chủ.", ...destination };
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
      };
      const renderTutorPage = () => {
        $("#routeView").innerHTML = pageShell("tutor", "Hỏi về tính năng và nội dung Little Hero, hoặc yêu cầu Hero mở trang liên quan.", `
          <section class="chat-shell" aria-label="Trò chuyện với trợ lý Little Hero">
            <header class="chat-top"><span class="chat-avatar" aria-hidden="true">✦</span><div><h2>Hỏi Hero</h2><p>Trợ lý AI · Gemini</p></div><span class="chat-status" id="assistantStatus">ĐANG KẾT NỐI</span></header>
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
              <textarea name="message" maxlength="500" aria-label="Nhập câu hỏi" placeholder="Hỏi về Little Hero hoặc bất kỳ chủ đề nào…"></textarea>
              <input id="assistantFileInput" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/mpeg,video/quicktime,video/mov,video/avi,video/x-msvideo,video/x-flv,video/mpg,video/webm,video/wmv,video/3gpp,application/pdf,text/plain,text/csv" multiple hidden>
              <button class="chat-attach-btn" id="assistantAttachButton" type="button" aria-label="Đính kèm ảnh, video hoặc tệp" title="Đính kèm ảnh, video hoặc tệp">📎</button>
              <button class="chat-voice-btn" id="assistantVoiceButton" type="button" aria-label="Hỏi Hero bằng giọng nói" aria-pressed="false" title="Bật micro, nói câu hỏi rồi nhấn lần nữa để gửi">🎙️</button>
              <button class="btn btn-mint" type="submit">Gửi ➤</button>
            </form>
            <div class="chat-attachments" id="assistantAttachments" aria-live="polite"></div>
          </section>
          <p class="parent-notice" style="max-width:900px;margin:12px auto 0">Hero có thể trả lời nhiều chủ đề, gợi ý mục phù hợp trên Little Hero, nhận câu hỏi bằng giọng nói và đọc câu trả lời. Để hỏi bằng giọng nói, nhấn micro, nói câu hỏi rồi nhấn lại để gửi. Có thể đính kèm tối đa 3 ảnh, video hoặc tài liệu (tối đa 10 MB mỗi tệp, 12 MB mỗi lượt). Tệp và câu hỏi được gửi tới Gemini qua backend; không gửi mật khẩu, địa chỉ hoặc thông tin riêng tư của trẻ.</p>`, "HỎI ĐÁP");
        const form = $("#assistantChatForm");
        const input = form.elements.message;
        const voiceButton = $("#assistantVoiceButton");
        const fileInput = $("#assistantFileInput");
        const attachButton = $("#assistantAttachButton");
        const attachmentsView = $("#assistantAttachments");
        const sendButton = form.querySelector('button[type="submit"]');
        const assistantStatus = $("#assistantStatus");
        let recognition = null;
        let voiceListening = false;
        let voiceRestartTimer = null;
        let voiceTranscript = "";
        let speakVoiceReply = false;
        let sending = false;
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
          const question = String(value || "").trim().slice(0, 500);
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
              body: JSON.stringify({
                messages: conversation.slice(-8),
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
            if (speakVoiceReply) speak(answer);
            form.reset();
            selectedFiles = [];
            updateAttachmentList();
            input.focus();
          } catch (error) {
            assistantReady = false;
            streamingMessage?.remove();
            conversation.pop();
            const detail = error instanceof TypeError
              ? "Không kết nối được backend. Hãy chạy máy chủ Little Hero và mở trang qua địa chỉ localhost."
              : error.message;
            assistantIdleStatus = "HỖ TRỢ CƠ BẢN";
            assistantStatus.textContent = assistantIdleStatus;
            const fallback = answerAssistantQuestion(question);
            const fallbackText = `AI trực tuyến chưa khả dụng (${detail}). Hero vẫn có thể hướng dẫn cơ bản: ${fallback.text}`;
            appendChatMessage(messages, "assistant", fallbackText, fallback.route === "faq" && fallback.label === "Xem hướng dẫn sử dụng" ? null : fallback);
            if (speakVoiceReply) speak(fallbackText);
            form.reset();
            input.focus();
          } finally {
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
        const startVoiceRecognition = () => {
          if (!voiceListening || !Recognition) return;
          recognition = new Recognition();
          const activeRecognition = recognition;
          activeRecognition.lang = "vi-VN";
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
          };
          activeRecognition.onerror = (event) => {
            if (event.error === "no-speech" || event.error === "aborted") return;
            voiceListening = false;
            if (event.error === "not-allowed" || event.error === "service-not-allowed") {
              toast("Micro chưa được cấp quyền. Hãy cho phép truy cập micro trong trình duyệt rồi thử lại.");
            } else if (event.error === "network") {
              toast("Dịch vụ nhận diện giọng nói không kết nối được. Kiểm tra Internet hoặc nhập câu hỏi bằng bàn phím.");
            } else {
              toast("Không nhận diện được giọng nói. Bạn có thể thử lại hoặc nhập câu hỏi.");
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
        voiceButton.addEventListener("click", () => {
          if (!Recognition) {
            toast("Trình duyệt chưa hỗ trợ nhận diện giọng nói. Hãy dùng Chrome hoặc Edge, hoặc nhập câu hỏi bằng bàn phím.");
            return;
          }
          if (voiceListening) {
            voiceListening = false;
            window.clearTimeout(voiceRestartTimer);
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
          storybook: () => renderStorybookPage(param),
          games: renderGamesPage,
          quests: renderQuestPage,
          quiz: renderQuizPage,
          achievements: renderAchievementsPage,
          reviews: renderReviewsPage,
          forum: renderForumPage,
          faq: renderFaqPage,
          wardrobe: renderWardrobePage,
          language: renderLanguagePage,
          auth: renderAuthPage,
          pricing: () => { $("#routeView").innerHTML = pageShell("pricing", "So sánh gói Free và Premium. Hệ thống chưa xác minh giao dịch ngân hàng tự động.", `
            <div class="pricing-grid">
              <article class="plan-card"><h3>🌱 Free</h3><p>Dành cho gia đình muốn bắt đầu.</p><div class="price">0đ <span>/ mãi mãi</span></div><ul class="features"><li>Bài học kỹ năng cơ bản</li><li>Truyện và hoạt cảnh tương tác</li><li>Tiến độ lưu trên thiết bị</li><li>Nhiệm vụ và sao thưởng</li></ul><button class="btn btn-light btn-small" data-route="lessons">Xem bài học</button></article>
              <article class="plan-card premium"><span class="popular">GÓI DỰ KIẾN</span><h3>♛ Đồng hành Premium</h3><p>Thông tin dự kiến theo đề án.</p><div class="price">99.000đ <span>/ tháng</span></div><ul class="features"><li>Thư viện hướng tới 80 bài học</li><li>Truyện và hoạt động bổ sung</li><li>Nhật ký học tập mở rộng</li></ul><button class="btn btn-primary btn-small" data-route="payment">Tiếp tục đến thông tin thanh toán →</button></article>
            </div>
            <div class="table-scroll"><table class="pricing-compare" aria-label="So sánh Free và Premium"><thead><tr><th>Tính năng</th><th>Free</th><th>Premium</th></tr></thead><tbody>
              <tr><td>Bài học và hoạt cảnh cơ bản</td><td>✓</td><td>✓</td></tr><tr><td>Truyện tương tác</td><td>✓</td><td>✓</td></tr><tr><td>Nhiệm vụ hằng ngày</td><td>✓</td><td>✓</td></tr><tr><td>Thư viện bài học mở rộng</td><td>—</td><td>✓ Theo gói</td></tr><tr><td>Nhật ký nâng cao</td><td>—</td><td>✓ Theo gói</td></tr><tr><td>Chi phí</td><td>Miễn phí</td><td>99.000đ/tháng</td></tr>
            </tbody></table></div>`, "GÓI HỌC"); },
          payment: renderPaymentPage,
          "premium-success": renderPremiumSuccessPage,
          arena: renderArenaPage,
          "arena-match": renderArenaMatchPage,
          tutor: renderTutorPage,
          parents: () => requestParentAccess(renderParentRoute),
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
        const favoriteLessons = [...lessonTotals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
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
                  <input name="age" type="number" min="2" max="18" required aria-label="Độ tuổi" value="${Number(child?.age) || 6}" placeholder="Tuổi">
                  <button class="btn btn-light btn-small">Cập nhật hồ sơ</button>
                </form>
                <form class="profile-add" id="profileAddForm">
                  <input name="name" maxlength="40" required aria-label="Tên hồ sơ mới" placeholder="Tên/biệt danh của bé mới">
                  <input name="age" type="number" min="2" max="18" required aria-label="Độ tuổi hồ sơ mới" placeholder="Tuổi">
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
              <div class="page-actions">${routeLink(`lesson/${lessons.find((lesson) => !state.completed.includes(lesson.id))?.id || lessons[0].id}`, "Mở bài học gợi ý", "▶")}${routeLink("parent-news", "Xem gợi ý trò chuyện", "💬")}</div>
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
          renderParentRoute();
        });
        $("#profileDetailsForm").addEventListener("submit", (event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const name = String(data.get("name") || "").trim().slice(0, 40);
          const age = Number(data.get("age"));
          if (!name || !Number.isInteger(age) || age < 2 || age > 18) { toast("Hãy nhập tên và độ tuổi từ 2 đến 18."); return; }
          child.name = name;
          child.age = age;
          state.childName = name;
          persist();
          renderParentRoute();
          toast("Đã cập nhật hồ sơ trên thiết bị này.");
        });
        $("#profileAddForm").addEventListener("submit", (event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const name = String(data.get("name") || "").trim().slice(0, 40);
          const age = Number(data.get("age"));
          if (!name || !Number.isInteger(age) || age < 2 || age > 18) { toast("Hãy nhập biệt danh và độ tuổi từ 2 đến 18."); return; }
          const defaults = freshState();
          const profile = { id: `child-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name, age };
          childProgressFields.forEach((key) => {
            const value = defaults[key];
            profile[key] = Array.isArray(value) ? [...value] : value && typeof value === "object" ? { ...value } : value;
          });
          profile.childName = name;
          state.children.push(profile);
          state.activeChildId = profile.id;
          childProgressFields.forEach((key) => { state[key] = profile[key]; });
          persist();
          renderParentRoute();
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
          const rounds = run.id === "pattern" ? patternRounds : feelingsRounds;
          const answer = Number(miniGameAnswer.dataset.miniGameAnswer);
          const round = rounds[run.round];
          if (!round || !Number.isInteger(answer) || answer < 0 || answer >= round.options.length) return;
          if (answer === round.answer) {
            run.selected = answer;
            run.correct += 1;
            run.feedback = "Chính xác! Bé quan sát thật tinh ý! ✨";
          } else {
            run.feedback = `${run.id === "pattern" ? round.hint : "Mỗi người có thể cảm thấy khác nhau. Hãy suy nghĩ thêm về tình huống nhé."} Bé thử lại nha!`;
          }
          renderGamesPage();
          return;
        }
        if (event.target.closest("[data-mini-game-next]") && miniGameRun && miniGameRun.id !== "memory" && miniGameRun.selected !== null) {
          const run = miniGameRun;
          const rounds = run.id === "pattern" ? patternRounds : feelingsRounds;
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
          if (routeLinkElement.dataset.newsFocus) pendingNewsFocus = routeLinkElement.dataset.newsFocus;
          setRoute(routeLinkElement.dataset.route);
          return;
        }
        const lessonButton = event.target.closest("[data-lesson]");
        if (lessonButton) {
          event.preventDefault();
          setRoute(`lesson/${lessonButton.dataset.lesson}`);
          return;
        }
        if (event.target.closest("[data-parent-close]")) { closeParentConfirmation(); return; }
        if (event.target.closest("[data-close]")) { closeDialog(); return; }
        const parentButton = event.target.closest("[data-parent]");
        if (parentButton) { event.preventDefault(); requestParentAccess(() => setRoute("parents")); }
        if (event.target.closest("[data-open-tutor]")) { event.preventDefault(); openTutor(); }
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
        const pageAnswer = event.target.closest("[data-quiz-page]");
        if (pageAnswer && quizPageChoice === null) {
          quizPageChoice = Number(pageAnswer.dataset.quizPage);
          state.quiz += 1;
          state.dailyQuiz += 1;
          if (quizPageChoice === quizPageLesson.correct) {
            state.xp += 5;
            state.rp += 25;
            speak(`Kết quả thành công! ${quizPageLesson.prompts[2]}`);
          } else {
            state.xp = Math.max(0, state.xp - 3);
            state.rp = Math.max(0, state.rp - 5);
            speak(`Kết quả chưa thành công. ${quizPageLesson.prompts[1]} Câu này đã khóa. Hãy chuyển sang câu tiếp theo.`);
          }
          persist();
          renderQuizPage();
          return;
        }
        if (event.target.closest("#nextQuiz")) {
          quizPageLesson = lessons[Math.floor(Math.random() * lessons.length)];
          quizPageChoice = null;
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
        if ($("#appDialog").dataset.parentConfirmation !== "true") return;
        event.preventDefault();
        closeParentConfirmation();
      });
      $("#continueBtn").addEventListener("click", () => {
        const lesson = lessons.find((item) => !state.completed.includes(item.id)) || lessons[0];
        setRoute(`lesson/${lesson.id}`);
      });
      $("#randomLessonBtn").addEventListener("click", () => {
        const available = lessons.filter((lesson) => !state.completed.includes(lesson.id));
        const pool = available.length ? available : lessons;
        const lesson = pool[Math.floor(Math.random() * pool.length)];
        renderFeatured(lesson);
        toast(`Hero gợi ý: ${lesson.title}`);
      });
      $("#upgradeBtn").addEventListener("click", () => setRoute("payment"));
      $("#premiumBtn").addEventListener("click", () => setRoute("payment"));
      $("#freePlanBtn").addEventListener("click", () => setRoute("map"));
      $("#accountBtn").addEventListener("click", () => setRoute("auth"));
      $("#soundBtn").addEventListener("click", openSound);
      $("#themeBtn").addEventListener("click", () => {
        state.darkMode = !state.darkMode;
        applyTheme();
        persist();
        toast(state.darkMode ? "Đã bật giao diện tối." : "Đã bật giao diện sáng.");
      });
      $("#heroMascot").addEventListener("click", () => {
        if (!("speechSynthesis" in window)) { toast("Trình duyệt chưa hỗ trợ giọng đọc tiếng Việt."); return; }
        const utterance = new SpeechSynthesisUtterance(`Xin chào ${state.childName || "bạn nhỏ"}! Cùng Hero khám phá thế giới hôm nay nhé!`);
        utterance.lang = "vi-VN";
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
      $("#fabToggle").addEventListener("click", () => {
        const actions = $("#floatingActions");
        const expanded = actions.classList.toggle("open");
        $("#fabToggle").setAttribute("aria-expanded", String(expanded));
        $("#fabToggle").setAttribute("aria-label", expanded ? "Thu gọn liên hệ và ủng hộ" : "Mở liên hệ và ủng hộ");
      });
      document.addEventListener("click", (event) => {
        const actions = $("#floatingActions");
        if (!actions.contains(event.target) || event.target.closest(".fab-link")) {
          actions.classList.remove("open");
          $("#fabToggle").setAttribute("aria-expanded", "false");
          $("#fabToggle").setAttribute("aria-label", "Mở liên hệ và ủng hộ");
        }
      });
      document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        $("#floatingActions").classList.remove("open");
        $("#fabToggle").setAttribute("aria-expanded", "false");
      });
      $("#arenaTabs").addEventListener("click", (event) => {
        const tab = event.target.closest("[data-mode]");
        if (!tab) return;
        arenaMode = tab.dataset.mode;
        $("#arenaTabs").querySelectorAll(".arena-tab").forEach((item) => {
          const active = item === tab;
          item.classList.toggle("active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        $("#leaderScope").textContent = `${tab.textContent} · tuần này`;
        renderLeaderboard(document, arenaMode);
      });
      $("#arenaStart").addEventListener("click", openQuiz);

      $("#dailyQuests").addEventListener("click", (event) => {
        if (event.target.closest("#claimQuests")) return;
        if (dailyProgress("lessons") < 3) { setRoute(`lesson/${lessons.find((lesson) => !state.completed.includes(lesson.id))?.id || lessons[0].id}`); return; }
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
      if (initialRoute !== "home") setRoute(initialRoute, { pop: true });
      else if (!location.hash.startsWith("#/") && state.lastRoute && state.lastRoute !== "home") setRoute(state.lastRoute, { pop: true, restore: true });
      else setRoute("home", { pop: true });
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
