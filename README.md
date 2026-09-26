# GLHF Club

Clickable prototype for a collector hub covering GLHFers, Gigaverse ROMs, and Giglings.

Live: https://animayer.github.io/GLHF-Club/

The page is a fixed snapshot of one demo wallet, dated 17 Jul 2026. There is no backend, login, wallet connect, or chain access. ROM supply is 10,000 (Silver 5,800, Gold 3,200, Void 850, Giga 150). 225 wallets hold all three collections. Every other figure is generated sample data and marked on the page.

## Routes

- `/` home
- `/loadout/` Giga Loadout
- `/explorer/roms/` ROM explorer (filter state lives in the query string)
- `/stats/`
- `/clans/`
- `/leaderboard/`
- `/drops/`

Paths are relative so the site works under the `/GLHF-Club/` GitHub Pages base. `node scripts/build-snapshot.mjs` regenerates `data/snapshot.json` from the seeded model in `js/model.js` (seed `20260717`). The site itself does not need a build step.

Art in `assets/` is reused from the public GLHF-Collector-Hub repository. Token plates are rarity-coloured SVGs drawn in the page.
