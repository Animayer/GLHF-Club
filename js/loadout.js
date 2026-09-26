import { elapsed, esc, formatDate } from "./format.js";
import { GLHFER_SUPPLY, placeholderSvg, rarityMeta, spriteFor, valueRarity, walletTier } from "./model.js";
import { asset } from "./paths.js";
import { copyText, renderShareCard, shareStatsCard } from "./share.js";
import { renderShell, sample, setHeldDates, toast, tokenButton } from "./ui.js";
import { heldMap, loadSnapshot, resolveWallet } from "./wallet.js";

renderShell();
const snapshot = await loadSnapshot();
const wallet = resolveWallet(snapshot);
setHeldDates(heldMap(snapshot));
const tier = walletTier(wallet.all.length);
const portrait = wallet.portrait;
const portraitMeta = rarityMeta(portrait.rarity);
const shareView = {
  address: wallet.address,
  rank: wallet.rank,
  tier,
  rarest: wallet.rarest,
  pieces: wallet.all.length,
  emblems: wallet.earnedCount,
  score: wallet.score.total,
  top: wallet.top,
};

window.GLHFShare = { render: () => renderShareCard(shareView) };

const content = document.getElementById("content");
const parts = wallet.score.collectParts;
content.innerHTML = `<div class="loadout-grid">
  <aside class="profile">
    <div class="portrait" style="--rarity:${portraitMeta.color}">
      <span class="token-art">
        <img class="plate" alt="" src="${placeholderSvg(portrait)}">
        <img class="sprite" alt="${esc(portrait.name)}" src="${esc(asset(spriteFor(portrait)))}">
      </span>
    </div>
    <p class="mono">${esc(wallet.address)}</p>
    <p><span class="pill solid">Full-stack</span> <span class="pill">${esc(tier)}</span></p>
    <p>Held for ${sample(elapsed(wallet.earliest, snapshot.snapshotDate))}</p>
    <p class="meta">Snapshot ${formatDate(snapshot.snapshotDate)}. Rank #${wallet.rank}.</p>
    <ul class="stat-list">
      <li><span>Total pieces</span><span>${sample(String(wallet.all.length))}</span></li>
      <li><span>Emblems earned</span><span>${sample(`${wallet.earnedCount}/19`)}</span></li>
      <li><span>GLHFers</span><span>${sample(String(wallet.groups.glhfers.length))}</span></li>
      <li><span>ROMs</span><span>${sample(String(wallet.groups.roms.length))}</span></li>
      <li><span>Giglings</span><span>${sample(String(wallet.groups.giglings.length))}</span></li>
    </ul>
    <div class="actions">
      <button type="button" class="btn" id="share-card">Share stats card</button>
      <button type="button" class="btn secondary" id="copy-link">Copy link</button>
    </div>
  </aside>
  <div>
    <h1>Giga Loadout</h1>
    <section>
      <h2>Emblems</h2>
      <p class="meta">${wallet.earnedCount} of 19 GLHFer Base traits are lit. Counts are sample.</p>
      <ul class="emblems">
        ${wallet.emblems.map((emblem) => {
          const color = rarityMeta(valueRarity(emblem.count, GLHFER_SUPPLY)).color;
          return `<li class="${emblem.earned ? "is-on" : "is-off"}">
            <span class="pip" style="${emblem.earned ? `background:${color}` : ""}"></span>
            <span>${esc(emblem.name)}</span>
          </li>`;
        }).join("")}
      </ul>
    </section>
    <section class="section">
      <h2>Collector Score</h2>
      <p class="score-total"><span>${wallet.score.total}</span> / 100 <span class="tag">sample</span></p>
      <div class="score-track" role="img" aria-label="Score ${wallet.score.total} out of 100"><span style="width:${wallet.score.total}%"></span></div>
      <ul class="score-list">
        <li><span>Collect</span><span>${parts.fullStack} full-stack + ${parts.emblems} emblems + ${parts.pieces} pieces = ${wallet.score.collect} / ${wallet.score.collectMax}</span></li>
        <li><span>Tenure</span><span>${wallet.score.tenure} / ${wallet.score.tenureMax}</span></li>
        <li><span>Play</span><span class="muted">not tracked yet</span></li>
        <li><span>Participation</span><span class="muted">not tracked yet</span></li>
      </ul>
      <p class="formula">Collect is 12 for holding all three collections, plus emblems ÷ 19 × 16, rounded, plus half a point per piece up to 12. Tenure scales the days since the earliest piece across 15 Jan 2024 to ${formatDate(snapshot.snapshotDate)}, up to 30. Play is reserved at 15 and Participation at 15.</p>
    </section>
    <section class="section">
      <h2>Slots</h2>
      <p class="meta">Filled with the two rarest held tokens in each collection.</p>
      ${["glhfers", "roms", "giglings"].map((key) => `<h3>${key === "glhfers" ? "GLHFers" : key === "roms" ? "ROMs" : "Giglings"}</h3>
        <div class="slot-grid">${wallet.slots[key].map((token) => tokenButton(token)).join("")}</div>`).join("")}
    </section>
    ${["glhfers", "roms", "giglings"].map((key) => `<section class="section">
      <h2>${key === "glhfers" ? "GLHFers" : key === "roms" ? "ROMs" : "Giglings"}</h2>
      <p class="meta">Full inventory, rarest first.</p>
      <div class="token-grid">${wallet.groups[key].map((token) => tokenButton(token)).join("")}</div>
    </section>`).join("")}
  </div>
</div>`;

document.getElementById("share-card").addEventListener("click", () => {
  shareStatsCard(shareView).catch(() => toast("Could not draw the card."));
});
document.getElementById("copy-link").addEventListener("click", async () => {
  const url = new URL(location.href);
  url.search = "";
  url.hash = "";
  const ok = await copyText(url.toString());
  toast(ok ? "Link copied." : "Clipboard blocked.");
});
