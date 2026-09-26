import { esc, formatDate, formatNumber } from "./format.js";
import { GLHFER_SUPPLY, baseTraitCounts, rarityMeta, valueRarity } from "./model.js";
import { published, renderShell, sample } from "./ui.js";
import { loadSnapshot } from "./wallet.js";

function bars(rows, colorFor) {
  const width = 640;
  const labelW = 110;
  const rowH = 28;
  const height = rows.length * rowH + 8;
  const max = Math.max(...rows.map((row) => row.value), 1);
  const track = width - labelW - 80;
  const marks = rows.map((row, index) => {
    const y = 8 + index * rowH;
    const barW = row.value === 0 ? 0 : Math.max(2, (track * row.value) / max);
    const fill = colorFor ? colorFor(row) : "#d4d0c8";
    return `<text x="0" y="${y + 16}">${esc(row.label)}</text>
      <rect x="${labelW}" y="${y + 6}" width="${barW}" height="12" fill="${fill}"></rect>
      <text x="${labelW + barW + 8}" y="${y + 16}">${esc(row.valueLabel)}</text>`;
  }).join("");
  return `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img">${marks}</svg>`;
}

renderShell();
const snapshot = await loadSnapshot();
const order = ["glhfers", "roms", "giglings"];
const content = document.getElementById("content");

const blocks = order.map((key) => {
  const collection = snapshot.collections[key];
  const supply = collection.supplySample
    ? sample(formatNumber(collection.supply))
    : published(formatNumber(collection.supply));
  const tiers = collection.tiers
    ? `<p class="meta">${collection.tiers.map((tier) => `${esc(tier.name)} ${formatNumber(tier.count)}`).join(" · ")} <span class="tag">published</span></p>`
    : "";
  const chartRows = collection.distribution.map((bucket) => ({
    label: bucket.label,
    value: bucket.holders,
    valueLabel: formatNumber(bucket.holders),
  }));
  return `<section class="section" id="${key}">
    <h2>${esc(collection.name)}</h2>
    <p class="meta">${esc(collection.chain)}</p>
    ${tiers}
    <div class="stat-line"><span>Supply</span><span>${supply}</span></div>
    <div class="stat-line"><span>Holders</span><span>${sample(formatNumber(collection.holders))}</span></div>
    <div class="stat-line"><span>Average held</span><span>${sample(String(collection.avg))}</span></div>
    <div class="stat-line"><span>Top-10 wallets' share</span><span>${sample(`${(collection.top10Share * 100).toFixed(1)}%`)}</span></div>
    <h3>Holdings distribution</h3>
    <p class="meta">Wallets in each holding size. Sample.</p>
    ${bars(chartRows)}
  </section>`;
}).join("");

const traits = baseTraitCounts()
  .slice()
  .sort((a, b) => a.count - b.count || a.name.localeCompare(b.name));
const traitRows = traits.map((row) => ({
  label: row.name,
  value: row.count,
  valueLabel: `one of ${formatNumber(row.count)}`,
  rarity: valueRarity(row.count, GLHFER_SUPPLY),
}));

const overlaps = snapshot.overlaps;
content.innerHTML = `<h1>Stats</h1>
  <p class="lede">Collection figures for the ${formatDate(snapshot.snapshotDate)} snapshot. Published numbers are the ROM supply, the ROM tier mix, and the 225 full-stack wallets.</p>
  ${blocks}
  <section class="section" id="overlaps">
    <h2>Overlaps</h2>
    <div class="overlap-grid">
      <article class="card">
        <p class="meta">All three collections</p>
        <strong>${published(formatNumber(overlaps.allThree))}</strong>
        <p>wallets hold all three</p>
      </article>
      <article class="card"><p class="meta">GLHFers and ROMs</p><strong>${sample(formatNumber(overlaps.glhfersRoms))}</strong><p>wallets</p></article>
      <article class="card"><p class="meta">GLHFers and Giglings</p><strong>${sample(formatNumber(overlaps.glhfersGiglings))}</strong><p>wallets</p></article>
      <article class="card"><p class="meta">ROMs and Giglings</p><strong>${sample(formatNumber(overlaps.romsGiglings))}</strong><p>wallets</p></article>
    </div>
  </section>
  <section class="section" id="bases">
    <h2>GLHFer Base traits</h2>
    <p class="meta">All 19 Base traits, rarest first. Counts are sample.</p>
    ${bars(traitRows, (row) => rarityMeta(row.rarity).color)}
  </section>`;
