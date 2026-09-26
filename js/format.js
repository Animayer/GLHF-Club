const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-GB").format(value);
}

export function formatDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

export function elapsed(fromIso, toIso) {
  const from = new Date(`${fromIso}T00:00:00Z`);
  const to = new Date(`${toIso}T00:00:00Z`);
  let years = to.getUTCFullYear() - from.getUTCFullYear();
  let months = to.getUTCMonth() - from.getUTCMonth();
  let days = to.getUTCDate() - from.getUTCDate();
  if (days < 0) {
    months -= 1;
    days += new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), 0)).getUTCDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const parts = [];
  if (years) parts.push(`${years} year${years === 1 ? "" : "s"}`);
  if (months) parts.push(`${months} month${months === 1 ? "" : "s"}`);
  if (!parts.length) parts.push(`${days} day${days === 1 ? "" : "s"}`);
  return parts.join(", ");
}

export function figure(text, sample = true) {
  const label = sample ? "sample" : "published";
  return `<span class="figure">${text}<span class="tag">${label}</span></span>`;
}

export function shortAddress(address) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function traitValue(token, type) {
  return token.traits.find((trait) => trait.type === type)?.value || "";
}

export function tokenTitle(token) {
  if (token.collection === "roms") return `ROM #${token.id}`;
  if (token.collection === "glhfers") return `GLHFer #${token.id}`;
  return `Gigling #${token.id}`;
}

export function tokenSub(token) {
  if (token.collection === "roms") return `${traitValue(token, "Tier")} · ${traitValue(token, "Faction")}`;
  if (token.collection === "glhfers") return traitValue(token, "Base");
  return `${traitValue(token, "Kind")} · ${traitValue(token, "Size")}`;
}
