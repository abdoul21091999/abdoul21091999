/* =========================================================
   HI-TECH — Logique du site (vanilla JS, sans dépendance)
   Panier, commande WhatsApp, boutique, échange, réparation
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Icônes SVG ---------- */
  const ICONS = {
    phone:   '<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>',
    android: '<path d="M6 10h12v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/><path d="M6 9a6 6 0 0 1 12 0"/><path d="M8 4 9.5 6M16 4l-1.5 2M3.5 11v5M20.5 11v5M10 19v3M14 19v3"/>',
    laptop:  '<rect x="4" y="4" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',
    tablet:  '<rect x="4" y="2" width="16" height="20" rx="2.5"/><path d="M11 18h2"/>',
    watch:   '<rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 6V2h6v4M9 18v4h6v-4M12 10v2l1.5 1.5"/>',
    audio:   '<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="3" y="14" width="4" height="7" rx="1.5"/><rect x="17" y="14" width="4" height="7" rx="1.5"/>',
    gamepad: '<path d="M6 8h12a4 4 0 0 1 4 4l-1 5a2.5 2.5 0 0 1-4.3 1.2L15 16H9l-1.7 2.2A2.5 2.5 0 0 1 3 17l-1-5a4 4 0 0 1 4-4z"/><path d="M7 11v3M5.5 12.5h3M16 12h.01M18 13.5h.01"/>',
    plug:    '<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5"/>',
    cart:    '<path d="M3 3h2l2.4 12.1a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20.5" r="1.3"/><circle cx="17" cy="20.5" r="1.3"/>',
    whatsapp:'<path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.6z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1.2-1.6-2.2-1.1-1 .9a5 5 0 0 1-2.2-2.2l.9-1-1.1-2.2z"/>'
  };
  const icon = (name, cls = "") =>
    `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;

  /* ---------- Utilitaires ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fcfa = (n) => n ? n.toLocaleString("fr-FR").replace(/ | /g, " ") + " FCFA" : "Prix sur demande";
  const catOf = (id) => CATEGORIES.find((c) => c.id === id) || { label: "", icon: "plug" };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const waLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("is-visible"), 2400);
  }

  let io; // observer des animations (déclaré tôt : utilisé dès le premier rendu)

  /* ---------- Panier (localStorage) ---------- */
  const CART_KEY = "hitech_cart";
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { cart = []; }
  const saveCart = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {} renderCart(); };

  function addToCart(id, option, qty = 1, ci = 0) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    const key = id + "|" + (option || "");
    const line = cart.find((l) => l.key === key);
    if (line) line.qty += qty; else cart.push({ key, id, option: option || "", qty, ci });
    saveCart();
    toast(`${p.name} ajouté au panier`);
    const badge = $(".cart-btn__count");
    if (badge) { badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump"); }
  }

  function renderCart() {
    const count = cart.reduce((s, l) => s + l.qty, 0);
    $$(".cart-btn__count").forEach((b) => { b.textContent = count; b.hidden = count === 0; });
    const list = $("#cartItems");
    if (!list) return;
    if (!cart.length) {
      list.innerHTML = `<div class="cart-empty">${icon("cart")}<p>Votre panier est vide.</p><a href="boutique.html" class="btn btn--primary">Voir la boutique</a></div>`;
    } else {
      list.innerHTML = cart.map((l) => {
        const p = PRODUCTS.find((x) => x.id === l.id);
        if (!p) return "";
        return `<div class="cart-line" data-key="${esc(l.key)}">
          <div class="cart-line__media">${media(p, true, l.ci)}</div>
          <div class="cart-line__info">
            <strong>${esc(p.name)}</strong>
            ${l.option ? `<span class="muted">${esc(l.option)}</span>` : ""}
            <span class="cart-line__price">${fcfa(p.price)}</span>
            <div class="qty">
              <button type="button" data-qty="-1" aria-label="Diminuer">−</button>
              <span>${l.qty}</span>
              <button type="button" data-qty="1" aria-label="Augmenter">+</button>
            </div>
          </div>
          <button type="button" class="cart-line__remove" aria-label="Retirer">×</button>
        </div>`;
      }).join("");
    }
    const total = cart.reduce((s, l) => { const p = PRODUCTS.find((x) => x.id === l.id); return s + (p ? p.price * l.qty : 0); }, 0);
    const hasQuote = cart.some((l) => { const p = PRODUCTS.find((x) => x.id === l.id); return p && !p.price; });
    $("#cartTotal").textContent = fcfa(total) + (hasQuote ? " + devis" : "");
    $("#cartCheckout").classList.toggle("is-disabled", !cart.length);
  }

  function checkoutMessage() {
    let lines = ["Bonjour Hi-Tech 👋, je souhaite commander :", ""];
    let total = 0;
    cart.forEach((l) => {
      const p = PRODUCTS.find((x) => x.id === l.id);
      if (!p) return;
      total += p.price * l.qty;
      lines.push(`• ${l.qty} × ${p.name}${l.option ? " (" + l.option + ")" : ""} — ${fcfa(p.price)}`);
    });
    lines.push("", `Total estimé : ${fcfa(total)}`);
    const name = ($("#cartName") || {}).value, mode = ($("#cartMode") || {}).value;
    if (name) lines.push(`Nom : ${name}`);
    if (mode) lines.push(`Retrait / livraison : ${mode}`);
    lines.push("", "Merci de me confirmer la disponibilité.");
    return lines.join("\n");
  }

  /* ---------- Rendu produit (style samsung.com) ---------- */
  // Visuel : rendu vectoriel dans la couleur choisie, sinon photo, sinon icône
  function media(p, small, ci) {
    const col = p.colors && p.colors[ci || 0];
    if (p.render && col && typeof RENDER !== "undefined") return RENDER.svg(p.render, col.hex);
    if (p.img) return `<img src="${p.img}" alt="${esc(p.name)}" loading="lazy" />`;
    return `<div class="media-ph ${small ? "media-ph--sm" : ""}">${icon(catOf(p.cat).icon)}<span>${esc(p.brand)}</span></div>`;
  }

  function badgeClass(b) {
    return { "Promo": "badge--hot", "Nouveau": "badge--new", "Reconditionné": "badge--refurb" }[b] || "";
  }

  // Choix courant d'une carte / fiche (couleur + capacité)
  const sel = (box) => ({ ci: +(box.dataset.ci || 0), oi: +(box.dataset.oi || 0) });
  function choiceLabel(p, box) {
    const { ci, oi } = sel(box);
    return [p.options && p.options[oi], p.colors && p.colors[ci] && p.colors[ci].name].filter(Boolean).join(" · ");
  }
  function waFor(p, box) {
    const c = choiceLabel(p, box);
    return waLink(`Bonjour Hi-Tech, je souhaite commander : ${p.name}${c ? " (" + c + ")" : ""} — ${fcfa(p.price)}. Est-il disponible ?`);
  }

  function choices(p) {
    let h = "";
    if (p.colors && p.colors.length) {
      h += `<div class="pick__label">Couleur : <span data-color-name>${esc(p.colors[0].name)}</span></div>
        <div class="swatches" role="radiogroup" aria-label="Couleur">${p.colors.map((c, i) =>
          `<button type="button" class="swatch ${i ? "" : "is-active"}" data-swatch="${i}" role="radio" aria-checked="${!i}" aria-label="${esc(c.name)}" title="${esc(c.name)}" style="--c:${c.hex}"></button>`).join("")}</div>`;
    }
    if (p.options && p.options.length) {
      h += `<div class="caps" role="radiogroup" aria-label="Option">${p.options.map((o, i) =>
        `<button type="button" class="cap ${i ? "" : "is-active"}" data-cap="${i}" role="radio" aria-checked="${!i}">${esc(o)}</button>`).join("")}</div>`;
    }
    return h;
  }

  function card(p) {
    return `<article class="product reveal" data-id="${p.id}" data-ci="0" data-oi="0">
      <button type="button" class="product__media" data-open="${p.id}" aria-label="Voir ${esc(p.name)}">
        ${p.badge ? `<span class="badge ${badgeClass(p.badge)}">${esc(p.badge)}</span>` : ""}
        <span class="product__visual" data-media>${media(p)}</span>
      </button>
      <div class="product__body">
        <h3 class="product__name"><button type="button" data-open="${p.id}">${esc(p.name)}</button></h3>
        ${choices(p)}
        <div class="product__price">
          ${p.options && p.options.length > 1 && p.price ? `<span class="product__from">À partir de</span>` : ""}
          <strong>${fcfa(p.price)}</strong>
          ${p.oldPrice ? `<s>${fcfa(p.oldPrice)}</s>` : ""}
        </div>
        <div class="product__actions">
          <button type="button" class="btn btn--black" data-add="${p.id}">Commander</button>
          <a class="btn btn--line" data-wa-product href="${waLink(`Bonjour Hi-Tech, je suis intéressé(e) par : ${p.name} (${fcfa(p.price)}). Est-il disponible ?`)}" target="_blank" rel="noopener">${icon("whatsapp")} WhatsApp</a>
        </div>
      </div>
    </article>`;
  }

  /* ---------- Fenêtre produit ---------- */
  function openProduct(id, from) {
    const p = PRODUCTS.find((x) => x.id === id);
    const modal = $("#productModal");
    if (!p || !modal) return;
    const st = from ? sel(from) : { ci: 0, oi: 0 };
    $(".modal__content", modal).innerHTML = `
      <div class="pm" data-id="${p.id}" data-ci="0" data-oi="0">
        <div class="pm__media">${p.badge ? `<span class="badge ${badgeClass(p.badge)}">${esc(p.badge)}</span>` : ""}<span class="product__visual" data-media>${media(p)}</span></div>
        <div class="pm__info">
          <span class="product__cat">${esc(p.brand)} · ${esc(catOf(p.cat).label)}</span>
          <h2 id="pmTitle">${esc(p.name)}</h2>
          <div class="product__price product__price--lg"><strong>${fcfa(p.price)}</strong>${p.oldPrice ? `<s>${fcfa(p.oldPrice)}</s>` : ""}</div>
          <p>${esc(p.desc || "")}</p>
          ${choices(p)}
          <ul class="pm__perks">
            <li>✓ Garantie boutique</li><li>✓ Produit testé avant remise</li><li>✓ Reprise de votre ancien appareil possible</li>
          </ul>
          <div class="pm__actions">
            <button type="button" class="btn btn--black" data-add="${p.id}">${icon("cart")} Ajouter au panier</button>
            <a class="btn btn--wa" data-wa-product target="_blank" rel="noopener">${icon("whatsapp")} Commander sur WhatsApp</a>
          </div>
        </div>
      </div>`;
    const box = $(".pm", modal);
    pick(box, "ci", st.ci); pick(box, "oi", st.oi);
    openLayer(modal);
  }

  // Applique un choix (couleur ou capacité) à une carte / fiche
  function pick(box, key, i) {
    const p = PRODUCTS.find((x) => x.id === box.dataset.id);
    if (!p) return;
    box.dataset[key] = i;
    if (key === "ci") {
      $$("[data-swatch]", box).forEach((b) => { const on = +b.dataset.swatch === i; b.classList.toggle("is-active", on); b.setAttribute("aria-checked", on); });
      const n = $("[data-color-name]", box); if (n && p.colors[i]) n.textContent = p.colors[i].name;
      const m = $("[data-media]", box); if (m && p.render) m.innerHTML = media(p, false, i);
    } else {
      $$("[data-cap]", box).forEach((b) => { const on = +b.dataset.cap === i; b.classList.toggle("is-active", on); b.setAttribute("aria-checked", on); });
    }
    const wa = $("[data-wa-product]", box); if (wa) wa.href = waFor(p, box);
  }

  /* ---------- Couches (modal / tiroir) ---------- */
  let lastFocus = null;
  function openLayer(el) {
    lastFocus = document.activeElement;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add("is-open"));
    document.body.classList.add("no-scroll");
    const f = el.querySelector("button, a, input, select");
    if (f) f.focus();
  }
  function closeLayer(el) {
    if (!el || el.hidden) return;
    el.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    setTimeout(() => { el.hidden = true; }, 250);
    if (lastFocus) lastFocus.focus();
  }
  const closeModal = () => closeLayer($("#productModal"));

  /* ---------- Délégation d'évènements ---------- */
  document.addEventListener("click", (e) => {
    const sw = e.target.closest("[data-swatch]"), cp = e.target.closest("[data-cap]");
    if (sw || cp) {
      const box = (sw || cp).closest("[data-id]");
      if (box) pick(box, sw ? "ci" : "oi", +(sw ? sw.dataset.swatch : cp.dataset.cap));
      return;
    }
    const add = e.target.closest("[data-add]");
    if (add) {
      const box = add.closest("[data-id]"), p = PRODUCTS.find((x) => x.id === add.dataset.add);
      if (!p) return;
      const { ci } = box ? sel(box) : { ci: 0 };
      addToCart(p.id, box ? choiceLabel(p, box) : (p.options ? p.options[0] : ""), 1, ci);
      if (add.closest("#productModal")) closeModal();
      return;
    }
    const open = e.target.closest("[data-open]");
    if (open) { openProduct(open.dataset.open, open.closest("[data-id]")); return; }
    if (e.target.closest("[data-cart-open]")) { openLayer($("#cartDrawer")); return; }
    if (e.target.closest("[data-close]")) { closeLayer(e.target.closest(".layer")); return; }
    const line = e.target.closest(".cart-line");
    if (line) {
      const l = cart.find((x) => x.key === line.dataset.key);
      if (!l) return;
      const q = e.target.closest("[data-qty]");
      if (q) { l.qty += +q.dataset.qty; if (l.qty < 1) cart = cart.filter((x) => x !== l); saveCart(); }
      else if (e.target.closest(".cart-line__remove")) { cart = cart.filter((x) => x !== l); saveCart(); }
    }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") $$(".layer.is-open").forEach(closeLayer); });

  const checkout = $("#cartCheckout");
  if (checkout) checkout.addEventListener("click", (e) => {
    e.preventDefault();
    if (!cart.length) return;
    window.open(waLink(checkoutMessage()), "_blank", "noopener");
  });
  const clear = $("#cartClear");
  if (clear) clear.addEventListener("click", () => { cart = []; saveCart(); });

  /* Photo manquante : on affiche l'icône de la catégorie à la place */
  document.addEventListener("error", (e) => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement) || img.dataset.fallback) return;
    img.dataset.fallback = "1";
    const id = (img.closest("[data-id]") || {}).dataset;
    const p = id && PRODUCTS.find((x) => x.id === id.id);
    img.outerHTML = `<div class="media-ph">${icon(p ? catOf(p.cat).icon : "plug")}<span>${p ? esc(p.brand) : ""}</span></div>`;
  }, true);

  /* ---------- Navigation ---------- */
  const header = $(".header");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const burger = $(".burger"), nav = $(".nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open);
      burger.classList.toggle("is-open", open);
    });
    $$("a", nav).forEach((a) => a.addEventListener("click", () => { nav.classList.remove("is-open"); burger.classList.remove("is-open"); burger.setAttribute("aria-expanded", false); }));
  }

  /* ---------- Recherche dans l'en-tête ---------- */
  $$(".search-form").forEach((f) => f.addEventListener("submit", (e) => {
    const q = $("input", f).value.trim();
    if (document.body.dataset.page === "shop") { e.preventDefault(); const s = $("#shopSearch"); s.value = q; s.dispatchEvent(new Event("input")); s.scrollIntoView({ behavior: "smooth", block: "center" }); }
  }));

  /* ---------- Accueil : catégories + produits vedettes ---------- */
  const catGrid = $("#catGrid");
  if (catGrid) {
    // Visuel de chaque catégorie : rendu d'un produit phare ou photo
    const vis = { iphone: "ip17pm", android: "s25u", ordinateur: "mba13", tablette: "ipadair", montre: "awultra", audio: "apmax", gaming: "ps5", accessoires: "ap4" };
    catGrid.innerHTML = CATEGORIES.map((c) => {
      const n = PRODUCTS.filter((p) => p.cat === c.id).length;
      const p = PRODUCTS.find((x) => x.id === vis[c.id]);
      return `<a class="cat reveal" href="boutique.html?cat=${c.id}">
        <span class="cat__media">${p ? media(p) : icon(c.icon, "ico--xl")}</span>
        <span class="cat__label">${c.label}</span><span class="cat__count">${n} produit${n > 1 ? "s" : ""}</span>
      </a>`;
    }).join("");
  }
  const featured = $("#featuredGrid");
  if (featured) {
    const tabs = $$("[data-feat]");
    const draw = (cat) => {
      const list = PRODUCTS.filter((p) => cat === "all" ? p.featured : p.cat === cat).slice(0, 8);
      featured.innerHTML = list.map(card).join("");
      observeReveal();
    };
    tabs.forEach((t) => t.addEventListener("click", () => {
      tabs.forEach((x) => { x.classList.toggle("is-active", x === t); x.setAttribute("aria-selected", x === t); });
      draw(t.dataset.feat);
    }));
    draw("all");
  }

  /* ---------- Page boutique ---------- */
  if (document.body.dataset.page === "shop") {
    const grid = $("#shopGrid"), search = $("#shopSearch"), sort = $("#shopSort"),
      chips = $("#catChips"), brandSel = $("#brandFilter"), condSel = $("#condFilter"), count = $("#shopCount");
    const params = new URLSearchParams(location.search);
    let cat = params.get("cat") || "all";
    let series = params.get("series") || "";
    const seriesBox = $("#seriesChips");
    if (params.get("q")) search.value = params.get("q");

    chips.innerHTML = `<button type="button" class="chip" data-cat="all">Tout</button>` +
      CATEGORIES.map((c) => `<button type="button" class="chip" data-cat="${c.id}">${icon(c.icon)} ${c.label}</button>`).join("");
    [...new Set(PRODUCTS.map((p) => p.brand))].sort().forEach((b) => brandSel.insertAdjacentHTML("beforeend", `<option>${esc(b)}</option>`));

    const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    function draw() {
      $$(".chip", chips).forEach((c) => { c.classList.toggle("is-active", c.dataset.cat === cat); c.setAttribute("aria-pressed", c.dataset.cat === cat); });
      const sList = [...new Set(PRODUCTS.filter((p) => p.cat === cat && p.series).map((p) => p.series))];
      if (!sList.includes(series)) series = "";
      seriesBox.hidden = sList.length < 2;
      seriesBox.innerHTML = `<button type="button" class="chip chip--sm ${series ? "" : "is-active"}" data-series="">Tous</button>` +
        sList.map((x) => `<button type="button" class="chip chip--sm ${x === series ? "is-active" : ""}" data-series="${esc(x)}" aria-pressed="${x === series}">${esc(x)}</button>`).join("");
      const q = norm(search.value.trim());
      let list = PRODUCTS.filter((p) =>
        (cat === "all" || p.cat === cat) &&
        (!series || p.series === series) &&
        (!brandSel.value || p.brand === brandSel.value) &&
        (!condSel.value || (condSel.value === "refurb" ? p.badge === "Reconditionné" : p.badge !== "Reconditionné")) &&
        (!q || norm(`${p.name} ${p.brand} ${p.series || ""} ${catOf(p.cat).label} ${p.desc || ""}`).includes(q)));
      if (sort.value === "asc") list.sort((a, b) => a.price - b.price);
      if (sort.value === "desc") list.sort((a, b) => b.price - a.price);
      if (sort.value === "name") list.sort((a, b) => a.name.localeCompare(b.name));
      count.textContent = `${list.length} produit${list.length > 1 ? "s" : ""}`;
      grid.innerHTML = list.length ? list.map(card).join("") :
        `<div class="empty">Aucun produit ne correspond à votre recherche.<br/><a class="btn btn--wa" target="_blank" rel="noopener" href="${waLink("Bonjour Hi-Tech, je recherche : " + search.value)}">${icon("whatsapp")} Demander sur WhatsApp</a></div>`;
      observeReveal();
      const t = $("#shopTitle"); if (t) t.textContent = cat === "all" ? "Tous nos produits" : (series || catOf(cat).label);
    }
    chips.addEventListener("click", (e) => {
      const c = e.target.closest(".chip"); if (!c) return;
      cat = c.dataset.cat; series = "";
      const u = new URL(location); cat === "all" ? u.searchParams.delete("cat") : u.searchParams.set("cat", cat); u.searchParams.delete("series"); history.replaceState(null, "", u);
      draw();
    });
    seriesBox.addEventListener("click", (e) => {
      const c = e.target.closest("[data-series]"); if (!c) return;
      series = c.dataset.series;
      const u = new URL(location); series ? u.searchParams.set("series", series) : u.searchParams.delete("series"); history.replaceState(null, "", u);
      draw();
    });
    [search, sort, brandSel, condSel].forEach((el) => el.addEventListener("input", draw));
    draw();
  }

  /* ---------- Estimation de reprise (échange) ---------- */
  const tradeForm = $("#tradeForm");
  if (tradeForm) {
    // Valeurs de base indicatives (FCFA) — à ajuster par la boutique
    const BASE = { "iPhone 16 / 16 Pro / Pro Max": 420000, "iPhone 15 / 15 Pro / Pro Max": 320000, "iPhone 14 / 14 Pro / Pro Max": 230000,
      "iPhone 13 / 13 Pro / Pro Max": 170000, "iPhone 12 / 12 Pro / Pro Max": 120000, "iPhone 11 / XR / XS": 75000,
      "Samsung Galaxy S (récent)": 220000, "Samsung Galaxy A": 60000, "MacBook (M1 ou plus récent)": 320000, "Autre appareil": 0 };
    const COND = { "Comme neuf": 1, "Bon état": 0.85, "Rayures visibles": 0.7, "Écran ou dos fissuré": 0.45 };
    const model = $("#tradeModel"), cond = $("#tradeCond"), out = $("#tradeResult");
    model.innerHTML = Object.keys(BASE).map((k) => `<option>${k}</option>`).join("");
    cond.innerHTML = Object.keys(COND).map((k) => `<option>${k}</option>`).join("");
    const calc = () => {
      const b = BASE[model.value] * COND[cond.value];
      const round = (n) => Math.round(n / 5000) * 5000;
      out.innerHTML = b ? `Estimation : <strong>${fcfa(round(b * 0.85))} – ${fcfa(round(b))}</strong>` : `<strong>Estimation sur place</strong> — envoyez-nous des photos.`;
      $("#tradeWa").href = waLink(`Bonjour Hi-Tech, je souhaite faire un échange.\nMon appareil : ${model.value}\nÉtat : ${cond.value}\nEstimation affichée sur le site : ${out.textContent.replace("Estimation : ", "")}\nQuel appareil puis-je avoir en échange ?`);
    };
    tradeForm.addEventListener("input", calc); calc();
  }

  /* ---------- Formulaire réparation / installation ---------- */
  const repair = $("#repairForm");
  if (repair) repair.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(repair);
    if (!d.get("name") || !d.get("device")) { toast("Merci d'indiquer votre nom et votre appareil."); return; }
    const msg = `Bonjour Hi-Tech, je souhaite un rendez-vous.\nService : ${d.get("service")}\nAppareil : ${d.get("device")}\nProblème : ${d.get("issue") || "-"}\nNom : ${d.get("name")}\nTéléphone : ${d.get("phone") || "-"}`;
    window.open(waLink(msg), "_blank", "noopener");
  });

  /* ---------- FAQ ---------- */
  $$(".faq__q").forEach((q) => q.addEventListener("click", () => {
    const open = q.getAttribute("aria-expanded") === "true";
    q.setAttribute("aria-expanded", !open);
    q.nextElementSibling.style.maxHeight = open ? null : q.nextElementSibling.scrollHeight + "px";
  }));

  /* ---------- Animations au défilement ---------- */
  function observeReveal() {
    const els = $$(".reveal:not(.is-in)");
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) { els.forEach((el) => el.classList.add("is-in")); return; }
    io = io || new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }), { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Compteurs ---------- */
  const counters = $$("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const co = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target, end = +el.dataset.count, t0 = performance.now();
      const step = (t) => { const k = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))).toLocaleString("fr-FR"); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step); co.unobserve(el);
    }), { threshold: 0.5 });
    counters.forEach((c) => co.observe(c));
  }

  /* ---------- Divers ---------- */
  $$("[data-wa]").forEach((a) => { a.href = waLink(a.dataset.wa || "Bonjour Hi-Tech !"); a.target = "_blank"; a.rel = "noopener"; });
  $$("[data-year]").forEach((y) => (y.textContent = new Date().getFullYear()));
  $$("[data-icon]").forEach((el) => el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon)));
  $$("[data-render-id]").forEach((el) => { const p = PRODUCTS.find((x) => x.id === el.dataset.renderId); if (p) el.innerHTML = media(p); });
  renderCart();
  observeReveal();
})();
