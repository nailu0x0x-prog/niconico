const coinsEl = document.getElementById("coins");
const perClickEl = document.getElementById("perClick");
const perSecondEl = document.getElementById("perSecond");
const upgradeClickCostEl = document.getElementById("upgradeClickCost");

const clickButton = document.getElementById("clickButton");
const upgradeClickButton = document.getElementById("upgradeClick");
const fallContainer = document.getElementById("fallContainer");
const factoryListEl = document.getElementById("factoryList");

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
};

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
}

function updateDisplay() {
  coinsEl.textContent = Math.floor(state.coins);
  perClickEl.textContent = state.perClick;
  perSecondEl.textContent = state.perSecond.toFixed(1);
  upgradeClickCostEl.textContent = state.upgradeClickCost;

  upgradeClickButton.disabled = state.coins < state.upgradeClickCost;
  updateFactoryDisplay();
}

function addCoins(amount) {
  state.coins += amount;
  updateDisplay();
}

clickButton.addEventListener("click", () => {
  addCoins(state.perClick);
  spawnFallingNico(Math.min(state.perClick, 5));
  spawnFloatingScore();
  bounceButton();
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

setInterval(() => {
  if (state.perSecond > 0) {
    addCoins(state.perSecond / 10);
  }
}, 100);

renderFactories();
updateDisplay();
