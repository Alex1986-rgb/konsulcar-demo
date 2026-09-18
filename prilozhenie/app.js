// Кликабельный прототип приложения КонсулКар (17.09.2026).
// Без сборки и зависимостей: экраны — функции, возвращающие HTML; навигация — стек на каждую вкладку.
// Все данные демонстрационные. Правила заказчика: цены по оптике не показываем,
// про регистрацию авто — только «консультация по учёту».
(function () {
  'use strict';
  const $app = document.getElementById('app');
  const SVC = window.SVC || [];
  const svc = (s) => SVC.find((x) => x.s === s) || { s, t: s, n: s, d: '', img: 'srv-import', inc: [] };
  const rub = (n) => n.toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₽';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ── иконки (контур 1.8)
  const P = {
    home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
    list: 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
    car: 'M5 16l1.5-5.5A2 2 0 0 1 8.4 9h7.2a2 2 0 0 1 1.9 1.5L19 16M4 16h16v3H4zM7 19v1.5M17 19v1.5M7.5 13.5h.01M16.5 13.5h.01',
    chat: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
    back: 'M15 5l-7 7 7 7',
    bell: 'M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0',
    search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
    check: 'M5 12.5l4.5 4.5L19 7.5',
    ship: 'M3 17l2 3h14l2-3M5 17V10h14v7M8 10V6h8v4M12 3v3',
    doc: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
    wallet: 'M4 7h15a1 1 0 0 1 1 1v11H4a1 1 0 0 1-1-1V6a2 2 0 0 1 2-2h12v3M16 13.5h.01',
    feed: 'M4 5h16v5H4zM4 14h16v5H4z',
    shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
    chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
    alert: 'M12 4l9 16H3zM12 10v4M12 17h.01',
    swap: 'M7 7h13l-3-3M17 17H4l3 3',
    cam: 'M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
    send: 'M4 12l16-8-6 16-2.5-6.5z',
    gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2-1-1-3-2 .3-1.3-1.3.3-2-3-1-1 2h-2l-1-2-3 1 .3 2L5.3 8.3 3.3 8l-1 3 2 1v1l-2 1 1 3 2-.3 1.3 1.3-.3 2 3 1 1-2h2l1 2 3-1-.3-2 1.3-1.3 2 .3 1-3-2-1z',
    cart: 'M3 4h2l2.5 11h11L21 7H6.2M9 20h.01M18 20h.01',
    parts: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1',
  };
  const ic = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${P[n]}"/></svg>`;
  const img = (n) => `img/${n}.webp`;

  // ── демо-данные
  const CARS = [
    { id: 'kia', t: 'Kia Sorento', y: 2023, vin: 'KNARH81E••••••4821', plate: 'Х 482 КО 797', img: 'offer-suv-white', osago: '12.03.2027', dk: 'не требуется' },
    { id: 'cam', t: 'Toyota Camry', y: 2019, vin: 'XW7BF3HK••••••1937', plate: 'А 193 МР 777', img: 'offer-crossover-grey', osago: '04.10.2026', dk: '21.11.2026' },
  ];
  const PROS = [
    { id: 'p1', n: 'Студия «Тишина»', a: 'ТШ', r: 4.9, rev: 128, done: 342, since: 2019, dist: '3,2 км', price: 38500, days: '2 дня', note: 'Полная шумоизоляция дверей и пола, материалы в наличии. Фотоотчёт по каждому слою.', ver: true },
    { id: 'p2', n: 'АвтоЗвук Восток', a: 'АВ', r: 4.8, rev: 86, done: 207, since: 2021, dist: '5,8 км', price: 34000, days: '3 дня', note: 'Можем завтра с утра. Гарантия на работы 1 год.', ver: true },
    { id: 'p3', n: 'Мастер Игорь Н.', a: 'ИН', r: 4.6, rev: 23, done: 41, since: 2024, dist: '1,4 км', price: 29000, days: '3–4 дня', note: 'Самозанятый, работаю в своём боксе. Материалы по согласованию.', ver: true },
  ];
  const IMPORT_STAGES = [
    ['Подбор и проверка', 'Отчёт по истории, фото и видео осмотра', '28.08'],
    ['Выкуп и оплата', 'Договор, инвойс, подтверждение оплаты', '02.09'],
    ['Доставка до порта', 'Автовоз до Инчхона, фото погрузки', '08.09'],
    ['Морем во Владивосток', 'Судно в пути, прибытие ≈ 22.09', ''],
    ['Таможенное оформление', 'Декларация, пошлины, СБКТС и ЭПТС', ''],
    ['Доставка в Москву', 'Автовоз, 9–12 дней', ''],
    ['Выдача и консультация по учёту', 'Осмотр, документы, помощь с номерами', ''],
  ];
  const OFFERS = [
    { t: 'Mazda CX-5 2024, 2.5 AWD', c: 'Из Китая', p: 3090000, img: 'offer-crossover-grey', sp: ['2024', '192 л.с.', 'Полный привод', '8 500 км'] },
    { t: 'Chevrolet Trailblazer 4WD', c: 'Из США', p: 2800000, img: 'offer-crossover-dark', sp: ['Полный привод', 'Чистая история по VIN'] },
    { t: 'Kia Mohave 2022', c: 'Из Кореи', p: 4350000, img: 'offer-suv-black', sp: ['3.0 дизель', '7 мест', '31 000 км'] },
    { t: 'Hyundai Palisade 2023', c: 'Из Кореи', p: 4900000, img: 'offer-suv-white', sp: ['3.8 бензин', 'Полный привод', '19 000 км'] },
  ];
  const PARTS = [
    { t: 'Колодки тормозные передние', b: 'Brembo', a: 'P 30 055', p: 6420, d: 'сегодня', img: 'cat-tormoznaya-sistema' },
    { t: 'Колодки тормозные передние', b: 'Hyundai/Kia (оригинал)', a: '58101P2A00', p: 9870, d: '1–2 дня', img: 'cat-tormoznaya-sistema' },
    { t: 'Фильтр масляный', b: 'MANN-FILTER', a: 'W 811/80', p: 890, d: 'сегодня', img: 'cat-filtry' },
    { t: 'Стойка стабилизатора передняя', b: 'CTR', a: 'CLKK-40', p: 1740, d: '1–2 дня', img: 'cat-podveska' },
  ];
  const FEED = [
    { id: 'f1', s: 'avtozvuk-shumoizolyaciya', car: 'Kia Sorento 2023', area: 'Восточное Измайлово · 3,2 км', when: 'На этой неделе', d: 'Шумоизоляция дверей и пола, в салоне гул на трассе.', resp: 2 },
    { id: 'f2', s: 'detailing', car: 'BMW X5 2021', area: 'Гольяново · 4,1 км', when: 'Завтра', d: 'Полировка кузова и керамика перед продажей.', resp: 4 },
    { id: 'f3', s: 'optika-i-fary', car: 'Toyota Camry 2019', area: 'Щёлково · 11 км', when: 'Не срочно', d: 'Тусклый ближний свет, запотевает правая фара. Нужен осмотр.', resp: 1 },
    { id: 'f4', s: 'avtosignalizacii', car: 'Haval Jolion 2024', area: 'Преображенка · 6,9 км', when: 'Сегодня', d: 'Сигнализация с автозапуском и меткой.', resp: 0 },
  ];

  // ── состояние
  const S = {
    role: 'client', logged: false, tab: {}, stacks: {},
    order: null, // текущий заказ клиента
    chat: [
      { me: false, t: 'Здравствуйте! Машину ждём к 10:00, заезд с Щёлковского шоссе.', at: '09:12' },
      { me: true, t: 'Отлично, буду вовремя. Сколько по времени займёт?', at: '09:14' },
      { me: false, t: 'Двери и пол — два дня. Вечером первого дня пришлю фото.', at: '09:15' },
    ],
    cart: 0, notif: true, bid: {}, jobStep: 1, proVerify: { a1: null, a2: null }, dispute: null,
  };

  const ROLES = {
    client: { tabs: [['home', 'Главная', 'home'], ['orders', 'Заказы', 'list'], ['garage', 'Гараж', 'car'], ['chats', 'Чаты', 'chat'], ['profile', 'Профиль', 'user']] },
    pro: { tabs: [['feed', 'Заказы', 'feed'], ['jobs', 'Мои работы', 'list'], ['payouts', 'Выплаты', 'wallet'], ['pprofile', 'Профиль', 'user']] },
    admin: { tabs: [['dash', 'Сводка', 'chart'], ['vetting', 'Проверка', 'shield'], ['aorders', 'Заказы', 'list'], ['disputes', 'Споры', 'alert']] },
  };

  const stack = () => { const k = S.role + ':' + curTab(); return (S.stacks[k] = S.stacks[k] || [{ s: curTab(), p: {} }]); };
  const curTab = () => S.tab[S.role] || ROLES[S.role].tabs[0][0];
  const top = () => stack()[stack().length - 1];
  function go(s, p) { stack().push({ s, p: p || {} }); render(true); }
  function back() { if (stack().length > 1) stack().pop(); render(true); }
  function tab(t) { S.tab[S.role] = t; S.stacks[S.role + ':' + t] = [{ s: t, p: {} }]; render(true); }
  function role(r) {
    S.role = r;
    document.querySelectorAll('.roles button').forEach((b) => b.classList.toggle('on', b.dataset.role === r));
    fillScen(); render(true);
  }
  function toast(t) {
    const el = document.createElement('div'); el.className = 'toast'; el.textContent = t;
    $app.appendChild(el); setTimeout(() => el.remove(), 2200);
  }

  // ── экраны. Каждый: { title, back, right, tabs=true, compose, body }
  const V = {};

  // Клиент ──────────────────────────────────────────
  V.login = () => ({
    tabs: false, bare: true,
    body: `<div style="padding-top:70px" class="center">
      <div class="mono" style="width:64px;height:64px;font-size:36px;margin:0 auto 18px;border-radius:18px">K</div>
      <div class="big">КонсулКар</div>
      <p class="mut" style="margin:8px 0 34px">Автоуслуги, запчасти и привоз автомобиля — в одном приложении</p></div>
      <label class="field"><span>Номер телефона</span><input class="inp" value="+7 900 000-00-00" inputmode="tel"></label>
      <button class="btn" data-go="code">Получить код</button>
      <p class="xs mut center" style="margin-top:14px">Код придёт звонком или СМС. Продолжая, вы соглашаетесь с условиями и политикой обработки данных.</p>`,
  });
  V.code = () => ({
    tabs: false, back: true, title: 'Код из звонка',
    body: `<p class="mut">Введите последние 4 цифры номера, с которого позвонили на +7 900 000-00-00</p>
      <div class="row" style="justify-content:center;gap:12px;margin:30px 0">${'4821'.split('').map((d) => `<div class="inp center" style="width:56px;font-size:24px;font-weight:700">${d}</div>`).join('')}</div>
      <button class="btn" data-act="login">Войти</button>
      <button class="btn gh">Позвонить ещё раз через 0:45</button>`,
  });

  V.home = () => {
    const chips = ['srv-import', ...SVC.map((x) => x.s)];
    const o = S.order;
    return {
      title: 'Добрый день!', right: `<button class="ib" data-go="notif">${ic('bell')}<span class="dot"></span></button>`,
      body: `<button class="search" data-go="parts">${ic('search')}Запчасть по VIN, услуга или артикул</button>
      <button class="hero" data-go="import"><img src="${img('art-port-pogruzka')}" alt=""><div>
        <span class="pill g">Ваш автомобиль в пути</span>
        <b style="margin-top:8px">Kia Sorento из Кореи</b>
        <div class="prog" style="width:220px"><i style="width:43%"></i></div>
        <span class="sm mut">Этап 4 из 7 · морем во Владивосток</span></div></button>
      ${o && o.st < 6 ? `<h3>Активный заказ</h3><button class="card tap gl" data-go="order">
        <div class="row"><b style="flex:1">${esc(svc(o.s).n)}</b>${statusPill(o.st)}</div>
        <div class="sm mut" style="margin-top:4px">${esc(o.car)}${o.pro ? ' · ' + esc(o.pro.n) : ''}</div></button>` : ''}
      <h3>Услуги</h3>
      <div class="grid">${chips.map((s) => s === 'srv-import'
        ? `<button class="tile" data-go="importNew"><img src="${img('srv-import')}" alt=""><span>Привоз авто под ключ</span></button>`
        : `<button class="tile" data-go="service" data-p="${s}"><img src="${img(svc(s).img)}" alt="" loading="lazy"><span>${esc(svc(s).t)}</span></button>`).join('')}</div>
      <h3>Предложения недели</h3>
      <div class="hs">${OFFERS.map((f, i) => `<button class="offer" data-go="offer" data-p="${i}"><img src="${img(f.img)}" alt="" loading="lazy"><div>
        <b>${esc(f.t)}</b><span class="xs mut">${f.c} · под ключ</span><div class="price gold" style="margin-top:6px">${rub(f.p)}</div></div></button>`).join('')}</div>`,
    };
  };

  V.notif = () => ({
    title: 'Уведомления', back: true,
    body: [
      ['ship', 'Kia Sorento погружен на судно', 'Фото погрузки и коносамент в разделе «Привоз»', '08.09'],
      ['doc', 'ОСАГО на Toyota Camry заканчивается 04.10', 'Продлить за 2 минуты — предложения трёх страховых', '15.09'],
      ['check', 'Диагностическая карта Camry — до 21.11', 'Аккредитованный ПТО, запись на удобное время', '14.09'],
    ].map(([i, t, d, at]) => `<div class="li"><div class="ib">${ic(i)}</div><div class="sp"><b class="sm">${t}</b><div class="xs mut">${d}</div></div><span class="xs mut">${at}</span></div>`).join(''),
  });

  V.service = (p) => {
    const x = svc(p);
    const optics = p === 'optika-i-fary';
    return {
      title: x.t, back: true,
      body: `<div class="hero" style="cursor:default;min-height:150px"><img src="${img(x.img)}" alt=""><div><b>${esc(x.n)}</b><span class="sm mut">${esc(x.d)}</span></div></div>
      <h3>Что входит</h3>
      <div class="card">${x.inc.map((t) => `<div class="row" style="align-items:flex-start;padding:5px 0"><span class="gold" style="width:18px;flex:none">${ic('check')}</span><span class="sm">${esc(t)}</span></div>`).join('')}</div>
      <div class="card"><div class="row"><span class="gold">${ic('shield')}</span><div class="sm">Исполнители проверены площадкой: документы, отзывы, фото работ. Оплата удерживается до приёмки.</div></div></div>
      ${optics ? '<p class="xs mut">Стоимость называет исполнитель после осмотра.</p>' : ''}
      <button class="btn" data-go="newOrder" data-p="${p}">Заказать — исполнители откликнутся с ценой</button>`,
    };
  };

  V.newOrder = (p) => {
    const x = svc(p);
    const def = p === 'avtozvuk-shumoizolyaciya' ? 'Нужна шумоизоляция дверей и пола. На трассе после 90 км/ч сильный гул от колёс.' : '';
    return {
      title: 'Новый заказ', back: true,
      body: `<div class="pill g" style="margin-bottom:12px">${esc(x.n)}</div>
      <label class="field"><span>Автомобиль</span><div class="chips">${CARS.map((c, i) => `<button class="chip${i === 0 ? ' on' : ''}" data-chip>${c.t} ${c.y}</button>`).join('')}<button class="chip">+ другой</button></div></label>
      <label class="field"><span>Что нужно сделать</span><textarea class="inp" placeholder="Опишите задачу своими словами">${def}</textarea></label>
      <div class="field"><span>Фото (необязательно)</span><div class="ph"><img src="${img('srv-avtozvuk')}" alt=""><button class="add">+</button></div></div>
      <div class="field"><span>Когда</span><div class="chips"><button class="chip" data-chip>Сегодня</button><button class="chip" data-chip>Завтра</button><button class="chip on" data-chip>На этой неделе</button><button class="chip" data-chip>Не срочно</button></div></div>
      <div class="field"><span>Где</span><div class="chips"><button class="chip on" data-chip>Приеду к исполнителю</button><button class="chip" data-chip>Выезд мастера</button></div></div>
      <button class="btn" data-act="publish" data-p="${p}">Опубликовать заказ</button>
      <p class="xs mut center" style="margin-top:10px">Заказ увидят проверенные исполнители рядом. Телефон скрыт до выбора.</p>`,
    };
  };

  V.waiting = () => ({
    title: 'Ищем исполнителей', back: true, tabs: false,
    body: `<div class="spin"></div><p class="center">Заказ отправлен 14 исполнителям рядом</p>
      <p class="center sm mut" style="margin-top:6px">Обычно первые отклики приходят за 10–30 минут</p>`,
  });

  V.responses = () => {
    const o = S.order; const optics = o.s === 'optika-i-fary';
    return {
      title: 'Отклики · ' + PROS.length, back: true,
      body: `<p class="sm mut" style="margin-bottom:12px">${esc(svc(o.s).n)} · ${esc(o.car)}</p>
      ${PROS.map((x) => `<div class="card">
        <div class="row"><div class="av">${x.a}</div><div class="sp"><b>${esc(x.n)}</b>
        <div class="xs mut"><span class="stars">★ ${x.r}</span> · ${x.rev} отзывов · ${x.dist}</div></div>
        ${x.ver ? '<span class="pill ok">✓ проверен</span>' : ''}</div>
        <p class="sm" style="margin:10px 0">${esc(x.note)}</p>
        <div class="row"><div class="sp"><div class="price">${optics ? 'после осмотра' : rub(x.price)}</div><div class="xs mut">срок ${x.days}</div></div>
        <button class="btn sm gh" data-go="proCard" data-p="${x.id}">Профиль</button>
        <button class="btn sm" data-act="choose" data-p="${x.id}">Выбрать</button></div></div>`).join('')}`,
    };
  };

  V.proCard = (id) => {
    const x = PROS.find((p) => p.id === id);
    return {
      title: x.n, back: true,
      body: `<div class="row"><div class="av" style="width:64px;height:64px;font-size:24px">${x.a}</div><div><div class="stars" style="font-size:16px">★★★★★ ${x.r}</div><div class="sm mut">${x.rev} отзывов · ${x.done} заказов · с ${x.since} года</div></div></div>
      <div class="card" style="margin-top:14px"><div class="kv"><span>Документы</span><b class="ok">ИП, проверено</b></div><div class="kv"><span>Адрес</span><b>${x.dist} от вас</b></div><div class="kv"><span>Гарантия</span><b>1 год</b></div></div>
      <h3>Работы</h3><div class="hs">${['srv-avtozvuk', 'srv-detailing', 'srv-signalizacii', 'srv-kuzovnoy'].map((i) => `<img src="${img(i)}" alt="" style="width:130px;height:96px;border-radius:12px;object-fit:cover;flex:none">`).join('')}</div>
      <h3>Отзывы</h3>
      ${[['Сергей', 'Сделали за два дня, как и обещали. Гул ушёл, двери закрываются мягче.'], ['Ольга', 'Присылали фото каждого этапа, приятно видеть, что под обшивкой.']].map(([n, t]) => `<div class="card"><div class="row"><b class="sm sp">${n}</b><span class="stars">★★★★★</span></div><p class="sm mut" style="margin-top:6px">${t}</p></div>`).join('')}`,
    };
  };

  V.pay = () => {
    const o = S.order; const x = o.pro;
    const fee = Math.round(x.price * 0.0);
    return {
      title: 'Оплата', back: true,
      body: `<div class="card gl"><div class="row"><div class="av">${x.a}</div><div class="sp"><b>${esc(x.n)}</b><div class="xs mut">${esc(svc(o.s).n)}</div></div></div>
        <div style="margin-top:12px"><div class="kv"><span>Работы и материалы</span><b>${rub(x.price)}</b></div><div class="kv"><span>Сервисный сбор</span><b>${fee ? rub(fee) : '0 ₽'}</b></div><div class="kv"><span>Итого</span><b class="gold">${rub(x.price + fee)}</b></div></div></div>
      <div class="card"><div class="row" style="align-items:flex-start"><span class="gold">${ic('shield')}</span><div class="sm"><b>Безопасная сделка.</b> Деньги списываются, но исполнитель получит их только после того, как вы примете работу. Если что-то не так — откройте спор, площадка разберётся.</div></div></div>
      <label class="field"><span>Способ оплаты</span><div class="chips"><button class="chip on" data-chip>Карта •• 4418</button><button class="chip" data-chip>СБП</button><button class="chip" data-chip>Счёт для юрлица</button></div></label>
      <button class="btn" data-act="pay">Оплатить ${rub(x.price + fee)}</button>
      <p class="xs mut center" style="margin-top:8px">Демо: оплата не проводится</p>`,
    };
  };

  const OST = ['Опубликован', 'Исполнитель выбран', 'Оплачен, деньги удержаны', 'В работе', 'Готово — примите работу', 'Принят', 'Завершён'];
  function statusPill(st) {
    const cls = st >= 5 ? 'ok' : st === 4 ? 'w' : 'g';
    return `<span class="pill ${cls}">${OST[Math.min(st, 6)]}</span>`;
  }

  V.order = () => {
    const o = S.order;
    if (!o) return { title: 'Заказ', back: true, body: '<p class="mut">Заказа нет</p>' };
    const steps = [['Заказ опубликован', 'Отклики: 3'], ['Выбран исполнитель', o.pro ? o.pro.n : ''], ['Оплачено, деньги удержаны', 'Исполнитель получит их после приёмки'], ['В работе', 'Мастер присылает фото по этапам'], ['Готово', 'Проверьте автомобиль и примите работу'], ['Работа принята', 'Деньги переведены исполнителю']];
    return {
      title: svc(o.s).n, back: true,
      right: `<button class="ib" data-go="chat">${ic('chat')}</button>`,
      body: `<div class="card gl"><div class="row"><b class="sp">${esc(o.car)}</b>${statusPill(o.st)}</div>
        ${o.pro ? `<div class="sm mut" style="margin-top:6px">${esc(o.pro.n)} · ${rub(o.pro.price)}</div>` : ''}</div>
      <ol class="tl">${steps.map(([t, d], i) => `<li class="${i < o.st ? 'd' : i === o.st ? 'c' : ''}"><i></i><b>${t}</b><span class="xs mut">${esc(d)}</span></li>`).join('')}</ol>
      ${o.st >= 3 ? `<h3>Фотоотчёт</h3><div class="ph">${['srv-avtozvuk', 'art-shumoizolyaciya'].map((i) => `<img src="${img(i === 'art-shumoizolyaciya' ? 'srv-kuzovnoy' : i)}" alt="">`).join('')}<div class="add" style="border-style:solid;font-size:12px;text-align:center;line-height:1.2;padding:8px">до / после</div></div>` : ''}
      ${o.st === 3 ? `<button class="btn gh" data-act="advance">Демо: исполнитель закончил работу</button>` : ''}
      ${o.st === 4 ? `<button class="btn" data-go="review">Принять работу</button><button class="btn bad" data-act="dispute">Есть замечания — открыть спор</button>` : ''}
      ${o.st >= 5 ? `<div class="card" style="margin-top:10px"><div class="row"><span class="ok">${ic('check')}</span><span class="sm">Акт и гарантийный талон — в разделе «Гараж → документы»</span></div></div>` : ''}
      ${o.st < 4 ? `<button class="btn gh" data-go="chat">${ic('chat')} Написать исполнителю</button>` : ''}`,
    };
  };

  V.review = () => ({
    title: 'Оценка работы', back: true,
    body: `<p class="mut">Как всё прошло? Отзыв увидят другие клиенты.</p>
      <div class="center stars" style="font-size:40px;letter-spacing:6px;margin:24px 0">★★★★★</div>
      <div class="chips" style="justify-content:center;margin-bottom:14px">${['В срок', 'Аккуратно', 'Фотоотчёт', 'Вежливо', 'Как договорились'].map((t, i) => `<button class="chip${i < 3 ? ' on' : ''}" data-chip>${t}</button>`).join('')}</div>
      <textarea class="inp" placeholder="Пара слов о работе">Гул на трассе ушёл, машину вернули чистой.</textarea>
      <button class="btn" data-act="accept">Принять работу и оценить</button>`,
  });

  V.done = () => ({
    title: '', back: false,
    body: `<div class="okc">${ic('check')}</div><div class="center big">Готово</div>
      <p class="center mut" style="margin:10px 0 24px">Работа принята, деньги переведены исполнителю. Спасибо за отзыв!</p>
      <button class="btn" data-tab="home">На главную</button>`,
  });

  V.chat = () => ({
    title: S.order && S.order.pro ? S.order.pro.n : 'Студия «Тишина»', back: true, tabs: false,
    compose: true,
    body: `<div class="chat">${S.chat.map((m) => `<div class="msg${m.me ? ' me' : ''}">${esc(m.t)}<small>${m.at}</small></div>`).join('')}</div>`,
  });

  V.orders = () => {
    const o = S.order;
    return {
      title: 'Мои заказы',
      body: `${o ? `<h3>Текущие</h3><button class="card tap gl" data-go="order"><div class="row"><b class="sp">${esc(svc(o.s).n)}</b>${statusPill(o.st)}</div><div class="sm mut" style="margin-top:4px">${esc(o.car)}</div></button>` : `<div class="card"><p class="sm mut">Активных заказов нет. Выберите услугу на главной — исполнители откликнутся с ценой.</p><button class="btn" data-go="newOrder" data-p="avtozvuk-shumoizolyaciya">Создать заказ</button></div>`}
      <button class="card tap" data-go="import"><div class="row"><span class="gold">${ic('ship')}</span><b class="sp">Привоз Kia Sorento</b><span class="pill g">этап 4 из 7</span></div></button>
      <h3>Завершённые</h3>
      ${[['Техосмотр', 'Toyota Camry', '21.11.2025'], ['Замена лобового стекла', 'Toyota Camry', '14.06.2025'], ['ОСАГО', 'Kia Sorento', '12.03.2026']].map(([t, c, d]) => `<div class="card"><div class="row"><b class="sp sm">${t}</b><span class="xs mut">${d}</span></div><div class="xs mut">${c}</div></div>`).join('')}`,
    };
  };

  V.import = () => ({
    title: 'Привоз автомобиля', back: true,
    right: `<button class="ib" data-go="chatMgr">${ic('chat')}</button>`,
    body: `<div class="hero" style="cursor:default;min-height:150px"><img src="${img('offer-suv-white')}" alt=""><div><b>Kia Sorento 2023</b><span class="sm mut">2.5 бензин · 4WD · из Кореи</span></div></div>
      <div class="card gl"><div class="row"><span class="sp mut sm">Под ключ по договору</span><b class="gold">3 650 000 ₽</b></div><div class="prog"><i style="width:43%"></i></div><div class="xs mut">Этап 4 из 7 · ожидаемая выдача ≈ 10.10.2026</div></div>
      <ol class="tl">${IMPORT_STAGES.map(([t, d, at], i) => `<li class="${i < 3 ? 'd' : i === 3 ? 'c' : ''}"><i></i><b>${t}${at ? ` <span class="xs mut" style="font-weight:400">· ${at}</span>` : ''}</b><span class="xs mut">${d}</span></li>`).join('')}</ol>
      <h3>Документы и фото</h3>
      ${[['Договор и инвойс', 'PDF · 2 файла'], ['Отчёт осмотра в Корее', '46 фото, видео'], ['Коносамент', 'PDF']].map(([t, d]) => `<div class="li"><span class="gold">${ic('doc')}</span><div class="sp"><b class="sm">${t}</b><div class="xs mut">${d}</div></div></div>`).join('')}
      <button class="btn gh" data-go="chatMgr">Написать менеджеру</button>`,
  });

  V.chatMgr = () => ({
    title: 'Менеджер по привозу', back: true, tabs: false, compose: true,
    body: `<div class="chat"><div class="msg">Добрый день! Судно вышло из Инчхона 08.09, прибытие во Владивосток ориентировочно 22.09.<small>08.09 18:02</small></div><div class="msg">Фото погрузки загрузил в документы.<small>08.09 18:03</small></div></div>`,
  });

  V.importNew = () => ({
    title: 'Привоз под ключ', back: true,
    body: `<p class="mut sm">Подберём, проверим, выкупим и привезём: Корея, Китай, Япония, США, ОАЭ. Таможня, СБКТС и ЭПТС — на нас.</p>
      <div class="hs" style="margin-top:12px">${[['koreya', 'Корея'], ['kitay', 'Китай'], ['yaponiya', 'Япония'], ['usa', 'США'], ['oae', 'ОАЭ']].map(([c, n], i) => `<button class="offer" style="width:120px" data-chip><img src="${img('country-' + c)}" alt="" style="height:70px"><div><b class="${i === 0 ? 'gold' : ''}">${n}</b></div></button>`).join('')}</div>
      <label class="field" style="margin-top:14px"><span>Марка и модель</span><input class="inp" value="Hyundai Palisade"></label>
      <label class="field"><span>Бюджет под ключ</span><div class="chips">${['до 3 млн', '3–4 млн', '4–5 млн', '5+ млн'].map((t, i) => `<button class="chip${i === 2 ? ' on' : ''}" data-chip>${t}</button>`).join('')}</div></label>
      <label class="field"><span>Кредит</span><div class="chips"><button class="chip on" data-chip>Не нужен</button><button class="chip" data-chip>Нужен</button></div></label>
      <button class="btn" data-act="importLead">Получить расчёт</button>
      <p class="xs mut center" style="margin-top:8px">Менеджер пришлёт 2–3 варианта с ценой под ключ</p>`,
  });

  V.offer = (i) => {
    const f = OFFERS[+i];
    return {
      title: f.t, back: true,
      body: `<img src="${img(f.img)}" alt="" style="width:100%;height:210px;object-fit:cover;border-radius:16px">
      <div class="row" style="margin:14px 0 6px"><span class="big gold sp">${rub(f.p)}</span><span class="pill">${f.c}</span></div>
      <p class="sm mut">Цена под ключ в РФ: автомобиль, доставка, таможенное оформление и документы</p>
      <div class="chips" style="margin:12px 0">${f.sp.map((s) => `<span class="pill">${s}</span>`).join('')}</div>
      <div class="card"><div class="kv"><span>Проверка истории по VIN</span><b class="ok">до выкупа</b></div><div class="kv"><span>Фотоотчёт</span><b>перед отправкой</b></div><div class="kv"><span>Русификация мультимедиа</span><b>входит</b></div></div>
      <button class="btn" data-act="importLead">Хочу такой</button>`,
    };
  };

  V.garage = () => ({
    title: 'Гараж', right: `<button class="ib">+</button>`,
    body: CARS.map((c) => `<button class="card tap" data-go="car" data-p="${c.id}" style="padding:0;overflow:hidden">
      <img src="${img(c.img)}" alt="" style="width:100%;height:120px;object-fit:cover"><div style="padding:12px 14px">
      <div class="row"><b class="sp">${c.t} ${c.y}</b><span class="pill">${c.plate}</span></div>
      <div class="xs mut" style="margin-top:4px">VIN ${c.vin}</div>
      ${c.id === 'cam' ? '<div class="pill w" style="margin-top:8px">ОСАГО до 04.10 — продлить</div>' : '<div class="pill ok" style="margin-top:8px">Документы в порядке</div>'}</div></button>`).join(''),
  });

  V.car = (id) => {
    const c = CARS.find((x) => x.id === id);
    return {
      title: c.t, back: true,
      body: `<div class="card"><div class="kv"><span>Год</span><b>${c.y}</b></div><div class="kv"><span>Госномер</span><b>${c.plate}</b></div><div class="kv"><span>VIN</span><b>${c.vin}</b></div><div class="kv"><span>ОСАГО</span><b>до ${c.osago}</b></div><div class="kv"><span>Диагностическая карта</span><b>${c.dk}</b></div></div>
      <div class="btns"><button class="btn gh" data-go="parts">${ic('parts')} Запчасти</button><button class="btn gh" data-go="service" data-p="strahovanie">${ic('doc')} Страховка</button></div>
      <h3>История</h3>
      <ol class="tl">${[['Техосмотр, аккредитованный ПТО', '21.11.2025'], ['Замена лобового стекла', '14.06.2025'], ['Русификация мультимедиа', '02.03.2025']].map(([t, d]) => `<li class="d"><i></i><b>${t}</b><span class="xs mut">${d} · акт и фото</span></li>`).join('')}</ol>`,
    };
  };

  V.parts = () => ({
    title: 'Запчасти', back: true,
    right: `<button class="ib" data-go="cart">${ic('cart')}${S.cart ? '<span class="dot"></span>' : ''}</button>`,
    body: `<div class="search" style="color:var(--text)">${ic('search')}колодки передние</div>
      <div class="chips" style="margin:10px 0 14px">${CARS.map((c, i) => `<button class="chip${i === 0 ? ' on' : ''}" data-chip>${c.t}</button>`).join('')}</div>
      <p class="xs mut" style="margin-bottom:8px">Подобрано по VIN Kia Sorento · ${PARTS.length} позиции</p>
      ${PARTS.map((x, i) => `<div class="card row"><img src="${img(x.img)}" alt="" style="width:64px;height:64px;border-radius:10px;object-fit:cover"><div class="sp">
        <b class="sm">${x.t}</b><div class="xs mut">${x.b} · ${x.a}</div><div class="row" style="margin-top:4px"><span class="price">${rub(x.p)}</span><span class="xs ${x.d === 'сегодня' ? 'ok' : 'mut'}">${x.d}</span></div></div>
        <button class="btn sm" data-act="addCart" data-p="${i}">+</button></div>`).join('')}
      <div class="card"><div class="row"><span class="gold">${ic('parts')}</span><span class="sm sp">Установка у проверенного мастера — одним заказом с запчастью</span></div></div>`,
  });

  V.cart = () => ({
    title: 'Корзина', back: true,
    body: S.cart ? `<div class="card"><div class="kv"><span>Позиций</span><b>${S.cart}</b></div><div class="kv"><span>Получение</span><b>Щёлковское ш., 77 или доставка</b></div></div>
      <label class="field"><span>Установить?</span><div class="chips"><button class="chip on" data-chip>Да, найти мастера</button><button class="chip" data-chip>Только запчасти</button></div></label>
      <button class="btn" data-act="buy">Заказать в 1 клик</button>` : '<p class="mut">Корзина пуста</p>',
  });

  V.chats = () => ({
    title: 'Чаты',
    body: [['ТШ', 'Студия «Тишина»', S.chat[S.chat.length - 1].t, 'chat'], ['КК', 'Менеджер по привозу', 'Фото погрузки загрузил в документы.', 'chatMgr'], ['КК', 'Поддержка КонсулКар', 'Здравствуйте! Чем помочь?', 'chatMgr']]
      .map(([a, n, t, g]) => `<button class="li" data-go="${g}"><div class="av">${a}</div><div class="sp" style="min-width:0"><b class="sm">${n}</b><div class="xs mut" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(t)}</div></div></button>`).join(''),
  });

  V.profile = () => ({
    title: 'Профиль',
    body: `<div class="row" style="margin-bottom:14px"><div class="av" style="width:58px;height:58px">АК</div><div><b>Александр</b><div class="sm mut">+7 900 000-00-00</div></div></div>
      <div class="card">
        <div class="li"><span class="sp sm">Уведомления о статусах</span><button class="sw${S.notif ? ' on' : ''}" data-act="notif"></button></div>
        <button class="li" data-go="garage"><span class="sp sm">Мои автомобили</span><span class="mut xs">2</span></button>
        <div class="li"><span class="sp sm">Способы оплаты</span><span class="mut xs">•• 4418</span></div>
        <div class="li"><span class="sp sm">Бонусы</span><span class="gold xs">1 250</span></div>
        <button class="li" data-go="chatMgr"><span class="sp sm">Поддержка</span></button>
      </div>
      <div class="card gl"><b>Вы мастер или сервис?</b><p class="sm mut" style="margin:4px 0 0">Получайте заказы рядом. Проверка документов — 1 день.</p><button class="btn" data-role="pro">Стать исполнителем</button></div>
      <button class="btn gh" data-act="logout">Выйти</button>`,
  });

  // Исполнитель ──────────────────────────────────────
  V.feed = () => ({
    title: 'Заказы рядом', right: `<button class="ib">${ic('gear')}</button>`,
    body: `<div class="chips" style="margin-bottom:12px"><button class="chip on" data-chip>Мои услуги</button><button class="chip" data-chip>До 10 км</button><button class="chip" data-chip>Сегодня</button></div>
      ${FEED.map((f) => `<button class="card tap${S.bid[f.id] ? ' gl' : ''}" data-go="feedItem" data-p="${f.id}">
        <div class="row"><b class="sp">${esc(svc(f.s).n)}</b>${S.bid[f.id] ? '<span class="pill ok">отклик отправлен</span>' : `<span class="pill">${f.when}</span>`}</div>
        <div class="sm" style="margin:6px 0">${esc(f.d)}</div>
        <div class="xs mut">${f.car} · ${f.area} · откликов: ${f.resp + (S.bid[f.id] ? 1 : 0)}</div></button>`).join('')}`,
  });

  V.feedItem = (id) => {
    const f = FEED.find((x) => x.id === id); const optics = f.s === 'optika-i-fary';
    return {
      title: svc(f.s).t, back: true,
      body: `<div class="card"><div class="kv"><span>Автомобиль</span><b>${f.car}</b></div><div class="kv"><span>Где</span><b>${f.area}</b></div><div class="kv"><span>Когда</span><b>${f.when}</b></div></div>
      <p style="margin:6px 0 12px">${esc(f.d)}</p>
      <div class="ph" style="margin-bottom:14px"><img src="${img(svc(f.s).img)}" alt=""></div>
      ${S.bid[f.id] ? `<div class="card gl"><b class="ok">Отклик отправлен</b><p class="sm mut">Клиент увидит вашу цену, рейтинг и фото работ. Контакты откроются после выбора.</p></div>` : `
      <h3>Ваш отклик</h3>
      <label class="field"><span>${optics ? 'Цена (можно после осмотра)' : 'Цена за работу, ₽'}</span><input class="inp" value="${optics ? 'После осмотра' : '36 000'}"></label>
      <label class="field"><span>Срок</span><div class="chips"><button class="chip" data-chip>1 день</button><button class="chip on" data-chip>2 дня</button><button class="chip" data-chip>3+ дня</button></div></label>
      <label class="field"><span>Комментарий клиенту</span><textarea class="inp">Материалы в наличии, начнём завтра в 10:00. Фото каждого этапа.</textarea></label>
      <button class="btn" data-act="bid" data-p="${f.id}">Откликнуться</button>`}`,
    };
  };

  const JOB = ['Клиент выбрал вас', 'Оплата удержана площадкой', 'Автомобиль принят', 'Работы идут', 'Сдано клиенту', 'Выплата'];
  V.jobs = () => ({
    title: 'Мои работы',
    body: `<button class="card tap gl" data-go="job"><div class="row"><b class="sp">Шумоизоляция · Kia Sorento</b><span class="pill g">${JOB[S.jobStep]}</span></div><div class="xs mut" style="margin-top:4px">Клиент Александр · 36 000 ₽ · до 19.09</div></button>
      <div class="card"><div class="row"><b class="sp sm">Автозвук · Haval F7</b><span class="pill ok">выплачено</span></div><div class="xs mut">12.09 · 24 000 ₽</div></div>
      <div class="card"><div class="row"><b class="sp sm">Шумоизоляция арок · Geely Monjaro</b><span class="pill ok">выплачено</span></div><div class="xs mut">08.09 · 18 500 ₽</div></div>`,
  });

  V.job = () => ({
    title: 'Kia Sorento', back: true, right: `<button class="ib" data-go="chat">${ic('chat')}</button>`,
    body: `<div class="card"><div class="kv"><span>Работа</span><b>Шумоизоляция дверей и пола</b></div><div class="kv"><span>Сумма</span><b>36 000 ₽</b></div><div class="kv"><span>Деньги</span><b class="ok">удержаны площадкой</b></div></div>
      <ol class="tl">${JOB.map((t, i) => `<li class="${i < S.jobStep ? 'd' : i === S.jobStep ? 'c' : ''}"><i></i><b>${t}</b></li>`).join('')}</ol>
      <h3>Фото этапов</h3><div class="ph"><img src="${img('srv-avtozvuk')}" alt=""><button class="add">${ic('cam')}</button></div>
      ${S.jobStep < 4 ? `<button class="btn" data-act="jobNext">${['', '', 'Автомобиль принят', 'Работы идут', 'Сдать работу клиенту'][S.jobStep + 1] || 'Дальше'}</button>` : `<div class="card gl" style="margin-top:12px"><span class="sm">Ждём приёмку клиентом. Деньги поступят на счёт в течение 1 рабочего дня после приёмки.</span></div>`}`,
  });

  V.payouts = () => ({
    title: 'Выплаты',
    body: `<div class="card gl"><span class="sm mut">К выплате</span><div class="big gold" style="margin:6px 0">42 500 ₽</div><span class="xs mut">Ещё 36 000 ₽ удержано до приёмки клиентом</span><button class="btn">Вывести на счёт ИП</button></div>
      <h3>История</h3>
      ${[['12.09', 'Автозвук · Haval F7', 24000], ['08.09', 'Шумоизоляция арок · Monjaro', 18500], ['03.09', 'Сигнализация · Tiguan', 21000]].map(([d, t, s]) => `<div class="kv"><span>${d} · ${t}</span><b>${rub(Math.round(s * 0.9))}</b></div>`).join('')}
      <p class="xs mut" style="margin-top:10px">Комиссия площадки в примере — 10 %. Закрывающие документы формируются автоматически.</p>`,
  });

  V.pprofile = () => ({
    title: 'Студия «Тишина»',
    body: `<div class="row" style="margin-bottom:12px"><div class="av" style="width:58px;height:58px">ТШ</div><div><div class="stars">★ 4.9 · 128 отзывов</div><div class="sm mut">ИП · проверено 02.2026</div></div></div>
      <div class="card"><b class="sm">Мои услуги</b><div class="chips" style="margin-top:8px">${['avtozvuk-shumoizolyaciya', 'avtosignalizacii', 'detailing'].map((s) => `<span class="pill g">${svc(s).t}</span>`).join('')}<span class="pill">+ добавить</span></div></div>
      <div class="card"><b class="sm">Зона работы</b><p class="sm mut">Восток Москвы, радиус 15 км от Щёлковского шоссе</p></div>
      <div class="card"><div class="li"><span class="sp sm">Принимаю заказы</span><span class="sw on"></span></div><div class="li"><span class="sp sm">Документы</span><span class="ok xs">проверены</span></div><div class="li"><span class="sp sm">Мастера в команде</span><span class="xs mut">3</span></div></div>`,
  });

  // Площадка ─────────────────────────────────────────
  V.dash = () => ({
    title: 'Сводка площадки',
    body: `<div class="chips" style="margin-bottom:12px"><button class="chip on" data-chip>Неделя</button><button class="chip" data-chip>Месяц</button></div>
      <div class="kpi">
        <div class="card"><span class="xs mut">Заказов</span><b>148</b><span class="xs ok">+18 %</span></div>
        <div class="card"><span class="xs mut">Откликов на заказ</span><b>3,4</b><span class="xs mut">цель ≥ 3</span></div>
        <div class="card"><span class="xs mut">Средний чек</span><b>21 800 ₽</b></div>
        <div class="card"><span class="xs mut">Комиссия</span><b class="gold">322 640 ₽</b></div>
      </div>
      <div class="card" style="margin-top:10px"><span class="xs mut">Заказы по дням</span><div class="bars">${[14, 19, 22, 17, 25, 28, 23].map((v) => `<i style="height:${v * 3.4}%"></i>`).join('')}</div></div>
      <h3>Требует внимания</h3>
      <button class="card tap" data-tab="vetting"><div class="row"><span class="gold">${ic('shield')}</span><span class="sp sm">2 исполнителя ждут проверки</span></div></button>
      <button class="card tap" data-tab="disputes"><div class="row"><span class="gold">${ic('alert')}</span><span class="sp sm">1 открытый спор</span></div></button>
      <p class="xs mut">Цифры демонстрационные.</p>`,
  });

  V.vetting = () => ({
    title: 'Проверка исполнителей',
    body: [['a1', 'ДетейлингПро', 'ООО · детейлинг, кузовной ремонт', 'ИНН, выписка ЕГРЮЛ, 12 фото работ'], ['a2', 'Мастер Руслан К.', 'Самозанятый · автостёкла', 'Паспорт, справка НПД, 5 фото работ']]
      .map(([id, n, d, docs]) => {
        const v = S.proVerify[id];
        return `<div class="card"><div class="row"><div class="av">${n.slice(0, 2)}</div><div class="sp"><b>${n}</b><div class="xs mut">${d}</div></div></div>
        <p class="sm" style="margin:10px 0">${docs}</p>
        ${v ? `<span class="pill ${v === 'ok' ? 'ok' : 'w'}">${v === 'ok' ? 'Допущен к заказам' : 'Отправлен на доработку'}</span>` : `<div class="btns"><button class="btn sm" data-act="vet" data-p="${id}:ok">Допустить</button><button class="btn sm gh" data-act="vet" data-p="${id}:no">Запросить документы</button></div>`}</div>`;
      }).join(''),
  });

  V.aorders = () => ({
    title: 'Все заказы',
    body: `<div class="chips" style="margin-bottom:12px">${['Все', 'В работе', 'Ждут откликов', 'Споры'].map((t, i) => `<button class="chip${i === 0 ? ' on' : ''}" data-chip>${t}</button>`).join('')}</div>
      ${[['KC-2609-0148', 'Шумоизоляция', 'Студия «Тишина»', 'В работе', 'g'], ['KC-2609-0147', 'Детейлинг', '—', 'Ждёт откликов', ''], ['KC-2609-0146', 'Автостёкла', 'Мастер Игорь Н.', 'Спор', 'w'], ['KC-2609-0145', 'Сигнализация', 'АвтоЗвук Восток', 'Завершён', 'ok']]
        .map(([n, s, p, st, c]) => `<div class="card"><div class="row"><b class="sp sm">${n}</b><span class="pill ${c}">${st}</span></div><div class="xs mut">${s} · ${p}</div></div>`).join('')}`,
  });

  V.disputes = () => ({
    title: 'Споры',
    body: `<div class="card gl"><div class="row"><b class="sp">KC-2609-0146 · Автостёкла</b><span class="pill w">${S.dispute || 'открыт'}</span></div>
      <p class="sm" style="margin:10px 0"><b>Клиент:</b> после вклейки на скорости свистит у верхней кромки стекла.</p>
      <p class="sm" style="margin-bottom:10px"><b>Исполнитель:</b> готов переклеить молдинг бесплатно, нужен повторный визит.</p>
      <div class="ph" style="margin-bottom:10px"><img src="${img('srv-stekla')}" alt=""></div>
      <div class="kv"><span>Удержано</span><b>14 500 ₽</b></div>
      ${S.dispute ? '' : `<div class="btns" style="margin-top:10px"><button class="btn sm" data-act="dispute2" data-p="Доработка">Доработка</button><button class="btn sm gh" data-act="dispute2" data-p="Возврат 50 %">Возврат 50 %</button></div>`}</div>`,
  });

  // ── отрисовка
  function render() {
    if (S.role === 'client' && !S.logged) {
      const st = S.stacks['login'] = S.stacks['login'] || [{ s: 'login', p: {} }];
      return paint(st[st.length - 1], st.length > 1, true);
    }
    const t = top(); paint(t, stack().length > 1, false);
  }
  function paint(t, canBack, isLogin) {
    const v = V[t.s](t.p.id != null ? t.p.id : t.p.v);
    const tabsOn = v.tabs !== false && !isLogin;
    const tabs = ROLES[S.role].tabs;
    const ct = curTab();
    $app.innerHTML = `
      <div class="sbar"><span>9:41</span><i>▂▄▆ ◔ ▮</i></div>
      <div class="demo">демо · данные вымышленные</div>
      ${v.bare ? '' : `<div class="top">${v.back && canBack ? `<button class="ib" data-act="back" aria-label="Назад">${ic('back')}</button>` : ''}<h2>${esc(v.title || '')}</h2>${v.right || ''}<button class="ib fab" data-act="roleMenu" aria-label="Сменить роль">${ic('swap')}</button></div>`}
      <div class="body">${v.body}</div>
      ${v.compose ? `<div class="compose"><input class="inp" id="msg" placeholder="Сообщение"><button class="ib" data-act="send">${ic('send')}</button></div>` : ''}
      ${tabsOn ? `<nav class="tabs">${tabs.map(([k, n, i]) => `<button class="${k === ct ? 'on' : ''}" data-tab="${k}">${ic(i)}${n}${k === 'chats' ? '<span class="badge">2</span>' : ''}</button>`).join('')}</nav>` : ''}`;
    const b = $app.querySelector('.body'); if (b) b.scrollTop = 0;
  }

  // ── действия
  const A = {
    back() { if (S.role === 'client' && !S.logged) { S.stacks.login.pop(); render(); } else back(); },
    login() { S.logged = true; tab('home'); },
    logout() { S.logged = false; S.stacks.login = [{ s: 'login', p: {} }]; render(); },
    publish(p) {
      S.order = { s: p, car: 'Kia Sorento 2023', st: 0, pro: null };
      go('waiting');
      setTimeout(() => { if (top().s === 'waiting') { stack().pop(); go('responses'); toast('Пришло 3 отклика'); } }, 1600);
    },
    choose(id) { S.order.pro = PROS.find((x) => x.id === id); S.order.st = 1; go('pay'); },
    pay() { S.order.st = 3; const k = S.role + ':' + curTab(); S.stacks[k] = [{ s: curTab(), p: {} }, { s: 'order', p: {} }]; render(); toast('Оплачено. Деньги удержаны до приёмки'); },
    advance() { S.order.st = 4; render(); toast('Исполнитель отметил работу готовой'); },
    accept() { S.order.st = 6; const k = S.role + ':' + curTab(); S.stacks[k] = [{ s: curTab(), p: {} }, { s: 'done', p: {} }]; render(); },
    dispute() { toast('Спор открыт. Площадка ответит в течение 24 часов'); },
    send() {
      const i = document.getElementById('msg'); if (!i || !i.value.trim()) return;
      S.chat.push({ me: true, t: i.value.trim(), at: '09:20' }); render();
      setTimeout(() => { if (top().s === 'chat') { S.chat.push({ me: false, t: 'Принято 👍', at: '09:21' }); render(); } }, 900);
    },
    importLead() { toast('Заявка отправлена менеджеру. Расчёт придёт в чат'); },
    addCart() { S.cart++; render(); toast('Добавлено в корзину'); },
    buy() { S.cart = 0; back(); toast('Заказ принят. Менеджер подтвердит наличие'); },
    notif() { S.notif = !S.notif; render(); },
    bid(id) { S.bid[id] = true; render(); toast('Отклик отправлен клиенту'); },
    jobNext() { S.jobStep = Math.min(S.jobStep + 1, 4); render(); },
    vet(p) { const [id, v] = p.split(':'); S.proVerify[id] = v; render(); },
    dispute2(p) { S.dispute = 'решение: ' + p.toLowerCase(); render(); toast('Решение отправлено сторонам'); },
    roleMenu() { const order = ['client', 'pro', 'admin']; role(order[(order.indexOf(S.role) + 1) % 3]); toast({ client: 'Роль: клиент', pro: 'Роль: исполнитель', admin: 'Роль: площадка' }[S.role]); },
  };

  $app.addEventListener('click', (e) => {
    const el = e.target.closest('[data-go],[data-act],[data-tab],[data-chip],[data-role]');
    if (!el) return;
    if (el.dataset.chip !== undefined && !el.dataset.go && !el.dataset.act) {
      const box = el.parentElement; box.querySelectorAll('.chip.on, .offer .gold').forEach((c) => c.classList.remove('on', 'gold'));
      el.classList.add('on'); const b = el.querySelector('b'); if (b) b.classList.add('gold'); return;
    }
    if (el.dataset.role) return role(el.dataset.role);
    if (el.dataset.tab) return tab(el.dataset.tab);
    if (el.dataset.act) return A[el.dataset.act] && A[el.dataset.act](el.dataset.p);
    if (el.dataset.go) {
      if (S.role === 'client' && !S.logged) { S.stacks.login.push({ s: el.dataset.go, p: {} }); return render(); }
      go(el.dataset.go, { id: el.dataset.p });
    }
  });
  $app.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'msg') A.send(); });

  // ── сценарии слева
  const SCEN = {
    client: [
      ['Вход по номеру телефона', () => { S.logged = false; S.stacks.login = [{ s: 'login', p: {} }]; render(); }],
      ['Главная: услуги, привоз, предложения', () => { S.logged = true; tab('home'); }],
      ['Заказать услугу → отклики → оплата', () => { S.logged = true; tab('home'); go('service', { id: 'avtozvuk-shumoizolyaciya' }); }],
      ['Статус заказа, чат, приёмка и отзыв', () => { S.logged = true; if (!S.order || S.order.st < 3) S.order = { s: 'avtozvuk-shumoizolyaciya', car: 'Kia Sorento 2023', st: 3, pro: PROS[0] }; tab('orders'); go('order'); }],
      ['Привоз авто: этапы и документы', () => { S.logged = true; tab('home'); go('import'); }],
      ['Запчасти по VIN и корзина', () => { S.logged = true; tab('home'); go('parts'); }],
      ['Гараж: авто, ОСАГО, история', () => { S.logged = true; tab('garage'); }],
    ],
    pro: [
      ['Лента заказов рядом', () => tab('feed')],
      ['Откликнуться с ценой', () => { tab('feed'); go('feedItem', { id: 'f1' }); }],
      ['Работа по этапам и фото', () => { tab('jobs'); go('job'); }],
      ['Выплаты и удержание', () => tab('payouts')],
    ],
    admin: [
      ['Сводка: заказы, отклики, комиссия', () => tab('dash')],
      ['Проверка исполнителей', () => tab('vetting')],
      ['Все заказы', () => tab('aorders')],
      ['Разбор спора', () => tab('disputes')],
    ],
  };
  // вкладка «Выплаты» исполнителя

  function fillScen() {
    const ol = document.getElementById('scen'); if (!ol) return;
    ol.innerHTML = SCEN[S.role].map((s, i) => `<li><button data-i="${i}">${s[0]}</button></li>`).join('');
  }
  document.getElementById('scen').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) SCEN[S.role][+b.dataset.i][1](); });
  document.querySelectorAll('.roles button').forEach((b) => b.addEventListener('click', () => role(b.dataset.role)));

  fillScen(); render();
})();
