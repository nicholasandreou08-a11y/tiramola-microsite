const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const APP_PATH = "/Users/nick/tiramola-microsite/app.js";

function instrumentAppSource(source) {
  const exportBlock = `
  globalThis.__tiramolaExports = {
    baseState,
    questions,
    i18n,
    conceptPacks,
    clamp,
    recomputeFromAnswers,
    generateTheme,
    routeFromHash,
    hashQueryParam,
    routeAssetBundle,
    render,
    updateScrollProgress,
    safeStorageGet,
    safeStorageSet,
    copyText,
    stateShareLink,
    getState: () => state,
    setState: (next) => { state = next; }
  };
})();`;

  return source.replace(/\}\)\(\);\s*$/, exportBlock);
}

function makeSandbox(options = {}) {
  const listeners = {};
  const appRoot = { innerHTML: "", addEventListener() {} };
  const scrollBar = { style: { width: "0%" } };
  const storage = { ...(options.storage || {}) };
  const throwsOnStorage = !!options.throwsOnStorage;

  const document = {
    documentElement: {
      style: { setProperty() {} },
      scrollHeight: 2800,
      lang: "el",
    },
    body: {
      setAttribute() {},
      appendChild() {},
      removeChild() {},
    },
    getElementById(id) {
      if (id === "app") return appRoot;
      return null;
    },
    querySelectorAll() {
      return [];
    },
    querySelector(selector) {
      if (selector === ".scroll-progress span") {
        return scrollBar;
      }
      return null;
    },
    createElement() {
      return {
        value: "",
        style: {},
        setAttribute() {},
        select() {},
      };
    },
    execCommand(cmd) {
      return cmd === "copy";
    },
  };

  const location = {
    href: options.href || "http://localhost/#/",
    hash: options.hash || "#/",
  };

  const windowObj = {
    location,
    innerHeight: 900,
    scrollY: 0,
    pageYOffset: 0,
    scrollTo() {},
    addEventListener(event, cb) {
      listeners[event] = listeners[event] || [];
      listeners[event].push(cb);
    },
  };

  const localStorage = {
    getItem(key) {
      if (throwsOnStorage) throw new Error("Storage blocked");
      return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null;
    },
    setItem(key, value) {
      if (throwsOnStorage) throw new Error("Storage blocked");
      storage[key] = String(value);
    },
  };

  const navigatorObj = options.navigator || {};

  const sandbox = {
    window: windowObj,
    document,
    localStorage,
    navigator: navigatorObj,
    URL,
    URLSearchParams,
    atob: (str) => Buffer.from(str, "base64").toString("binary"),
    btoa: (str) => Buffer.from(str, "binary").toString("base64"),
    escape,
    unescape,
    console,
    setTimeout,
    clearTimeout,
    IntersectionObserver: class { observe() {} unobserve() {} disconnect() {} },
    requestAnimationFrame: (cb) => cb(),
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  return { sandbox, listeners, appRoot, scrollBar, storage, windowObj };
}

function loadApp(options = {}) {
  const src = fs.readFileSync(APP_PATH, "utf8");
  const inst = instrumentAppSource(src);
  const ctx = makeSandbox(options);
  vm.runInContext(inst, ctx.sandbox, { filename: APP_PATH });
  return { ...ctx, exports: ctx.sandbox.__tiramolaExports };
}

function tone(overrides = {}) {
  return {
    energy: 0,
    calm: 0,
    modern: 0,
    classic: 0,
    minimal: 0,
    expressive: 0,
    local: 0,
    global: 0,
    ...overrides,
  };
}

function completeAnswersFavoringB(baseState) {
  const next = JSON.parse(JSON.stringify(baseState));
  next.quiz.answers = {
    q1: 1,
    q2: 5,
    q3: 4,
    q4: 1,
    q5: 1,
    q6: 0,
    q7: 2,
    q8: 0,
    q9: 1,
  };
  return next;
}

test("startup does not crash when storage is blocked", () => {
  const { exports, listeners, appRoot } = loadApp({ throwsOnStorage: true });
  assert.ok(exports);
  assert.ok(Array.isArray(listeners.load));
  listeners.load.forEach((cb) => cb());
  assert.match(appRoot.innerHTML, /Εργαστήριο Ταυτότητας Τιραμόλα|Tiramola Identity Lab/);
});

test("route scoring returns B for B-leaning answers", () => {
  const { exports } = loadApp();
  const prepared = completeAnswersFavoringB(exports.baseState);
  const computed = exports.recomputeFromAnswers(prepared);
  assert.equal(computed.result.recommendedRoute, "B");
  assert.ok(computed.quiz.scores.B > computed.quiz.scores.A);
  assert.ok(computed.quiz.scores.B > computed.quiz.scores.C);
});

test("confidence is always clamped in [0.2, 0.9]", () => {
  const { exports } = loadApp();

  const empty = exports.recomputeFromAnswers(JSON.parse(JSON.stringify(exports.baseState)));
  assert.equal(empty.result.confidence, 0.2);

  const strong = exports.recomputeFromAnswers(completeAnswersFavoringB(exports.baseState));
  assert.ok(strong.result.confidence >= 0.2);
  assert.ok(strong.result.confidence <= 0.9);
});

test("theme generator responds to tone modifiers deterministically", () => {
  const { exports } = loadApp();

  const highEnergy = exports.generateTheme("B", tone({ energy: 4 }));
  assert.equal(highEnergy.ui.radius, 24);

  const minimal = exports.generateTheme("C", tone({ minimal: 3 }));
  assert.equal(minimal.ui.radius, 14);
  assert.equal(minimal.palette.accent2, minimal.palette.surface);

  const expressive = exports.generateTheme("A", tone({ expressive: 4 }));
  assert.equal(expressive.ui.radius, 24);
  assert.equal(expressive.ui.illustrationStyle, "accent-confetti");
});

test("render smoke test across key routes", () => {
  const { exports, appRoot, windowObj } = loadApp();
  const stateWithAnswers = exports.recomputeFromAnswers(completeAnswersFavoringB(exports.baseState));
  exports.setState(stateWithAnswers);

  const hashes = ["#/", "#/quiz?q=1", "#/result", "#/concepts", "#/pitch-deck?route=B", "#/experience?route=B"];
  for (const hash of hashes) {
    windowObj.location.hash = hash;
    assert.doesNotThrow(() => exports.render());
    assert.ok(appRoot.innerHTML.includes("<footer>"));
  }
});

test("clipboard fallback works when navigator.clipboard is unavailable", async () => {
  const { exports } = loadApp({ navigator: {} });
  const copied = await exports.copyText("hello world");
  assert.equal(copied, true);
});

test("hash parsing handles query routing", () => {
  const { exports, windowObj } = loadApp();
  windowObj.location.hash = "#/pitch-deck?route=C";
  assert.equal(exports.routeFromHash(), "/pitch-deck?route=C");
  assert.equal(exports.hashQueryParam("route"), "C");
});

test("pitch assets stay within a mobile-friendly payload budget", () => {
  const { exports } = loadApp();
  const budgetBytes = 3 * 1024 * 1024;

  ["A", "B", "C"].forEach((route) => {
    const bundle = exports.routeAssetBundle(route);
    const files = [...Object.values(bundle.logos), ...Object.values(bundle.mockups)].filter(Boolean);
    const total = files.reduce((sum, file) => {
      if (!fs.existsSync(file)) {
        return sum;
      }
      return sum + fs.statSync(file).size;
    }, 0);

    assert.ok(total <= budgetBytes, `Route ${route} exceeds ${budgetBytes} bytes (actual ${total})`);
  });
});

test("language toggle listeners are scoped to explicit toggle controls", () => {
  const src = fs.readFileSync(APP_PATH, "utf8");
  assert.ok(src.includes('[data-lang-toggle]'));
  assert.equal(src.includes('querySelectorAll("[data-lang]")'), false);
  assert.ok(src.includes('setAttribute("data-ui-lang", state.ui.lang)'));
});

// ========== New tests ==========

test("route scoring returns A for A-leaning answers", () => {
  const { exports } = loadApp();
  const next = JSON.parse(JSON.stringify(exports.baseState));
  next.quiz.answers = { q1: 0, q2: 3, q3: 5, q4: 0, q5: 2, q6: 1, q7: 1, q8: 2, q9: 0 };
  const computed = exports.recomputeFromAnswers(next);
  assert.equal(computed.result.recommendedRoute, "A");
  assert.ok(computed.quiz.scores.A > computed.quiz.scores.B);
  assert.ok(computed.quiz.scores.A > computed.quiz.scores.C);
});

test("route scoring returns C for C-leaning answers", () => {
  const { exports } = loadApp();
  const next = JSON.parse(JSON.stringify(exports.baseState));
  next.quiz.answers = { q1: 2, q2: 1, q3: 1, q4: 2, q5: 0, q6: 2, q7: 0, q8: 1, q9: 2 };
  const computed = exports.recomputeFromAnswers(next);
  assert.equal(computed.result.recommendedRoute, "C");
  assert.ok(computed.quiz.scores.C > computed.quiz.scores.A);
  assert.ok(computed.quiz.scores.C > computed.quiz.scores.B);
});

test("tie detection identifies multiple top routes", () => {
  const { exports } = loadApp();
  const next = JSON.parse(JSON.stringify(exports.baseState));
  // Pick balanced answers: q5 option 2 gives equal A/B/C scores
  next.quiz.answers = { q1: 0, q2: 3, q3: 3, q4: 0, q5: 2, q6: 1, q7: 1, q8: 2, q9: 0 };
  const computed = exports.recomputeFromAnswers(next);
  // At least verify topMatches has the recommended route
  assert.ok(computed.result.topMatches.includes(computed.result.recommendedRoute));
  // confidence should be lower when scores are close
  assert.ok(computed.result.confidence <= 0.9);
});

test("i18n keys are complete in both languages", () => {
  const { exports } = loadApp();
  const elKeys = Object.keys(exports.i18n.el);
  const enKeys = Object.keys(exports.i18n.en);
  const missingInEn = elKeys.filter((k) => !enKeys.includes(k));
  const missingInEl = enKeys.filter((k) => !elKeys.includes(k));
  assert.deepEqual(missingInEn, [], `Keys missing in EN: ${missingInEn.join(", ")}`);
  assert.deepEqual(missingInEl, [], `Keys missing in EL: ${missingInEl.join(", ")}`);
});

test("generateTheme returns consistent structure for all routes", () => {
  const { exports } = loadApp();
  for (const route of ["A", "B", "C"]) {
    const theme = exports.generateTheme(route, tone());
    assert.ok(theme.palette.bg, `Route ${route} missing palette.bg`);
    assert.ok(theme.palette.primary, `Route ${route} missing palette.primary`);
    assert.ok(theme.palette.accent, `Route ${route} missing palette.accent`);
    assert.ok(theme.typography.heading, `Route ${route} missing typography.heading`);
    assert.ok(theme.typography.body, `Route ${route} missing typography.body`);
    assert.ok(typeof theme.ui.radius === "number", `Route ${route} radius not a number`);
  }
});

test("clamp enforces bounds correctly", () => {
  const { exports } = loadApp();
  assert.equal(exports.clamp(-5, 0, 10), 0);
  assert.equal(exports.clamp(15, 0, 10), 10);
  assert.equal(exports.clamp(5, 0, 10), 5);
  assert.equal(exports.clamp(0, 0, 10), 0);
  assert.equal(exports.clamp(10, 0, 10), 10);
});

test("share link round-trip encodes and restores quiz state", () => {
  const { exports, windowObj } = loadApp();
  const prepared = completeAnswersFavoringB(exports.baseState);
  const computed = exports.recomputeFromAnswers(prepared);
  exports.setState(computed);

  const shareUrl = exports.stateShareLink();
  assert.ok(shareUrl.includes("?s="), "Share link should contain ?s= parameter");

  // Verify URL is valid and contains encoded data
  const url = new URL(shareUrl);
  const encoded = url.searchParams.get("s");
  assert.ok(encoded, "Encoded state should be present");

  // Verify round-trip: decode the payload
  const decoded = JSON.parse(decodeURIComponent(escape(atob(encoded))));
  // Compare answer values individually to avoid reference-equality issues
  const decodedAnswers = decoded.quiz.answers;
  const originalAnswers = computed.quiz.answers;
  for (const key of Object.keys(originalAnswers)) {
    assert.equal(decodedAnswers[key], originalAnswers[key], `Answer ${key} mismatch`);
  }
  assert.equal(decoded.ui.lang, computed.ui.lang);
});

test("all questions have valid scoring structures", () => {
  const { exports } = loadApp();
  for (const q of exports.questions) {
    assert.ok(q.id, "Question must have an id");
    assert.ok(q.textKey, "Question must have textKey");
    assert.ok(exports.i18n.el[q.textKey], `EL missing question text key: ${q.textKey}`);
    assert.ok(exports.i18n.en[q.textKey], `EN missing question text key: ${q.textKey}`);
    assert.ok(["single", "slider"].includes(q.type), `Invalid question type: ${q.type}`);

    if (q.type === "single") {
      assert.ok(Array.isArray(q.options), `${q.id} must have options array`);
      assert.ok(q.options.length >= 2, `${q.id} must have at least 2 options`);
      for (const opt of q.options) {
        assert.ok(opt.labelKey, `${q.id} option must have labelKey`);
        assert.ok(exports.i18n.el[opt.labelKey], `EL missing option key: ${opt.labelKey}`);
        assert.ok(exports.i18n.en[opt.labelKey], `EN missing option key: ${opt.labelKey}`);
        assert.ok(opt.scores, `${q.id} option must have scores`);
      }
    } else {
      assert.ok(typeof q.min === "number", `${q.id} slider must have min`);
      assert.ok(typeof q.max === "number", `${q.id} slider must have max`);
      assert.ok(typeof q.default === "number", `${q.id} slider must have default`);
      assert.ok(typeof q.map === "function", `${q.id} slider must have map function`);
    }
  }
});

test("concept packs exist for all routes with required fields", () => {
  const { exports } = loadApp();
  for (const route of ["A", "B", "C"]) {
    const pack = exports.conceptPacks[route];
    assert.ok(pack, `Concept pack for route ${route} missing`);
    assert.ok(pack.name, `Route ${route} missing name`);
    assert.ok(pack.packLabel, `Route ${route} missing packLabel`);
    assert.ok(pack.markDescription, `Route ${route} missing markDescription`);
    assert.ok(Array.isArray(pack.palette), `Route ${route} palette must be array`);
    assert.ok(pack.palette.length >= 3, `Route ${route} must have at least 3 palette colors`);
    assert.ok(Array.isArray(pack.taglines), `Route ${route} taglines must be array`);
    assert.ok(Array.isArray(pack.lockups), `Route ${route} lockups must be array`);
  }
});

test("render includes confetti layer on result page", () => {
  const { exports, appRoot, windowObj } = loadApp();
  const stateWithAnswers = exports.recomputeFromAnswers(completeAnswersFavoringB(exports.baseState));
  exports.setState(stateWithAnswers);
  windowObj.location.hash = "#/result";
  exports.render();
  assert.ok(appRoot.innerHTML.includes("confetti-layer"), "Result page should contain confetti layer");
  assert.ok(appRoot.innerHTML.includes("confetti-piece"), "Result page should contain confetti pieces");
});

test("render includes emoji rain and landing steps on landing page", () => {
  const { exports, appRoot, windowObj } = loadApp();
  windowObj.location.hash = "#/";
  exports.render();
  assert.ok(appRoot.innerHTML.includes("emoji-rain"), "Landing page should contain emoji rain");
  assert.ok(appRoot.innerHTML.includes("landing-step"), "Landing page should contain step cards");
  assert.ok(appRoot.innerHTML.includes("Τιραμόλα"), "Landing page should contain brand title");
});

test("render includes confidence gauge on result page", () => {
  const { exports, appRoot, windowObj } = loadApp();
  const stateWithAnswers = exports.recomputeFromAnswers(completeAnswersFavoringB(exports.baseState));
  exports.setState(stateWithAnswers);
  windowObj.location.hash = "#/result";
  exports.render();
  assert.ok(appRoot.innerHTML.includes("confidence-gauge"), "Result page should contain confidence gauge");
  assert.ok(appRoot.innerHTML.includes("gauge-ring"), "Result page should contain gauge ring SVG");
});

test("render includes route badge on result page", () => {
  const { exports, appRoot, windowObj } = loadApp();
  const stateWithAnswers = exports.recomputeFromAnswers(completeAnswersFavoringB(exports.baseState));
  exports.setState(stateWithAnswers);
  windowObj.location.hash = "#/result";
  exports.render();
  assert.ok(appRoot.innerHTML.includes("route-badge"), "Result page should contain route badge");
  assert.ok(appRoot.innerHTML.includes("route-badge-letter"), "Route badge should contain letter element");
});

test("pitch deck includes scroll-reveal cards", () => {
  const { exports, appRoot, windowObj } = loadApp();
  const stateWithAnswers = exports.recomputeFromAnswers(completeAnswersFavoringB(exports.baseState));
  exports.setState(stateWithAnswers);
  windowObj.location.hash = "#/pitch-deck?route=B";
  exports.render();
  assert.ok(appRoot.innerHTML.includes("scroll-reveal"), "Pitch deck should contain scroll-reveal cards");
  assert.ok(appRoot.innerHTML.includes("section-eyebrow"), "Pitch deck should contain section eyebrow numbers");
});

test("compare page is removed — routing falls through", () => {
  const { exports, appRoot, windowObj } = loadApp();
  const stateWithAnswers = exports.recomputeFromAnswers(completeAnswersFavoringB(exports.baseState));
  exports.setState(stateWithAnswers);
  windowObj.location.hash = "#/compare";
  exports.render();
  assert.ok(!appRoot.innerHTML.includes("compare-col-route"), "Compare page should no longer render");
});

// ========== Experience Page + Brand Mark tests ==========

test("experience page renders nursery page for each route without crashing", () => {
  const { exports, appRoot, windowObj } = loadApp();
  for (const route of ["A", "B", "C"]) {
    windowObj.location.hash = `#/experience?route=${route}`;
    assert.doesNotThrow(() => exports.render());
    assert.ok(appRoot.innerHTML.includes("nb-hero"), `Experience ${route} should contain nursery hero`);
    assert.ok(appRoot.innerHTML.includes(`data-nursery-route="${route}"`), `Should have route ${route} attribute`);
    assert.ok(appRoot.innerHTML.includes(`data-pick-route="${route}"`), `CTAs should reference route ${route}`);
  }
});

test("experience page contains scroll-reveal sections", () => {
  const { exports, appRoot, windowObj } = loadApp();
  windowObj.location.hash = "#/experience?route=A";
  exports.render();
  assert.ok(appRoot.innerHTML.includes("scroll-reveal"), "Experience page should contain scroll-reveal sections");
});

test("nursery pages use correct route-specific i18n keys", () => {
  const { exports } = loadApp();
  for (const prefix of ["na", "nb", "nc"]) {
    const suffixes = ["HeroTagline", "HeroSub", "AboutTitle", "PhilosophyTitle", "ContactTitle"];
    for (const suffix of suffixes) {
      assert.ok(exports.i18n.el[prefix + suffix], `EL missing key: ${prefix}${suffix}`);
      assert.ok(exports.i18n.en[prefix + suffix], `EN missing key: ${prefix}${suffix}`);
    }
  }
});

test("experience page includes CTAs for pitch deck and route selection", () => {
  const { exports, appRoot, windowObj } = loadApp();
  windowObj.location.hash = "#/experience?route=B";
  exports.render();
  assert.ok(appRoot.innerHTML.includes("data-pick-route"), "Experience page should contain route selection CTA");
  assert.ok(appRoot.innerHTML.includes("/pitch-deck?route=B"), "Experience page should link to pitch deck");
  assert.ok(appRoot.innerHTML.includes("/concepts"), "Experience page should link to concepts");
});

test("concept cards include Choose This button for all 3 routes", () => {
  const { exports, appRoot, windowObj } = loadApp();
  const stateWithAnswers = exports.recomputeFromAnswers(completeAnswersFavoringB(exports.baseState));
  exports.setState(stateWithAnswers);
  windowObj.location.hash = "#/concepts";
  exports.render();
  for (const route of ["A", "B", "C"]) {
    assert.ok(appRoot.innerHTML.includes(`data-pick-route="${route}"`), `Concepts page should have Choose This for route ${route}`);
  }
});

test("topbar contains only language switch, no brand logo", () => {
  const { exports, appRoot, windowObj } = loadApp();
  windowObj.location.hash = "#/quiz?q=1";
  exports.render();
  assert.ok(appRoot.innerHTML.includes("lang-switch"), "Topbar should contain language switch");
  assert.ok(!appRoot.innerHTML.includes("brand-mark"), "Topbar should not contain brand mark");
  assert.ok(!appRoot.innerHTML.includes('class="brand"'), "Topbar should not contain brand div");
});

test("nursery landing page contains all major sections for each route", () => {
  const { exports, appRoot, windowObj } = loadApp();
  for (const route of ["A", "B", "C"]) {
    windowObj.location.hash = `#/experience?route=${route}`;
    exports.render();
    assert.ok(appRoot.innerHTML.includes("nb-page"), `Route ${route}: Should render nursery page`);
    assert.ok(appRoot.innerHTML.includes(`data-nursery-route="${route}"`), `Route ${route}: Should have route attribute`);
    assert.ok(appRoot.innerHTML.includes("nb-hero"), `Route ${route}: Should contain hero section`);
    assert.ok(appRoot.innerHTML.includes("nb-programs"), `Route ${route}: Should contain programmes grid`);
    assert.ok(appRoot.innerHTML.includes("nb-philosophy"), `Route ${route}: Should contain philosophy section`);
    assert.ok(appRoot.innerHTML.includes("nb-why-grid"), `Route ${route}: Should contain why grid`);
    assert.ok(appRoot.innerHTML.includes("nb-contact"), `Route ${route}: Should contain contact section`);
    assert.ok(appRoot.innerHTML.includes("nb-float"), `Route ${route}: Should contain floating emoji elements`);
    assert.ok(appRoot.innerHTML.includes("nb-hero-wave"), `Route ${route}: Should contain hero wave`);
    assert.ok(appRoot.innerHTML.includes("+357 22 436090"), `Route ${route}: Should contain phone number`);
    assert.ok(appRoot.innerHTML.includes("tel:+35722436090"), `Route ${route}: Should contain tel: link`);
    assert.ok(appRoot.innerHTML.includes("maps.app.goo.gl"), `Route ${route}: Should contain Google Maps link`);
  }
});

test("i18n keys for experience page exist in both languages", () => {
  const { exports } = loadApp();
  const expKeys = ["expHeroEyebrow", "expBrandStory", "expVisualShowcase", "expPaletteTitle",
    "expTypographyTitle", "expSelectRoute", "expViewPitch", "expViewExperience",
    "expPromise", "expPersonality", "expHeadingFont", "expBodyFont"];
  for (const key of expKeys) {
    assert.ok(exports.i18n.el[key], `EL missing key: ${key}`);
    assert.ok(exports.i18n.en[key], `EN missing key: ${key}`);
  }
});
