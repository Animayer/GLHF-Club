// Deterministic GLHF Club sample model. Seed 20260717.
// Published figures: ROM supply 10,000 (Silver 5,800 / Gold 3,200 / Void 850 / Giga 150)
// and 225 wallets holding all three collections. Every other count is sample data.

export const SEED = 20260717;
export const SNAPSHOT_DATE = "2026-07-17";
export const TENURE_ANCHOR = "2024-01-15";
export const FULL_STACK_WALLETS = 225;
export const PAGE_SIZE = 96;
export const ROM_SUPPLY = 10000;
export const GLHFER_SUPPLY = 3248;
export const GIGLING_SUPPLY = 4800;

export const RARITY = {
  common: { id: "common", label: "Common", color: "#6b7280", ink: "#ffffff" },
  uncommon: { id: "uncommon", label: "Uncommon", color: "#2f9e44", ink: "#ffffff" },
  rare: { id: "rare", label: "Rare", color: "#1c7ed6", ink: "#ffffff" },
  epic: { id: "epic", label: "Epic", color: "#7048e8", ink: "#ffffff" },
  legendary: { id: "legendary", label: "Legendary", color: "#e0ac2b", ink: "#1c1c1c" },
  mythic: { id: "mythic", label: "Mythic", color: "#d42c2c", ink: "#ffffff" },
};

export const RARITY_ORDER = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];

export const ROM_TIERS = [
  { name: "Silver", count: 5800 },
  { name: "Gold", count: 3200 },
  { name: "Void", count: 850 },
  { name: "Giga", count: 150 },
];

export const FACTION_ORDER = ["Archon", "Athena", "Chobo", "Crusader", "Foxglove", "Overseer", "Summoner"];

const FACTION_ART = {
  Archon: "assets/factions/Faction_Archon_Transparant.png",
  Athena: "assets/factions/Faction_Athena_Transparant.png",
  Chobo: "assets/factions/Faction_Chobo_Transparant.png",
  Crusader: "assets/factions/Faction_Crusader_Transparant.png",
  Foxglove: "assets/factions/Faction_Foxglove_Transparant.png",
  Overseer: "assets/factions/Faction_Overseer_Transparant.png",
  Summoner: "assets/factions/Faction_Summoner_Transparant.png",
};

const HEADS = [
  "assets/heads/archon_front.png",
  "assets/heads/athena_front.png",
  "assets/heads/blackknight_front.png",
  "assets/heads/boss_1.png",
  "assets/heads/chobo_front.png",
  "assets/heads/crow_front.png",
  "assets/heads/crusader_front.png",
  "assets/heads/foxglove_front.png",
  "assets/heads/greycloak_front.png",
  "assets/heads/impaler_1.png",
  "assets/heads/knight_front.png",
  "assets/heads/overseer_front.png",
  "assets/heads/redcloak_front.png",
  "assets/heads/summoner_front.png",
];

const EXPRESSIONS = [
  "assets/expressions/noob_default.png",
  "assets/expressions/noob_happy.png",
  "assets/expressions/noob_shades.png",
  "assets/expressions/noob_yay1.png",
  "assets/expressions/noob_anger.png",
  "assets/expressions/noob_bigeyes.png",
  "assets/expressions/noob_cry.png",
  "assets/expressions/noob_ded.png",
  "assets/expressions/noob_orly.png",
  "assets/expressions/noob_uwu1.png",
];

const EMBLEM_ART = [...HEADS, ...EXPRESSIONS.slice(0, 5)];

const MEDALS = {
  Wood: "assets/medals/Icon_Wood-Medal.png",
  Stone: "assets/medals/Icon_Stone-Medal.png",
  Copper: "assets/medals/Icon_Copper-Medal.png",
  Iron: "assets/medals/Icon_Iron-Medal.png",
  Gold: "assets/medals/Icon_Gold-Medal.png",
  Giga: "assets/medals/Icon_Giga-Medal.png",
};

export const BRAND = {
  glhf: "assets/logo/GLHF_Logo_Deep.png",
  gigaverse: "assets/logo/Gigaverse_Logo.png",
  banner: "assets/gifs/Gigaverse_Banner.gif",
  click: "assets/sounds/Click.mp3",
};

const BASE_VALUES = [
  ["Default", 70],
  ["Arcade", 48],
  ["CRT", 36],
  ["Cartridge", 30],
  ["Pixel", 24],
  ["Cabinet", 20],
  ["Sprite", 16],
  ["Joystick", 14],
  ["Bit", 12],
  ["Dungeon", 10],
  ["Neon", 8],
  ["Scanline", 7],
  ["Chiptune", 5],
  ["Lantern", 4],
  ["Glitch", 3],
  ["Goldframe", 2.4],
  ["Synthetic", 1.6],
  ["Voidbase", 1.1],
  ["Gigaform", 0.7],
];

const ROM_DEFS = [
  { type: "Tier", values: ROM_TIERS.map((tier) => [tier.name, tier.count]) },
  {
    type: "Faction",
    values: [
      ["Archon", 14],
      ["Athena", 18],
      ["Chobo", 16],
      ["Crusader", 22],
      ["Foxglove", 13],
      ["Overseer", 6],
      ["Summoner", 11],
    ],
  },
  {
    type: "Memory",
    values: [
      ["8 MB", 32],
      ["16 MB", 24],
      ["32 MB", 18],
      ["64 MB", 12],
      ["128 MB", 8],
      ["256 MB", 4],
      ["512 MB", 1.8],
      ["1024 MB", 0.2],
    ],
  },
];

const GLHFER_DEFS = [
  { type: "Base", values: BASE_VALUES },
  {
    type: "Background",
    values: [
      ["Alley", 16],
      ["Castle", 14],
      ["Night Market", 12],
      ["Dawn Grid", 11],
      ["Arcade Floor", 10],
      ["Dungeon", 9],
      ["Cloud Bank", 8],
      ["Ember", 7],
      ["Terminal", 5],
      ["Void Hall", 3],
    ],
  },
  {
    type: "Eyes",
    values: [
      ["Default", 22],
      ["Angry", 16],
      ["Shades", 12],
      ["Wide", 10],
      ["Sleepy", 8],
      ["Glow", 6],
      ["Visor", 4],
      ["XX", 2],
    ],
  },
  {
    type: "Mouth",
    values: [
      ["Default", 24],
      ["Smile", 18],
      ["Flat", 12],
      ["Open", 8],
      ["Wise Beard", 6],
      ["Fang", 3],
      ["Pipe", 2],
    ],
  },
  {
    type: "Head",
    values: [
      ["Bare", 28],
      ["Cap", 18],
      ["Hood", 12],
      ["Helm", 10],
      ["Hachimaki", 6],
      ["Antenna", 4],
      ["Crown", 2],
    ],
  },
  {
    type: "Apparel",
    values: [
      ["Tee", 26],
      ["Jacket", 18],
      ["None", 14],
      ["Cloak", 10],
      ["Armor", 7],
      ["Robe", 4],
      ["Exoskeleton", 2],
    ],
  },
];

const GIGLING_DEFS = [
  {
    type: "Kind",
    values: [
      ["Sprout", 28],
      ["Wisp", 22],
      ["Imp", 18],
      ["Brute", 14],
      ["Oracle", 8],
      ["Titan", 3],
    ],
  },
  {
    type: "Temper",
    values: [
      ["Calm", 30],
      ["Bright", 24],
      ["Sly", 18],
      ["Fierce", 12],
      ["Still", 5],
    ],
  },
  {
    type: "Size",
    values: [
      ["Tiny", 30],
      ["Small", 28],
      ["Mid", 22],
      ["Tall", 12],
      ["Huge", 4],
    ],
  },
];

function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function allocate(supply, pairs) {
  const totalW = pairs.reduce((sum, pair) => sum + pair[1], 0);
  const rows = pairs.map(([name, weight]) => {
    const exact = (supply * weight) / totalW;
    return { name, n: Math.floor(exact), frac: exact - Math.floor(exact) };
  });
  let left = supply - rows.reduce((sum, row) => sum + row.n, 0);
  const order = rows
    .map((row, index) => ({ index, frac: row.frac }))
    .sort((a, b) => b.frac - a.frac || a.index - b.index);
  for (let i = 0; i < order.length && left > 0; i += 1) {
    rows[order[i].index].n += 1;
    left -= 1;
  }
  if (left !== 0 || rows.some((row) => row.n < 1)) {
    throw new Error(`allocate failed for supply ${supply}`);
  }
  return rows.map((row) => [row.name, row.n]);
}

function shuffleBag(pairs, seed) {
  const bag = [];
  pairs.forEach(([name, count]) => {
    for (let i = 0; i < count; i += 1) bag.push(name);
  });
  const rng = mulberry32(seed);
  for (let i = bag.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = bag[i];
    bag[i] = bag[j];
    bag[j] = tmp;
  }
  return bag;
}

function rarityFromRank(rank, supply) {
  const p = rank / supply;
  if (p < 0.005) return "mythic";
  if (p < 0.03) return "legendary";
  if (p < 0.1) return "epic";
  if (p < 0.25) return "rare";
  if (p < 0.5) return "uncommon";
  return "common";
}

export function valueRarity(count, supply) {
  const p = count / supply;
  if (p <= 0.005) return "mythic";
  if (p <= 0.02) return "legendary";
  if (p <= 0.06) return "epic";
  if (p <= 0.12) return "rare";
  if (p <= 0.25) return "uncommon";
  return "common";
}

function traitValue(token, type) {
  return token.traits.find((trait) => trait.type === type)?.value || "";
}

function nameFor(token) {
  if (token.collection === "roms") {
    return `${traitValue(token, "Tier")} ${traitValue(token, "Faction")} ROM #${token.id}`;
  }
  if (token.collection === "glhfers") return `GLHFer #${token.id}`;
  return `${traitValue(token, "Kind")} Gigling #${token.id}`;
}

function buildCollection(collection, supply, defs, seed) {
  const columns = defs.map((def, index) => {
    const counts = allocate(supply, def.values);
    return {
      type: def.type,
      bag: shuffleBag(counts, seed + (index + 1) * 997),
      countMap: Object.fromEntries(counts),
      counts,
    };
  });
  const tokens = [];
  for (let id = 1; id <= supply; id += 1) {
    const traits = columns.map((column) => {
      const value = column.bag[id - 1];
      return { type: column.type, value, count: column.countMap[value] };
    });
    const score = traits.reduce((sum, trait) => sum + supply / trait.count, 0);
    tokens.push({ id, collection, supply, traits, score });
  }
  const ranked = tokens
    .map((token, index) => ({ token, index }))
    .sort((a, b) => b.token.score - a.token.score || a.token.id - b.token.id);
  ranked.forEach((row, rank) => {
    row.token.rank = rank + 1;
    row.token.rarity = rarityFromRank(rank, supply);
    row.token.name = nameFor(row.token);
  });
  return { tokens, columns };
}

let romCache = null;
let glhferCache = null;
let giglingCache = null;

export function romData() {
  if (!romCache) romCache = buildCollection("roms", ROM_SUPPLY, ROM_DEFS, SEED + 1);
  return romCache;
}

export function glhferData() {
  if (!glhferCache) glhferCache = buildCollection("glhfers", GLHFER_SUPPLY, GLHFER_DEFS, SEED + 2);
  return glhferCache;
}

export function giglingData() {
  if (!giglingCache) giglingCache = buildCollection("giglings", GIGLING_SUPPLY, GIGLING_DEFS, SEED + 3);
  return giglingCache;
}

export function allRoms() {
  return romData().tokens;
}

export function allGlhfers() {
  return glhferData().tokens;
}

export function allGiglings() {
  return giglingData().tokens;
}

const BY_COLLECTION = {
  roms: allRoms,
  glhfers: allGlhfers,
  giglings: allGiglings,
};

export function tokenById(collection, id) {
  const list = BY_COLLECTION[collection]();
  return list[id - 1];
}

export function baseTraitCounts() {
  const column = glhferData().columns.find((item) => item.type === "Base");
  return column.counts.map(([name, count]) => ({ name, count }));
}

export function romTraitOptions() {
  return {
    Tier: ROM_TIERS.map((tier) => tier.name),
    Faction: FACTION_ORDER,
    Memory: ROM_DEFS[2].values.map((row) => row[0]),
  };
}

export function spriteFor(token) {
  if (token.collection === "roms") return FACTION_ART[traitValue(token, "Faction")];
  if (token.collection === "glhfers") {
    if (token.id % 3 === 0) return EXPRESSIONS[(token.id - 1) % EXPRESSIONS.length];
    return HEADS[(token.id - 1) % HEADS.length];
  }
  return EXPRESSIONS[(token.id - 1) % EXPRESSIONS.length];
}

export function factionIcon(name) {
  return FACTION_ART[name] || "";
}

export function emblemIconFor(name) {
  const index = BASE_VALUES.findIndex((row) => row[0] === name);
  return EMBLEM_ART[index >= 0 ? index : 0];
}

export function medalPath(name) {
  return MEDALS[name] || MEDALS.Wood;
}

export function medalForTier(tier) {
  const names = { Holder: "Wood", Keeper: "Stone", Stack: "Copper", Vault: "Iron", Archive: "Gold" };
  return medalPath(names[tier] || "Wood");
}

export function medalForRank(rank) {
  if (rank <= 1) return MEDALS.Giga;
  if (rank <= 3) return MEDALS.Gold;
  if (rank <= 10) return MEDALS.Iron;
  if (rank <= 25) return MEDALS.Copper;
  return MEDALS.Stone;
}

export function medalForScore(score) {
  if (score >= 80) return MEDALS.Giga;
  if (score >= 60) return MEDALS.Iron;
  if (score >= 40) return MEDALS.Copper;
  return MEDALS.Wood;
}

export function placeholderSvg(token) {
  const color = RARITY[token.rarity].color;
  const x = 8 + (token.id % 18);
  const y = 36 + (token.id % 12);
  const r = 10 + (token.id % 7);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img"><rect width="64" height="64" fill="${color}"/><rect x="${x}" y="10" width="12" height="12" fill="#ffffff" fill-opacity="0.22"/><rect x="40" y="${y}" width="8" height="8" fill="#ffffff" fill-opacity="0.16"/><circle cx="32" cy="32" r="${r}" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function rarityMeta(id) {
  return RARITY[id];
}

export function barPercent(count, supply) {
  const rare = 1 - count / supply;
  return Math.max(8, Math.round(rare * 100));
}

export function clanMemberCount(tokenCount, holders) {
  const cap = Math.max(1, Math.floor(holders * 0.9));
  const raw = Math.max(1, Math.round(tokenCount * 0.64));
  return Math.min(tokenCount, cap, raw);
}

export function walletTier(total) {
  if (total >= 400) return "Archive";
  if (total >= 80) return "Vault";
  if (total >= 15) return "Stack";
  if (total >= 6) return "Keeper";
  return "Holder";
}

export function demoAddress() {
  return `0xDEMO${"0".repeat(32)}GLHF`;
}

export function fakeAddress(index) {
  const body = `FAKE${String(index).padStart(2, "0")}NOTLIVE`.padEnd(40, "0");
  return `0x${body}`;
}

export function pickDemoIds() {
  const glhfers = allGlhfers();
  const bestByBase = new Map();
  glhfers.forEach((token) => {
    const base = traitValue(token, "Base");
    const prev = bestByBase.get(base);
    if (!prev || token.rank < prev.rank) bestByBase.set(base, token);
  });
  const rareBases = [...bestByBase.values()].sort((a, b) => a.rank - b.rank).slice(0, 9);

  const roms = [...allRoms()].sort((a, b) => a.rank - b.rank);
  const romIndexes = [0, 1, 40, 180, 700, 1600, 3200];
  const gigs = [...allGiglings()].sort((a, b) => a.rank - b.rank);
  const gigIndexes = [0, 1, 24, 180];

  return {
    glhfers: rareBases.map((token) => token.id),
    roms: romIndexes.map((index) => roms[index].id),
    giglings: gigIndexes.map((index) => gigs[index].id),
  };
}

function hashDate(id, salt) {
  const rng = mulberry32((SEED ^ Math.imul(id, 997)) + salt);
  const start = Date.parse("2024-01-20T00:00:00Z");
  const end = Date.parse("2026-06-01T00:00:00Z");
  return new Date(start + Math.floor(rng() * (end - start))).toISOString().slice(0, 10);
}

export function demoHoldDates(ids) {
  const rows = [];
  ids.glhfers.forEach((id) => rows.push({ collection: "glhfers", id, firstHeld: hashDate(id, 11) }));
  ids.roms.forEach((id) => rows.push({ collection: "roms", id, firstHeld: hashDate(id, 29) }));
  ids.giglings.forEach((id) => rows.push({ collection: "giglings", id, firstHeld: hashDate(id, 47) }));
  rows.sort((a, b) => a.firstHeld.localeCompare(b.firstHeld));
  rows[0].firstHeld = "2024-02-02";
  return {
    glhfers: rows.filter((row) => row.collection === "glhfers"),
    roms: rows.filter((row) => row.collection === "roms"),
    giglings: rows.filter((row) => row.collection === "giglings"),
  };
}

export function collectorScore({ fullStack, emblems, pieces, earliest, snapshotDate = SNAPSHOT_DATE }) {
  const collectParts = {
    fullStack: fullStack ? 12 : 0,
    emblems: Math.round((emblems / 19) * 16),
    pieces: Math.min(12, Math.round(pieces * 0.5)),
  };
  const collect = collectParts.fullStack + collectParts.emblems + collectParts.pieces;
  const start = Date.parse(`${TENURE_ANCHOR}T00:00:00Z`);
  const end = Date.parse(`${snapshotDate}T00:00:00Z`);
  const first = Date.parse(`${earliest}T00:00:00Z`);
  const frac = (end - first) / (end - start);
  const tenure = Math.max(0, Math.min(30, Math.round(frac * 30)));
  return {
    collect,
    collectMax: 40,
    collectParts,
    tenure,
    tenureMax: 30,
    play: null,
    playMax: 15,
    participation: null,
    participationMax: 15,
    total: collect + tenure,
    max: 100,
  };
}

export function bucketize(sizes) {
  const buckets = [
    { label: "1", test: (n) => n === 1, holders: 0 },
    { label: "2–5", test: (n) => n >= 2 && n <= 5, holders: 0 },
    { label: "6–10", test: (n) => n >= 6 && n <= 10, holders: 0 },
    { label: "11–25", test: (n) => n >= 11 && n <= 25, holders: 0 },
    { label: "26+", test: (n) => n >= 26, holders: 0 },
  ];
  sizes.forEach((size) => {
    const bucket = buckets.find((item) => item.test(size));
    bucket.holders += 1;
  });
  return buckets.map(({ label, holders }) => ({ label, holders }));
}

export function spreadHolders(supply, holders, pinned, cap) {
  const fixed = pinned.filter((n) => n > 0);
  const restN = holders - fixed.length;
  const restS = supply - fixed.reduce((sum, n) => sum + n, 0);
  if (restN <= 0 || restS < restN) {
    throw new Error(`spread invalid restN=${restN} restS=${restS}`);
  }
  const extra = restS - restN;
  const maxExtra = restN * (cap - 1);
  if (extra > maxExtra) throw new Error(`extra ${extra} exceeds ${maxExtra}`);
  const arr = new Array(restN).fill(1);
  let left = extra;
  const phases = [
    { limit: Math.min(cap, 2), width: Math.ceil(restN * 0.46) },
    { limit: Math.min(cap, 4), width: Math.ceil(restN * 0.24) },
    { limit: Math.min(cap, 5), width: Math.ceil(restN * 0.12) },
    { limit: cap, width: Math.ceil(restN * 0.07) },
  ];
  const giveTo = (limit, width) => {
    for (let i = 0; i < width && left > 0; i += 1) {
      const room = limit - arr[i];
      if (room > 0) {
        const give = Math.min(room, left);
        arr[i] += give;
        left -= give;
      }
    }
  };
  phases.forEach((phase) => giveTo(phase.limit, phase.width));
  giveTo(cap, restN);
  if (left !== 0) throw new Error(`spread leftover ${left}`);
  return bucketize(fixed.concat(arr));
}

export function chooseHolderCount(supply, pinned, cap, targetAvg) {
  const fixed = pinned.filter((n) => n > 0);
  const sumP = fixed.reduce((sum, n) => sum + n, 0);
  let best = null;
  const maxH = supply - sumP + fixed.length;
  for (let holders = fixed.length + 1; holders <= maxH; holders += 1) {
    const restN = holders - fixed.length;
    const extra = supply - sumP - restN;
    const maxExtra = restN * (cap - 1);
    if (extra < 0 || extra > maxExtra) continue;
    const avg = supply / holders;
    if (!best || Math.abs(avg - targetAvg) < Math.abs(best.avg - targetAvg)) {
      best = { holders, avg };
    }
  }
  if (!best) throw new Error("no holder count fits");
  return best;
}
