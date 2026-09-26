import { asset, rootPrefix } from "./paths.js";
import { esc, figure, formatDate, formatNumber, tokenSub, tokenTitle } from "./format.js";
import { barPercent, placeholderSvg, rarityMeta, spriteFor, tokenById, valueRarity } from "./model.js";

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

export function tokenButton(token) {
  const meta = rarityMeta(token.rarity);
  return `<button type="button" class="token" style="--rarity:${meta.color}" data-collection="${esc(token.collection)}" data-id="${token.id}">
    <span class="token-art">
      <img class="plate" alt="" src="${placeholderSvg(token)}">
      <img class="sprite" alt="" src="${esc(asset(spriteFor(token)))}">
    </span>
    ${badge(token.rarity)}
    <span class="token-name">${esc(tokenTitle(token))}</span>
    <span class="token-sub">${esc(tokenSub(token))}</span>
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
        <a class="brand" href="${home}">GLHF Club</a>
        <nav class="nav" aria-label="Primary">${links}</nav>
        <p class="fullstack-stat">225 wallets hold all three collections</p>
      </div>
    </header>
    <main id="content"></main>
    <div id="modal-root" hidden></div>
    <div id="toast" class="toast" role="status"></div>`);

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
    return `<div class="trait">
      <div class="trait-top">
        <strong>${esc(trait.type)}</strong>
        <span>${esc(trait.value)}</span>
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
      <span class="token-art">
        <img class="plate" alt="" src="${placeholderSvg(token)}">
        <img class="sprite" alt="${esc(token.name)}" src="${esc(asset(spriteFor(token)))}">
      </span>
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

export function published(text) {
  return figure(text, false);
}

export function sample(text) {
  return figure(text, true);
}

export { formatNumber };
