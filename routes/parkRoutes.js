const express = require("express");
const { ThemeParks } = require("themeparks");

const router = express.Router();
const tp = new ThemeParks();

// Destination slug → array of [routeKey, nameSubstring] pairs for child park matching
const DESTINATION_PARKS = [
  [
    "waltdisneyworld",
    [
      ["magickingdom", "Magic Kingdom"],
      ["epcot", "EPCOT"],
      ["hollywoodstudios", "Hollywood Studios"],
      ["animalkingdom", "Animal Kingdom"],
    ],
  ],
  [
    "disneylandresort",
    [
      ["disneyland", "Disneyland Park"],
      ["californiaadventure", "California Adventure"],
    ],
  ],
  [
    "universalorlando",
    [["universalstudiosflorida", "Universal Studios Florida"]],
  ],
];

// parkIds maps routeKey → UUID, populated at startup
const parkIds = {};

async function initParks() {
  for (const [slug, parks] of DESTINATION_PARKS) {
    const dest = await tp.destinations.find(slug);
    if (!dest) {
      console.warn(`[parkRoutes] Destination not found: ${slug}`);
      continue;
    }
    const children = await tp.raw.getEntityChildren(dest.id);
    const parkEntities = (children.children ?? []).filter(
      (c) => c.entityType === "PARK"
    );
    for (const [routeKey, nameMatch] of parks) {
      const match = parkEntities.find((p) =>
        p.name.toLowerCase().includes(nameMatch.toLowerCase())
      );
      if (match) {
        parkIds[routeKey] = match.id;
      } else {
        console.warn(
          `[parkRoutes] Park not found for "${nameMatch}" in ${slug}`
        );
      }
    }
  }
  console.log("[parkRoutes] Park IDs resolved:", parkIds);
}

// Run init at module load; if it fails the routes return 503
const ready = initParks().catch((err) =>
  console.error("[parkRoutes] Init failed:", err)
);

function requirePark(routeKey, res) {
  const id = parkIds[routeKey];
  if (!id) {
    res.status(503).json({ error: `Park not available: ${routeKey}` });
    return null;
  }
  return id;
}

// ── Response normalizer ──────────────────────────────────────────────────────

const STATUS_MAP = {
  OPERATING: "Operating",
  CLOSED: "Closed",
  REFURBISHMENT: "Refurbishment",
  DOWN: "Down",
};

const TYPE_MAP = {
  ATTRACTION: "ATTRACTION",
  RESTAURANT: "RESTAURANT",
  SHOP: "STORE",
  SHOW: "ATTRACTION",
};

function normalizeLiveEntry(entry) {
  const returnTime =
    entry.queue?.RETURN_TIME ?? entry.queue?.PAID_RETURN_TIME ?? null;
  return {
    id: entry.id,
    name: entry.name,
    waitTime: entry.queue?.STANDBY?.waitTime ?? null,
    status: STATUS_MAP[entry.status] ?? entry.status,
    meta: {
      type: TYPE_MAP[entry.entityType] ?? "ATTRACTION",
      singleRider: !!(entry.queue?.SINGLE_RIDER),
      returnTime: returnTime
        ? { state: returnTime.state, returnStart: returnTime.returnStart, returnEnd: returnTime.returnEnd }
        : null,
    },
  };
}

// ── Wait times ──────────────────────────────────────────────────────────────

router.get("/magickingdom-waittimes", async (req, res) => {
  await ready;
  const id = requirePark("magickingdom", res);
  if (!id) return;
  try {
    const live = await tp.entity(id).live();
    res.json((live.liveData ?? []).map(normalizeLiveEntry));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.get("/epcot-waittimes", async (req, res) => {
  await ready;
  const id = requirePark("epcot", res);
  if (!id) return;
  try {
    const live = await tp.entity(id).live();
    res.json((live.liveData ?? []).map(normalizeLiveEntry));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.get("/hollywoodstudios-waittimes", async (req, res) => {
  await ready;
  const id = requirePark("hollywoodstudios", res);
  if (!id) return;
  try {
    const live = await tp.entity(id).live();
    res.json((live.liveData ?? []).map(normalizeLiveEntry));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.get("/animalkingdom-waittimes", async (req, res) => {
  await ready;
  const id = requirePark("animalkingdom", res);
  if (!id) return;
  try {
    const live = await tp.entity(id).live();
    res.json((live.liveData ?? []).map(normalizeLiveEntry));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.get("/disneyland-waittimes", async (req, res) => {
  await ready;
  const id = requirePark("disneyland", res);
  if (!id) return;
  try {
    const live = await tp.entity(id).live();
    res.json((live.liveData ?? []).map(normalizeLiveEntry));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.get("/californiaadventure-waittimes", async (req, res) => {
  await ready;
  const id = requirePark("californiaadventure", res);
  if (!id) return;
  try {
    const live = await tp.entity(id).live();
    res.json((live.liveData ?? []).map(normalizeLiveEntry));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.get("/universalstudiosflorida-waittimes", async (req, res) => {
  await ready;
  const id = requirePark("universalstudiosflorida", res);
  if (!id) return;
  try {
    const live = await tp.entity(id).live();
    res.json((live.liveData ?? []).map(normalizeLiveEntry));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// ── Park hours ───────────────────────────────────────────────────────────────

function scheduleRange(id) {
  const today = new Date();
  const week = new Date(today);
  week.setDate(week.getDate() + 7);
  return tp.entity(id).schedule.range(today, week);
}

router.get("/magickingdom-parkhours", async (req, res) => {
  await ready;
  const id = requirePark("magickingdom", res);
  if (!id) return;
  try {
    res.json(await scheduleRange(id));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.get("/epcot-parkhours", async (req, res) => {
  await ready;
  const id = requirePark("epcot", res);
  if (!id) return;
  try {
    res.json(await scheduleRange(id));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.get("/hollywoodstudios-parkhours", async (req, res) => {
  await ready;
  const id = requirePark("hollywoodstudios", res);
  if (!id) return;
  try {
    res.json(await scheduleRange(id));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.get("/animalkingdom-parkhours", async (req, res) => {
  await ready;
  const id = requirePark("animalkingdom", res);
  if (!id) return;
  try {
    res.json(await scheduleRange(id));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.get("/disneyland-parkhours", async (req, res) => {
  await ready;
  const id = requirePark("disneyland", res);
  if (!id) return;
  try {
    res.json(await scheduleRange(id));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.get("/californiaadventure-parkhours", async (req, res) => {
  await ready;
  const id = requirePark("californiaadventure", res);
  if (!id) return;
  try {
    res.json(await scheduleRange(id));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.get("/universalstudiosflorida-parkhours", async (req, res) => {
  await ready;
  const id = requirePark("universalstudiosflorida", res);
  if (!id) return;
  try {
    res.json(await scheduleRange(id));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
