import { esc, formatNumber, shortAddress } from "./format.js";
import { medalForRank, medalForTier } from "./model.js";
import { medalImg, renderShell } from "./ui.js";
import { loadSnapshot } from "./wallet.js";

renderShell();
const snapshot = await loadSnapshot();
const rows = snapshot.leaderboard.map((row) => `<li class="${row.demo ? "is-demo" : ""}">
    <span class="rank">${medalImg(medalForRank(row.rank))} #${row.rank}</span>
    <span class="wallet mono" title="${esc(row.address)}">${esc(shortAddress(row.address))}${row.demo ? " · this snapshot" : ""}</span>
    <span class="num col-total">${formatNumber(row.total)}</span>
    <span class="split">
      <span class="num">${formatNumber(row.glhfers)}<span class="col-label"> GLHFers</span></span>
      <span class="num">${formatNumber(row.roms)}<span class="col-label"> ROMs</span></span>
      <span class="num">${formatNumber(row.giglings)}<span class="col-label"> Giglings</span></span>
    </span>
    <span class="marks">
      ${row.fullStack ? `<span class="pill solid">Full-stack</span>` : ""}
      <span class="pill">${medalImg(medalForTier(row.tier))} ${esc(row.tier)}</span>
    </span>
  </li>`).join("");

document.getElementById("content").innerHTML = `<h1>Leaderboard</h1>
  <p class="banner">Preview: ranking by holdings only, not final score</p>
  <p class="meta">Top 25 wallets by total pieces in the sample snapshot. Piece counts are sample.</p>
  <div class="board-table">
    <div class="board-head" aria-hidden="true">
      <span>Rank</span>
      <span>Wallet</span>
      <span class="num">Pieces</span>
      <span class="num">GLHFers</span>
      <span class="num">ROMs</span>
      <span class="num">Giglings</span>
      <span></span>
    </div>
    <ol class="board">${rows}</ol>
  </div>`;
