/* ============================================================
   LOCATIONS REGISTRY  (multi-tenant)
   ------------------------------------------------------------
   The single source of truth for every store the app serves.
   Each location has its own kitchen (KDS) screen, its own
   counter (cashier) screen, its own order-number sequence,
   its own tax rate, and optional per-location menu overrides.

   This file is dual-context: it works as a <script> in the
   browser (sets window.LOCATIONS / window.LOC) AND as a Node
   module (require("./locations")) so the server shares the
   exact same registry — no drift between client and server.

   Add a store: copy a block below, give it a unique `id`
   (used in URLs as ?loc=<id>) and adjust name/tax/menu.
   ============================================================ */

(function (root) {
  "use strict";

  /* Per-location menu overrides:
       unavailable: [itemId, …]   → hidden at this store
       price: { itemId: number }  → price differs at this store
     Anything not listed inherits the base menu in data.js. */
  const LOCATIONS = [
    {
      id: "ird",
      name: "In-Room Dining",
      address: "Al Manzil Hotel Bahrain",
      taxRate: 0,          // printed prices already include service, levy and VAT
      seat: "Room",        // QR codes and tickets say "Room 204", not "Table 204"
      theme: "ird",        // cream + bronze, from the in-room dining menu
      art: "plate",
      logo: "logo-manzil.png",
      hero: "media/ird-breakfast.jpg",
      // photos from the printed in-room dining menu, shown as section banners
      sections: {
        allday24: "media/ird-roast.jpg", breakfast: "media/ird-breakfast.jpg", soups: "media/ird-soup.jpg",
        appetizers: "media/ird-fried.jpg", pizza: "media/ird-pizza.jpg", mains: "media/ird-steak.jpg",
        tandoor: "media/ird-tandoori.jpg", biryani: "media/ird-biryani.jpg", desserts: "media/ird-cake.jpg",
      },
      lede: "Fresh from our kitchen to your room — breakfast 7:00–10:30 AM, all-day dining 12 PM – 2 AM, and a 24-hour menu around the clock.",
      tags: ["🛎️ Delivered to your room", "🕐 24-hour menu", "🌿 Allergens marked"],
      menu: {},
    },
    {
      id: "elixir",
      name: "Elixir Lounge",
      address: "Al Manzil Hotel Bahrain",
      taxRate: 0,
      seat: "Room",        // the Elixir QR code also sits in each room: drinks are delivered
      theme: "elixir",     // dark olive + wine, from the beverages menu
      art: "glass",
      logo: "logo-elixir.png",
      // drop the lounge's Instagram reel here (MP4, muted loop); the olive backdrop shows until then
      heroVideo: "media/elixir-hero.mp4",
      sections: {},
      lede: "Signature cocktails, fine spirits and wines from Elixir Lounge — order from your room and we'll bring it up.",
      tags: ["🛎️ Delivered to your room", "🍸 Signature cocktails", "🍷 Wine & champagne"],
      instagram: "https://www.instagram.com/elixir_bahrain/",
      menu: {},
    },
  ];

  const DEFAULT_LOCATION = LOCATIONS[0].id;
  const byId = {};
  LOCATIONS.forEach((l) => (byId[l.id] = l));

  /* ---------- lookups ---------- */
  function getLocation(id) {
    return byId[id] || null;
  }
  function isValidLocation(id) {
    return !!byId[id];
  }
  function listLocations() {
    return LOCATIONS.map((l) => ({ id: l.id, name: l.name, address: l.address, taxRate: l.taxRate, seat: l.seat || "Table" }));
  }

  /* ---------- per-location menu resolution ----------
     Given the shared base menu (from data.js) and a location,
     returns the menu this store actually offers: unavailable
     items removed, overridden prices applied. Used identically
     on the client (for display) and the server (for pricing). */
  function resolveMenu(baseMenu, loc) {
    const ov = (loc && loc.menu) || {};
    const hidden = new Set(ov.unavailable || []);
    const priceOv = ov.price || {};
    return baseMenu
      .filter((m) => !hidden.has(m.id))
      .map((m) => (priceOv[m.id] != null ? Object.assign({}, m, { price: priceOv[m.id] }) : m));
  }

  /* Build a quick { itemId: {name, price} } lookup the server
     trusts when pricing an incoming order for a location. */
  function priceTable(baseMenu, loc) {
    const table = {};
    resolveMenu(baseMenu, loc).forEach((m) => (table[m.id] = { name: m.name, price: m.price }));
    return table;
  }

  const api = {
    LOCATIONS,
    DEFAULT_LOCATION,
    getLocation,
    isValidLocation,
    listLocations,
    resolveMenu,
    priceTable,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.LOCATIONS = LOCATIONS;
    root.LOC_API = api;
  }
})(typeof self !== "undefined" ? self : globalThis);
