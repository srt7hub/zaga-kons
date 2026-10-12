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
  avatar: "img/artist.webp",
  // trailer — нарезка самой популярной части; её длительность сайт берёт из файла сам (audio/<slug>.m4a). Пока вырезана из рилсов, заменить на свои нарезки.
  tracks: [
    { title: "Это Башкортостан", feat: "",                   cover: "video/eto-bashkortostan.webp", trailer: "audio/eto-bashkortostan.m4a" },
    { title: "Яз килә 2.0",      feat: "Рустам Гиззатуллин", cover: "video/yaz-kile.webp",          trailer: "audio/yaz-kile.m4a" },
    { title: "Банда 02",         feat: "",                   cover: "video/banda-02.webp",          trailer: "audio/banda-02.m4a" },
    { title: "Ауылда диско",     feat: "",                   cover: "video/auyl.webp",              trailer: "audio/auyl.m4a" },
    { title: "Юрта",             feat: "",                   cover: "video/yurta.webp",             trailer: "audio/yurta.m4a" },
    { title: "Яна йөрәк",        feat: "",                   cover: "video/yana-yorek.webp",        trailer: "audio/yana-yorek.m4a" },
    { title: "Ауылда суета",     feat: "",                   cover: "video/new-year.webp",          trailer: "audio/new-year.m4a" }
  ]
};

// Бренд одежды ТӨРКӨМ — каталог перенесён из проекта zaga-main (src/data/products.ts).
// Заказ — через Instagram бренда. category: hoodie | tshirt | accessory
window.SHOP_URL = "https://www.instagram.com/turkum.official.02/";
window.PRODUCTS = [
  { id: "h-1", name: "Худи Bashkortostan (бел.)",     price: 4800, category: "hoodie",    img: "img/brand/h-1.webp" },
  { id: "h-4", name: "Худи Tatarstan (черн.)",        price: 4800, category: "hoodie",    img: "img/brand/h-4.webp" },
  { id: "h-2", name: "Худи Bashkortostan (черн.)",    price: 4800, category: "hoodie",    img: "img/brand/h-2.webp" },
  { id: "h-3", name: "Худи Bashkortostan (зел.)",     price: 4800, category: "hoodie",    img: "img/brand/h-3.webp" },
  { id: "t-1", name: "Футболка Башкортостан (черн.)", price: 2500, category: "tshirt",    img: "img/brand/t-1.webp" },
  { id: "t-4", name: "Лонгслив Татар кызы (бел.)",    price: 2500, category: "tshirt",    img: "img/brand/t-4.webp" },
  { id: "t-2", name: "Футболка Башкортостан (бел.)",  price: 2500, category: "tshirt",    img: "img/brand/t-2.webp" },
  { id: "t-3", name: "Лонгслив Башкорт кызы (черн.)", price: 2500, category: "tshirt",    img: "img/brand/t-3.webp" },
  { id: "t-5", name: "Футболка Bashkortostan (черн.)",price: 2500, category: "tshirt",    img: "img/brand/t-5.webp" },
  { id: "b-1", name: "Панама Төрком",                 price: 1500, category: "accessory", img: "img/brand/b-1.webp" },
  { id: "b-3", name: "Кепка Төрком",                  price: 1300, category: "accessory", img: "img/brand/b-3.webp" },
  { id: "b-2", name: "Шапка Төрком",                  price: 1500, category: "accessory", img: "img/brand/b-2.webp" }
];
// Какие вещи показать коллажем на главной (по id)
window.COLLAGE = ["h-1", "t-2", "h-2", "t-4", "b-3", "h-3"];

window.CONTACTS = {
  manager: "Инсаф Агзамов",
  role: "Концертный директор",
  phone: "+7 909 748-56-35",
  telegram: "agzamov_insaf",
  email: "",
  // пустой url — ссылка не показывается
  socials: [
    { name: "Instagram", url: "https://www.instagram.com/zaga.officials/" },
    { name: "ВКонтакте", url: "https://vk.ru/club175389999" },
    { name: "YouTube",   url: "https://www.youtube.com/@pasan4ick" },
    { name: "Telegram",  url: "" }
  ],
  projects: [
    { name: "Төрком",            note: "Бренд одежды", url: "https://www.instagram.com/turkum.official.02/" },
    { name: "Turkum Barbershop", note: "Барбершоп",    url: "https://www.instagram.com/barbershop_turkum/" }
  ]
};

// featured: true — ролик-«премьера» вверху вкладки «Видео».
// Сниппеты (ig — оригинал рилса): video/<slug>.mp4 — полное видео, <slug>-preview.mp4 — беззвучное превью для карточки, <slug>.webp — обложка.
window.VIDEOS = [
  { slug: "auyl",              title: "Ауылда диско",      duration: "0:33", featured: true, ig: "https://www.instagram.com/reel/DEC_2yUMi9a/" },
  { slug: "eto-bashkortostan", title: "Это Башкортостан",  duration: "0:51" , ig: "https://www.instagram.com/reel/Dci_Nw-ixNW/" },
  { slug: "yaz-kile",          title: "Яз килә 2.0",       duration: "0:29" , ig: "https://www.instagram.com/reel/DPPDE7IguPQ/" },
  { slug: "yana-yorek",        title: "Яна йөрәк",         duration: "0:36" , ig: "https://www.instagram.com/reel/DX9Ch6fi4do/" },
  { slug: "banda-02",          title: "Банда 02",          duration: "0:31" , ig: "https://www.instagram.com/reel/DL9ay1Hsoyt/" },
  { slug: "yurta",             title: "Юрта",              duration: "0:32" , ig: "https://www.instagram.com/reel/C_NaV3iswiW/" },
  { slug: "new-year",          title: "Ауылда суета",      duration: "0:37" , ig: "https://www.instagram.com/reel/DSZa5bTgnjo/" }
];
