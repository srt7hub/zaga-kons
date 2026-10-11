// Все данные сайта. Чтобы добавить концерт — допиши строку в CONCERTS.
// Прошедшие концерты скрываются автоматически, порядок сортируется по дате.
// qtickets — ссылка на событие в Qtickets (пока заглушки).

window.CONCERTS = [
  { date: "2026-11-06", time: "21:00", city: "Белорецк",     venue: "Клуб «Рай»",               qtickets: "" },
  { date: "2026-11-07", time: "21:00", city: "Магнитогорск", venue: "Cloud Bar",                qtickets: "" },
  { date: "2026-11-08", time: "21:00", city: "Учалы",        venue: "Маями Бар",                qtickets: "" },
  { date: "2026-11-09", time: "21:00", city: "Сибай",        venue: "Клуб «Рандеву»",           qtickets: "" },
  { date: "2026-11-14", time: "20:00", city: "Челябинск",    venue: "Кафе «Бай Кунак»",         qtickets: "" },
  { date: "2026-11-22", time: "20:00", city: "Екатеринбург", venue: "Ресторан «Планетарий»",    qtickets: "" },
  { date: "2026-11-29", time: "21:00", city: "Нефтекамск",   venue: "Клуб «Моёт»",              qtickets: "" },
  { date: "2026-12-12", time: "19:00", city: "Уфа",          venue: "Конгресс-холл «Торатау»",  qtickets: "" },
  { date: "2026-12-19", time: "19:00", city: "Казань",       venue: "Пирамида",                 qtickets: "" }
];

window.RELEASE = {
  title: "Тәрҗемә",
  type: "Сингл · 2026",
  cover: "img/release.webp",
  links: [
    { name: "Яндекс Музыка", url: "#" },
    { name: "VK Музыка",     url: "#" },
    { name: "Apple Music",   url: "#" },
    { name: "YouTube Music", url: "#" }
  ]
};

window.TRACKS = [
  { title: "Тәрҗемә",       year: "2026", url: "#" },
  { title: "Дискотека",     year: "2026", url: "#" },
  { title: "Кызыл",         year: "2025", url: "#" },
  { title: "Төнгө ҡала",    year: "2025", url: "#" }
];

window.SHOP_URL = "https://instagram.com/";

window.MERCH = [
  { name: "Футболка «Башҡортостан»",    color: "Чёрная", price: "2 900 ₽", img: "img/merch-1.webp" },
  { name: "Футболка «Төрким»",          color: "Белая",  price: "2 500 ₽", img: "img/merch-2.webp" },
  { name: "Футболка «Башҡортостан»",    color: "Белая",  price: "2 900 ₽", img: "img/merch-3.webp" },
  { name: "Лонгслив «Made in Bashkortostan»", color: "Чёрный", price: "3 400 ₽", img: "img/merch-4.webp" },
  { name: "Свитшот «Татар кызы»",       color: "Чёрный", price: "3 900 ₽", img: "img/merch-5.webp" },
  { name: "Худи «Made in Bashkortostan»", color: "Чёрное", price: "5 200 ₽", img: "img/merch-6.webp" }
];

window.CONTACTS = {
  manager: "Айдар",
  role: "Концертный директор",
  phone: "+7 900 000-00-00",
  telegram: "zaga_booking",
  email: "booking@zaga.ru",
  socials: [
    { name: "Instagram", url: "#" },
    { name: "ВКонтакте", url: "#" },
    { name: "Telegram",  url: "#" },
    { name: "YouTube",   url: "#" },
    { name: "TikTok",    url: "#" }
  ]
};

// Сниппеты: video/<slug>.mp4 — полное видео, <slug>-preview.mp4 — беззвучное превью для карточки, <slug>.webp — обложка.
window.VIDEOS = [
  { slug: "auyl",              title: "Ауылда диско",      tag: "Скоро релиз", duration: "0:33" },
  { slug: "eto-bashkortostan", title: "Это Башкортостан",  tag: "Сниппет",     duration: "0:51" },
  { slug: "yaz-kile",          title: "Яз килә 2.0",       tag: "В сети · с Рустамом Гиззатуллиным", duration: "0:29" },
  { slug: "yana-yorek",        title: "Яна йөрәк",         tag: "Скоро релиз", duration: "0:36" },
  { slug: "banda-02",          title: "Банда 02",          tag: "В сети",      duration: "0:31" },
  { slug: "yurta",             title: "Юрта",              tag: "Скоро релиз", duration: "0:32" },
  { slug: "new-year",          title: "Новогодний трек",   tag: "Сниппет",     duration: "0:37" },
  { slug: "trek-v-seti",       title: "Новый трек",        tag: "В сети",      duration: "0:32" }
];
