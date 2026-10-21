(function () {
  "use strict";

  const K = window.KITCHEN;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const money = (n) => K.currency + n.toLocaleString("en-IN");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const STORE_KEY = "ck-basket-v1";

  const items = new Map();
  K.menu.forEach((cat) => cat.items.forEach((it) => items.set(it.id, it)));

  /* ───────── Business details from config ───────── */
  function fillConfig() {
    $$("[data-text]").forEach((el) => { el.textContent = K[el.dataset.text]; });
    $$("[data-link]").forEach((el) => {
      const url = K[el.dataset.link];
      if (url) el.href = url; else el.hidden = true;
    });
    const wa = "https://wa.me/" + K.whatsapp;
    $$("[data-whatsapp]").forEach((el) => { el.href = wa; });
    $$("[data-tel]").forEach((el) => { el.href = "tel:" + K.phone.replace(/[^\d+]/g, ""); });
    $$("[data-mailto]").forEach((el) => { el.href = "mailto:" + K.email; });
    if (!K.email) $$("[data-email-row]").forEach((el) => { el.hidden = true; });
    $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
  }

  /* ───────── Hours ───────── */
  const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const fmtTime = (mins) => {
    const h = Math.floor(mins / 60) % 24, m = mins % 60;
    const ap = h >= 12 ? "PM" : "AM", h12 = h % 12 || 12;
    return h12 + (m ? ":" + String(m).padStart(2, "0") : "") + " " + ap;
  };
  const slotsFor = (day) => (K.hours[day] || []).map(([a, b]) => [toMin(a), toMin(b)]);

  function openStatus(now = new Date()) {
    const day = now.getDay(), mins = now.getHours() * 60 + now.getMinutes();
    const cur = slotsFor(day).find(([a, b]) => mins >= a && mins < b);
    if (cur) return { open: true, text: "Open now · till " + fmtTime(cur[1]) };
    for (let d = 0; d < 7; d++) {
      const dd = (day + d) % 7;
      const next = slotsFor(dd).find(([a]) => d > 0 || a > mins);
      if (next) {
        const when = d === 0 ? fmtTime(next[0]) : (d === 1 ? "tomorrow " : DAYS[dd].slice(0, 3) + " ") + fmtTime(next[0]);
        return { open: false, text: "Closed · opens " + when };
      }
    }
    return { open: false, text: "Closed" };
  }

  function renderHours() {
    const today = new Date().getDay();
    const order = [1, 2, 3, 4, 5, 6, 0];
    $("[data-hours]").innerHTML = order.map((d) => {
      const s = slotsFor(d);
      const val = s.length ? s.map(([a, b]) => fmtTime(a) + " – " + fmtTime(b)).join("<br>") : '<span class="closed">Closed</span>';
      return `<tr class="${d === today ? "today" : ""}"><td>${DAYS[d]}</td><td>${val}</td></tr>`;
    }).join("");
    const st = openStatus();
    const el = $("[data-status]");
    el.textContent = st.text;
    el.classList.toggle("open", st.open);
    el.hidden = false;
  }

  // Pickup times: 15-minute slots inside opening hours, at least prepMinutes from now.
  function pickupOptions() {
    const now = new Date();
    const earliest = now.getHours() * 60 + now.getMinutes() + K.prepMinutes;
    const opts = [];
    for (let d = 0; d < 7 && opts.length < 40; d++) {
      const day = (now.getDay() + d) % 7;
      const label = d === 0 ? "Today" : d === 1 ? "Tomorrow" : DAYS[day];
      slotsFor(day).forEach(([a, b]) => {
        let t = Math.ceil(Math.max(a + 15, d === 0 ? earliest : 0) / 15) * 15;
        for (; t <= b && opts.length < 40; t += 15) opts.push(label + ", " + fmtTime(t));
      });
      if (d >= 1 && opts.length) break; // offer at most today + next open day
    }
    return opts;
  }

  function renderTimes() {
    const st = openStatus();
    const opts = pickupOptions();
    const sel = $("[data-times]");
    const list = (st.open ? [`As soon as possible (~${K.prepMinutes} min)`] : []).concat(opts);
    sel.innerHTML = list.length
      ? list.map((o) => `<option>${esc(o)}</option>`).join("")
      : "<option value=''>No pickup slots available</option>";
  }

  /* ───────── Menu ───────── */
  const PALETTES = [["#f6d79a", "#e39b2d"], ["#f1b48f", "#c4572b"], ["#d9c49a", "#a07a3c"], ["#b9d3a8", "#4f8a5b"], ["#f3c7c0", "#c0605a"]];
  const filter = { cat: "all", vegOnly: false };

  function vegMark(veg) {
    return `<span class="veg-mark veg-mark--${veg ? "veg" : "nonveg"}" role="img" aria-label="${veg ? "Vegetarian" : "Non-vegetarian"}"></span>`;
  }

  function dishHTML(it, ci) {
    const [c1, c2] = PALETTES[ci % PALETTES.length];
    const media = it.image
      ? `<img class="dish__img" src="${esc(it.image)}" alt="${esc(it.name)}" loading="lazy">`
      : `<div class="dish__img" style="--c1:${c1};--c2:${c2}" aria-hidden="true">${esc(it.name.trim()[0])}</div>`;
    const spice = it.spice ? `<span class="dish__spice" title="Spice level ${it.spice} of 3" aria-label="Spice level ${it.spice} of 3">${"🌶️".repeat(it.spice)}</span>` : "";
    return `
      <article class="dish" data-id="${esc(it.id)}" data-veg="${it.veg}">
        <div>
          <div class="dish__top">${vegMark(it.veg)}${it.tag ? `<span class="tag">${esc(it.tag)}</span>` : ""}</div>
          <h4>${esc(it.name)}</h4>
          <p class="dish__desc">${esc(it.desc)}</p>
          <div class="dish__meta"><span class="dish__price">${money(it.price)}</span>${spice}</div>
        </div>
        <div class="dish__media">${media}<div class="dish__add" data-control="${esc(it.id)}"></div></div>
      </article>`;
  }

  function renderMenu() {
    const tabs = [{ key: "all", label: "All" }].concat(K.menu.map((c, i) => ({ key: String(i), label: c.category })));
    $("[data-tabs]").innerHTML = tabs.map((t) =>
      `<button class="tab" role="tab" data-cat="${t.key}" aria-selected="${t.key === filter.cat}">${esc(t.label)}</button>`).join("");

    $("[data-menu]").innerHTML = K.menu.map((cat, i) => `
      <section class="menu__category" data-cat-index="${i}">
        <h3>${esc(cat.category)} <small>${cat.items.length} dishes</small></h3>
        <div class="menu__items">${cat.items.map((it) => dishHTML(it, i)).join("")}</div>
      </section>`).join("") + `<p class="menu__empty" data-menu-empty hidden>No dishes match. Try turning off "Veg only".</p>`;
    applyFilter();
  }

  function applyFilter() {
    let shown = 0;
    $$(".menu__category").forEach((sec) => {
      let visible = 0;
      $$(".dish", sec).forEach((d) => {
        const ok = !filter.vegOnly || d.dataset.veg === "true";
        d.hidden = !ok;
        if (ok) visible++;
      });
      const small = $("h3 small", sec);
      small.textContent = visible + (visible === 1 ? " dish" : " dishes");
      sec.hidden = !visible || (filter.cat !== "all" && sec.dataset.catIndex !== filter.cat);
      if (!sec.hidden) shown++;
    });
    $("[data-menu-empty]").hidden = shown > 0;
    $$(".tab").forEach((t) => t.setAttribute("aria-selected", t.dataset.cat === filter.cat));
  }

  /* ───────── Basket ───────── */
  let basket = {};
  try { basket = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { basket = {}; }
  Object.keys(basket).forEach((id) => { if (!items.has(id) || !(basket[id] > 0)) delete basket[id]; });

  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(basket)); } catch (e) { /* storage unavailable */ } };
  const count = () => Object.values(basket).reduce((a, b) => a + b, 0);
  const total = () => Object.entries(basket).reduce((sum, [id, q]) => sum + items.get(id).price * q, 0);

  function setQty(id, q) {
    const prev = basket[id] || 0;
    if (q > 0) basket[id] = Math.min(q, 50); else delete basket[id];
    save();
    renderBasket();
    if (q > prev) {
      const badge = $(".basket-btn .badge");
      badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
      if (prev === 0) toast(`Added ${items.get(id).name}`);
    }
  }

  function controlHTML(id) {
    const q = basket[id] || 0;
    const name = esc(items.get(id).name);
    return q
      ? `<div class="stepper"><button data-dec="${esc(id)}" aria-label="Remove one ${name}">−</button><span aria-live="polite">${q}</span><button data-inc="${esc(id)}" aria-label="Add one more ${name}">+</button></div>`
      : `<button class="add-btn" data-inc="${esc(id)}" aria-label="Add ${name} to order">ADD</button>`;
  }

  function renderBasket() {
    $$("[data-control]").forEach((el) => { el.innerHTML = controlHTML(el.dataset.control); });

    const n = count(), t = total();
    $$("[data-count]").forEach((el) => { el.textContent = n; });
    $$("[data-total]").forEach((el) => { el.textContent = money(t); });

    const bar = $("[data-order-bar]");
    bar.hidden = n === 0;
    document.body.classList.toggle("has-bar", n > 0);

    const ids = Object.keys(basket);
    $("[data-empty]").hidden = ids.length > 0;
    $("[data-checkout]").hidden = ids.length === 0;
    $("[data-foot]").hidden = ids.length === 0;
    $("[data-lines]").innerHTML = ids.map((id) => {
      const it = items.get(id);
      return `<li class="line">
        <span class="line__name">${vegMark(it.veg)}${esc(it.name)}</span>
        <span class="line__price">${money(it.price)} × ${basket[id]} = <strong>${money(it.price * basket[id])}</strong></span>
        ${controlHTML(id)}
      </li>`;
    }).join("");
  }

  /* ───────── Drawer ───────── */
  const drawer = $("[data-drawer]");
  let lastFocus = null;
  function openDrawer() {
    lastFocus = document.activeElement;
    renderTimes();
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("locked");
    setTimeout(() => $(".drawer__head .icon-btn").focus(), 50);
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("locked");
    if (lastFocus) lastFocus.focus();
  }

  /* ───────── Checkout via WhatsApp ───────── */
  function sendOrder() {
    const form = $("[data-checkout]");
    const err = $("[data-error]");
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const time = form.time.value;
    const notes = form.notes.value.trim();

    $$(".invalid", form).forEach((el) => el.classList.remove("invalid"));
    const problems = [];
    if (!name) { problems.push("your name"); form.name.classList.add("invalid"); }
    if (phone.replace(/\D/g, "").length < 10) { problems.push("a valid phone number"); form.phone.classList.add("invalid"); }
    if (!time) { problems.push("a pickup time"); form.time.classList.add("invalid"); }
    if (problems.length) {
      err.textContent = "Please add " + problems.join(", ") + ".";
      err.hidden = false;
      $(".invalid", form).focus();
      return;
    }
    err.hidden = true;

    const lines = Object.entries(basket).map(([id, q]) => {
      const it = items.get(id);
      return `• ${q} × ${it.name} (${it.veg ? "veg" : "non-veg"}) = ${money(it.price * q)}`;
    });
    const msg = [
      `*New pickup order · ${K.name}*`,
      "",
      ...lines,
      "",
      `*Total: ${money(total())}*`,
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Pickup: ${time}`,
      notes ? `Notes: ${notes}` : null,
    ].filter((l) => l !== null).join("\n");

    window.open("https://wa.me/" + K.whatsapp + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    toast("Opening WhatsApp… just tap send!");
  }

  /* ───────── Toast ───────── */
  let toastTimer;
  function toast(text) {
    const el = $("[data-toast]");
    el.textContent = text;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  /* ───────── Events ───────── */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-inc],[data-dec],[data-open-basket],[data-close-basket],[data-cat],[data-send]");
    if (!t) return;
    if (t.dataset.inc) setQty(t.dataset.inc, (basket[t.dataset.inc] || 0) + 1);
    else if (t.dataset.dec) setQty(t.dataset.dec, (basket[t.dataset.dec] || 0) - 1);
    else if (t.hasAttribute("data-open-basket")) openDrawer();
    else if (t.hasAttribute("data-close-basket")) {
      closeDrawer();
      if (t.classList.contains("btn")) $("#menu").scrollIntoView();
    }
    else if (t.dataset.cat) {
      filter.cat = t.dataset.cat;
      applyFilter();
      // Bring the top of the filtered list back under the sticky header + tabs
      const offset = $(".header").offsetHeight + $(".menu__controls").offsetHeight + 8;
      const top = $("[data-menu]").getBoundingClientRect().top + window.scrollY - offset;
      if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
    }
    else if (t.hasAttribute("data-send")) sendOrder();
  });
  $("[data-veg-only]").addEventListener("change", (e) => { filter.vegOnly = e.target.checked; applyFilter(); });
  $("[data-checkout]").addEventListener("submit", (e) => { e.preventDefault(); sendOrder(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer(); });

  const header = $(".header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ───────── Reveal on scroll ───────── */
  function setupReveal() {
    if (!("IntersectionObserver" in window)) return;
    const targets = $$(".section__head, .step, .way, .promise__item, .review, .about__inner > *, .faq details, .contact__card, .hours");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach((el, i) => {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 3) * 80 + "ms";
      io.observe(el);
    });
  }

  /* ───────── Init ───────── */
  fillConfig();
  renderHours();
  renderMenu();
  renderBasket();
  onScroll();
  setupReveal();
  setInterval(renderHours, 60 * 1000);
})();
