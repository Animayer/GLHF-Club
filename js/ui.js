import { asset, rootPrefix } from "./paths.js";
import { esc, figure, formatDate, formatNumber, tokenSub, tokenTitle, traitValue } from "./format.js";
import { BRAND, barPercent, factionIcon, rarityMeta, spriteFor, tokenById, valueRarity } from "./model.js";

const NAV = [
  ["loadout/", "Loadout", "loadout"],
  ["explorer/roms/", "Explorer", "explorer"],
  ["stats/", "Stats", "stats"],
  ["clans/", "Clans", "clans"],
  ["leaderboard/", "Leaderboard", "leaderboard"],
  ["drops/", "Drops", "drops"],
];

let heldDates = new Map();
let lastFocus = null;
let toastTimer = 0;

export function setHeldDates(map) {
  heldDates = map;
}

export function badge(rarityId) {
  const meta = rarityMeta(rarityId);
  return `<span class="badge" style="background:${meta.color};color:${meta.ink}">${esc(meta.label)}</span>`;
}

export function factionLabel(name) {
  const src = factionIcon(name);
  if (!src) return esc(name);
  return `<span class="faction"><img class="pixel-icon" alt="" src="${esc(asset(src))}"><span>${esc(name)}</span></span>`;
}

export function medalImg(path, size = "") {
  const klass = size ? `medal ${size}` : "medal";
  return `<img class="${klass}" alt="" src="${esc(asset(path))}">`;
}

export function tokenArt(token, alt = "") {
  const tier = token.collection === "roms" ? traitValue(token, "Tier") : "";
  const frame = tier ? ` tier-${tier.toLowerCase()}` : "";
  const tag = tier ? `<span class="tier-tag">${esc(tier)}</span>` : "";
  return `<span class="token-art${frame}">
      <img class="sprite" alt="${esc(alt)}" src="${esc(asset(spriteFor(token)))}">
      ${tag}
    </span>`;
}

function tokenSubHtml(token) {
  if (token.collection === "roms") {
    return `${esc(traitValue(token, "Tier"))} · ${factionLabel(traitValue(token, "Faction"))}`;
  }
  return esc(tokenSub(token));
}

export function tokenButton(token) {
  const meta = rarityMeta(token.rarity);
  return `<button type="button" class="token" style="--rarity:${meta.color}" data-collection="${esc(token.collection)}" data-id="${token.id}">
    ${tokenArt(token)}
    ${badge(token.rarity)}
    <span class="token-name">${esc(tokenTitle(token))}</span>
    <span class="token-sub">${tokenSubHtml(token)}</span>
  </button>`;
}

export function renderShell() {
  const page = document.body.dataset.page;
  const prefix = rootPrefix();
  const home = prefix || "./";
  const links = NAV.map(([href, label, id]) => {
    const current = id === page ? ` aria-current="page"` : "";
    return `<a href="${prefix}${href}"${current}>${label}</a>`;
  }).join("");
  document.body.insertAdjacentHTML("afterbegin", `<a class="skip" href="#content">Skip to content</a>
    <header class="site-header">
      <p class="notice">Prototype - sample snapshot data, not live</p>
      <div class="topbar">
        <a class="brand" href="${home}">
          <img class="logo-glhf" alt="GLHF" src="${esc(asset(BRAND.glhf))}">
          <span class="brand-word">CLUB</span>
        </a>
        <img class="logo-giga" alt="Gigaverse" src="${esc(asset(BRAND.gigaverse))}">
        <nav class="nav" aria-label="Primary">${links}</nav>
        <button type="button" class="sound-toggle" id="sound-toggle" aria-pressed="false">Sound off</button>
        <p class="fullstack-stat">225 wallets hold all three collections</p>
      </div>
    </header>
    <main id="content"></main>`);
  document.body.insertAdjacentHTML("beforeend", `<footer class="site-footer">
      <img class="logo-glhf" alt="GLHF" src="${esc(asset(BRAND.glhf))}">
      <img class="logo-giga" alt="Gigaverse" src="${esc(asset(BRAND.gigaverse))}">
      <p class="meta">GLHF Club · snapshot 17 Jul 2026</p>
    </footer>
    <div id="modal-root" hidden></div>
    <div id="toast" class="toast" role="status"></div>`);
  bindSound();

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeTokenModal();
  });
  document.body.addEventListener("click", (event) => {
    const button = event.target.closest(".token");
    if (!button) return;
    const collection = button.dataset.collection;
    const id = Number(button.dataset.id);
    const token = tokenById(collection, id);
    openTokenModal(token, { firstHeld: heldDates.get(`${collection}:${id}`) || "" });
  });
  document.getElementById("modal-root").addEventListener("click", (event) => {
    if (event.target.id === "modal-root" || event.target.closest("[data-close]")) closeTokenModal();
  });
}

export function openTokenModal(token, { firstHeld = "" } = {}) {
  const root = document.getElementById("modal-root");
  if (!root || !token) return;
  lastFocus = document.activeElement;
  const meta = rarityMeta(token.rarity);
  const traits = token.traits.map((trait) => {
    const rarityId = valueRarity(trait.count, token.supply);
    const color = rarityMeta(rarityId).color;
    const width = barPercent(trait.count, token.supply);
    const value = trait.type === "Faction" ? factionLabel(trait.value) : esc(trait.value);
    return `<div class="trait">
      <div class="trait-top">
        <strong>${esc(trait.type)}</strong>
        <span class="trait-value">${value}</span>
        ${badge(rarityId)}
      </div>
      <div class="bar" role="img" aria-label="${esc(trait.type)} ${esc(trait.value)}, one of ${formatNumber(trait.count)}"><span style="width:${width}%;background:${color}"></span></div>
      <p class="one">one of ${formatNumber(trait.count)}</p>
    </div>`;
  }).join("");
  const heldLine = firstHeld
    ? `<p>First held ${esc(formatDate(firstHeld))} <span class="tag">sample</span></p>`
    : `<p>First held <span class="muted">not in this wallet snapshot</span></p>`;
  root.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="token-title">
    <div class="modal-top">
      <div>
        <h2 id="token-title">${esc(token.name)}</h2>
        <p class="meta">${esc(token.collection)} · rank ${formatNumber(token.rank)} of ${formatNumber(token.supply)}</p>
      </div>
      <button type="button" class="btn secondary" data-close>Close</button>
    </div>
    <div class="modal-art token" style="--rarity:${meta.color}">
      ${tokenArt(token, token.name)}
    </div>
    <p>${badge(token.rarity)}</p>
    ${heldLine}
    ${traits}
  </div>`;
  root.hidden = false;
  document.body.classList.add("modal-open");
  root.querySelector("[data-close]").focus();
}

export function closeTokenModal() {
  const root = document.getElementById("modal-root");
  if (!root || root.hidden) return;
  root.hidden = true;
  root.innerHTML = "";
  document.body.classList.remove("modal-open");
  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
}

export function toast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.dataset.show = "true";
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    el.dataset.show = "false";
  }, 2600);
}

const SOUND_KEY = "glhf-clicks";
let soundEnabled = false;
let clickAudio = null;

try {
  soundEnabled = localStorage.getItem(SOUND_KEY) === "1";
} catch {
  soundEnabled = false;
}

function paintSound(button) {
  button.setAttribute("aria-pressed", soundEnabled ? "true" : "false");
  button.textContent = soundEnabled ? "Sound on" : "Sound off";
  if (soundEnabled && !clickAudio) {
    clickAudio = new Audio(asset(BRAND.click));
    clickAudio.preload = "auto";
    clickAudio.volume = 0.35;
  }
}

function bindSound() {
  const button = document.getElementById("sound-toggle");
  if (!button) return;
  paintSound(button);
  button.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    try {
      localStorage.setItem(SOUND_KEY, soundEnabled ? "1" : "0");
    } catch {
      /* preference stays for this page when storage is blocked */
    }
    paintSound(button);
  });
  document.addEventListener("click", (event) => {
    const control = event.target.closest("button, .nav a, a.card, a.text-link, .faction-chips button");
    if (!control || control.id === "sound-toggle" || !soundEnabled || !clickAudio) return;
    try {
      clickAudio.currentTime = 0;
      const played = clickAudio.play();
      if (played && typeof played.catch === "function") played.catch(() => {});
    } catch {
      /* play() rejection must not surface as a console error */
    }
  });
}

export function published(text) {
  return figure(text, false);
}

export function sample(text) {
  return figure(text, true);
}

export { formatNumber };
