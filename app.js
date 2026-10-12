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
          ${c.address ? `<a class="gig__addr" href="https://yandex.ru/maps/?text=${encodeURIComponent(c.city + ", " + c.address)}" target="_blank" rel="noopener">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>${esc(c.address)}</a>` : ""}
        </div>
        <button class="btn btn--red gig__buy" data-gig="${i}">Купить билет</button>
      </li>`).join("");

    const next = concerts[0];
    const heroBuy = $("#heroBuy");
    if (next && heroBuy) {
      $("#heroNext").innerHTML = `
        <p class="eyebrow"><span class="dot" aria-hidden="true"></span>Ближайший концерт</p>
        <p class="hero__next-date">${next.d.getDate()} ${MONTHS[next.d.getMonth()]} · ${esc(next.city)}</p>
        <p class="hero__next-venue">${esc(next.venue)} · ${esc(next.time)}${next.address ? " · " + esc(next.address) : ""}</p>`;
      heroBuy.dataset.gig = "0";
    } else if (heroBuy) {
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
    if (sticky && $(".hero")) {
    let pastHero = false, onTour = false;
    const upd = () => sticky.classList.toggle("is-on", pastHero && !onTour);
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; upd(); }).observe($(".hero"));
    new IntersectionObserver(([e]) => { onTour = e.isIntersecting; upd(); }, { rootMargin: "0px 0px -20% 0px" }).observe($("#concerts"));
    }
  }

  // --- Музыка: популярные треки и трейлеры ---
  const M = window.MUSIC;
  const audio = new Audio();
  audio.preload = "none";
  if ($("#ptracks") && M) {
    $("#artistListen").href = M.artistUrl;
    $("#listeners").textContent = M.listeners;
    const fullUrl = t => t.url || "https://music.yandex.ru/search?text=" + encodeURIComponent("ZaGa " + t.title);
    const list = $("#ptracks");
    list.innerHTML = M.tracks.map((t, i) => `
      <li class="ptrack" data-row="${i}">
        <button class="ptrack__main" data-track="${i}" aria-label="Трейлер: ${esc(t.title)}">
          <span class="ptrack__n">
            <span class="ptrack__num">${i + 1}</span>
            <span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>
            <svg class="ptrack__play" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>
            <svg class="ptrack__pause" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
          </span>
          <span class="ptrack__cover"><img src="${esc(t.cover)}" alt="" loading="lazy" width="96" height="96"></span>
          <span class="ptrack__text">
            <span class="ptrack__title">${esc(t.title)}</span>
            <span class="ptrack__artist">ZaGa${t.feat ? ", " + esc(t.feat) : ""}</span>
            <span class="ptrack__progress" aria-hidden="true"><i></i></span>
          </span>
        </button>
        <span class="ptrack__dur" data-dur>0:30</span>
        <a class="ptrack__full" href="${esc(fullUrl(t))}" target="_blank" rel="noopener" aria-label="«${esc(t.title)}» полностью на Яндекс Музыке">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>
        </a>
      </li>`).join("");

    const player = $("#player");
    let cur = -1, queue = false;
    const rows = [...list.children];
    // Длительность берём из самих файлов нарезок, когда блок приближается к экрану
    const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
    const lens = [];
    const durEl = i => rows[i].querySelector("[data-dur]");
    new IntersectionObserver(([e], io) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      M.tracks.forEach((t, i) => {
        const a = new Audio(); a.preload = "metadata";
        a.addEventListener("loadedmetadata", () => { lens[i] = a.duration; if (i !== cur) durEl(i).textContent = fmt(a.duration); }, { once: true });
        a.src = t.trailer;
      });
    }, { rootMargin: "400px" }).observe(list);
    const ui = () => {
      const playing = !audio.paused;
      rows.forEach((r, i) => { r.classList.toggle("is-current", i === cur); r.classList.toggle("is-playing", i === cur && playing); });
      player.classList.toggle("is-paused", !playing);
      $("#playerToggle").setAttribute("aria-label", playing ? "Пауза" : "Играть");
      $("#trailerAll").classList.toggle("is-on", queue && playing);
      $("#trailerAll span").textContent = queue && playing ? "Пауза" : "Трейлер";
    };
    const resetDur = i => { if (i > -1 && lens[i]) durEl(i).textContent = fmt(lens[i]); };
    const play = (i, fromQueue = false) => {
      queue = fromQueue;
      if (i === cur) { audio.paused ? audio.play() : audio.pause(); return; }
      resetDur(cur);
      const t = M.tracks[i];
      cur = i;
      audio.src = t.trailer;
      audio.play().catch(() => {});
      $("#playerCover").src = t.cover;
      $("#playerTitle").textContent = t.title;
      $("#playerArtist").textContent = "ZaGa" + (t.feat ? ", " + t.feat : "");
      $("#playerFull").href = fullUrl(t);
      player.hidden = false;
      requestAnimationFrame(() => player.classList.add("is-open"));
      document.body.classList.add("has-player");
    };
    list.addEventListener("click", e => { const b = e.target.closest("[data-track]"); if (b) play(+b.dataset.track, queue); });
    $("#trailerAll").addEventListener("click", () => {
      if (queue && cur > -1) { audio.paused ? audio.play() : audio.pause(); return; }
      cur = -1; // трейлер всегда начинается с первого трека
      play(0, true);
    });
    $("#playerToggle").addEventListener("click", () => audio.paused ? audio.play() : audio.pause());
    $("#playerClose").addEventListener("click", () => {
      audio.pause(); resetDur(cur); cur = -1; queue = false;
      player.classList.remove("is-open"); document.body.classList.remove("has-player");
      setTimeout(() => { player.hidden = true; }, 250); ui();
    });
    ["play", "pause"].forEach(ev => audio.addEventListener(ev, ui));
    audio.addEventListener("timeupdate", () => {
      const p = audio.duration ? audio.currentTime / audio.duration : 0;
      if (cur > -1 && audio.duration) durEl(cur).textContent = "−" + fmt(Math.max(0, audio.duration - audio.currentTime));
      $("#playerProgress").style.transform = `scaleX(${p})`;
      const bar = rows[cur]?.querySelector(".ptrack__progress i");
      if (bar) bar.style.transform = `scaleX(${p})`;
    });
    audio.addEventListener("ended", () => {
      if (queue && cur < M.tracks.length - 1) play(cur + 1, true);
      else { queue = false; resetDur(cur); ui(); }
    });
  }

  // --- Магазин: коллаж с параллаксом ---
  if ($("#merch")) {
    $("#shopLink").href = window.SHOP_URL;
    $("#merch").innerHTML = (window.MERCH || []).map((m, i) => `
      <li class="tee" style="--i:${i}">
        <figure class="tee__card" data-depth="${[0.18, -0.12, 0.08, -0.2, 0.15, -0.06][i % 6]}">
          <span class="tee__tape" aria-hidden="true"></span>
          <img src="${esc(m.img)}" alt="${esc(m.name)}, ${esc(m.color.toLowerCase())}" loading="lazy">
          <figcaption class="tee__tag"><b>${esc(m.price)}</b><span>${esc(m.name)}</span></figcaption>
        </figure>
      </li>`).join("");

    if (!reduced()) {
      const shop = $("#shop");
      const cards = [...shop.querySelectorAll("[data-depth]")];
      const drift = [...shop.querySelectorAll("[data-drift]")];
      let on = false, raf = 0;
      const frame = () => {
        raf = 0;
        const r = shop.getBoundingClientRect();
        const p = (innerHeight - r.top) / (innerHeight + r.height) - .5; // −0.5…0.5, пока секция на экране
        cards.forEach(c => c.style.setProperty("--py", (p * c.dataset.depth * 600).toFixed(1) + "px"));
        drift.forEach(d => d.style.transform = `translateX(${(p * d.dataset.drift * 30).toFixed(2)}%)`);
      };
      new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) frame(); }).observe(shop);
      addEventListener("scroll", () => { if (on && !raf) raf = requestAnimationFrame(frame); }, { passive: true });
    }
  }

  // --- Сниппеты: лента на главной и сетка на вкладке «Видео» ---
  const V = window.VIDEOS || [];
  const lists = document.querySelectorAll("[data-snips]");
  const strip = $("#strip");
  if (lists.length || strip || $("#featCard")) {
    const quiet = reduced() || navigator.connection?.saveData;
    const featIdx = Math.max(0, V.findIndex(v => v.featured));
    lists.forEach(list => {
      const skip = "skipFeatured" in list.dataset ? featIdx : -1;
      list.innerHTML = V.map((v, i) => i === skip ? "" : `
        <li><button class="snip" data-video="${i}" aria-label="Смотреть: ${esc(v.title)}">
          <img src="video/${esc(v.slug)}.webp" alt="" loading="lazy" width="540" height="960">
          ${quiet ? "" : `<video muted loop playsinline preload="none" data-src="video/${esc(v.slug)}-preview.mp4" aria-hidden="true"></video>`}
          <span class="snip__play" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg></span>
          <span class="snip__dur">${esc(v.duration)}</span>
          <span class="snip__info"><span class="snip__title">${esc(v.title)}</span></span>
        </button></li>`).join("");
    });

    // Бесконечная лента: набор роликов дважды подряд, анимация сдвигает ровно на один набор
    if (strip) {
      const card = (v, i, dup) => `
        <li${dup ? ' aria-hidden="true"' : ""}><button class="strip__item" data-video="${i}" ${dup ? 'tabindex="-1"' : `aria-label="Смотреть: ${esc(v.title)}"`}>
          <img src="video/${esc(v.slug)}.webp" alt="" loading="lazy" width="540" height="960">
          ${quiet ? "" : `<video muted loop playsinline preload="none" data-src="video/${esc(v.slug)}-preview.mp4" aria-hidden="true"></video>`}
          <span class="strip__title">${esc(v.title)}</span>
        </button></li>`;
      strip.innerHTML = V.map((v, i) => card(v, i, false)).join("") + V.map((v, i) => card(v, i, true)).join("");
      strip.style.setProperty("--dur", V.length * 5 + "s");
    }

    // Превью играют только пока карточка на экране
    const vio = new IntersectionObserver(es => es.forEach(e => {
      const vid = e.target;
      if (e.isIntersecting) {
        if (!vid.src) vid.src = vid.dataset.src;
        vid.play().then(() => vid.classList.add("is-playing")).catch(() => {});
      } else vid.pause();
    }), { threshold: .2 });
    document.querySelectorAll(".snip video, .strip__item video").forEach(v => vio.observe(v));

    // Плеер со звуком
    const modal = $("#videoModal");
    const open = setupModal(modal);
    const openVideo = i => {
      const v = V[i];
      $("#videoTitle").textContent = v.title;
      $("[data-modal-body]", modal).innerHTML =
        `<video src="video/${esc(v.slug)}.mp4" poster="video/${esc(v.slug)}.webp" controls autoplay playsinline></video>` +
        (v.ig ? `<a class="modal__ig" href="${esc(v.ig)}" target="_blank" rel="noopener">Смотреть в Instagram ↗</a>` : "");
      audio.pause();
      open();
    };
    document.addEventListener("click", e => {
      const b = e.target.closest("[data-video]");
      if (b) openVideo(+b.dataset.video);
    });

    // «Премьера» на вкладке «Видео»
    const feat = $("#featCard");
    if (feat) {
      const fi = Math.max(0, V.findIndex(v => v.featured));
      const v = V[fi];
      $("#featPoster").src = `video/${v.slug}.webp`;
      $("#feat-title").textContent = v.title;
      const ig = $("#featIg");
      v.ig ? (ig.href = v.ig) : ig.remove();
      const fv = $("#featVideo");
      if (quiet) fv.remove();
      else {
        fv.src = `video/${v.slug}-preview.mp4`;
        fv.play().then(() => fv.classList.add("is-playing")).catch(() => {});
      }
      feat.addEventListener("click", () => openVideo(fi));
      $("#featPlay").addEventListener("click", () => openVideo(fi));
    }
  }

  // --- Контакты, соцсети ---
  const C = window.CONTACTS;
  const socials = C.socials.filter(s => s.url);
  if ($("#contactCard")) {
    $("#contactCard").innerHTML = `
      <p class="contact-card__name">${esc(C.manager)}</p>
      <p class="muted">${esc(C.role)}</p>
      <div class="contact-card__links">
        <a class="btn btn--light" href="tel:${C.phone.replace(/[^\d+]/g, "")}">${esc(C.phone)}</a>
        <a class="btn btn--ghost" href="https://t.me/${esc(C.telegram)}" target="_blank" rel="noopener">Telegram</a>
        ${C.email ? `<a class="btn btn--ghost" href="mailto:${esc(C.email)}">${esc(C.email)}</a>` : ""}
      </div>`;
  }
  document.querySelectorAll("[data-socials-short]").forEach(el => {
    el.innerHTML = socials.filter(s => /Telegram|Instagram/.test(s.name))
      .map(s => `<a class="btn btn--ghost btn--sm" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>`).join("");
  });
  document.querySelectorAll("[data-socials]").forEach(el => {
    el.innerHTML = socials.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>`).join("");
  });
  const projects = $("#projects");
  if (projects && C.projects) {
    projects.innerHTML = C.projects.map(p => `
      <a class="project" href="${esc(p.url)}" target="_blank" rel="noopener">
        <span class="project__name">${esc(p.name)}</span><span class="project__note">${esc(p.note)}</span>
      </a>`).join("");
  }

  // --- Пункт меню «Музыка» ведёт на Яндекс Музыку ---
  document.querySelectorAll("[data-yandex]").forEach(a => { if (window.MUSIC) a.href = window.MUSIC.artistUrl; });

  // --- Обратный отсчёт до ближайшего концерта (страница «Концерты») ---
  const cd = $("#countdown");
  if (cd) {
    const plural = (n, f) => f[(n % 10 === 1 && n % 100 !== 11) ? 0 : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? 1 : 2];
    const UNITS = { d: ["день", "дня", "дней"], h: ["час", "часа", "часов"], m: ["минута", "минуты", "минут"], s: ["секунда", "секунды", "секунд"] };
    const nextGig = () => (window.CONCERTS || [])
      .map(c => ({ ...c, t: new Date(`${c.date}T${c.time || "00:00"}:00+05:00`) })) // время Уфы
      .filter(c => c.t > Date.now()).sort((a, b) => a.t - b.t)[0];
    let gig = nextGig();
    const tick = () => {
      if (!gig || gig.t <= Date.now()) gig = nextGig();
      if (!gig) { cd.hidden = true; return; }
      cd.hidden = false;
      $("#cdLabel").textContent = `До концерта-дискотеки · ${gig.city}`;
      let s = Math.floor((gig.t - Date.now()) / 1000);
      const v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
      for (const k in v) {
        $(`[data-cd="${k}"]`, cd).textContent = String(v[k]).padStart(2, "0");
        $(`[data-cdu="${k}"]`, cd).textContent = plural(v[k], UNITS[k]);
      }
    };
    tick(); setInterval(tick, 1000);
  }

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

  // --- Переход с другой страницы на раздел (./#contacts): докрутить после отрисовки блоков ---
  if (location.hash.length > 1) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) {
      const go = () => target.scrollIntoView({ block: "start" });
      requestAnimationFrame(go);
      document.fonts?.ready.then(go);
      addEventListener("load", go, { once: true });
    }
  }

  // --- Появление при скролле ---
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.setProperty("--d", (i % 6) * 60 + "ms");
    io.observe(el);
  });
})();
