// Все данные сайта. Чтобы добавить концерт — допиши строку в CONCERTS.
// Прошедшие концерты скрываются автоматически, порядок сортируется по дате.
// qtickets — ссылка на событие в Qtickets (пока заглушки).

window.CONCERTS = [
  { date: "2026-11-27", time: "21:00", city: "Уфа", venue: "Огни Уфы", address: "ул. 50 лет Октября, 19", qtickets: "" }
];

// Блок «Музыка» в стиле страницы артиста. url трека — ссылка на трек в Яндекс Музыке
// (пока стоит поиск по названию; заменить на точные ссылки треков).
window.MUSIC = {
  artistUrl: "https://music.yandex.ru/search?text=ZaGa",
  listeners: "66 725",
  avatar: "img/release.webp",
  // trailer — нарезка самой популярной части (audio/<slug>.m4a). Пока вырезана из рилсов, заменить на свои нарезки.
  tracks: [
    { title: "Это Башкортостан", feat: "",                   duration: "2:41", cover: "video/eto-bashkortostan.webp", trailer: "audio/eto-bashkortostan.m4a" },
    { title: "Яз килә 2.0",      feat: "Рустам Гиззатуллин", duration: "2:58", cover: "video/yaz-kile.webp",          trailer: "audio/yaz-kile.m4a" },
    { title: "Банда 02",         feat: "",                   duration: "2:33", cover: "video/banda-02.webp",          trailer: "audio/banda-02.m4a" },
    { title: "Ауылда диско",     feat: "",                   duration: "3:05", cover: "video/auyl.webp",              trailer: "audio/auyl.m4a" },
    { title: "Юрта",             feat: "",                   duration: "2:47", cover: "video/yurta.webp",             trailer: "audio/yurta.m4a" },
    { title: "Яна йөрәк",        feat: "",                   duration: "3:12", cover: "video/yana-yorek.webp",        trailer: "audio/yana-yorek.m4a" }
  ]
};

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

// Сниппеты (ig — оригинал рилса): video/<slug>.mp4 — полное видео, <slug>-preview.mp4 — беззвучное превью для карточки, <slug>.webp — обложка.
window.VIDEOS = [
  { slug: "auyl",              title: "Ауылда диско",      tag: "Скоро релиз", duration: "0:33" , ig: "https://www.instagram.com/reel/DEC_2yUMi9a/" },
  { slug: "eto-bashkortostan", title: "Это Башкортостан",  tag: "Сниппет",     duration: "0:51" , ig: "https://www.instagram.com/reel/Dci_Nw-ixNW/" },
  { slug: "yaz-kile",          title: "Яз килә 2.0",       tag: "В сети · с Рустамом Гиззатуллиным", duration: "0:29" , ig: "https://www.instagram.com/reel/DPPDE7IguPQ/" },
  { slug: "yana-yorek",        title: "Яна йөрәк",         tag: "Скоро релиз", duration: "0:36" , ig: "https://www.instagram.com/reel/DX9Ch6fi4do/" },
  { slug: "banda-02",          title: "Банда 02",          tag: "В сети",      duration: "0:31" , ig: "https://www.instagram.com/reel/DL9ay1Hsoyt/" },
  { slug: "yurta",             title: "Юрта",              tag: "Скоро релиз", duration: "0:32" , ig: "https://www.instagram.com/reel/C_NaV3iswiW/" },
  { slug: "new-year",          title: "Новогодний трек",   tag: "Сниппет",     duration: "0:37" , ig: "https://www.instagram.com/reel/DSZa5bTgnjo/" },
  { slug: "trek-v-seti",       title: "Новый трек",        tag: "В сети",      duration: "0:32" , ig: "https://www.instagram.com/reel/DHsgi-_CZqq/" }
];
