import { esc, formatNumber, shortAddress } from "./format.js";
import { medalForRank, medalForTier } from "./model.js";
import { medalImg, renderShell } from "./ui.js";
import { loadSnapshot } from "./wallet.js";

renderShell();
const snapshot = await loadSnapshot();
const rows = snapshot.leaderboard.map((row) => `<li class="${row.demo ? "is-demo" : ""}">
    <span class="rank">${medalImg(medalForRank(row.rank))} #${row.rank}</span>
    <span>
      <span class="mono">${esc(row.address)}</span>
      <span class="meta">${esc(shortAddress(row.address))}${row.demo ? " · this snapshot" : ""}</span>
    </span>
    <span>${formatNumber(row.total)} pieces · ${formatNumber(row.glhfers)} GLHFers · ${formatNumber(row.roms)} ROMs · ${formatNumber(row.giglings)} Giglings</span>
    <span class="marks">
      ${row.fullStack ? `<span class="pill solid">Full-stack</span>` : ""}
      <span class="pill">${medalImg(medalForTier(row.tier))} ${esc(row.tier)}</span>
    </span>
  </li>`).join("");

document.getElementById("content").innerHTML = `<h1>Leaderboard</h1>
  <p class="banner">Preview: ranking by holdings only, not final score</p>
  <p class="meta">Top 25 wallets by total pieces in the sample snapshot. Piece counts are sample.</p>
  <ol class="board">${rows}</ol>`;
