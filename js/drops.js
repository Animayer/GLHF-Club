import { formatNumber } from "./format.js";
import { renderShell, sample, toast } from "./ui.js";
import { loadSnapshot, resolveWallet } from "./wallet.js";

const BANDS = [
  { min: 0, max: 39, name: "Starter", requirement: "Example partner requirement: hold 1 GLHFer and join the project list." },
  { min: 40, max: 59, name: "Regular", requirement: "Example partner requirement: raffle entry for 20 whitelist spots." },
  { min: 60, max: 79, name: "Veteran", requirement: "Example partner requirement: guaranteed whitelist, 5 spots." },
  { min: 80, max: 100, name: "Archivist", requirement: "Example partner requirement: one claim from a 10-piece partner drop." },
];

renderShell();
const snapshot = await loadSnapshot();
const wallet = resolveWallet(snapshot);
const score = wallet.score.total;

document.getElementById("content").innerHTML = `<h1>Partner drops</h1>
  <p class="lede">Partners offer whitelist spots and giveaways unlocked by Collector Score. The slots below are empty on purpose.</p>
  <p>Snapshot score ${sample(`${formatNumber(score)} / 100`)}.</p>
  <section class="section">
    <h2>Score bands</h2>
    <div class="band-grid">
      ${BANDS.map((band) => {
        const yours = score >= band.min && score <= band.max;
        return `<article class="band${yours ? " is-yours" : ""}">
          <h3>${band.min}–${band.max}</h3>
          <p>${band.name}${yours ? " · this wallet" : ""}</p>
          <p class="meta">${band.requirement} <span class="tag">sample</span></p>
          <div class="empty-slot">Empty drop slot</div>
          <div class="empty-slot">Empty drop slot</div>
        </article>`;
      }).join("")}
    </div>
  </section>
  <section class="section">
    <h2>Want your project here?</h2>
    <p class="meta">Partner listings are not open in this prototype.</p>
    <button type="button" class="btn" id="partner-cta">Want your project here?</button>
    <p id="partner-note" class="meta" hidden>Prototype only. This does not send a request.</p>
  </section>`;

document.getElementById("partner-cta").addEventListener("click", () => {
  const note = document.getElementById("partner-note");
  note.hidden = false;
  toast("Prototype only. This does not send a request.");
});
