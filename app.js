(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const MONTHS = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
  const MON_SHORT = ["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"];
  const DAYS = ["вс","пн","вт","ср","чт","пт","сб"];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));

  // --- Афиша ---
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const concerts = (window.CONCERTS || [])
    .map(c => ({ ...c, d: new Date(c.date + "T00:00:00") }))
    .filter(c => c.d >= today)
    .sort((a, b) => a.d - b.d);

  const tour = $("#tour");
  tour.innerHTML = concerts.map((c, i) => `
    <li class="gig">
      <time class="gig__date" datetime="${c.date}">
        <span class="gig__day">${String(c.d.getDate()).padStart(2, "0")}</span>
        <span class="gig__mon">${MON_SHORT[c.d.getMonth()]} · ${DAYS[c.d.getDay()]}</span>
      </time>
      <div class="gig__place">
        <span class="gig__city">${esc(c.city)}</span>
        <span class="gig__venue">${esc(c.venue)} · ${esc(c.time)}</span>
      </div>
      <button class="btn btn--red gig__buy" data-gig="${i}">Купить билет</button>
    </li>`).join("");
  $("#tourEmpty").hidden = concerts.length > 0;

  const next = concerts[0];
  if (next) {
    $("#heroNext").innerHTML = `<span class="dot" aria-hidden="true"></span>Ближайший: ${next.d.getDate()} ${MONTHS[next.d.getMonth()]}, ${esc(next.city)}`;
  }

  // --- Окно покупки ---
  const modal = $("#ticketModal");
  const openTickets = c => {
    $("#modalDate").textContent = `${c.d.getDate()} ${MONTHS[c.d.getMonth()]} · ${c.time}`;
    $("#modalTitle").textContent = `${c.city} — ${c.venue}`;
    $("#modalBody").innerHTML = c.qtickets
      ? `<iframe src="${esc(c.qtickets)}" title="Покупка билета" loading="lazy"></iframe>`
      : `<div class="modal__stub">
           <p>Здесь откроется виджет Qtickets: выбор мест и оплата картой, не уходя с сайта.</p>
           <p class="muted">Ссылка на это событие ещё не добавлена.</p>
         </div>`;
    modal.showModal();
    document.body.classList.add("no-scroll");
  };
  const closeTickets = () => {
    if (!modal.open || modal.classList.contains("is-closing")) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return modal.close();
    modal.classList.add("is-closing");
    let done = false;
    const finish = () => { if (done) return; done = true; modal.classList.remove("is-closing"); modal.close(); };
    modal.addEventListener("animationend", finish, { once: true });
    setTimeout(finish, 300); // на случай, если анимация не запустилась
  };
  modal.addEventListener("cancel", e => { e.preventDefault(); closeTickets(); });
  modal.addEventListener("close", () => { document.body.classList.remove("no-scroll"); $("#modalBody").innerHTML = ""; });
  modal.addEventListener("click", e => { if (e.target === modal) closeTickets(); });
  $("#modalClose").addEventListener("click", closeTickets);
  tour.addEventListener("click", e => {
    const b = e.target.closest("[data-gig]");
    if (b) openTickets(concerts[+b.dataset.gig]);
  });

  // --- Музыка ---
  const R = window.RELEASE;
  if (R) {
    $("#releaseType").textContent = "Новый релиз · " + R.type;
    $("#releaseTitle").textContent = R.title;
    $("#releaseCover").alt = `Обложка: ${R.title}`;
    $("#platforms").innerHTML = R.links.map(l =>
      `<a class="platform" href="${esc(l.url)}" target="_blank" rel="noopener">
         <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>${esc(l.name)}</a>`).join("");
  }
  $("#tracks").innerHTML = (window.TRACKS || []).map((t, i) => `
    <li><a class="track" href="${esc(t.url)}" target="_blank" rel="noopener">
      <span class="track__n">${String(i + 1).padStart(2, "0")}</span>
      <span class="track__t">${esc(t.title)}</span>
      <span class="track__y">${esc(t.year)}</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>
    </a></li>`).join("");

  // --- Магазин ---
  $("#shopLink").href = window.SHOP_URL;
  $("#merch").innerHTML = (window.MERCH || []).map(m => `
    <li class="reveal"><a class="item" href="${esc(window.SHOP_URL)}" target="_blank" rel="noopener">
      <span class="item__img"><img src="${esc(m.img)}" alt="${esc(m.name)}, ${esc(m.color.toLowerCase())}" loading="lazy"></span>
      <span class="item__name">${esc(m.name)}</span>
      <span class="item__meta"><span>${esc(m.color)}</span><b>${esc(m.price)}</b></span>
      <span class="item__cta">Заказать в Instagram</span>
    </a></li>`).join("");

  // --- Контакты ---
  const C = window.CONTACTS;
  $("#contactCard").innerHTML = `
    <p class="contact-card__name">${esc(C.manager)}</p>
    <p class="muted">${esc(C.role)}</p>
    <div class="contact-card__links">
      <a class="btn btn--light" href="tel:${C.phone.replace(/[^\d+]/g, "")}">${esc(C.phone)}</a>
      <a class="btn btn--ghost" href="https://t.me/${esc(C.telegram)}" target="_blank" rel="noopener">Telegram</a>
      <a class="btn btn--ghost" href="mailto:${esc(C.email)}">${esc(C.email)}</a>
    </div>`;
  document.querySelectorAll("[data-socials]").forEach(el => {
    el.innerHTML = C.socials.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>`).join("");
  });

  // --- Шапка, меню ---
  const header = $("#header");
  const onScroll = () => header.classList.toggle("is-solid", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const burger = $("#burger"), menu = $("#menu");
  const setMenu = open => {
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    header.classList.toggle("menu-open", open);
    document.body.classList.toggle("no-scroll", open);
    if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add("is-open")); }
    else { menu.classList.remove("is-open"); setTimeout(() => { menu.hidden = true; }, 250); }
  };
  burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", e => { if (e.key === "Escape" && !menu.hidden) setMenu(false); });

  // --- Кнопка «Купить» снизу на телефоне: видна после первого экрана, прячется у афиши ---
  const sticky = $("#stickyBuy");
  let pastHero = false, onTour = false;
  const upd = () => sticky.classList.toggle("is-on", pastHero && !onTour);
  new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; upd(); }).observe($(".hero"));
  new IntersectionObserver(([e]) => { onTour = e.isIntersecting; upd(); }, { rootMargin: "0px 0px -20% 0px" }).observe($("#concerts"));

  // --- Активный пункт меню ---
  const navLinks = [...document.querySelectorAll(".nav a")];
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle("is-active", a.hash === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  navLinks.forEach(a => { const s = $(a.hash); if (s) spy.observe(s); });

  // --- Появление при скролле ---
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.setProperty("--d", (i % 6) * 60 + "ms");
    io.observe(el);
  });
})();
