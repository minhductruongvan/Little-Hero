/* Little Hero Character Animation Engine
 * Shared, data-driven action + emotion resolver for lesson scenes.
 * Usage: LittleHeroCharacterEngine.resolve({ answer, choiceIndex, question, lesson, correct, fallbackAction, fallbackEmotion })
 */
(() => {
  "use strict";

  const normalize = (value) => String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toLocaleLowerCase("vi")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  const ACTIONS = Object.freeze({
    run: "action-run", jump: "action-jump", wave: "action-wave",
    clap: "action-clap", sweep: "action-sweep", carry: "action-carry",
    give: "action-give", hug: "action-hug", dance: "action-dance",
    point: "action-point", fold: "action-fold", tidy: "action-tidy",
    read: "action-read", draw: "action-draw", drink: "action-drink",
    eat: "action-eat", brush: "action-brush-teeth",
    think: "action-pause", walk: "action-walk",
    sit: "action-sit", stay: "action-stay", pickup: "action-pickup",
    clean: "action-clean", wash: "action-wash", breathe: "action-breathe",
    listen: "action-listen", greet: "action-greet", handshake: "action-handshake",
    apologize: "action-apologize", assist: "action-assist", protect: "action-protect",
    report: "action-report", call: "action-call", search: "action-search",
    approach: "action-approach", hide: "action-hide", unsafe: "action-unsafe"
  });

  const ACTION_ALIASES = Object.freeze({
    "action-run": "action-run", "action-jump": "action-jump",
    "action-wave": "action-wave", "action-clap": "action-clap",
    "action-sweep": "action-sweep", "action-carry": "action-carry",
    "action-give": "action-give", "action-hug": "action-hug",
    "action-dance": "action-dance", "action-point": "action-point",
    "action-fold": "action-fold", "action-tidy": "action-tidy",
    "action-read": "action-read", "action-draw": "action-draw",
    "action-drink": "action-drink", "action-eat": "action-eat",
    "action-brush-teeth": "action-brush-teeth",
    "run": "action-run", "running": "action-run", "chay": "action-run",
    "jump": "action-jump", "nhay": "action-jump",
    "wave": "action-wave", "wave-hand": "action-wave", "vay-tay": "action-wave", "vay tay": "action-wave",
    "clap": "action-clap", "vo-tay": "action-clap", "vo tay": "action-clap",
    "sweep": "action-sweep", "quet": "action-sweep", "quet-nha": "action-sweep",
    "carry": "action-carry", "cam": "action-carry", "mang": "action-carry",
    "give": "action-give", "dua": "action-give", "trao": "action-give", "tang": "action-give",
    "hug": "action-hug", "om": "action-hug",
    "dance": "action-dance", "nhay-mua": "action-dance", "nhay mua": "action-dance",
    "point": "action-point", "chi-tay": "action-point", "chi tay": "action-point",
    "fold": "action-fold", "gap": "action-fold", "tidy": "action-tidy", "sap-xep": "action-tidy", "sap xep": "action-tidy",
    "read": "action-read", "doc-sach": "action-read", "doc sach": "action-read",
    "draw": "action-draw", "ve": "action-draw", "to-mau": "action-draw", "to mau": "action-draw",
    "drink": "action-drink", "uong": "action-drink",
    "eat": "action-eat", "an": "action-eat",
    "brush-teeth": "action-brush-teeth", "danh-rang": "action-brush-teeth", "danh rang": "action-brush-teeth",
    "think": "action-pause", "thinking": "action-pause",
    "walk": "action-walk", "pickup": "action-pickup", "pick-up": "action-pickup",
    "clean": "action-clean", "wash": "action-wash", "breathe": "action-breathe",
    "listen": "action-listen", "greet": "action-greet", "handshake": "action-handshake",
    "apologize": "action-apologize", "assist": "action-assist", "help": "action-assist",
    "protect": "action-protect", "report": "action-report", "call": "action-call",
    "search": "action-search", "approach": "action-approach", "hide": "action-hide",
    "unsafe": "action-unsafe", "sit": "action-sit", "stay": "action-stay", "encourage": "action-encourage", "guide": "action-guide", "warn": "action-warn"
  });

  const EMOTIONS = new Set(["happy", "calm", "sad", "angry", "concerned", "surprised", "excited", "shy"]);

  const OBJECTS = Object.freeze({
    broom: { icon: "🧹", label: "chổi" },
    book: { icon: "📚", label: "sách" },
    toy: { icon: "🧸", label: "đồ chơi" },
    ball: { icon: "⚽", label: "quả bóng" },
    cup: { icon: "🥛", label: "cốc" },
    bag: { icon: "🎒", label: "ba lô" },
    clothes: { icon: "👕", label: "quần áo" },
    trash: { icon: "🗑️", label: "rác" },
    soap: { icon: "🫧", label: "xà phòng" },
    flower: { icon: "🌷", label: "bông hoa" },
    gift: { icon: "🎁", label: "món quà" },
    heart: { icon: "💛", label: "trái tim" }
  });

  const pickMetadata = ({ answer, choiceIndex, question, lesson }) => {
    const answerKey = String(answer?.text ?? answer ?? "");
    const maps = [
      question?.animations,
      question?.answerAnimations,
      question?.answerActions,
      lesson?.answerAnimations,
      lesson?.answerActions
    ];
    for (const map of maps) {
      if (Array.isArray(map) && map[choiceIndex] != null) return map[choiceIndex];
      if (map && typeof map === "object") {
        if (map[choiceIndex] != null) return map[choiceIndex];
        if (map[answerKey] != null) return map[answerKey];
      }
    }
    if (answer && typeof answer === "object") return answer.animation || answer.action || answer;
    return {};
  };

  const inferAction = (text, lesson, correct, fallbackAction) => {
    const t = normalize(text);
    // Safety-sensitive and clearly harmful choices take precedence over positive verbs.
    if (/\b(giat|nem|het|quat|la mang|mang ban|do loi|ep ban|bat ban|lam dau|danh ban|cam may say|bo mu)\b/.test(t)) return "action-unsafe";
    if (/\b(gap quan ao|xep quan ao|gap ao|gap do|gap vo|vo tat)\b/.test(t)) return "action-fold";
    if (/\b(doc sach|doc truyen|xem sach)\b/.test(t)) return "action-read";
    if (/\b(ve tranh|to mau|ve hinh)\b/.test(t)) return "action-draw";
    if (/\b(uong nuoc|uong sua)\b/.test(t)) return "action-drink";
    if (/\b(danh rang|chai rang)\b/.test(t)) return "action-brush-teeth";
    if (/\b(an com|an bua|an banh)\b/.test(t)) return "action-eat";
    if (/\b(gap quan ao|xep quan ao|gap ao|gap do)\b/.test(t)) return "action-fold";
    if (/\b(sap xep|xep do choi|don do choi|cat do choi)\b/.test(t)) return "action-tidy";
    if (/\b(quet|cay choi|cam choi|choi nha|lau nha|don nha|quet nha|quet san)\b/.test(t)) return "action-sweep";
    if (/\b(nhay mua|nhay tung tang)\b/.test(t)) return "action-dance";
    if (/\b(nhay|bật nhay)\b/.test(t)) return "action-jump";
    if (/\b(vay tay|vay chao|chao tay)\b/.test(t)) return "action-wave";
    if (/\b(vo tay|vot tay|hoan ho|co vu)\b/.test(t)) return "action-clap";
    if (/\b(om|vong tay|an ui bang cai om)\b/.test(t)) return "action-hug";
    if (/\b(dua .* cho|dua .* ban|trao|tang ban|dua lai)\b/.test(t)) return "action-give";
    if (/\b(cam|mang|xach|be do|be len|be vat)\b/.test(t)) return "action-carry";
    if (/\b(chay|tu di|di ra|mot minh|tang toc)\b/.test(t)) return "action-run";
    if (/\b(giau|bi mat|khong noi|khong ke|gia vo khong thay)\b/.test(t)) return "action-hide";
    if (/\b(cho den khi|doi den khi|dung yen|dung lai|o lai)\b/.test(t)) return "action-stay";
    if (/\b(ngoi nghi|ngoi xuong|nghi mot chut)\b/.test(t)) return "action-sit";
    if (/\b(di bo|di den|buoc den|quay lai|bo di|di khoi|roi di|tranh xa)\b/.test(t)) return "action-walk";
    if (/\b(goi nguoi|keu nguoi lon|bao ngay)\b/.test(t)) return "action-call";
    if (/\b(nho me|nho bo|nho nguoi lon|bao nguoi lon|noi voi|noi ro|chia se|tam su|tra loi)\b/.test(t)) return "action-report";
    if (/\b(tim|kiem tra|quan sat)\b/.test(t)) return "action-search";
    if (/\b(rua tay|xa phong|cha hai|rua sach bot)\b/.test(t)) return "action-wash";
    if (/\b(nhat|bo rac|bo vo banh|gom|xep lai|xay lai)\b/.test(t)) return "action-pickup";
    if (/\b(lau|khan|tham nuoc|don sach|lau kho)\b/.test(t)) return "action-clean";
    if (/\b(xin loi|sua sai|khac phuc)\b/.test(t)) return "action-apologize";
    if (/\b(tho|binh tinh|tam dung|hit tho)\b/.test(t)) return "action-breathe";
    if (/\b(lang nghe|cho ban noi|hoi ban cam thay)\b/.test(t)) return "action-listen";
    if (/\b(bat tay)\b/.test(t)) return "action-handshake";
    if (/\b(chao|mim cuoi|gioi thieu|hoi ban|choi cung|moi ban)\b/.test(t)) return "action-greet";
    if (/\b(hop tac|giup|giup do|cung lam|chia nhau)\b/.test(t)) return "action-assist";
    if (/\b(khong di theo|giu khoang cach|tu choi|chan tai khoan|khong chia se)\b/.test(t)) return "action-protect";
    if (fallbackAction) return normalizeAction(fallbackAction);
    if (!correct) return "action-unsafe";

    const lessonGestures = {
      calm: "action-breathe", sorry: "action-apologize",
      stranger: "action-protect", "new-thing": "action-ride"
    };
    const categoryGestures = {
      emotion: "action-breathe", social: "action-greet",
      safety: "action-report", health: "action-wash",
      thinking: "action-report", care: "action-pickup",
      creative: "action-ride", community: "action-protect"
    };
    return lessonGestures[lesson?.id] || categoryGestures[lesson?.category] || "action-greet";
  };

  const normalizeAction = (value) => {
    const key = String(value || "").trim().toLowerCase().replace(/_/g, "-");
    return ACTION_ALIASES[key] || ACTION_ALIASES[normalize(key)] || (key.startsWith("action-") ? key : "action-greet");
  };

  const inferEmotion = (text, correct, action, explicit) => {
    const value = String(explicit || "").toLowerCase();
    if (EMOTIONS.has(value)) return value;
    const t = normalize(text);
    if (/\b(gian|tuc gian|het|quat|giat|nem|do loi)\b/.test(t)) return "angry";
    if (/\b(buon|khoc|tiec|that vong)\b/.test(t)) return "sad";
    if (/\b(lo lang|so hai|hoi hop|boi roi|chua san sang)\b/.test(t)) return "concerned";
    if (/\b(vui|mim cuoi|hao hung|tu tin|cam on|chuc mung|yeu thuong)\b/.test(t)) return "happy";
    if (["action-breathe", "action-listen", "action-protect", "action-report", "action-stay", "action-wash"].includes(action)) return correct ? "calm" : "concerned";
    return correct ? "happy" : "concerned";
  };

  const inferObject = (text, action) => {
    const t = normalize(text);
    if (/\b(cay choi|cam choi|quet nha|quet san|quet)\b/.test(t) || action === "action-sweep") return OBJECTS.broom;
    if (/\b(quan ao|ao|gap ao|gap vo|vo tat)\b/.test(t) || action === "action-fold") return OBJECTS.clothes;
    if (/\b(sach|truyen)\b/.test(t) || action === "action-read") return OBJECTS.book;
    if (/\b(do choi|gau bong)\b/.test(t)) return OBJECTS.toy;
    if (/\b(bong)\b/.test(t)) return OBJECTS.ball;
    if (/\b(ba lo|cap sach)\b/.test(t)) return OBJECTS.bag;
    if (/\b(uong nuoc|uong sua)\b/.test(t) || action === "action-drink") return OBJECTS.cup;
    if (/\b(rua tay|xa phong)\b/.test(t) || action === "action-wash") return OBJECTS.soap;
    if (/\b(rac|vo banh|thung rac)\b/.test(t) || action === "action-pickup") return OBJECTS.trash;
    return null;
  };

  const showObject = (actor, recipient, plan) => {
    if (!actor || !plan?.objectIcon || !["action-carry", "action-give", "action-fold", "action-tidy"].includes(plan.action)) return null;
    actor.querySelectorAll(":scope > .character-held-object").forEach((node) => node.remove());
    const held = document.createElement("span");
    held.className = "character-held-object";
    held.textContent = plan.objectIcon;
    held.setAttribute("aria-hidden", "true");
    held.dataset.heldAction = plan.action;
    actor.appendChild(held);

    if (plan.action === "action-give" && recipient) {
      const a = actor.getBoundingClientRect();
      const b = recipient.getBoundingClientRect();
      const dx = b.left + b.width / 2 - (a.left + a.width / 2);
      const dy = b.top + b.height * 0.42 - (a.top + a.height * 0.48);
      if (held.animate) {
        const animation = held.animate([
          { transform: "translate(0,0) scale(1)", opacity: 1 },
          { transform: `translate(${dx}px,${dy}px) scale(.82)`, opacity: .25 }
        ], { duration: plan.duration || 1050, easing: "cubic-bezier(.2,.7,.25,1)", fill: "forwards" });
        animation.finished.catch(() => {}).finally(() => held.remove());
      } else {
        window.setTimeout(() => held.remove(), 1200);
      }
    } else {
      window.setTimeout(() => held.remove(), plan.duration || 2100);
    }
    return held;
  };

  const resolve = (input = {}) => {
    const answer = input.answer;
    const text = String(answer?.text ?? answer ?? "");
    const pickedMeta = pickMetadata(input);
    const meta = typeof pickedMeta === "string" ? { action: pickedMeta } : (pickedMeta || {});
    const explicitAction = meta.action || meta.gesture || meta.animation || (typeof answer === "object" ? answer.action : "");
    const action = explicitAction ? normalizeAction(explicitAction) : inferAction(text, input.lesson, Boolean(input.correct), input.fallbackAction);
    const emotion = inferEmotion(text, Boolean(input.correct), action, meta.emotion || meta.mood || answer?.emotion || input.fallbackEmotion);
    const objectKey = meta.object || meta.prop || "";
    const object = typeof objectKey === "string" ? (OBJECTS[objectKey] || inferObject(text, action)) : (objectKey || inferObject(text, action));
    const partnerAction = meta.partnerAction ? normalizeAction(meta.partnerAction) : "";
    return Object.freeze({
      action,
      emotion,
      partnerAction,
      object: object || null,
      objectIcon: meta.objectIcon || object?.icon || "",
      target: meta.target || "",
      duration: Number.isFinite(Number(meta.duration)) ? Math.max(300, Math.min(8000, Number(meta.duration))) : null,
      correct: Boolean(input.correct)
    });
  };

  const clearActorState = (actor) => {
    if (!actor) return;
    [...actor.classList].forEach((name) => {
      if (name.startsWith("action-") || name.startsWith("mood-")) actor.classList.remove(name);
    });
  };

  const activeAnimations = new WeakMap();
  const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const cancelActorAnimations = (actor) => {
    activeAnimations.get(actor)?.forEach((animation) => animation.cancel());
    activeAnimations.delete(actor);
    delete actor.dataset.jointAnimation;
  };

  const animateRig = (actor, action) => {
    const svg = actor.querySelector(".lesson-character-svg");
    if (!svg) return;
    if (reducedMotion()) {
      actor.dataset.jointAnimation = "true";
      return;
    }
    if (typeof svg.animate !== "function") return;

    const parts = {
      movement: svg.querySelector(".lesson-movement"),
      upper: svg.querySelector(".lesson-upper"),
      torso: svg.querySelector(".lesson-torso"),
      head: svg.querySelector(".lesson-head"),
      leftArm: svg.querySelector(".lesson-arm-left"),
      rightArm: svg.querySelector(".lesson-arm-right"),
      leftForearm: svg.querySelector(".lesson-forearm-left"),
      rightForearm: svg.querySelector(".lesson-forearm-right"),
      leftLeg: svg.querySelector(".lesson-leg-left"),
      rightLeg: svg.querySelector(".lesson-leg-right"),
      leftKnee: svg.querySelector(".lesson-knee-left"),
      rightKnee: svg.querySelector(".lesson-knee-right")
    };
    const animations = [];
    activeAnimations.set(actor, animations);
    actor.dataset.jointAnimation = "true";

    const play = (element, frames, options = {}) => {
      if (!element || typeof element.animate !== "function") return;
      const animation = element.animate(frames, {
        duration: options.duration || 650,
        delay: options.delay || 0,
        easing: options.easing || "ease-in-out",
        iterations: options.iterations || 1,
        fill: "forwards"
      });
      animations.push(animation);
      animation.finished.catch((error) => {
        if (error?.name !== "AbortError") console.warn("[Little Hero] Joint animation error:", error);
      });
    };
    const joint = (element, degrees, duration = 550, delay = 0) => {
      if (!element) return;
      element.style.transformBox = "view-box";
      element.style.transformOrigin = ({
        "lesson-arm-left": "36.9% 44.4%",
        "lesson-arm-right": "63.1% 44.4%",
        "lesson-forearm-left": "27.5% 54%",
        "lesson-forearm-right": "72.5% 54%",
        "lesson-leg-left": "41.25% 64%",
        "lesson-leg-right": "58.75% 64%",
        "lesson-knee-left": "39.4% 78%",
        "lesson-knee-right": "60.6% 78%",
        "lesson-head": "50% 40.4%",
        "lesson-upper": "50% 66%",
        "lesson-torso": "50% 68.4%"
      })[[...element.classList].find((className) => className.startsWith("lesson-"))] || "center";
      play(element, [{ transform: "rotate(0deg)" }, { transform: `rotate(${degrees}deg)` }], { duration, delay });
    };
    const bob = (height = -5, duration = 600, iterations = 1) => {
      play(parts.movement, [
        { transform: "translateY(0)" },
        { transform: `translateY(${height}px)` },
        { transform: "translateY(0)" }
      ], { duration, iterations });
    };
    const swing = (element, from, to, duration = 420, iterations = 3) => {
      play(element, [{ transform: `rotate(${from}deg)` }, { transform: `rotate(${to}deg)` }], {
        duration, iterations, easing: "ease-in-out"
      });
    };

    const normalizedAction = String(action || "").replace(/^action-/, "");
    switch (normalizedAction) {
      case "wave":
      case "greet":
      case "report":
      case "call":
      case "guide":
        joint(parts.rightArm, -112);
        swing(parts.rightForearm, -28, -58, 380, 3);
        break;
      case "handshake":
        joint(parts.rightArm, -58);
        joint(parts.rightForearm, -22);
        break;
      case "handshake-partner":
        joint(parts.leftArm, 58);
        joint(parts.leftForearm, 22);
        break;
      case "jump":
        bob(-22, 760, 2);
        joint(parts.leftArm, 100);
        joint(parts.rightArm, -100);
        joint(parts.leftLeg, -18);
        joint(parts.rightLeg, 18);
        break;
      case "run":
      case "ride":
        swing(parts.leftArm, -35, 38, 250, 7);
        swing(parts.rightArm, 38, -35, 250, 7);
        swing(parts.leftLeg, -28, 28, 250, 7);
        swing(parts.rightLeg, 28, -28, 250, 7);
        bob(-6, 250, 7);
        break;
      case "walk":
      case "approach":
        swing(parts.leftArm, -16, 16, 420, 4);
        swing(parts.rightArm, 16, -16, 420, 4);
        swing(parts.leftLeg, -14, 14, 420, 4);
        swing(parts.rightLeg, 14, -14, 420, 4);
        break;
      case "clap":
        joint(parts.leftArm, -48);
        joint(parts.rightArm, 48);
        swing(parts.leftForearm, 18, 4, 300, 3);
        swing(parts.rightForearm, -18, -4, 300, 3);
        bob(-4, 520, 2);
        break;
      case "dance":
        swing(parts.leftArm, -40, 35, 380, 5);
        swing(parts.rightArm, 40, -35, 380, 5);
        play(parts.movement, [
          { transform: "rotate(-4deg) translateY(0)" },
          { transform: "rotate(4deg) translateY(-7px)" }
        ], { duration: 380, iterations: 5 });
        break;
      case "wash":
        joint(parts.leftArm, -42);
        joint(parts.rightArm, 42);
        swing(parts.leftForearm, -30, 12, 340, 5);
        swing(parts.rightForearm, 30, -12, 340, 5);
        break;
      case "pickup":
      case "clean":
      case "sweep":
      case "fold":
      case "tidy":
        joint(parts.upper, 7);
        joint(parts.leftArm, 24);
        joint(parts.rightArm, -30);
        swing(parts.rightForearm, -18, 18, 420, 3);
        bob(5, 720, 1);
        break;
      case "give":
      case "carry":
      case "assist":
      case "encourage":
      case "reassure":
        joint(parts.leftArm, -22);
        joint(parts.rightArm, -34);
        joint(parts.leftForearm, -14);
        joint(parts.rightForearm, -20);
        break;
      case "hug":
        joint(parts.leftArm, -52);
        joint(parts.rightArm, 52);
        joint(parts.leftForearm, 18);
        joint(parts.rightForearm, -18);
        bob(-3, 650, 1);
        break;
      case "read":
      case "draw":
        joint(parts.leftArm, -25);
        joint(parts.rightArm, -30);
        swing(parts.rightForearm, -12, 12, 500, 3);
        break;
      case "drink":
      case "eat":
      case "brush-teeth":
        joint(parts.rightArm, -48);
        joint(parts.rightForearm, -30);
        swing(parts.rightForearm, -22, -38, 360, 4);
        break;
      case "apologize":
      case "forgive":
        joint(parts.upper, 5);
        joint(parts.head, 10);
        joint(parts.leftArm, 10);
        joint(parts.rightArm, -10);
        bob(3, 650, 1);
        break;
      case "breathe":
      case "mirror-breathe":
      case "stay":
        play(parts.torso, [
          { transform: "scale(1,1)" },
          { transform: "scale(1.025,1.035)" },
          { transform: "scale(1,1)" }
        ], { duration: 1800 });
        joint(parts.leftArm, 8);
        joint(parts.rightArm, -8);
        break;
      case "listen":
      case "search":
      case "pause":
        joint(parts.head, -9);
        joint(parts.leftArm, 10);
        bob(-2, 650, 1);
        break;
      case "protect":
      case "warn":
      case "unsafe":
      case "step-back":
        joint(parts.leftArm, 78);
        joint(parts.rightArm, -78);
        joint(parts.head, -7);
        bob(-4, 500, 1);
        break;
      case "sit":
      case "hide":
        joint(parts.leftLeg, -20);
        joint(parts.rightLeg, 20);
        joint(parts.upper, 5);
        bob(5, 600, 1);
        break;
      default:
        joint(parts.rightArm, -46);
        swing(parts.rightForearm, -22, -52, 420, 2);
        break;
    }

    if (!["jump", "run", "ride", "walk", "approach", "dance"].includes(normalizedAction)) {
      if (actor.classList.contains("mood-sad")) joint(parts.head, 7);
      else if (actor.classList.contains("mood-concerned") || actor.classList.contains("mood-shy")) joint(parts.head, -6);
      else if (actor.classList.contains("mood-excited")) bob(-6, 500, 2);
    }
  };

  const play = (actor, plan, expressionSetter) => {
    if (!actor || !plan) return;
    cancelActorAnimations(actor);
    clearActorState(actor);
    void actor.offsetWidth;
    actor.classList.add(plan.action, `mood-${plan.emotion}`);
    if (typeof expressionSetter === "function") expressionSetter(actor, plan.emotion);
    if (plan.duration && actor.animate) {
      actor.style.setProperty("--character-action-duration", `${plan.duration}ms`);
    }
    animateRig(actor, plan.action);
    return plan;
  };

  window.LittleHeroCharacterEngine = Object.freeze({
    version: "1.0.0",
    actions: ACTIONS,
    objects: OBJECTS,
    normalize,
    resolve,
    play,
    showObject,
    clearActorState
  });
})();
