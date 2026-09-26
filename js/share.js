import { asset } from "./paths.js";
import { BRAND, rarityMeta, spriteFor } from "./model.js";
import { toast } from "./ui.js";

function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

function fitText(ctx, text, maxWidth) {
  let label = text;
  while (label.length > 4 && ctx.measureText(label).width > maxWidth) {
    label = `${label.slice(0, -2)}…`;
  }
  return label;
}

function drawPixel(ctx, image, x, y, w, h) {
  if (!image) return;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, x, y, w, h);
  ctx.imageSmoothingEnabled = true;
}

export async function renderShareCard(view) {
  if (document.fonts && document.fonts.load) {
    try {
      await document.fonts.load("32px Gigaverse");
    } catch {
      /* Inter covers any glyph the pixel face does not include */
    }
  }
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  const sprites = await Promise.all(view.top.map((token) => loadImage(asset(spriteFor(token)))));
  const [glhf, gigaverse] = await Promise.all([
    loadImage(asset(BRAND.glhf)),
    loadImage(asset(BRAND.gigaverse)),
  ]);
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fafaf8";
  ctx.fillRect(0, 0, 1200, 630);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(28, 28, 1144, 574);
  ctx.strokeStyle = "#e7e4de";
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, 1144, 574);

  let cursor = 56;
  if (glhf) {
    const h = 46;
    const w = Math.round(glhf.width * (h / glhf.height));
    drawPixel(ctx, glhf, cursor, 48, w, h);
    cursor += w + 14;
  }
  ctx.fillStyle = "#1c1c1c";
  ctx.font = "32px Gigaverse, Inter, sans-serif";
  ctx.fillText("CLUB", cursor, 82);
  cursor += ctx.measureText("CLUB").width + 22;
  if (gigaverse) {
    const h = 26;
    const w = Math.round(gigaverse.width * (h / gigaverse.height));
    drawPixel(ctx, gigaverse, cursor, 58, w, h);
  }
  ctx.fillStyle = "#5f5f5f";
  ctx.font = "400 16px Inter, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("Snapshot 17 Jul 2026", 1144, 78);
  ctx.textAlign = "left";

  ctx.fillStyle = "#1c1c1c";
  ctx.font = "500 24px Inter, sans-serif";
  ctx.fillText(fitText(ctx, view.address, 1080), 56, 148);
  ctx.font = "400 20px Inter, sans-serif";
  ctx.fillText(`Rank #${view.rank}   ·   Full-stack   ·   ${view.tier}`, 56, 184);

  const rare = rarityMeta(view.rarest.rarity);
  ctx.fillStyle = "#5f5f5f";
  ctx.font = "400 15px Inter, sans-serif";
  ctx.fillText("Rarest piece", 56, 230);
  ctx.strokeStyle = rare.color;
  ctx.lineWidth = 4;
  ctx.strokeRect(56, 244, 16, 16);
  ctx.fillStyle = "#1c1c1c";
  ctx.font = "500 22px Inter, sans-serif";
  ctx.fillText(fitText(ctx, `${view.rarest.name}   ·   ${rare.label}`, 1000), 84, 258);

  const stats = [
    ["Pieces", String(view.pieces)],
    ["Emblems", `${view.emblems}/19`],
    ["Score", `${view.score}/100`],
  ];
  stats.forEach((row, index) => {
    const x = 56 + index * 240;
    ctx.fillStyle = "#fafaf8";
    ctx.fillRect(x, 292, 220, 78);
    ctx.strokeStyle = "#e7e4de";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, 292, 220, 78);
    ctx.fillStyle = "#5f5f5f";
    ctx.font = "400 14px Inter, sans-serif";
    ctx.fillText(row[0], x + 16, 320);
    ctx.fillStyle = "#1c1c1c";
    ctx.font = "28px Gigaverse, Inter, sans-serif";
    ctx.fillText(row[1], x + 16, 354);
  });

  ctx.fillStyle = "#5f5f5f";
  ctx.font = "400 15px Inter, sans-serif";
  ctx.fillText("Top three", 56, 412);

  for (let index = 0; index < view.top.length; index += 1) {
    const token = view.top[index];
    const x = 56 + index * 360;
    const color = rarityMeta(token.rarity).color;
    ctx.fillStyle = "#f4f2ee";
    ctx.fillRect(x, 428, 112, 112);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, 428, 112, 112);
    drawPixel(ctx, sprites[index], x + 10, 438, 92, 92);
    ctx.fillStyle = "#1c1c1c";
    ctx.font = "500 16px Inter, sans-serif";
    ctx.fillText(fitText(ctx, token.name, 220), x + 128, 470);
    ctx.fillStyle = color;
    ctx.font = "600 13px Inter, sans-serif";
    ctx.fillText(rarityMeta(token.rarity).label.toUpperCase(), x + 128, 496);
  }

  const blob = await new Promise((resolve) => canvas.toBlob((result) => resolve(result), "image/png"));
  if (!blob || blob.size < 800) throw new Error("Share card PNG was empty");
  return blob;
}

function downloadBlob(blob, filename) {
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function shareStatsCard(view) {
  const blob = await renderShareCard(view);
  const file = new File([blob], "glhf-club-stats.png", { type: "image/png" });
  const payload = { files: [file], title: "GLHF Club", text: `${view.address} · rank #${view.rank}` };
  if (navigator.share && navigator.canShare && navigator.canShare(payload)) {
    try {
      await navigator.share(payload);
      toast("Stats card shared.");
      return blob;
    } catch (error) {
      if (error && error.name === "AbortError") return blob;
    }
  }
  downloadBlob(blob, file.name);
  toast("Stats card downloaded.");
  return blob;
}

export async function copyText(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}
