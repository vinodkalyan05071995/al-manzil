/* ============================================================
   AL MANZIL — customer ordering app (in-room dining + Elixir Lounge)
   - Reads ?loc=<store>&table=N from the QR URL (N is a room at in-room dining)
   - Renders menu, cart drawer, order placement
   - Persists cart per-table + order history in localStorage
   ============================================================ */

(function () {
  "use strict";

  /* ---------- location + table context from QR url ----------
     QR codes encode ?loc=<store>&table=<n>. An unknown/missing
     loc falls back to the default store so the page still works. */
  const params = new URLSearchParams(location.search);
  const api = window.LOC_API;
  const STORE = api.getLocation(params.get("loc")) || api.getLocation(api.DEFAULT_LOCATION);
  const LOC = STORE.id;
  const TAX_RATE = STORE.taxRate;
  const taxPct = parseFloat((TAX_RATE * 100).toFixed(4)); // e.g. 8, 8.875, 7
  const SEAT = STORE.seat || "Table"; // "Room" for in-room dining
  const IS_ROOM = SEAT === "Room";
  document.body.dataset.theme = STORE.theme || "";

  /* menu + collections for this store — loaded from the catalog API on boot,
     so anything edited in the admin dashboard shows up here. */
  let MENU = [];
  let CATEGORIES = [];

  const rawTable = params.get("table");
  const TABLE = rawTable ? String(rawTable).replace(/[^0-9A-Za-z]/g, "").slice(0, 4) : null;
  const isCounter = !TABLE;

  // cart is scoped per store + table so different locations never share a basket
  const CART_KEY = "nw_cart_" + LOC + "_" + (TABLE || "counter");

  /* ---------- SVG placeholder art per tone ---------- */
  const CUP = `<svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.95)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9h12v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><path d="M17 10h2.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 5c0-1 1-1 1-2M12 5c0-1 1-1 1-2M16 5c0-1 1-1 1-2" opacity=".8"/></svg>`;
  const GLASS = `<svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.95)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h12l-1.4 16H7.4z"/><path d="M6.6 9h10.8" opacity=".7"/></svg>`;
  const PLATE = `<svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.95)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5" opacity=".7"/></svg>`;
  const toneArt = { cold: GLASS, berry: GLASS, green: GLASS, wheat: PLATE, cream: CUP };
  // escape user-entered text so product names/descriptions can't break the HTML
  const esc = (s) => String(s == null ? "" : s).replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));

  function placeholder(item) {
    const art = STORE.art === "glass" ? GLASS : STORE.art === "plate" ? PLATE : toneArt[item.tone] || CUP;
    return `<div class="ph" style="background:var(--tone-${esc(item.tone)})">${art}</div>`;
  }
  // render the gradient placeholder, with the real photo layered on top if present;
  // if the photo fails to load it simply removes itself and the placeholder shows.
  function media(item) {
    const ph = placeholder(item);
    if (item.image) return ph + `<img src="${esc(item.image)}" alt="${esc(item.name)}" loading="lazy" onerror="this.remove()">`;
    return ph;
  }

  /* ---------- allergen icons (same set + legend as the printed in-room menu) ---------- */
  const ALLERGEN_SVG = {
    v: `<path d="M5 19C5 10 11 5 20 5c0 9-5 14-14 14z" fill="#66bb6a"/><path d="M5 19 14 10" stroke="#2e7d32" stroke-width="1.4" stroke-linecap="round"/>`,
    g: `<path d="M12 22V7" stroke="#c98a26" stroke-width="1.6" stroke-linecap="round"/><g fill="#e8a53a"><ellipse cx="12" cy="4.6" rx="1.7" ry="2.7"/><ellipse cx="9.4" cy="9" rx="1.8" ry="3" transform="rotate(-32 9.4 9)"/><ellipse cx="14.6" cy="9" rx="1.8" ry="3" transform="rotate(32 14.6 9)"/><ellipse cx="9.4" cy="13.6" rx="1.8" ry="3" transform="rotate(-32 9.4 13.6)"/><ellipse cx="14.6" cy="13.6" rx="1.8" ry="3" transform="rotate(32 14.6 13.6)"/></g>`,
    d: `<path d="M8 8l2-5h4l2 5v13H8z" fill="#55bde0"/><path d="M8 8h8" stroke="#2f8fb3" stroke-width="1.2"/><rect x="9.6" y="11.5" width="4.8" height="6" rx="1" fill="#fff" opacity=".9"/>`,
    e: `<ellipse cx="12" cy="13" rx="6" ry="8" fill="#eef1f5" stroke="#c4cad3" stroke-width="1.2"/>`,
    s: `<path d="M12 20c-5 0-8-3.6-8-7.8a8 8 0 0 1 16 0C20 16.4 17 20 12 20z" fill="#f4b04f"/><path d="M12 20V5.5M12 20 7.2 7.5M12 20l4.8-12.5M12 20 4.4 11.5M12 20l7.6-8.5" stroke="#d4842a" stroke-width="1.1"/>`,
    n: `<path d="M12 3c3 0 4.6 2.4 4.1 5-.3 1.6-1.7 2.4-1.7 4s1.7 2.6 1.7 4.6c0 2.8-1.9 4.4-4.1 4.4s-4.1-1.6-4.1-4.4c0-2 1.7-3 1.7-4.6S8.2 9.6 7.9 8C7.4 5.4 9 3 12 3z" fill="#e0a65a" stroke="#b97a33" stroke-width="1"/>`,
    h: `<path d="M15.5 7C14.6 12.8 11.4 17.6 5 19.6c0 0 1.2 2 4.3 1 6-2 9-8 8-13.6z" fill="#e53935"/><path d="M15.6 7c0-2 1.2-3.2 3.2-3.2" stroke="#43a047" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  };
  const ALLERGENS = window.ALLERGENS || [];
  const allergenLabel = (id) => (ALLERGENS.find((a) => a.id === id) || {}).label || id;
  const allergenIcon = (id) => ALLERGEN_SVG[id] ? `<svg viewBox="0 0 24 24" aria-hidden="true">${ALLERGEN_SVG[id]}</svg>` : "";
  function tagIcons(tags) {
    if (!tags || !tags.length) return "";
    return `<div class="tags">${tags.map((t) =>
      `<span class="tag" title="${esc(allergenLabel(t))}" aria-label="${esc(allergenLabel(t))}">${allergenIcon(t)}</span>`).join("")}</div>`;
  }
  // legend only appears when this store's menu actually uses allergen tags
  function renderLegend() {
    const el = document.getElementById("allergenLegend");
    if (!el) return;
    if (!MENU.some((m) => m.tags && m.tags.length)) { el.hidden = true; return; }
    el.hidden = false;
    el.innerHTML = `<h3>Allergen guide <span>دليل مسببات الحساسية</span></h3>
      <ul>${ALLERGENS.map((a) => `<li>${allergenIcon(a.id)}<b>${esc(a.label)}</b><span>${esc(a.ar)}</span></li>`).join("")}</ul>
      <p>Please inform our staff of any allergies or dietary requirements. Some dishes may contain traces of allergens.</p>
      <p class="ar">يرجى إبلاغ فريق العمل في حال وجود أي حساسية غذائية أو متطلبات خاصة. قد تحتوي بعض الأطباق على آثار من مسببات الحساسية.</p>`;
  }

  /* ---------- store header: logo, intro, tags, links (per store) ---------- */
  (function renderStoreHeader() {
    const other = api.LOCATIONS.find((l) => l.id !== LOC);
    const logo = STORE.logo || "logo.png";
    ["appbarLogo", "storeLogo"].forEach((id) => { const im = document.getElementById(id); if (im) { im.src = logo; im.alt = STORE.name; } });
    document.getElementById("storeName").textContent = STORE.name;
    // hero: outlet photo, or its video once the file exists (missing video just keeps the backdrop)
    const hero = document.getElementById("hero");
    if (STORE.hero) { hero.style.backgroundImage = `url('${STORE.hero}')`; hero.classList.add("has-media"); }
    if (STORE.heroVideo) {
      const v = document.getElementById("heroVideo");
      v.addEventListener("loadeddata", () => { v.hidden = false; hero.classList.add("has-media"); v.play().catch(() => {}); });
      v.src = STORE.heroVideo;
    }
    document.getElementById("storePlace").textContent = STORE.address || "Al Manzil Hotel";
    if (STORE.lede) document.getElementById("heroLede").textContent = STORE.lede;
    document.getElementById("storeTags").innerHTML = (STORE.tags || []).map((t) => `<span>${esc(t)}</span>`).join("");
    const ig = document.getElementById("igLink");
    if (STORE.instagram) { ig.href = STORE.instagram; ig.hidden = false; }
    const sw = document.getElementById("switchLink");
    if (other) { sw.href = "index.html?loc=" + encodeURIComponent(other.id); document.getElementById("switchText").textContent = other.name; }
    else sw.hidden = true;
    ["staffKds", "staffCashier"].forEach((id) => { const a = document.getElementById(id); if (a) a.href += "?loc=" + encodeURIComponent(LOC); });
  })();

  /* ---------- state ---------- */
  let cart = load(CART_KEY) || {}; // { itemId: qty }
  let orderType = isCounter ? "counter" : "table";

  function load(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }
  function save() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
  const fmt = (n) => "BHD " + (Number(n) || 0).toFixed(3);
  const itemById = (id) => MENU.find((m) => m.id === id);

  /* ---------- table chip / context ---------- */
  const chip = document.getElementById("tableChip");
  const chipText = document.getElementById("tableChipText");
  if (isCounter) {
    chip.classList.add("counter");
    chipText.textContent = "Counter Pickup";
    chip.querySelector("svg").outerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 10h18M5 10v9h14v-9M9 19v-5h6v5"/></svg>`;
  } else {
    chipText.textContent = SEAT + " " + TABLE;
  }
  document.getElementById("drawerContext").textContent =
    STORE.name + (isCounter ? " · Counter pickup" : IS_ROOM ? " · Delivering to Room " + TABLE : " · Serving Table " + TABLE);
  document.title = "Al Manzil — " + STORE.name;
  const otTable = document.getElementById("otTable");
  if (otTable) otTable.textContent = isCounter ? "Unavailable" : SEAT + " " + TABLE;
  if (IS_ROOM) {
    document.getElementById("otLabel").textContent = "Bring to my room";
    document.getElementById("ptLaterLabel").textContent = "Charge to room";
  }
  if (isCounter) {
    document.getElementById("heroLede").textContent =
      "Order ahead and skip the line — build your order here, then pick it up warm at the counter. Sitting down? Scan the QR code on your table to have it brought over.";
  }

  /* ---------- spotlight (a featured item, picked after catalog loads) ---------- */
  function renderSpotlight() {
    const spot = itemById("campfire-mocha") || MENU.find((m) => m.cat === "featured") || MENU[0];
    const ph = document.getElementById("spotlightPh");
    if (!spot || !ph) return;
    ph.outerHTML = media(spot, true).replace('class="ph"', 'class="ph" id="spotlightPh"');
    const sp = document.querySelector(".spotlight .ph, .spotlight img");
    if (sp) { sp.style.position = "absolute"; sp.style.inset = 0; sp.style.width = "100%"; sp.style.height = "100%"; }
    const label = document.querySelector(".spotlight-label");
    if (label) {
      const n = label.querySelector(".n"), p = label.querySelector(".p");
      if (n) n.textContent = spot.name;
      if (p) p.textContent = fmt(spot.price);
    }
  }

  /* ---------- category nav + menu (rendered once the catalog is loaded) ---------- */
  const catnav = document.getElementById("catnav");
  const menuRoot = document.getElementById("menuRoot");
  const visibleCats = () => CATEGORIES.filter((c) => MENU.some((m) => m.cat === c.id));

  function renderMenu() {
    const cats = visibleCats();
    catnav.innerHTML = cats.map(
      (c, i) => `<button class="cattab${i === 0 ? " active" : ""}" data-cat="${c.id}">${c.label}</button>`
    ).join("");
    const banners = STORE.sections || {};
    menuRoot.innerHTML = cats.map((c) => {
      const items = MENU.filter((m) => m.cat === c.id);
      // printed-menu rows: name · dotted leader · price, details underneath
      const rows = items.map((m) => `
      <li class="dish" data-id="${m.id}">
        ${m.image ? `<img class="dish-img" src="${esc(m.image)}" alt="" loading="lazy" onerror="this.remove()">` : ""}
        <div class="dish-main">
          <div class="dish-line"><h3>${esc(m.name)}</h3><span class="leader" aria-hidden="true"></span><span class="price">${fmt(m.price)}</span></div>
          ${m.badge ? `<span class="dish-badge">${esc(m.badge)}</span>` : ""}
          ${m.desc ? `<p class="card-desc">${esc(m.desc)}</p>` : ""}
          ${tagIcons(m.tags)}
        </div>
        <span class="card-action" data-action-for="${m.id}"></span>
      </li>`).join("");
      const head = `<div><h2>${esc(c.label)}</h2>${c.note ? `<span class="note">${esc(c.note)}</span>` : ""}</div>`;
      return `<section class="section" id="${c.id}">
      ${banners[c.id]
        ? `<div class="sec-banner" style="background-image:url('${esc(banners[c.id])}')">${head}</div>`
        : `<div class="sec-title">${head}</div>`}
      <ul class="dish-list">${rows}</ul>
    </section>`;
    }).join("");
  }

  /* ---------- per-card add / stepper ---------- */
  function renderCardAction(id) {
    const slot = document.querySelector(`[data-action-for="${id}"]`);
    if (!slot) return;
    const qty = cart[id] || 0;
    if (qty === 0) {
      slot.innerHTML = `<button class="add-btn round" data-add="${id}" aria-label="Add ${esc(itemById(id).name)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg></button>`;
    } else {
      slot.innerHTML = `<span class="stepper">
        <button data-dec="${id}">–</button><span class="q">${qty}</span><button data-inc="${id}">+</button>
      </span>`;
    }
  }
  function renderAllCardActions() { MENU.forEach((m) => renderCardAction(m.id)); }

  /* ---------- cart mutations ---------- */
  function add(id) {
    cart[id] = (cart[id] || 0) + 1;
    save(); renderCardAction(id); renderCart(); bumpCount(); toast(itemById(id).name + " added");
  }
  function setQty(id, q) {
    if (q <= 0) delete cart[id]; else cart[id] = q;
    save(); renderCardAction(id); renderCart(); bumpCount();
  }

  /* ---------- counts / totals ---------- */
  const cartCount = document.getElementById("cartCount");
  function totalQty() { return Object.values(cart).reduce((a, b) => a + b, 0); }
  function bumpCount() {
    const n = totalQty();
    cartCount.textContent = n;
    cartCount.classList.toggle("show", n > 0);
    const bar = document.getElementById("orderBar");
    if (bar) {
      bar.hidden = n === 0;
      document.getElementById("obCount").textContent = n;
      document.getElementById("obTotal").textContent = fmt(grandTotal());
    }
  }
  function subtotal() { return Object.entries(cart).reduce((s, [id, q]) => s + itemById(id).price * q, 0); }

  /* ---------- cart drawer render ---------- */
  const cartItems = document.getElementById("cartItems");
  const drawerFoot = document.getElementById("drawerFoot");
  function renderCart() {
    const ids = Object.keys(cart);
    if (ids.length === 0) {
      cartItems.innerHTML = `<div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6 5 2H2"/><circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/></svg>
        <p>Your order is empty.<br>Tap <strong>Add</strong> on anything tasty.</p></div>`;
      drawerFoot.hidden = true;
      return;
    }
    cartItems.innerHTML = ids.map((id) => {
      const m = itemById(id), q = cart[id];
      return `<div class="cart-line">
        <div class="thumb">${media(m)}</div>
        <div class="info">
          <h4>${esc(m.name)}</h4>
          <div class="lp">${fmt(m.price * q)}</div>
        </div>
        <span class="stepper">
          <button data-dec="${id}">–</button><span class="q">${q}</span><button data-inc="${id}">+</button>
        </span>
      </div>`;
    }).join("");
    drawerFoot.hidden = false;
    const sub = subtotal(), tax = sub * TAX_RATE;
    document.getElementById("tSub").textContent = fmt(sub);
    const taxLabel = document.getElementById("taxLabel");
    if (taxLabel) {
      taxLabel.textContent = taxPct ? "Tax (" + taxPct + "%)" : "Tax";
      const taxRow = taxLabel.closest(".row");
      if (taxRow) taxRow.hidden = !taxPct; // hide the tax line when there's no tax
    }
    document.getElementById("tTax").textContent = fmt(tax);
    document.getElementById("tGrand").textContent = fmt(sub + tax);
    if (typeof updatePlaceLabel === "function") updatePlaceLabel();
  }

  /* ---------- drawer open/close ---------- */
  const scrim = document.getElementById("scrim");
  const drawer = document.getElementById("drawer");
  function openCart() { scrim.classList.add("open"); drawer.classList.add("open"); }
  function closeCart() { scrim.classList.remove("open"); drawer.classList.remove("open"); }
  document.getElementById("cartBtn").addEventListener("click", openCart);
  document.getElementById("orderBar").addEventListener("click", openCart);
  document.getElementById("drawerClose").addEventListener("click", closeCart);
  scrim.addEventListener("click", closeCart);
  document.getElementById("howBtn")?.addEventListener("click", openCart);

  /* ---------- order type toggle ---------- */
  document.getElementById("orderType").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-type]");
    if (!btn) return;
    if (btn.dataset.type === "table" && isCounter) { toast("Scan a table QR to dine in"); return; }
    orderType = btn.dataset.type;
    document.querySelectorAll("#orderType button").forEach((b) => b.classList.toggle("active", b === btn));
    refreshPayLabels();
  });

  /* ---------- name + phone fields (both optional) ---------- */
  const nameInput = document.getElementById("custName");
  nameInput.value = localStorage.getItem("nw_name") || "";
  nameInput.addEventListener("input", () => localStorage.setItem("nw_name", nameInput.value.trim()));

  const phoneInput = document.getElementById("custPhone");
  if (phoneInput) {
    phoneInput.value = localStorage.getItem("nw_phone") || "";
    phoneInput.addEventListener("input", () => localStorage.setItem("nw_phone", phoneInput.value.trim()));
  }

  /* ---------- live order status (SSE) ---------- */
  let activeOrderId = null;
  const trackerSteps = ["new", "preparing", "ready"];
  function setTracker(status) {
    const idx = trackerSteps.indexOf(status === "completed" ? "ready" : status);
    document.querySelectorAll("#tracker .step").forEach((stepEl, i) => {
      stepEl.classList.toggle("done", i < idx);
      stepEl.classList.toggle("active", i === idx);
    });
  }
  function statusMessage(o) {
    if (o.status === "preparing") return "Our team is preparing your order…";
    if (o.status === "ready")
      return o.type === "table" ? `On its way to ${SEAT} ${o.table} now!` : "Ready! Head to the counter to grab it.";
    if (o.status === "completed") return "Enjoy — thanks for ordering with us!";
    return o.type === "table"
      ? `Sent to the kitchen — we'll bring it to ${SEAT} ${o.table}.`
      : `Sent to the kitchen — listen for ${o.name ? `"${o.name}"` : "your number"} at the counter.`;
  }
  function setPaidLine(o) {
    const el = document.getElementById("paidLine");
    const amt = fmt(o.total || 0);
    if (o.payment && o.payment.status === "paid") {
      el.className = "paidline paid";
      el.innerHTML = `✓ Paid ${amt} — you're all set.`;
    } else {
      el.className = "paidline due";
      el.innerHTML = o.type === "table"
        ? `Pay ${amt} at your table or the counter — quote order #${o.num}.`
        : `Pay ${amt} at the counter — quote order #${o.num}.`;
    }
  }
  function setLoyaltyLine(o) {
    const el = document.getElementById("loyaltyLine");
    if (!el) return;
    if (!o.phone) { el.hidden = true; return; } // skipped loyalty — nothing to show
    el.hidden = false;
    const earned = o.pointsAwarded || 0;
    const bal = o.customer ? o.customer.points : null;
    if (earned > 0) {
      el.innerHTML = `★ You earned ${earned} point${earned === 1 ? "" : "s"}!` +
        (bal != null ? `<span class="bal">Rewards balance: ${bal} points</span>` : "");
    } else {
      const pending = Math.floor(o.total || 0);
      el.innerHTML = `★ Earn ${pending} point${pending === 1 ? "" : "s"} when you pay` +
        (bal ? `<span class="bal">Current balance: ${bal} points</span>` : "");
    }
  }
  function showConfirm(o) {
    document.getElementById("confirmNum").textContent = "#" + o.num;
    document.getElementById("confirmMsg").textContent = statusMessage(o);
    document.getElementById("confirmEta").textContent = "Ready in ~" + (6 + o.items.length) + " min";
    setTracker(o.status);
    setPaidLine(o);
    setLoyaltyLine(o);
    document.getElementById("confirmScrim").classList.add("open");
  }
  function updateConfirm(o) {
    document.getElementById("confirmMsg").textContent = statusMessage(o);
    setTracker(o.status);
    setPaidLine(o);
    setLoyaltyLine(o);
    if (o.status === "ready") { chime(); toast(o.type === "table" ? "Your order is on its way!" : "Your order is ready!"); }
  }
  function chime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination); o.type = "sine"; o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      o.start(); o.stop(ctx.currentTime + 0.5);
    } catch {}
  }
  try {
    const es = new EventSource("/api/stream?loc=" + encodeURIComponent(LOC));
    es.addEventListener("order:update", (ev) => {
      const o = JSON.parse(ev.data);
      if (o.id === activeOrderId) updateConfirm(o);
    });
  } catch {}

  /* ---------- payment method ---------- */
  let payMethod = "later"; // 'later' = pay at counter/table · 'online' = pay now
  const placeBtn = document.getElementById("placeBtn");
  function grandTotal() { return subtotal() * (1 + TAX_RATE); }
  function updatePlaceLabel() {
    const t = fmt(grandTotal());
    placeBtn.textContent = payMethod === "online" ? `Pay & Place · ${t}` : `Place Order · ${t}`;
  }
  function refreshPayLabels() {
    document.getElementById("ptLater").textContent = orderType !== "table" ? "Cash or card" : IS_ROOM ? "Settle at checkout" : "Cash/card at your table";
    updatePlaceLabel();
  }
  document.getElementById("payType").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-pay]");
    if (!btn) return;
    payMethod = btn.dataset.pay;
    document.querySelectorAll("#payType button").forEach((b) => b.classList.toggle("active", b === btn));
    updatePlaceLabel();
  });

  /* ---------- submit order to server ---------- */
  async function submitOrder(extra) {
    const payload = {
      loc: LOC,
      name: nameInput.value.trim() || null,
      phone: phoneInput ? phoneInput.value.trim() || null : null,
      table: orderType === "table" ? TABLE : null,
      type: orderType,
      items: Object.entries(cart).map(([id, q]) => ({ id, name: itemById(id).name, qty: q, price: itemById(id).price })),
      total: grandTotal(),
      ...extra,
    };
    const res = await fetch("/api/orders", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("bad response");
    const order = await res.json();
    activeOrderId = order.id;
    showConfirm(order);
    cart = {}; save(); renderCart(); renderAllCardActions(); bumpCount(); closeCart();
  }
  function needsName() {
    // name + phone are both optional — never block placing an order
    return false;
  }

  /* ---------- place order (pay later) or open card modal (pay now) ---------- */
  placeBtn.addEventListener("click", async () => {
    if (totalQty() === 0 || needsName()) return;
    if (payMethod === "online") { openPay(); return; }
    placeBtn.disabled = true;
    placeBtn.textContent = "Sending to the kitchen…";
    try {
      await submitOrder({ paymentMethod: orderType === "table" ? "table" : "counter", paymentStatus: "unpaid" });
    } catch (err) {
      toast("Couldn't reach the kitchen — is the server running?");
    } finally {
      placeBtn.disabled = false; updatePlaceLabel();
    }
  });

  /* ---------- pay now (mock card) ---------- */
  const payScrim = document.getElementById("payScrim");
  function openPay() {
    document.getElementById("payAmount").textContent = grandTotal().toFixed(3);
    document.getElementById("payAmount2").textContent = grandTotal().toFixed(3);
    payScrim.classList.add("open");
  }
  document.getElementById("payCancel").addEventListener("click", () => payScrim.classList.remove("open"));
  document.getElementById("ccNum").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  });
  document.getElementById("ccExp").addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
    e.target.value = v;
  });
  document.getElementById("payForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("payNowBtn");
    const restore = btn.innerHTML;
    btn.disabled = true; btn.textContent = "Processing…";
    try {
      await new Promise((r) => setTimeout(r, 700)); // simulate a payment gateway round-trip
      await submitOrder({ paymentMethod: "online", paymentStatus: "paid" });
      payScrim.classList.remove("open");
      e.target.reset();
    } catch (err) {
      toast("Payment couldn't be processed — try again.");
    } finally {
      btn.disabled = false; btn.innerHTML = restore;
    }
  });

  document.getElementById("confirmDone").addEventListener("click", () =>
    document.getElementById("confirmScrim").classList.remove("open")
  );

  /* ---------- global click delegation for add/inc/dec ---------- */
  document.addEventListener("click", (e) => {
    const add$ = e.target.closest("[data-add]");
    const inc$ = e.target.closest("[data-inc]");
    const dec$ = e.target.closest("[data-dec]");
    if (add$) return add(add$.dataset.add);
    if (inc$) return setQty(inc$.dataset.inc, (cart[inc$.dataset.inc] || 0) + 1);
    if (dec$) return setQty(dec$.dataset.dec, (cart[dec$.dataset.dec] || 0) - 1);
  });

  /* ---------- toast ---------- */
  let toastTimer;
  const toastEl = document.getElementById("toast");
  function toast(msg) {
    document.getElementById("toastText").textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1800);
  }

  /* ---------- category nav: scroll + scrollspy ---------- */
  catnav.addEventListener("click", (e) => {
    const tab = e.target.closest(".cattab");
    if (!tab) return;
    const el = document.getElementById(tab.dataset.cat);
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: y, behavior: "smooth" });
  });
  function setupScrollspy() {
    const tabs = [...document.querySelectorAll(".cattab")];
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            tabs.forEach((t) => t.classList.toggle("active", t.dataset.cat === en.target.id));
            const active = catnav.querySelector(".cattab.active");
            if (active) active.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
          }
        });
      },
      { rootMargin: "-130px 0px -65% 0px" }
    );
    visibleCats().forEach((c) => { const el = document.getElementById(c.id); if (el) spy.observe(el); });
  }

  /* ---------- boot: load the catalog for this store, then render ---------- */
  async function boot() {
    try {
      const r = await fetch("/api/menu?loc=" + encodeURIComponent(LOC));
      const dataResp = await r.json();
      MENU = dataResp.menu || [];
      CATEGORIES = dataResp.categories || [];
    } catch {
      // fallback to the static bundle if the API is unreachable
      MENU = api.resolveMenu(window.MENU || [], STORE);
      CATEGORIES = window.CATEGORIES || [];
    }
    // drop any saved cart items that no longer exist in the catalog
    Object.keys(cart).forEach((id) => { if (!itemById(id)) delete cart[id]; });
    save();

    renderSpotlight();
    renderMenu();
    renderLegend();
    setupScrollspy();
    renderAllCardActions();
    renderCart();
    bumpCount();
    refreshPayLabels();
  }
  boot();
})();
