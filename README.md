# Cloud Kitchen website

A fast, single-page website for a cloud kitchen. Customers browse the menu, build an order,
and send it to the kitchen on **WhatsApp** for pickup, or jump to the kitchen's **Swiggy / Zomato**
page for delivery. No server, database or build step: it's plain HTML, CSS and JavaScript,
hosted free on GitHub Pages.

**Live site:** https://jashwanths07.github.io/cloud-kitchen/ (after Pages is enabled, see below)

## Make it yours

Almost everything lives in **`js/config.js`**. Every placeholder is marked `TODO`:

| What | Where |
| --- | --- |
| Kitchen name | `name` in `js/config.js`, plus find-and-replace `Saffron & Sage` / `Saffron <em>&amp;</em> Sage` in `index.html` |
| WhatsApp number that receives orders | `whatsapp` (country code + number, digits only, e.g. `919876543210`) |
| Phone, email, address, Google Maps link | `phone`, `email`, `address`, `mapsUrl` |
| Swiggy / Zomato restaurant links | `swiggyUrl`, `zomatoUrl` (set to `""` to hide) |
| FSSAI licence number | `fssai` |
| Opening hours | `hours` (drives the "Open now" badge, the hours table and pickup time slots) |
| Menu, prices, veg/non-veg, tags, spice | `menu` |
| Dish photos | Put images in `images/menu/` and set `image: "images/menu/your-dish.jpg"` |
| Hero numbers (rating, meals served), reviews, story | `index.html`, marked with `TODO` comments |

## How ordering works

1. The customer adds dishes (the basket is remembered in their browser).
2. They enter name, phone and a pickup time (slots are generated from your opening hours).
3. "Send order on WhatsApp" opens WhatsApp with the full order pre-filled, addressed to your number.
4. You confirm on WhatsApp; they pay by UPI or cash at pickup.

## Publishing on GitHub Pages

A workflow in `.github/workflows/pages.yml` deploys the site on every push to `main`.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```
