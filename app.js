(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const MONTHS = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
  const MON_SHORT = ["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"];
  const DAYS = ["вс","пн","вт","ср","чт","пт","сб"];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Окна (покупка билета, плеер): плавное закрытие ---
  const setupModal = modal => {
    const close = () => {
      if (!modal.open || modal.classList.contains("is-closing")) return;
      if (reduced()) return modal.close();
      modal.classList.add("is-closing");
      let done = false;
      const finish = () => { if (done) return; done = true; modal.classList.remove("is-closing"); modal.close(); };
      modal.addEventListener("animationend", finish, { once: true });
      setTimeout(finish, 300); // на случай, если анимация не запустилась
    };
    modal.addEventListener("cancel", e => { e.preventDefault(); close(); });
    modal.addEventListener("click", e => { if (e.target === modal) close(); });
    modal.addEventListener("close", () => { document.body.classList.remove("no-scroll"); $("[data-modal-body]", modal).innerHTML = ""; });
    $("[data-modal-close]", modal).addEventListener("click", close);
    return () => { modal.showModal(); document.body.classList.add("no-scroll"); };
  };

  // --- Афиша (главная) ---
  const tour = $("#tour");
  if (tour) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const concerts = (window.CONCERTS || [])
      .map(c => ({ ...c, d: new Date(c.date + "T00:00:00") }))
      .filter(c => c.d >= today)
      .sort((a, b) => a.d - b.d);

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
    const heroBuy = $("#heroBuy");
    if (next) {
      $("#heroNext").innerHTML = `
        <p class="eyebrow"><span class="dot" aria-hidden="true"></span>Ближайший концерт</p>
        <p class="hero__next-date">${next.d.getDate()} ${MONTHS[next.d.getMonth()]} · ${esc(next.city)}</p>
        <p class="hero__next-venue">${esc(next.venue)} · ${esc(next.time)}</p>`;
      heroBuy.dataset.gig = "0";
    } else {
      heroBuy.addEventListener("click", () => $("#concerts").scrollIntoView());
    }

    const modal = $("#ticketModal");
    const open = setupModal(modal);
    const openTickets = c => {
      $("#modalDate").textContent = `${c.d.getDate()} ${MONTHS[c.d.getMonth()]} · ${c.time}`;
      $("#modalTitle").textContent = `${c.city} — ${c.venue}`;
      $("[data-modal-body]", modal).innerHTML = c.qtickets
        ? `<iframe src="${esc(c.qtickets)}" title="Покупка билета" loading="lazy"></iframe>`
        : `<div class="modal__stub">
             <p>Здесь откроется виджет Qtickets: выбор мест и оплата картой, не уходя с сайта.</p>
             <p class="muted">Ссылка на это событие ещё не добавлена.</p>
           </div>`;
      open();
    };
    document.addEventListener("click", e => {
      const b = e.target.closest("[data-gig]");
      if (b) openTickets(concerts[+b.dataset.gig]);
    });

    // Кнопка «Купить» снизу на телефоне: видна после первого экрана, прячется у афиши
    const sticky = $("#stickyBuy");
    let pastHero = false, onTour = false;
    const upd = () => sticky.classList.toggle("is-on", pastHero && !onTour);
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; upd(); }).observe($(".hero"));
    new IntersectionObserver(([e]) => { onTour = e.isIntersecting; upd(); }, { rootMargin: "0px 0px -20% 0px" }).observe($("#concerts"));
  }

  // --- Музыка ---
  const R = window.RELEASE;
  if ($("#platforms") && R) {
    $("#releaseType").textContent = "Новый релиз · " + R.type;
    $("#releaseTitle").textContent = R.title;
    $("#releaseCover").alt = `Обложка: ${R.title}`;
    $("#platforms").innerHTML = R.links.map(l =>
      `<a class="platform" href="${esc(l.url)}" target="_blank" rel="noopener">
         <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>${esc(l.name)}</a>`).join("");
    $("#tracks").innerHTML = (window.TRACKS || []).map((t, i) => `
      <li><a class="track" href="${esc(t.url)}" target="_blank" rel="noopener">
        <span class="track__n">${String(i + 1).padStart(2, "0")}</span>
        <span class="track__t">${esc(t.title)}</span>
        <span class="track__y">${esc(t.year)}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>
      </a></li>`).join("");
  }

  // --- Магазин ---
  if ($("#merch")) {
    $("#shopLink").href = window.SHOP_URL;
    $("#merch").innerHTML = (window.MERCH || []).map(m => `
      <li class="reveal"><a class="item" href="${esc(window.SHOP_URL)}" target="_blank" rel="noopener">
        <span class="item__img"><img src="${esc(m.img)}" alt="${esc(m.name)}, ${esc(m.color.toLowerCase())}" loading="lazy"></span>
        <span class="item__name">${esc(m.name)}</span>
        <span class="item__meta"><span>${esc(m.color)}</span><b>${esc(m.price)}</b></span>
        <span class="item__cta">Заказать в Instagram</span>
      </a></li>`).join("");
  }

  // --- Видео (вкладка) ---
  const grid = $("#videos");
  if (grid) {
    const V = window.VIDEOS || [];
    grid.innerHTML = V.map((v, i) => `
      <li><button class="snip" data-video="${i}" aria-label="Смотреть: ${esc(v.title)}">
        <img src="${esc(v.poster)}" alt="" loading="${i < 4 ? "eager" : "lazy"}" width="540" height="960">
        <span class="snip__play" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg></span>
        <span class="snip__dur">${esc(v.duration)}</span>
        <span class="snip__info"><span class="snip__tag">${esc(v.tag)}</span><span class="snip__title">${esc(v.title)}</span></span>
      </button></li>`).join("");

    const modal = $("#videoModal");
    const open = setupModal(modal);
    grid.addEventListener("click", e => {
      const b = e.target.closest("[data-video]");
      if (!b) return;
      const v = V[+b.dataset.video];
      $("#videoTitle").textContent = v.title;
      $("#videoTag").textContent = v.tag;
      $("[data-modal-body]", modal).innerHTML =
        v.src ? `<video src="${esc(v.src)}" poster="${esc(v.poster)}" controls autoplay playsinline></video>`
        : v.url ? `<iframe src="${esc(v.url)}" title="${esc(v.title)}" allow="autoplay; fullscreen; encrypted-media" allowfullscreen></iframe>`
        : `<div class="player-stub" style="background-image:url('${esc(v.poster)}')"><p>Видео скоро появится</p></div>`;
      open();
    });
  }

  // --- Контакты, соцсети ---
  const C = window.CONTACTS;
  if ($("#contactCard")) {
    $("#contactCard").innerHTML = `
      <p class="contact-card__name">${esc(C.manager)}</p>
      <p class="muted">${esc(C.role)}</p>
      <div class="contact-card__links">
        <a class="btn btn--light" href="tel:${C.phone.replace(/[^\d+]/g, "")}">${esc(C.phone)}</a>
        <a class="btn btn--ghost" href="https://t.me/${esc(C.telegram)}" target="_blank" rel="noopener">Telegram</a>
        <a class="btn btn--ghost" href="mailto:${esc(C.email)}">${esc(C.email)}</a>
      </div>`;
  }
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

  // --- Активный пункт меню (только для разделов этой страницы) ---
  const navLinks = [...document.querySelectorAll(".nav a")].filter(a => a.pathname === location.pathname && a.hash);
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
