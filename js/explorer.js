import { esc, formatNumber } from "./format.js";
import { PAGE_SIZE, allRoms, romTraitOptions } from "./model.js";
import { renderShell, setHeldDates, tokenButton } from "./ui.js";
import { heldMap, loadSnapshot } from "./wallet.js";

function trait(token, type) {
  return token.traits.find((row) => row.type === type).value;
}

function readState() {
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab") || "roms";
  return {
    tab: ["roms", "glhfers", "giglings"].includes(tab) ? tab : "roms",
    tier: params.get("tier") || "",
    faction: params.get("faction") || "",
    memory: params.get("memory") || "",
    q: params.get("q") || "",
    sort: params.get("sort") === "rarest" ? "rarest" : "id",
    page: Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1),
  };
}

function urlFor(state) {
  const params = new URLSearchParams();
  if (state.tab !== "roms") params.set("tab", state.tab);
  if (state.tier) params.set("tier", state.tier);
  if (state.faction) params.set("faction", state.faction);
  if (state.memory) params.set("memory", state.memory);
  if (state.q) params.set("q", state.q);
  if (state.sort !== "id") params.set("sort", state.sort);
  if (state.page > 1) params.set("page", String(state.page));
  const query = params.toString();
  return `${location.pathname}${query ? `?${query}` : ""}`;
}

function writeUrl(state, mode) {
  const next = urlFor(state);
  const current = `${location.pathname}${location.search}`;
  if (next === current) return;
  if (mode === "push") history.pushState(state, "", next);
  else history.replaceState(state, "", next);
}

function matching(state) {
  const query = state.q.trim().toLowerCase();
  let rows = allRoms();
  if (state.tier) rows = rows.filter((token) => trait(token, "Tier") === state.tier);
  if (state.faction) rows = rows.filter((token) => trait(token, "Faction") === state.faction);
  if (state.memory) rows = rows.filter((token) => trait(token, "Memory") === state.memory);
  if (query) {
    rows = rows.filter((token) => String(token.id).includes(query) || token.name.toLowerCase().includes(query));
  }
  if (state.sort === "rarest") rows = rows.slice().sort((a, b) => a.rank - b.rank || a.id - b.id);
  return rows;
}

function options(values, current, allLabel) {
  return [`<option value="">${esc(allLabel)}</option>`]
    .concat(values.map((value) => `<option value="${esc(value)}"${value === current ? " selected" : ""}>${esc(value)}</option>`))
    .join("");
}

renderShell();
const snapshot = await loadSnapshot();
setHeldDates(heldMap(snapshot));
const optionsMap = romTraitOptions();
let state = readState();

const content = document.getElementById("content");
content.innerHTML = `<h1>Explorer</h1>
  <p class="lede">10,000 ROMs from the seeded snapshot. Rarity is the token's rank against trait frequency. 96 tokens per page.</p>
  <div class="tabs" role="tablist" aria-label="Collections">
    <button type="button" role="tab" id="tab-roms" data-tab="roms">ROMs</button>
    <button type="button" role="tab" id="tab-glhfers" data-tab="glhfers">GLHFers</button>
    <button type="button" role="tab" id="tab-giglings" data-tab="giglings">Giglings</button>
  </div>
  <form id="filters" class="filters">
    <label>Tier <select name="tier">${options(optionsMap.Tier, state.tier, "Any tier")}</select></label>
    <label>Faction <select name="faction">${options(optionsMap.Faction, state.faction, "Any faction")}</select></label>
    <label>Memory <select name="memory">${options(optionsMap.Memory, state.memory, "Any memory")}</select></label>
    <label>Search <input name="q" type="search" placeholder="ID or name" value="${esc(state.q)}"></label>
    <label>Sort <select name="sort">
      <option value="id"${state.sort === "id" ? " selected" : ""}>ID</option>
      <option value="rarest"${state.sort === "rarest" ? " selected" : ""}>Rarest</option>
    </select></label>
  </form>
  <div id="explorer-results"></div>`;

const form = document.getElementById("filters");
const results = document.getElementById("explorer-results");

function syncControls() {
  form.tier.value = state.tier;
  form.faction.value = state.faction;
  form.memory.value = state.memory;
  if (form.q.value !== state.q) form.q.value = state.q;
  form.sort.value = state.sort;
  ["roms", "glhfers", "giglings"].forEach((tab) => {
    const button = document.getElementById(`tab-${tab}`);
    button.setAttribute("aria-selected", tab === state.tab ? "true" : "false");
  });
  form.hidden = state.tab !== "roms";
}

function renderResults() {
  if (state.tab !== "roms") {
    const title = state.tab === "glhfers" ? "GLHFers" : "Giglings";
    results.innerHTML = `<section class="not-indexed"><h2>${title}</h2><p>Not indexed yet</p></section>`;
    return;
  }
  const rows = matching(state);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  if (state.page > pages) {
    state = { ...state, page: pages };
    writeUrl(state, "replace");
  }
  const start = (state.page - 1) * PAGE_SIZE;
  const view = rows.slice(start, start + PAGE_SIZE);
  const from = rows.length ? start + 1 : 0;
  const to = start + view.length;
  results.innerHTML = `<div class="results-head">
      <p>${rows.length ? `Showing ${formatNumber(from)}–${formatNumber(to)} of ${formatNumber(rows.length)}` : "No ROMs match."}</p>
      <p class="meta">Page ${state.page} of ${pages}</p>
    </div>
    ${view.length ? `<div class="token-grid">${view.map((token) => tokenButton(token)).join("")}</div>` : `<p class="empty">No ROMs match.</p>`}
    <div class="pager">
      <button type="button" class="btn secondary" data-page="prev"${state.page <= 1 ? " disabled" : ""}>Previous</button>
      <button type="button" class="btn secondary" data-page="next"${state.page >= pages ? " disabled" : ""}>Next</button>
    </div>`;
}

function apply(partial, mode) {
  state = { ...state, ...partial };
  writeUrl(state, mode);
  syncControls();
  renderResults();
}

form.addEventListener("change", (event) => {
  const name = event.target.name;
  if (!name || name === "q") return;
  apply({ [name]: event.target.value, page: 1 }, "push");
});
form.addEventListener("input", (event) => {
  if (event.target.name !== "q") return;
  apply({ q: event.target.value, page: 1 }, "replace");
});
form.addEventListener("submit", (event) => event.preventDefault());
content.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-tab]");
  if (tab) {
    apply({ tab: tab.dataset.tab }, "push");
    return;
  }
  const pager = event.target.closest("[data-page]");
  if (!pager || pager.disabled) return;
  const pages = Math.max(1, Math.ceil(matching(state).length / PAGE_SIZE));
  const next = pager.dataset.page === "next" ? Math.min(pages, state.page + 1) : Math.max(1, state.page - 1);
  apply({ page: next }, "push");
});
window.addEventListener("popstate", () => {
  state = readState();
  syncControls();
  renderResults();
});

syncControls();
renderResults();
