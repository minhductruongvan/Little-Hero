(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sparkleContainer = document.querySelector("#heroSparkle");

  const sparkleLayer = (index, x, y, size, offset) => ({
    ddd: 0,
    ind: index,
    ty: 4,
    nm: `Sparkle ${index}`,
    sr: 1,
    ks: {
      o: {
        a: 1,
        k: [
          { t: offset, s: [0], e: [100], o: { x: 0.333, y: 0 }, i: { x: 0.667, y: 1 } },
          { t: offset + 10, s: [100], e: [0], o: { x: 0.333, y: 0 }, i: { x: 0.667, y: 1 } },
          { t: offset + 20, s: [0] }
        ]
      },
      r: { a: 1, k: [{ t: 0, s: [-20], e: [20] }, { t: 30, s: [20], e: [-20] }, { t: 60, s: [-20] }] },
      p: { a: 0, k: [x, y, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          { t: offset, s: [25, 25, 100], e: [100, 100, 100], o: { x: 0.333, y: 0 }, i: { x: 0.667, y: 1 } },
          { t: offset + 10, s: [100, 100, 100], e: [25, 25, 100], o: { x: 0.333, y: 0 }, i: { x: 0.667, y: 1 } },
          { t: offset + 20, s: [25, 25, 100] }
        ]
      }
    },
    ao: 0,
    shapes: [{
      ty: "gr",
      nm: "Four-point star",
      it: [
        { ty: "sr", p: { a: 0, k: [0, 0] }, r: { a: 0, k: 0 }, pt: { a: 0, k: 4 }, or: { a: 0, k: size }, os: { a: 0, k: 0 }, ir: { a: 0, k: size * 0.23 }, is: { a: 0, k: 0 }, sy: 1, d: 1 },
        { ty: "fl", c: { a: 0, k: [1, 0.73, 0.28, 1] }, o: { a: 0, k: 100 }, r: 1 },
        { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } }
      ]
    }],
    ip: 0,
    op: 60,
    st: 0,
    bm: 0
  });

  const initializeSparkles = () => {
    if (reducedMotion || !window.lottie || !sparkleContainer || sparkleContainer.childElementCount) return;
    const sparkleAnimation = window.lottie.loadAnimation({
      container: sparkleContainer,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: {
        v: "5.7.4",
        fr: 30,
        ip: 0,
        op: 60,
        w: 240,
        h: 240,
        nm: "Little Hero sparkles",
        ddd: 0,
        assets: [],
        layers: [
          sparkleLayer(1, 48, 86, 13, 0),
          sparkleLayer(2, 190, 55, 9, 12),
          sparkleLayer(3, 188, 184, 12, 24)
        ]
      }
    });
    sparkleAnimation.addEventListener("data_failed", () => {
      console.warn("Không thể tải hoạt ảnh Lottie trang trí của Little Hero.");
    });
  };

  let currentPage = "home";
  let routeRequested = false;
  const enterHome = () => {
    currentPage = "home";
    routeRequested = true;
    const gsap = window.gsap;
    if (!gsap || reducedMotion) return;

    gsap.fromTo(
      ".hero-copy > *",
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power2.out", clearProps: "transform,opacity,visibility" }
    );
    gsap.fromTo(
      "#heroMascot",
      { autoAlpha: 0, scale: 0.94, y: 12 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.7, delay: 0.12, ease: "back.out(1.4)", clearProps: "transform,opacity,visibility" }
    );
  };

  const enterRoute = () => {
    currentPage = "route";
    routeRequested = true;
    const gsap = window.gsap;
    if (!gsap || reducedMotion) return;

    const routeView = document.querySelector("#routeView");
    const heading = routeView?.querySelector(".page-heading");
    const sections = routeView?.querySelectorAll(
      ".lesson-catalog, .storybook-grid, .journey-map, .game-grid, .achievement-grid, .forum-grid, .faq-grid, .reviews-grid, .pricing-grid, .parent-dashboard, .wardrobe-grid, .auth-layout, .mini-game-board, .scene-card, .storybook-book, .leaderboard-panel, .tutor-panel"
    );
    const cards = routeView?.querySelectorAll(
      ".catalog-card, .story-route-card, .storybook-card, .plan-card, .game-card, .mini-game-card, .achievement-card, .forum-card, .faq-card, .review-form, .settings-card, .empty-card, .scene-card, .quest-card, .challenge-card, .parent-card, .article-card"
    );

    if (heading) {
      animateElements([heading], { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" });
    }
    if (sections?.length) animateElements(sections, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.045, delay: 0.04, ease: "power2.out" });
    if (cards?.length) animateElements(cards, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.055, delay: 0.08, ease: "power2.out" });
  };

  const animateElements = (elements, from, to) => {
    const gsap = window.gsap;
    if (!gsap || reducedMotion) return;
    const pending = [...elements].filter((element) => element.dataset.motionEntered !== "true");
    if (!pending.length) return;
    pending.forEach((element) => { element.dataset.motionEntered = "true"; });
    gsap.fromTo(pending, from, { ...to, clearProps: "transform,opacity,visibility" });
  };

  const routeView = document.querySelector("#routeView");
  if (routeView && window.MutationObserver) {
    const routeContentSelector = [
      ".page-heading",
      ".lesson-catalog",
      ".storybook-grid",
      ".journey-map",
      ".game-grid",
      ".achievement-grid",
      ".forum-grid",
      ".faq-grid",
      ".reviews-grid",
      ".pricing-grid",
      ".parent-dashboard",
      ".wardrobe-grid",
      ".auth-layout",
      ".mini-game-board",
      ".scene-card",
      ".storybook-book",
      ".leaderboard-panel",
      ".tutor-panel",
      ".catalog-card",
      ".storybook-card",
      ".plan-card",
      ".game-card",
      ".mini-game-card",
      ".achievement-card",
      ".forum-card",
      ".faq-card",
      ".review-form",
      ".settings-card",
      ".empty-card",
      ".quest-card",
      ".challenge-card",
      ".parent-card",
      ".article-card"
    ].join(",");
    const observer = new MutationObserver((mutations) => {
      if (currentPage !== "route" || !window.gsap || reducedMotion) return;
      const addedElements = mutations.flatMap((mutation) => [...mutation.addedNodes])
        .filter((node) => node.nodeType === Node.ELEMENT_NODE)
        .flatMap((node) => [
          ...(node.matches(routeContentSelector) ? [node] : []),
          ...node.querySelectorAll(routeContentSelector)
        ]);
      if (addedElements.length) {
        animateElements(addedElements, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.045, ease: "power2.out" });
      }
    });
    observer.observe(routeView, { childList: true, subtree: true });
  }

  if (!reducedMotion && window.IntersectionObserver) {
    const revealTargets = document.querySelectorAll(
      ".brand-value, .skills-reason, .learning-step, .home-info-card, .home-final-cta"
    );
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (window.gsap) {
          window.gsap.fromTo(
            entry.target,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", clearProps: "transform,opacity,visibility" }
          );
        }
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16 });
    revealTargets.forEach((target) => observer.observe(target));
  }

  window.LittleHeroMotion = { enterHome, enterRoute };
  initializeSparkles();
  document.querySelector('[data-motion-library="lottie"]')?.addEventListener("load", initializeSparkles);
  document.querySelector('[data-motion-library="gsap"]')?.addEventListener("load", () => {
    if (!routeRequested) return;
    if (currentPage === "home") enterHome();
    else enterRoute();
  });
})();
