import { formatDate, formatNumber } from "./format.js";
import { published, renderShell, sample, setHeldDates, tokenButton } from "./ui.js";
import { heldMap, loadSnapshot, resolveWallet } from "./wallet.js";

const FEATURES = [
  ["Wallet loadout", "Live", "One demo wallet from the 17 Jul 2026 snapshot."],
  ["Rarest-piece slots", "Live", "Two GLHFers, two ROMs, and two Giglings, bordered by rarity."],
  ["Full inventory", "Live", "Every held token, sorted rarest first."],
  ["Token detail", "Live", "Art, a rarity bar on every trait, one of N, and the first-held date."],
  ["Base emblems", "Live", "All 19 GLHFer Base traits, lit when held and greyed when not."],
  ["Collector score", "Live", "Collect and Tenure are calculated out of 100."],
  ["Play score", "Planned", "Not tracked yet."],
  ["Participation score", "Planned", "Not tracked yet."],
  ["Share stats card", "Live", "Draws a PNG and uses the device share sheet, or downloads it."],
  ["Copy link", "Live", "Copies the loadout URL."],
  ["ROM explorer", "Live", "All 10,000 ROMs, 96 per page, with a rarity badge on each."],
  ["Explorer filters", "Live", "Tier, Faction, and Memory, plus search, sort, and a shareable URL."],
  ["GLHFers explorer", "Planned", "Not indexed yet."],
  ["Giglings explorer", "Planned", "Not indexed yet."],
  ["Collection stats", "Live", "Supply, holders, average held, and the top-10 wallets' share."],
  ["Holdings distribution", "Live", "A chart of how many wallets hold how many pieces."],
  ["Set overlaps", "Live", "Pair overlaps, and 225 wallets that hold all three."],
  ["Base trait rarity", "Live", "Counts and rarity for all 19 GLHFer Base traits."],
  ["Communities", "In prototype", "Disciples of Gigus and Auctioneer's Henchmen, without member lists."],
  ["Trait clans", "In prototype", "One clan per Base trait, with token and member counts."],
  ["Leaderboard", "In prototype", "Top 25 wallets by pieces. Holdings only, not the final score."],
  ["Partner drops", "In prototype", "Empty slots, score bands, and example partner requirements."],
  ["Live wallet lookup", "Planned", "No login, wallet connect, or chain calls."],
];

const STATUS_CLASS = {
  Live: "status-live",
  "In prototype": "status-proto",
  Planned: "status-planned",
};

renderShell();
const snapshot = await loadSnapshot();
const wallet = resolveWallet(snapshot);
setHeldDates(heldMap(snapshot));
const content = document.getElementById("content");
const collections = snapshot.collections;
const tierLine = collections.roms.tiers.map((tier) => `${tier.name} ${formatNumber(tier.count)}`).join(" · ");
const slots = ["glhfers", "roms", "giglings"].flatMap((key) => wallet.slots[key]);

content.innerHTML = `<section class="hero">
    <h1>Good luck, have fun, welcome home.</h1>
    <p class="lede">Collector pages for GLHFers, ROMs, and Giglings. This view is the ${formatDate(snapshot.snapshotDate)} snapshot of one demo wallet.</p>
  </section>
  <section class="card-grid" aria-label="Collections">
    <a class="card" href="stats/#glhfers">
      <p class="meta">Ethereum</p>
      <h2>GLHFers</h2>
      <p>Supply ${sample(formatNumber(collections.glhfers.supply))}</p>
      <p>Holders ${sample(formatNumber(collections.glhfers.holders))}</p>
    </a>
    <a class="card" href="explorer/roms/">
      <p class="meta">Abstract</p>
      <h2>ROMs</h2>
      <p>Supply ${published(formatNumber(collections.roms.supply))}</p>
      <p>Holders ${sample(formatNumber(collections.roms.holders))}</p>
      <p class="meta">${tierLine} <span class="tag">published</span></p>
    </a>
    <a class="card" href="stats/#giglings">
      <p class="meta">Abstract</p>
      <h2>Giglings</h2>
      <p>Supply ${sample(formatNumber(collections.giglings.supply))}</p>
      <p>Holders ${sample(formatNumber(collections.giglings.holders))}</p>
    </a>
  </section>
  <section class="section">
    <div class="preview-head">
      <h2>Giga Loadout</h2>
      <a class="text-link" href="loadout/">Open loadout</a>
    </div>
    <p class="meta">${wallet.address}</p>
    <div class="slot-grid">${slots.map((token) => tokenButton(token)).join("")}</div>
  </section>
  <section class="section">
    <h2>Discover</h2>
    <p class="meta">Live means the control works in this prototype. In prototype means the screen is only partly filled in. Planned is not built. Figures stay sample unless marked published.</p>
    <div class="discover">
      ${FEATURES.map(([name, status, detail]) => `<article class="feature">
        <p class="status ${STATUS_CLASS[status]}">${status}</p>
        <h3>${name}</h3>
        <p class="meta">${detail}</p>
      </article>`).join("")}
    </div>
  </section>`;
