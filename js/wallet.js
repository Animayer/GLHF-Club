import { rootPrefix } from "./paths.js";
import { baseTraitCounts, collectorScore, tokenById } from "./model.js";

export async function loadSnapshot() {
  const response = await fetch(`${rootPrefix()}data/snapshot.json`);
  if (!response.ok) throw new Error(`Snapshot request failed (${response.status})`);
  return response.json();
}

export function heldMap(snapshot) {
  const map = new Map();
  ["glhfers", "roms", "giglings"].forEach((collection) => {
    snapshot.wallet[collection].forEach((row) => {
      map.set(`${collection}:${row.id}`, row.firstHeld);
    });
  });
  return map;
}

export function resolveWallet(snapshot) {
  const groups = {};
  ["glhfers", "roms", "giglings"].forEach((collection) => {
    groups[collection] = snapshot.wallet[collection]
      .map((row) => ({ ...tokenById(collection, row.id), firstHeld: row.firstHeld }))
      .sort((a, b) => a.rank - b.rank || b.score - a.score);
  });
  const all = [...groups.glhfers, ...groups.roms, ...groups.giglings];
  const ranked = [...all].sort((a, b) => a.rank / a.supply - b.rank / b.supply || b.score - a.score);
  const earned = new Set(groups.glhfers.map((token) => token.traits.find((trait) => trait.type === "Base").value));
  const emblems = baseTraitCounts().map((row) => ({ ...row, earned: earned.has(row.name) }));
  const earliest = all.map((token) => token.firstHeld).sort()[0];
  const earnedCount = emblems.filter((row) => row.earned).length;
  const fullStack = groups.glhfers.length > 0 && groups.roms.length > 0 && groups.giglings.length > 0;
  return {
    address: snapshot.wallet.address,
    rank: snapshot.wallet.rank,
    groups,
    all,
    slots: {
      glhfers: groups.glhfers.slice(0, 2),
      roms: groups.roms.slice(0, 2),
      giglings: groups.giglings.slice(0, 2),
    },
    emblems,
    earnedCount,
    earliest,
    rarest: ranked[0],
    top: ranked.slice(0, 3),
    score: collectorScore({
      fullStack,
      emblems: earnedCount,
      pieces: all.length,
      earliest,
      snapshotDate: snapshot.snapshotDate,
    }),
    fullStack,
    portrait: groups.glhfers[0],
  };
}
