import { writeFileSync } from "node:fs";
import {
  FULL_STACK_WALLETS,
  GLHFER_SUPPLY,
  GIGLING_SUPPLY,
  ROM_SUPPLY,
  ROM_TIERS,
  SNAPSHOT_DATE,
  SEED,
  allGiglings,
  allGlhfers,
  allRoms,
  baseTraitCounts,
  chooseHolderCount,
  clanMemberCount,
  collectorScore,
  demoAddress,
  demoHoldDates,
  fakeAddress,
  pickDemoIds,
  spreadHolders,
  tokenById,
  walletTier,
} from "../js/model.js";

function counts(tokens, type) {
  const map = new Map();
  tokens.forEach((token) => {
    const value = token.traits.find((trait) => trait.type === type).value;
    map.set(value, (map.get(value) || 0) + 1);
  });
  return map;
}

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

const roms = allRoms();
const glhfers = allGlhfers();
const giglings = allGiglings();

assert(roms.length === 10000, "rom supply");
assert(glhfers.length === GLHFER_SUPPLY, "glhfer supply");
assert(giglings.length === GIGLING_SUPPLY, "gigling supply");

const tierCounts = counts(roms, "Tier");
ROM_TIERS.forEach((tier) => assert(tierCounts.get(tier.name) === tier.count, `${tier.name} count`));
assert([...counts(roms, "Faction").values()].reduce((a, b) => a + b, 0) === 10000, "faction sum");
assert([...counts(roms, "Memory").values()].reduce((a, b) => a + b, 0) === 10000, "memory sum");
assert(baseTraitCounts().length === 19, "19 bases");
assert(baseTraitCounts().reduce((sum, row) => sum + row.count, 0) === GLHFER_SUPPLY, "base sum");

const rarityTally = roms.reduce((map, token) => {
  map[token.rarity] = (map[token.rarity] || 0) + 1;
  return map;
}, {});
console.log("ROM rarity", rarityTally);

const ids = pickDemoIds();
const dated = demoHoldDates(ids);
const held = ["glhfers", "roms", "giglings"].flatMap((collection) =>
  dated[collection].map((row) => ({ ...tokenById(collection, row.id), firstHeld: row.firstHeld })),
);
const bases = new Set(
  held
    .filter((token) => token.collection === "glhfers")
    .map((token) => token.traits.find((trait) => trait.type === "Base").value),
);
assert(bases.size === 9, `expected 9 emblems, got ${bases.size}`);
const earliest = held.map((token) => token.firstHeld).sort()[0];
assert(earliest === "2024-02-02", earliest);
const pieces = held.length;
const score = collectorScore({
  fullStack: true,
  emblems: bases.size,
  pieces,
  earliest,
});
assert(score.collect <= 40 && score.tenure <= 30 && score.total < 100, JSON.stringify(score));
console.log("demo pieces", pieces, "emblems", bases.size, "score", score, "earliest", earliest);
console.log(
  "rarest",
  [...held].sort((a, b) => a.rank / a.supply - b.rank / b.supply).slice(0, 3).map((token) => [token.name, token.rarity, token.rank]),
);

const demo = {
  glhfers: dated.glhfers.length,
  roms: dated.roms.length,
  giglings: dated.giglings.length,
};
const whales = [
  { glhfers: 64, roms: 360, giglings: 120 },
  { glhfers: 32, roms: 220, giglings: 90 },
  { glhfers: 96, roms: 110, giglings: 0 },
  { glhfers: 18, roms: 80, giglings: 80 },
  { glhfers: 24, roms: 50, giglings: 0 },
  { glhfers: 12, roms: 28, giglings: 40 },
];

function splitTotal(total, index) {
  if (total === 1) return { glhfers: 1, roms: 0, giglings: 0 };
  const mode = index % 5;
  if (mode === 0) return { glhfers: total, roms: 0, giglings: 0 };
  if (mode === 1) return { glhfers: 0, roms: total, giglings: 0 };
  if (mode === 2) return { glhfers: Math.ceil(total / 2), roms: Math.floor(total / 2), giglings: 0 };
  if (mode === 3) {
    const a = Math.max(1, Math.floor(total / 3));
    const b = Math.max(1, Math.floor((total - a) / 2));
    return { glhfers: a, roms: b, giglings: total - a - b };
  }
  return { glhfers: 1, roms: Math.max(0, total - 2), giglings: total > 1 ? 1 : 0 };
}

const tailTotals = [];
for (let n = 19; n >= 8; n -= 1) tailTotals.push(n);
while (tailTotals.length < 18) tailTotals.push(8);
const tail = tailTotals.map((total, index) => splitTotal(total, index));

const address = demoAddress();
assert(address.length === 42, `address length ${address.length} ${address}`);

const rows = [
  ...whales.map((row) => ({ ...row, address: null })),
  { ...demo, address },
  ...tail.map((row) => ({ ...row, address: null })),
];
rows.forEach((row) => {
  row.total = row.glhfers + row.roms + row.giglings;
  row.fullStack = row.glhfers > 0 && row.roms > 0 && row.giglings > 0;
});
rows.sort((a, b) => b.total - a.total || b.roms - a.roms);
assert(rows.length === 25, "leaderboard length");
let fakeN = 1;
rows.forEach((row, index) => {
  row.rank = index + 1;
  if (!row.address) {
    row.address = fakeAddress(fakeN);
    fakeN += 1;
    assert(row.address.length === 42, row.address);
  }
  row.tier = walletTier(row.total);
});
const demoRow = rows.find((row) => row.address === address);
assert(demoRow, "demo missing from board");
console.log("demo rank", demoRow.rank, "tier", demoRow.tier, "total", demoRow.total);

const cap = rows[rows.length - 1].total;
console.log("tail cap", cap);

function collectionStats(key, supply, sampleSupply, targetAvg) {
  const pinned = rows.map((row) => row[key]);
  const chosen = chooseHolderCount(supply, pinned, cap, targetAvg);
  const distribution = spreadHolders(supply, chosen.holders, pinned, cap);
  const top10 = pinned.filter((n) => n > 0).sort((a, b) => b - a).slice(0, 10);
  const top10Pieces = top10.reduce((sum, n) => sum + n, 0);
  assert(distribution.reduce((sum, bucket) => sum + bucket.holders, 0) === chosen.holders, key);
  return {
    holders: chosen.holders,
    avg: Number((supply / chosen.holders).toFixed(2)),
    top10Share: Number((top10Pieces / supply).toFixed(4)),
    top10Pieces,
    distribution,
    chosenAvg: Number(chosen.avg.toFixed(3)),
  };
}

const glhferStats = collectionStats("glhfers", GLHFER_SUPPLY, true, 2.6);
const romStats = collectionStats("roms", ROM_SUPPLY, false, 2.2);
const gigStats = collectionStats("giglings", GIGLING_SUPPLY, true, 2.4);
console.log("holders", glhferStats, romStats, gigStats);

for (const [stats, supply] of [
  [glhferStats, GLHFER_SUPPLY],
  [romStats, ROM_SUPPLY],
  [gigStats, GIGLING_SUPPLY],
]) {
  assert(stats.holders >= FULL_STACK_WALLETS, "holders below full stack");
  assert(stats.top10Pieces < supply, "top 10 exceeds supply");
}

const basesRows = baseTraitCounts();
basesRows.forEach((row) => {
  const members = clanMemberCount(row.count, glhferStats.holders);
  assert(members >= 1 && members <= row.count && members <= glhferStats.holders, `${row.name} members ${members}`);
});

function pairCount(a, b, desired) {
  const value = Math.min(Math.min(a, b), Math.max(FULL_STACK_WALLETS, desired));
  assert(value >= FULL_STACK_WALLETS, "pair below 225");
  return value;
}

const overlaps = {
  glhfersRoms: pairCount(glhferStats.holders, romStats.holders, 612),
  glhfersGiglings: pairCount(glhferStats.holders, gigStats.holders, 448),
  romsGiglings: pairCount(romStats.holders, gigStats.holders, 736),
  allThree: FULL_STACK_WALLETS,
};

const snapshot = {
  snapshotDate: SNAPSHOT_DATE,
  seed: SEED,
  fullStackWallets: FULL_STACK_WALLETS,
  wallet: {
    address,
    rank: demoRow.rank,
    glhfers: dated.glhfers,
    roms: dated.roms,
    giglings: dated.giglings,
  },
  collections: {
    glhfers: {
      name: "GLHFers",
      chain: "Ethereum",
      supply: GLHFER_SUPPLY,
      supplySample: true,
      holders: glhferStats.holders,
      avg: glhferStats.avg,
      top10Share: glhferStats.top10Share,
      distribution: glhferStats.distribution,
    },
    roms: {
      name: "ROMs",
      chain: "Abstract",
      supply: ROM_SUPPLY,
      supplySample: false,
      tiers: ROM_TIERS.map((tier) => ({ name: tier.name, count: tier.count, sample: false })),
      holders: romStats.holders,
      avg: romStats.avg,
      top10Share: romStats.top10Share,
      distribution: romStats.distribution,
    },
    giglings: {
      name: "Giglings",
      chain: "Abstract",
      supply: GIGLING_SUPPLY,
      supplySample: true,
      holders: gigStats.holders,
      avg: gigStats.avg,
      top10Share: gigStats.top10Share,
      distribution: gigStats.distribution,
    },
  },
  overlaps,
  leaderboard: rows.map((row) => ({
    rank: row.rank,
    address: row.address,
    glhfers: row.glhfers,
    roms: row.roms,
    giglings: row.giglings,
    total: row.total,
    fullStack: row.fullStack,
    tier: row.tier,
    demo: row.address === address,
  })),
  communities: [
    {
      name: "Disciples of Gigus",
      art: "assets/factions/gigus1x1.png",
      note: "Placeholder community. Member list is not in this snapshot.",
    },
    {
      name: "Auctioneer's Henchmen",
      art: "assets/gifs/Auctioneer.gif",
      note: "Placeholder community. Member list is not in this snapshot.",
    },
  ],
};

writeFileSync(new URL("../data/snapshot.json", import.meta.url), `${JSON.stringify(snapshot, null, 2)}\n`);
console.log("wrote data/snapshot.json");
console.log("overlaps", overlaps);
