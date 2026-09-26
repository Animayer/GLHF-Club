import { asset } from "./paths.js";
import { rarityMeta, spriteFor } from "./model.js";
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

export async function renderShareCard(view) {
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 1200, 630);
  ctx.strokeStyle = "#e6e6e6";
  ctx.lineWidth = 2;
  ctx.strokeRect(18, 18, 1164, 594);

  ctx.fillStyle = "#1c1c1c";
  ctx.font = "600 36px Inter, sans-serif";
  ctx.fillText("GLHF Club", 56, 78);
  ctx.fillStyle = "#5f5f5f";
  ctx.font = "400 18px Inter, sans-serif";
  ctx.fillText("Snapshot 17 Jul 2026", 56, 112);

  ctx.fillStyle = "#1c1c1c";
  ctx.font = "500 26px Inter, sans-serif";
  ctx.fillText(fitText(ctx, view.address, 1080), 56, 168);
  ctx.font = "400 22px Inter, sans-serif";
  ctx.fillText(`Rank #${view.rank}   ·   Full-stack   ·   ${view.tier}`, 56, 206);

  const rare = rarityMeta(view.rarest.rarity);
  ctx.fillStyle = "#5f5f5f";
  ctx.font = "400 16px Inter, sans-serif";
  ctx.fillText("Rarest piece", 56, 258);
  ctx.fillStyle = rare.color;
  ctx.fillRect(56, 274, 18, 18);
  ctx.fillStyle = "#1c1c1c";
  ctx.font = "500 22px Inter, sans-serif";
  ctx.fillText(fitText(ctx, `${view.rarest.name}   ·   ${rare.label}`, 1000), 86, 290);

  const stats = [
    ["Pieces", String(view.pieces)],
    ["Emblems", `${view.emblems}/19`],
    ["Score", `${view.score}/100`],
  ];
  stats.forEach((row, index) => {
    const x = 56 + index * 240;
    ctx.strokeStyle = "#e6e6e6";
    ctx.strokeRect(x, 324, 220, 78);
    ctx.fillStyle = "#5f5f5f";
    ctx.font = "400 14px Inter, sans-serif";
    ctx.fillText(row[0], x + 16, 352);
    ctx.fillStyle = "#1c1c1c";
    ctx.font = "600 26px Inter, sans-serif";
    ctx.fillText(row[1], x + 16, 384);
  });

  ctx.fillStyle = "#5f5f5f";
  ctx.font = "400 16px Inter, sans-serif";
  ctx.fillText("Top three", 56, 444);

  for (let index = 0; index < view.top.length; index += 1) {
    const token = view.top[index];
    const x = 56 + index * 360;
    const color = rarityMeta(token.rarity).color;
    ctx.fillStyle = color;
    ctx.fillRect(x, 464, 96, 96);
    const image = await loadImage(asset(spriteFor(token)));
    if (image) ctx.drawImage(image, x + 10, 474, 76, 76);
    ctx.fillStyle = "#1c1c1c";
    ctx.font = "500 16px Inter, sans-serif";
    ctx.fillText(fitText(ctx, token.name, 230), x + 112, 500);
    ctx.fillStyle = "#5f5f5f";
    ctx.font = "400 14px Inter, sans-serif";
    ctx.fillText(rarityMeta(token.rarity).label, x + 112, 526);
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
