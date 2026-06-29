const coinsEl = document.getElementById("coins");
const perClickEl = document.getElementById("perClick");
const perSecondEl = document.getElementById("perSecond");
const upgradeClickCostEl = document.getElementById("upgradeClickCost");
const autoClickCostEl = document.getElementById("autoClickCost");

const clickButton = document.getElementById("clickButton");
const upgradeClickButton = document.getElementById("upgradeClick");
const buyAutoClickerButton = document.getElementById("buyAutoClicker");
const fallContainer = document.getElementById("fallContainer");
const factoryListEl = document.getElementById("factoryList");
const audienceEl = document.getElementById("audience");

const penlightColors = ["🔴", "🟠", "🟡", "🟢", "🔵", "🟣"];
const MAX_AUDIENCE = 40;
let lastAudienceCount = -1;

const factories = [
  { id: "viewer", icon: "👀", name: "視聴者", desc: "ニコ動を見てコインを生成", baseCost: 15, production: 0.1, count: 0 },
  { id: "comment", icon: "💬", name: "コメント職人", desc: "弾幕でコインを生成", baseCost: 100, production: 1, count: 0 },
  { id: "broadcaster", icon: "🎤", name: "ニコ生主", desc: "生放送でコインを生成", baseCost: 1100, production: 8, count: 0 },
  { id: "uploader", icon: "🎬", name: "動画投稿者", desc: "投稿動画でコインを生成", baseCost: 12000, production: 47, count: 0 },
  { id: "premium", icon: "💎", name: "プレミアム会員", desc: "会員費でコインを生成", baseCost: 130000, production: 260, count: 0 },
  { id: "server", icon: "🖥️", name: "サーバー増設", desc: "サーバーがコインを生成", baseCost: 1400000, production: 1400, count: 0 },
];

const state = {
  coins: 0,
  perClick: 1,
  perSecond: 0,
  upgradeClickCost: 10,
  autoClickLevel: 0,
  autoClickCost: 50000,
};

let autoClickInterval = null;

function factoryCost(factory) {
  return Math.floor(factory.baseCost * Math.pow(1.15, factory.count));
}

function recalcPerSecond() {
  state.perSecond = factories.reduce((sum, factory) => sum + factory.production * factory.count, 0);
}

function renderFactories() {
  factoryListEl.innerHTML = "";
  factories.forEach((factory) => {
    const item = document.createElement("button");
    item.className = "factory-item";
    item.innerHTML = `
      <span class="factory-icon">${factory.icon}</span>
      <span class="factory-info">
        <span class="factory-name">${factory.name}</span>
        <span class="factory-desc">${factory.desc}（+${factory.production}/秒）</span>
      </span>
      <span class="factory-count">×${factory.count}</span>
      <span class="factory-cost">${factoryCost(factory)} コイン</span>
    `;
    item.addEventListener("click", () => buyFactory(factory));
    factory.el = item;
    factory.countEl = item.querySelector(".factory-count");
    factory.costEl = item.querySelector(".factory-cost");
    factoryListEl.appendChild(item);
  });
}

function renderAudience() {
  const viewerFactory = factories.find((factory) => factory.id === "viewer");
  const count = Math.min(viewerFactory.count, MAX_AUDIENCE);
  if (count === lastAudienceCount) return;
  lastAudienceCount = count;

  audienceEl.innerHTML = "";
  for (let i = 0; i < count; i += 1) {
    const person = document.createElement("span");
    person.className = "audience-person";
    person.style.animationDelay = `${(Math.random() * 0.8).toFixed(2)}s`;

    const img = document.createElement("img");
    img.src = "audience-person.png";
    img.alt = "観客";
    img.className = "audience-person-img";
    img.style.filter = `brightness(${(0.5 + Math.random() * 0.9).toFixed(2)})`;

    const penlight = document.createElement("span");
    penlight.className = "penlight";
    penlight.textContent = penlightColors[Math.floor(Math.random() * penlightColors.length)];
    penlight.style.animationDelay = `${(Math.random() * 0.6).toFixed(2)}s`;

    person.appendChild(img);
    person.appendChild(penlight);
    audienceEl.appendChild(person);
  }
}

function updateFactoryDisplay() {
  factories.forEach((factory) => {
    const cost = factoryCost(factory);
    factory.countEl.textContent = `×${factory.count}`;
    factory.costEl.textContent = `${cost} コイン`;
    factory.el.disabled = state.coins < cost;
  });
}

function buyFactory(factory) {
  const cost = factoryCost(factory);
  if (state.coins < cost) return;
  state.coins -= cost;
  factory.count += 1;
  recalcPerSecond();
  updateDisplay();

  if (factory.id === "comment")      playNikoNikoEffect();
  if (factory.id === "broadcaster")  playBroadcasterEffect();
  if (factory.id === "uploader")     playUploaderEffect();
  if (factory.id === "premium")      playPremiumEffect();
  if (factory.id === "server")       playServerEffect();
}

// ===== ニコ生主: 弾幕エフェクト =====
const danmakuTexts = ["草", "ｗｗｗｗ", "神配信！", "来たー！", "えも", "わかる", "すこ", "888888", "いいね！", "最高！", "ｷﾀ━(ﾟ∀ﾟ)━!!", "ｗ", "3", "ワロタ", "リスナーです"];
const danmakuColors = ["#222", "#e60012", "#0066cc", "#007a3d", "#cc6600", "#9900cc", "#cc0066"];

function playBroadcasterEffect() {
  let overlay = document.getElementById("danmakuOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "danmakuOverlay";
    overlay.className = "danmaku-overlay";
    document.body.appendChild(overlay);
  }

  const count = 8 + Math.floor(Math.random() * 6);
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "danmaku-comment";
      el.textContent = danmakuTexts[Math.floor(Math.random() * danmakuTexts.length)];
      el.style.top = `${5 + Math.random() * 82}%`;
      el.style.color = danmakuColors[Math.floor(Math.random() * danmakuColors.length)];
      const duration = 2.2 + Math.random() * 1.5;
      el.style.animationDuration = `${duration}s`;
      overlay.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    }, i * 90);
  }
}

// ===== 動画投稿者: 再生数カウンターアニメ =====
function playUploaderEffect() {
  let popup = document.getElementById("viewCountPopup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "viewCountPopup";
    popup.className = "view-count-popup";
    popup.innerHTML = `<div class="vc-title">🎬 動画投稿完了！</div><div class="vc-count" id="vcCount">0</div><div class="vc-title">再生数</div>`;
    document.body.appendChild(popup);
  }

  const vcCount = document.getElementById("vcCount");
  const target = (10 + Math.floor(Math.random() * 490)) * 10000;
  const duration = 1400;
  const startTime = performance.now();

  popup.classList.add("show");
  vcCount.textContent = "0";

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    vcCount.textContent = current >= 10000 ? `${Math.floor(current / 10000)}万 回` : `${current} 回`;
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      vcCount.textContent = `${Math.floor(target / 10000)}万 回`;
      setTimeout(() => popup.classList.remove("show"), 1800);
    }
  };
  requestAnimationFrame(tick);
}

// ===== プレミアム会員: ゴールドフラッシュ =====
function playPremiumEffect() {
  let flash = document.getElementById("goldFlash");
  if (!flash) {
    flash = document.createElement("div");
    flash.id = "goldFlash";
    flash.className = "gold-flash";
    document.body.appendChild(flash);
  }

  flash.classList.remove("active");
  void flash.offsetWidth;
  flash.classList.add("active");
  flash.addEventListener("animationend", () => flash.classList.remove("active"), { once: true });

  const starEmojis = ["✨", "💎", "⭐", "🌟"];
  for (let i = 0; i < 16; i++) {
    setTimeout(() => {
      const star = document.createElement("div");
      star.textContent = starEmojis[Math.floor(Math.random() * starEmojis.length)];
      star.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        font-size: ${1 + Math.random() * 1.5}rem;
        pointer-events: none;
        z-index: 55;
        animation: premium-star-pop 0.9s ease-out forwards;
      `;
      document.body.appendChild(star);
      star.addEventListener("animationend", () => star.remove());
    }, i * 55);
  }
}

// ===== サーバー増設: 画面シェイク + ターミナル =====
const serverLines = [
  "$ sudo deploy niconico-server",
  "> Downloading packages...",
  "> Configuring network...",
  "> Starting services...",
  "✅ Server deployed! +1400 coins/sec",
];

function playServerEffect() {
  const container = document.querySelector(".container");
  container.classList.remove("shake");
  void container.offsetWidth;
  container.classList.add("shake");
  container.addEventListener("animationend", () => container.classList.remove("shake"), { once: true });

  let terminal = document.getElementById("serverTerminal");
  if (!terminal) {
    terminal = document.createElement("div");
    terminal.id = "serverTerminal";
    terminal.className = "server-terminal";
    terminal.innerHTML = `<div id="serverTerminalText"></div>`;
    document.body.appendChild(terminal);
  }

  const textEl = document.getElementById("serverTerminalText");
  textEl.innerHTML = "";
  terminal.classList.add("show");

  let lineIndex = 0;
  const addLine = () => {
    if (lineIndex >= serverLines.length) {
      setTimeout(() => terminal.classList.remove("show"), 2000);
      return;
    }
    const line = document.createElement("div");
    line.textContent = serverLines[lineIndex++];
    textEl.appendChild(line);
    setTimeout(addLine, 420);
  };
  addLine();
}

const nikonikoVideo = document.getElementById("nikonikoVideo");
const nikonikoCanvas = document.getElementById("nikonikoCanvas");
const nikonikoCtx = nikonikoCanvas.getContext("2d");
let nikonikoRaf = null;
let nikonikoTimers = [];

function playNikoNikoEffect() {
  nikonikoTimers.forEach((timer) => clearTimeout(timer));
  nikonikoTimers = [];
  if (nikonikoRaf) cancelAnimationFrame(nikonikoRaf);

  nikonikoVideo.currentTime = 0;
  nikonikoVideo.play();
  nikonikoCanvas.style.transition = "none";
  nikonikoCanvas.style.opacity = "1";

  const drawFrame = () => {
    if (nikonikoVideo.paused || nikonikoVideo.ended) return;
    nikonikoCanvas.width = nikonikoVideo.videoWidth;
    nikonikoCanvas.height = nikonikoVideo.videoHeight;
    nikonikoCtx.drawImage(nikonikoVideo, 0, 0, nikonikoCanvas.width, nikonikoCanvas.height);

    const frame = nikonikoCtx.getImageData(0, 0, nikonikoCanvas.width, nikonikoCanvas.height);
    const data = frame.data;
    for (let i = 0; i < data.length; i += 4) {
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (lum < 30) {
        data[i + 3] = 0;
      } else {
        const gray = lum * 0.6;
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }
    }
    nikonikoCtx.putImageData(frame, 0, 0);

    nikonikoRaf = requestAnimationFrame(drawFrame);
  };
  nikonikoRaf = requestAnimationFrame(drawFrame);

  nikonikoTimers.push(setTimeout(() => {
    nikonikoCanvas.style.transition = "opacity 1s ease";
    nikonikoCanvas.style.opacity = "0";
    nikonikoTimers.push(setTimeout(() => {
      nikonikoVideo.pause();
      if (nikonikoRaf) cancelAnimationFrame(nikonikoRaf);
    }, 1000));
  }, 7000));
}

function updateDisplay() {
  coinsEl.textContent = Math.floor(state.coins);
  perClickEl.textContent = state.perClick;
  perSecondEl.textContent = state.perSecond.toFixed(1);
  upgradeClickCostEl.textContent = state.upgradeClickCost;

  autoClickCostEl.textContent = state.autoClickCost;

  upgradeClickButton.disabled = state.coins < state.upgradeClickCost;
  buyAutoClickerButton.disabled = state.coins < state.autoClickCost;
  updateFactoryDisplay();
  renderAudience();
}

function addCoins(amount) {
  state.coins += amount;
  updateDisplay();
}

function performClick() {
  addCoins(state.perClick);
  spawnFallingNico(Math.min(state.perClick, 5));
  spawnFloatingScore();
  bounceButton();
}

clickButton.addEventListener("click", performClick);
clickButton.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.repeat) e.preventDefault();
});

function bounceButton() {
  clickButton.classList.remove("bounce");
  void clickButton.offsetWidth;
  clickButton.classList.add("bounce");
}

function spawnFloatingScore() {
  const item = document.createElement("span");
  item.className = "fall-item";
  item.textContent = `+${state.perClick}`;
  const left = 30 + Math.random() * 40;
  item.style.left = `${left}%`;
  item.style.top = `40%`;
  item.style.fontSize = "1.4rem";
  item.style.transform = "translateX(-50%) translateY(0) rotate(0deg)";

  fallContainer.appendChild(item);
  item.addEventListener("animationend", () => item.remove());
}

function spawnFallingNico(count) {
  for (let i = 0; i < count; i += 1) {
    const item = document.createElement("img");
    item.src = "niconico.png";
    item.alt = "にこ";
    item.className = "fall-item fall-icon";
    const left = 20 + Math.random() * 60;
    const delay = Math.random() * 0.15;
    item.style.left = `${left}%`;
    item.style.top = `10%`;
    item.style.animationDelay = `${delay}s`;
    const size = 1.1 + Math.random() * 0.5;
    item.style.width = `${size}rem`;
    item.style.transform = `translateX(-50%) translateY(0) rotate(${Math.random() * 40 - 20}deg)`;

    fallContainer.appendChild(item);
    item.addEventListener("animationend", () => item.remove());
  }
}

upgradeClickButton.addEventListener("click", () => {
  if (state.coins < state.upgradeClickCost) return;
  state.coins -= state.upgradeClickCost;
  state.perClick += 1;
  state.upgradeClickCost = Math.floor(state.upgradeClickCost * 1.8);
  updateDisplay();
});

function applyAutoClickInterval() {
  if (autoClickInterval) clearInterval(autoClickInterval);
  if (state.autoClickLevel <= 0) return;
  const intervalMs = Math.max(1000 / state.autoClickLevel, 50);
  autoClickInterval = setInterval(performClick, intervalMs);
}

buyAutoClickerButton.addEventListener("click", () => {
  if (state.coins < state.autoClickCost) return;
  state.coins -= state.autoClickCost;
  state.autoClickLevel += 1;
  state.autoClickCost = Math.floor(state.autoClickCost * 3);
  applyAutoClickInterval();
  updateDisplay();
});

setInterval(() => {
  if (state.perSecond > 0) {
    addCoins(state.perSecond / 10);
  }
}, 100);

const SUPABASE_URL = "https://lvonigoeobfdqmokwvpg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_YFEzQSTtD9sWI0fhtsYLlA_1mYRvXNy";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const openRankingButton = document.getElementById("openRanking");
const closeRankingButton = document.getElementById("closeRanking");
const rankingModal = document.getElementById("rankingModal");
const rankingList = document.getElementById("rankingList");
const rankingForm = document.getElementById("rankingForm");
const rankingNameInput = document.getElementById("rankingName");
const rankingMessage = document.getElementById("rankingMessage");

if (
  openRankingButton &&
  closeRankingButton &&
  rankingModal &&
  rankingList &&
  rankingForm &&
  rankingNameInput &&
  rankingMessage
) {
  async function loadRanking() {
    rankingList.innerHTML = "<li>読み込み中...</li>";
    const { data, error } = await supabaseClient
      .from("rankings")
      .select("name, coins")
      .order("coins", { ascending: false })
      .limit(10);

    if (error) {
      console.error("loadRanking error:", error);
      rankingList.innerHTML = `<li>取得失敗: ${error.message}</li>`;
      return;
    }

    rankingList.innerHTML = "";
    data.forEach((row, index) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${index + 1}. ${row.name}</span><span>${row.coins} コイン</span>`;
      rankingList.appendChild(li);
    });
  }

  openRankingButton.addEventListener("click", () => {
    rankingModal.classList.add("open");
    rankingMessage.textContent = "";
    loadRanking();
  });

  closeRankingButton.addEventListener("click", () => {
    rankingModal.classList.remove("open");
  });

  rankingModal.addEventListener("click", (event) => {
    if (event.target === rankingModal) {
      rankingModal.classList.remove("open");
    }
  });

  rankingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = rankingNameInput.value.trim();
    if (!name) return;

    rankingMessage.textContent = "登録中...";
    const { error } = await supabaseClient
      .from("rankings")
      .insert({ name, coins: Math.floor(state.coins) });

    if (error) {
      console.error("submit ranking error:", error);
      rankingMessage.textContent = `登録失敗: ${error.message}`;
      return;
    }

    rankingMessage.textContent = "登録しました！";
    loadRanking();
  });
}

renderFactories();
updateDisplay();
