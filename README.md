# Al Manzil Hotel — QR Ordering

QR ordering for **Al Manzil Hotel Bahrain**, with two outlets that each run on their own:

| Outlet | Store id | Guests order from | Menu |
|--------|----------|-------------------|------|
| **In-Room Dining** | `ird` | their **room** (QR code in each room) | 102 dishes in 17 sections, allergen icons + legend |
| **Elixir Lounge** | `elixir` | their **room** (QR code in each room) — drinks delivered | 131 drinks in 13 sections |

Each outlet has its own menu, kitchen/bar screen, cashier screen, QR codes, order numbers and
staff login. One server and one database serve both.

A guest scans the QR code → sees that outlet's menu, already set to their room → adds
items → places the order. It appears instantly on that outlet's kitchen or bar screen and its
cashier screen, and the guest's phone updates live: Received → Preparing → Ready.

## Run it locally

```bash
cd al-manzil
node server.js          # Node 24 (uses the built-in node:sqlite) — no npm install needed
```

Open http://localhost:8100 (set `PORT=` to use another port).

| Page | URL |
|------|-----|
| Landing — choose an outlet | `/` |
| In-Room Dining menu, room 204 | `/index.html?loc=ird&table=204` |
| Elixir Lounge menu, room 204 | `/index.html?loc=elixir&table=204` |
| Kitchen screen (in-room) | `/kds.html?loc=ird` |
| Bar screen (Elixir) | `/kds.html?loc=elixir` |
| Cashier | `/cashier.html?loc=ird` or `?loc=elixir` |
| Products dashboard (edit menus) | `/admin.html` |
| Printable QR codes | `/qr-codes.html` |

Open a menu next to its kitchen and cashier screens to watch an order move in real time.

### Logins

| Who | Username | Password |
|-----|----------|----------|
| Master admin (both outlets, add outlets) | `MASTER_USER` env (default `admin`) | `MASTER_PASS` env (default `admin`) |
| In-Room Dining staff | `ird` | `ird123` (default — change after first login) |
| Elixir Lounge staff | `elixir` | `elixir123` (default — change after first login) |

Store logins can only edit their own outlet's menu.

## QR codes

Both outlets' QR codes are placed in the rooms. `qr-codes.html` prints:

- **Both outlets — one card per room** (default): each card shows the room number with two codes,
  In-Room Dining (food) and Elixir Lounge (drinks).
- **One outlet** at a time, if you prefer separate cards.
- Room numbers accept ranges and lists: `101-120, 201-220, 305` (up to 300 rooms per sheet).
- Each code encodes `index.html?loc=<outlet>&table=<room>`.
- **Print from the live site**, not localhost: the codes use the address the page was opened
  from (editable in *Public menu URL*).

## Files

| File | Purpose |
|------|---------|
| `server.js` | Realtime server (Node, no dependencies): site, order API, live SSE feed, logins. Prices are always taken from the menu on the server, never from the guest's phone. |
| `db.js` | SQLite database (`almanzil.db`, or `DB_FILE`). Stores, menus, orders, loyalty points — every row tagged with its outlet. |
| `data.js` | Starting menus: `MENUS.ird` and `MENUS.elixir`, plus the `ALLERGENS` legend. Seeded into the database on first boot; edit menus in the dashboard after that. |
| `locations.js` | The two outlets and how each one looks: seat label ("Room"), theme, logo, hero photo/video, section photos, intro text, Instagram link. |
| `index.html` + `app.js` + `menu.css` + `layout.css` | Guest menu: hero, section banners, printed-menu rows, allergen icons, order bar, cart, live order tracker. |
| `home.html` | Landing page: split screen for the two outlets and a dish slider (Swiper). |
| `kds.html` + `kds.js` | Kitchen / bar screen for one outlet: New → Preparing → Ready → Delivered. |
| `cashier.html` + `cashier.js` | Cashier for one outlet: open bills, mark paid (cash/card), printable receipts. |
| `admin.html` + `admin.js` | Products dashboard: edit items, prices, sections and photos per outlet. |
| `qr-codes.html` | Printable QR cards: one card per room with both outlets' codes, or one outlet at a time. |
| `loc-staff.js` | Locks a staff screen to one outlet via `?loc=` and shows an outlet picker if it's missing. |
| `styles.css` | Shared staff-screen styles (cream and bronze). |
| `media/` | Photos from the in-room dining menu. Add `elixir-hero.mp4` here for the Elixir video. |
| `logo-manzil.png`, `logo-elixir.png`, `logo.png` | Logos cut from the hotel's PDF menus. |
| `render.yaml` | Render blueprint (web service + persistent disk). |

## Menus and allergens

Menus come from the hotel's two PDFs. Prices are in BHD and already include the 10% service
charge, 5% government levy and 10% VAT, so the outlets' tax rate is 0.

In-room dishes carry allergen codes in `tags`, shown as icons and explained in the legend at the
bottom of the menu:

| Code | Allergen | Code | Allergen |
|------|----------|------|----------|
| `v` | Vegetarian | `s` | Shellfish |
| `g` | Gluten | `n` | Nuts |
| `d` | Dairy | `h` | Spicy |
| `e` | Eggs | | |

Spirits and wine are listed twice where the PDF has two prices: once for the 30 ml pour or glass,
once for the bottle.

## Photos and video

- **Section banners:** set in `locations.js` → `sections` (category id → image path).
- **Hero:** `hero` (image) or `heroVideo` (MP4, played muted and looped). A missing video falls
  back to the outlet's colour backdrop.
- **Elixir Lounge** is set up for `media/elixir-hero.mp4`; add the lounge's reel there.
- **Single items:** upload a photo per item in the products dashboard.

## How it works

- **Separate outlets:** every order and menu item carries its outlet. Kitchen and cashier screens
  subscribe to `/api/stream?loc=…` and only see their own outlet. Order numbers count per outlet.
- **Live updates:** placing an order, advancing it, or marking it paid posts to the server, which
  pushes the change to every open screen over SSE.
- **Payment:** *Charge to room* / *Pay at counter* leave the order unpaid for the cashier. *Pay now*
  is a mock card form — no real charge. A real gateway should mark orders paid only after its
  webhook confirms.
- **Loyalty:** a guest can add a phone number to earn 1 point per 1 BHD, credited when paid.

### API

```
GET  /api/locations                       outlets
GET  /api/menu?loc=ID                     an outlet's menu
GET  /api/stream?loc=ID                   live feed for one outlet (SSE)
GET  /api/orders?loc=ID[&active=1]        an outlet's orders
POST /api/orders                          place  { loc, table, type, items[], name?, phone? }
POST /api/orders/:id/status               advance { status: new|preparing|ready|completed }
POST /api/orders/:id/payment              settle  { status: paid|unpaid, method: cash|card|online }
POST /api/login · /api/logout · GET /api/me                  staff session
GET  /api/catalog · POST /api/products · /api/collections     menu editing (logged in)
```

## Deploy to Render

`render.yaml` creates a web service called **al-manzil** (Starter plan, Frankfurt — the
closest Render region to Bahrain) with a 1 GB disk at `/data` for the database and uploaded
photos.

1. Give Render's GitHub app access to this repo.
2. In Render: **New → Blueprint** → pick this repo.
3. Enter a password for **MASTER_PASS** (the master username is `manziladmin`), then **Apply**.
4. Open the service URL, then print QR codes from `https://<service-url>/qr-codes.html`.

This project has its own database and Render service, separate from the other client sites.
