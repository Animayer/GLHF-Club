import { esc, formatNumber } from "./format.js";
import { GLHFER_SUPPLY, baseTraitCounts, clanMemberCount, emblemIconFor, rarityMeta, valueRarity } from "./model.js";
import { asset } from "./paths.js";
import { renderShell, sample } from "./ui.js";
import { loadSnapshot } from "./wallet.js";

renderShell();
const snapshot = await loadSnapshot();
const holders = snapshot.collections.glhfers.holders;
const clans = baseTraitCounts()
  .map((row) => ({
    ...row,
    members: clanMemberCount(row.count, holders),
    rarity: valueRarity(row.count, GLHFER_SUPPLY),
  }))
  .sort((a, b) => a.count - b.count || a.name.localeCompare(b.name));

const communities = snapshot.communities.map((community) => `<article class="community">
    <img class="pixel" alt="" src="${esc(asset(community.art))}">
    <div>
      <h2>${esc(community.name)}</h2>
      <p>${esc(community.note)}</p>
    </div>
  </article>`).join("");

const content = document.getElementById("content");
content.innerHTML = `<h1>Clans &amp; Guilds</h1>
  <p class="lede">Two communities are named here as placeholders. The 19 trait clans follow the GLHFer Base traits.</p>
  <section class="section">
    <h2>Communities</h2>
    ${communities}
  </section>
  <section class="section">
    <h2>Trait clans</h2>
    <p class="meta">Token and member counts are sample. One clan per Base trait.</p>
    <div class="clan-grid">
      ${clans.map((clan) => {
        const color = rarityMeta(clan.rarity).color;
        return `<article class="clan">
          <p class="badge" style="background:${color};color:${rarityMeta(clan.rarity).ink}">${esc(rarityMeta(clan.rarity).label)}</p>
          <h3 class="clan-name"><img class="emblem-icon" alt="" src="${esc(asset(emblemIconFor(clan.name)))}"> ${esc(clan.name)}</h3>
          <p>Tokens ${sample(formatNumber(clan.count))}</p>
          <p>Members ${sample(formatNumber(clan.members))}</p>
        </article>`;
      }).join("")}
    </div>
  </section>`;
