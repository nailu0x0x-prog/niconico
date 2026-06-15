const coinsEl = document.getElementById("coins");
const perClickEl = document.getElementById("perClick");
const perSecondEl = document.getElementById("perSecond");
const upgradeClickCostEl = document.getElementById("upgradeClickCost");
const buyAutoCostEl = document.getElementById("buyAutoCost");

const clickButton = document.getElementById("clickButton");
const upgradeClickButton = document.getElementById("upgradeClick");
const buyAutoButton = document.getElementById("buyAuto");
const fallContainer = document.getElementById("fallContainer");

const state = {
  coins: 0,
  perClick: 1,
  perSecond: 0,
  upgradeClickCost: 10,
  buyAutoCost: 50,
};

function updateDisplay() {
  coinsEl.textContent = state.coins;
  perClickEl.textContent = state.perClick;
  perSecondEl.textContent = state.perSecond;
  upgradeClickCostEl.textContent = state.upgradeClickCost;
  buyAutoCostEl.textContent = state.buyAutoCost;

  upgradeClickButton.disabled = state.coins < state.upgradeClickCost;
  buyAutoButton.disabled = state.coins < state.buyAutoCost;
}

function addCoins(amount) {
  state.coins += amount;
  updateDisplay();
}

clickButton.addEventListener("click", () => {
  addCoins(state.perClick);
  spawnFallingNico(Math.min(state.perClick, 5));
});

function spawnFallingNico(count) {
  for (let i = 0; i < count; i += 1) {
    const item = document.createElement("span");
    item.className = "fall-item";
    item.textContent = "にこ";
    const left = 20 + Math.random() * 60;
    const delay = Math.random() * 0.15;
    item.style.left = `${left}%`;
    item.style.top = `10%`;
    item.style.animationDelay = `${delay}s`;
    item.style.fontSize = `${1.1 + Math.random() * 0.5}rem`;
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

buyAutoButton.addEventListener("click", () => {
  if (state.coins < state.buyAutoCost) return;
  state.coins -= state.buyAutoCost;
  state.perSecond += 1;
  state.buyAutoCost = Math.floor(state.buyAutoCost * 2.2);
  updateDisplay();
});

setInterval(() => {
  if (state.perSecond > 0) {
    addCoins(state.perSecond);
  }
}, 1000);

updateDisplay();
