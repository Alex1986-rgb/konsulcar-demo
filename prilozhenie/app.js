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
    leads: [], notif: true, bid: {}, jobStep: 1, proVerify: { a1: null, a2: null }, dispute: null,
  };

  const ROLES = {
    client: { tabs: [['home', 'Главная', 'home'], ['cars', 'Авто', 'car'], ['parts', 'Запчасти', 'parts'], ['orders', 'Заказы', 'list'], ['profile', 'Профиль', 'user']] },
    pro: { tabs: [['feed', 'Заказы', 'feed'], ['jobs', 'Мои работы', 'list'], ['payouts', 'Выплаты', 'wallet'], ['pprofile', 'Профиль', 'user']] },
    admin: { tabs: [['dash', 'Сводка', 'chart'], ['aleads', 'Привоз', 'ship'], ['vetting', 'Проверка', 'shield'], ['aorders', 'Заказы', 'list'], ['disputes', 'Споры', 'alert']] },
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
      title: 'Добрый день!', right: `<button class="ib" data-go="chats" aria-label="Чаты">${ic('chat')}<span class="dot"></span></button><button class="ib" data-go="notif" aria-label="Уведомления">${ic('bell')}${S.leads.some((l) => l.st === 1 && !l.seen) ? '<span class="dot"></span>' : ''}</button>`,
      body: `<button class="search" data-tab="parts">${ic('search')}Запчасть по VIN, артикулу или названию</button>
      <div class="duo">
        <button class="dtile" data-tab="cars"><img src="${img('srv-import')}" alt=""><div><b>Привоз авто</b><span>Корея, Китай, Япония, США, ОАЭ · цена под ключ</span></div></button>
        <button class="dtile" data-tab="parts"><img src="${img('srv-zapchasti')}" alt=""><div><b>Запчасти</b><span>по VIN · оригинал и аналоги · сегодня</span></div></button>
      </div>
      <button class="card tap gl" data-go="calc"><div class="row"><span class="gold">${ic('ship')}</span><div class="sp"><b class="sm">Нашли машину? Рассчитайте по ссылке</b><div class="xs mut">Encar, Che168, Dongchedi → цена в Москве</div></div><span class="gold">›</span></div></button>
      <button class="hero" data-go="import" style="min-height:130px"><img src="${img('art-port-pogruzka')}" alt=""><div>
        <span class="pill g">Ваш автомобиль в пути</span>
        <b style="margin-top:8px">Kia Sorento из Кореи</b>
        <div class="prog" style="width:220px"><i style="width:43%"></i></div>
        <span class="sm mut">Этап 4 из 7 · морем во Владивосток</span></div></button>
      ${S.leads.length ? `<button class="card tap" data-go="lead" data-p="${S.leads[0].n}"><div class="row"><span class="gold">${ic('doc')}</span><div class="sp"><b class="sm">Заявка ${S.leads[0].n}</b><div class="xs mut">${esc(S.leads[0].t)}</div></div>${leadPill(S.leads[0])}</div></button>` : ''}
      ${o && o.st < 6 ? `<button class="card tap gl" data-go="order">
        <div class="row"><b style="flex:1">${esc(svc(o.s).n)}</b>${statusPill(o.st)}</div>
        <div class="sm mut" style="margin-top:4px">${esc(o.car)}${o.pro ? ' · ' + esc(o.pro.n) : ''}</div></button>` : ''}
      <h3>Предложения недели</h3>
      <div class="hs">${OFFERS.map((f, i) => `<button class="offer" data-go="offer" data-p="${i}"><img src="${img(f.img)}" alt="" loading="lazy"><div>
        <b>${esc(f.t)}</b><span class="xs mut">${f.c} · под ключ</span><div class="price gold" style="margin-top:6px">${rub(f.p)}</div></div></button>`).join('')}</div>
      <h3>Автоуслуги</h3>
      <div class="grid">${chips.filter((s) => s !== 'srv-import' && s !== 'zapchasti').map((s) => `<button class="tile" data-go="service" data-p="${s}"><img src="${img(svc(s).img)}" alt="" loading="lazy"><span>${esc(svc(s).t)}</span></button>`).join('')}</div>`,
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
      body: `${S.leads.length ? `<h3>Заявки на привоз</h3>${S.leads.map((l) => `<button class="card tap${l.st === 1 && !l.seen ? ' gl' : ''}" data-go="lead" data-p="${l.n}"><div class="row"><b class="sp sm">${esc(l.t)}</b>${leadPill(l)}</div><div class="xs mut" style="margin-top:4px">${l.n}${l.final ? ' · ' + num(l.final) + ' ₽' : l.total ? ' · ≈ ' + num(l.total) + ' ₽' : ''}</div></button>`).join('')}` : ''}
      ${o ? `<h3>Текущие</h3><button class="card tap gl" data-go="order"><div class="row"><b class="sp">${esc(svc(o.s).n)}</b>${statusPill(o.st)}</div><div class="sm mut" style="margin-top:4px">${esc(o.car)}</div></button>` : `<div class="card"><p class="sm mut">Активных заказов нет. Выберите услугу на главной — исполнители откликнутся с ценой.</p><button class="btn" data-go="newOrder" data-p="avtozvuk-shumoizolyaciya">Создать заказ</button></div>`}
      ${S.partsOrder ? `<button class="card tap gl" data-go="partsOrder"><div class="row"><span class="gold">${ic('parts')}</span><b class="sp">Запчасти · ${S.partsOrder.n}</b><span class="pill g">${PST[S.partsOrder.st]}</span></div></button>` : ''}
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
      <button class="btn" data-act="importLead">Получить подбор от менеджера</button>
      <button class="btn gh" data-go="calc">Уже нашли машину? Рассчитать по ссылке</button>
      <button class="btn gh" data-go="cars">Смотреть каталог с ценами под ключ</button>
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
      <button class="btn" data-act="importLead" data-p="${i}">Хочу такой</button>`,
    };
  };

  // ── Калькулятор привоза ─────────────────────────────
  // Ставки ДЕМОНСТРАЦИОННЫЕ. В рабочей версии курсы берутся из ЦБ + надбавка, расходы — из админки
  // (экран «Ставки калькулятора»), а формула сверяется с калькулятором ТКС и настраивается на реальных сделках.
  const RATES = {
    fx: { KRW: 0.062, CNY: 13.1, EUR: 95 }, fxMarkup: 2, // курс, надбавка %
    local: { KRW: 55000, CNY: 60000 },                     // по стране до порта, ₽
    freight: { KRW: 95000, CNY: 110000 },                 // фрахт / доставка до границы
    svh: 25000, broker: 45000, lab: 60000, truck: 140000, fee: 100000,
  };
  const LISTINGS = {
    encar: { src: 'Encar', country: 'Корея', cur: 'KRW', url: 'fem.encar.com/cars/detail/39284751', t: 'Kia Sportage 2.0', y: 2023, age: 'u3', cc: 1999, hp: 150, km: '21 400 км', price: 26500000, img: 'offer-crossover-grey', fuel: 'бензин' },
    che168: { src: 'Che168', country: 'Китай', cur: 'CNY', url: 'www.che168.com/dealer/481522/53120944.html', t: 'Haval Jolion 1.5T', y: 2024, age: 'u3', cc: 1497, hp: 150, km: '8 900 км', price: 92000, img: 'offer-crossover-dark', fuel: 'бензин' },
    dongchedi: { src: 'Dongchedi', country: 'Китай', cur: 'CNY', url: 'www.dongchedi.com/usedcar/17840321', t: 'Chery Tiggo 7 Pro 1.5T', y: 2021, age: '35', cc: 1498, hp: 147, km: '46 000 км', price: 68000, img: 'offer-suv-black', fuel: 'бензин' },
  };
  const CUR = { KRW: '₩', CNY: '¥' };
  const mln = (n) => (n / 1e6).toFixed(2).replace('.', ',');
  const num = (n) => Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ');
  // Пошлина для физлица по единым ставкам (ЕТС): до 3 лет — % от цены, но не меньше €/см³; старше — €/см³.
  function duty(eur, cc, age) {
    if (age === 'u3') {
      const b = [[8500, .54, 2.5], [16700, .48, 3.5], [42300, .48, 5.5], [84500, .48, 7.5], [169000, .48, 15], [Infinity, .48, 20]].find((x) => eur <= x[0]);
      return Math.max(eur * b[1], cc * b[2]);
    }
    const t = age === '35' ? [1.5, 1.7, 2.5, 2.7, 3.0, 3.6] : [3.0, 3.2, 3.5, 4.8, 5.0, 5.7];
    const i = [1000, 1500, 1800, 2300, 3000, Infinity].findIndex((v) => cc <= v);
    return cc * t[i];
  }
  const clearFee = (rub) => [[200000, 1231], [450000, 2462], [1200000, 4924], [2700000, 13541], [4200000, 18465], [5500000, 21344], [10000000, 49240], [Infinity, 73860]].find((x) => rub <= x[0])[1];
  function calc(c, ent) {
    const ul = ent === 'ul';
    const fx = RATES.fx[c.cur] * (1 + RATES.fxMarkup / 100);
    const car = c.price * fx;
    const eur = car / RATES.fx.EUR;
    const d = ul ? null : duty(eur, c.cc, c.age) * RATES.fx.EUR;
    const util = ul || c.hp > 160 || c.cc > 3000 ? null : (c.age === 'u3' ? 3400 : 5200);
    const cf = clearFee(car);
    const groups = [
      ['Автомобиль', [[`Цена в объявлении: ${num(c.price)} ${CUR[c.cur]} × ${fx.toFixed(c.cur === 'KRW' ? 4 : 2)} ₽`, car]]],
      [ul ? 'Таможня (юрлицо)' : 'Таможня (физлицо)', ul ? [['Пошлина, акциз, НДС 20 %', null], ['Утилизационный сбор', null], ['Сбор за таможенное оформление', cf]] : [['Пошлина по единой ставке', d], ['Утилизационный сбор', util], ['Сбор за таможенное оформление', cf]]],
      ['Доставка и оформление', [[`Доставка по стране, экспорт (${c.country})`, RATES.local[c.cur]], ['Фрахт до Владивостока', RATES.freight[c.cur]], ['СВХ, выгрузка', RATES.svh], ['Таможенный брокер', RATES.broker], ['СБКТС и ЭПТС', RATES.lab], ['Автовоз до Москвы', RATES.truck], ['Услуги КонсулКар', RATES.fee]]],
    ];
    const total = groups.reduce((s, g) => s + g[1].reduce((a, r) => a + (r[1] || 0), 0), 0);
    return { groups, total, util, ul };
  }
  S.calc = { ent: 'fl', key: 'encar', manual: { cur: 'KRW', price: 26500000, cc: 1999, hp: 150, age: 'u3' } };

  V.calc = () => ({
    title: 'Расчёт под ключ', back: true,
    body: `<p class="sm mut">Вставьте ссылку на объявление с Encar, Che168 или Dongchedi — посчитаем цену автомобиля в Москве с таможней и доставкой.</p>
      <label class="field" style="margin-top:12px"><span>Ссылка на объявление</span><input class="inp" id="calcUrl" value="https://${LISTINGS[S.calc.key].url}"></label>
      <div class="chips" style="margin-bottom:6px">${Object.entries(LISTINGS).map(([k, l]) => `<button class="chip${k === S.calc.key ? ' on' : ''}" data-act="calcPick" data-p="${k}">Пример: ${l.src}</button>`).join('')}</div>
      <button class="btn" data-act="calcRun">Рассчитать</button>
      <button class="btn gh" data-go="calcManual">Нет ссылки — ввести параметры</button>
      <div class="card" style="margin-top:14px"><div class="row" style="align-items:flex-start"><span class="gold">${ic('shield')}</span><div class="sm">Цена предварительная. Итог и наличие подтвердит менеджер — он получит расчёт вместе с заявкой.</div></div></div>`,
  });

  V.calcManual = () => {
    const m = S.calc.manual;
    const ch = (k, v, t) => `<button class="chip${m[k] === v ? ' on' : ''}" data-act="calcSet" data-p="${k}:${v}">${t}</button>`;
    return {
      title: 'Параметры автомобиля', back: true,
      body: `<div class="field"><span>Страна</span><div class="chips">${ch('cur', 'KRW', 'Корея, ₩')}${ch('cur', 'CNY', 'Китай, ¥')}</div></div>
      <label class="field"><span>Цена в объявлении, ${CUR[m.cur]}</span><input class="inp" id="mPrice" inputmode="numeric" value="${m.price}"></label>
      <div class="row" style="gap:8px"><label class="field sp"><span>Объём, см³</span><input class="inp" id="mCc" inputmode="numeric" value="${m.cc}"></label><label class="field sp"><span>Мощность, л.с.</span><input class="inp" id="mHp" inputmode="numeric" value="${m.hp}"></label></div>
      <div class="field"><span>Возраст автомобиля</span><div class="chips">${ch('age', 'u3', 'до 3 лет')}${ch('age', '35', '3–5 лет')}${ch('age', 'o5', 'старше 5')}</div></div>
      <button class="btn" data-act="calcManualRun">Рассчитать</button>`,
    };
  };

  V.calcResult = () => {
    const c = S.calc.car; const r = calc(c, S.calc.ent);
    const ent = (v, t) => `<button class="chip${S.calc.ent === v ? ' on' : ''}" data-act="calcEnt" data-p="${v}">${t}</button>`;
    return {
      title: 'Расчёт', back: true,
      body: `<div class="card" style="padding:0;overflow:hidden">${c.img ? `<img src="${img(c.img)}" alt="" style="width:100%;height:140px;object-fit:cover">` : ''}<div style="padding:12px 14px">
        <div class="row"><b class="sp">${esc(c.t)}${c.y ? ' ' + c.y : ''}</b>${c.src ? `<span class="pill">данные объявления</span>` : ''}</div>
        <div class="xs mut" style="margin-top:4px">${[c.src && c.src + ' · ' + c.country, c.cc + ' см³', c.hp + ' л.с.', c.km, c.fuel].filter(Boolean).join(' · ')}</div></div></div>
      <div class="card gl"><span class="sm mut">Цена под ключ в Москве</span><div class="big gold" style="margin:6px 0 4px">${r.util === null && !r.ul ? 'от ' + num(r.total) + ' ₽' : mln(r.total * 0.97) + '–' + mln(r.total * 1.03) + ' млн ₽'}</div>
        <span class="xs mut">предварительно · ${r.ul ? 'без таможенных платежей' : r.util === null ? 'без утильсбора — он добавится' : 'вилка ±3 % · не является публичной офертой'}</span>
        <div class="chips" style="margin-top:10px">${ent('fl', 'Покупаю на себя')}${ent('ul', 'На компанию')}</div></div>
      ${r.groups.map(([g, rows]) => `<h3>${g}</h3><div class="card">${rows.map(([t, v]) => `<div class="kv"><span>${t}</span><b>${v === null ? '<span class="mut">посчитает менеджер</span>' : num(v) + ' ₽'}</b></div>`).join('')}</div>`).join('')}
      ${r.ul ? '<p class="xs mut">Для компании таможня считается иначе: пошлина, акциз и НДС 20 % (его можно принять к вычету). Менеджер пришлёт полный расчёт.</p>' : r.util === null ? '<div class="card" style="border-color:rgba(217,139,58,.5)"><b class="sm" style="color:var(--warn)">⚠ Свыше 160 л.с. или 3 л — коммерческий утильсбор</b><p class="sm mut" style="margin-top:4px">В 2026 году это от 900 000 ₽ и выше вместо 3 400 ₽. Менеджер добавит точную сумму и подскажет версии этой модели до 160 л.с.</p></div>' : ''}
      <p class="xs mut" style="margin-top:6px">Курсы ₩ и ¥ — по ЦБ с надбавкой ${RATES.fxMarkup} %. Ставки в прототипе условные: в рабочей версии их ведёт менеджер, а формула сверяется с калькулятором ТКС.</p>
      <button class="btn" data-act="calcOrder">Заказать этот автомобиль</button>
      <button class="btn gh" data-go="calcManual">Изменить параметры</button>`,
    };
  };

  V.rates = () => ({
    title: 'Ставки калькулятора', back: true,
    body: `<p class="sm mut" style="margin-bottom:12px">Менеджер меняет ставку — все расчёты в приложении сразу пересчитываются.</p>
      <h3>Курсы</h3><div class="card">
        <div class="kv"><span>Воны ₩ → ₽ (ЦБ)</span><b>${RATES.fx.KRW}</b></div><div class="kv"><span>Юани ¥ → ₽ (ЦБ)</span><b>${RATES.fx.CNY}</b></div>
        <div class="kv"><span>Евро → ₽ (для пошлины)</span><b>${RATES.fx.EUR}</b></div>
        <div class="kv"><span>Надбавка к курсу, %</span><input class="inp" style="width:90px;padding:6px 10px;text-align:right" data-rate="fxMarkup" value="${RATES.fxMarkup}"></div></div>
      <h3>Расходы, ₽</h3><div class="card">${[['svh', 'СВХ, выгрузка'], ['broker', 'Таможенный брокер'], ['lab', 'СБКТС и ЭПТС'], ['truck', 'Автовоз до Москвы'], ['fee', 'Услуги КонсулКар']].map(([k, t]) => `<div class="kv"><span>${t}</span><input class="inp" style="width:110px;padding:6px 10px;text-align:right" data-rate="${k}" value="${RATES[k]}"></div>`).join('')}</div>
      <h3>Сверка на сделках</h3><div class="card">
        ${[['Kia Sportage 2023', '2 981 400', '2 948 000'], ['Hyundai Tucson 2022', '3 104 900', '3 150 000'], ['Haval Jolion 2024', '2 297 800', '2 270 000']].map(([t, a, b]) => `<div class="kv"><span>${t}</span><b class="sm">${a} / ${b}</b></div>`).join('')}
        <p class="xs mut" style="margin-top:6px">калькулятор / фактическая сделка — цель: расхождение до 2–3 %</p></div>
      <button class="btn" data-act="ratesSave">Сохранить ставки</button>`,
  });

  // ── Заявки на привоз: клиент видит статус, менеджер — расчёт ─
  const LST = ['Менеджер проверяет', 'Цена подтверждена', 'Договор на подписи', 'Машина продана'];
  const leadPill = (l) => `<span class="pill ${l.st === 1 ? 'ok' : l.st === 3 ? 'w' : 'g'}">${LST[l.st]}</span>`;
  const ADM_LEADS = [
    { n: 'KC-2609-0149', who: 'Ирина · +7 9•• •••-12-40', t: 'Hyundai Tucson 2.0 2022', total: 3104900, src: 'Encar', st: 0, at: '11:42' },
    { n: 'KC-2609-0147', who: 'Олег · +7 9•• •••-77-05', t: 'Haval Jolion 1.5T 2024', total: 2297800, src: 'Che168', st: 1, final: 2270000, at: '09:15' },
  ];
  function addLead(o) {
    const n = 'KC-2609-01' + (53 + S.leads.length);
    S.leads.unshift(Object.assign({ n, who: 'Александр · +7 900 000-00-00', st: 0, at: 'только что', seen: true }, o));
    go('leadDone', { id: n });
  }
  const findLead = (n) => S.leads.find((x) => x.n === n) || ADM_LEADS.find((x) => x.n === n);
  function badge(k) {
    if (S.role === 'client' && k === 'orders' && S.leads.some((l) => l.st === 1 && !l.seen)) return '<span class="badge">1</span>';
    if (S.role === 'admin' && k === 'aleads') { const c = S.leads.concat(ADM_LEADS).filter((l) => l.st === 0).length; return c ? `<span class="badge">${c}</span>` : ''; }
    return '';
  }
  const calcRows = (r, empty) => r.groups.flatMap((g) => g[1]).map(([t, v]) => `<div class="kv"><span>${t}</span><b>${v === null ? empty : num(v) + ' ₽'}</b></div>`).join('');

  V.leadDone = (n) => {
    const l = findLead(n);
    return {
      title: '', back: false,
      body: `<div class="okc">${ic('check')}</div><div class="center big">Заявка ${l.n}</div>
      <p class="center mut" style="margin:8px 0 18px">${esc(l.t)}${l.total ? ' · ≈ ' + num(l.total) + ' ₽' : ''}</p>
      <div class="card"><b class="sm">Что дальше</b>
        <ol class="tl" style="margin-top:10px"><li class="c"><i></i><b>Менеджер проверит, что машина продаётся</b><span class="xs mut">и пересчитает по сегодняшнему курсу</span></li>
        <li><i></i><b>Пришлёт подтверждённую цену</b><span class="xs mut">уведомлением в приложении</span></li>
        <li><i></i><b>Договор и оплата</b><span class="xs mut">после вашего согласия</span></li></ol>
        <p class="xs mut">Обычно отвечаем за 15 минут, ежедневно с 9:00 до 21:00.</p></div>
      <div class="btns"><button class="btn gh" data-tab="orders">Мои заявки</button><button class="btn" data-go="chatMgr">Чат с менеджером</button></div>`,
    };
  };

  V.lead = (n) => {
    const l = findLead(n); l.seen = true;
    const r = l.car ? calc(l.car, l.ent) : null;
    const steps = ['Заявка отправлена', 'Цена и наличие подтверждены', 'Договор', 'Оплата и выкуп'];
    const cls = (i) => (l.st === 3 ? (i === 0 ? 'd' : '') : i <= l.st ? 'd' : i === l.st + 1 ? 'c' : '');
    return {
      title: 'Заявка ' + l.n, back: true, right: `<button class="ib" data-go="chatMgr">${ic('chat')}</button>`,
      body: `<div class="card gl"><div class="row"><b class="sp">${esc(l.t)}</b>${leadPill(l)}</div><div class="xs mut" style="margin-top:4px">${esc(l.src)}</div></div>
      <div class="card"><div class="kv"><span>Предварительная цена</span><b>${l.total ? num(l.total) + ' ₽' : 'считает менеджер'}</b></div>
        ${l.final ? `<div class="kv"><span>Подтверждённая цена</span><b class="gold">${num(l.final)} ₽</b></div>` : ''}</div>
      <ol class="tl">${steps.map((t, i) => `<li class="${cls(i)}"><i></i><b>${t}</b></li>`).join('')}</ol>
      ${l.st === 0 ? '<p class="sm mut">Менеджер проверяет объявление и считает по сегодняшнему курсу. Как только подтвердит — придёт уведомление.</p><p class="xs mut" style="margin-top:6px">Демо: переключитесь на роль «Площадка» → вкладка «Привоз» и ответьте от лица менеджера.</p>' : ''}
      ${l.st === 1 ? `<button class="btn" data-act="leadContract" data-p="${l.n}">Согласен — прислать договор</button><button class="btn gh" data-go="chatMgr">Обсудить с менеджером</button>` : ''}
      ${l.st === 2 ? '<div class="card"><span class="sm">Договор отправлен. После подписания и предоплаты начнётся выкуп — этапы появятся в разделе «Привоз».</span></div>' : ''}
      ${l.st === 3 ? '<div class="card"><span class="sm">Эту машину уже продали. Менеджер подобрал три похожих — они в чате.</span></div>' : ''}
      ${r ? `<h3>Расчёт</h3><div class="card">${calcRows(r, '—')}</div>` : ''}`,
    };
  };

  V.aleads = () => ({
    title: 'Заявки на привоз',
    body: `<p class="sm mut" style="margin-bottom:12px">Приходят из калькулятора, каталога и предложений недели — сразу с предварительным расчётом.</p>
      ${S.leads.concat(ADM_LEADS).map((l) => `<button class="card tap${l.st === 0 ? ' gl' : ''}" data-go="alead" data-p="${l.n}"><div class="row"><b class="sp sm">${l.n}</b>${leadPill(l)}</div>
        <div class="sm" style="margin-top:4px">${esc(l.t)}</div><div class="xs mut">${esc(l.who)} · ${l.at}${l.total ? ' · ≈ ' + num(l.total) + ' ₽' : ''}</div></button>`).join('')}`,
  });

  V.alead = (n) => {
    const l = findLead(n); const r = l.car ? calc(l.car, l.ent) : null;
    return {
      title: l.n, back: true,
      body: `<div class="card gl"><b>${esc(l.t)}</b><div class="xs mut" style="margin-top:4px">${esc(l.who)}</div><div class="xs mut">${esc(l.src)}</div>
        ${l.car && l.car.src ? '<div class="pill ok" style="margin-top:8px">✓ автопроверка при заявке: объявление активно</div>' : ''}</div>
      ${r ? `<div class="card">${calcRows(r, '<span class="mut">вручную</span>')}<div class="kv"><span>Итого по калькулятору</span><b class="gold">${r.ul ? '—' : num(r.total) + ' ₽'}</b></div></div>` : `<div class="card"><div class="kv"><span>Предварительно</span><b>${l.total ? num(l.total) + ' ₽' : '—'}</b></div></div>`}
      ${l.st === 0 ? `<label class="field"><span>Итоговая цена для клиента, ₽</span><input class="inp" id="finalPrice" inputmode="numeric" value="${l.total ? Math.round(l.total / 1000) * 1000 : ''}"></label>
        <button class="btn" data-act="leadConfirm" data-p="${l.n}">Подтвердить клиенту</button>
        <button class="btn gh" data-act="leadSold" data-p="${l.n}">Машина продана — предложить похожие</button>` : `<div class="card"><span class="sm">Статус: ${LST[l.st]}${l.final ? ' · ' + num(l.final) + ' ₽' : ''}</span></div>`}
      <p class="xs mut" style="margin-top:8px">В рабочей версии заявка одновременно создаёт сделку в amoCRM с расчётом в примечании.</p>`,
    };
  };

  V.garage = () => ({
    title: 'Гараж', back: true, right: `<button class="ib">+</button>`,
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

  // ── Каталог автомобилей (демо-выгрузка площадок) ─────
  const CATALOG = [
    ['encar', 'Kia Sportage 2.0', 2023, 'u3', 1999, 150, '21 400', 26500000, 'offer-crossover-grey'],
    ['encar', 'Hyundai Tucson 2.0', 2022, 'u3', 1999, 156, '34 800', 24900000, 'offer-crossover-dark'],
    ['encar', 'Kia Sorento 2.5', 2021, '35', 2497, 180, '52 000', 29800000, 'offer-suv-white'],
    ['encar', 'Genesis GV70 2.5T', 2021, '35', 2497, 304, '41 300', 38500000, 'offer-suv-black'],
    ['encar', 'Hyundai Santa Fe 2.2D', 2020, '35', 2199, 199, '68 900', 25400000, 'offer-suv-white'],
    ['encar', 'Kia K5 2.0', 2022, 'u3', 1999, 160, '29 100', 21300000, 'offer-crossover-grey'],
    ['che168', 'Haval Jolion 1.5T', 2024, 'u3', 1497, 150, '8 900', 92000, 'offer-crossover-dark'],
    ['che168', 'Geely Coolray 1.5T', 2023, 'u3', 1477, 150, '17 500', 78000, 'offer-crossover-grey'],
    ['che168', 'Changan CS55 Plus 1.5T', 2023, 'u3', 1494, 160, '22 000', 81000, 'offer-suv-black'],
    ['dongchedi', 'Chery Tiggo 7 Pro 1.5T', 2021, '35', 1498, 147, '46 000', 68000, 'offer-suv-black'],
    ['dongchedi', 'Toyota RAV4 2.0', 2021, '35', 1987, 171, '58 000', 139000, 'offer-suv-white'],
    ['dongchedi', 'Honda CR-V 1.5T', 2022, 'u3', 1498, 193, '31 500', 152000, 'offer-crossover-dark'],
  ].map(([src, t, y, age, cc, hp, km, price, im], i) => {
    const l = LISTINGS[src];
    return { id: i, src: l.src, country: l.country, cur: l.cur, t, y, age, cc, hp, km: km + ' км', price, img: im, fuel: 'бензин' };
  });
  S.catF = { c: 'all', b: 'all' };
  V.cars = () => {
    const f = S.catF;
    const list = CATALOG.map((c) => ({ c, r: calc(c) }))
      .filter(({ c }) => f.c === 'all' || c.country === f.c)
      .filter(({ r }) => f.b === 'all' || (f.b === '3' ? r.total <= 3e6 : f.b === '4' ? r.total > 3e6 && r.total <= 4e6 : r.total > 4e6))
      .sort((a, b) => a.r.total - b.r.total);
    const ch = (k, v, t) => `<button class="chip${f[k] === v ? ' on' : ''}" data-act="catF" data-p="${k}:${v}">${t}</button>`;
    return {
      title: 'Авто из-за рубежа', back: true,
      body: `<div class="chips" style="margin-bottom:8px">${ch('c', 'all', 'Все')}${ch('c', 'Корея', 'Корея')}${ch('c', 'Китай', 'Китай')}</div>
      <div class="chips" style="margin-bottom:12px">${ch('b', 'all', 'Любой бюджет')}${ch('b', '3', 'до 3 млн')}${ch('b', '4', '3–4 млн')}${ch('b', '5', '4+ млн')}</div>
      <p class="xs mut" style="margin-bottom:8px">${list.length} из 12 480 · обновлено сегодня в 06:00 · цены под ключ в Москве</p>
      ${list.map(({ c, r }) => `<button class="card tap" data-act="catOpen" data-p="${c.id}" style="padding:0;overflow:hidden;display:flex">
        <img src="${img(c.img)}" alt="" loading="lazy" style="width:118px;height:auto;object-fit:cover;flex:none">
        <div style="padding:10px 12px;min-width:0"><b class="sm">${esc(c.t)} ${c.y}</b>
        <div class="xs mut">${c.km} · ${c.hp} л.с. · ${c.src}</div>
        <div class="price gold" style="margin-top:6px">${r.util === null ? 'от ' : '≈ '}${num(r.total)} ₽</div>
        ${r.util === null ? '<div class="xs" style="color:var(--warn)">⚠ >160 л.с.: + коммерческий утильсбор</div>' : ''}<div class="xs mut">в объявлении ${num(c.price)} ${CUR[c.cur]}</div></div></button>`).join('') || '<p class="mut">Под фильтр ничего не нашлось</p>'}
      <p class="xs mut">В рабочей версии каталог обновляется с площадок по расписанию, проданные машины снимаются автоматически.</p>`,
    };
  };

  // ── Запчасти: разделы → деталь → предложения поставщиков ─
  const NODES = [['to', 'ТО и фильтры', 'cat-filtry'], ['brake', 'Тормоза', 'cat-tormoznaya-sistema'], ['susp', 'Подвеска', 'cat-podveska'], ['el', 'Электрика', 'cat-elektrika'], ['body', 'Кузов', 'cat-kuzov'], ['oil', 'Масла', 'cat-masla']];
  const OFFER = (b, a, kind, p, stock, sup) => ({ b, a, kind, p, stock, sup });
  const ITEMS = {
    brake: [
      { t: 'Колодки тормозные передние', img: 'cat-tormoznaya-sistema', o: [OFFER('Hyundai/Kia', '58101P2A00', 'оригинал', 9870, '1–2 дня', 'Поставщик'), OFFER('Brembo', 'P 30 055', 'аналог', 6420, 'сегодня', 'Склад в Москве'), OFFER('Sangsin', 'SP1848', 'аналог', 3950, 'сегодня', 'Склад в Москве')] },
      { t: 'Диск тормозной передний', img: 'cat-tormoznaya-sistema', o: [OFFER('Hyundai/Kia', '51712P2000', 'оригинал', 11200, '1–2 дня', 'Поставщик'), OFFER('TRW', 'DF6981S', 'аналог', 6150, 'сегодня', 'Склад в Москве')] },
      { t: 'Колодки тормозные задние', img: 'cat-tormoznaya-sistema', o: [OFFER('Hyundai/Kia', '58302P2A00', 'оригинал', 7340, '7–10 дней', 'Под заказ'), OFFER('Brembo', 'P 30 104', 'аналог', 4880, '1–2 дня', 'Поставщик')] },
    ],
    to: [
      { t: 'Фильтр масляный', img: 'cat-filtry', o: [OFFER('Hyundai/Kia', '263002J000', 'оригинал', 1150, 'сегодня', 'Склад в Москве'), OFFER('MANN-FILTER', 'W 811/80', 'аналог', 890, 'сегодня', 'Склад в Москве')] },
      { t: 'Фильтр воздушный', img: 'cat-filtry', o: [OFFER('Hyundai/Kia', '28113P2100', 'оригинал', 2480, '1–2 дня', 'Поставщик'), OFFER('MAHLE', 'LX 4521', 'аналог', 1390, 'сегодня', 'Склад в Москве')] },
      { t: 'Фильтр салона', img: 'cat-filtry', o: [OFFER('Hyundai/Kia', '97133P2000', 'оригинал', 1960, '1–2 дня', 'Поставщик'), OFFER('Bosch', '1 987 435 612', 'аналог', 1120, 'сегодня', 'Склад в Москве')] },
    ],
  };
  S.parts = { node: 'brake', items: [], q: '', car: 0 };
  V.parts = () => ({
    title: 'Запчасти', back: true,
    right: `<button class="ib" data-go="cart">${ic('cart')}${S.parts.items.length ? '<span class="dot"></span>' : ''}</button>`,
    body: `<div class="card gl"><div class="row"><span class="gold">${ic('car')}</span><div class="sp"><b class="sm">${CARS[S.parts.car].t} ${CARS[S.parts.car].y}</b><div class="xs mut">VIN ${CARS[S.parts.car].vin} · из гаража</div></div><button class="btn sm gh" data-act="partsCar">Сменить</button></div></div>
      <div class="search" style="padding:6px 6px 6px 14px">${ic('search')}<input id="pq" class="sp" style="background:none;border:0;outline:0;padding:6px 0;min-width:0" placeholder="Деталь или артикул" value="${esc(S.parts.q)}"><button class="btn sm" data-act="partsSearch">Найти</button></div>
      ${S.parts.q ? partsResults() : ''}
      <h3>Разделы</h3>
      <div class="grid">${NODES.map(([k, t, im]) => `<button class="tile" data-act="partsNode" data-p="${k}" style="${S.parts.node === k ? 'border-color:var(--gold)' : ''}"><img src="${img(im)}" alt="" loading="lazy"><span>${t}</span></button>`).join('')}</div>
      <h3>${NODES.find((n) => n[0] === S.parts.node)[1]}</h3>
      ${(ITEMS[S.parts.node] || []).map((x, i) => {
        const min = Math.min(...x.o.map((o) => o.p)); const today = x.o.some((o) => o.stock === 'сегодня');
        return `<button class="card tap row" data-go="partItem" data-p="${S.parts.node}:${i}"><img src="${img(x.img)}" alt="" style="width:56px;height:56px;border-radius:10px;object-fit:cover"><div class="sp"><b class="sm">${x.t}</b>
          <div class="xs mut">${x.o.length} предложения · от <b class="gold">${rub(min)}</b>${today ? ' · <span class="ok">есть сегодня</span>' : ''}</div></div><span class="gold">›</span></button>`;
      }).join('') || '<div class="card"><p class="sm mut">В прототипе детали заполнены для разделов «Тормоза» и «ТО и фильтры». В рабочей версии — поиск по артикулу у поставщика и подбор по VIN менеджером или через VIN-каталог.</p></div>'}
      <div class="card"><div class="row"><span class="gold">${ic('parts')}</span><span class="sm sp">Установка у проверенного мастера — одним заказом с запчастью</span></div></div>`,
  });

  function partsResults() {
    const q = S.parts.q.toLowerCase().replace(/\s/g, '');
    const res = [];
    Object.entries(ITEMS).forEach(([n, arr]) => arr.forEach((x, i) => {
      if ((x.t + x.o.map((o) => o.a + o.b).join(' ')).toLowerCase().replace(/\s/g, '').includes(q)) res.push([n, i, x]);
    }));
    return `<div class="row" style="margin:12px 0 4px"><b class="sp sm">Найдено: ${res.length}</b><button class="chip" data-act="partsClear">× сбросить</button></div>
      ${res.map(([n, i, x]) => `<button class="card tap" data-go="partItem" data-p="${n}:${i}"><b class="sm">${x.t}</b><div class="xs mut">от ${rub(Math.min(...x.o.map((o) => o.p)))} · ${x.o.length} предложения</div></button>`).join('') || '<p class="sm mut">Ничего не нашли — пришлите фото детали менеджеру, подберём по VIN.</p>'}`;
  }
  V.partItem = (p) => {
    const [n, i] = p.split(':'); const x = ITEMS[n][+i];
    return {
      title: x.t, back: true,
      body: `<p class="sm mut" style="margin-bottom:10px">Для ${CARS[S.parts.car].t} ${CARS[S.parts.car].y} · предложения от склада и поставщиков</p>
      ${x.o.map((o, j) => `<div class="card"><div class="row"><b class="sp">${o.b}</b><span class="pill ${o.kind === 'оригинал' ? 'g' : ''}">${o.kind}</span></div>
        <div class="xs mut" style="margin:3px 0 8px">${o.a} · ${o.sup}</div>
        <div class="row"><span class="price sp">${rub(o.p)}</span><span class="xs ${o.stock === 'сегодня' ? 'ok' : 'mut'}">${o.stock === 'сегодня' ? 'в наличии сегодня' : o.stock}</span>
        <button class="btn sm" data-act="partAdd" data-p="${n}:${i}:${j}">В корзину</button></div></div>`).join('')}
      <p class="xs mut">Цены и остатки в рабочей версии приходят из API поставщика. Совместимость по VIN подтверждает менеджер или подключаемый VIN-каталог.</p>`,
    };
  };

  V.cart = () => {
    const it = S.parts.items; const sum = it.reduce((s, x) => s + x.p, 0);
    return {
      title: 'Корзина', back: true,
      body: it.length ? `${it.map((x, k) => `<div class="card row"><div class="sp"><b class="sm">${x.t}</b><div class="xs mut">${x.b} · ${x.a} · ${x.stock}</div></div><b>${rub(x.p)}</b><button class="ib" data-act="partDel" data-p="${k}" aria-label="Убрать">×</button></div>`).join('')}
      <div class="card"><div class="kv"><span>Итого</span><b class="gold">${rub(sum)}</b></div></div>
      <div class="field"><span>Получение</span><div class="chips"><button class="chip on" data-chip>Самовывоз: Щёлковское ш., 77</button><button class="chip" data-chip>Доставка</button></div></div>
      <div class="field"><span>Установка</span><div class="chips"><button class="chip on" data-chip>Найти мастера</button><button class="chip" data-chip>Только запчасти</button></div></div>
      <button class="btn" data-act="buy">Заказать в 1 клик</button>` : '<p class="mut">Корзина пуста</p><button class="btn gh" data-act="back">К запчастям</button>',
    };
  };

  const PST = ['Заказ принят', 'Наличие подтверждено', 'Едет к нам', 'Готово к выдаче'];
  V.partsOrder = () => {
    const o = S.partsOrder;
    return {
      title: 'Заказ ' + o.n, back: true,
      body: `<div class="card gl">${o.items.map((x) => `<div class="kv"><span>${x.t} · ${x.b}</span><b>${rub(x.p)}</b></div>`).join('')}</div>
      <ol class="tl">${PST.map((t, i) => `<li class="${i < o.st ? 'd' : i === o.st ? 'c' : ''}"><i></i><b>${t}</b><span class="xs mut">${['только что', 'менеджер сверил по VIN', 'ожидаем 20.09', 'Щёлковское ш., 77, стр. 1'][i]}</span></li>`).join('')}</ol>
      ${o.st < 3 ? '<button class="btn gh" data-act="partsNext">Демо: следующий статус</button>' : '<div class="card"><span class="sm">Детали на складе. Мастер по установке получил заказ и свяжется с вами.</span></div>'}`,
    };
  };

  V.chats = () => ({
    title: 'Чаты', back: true,
    body: [['ТШ', 'Студия «Тишина»', S.chat[S.chat.length - 1].t, 'chat'], ['КК', 'Менеджер по привозу', 'Фото погрузки загрузил в документы.', 'chatMgr'], ['КК', 'Поддержка КонсулКар', 'Здравствуйте! Чем помочь?', 'chatMgr']]
      .map(([a, n, t, g]) => `<button class="li" data-go="${g}"><div class="av">${a}</div><div class="sp" style="min-width:0"><b class="sm">${n}</b><div class="xs mut" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(t)}</div></div></button>`).join(''),
  });

  V.profile = () => ({
    title: 'Профиль',
    body: `<div class="row" style="margin-bottom:14px"><div class="av" style="width:58px;height:58px">АК</div><div><b>Александр</b><div class="sm mut">+7 900 000-00-00</div></div></div>
      <div class="card">
        <div class="li"><span class="sp sm">Уведомления о статусах</span><button class="sw${S.notif ? ' on' : ''}" data-act="notif"></button></div>
        <button class="li" data-go="garage"><span class="sp sm">Гараж: мои автомобили</span><span class="mut xs">2</span></button>
        <button class="li" data-go="chats"><span class="sp sm">Чаты</span><span class="gold xs">2 новых</span></button>
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
        <div class="card"><span class="xs mut">Заявок на привоз</span><b>23</b><span class="xs ok">+4 к прошлой</span></div>
        <div class="card"><span class="xs mut">Заказов запчастей</span><b>64</b><span class="xs mut">чек 7 900 ₽</span></div>
        <div class="card"><span class="xs mut">Заказов услуг</span><b>148</b><span class="xs mut">3,4 отклика</span></div>
        <div class="card"><span class="xs mut">Комиссия площадки</span><b class="gold">322 640 ₽</b></div>
      </div>
      <div class="card" style="margin-top:10px"><span class="xs mut">Заказы по дням</span><div class="bars">${[14, 19, 22, 17, 25, 28, 23].map((v) => `<i style="height:${v * 3.4}%"></i>`).join('')}</div></div>
      <h3>Требует внимания</h3>
      <button class="card tap gl" data-tab="aleads"><div class="row"><span class="gold">${ic('ship')}</span><span class="sp sm">${S.leads.concat(ADM_LEADS).filter((l) => l.st === 0).length} заявки на привоз ждут подтверждения цены</span></div></button>
      <button class="card tap" data-tab="vetting"><div class="row"><span class="gold">${ic('shield')}</span><span class="sp sm">2 исполнителя ждут проверки</span></div></button>
      <button class="card tap" data-tab="disputes"><div class="row"><span class="gold">${ic('alert')}</span><span class="sp sm">1 открытый спор</span></div></button>
      <button class="card tap" data-go="rates"><div class="row"><span class="gold">${ic('gear')}</span><span class="sp sm">Ставки калькулятора привоза</span></div></button>
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
      ${tabsOn ? `<nav class="tabs">${tabs.map(([k, n, i]) => `<button class="${k === ct ? 'on' : ''}" data-tab="${k}">${ic(i)}${n}${badge(k)}</button>`).join('')}</nav>` : ''}`;
    const b = $app.querySelector('.body'); if (b) b.scrollTop = 0;
  }

  // ── действия
  const A = {
    calcPick(k) { S.calc.key = k; render(); },
    calcRun() {
      const u = (document.getElementById('calcUrl') || {}).value || '';
      const k = Object.keys(LISTINGS).find((x) => u.toLowerCase().includes(x));
      if (!k) { toast('Пока понимаем ссылки Encar, Che168 и Dongchedi. Или введите параметры вручную'); return; }
      S.calc.key = k; S.calc.car = LISTINGS[k]; go('calcWait'); setTimeout(() => { if (top().s === 'calcWait') { stack().pop(); go('calcResult'); } }, 1300); },
    calcSet(p) { const [k, v] = p.split(':'); keepManual(); S.calc.manual[k] = v; if (k === 'cur') S.calc.manual.price = v === 'KRW' ? 26500000 : 92000; render(); },
    calcManualRun() { keepManual(); const m = S.calc.manual; S.calc.car = { t: 'Ваш автомобиль', cur: m.cur, price: +m.price, cc: +m.cc, hp: +m.hp, age: m.age, country: m.cur === 'KRW' ? 'Корея' : 'Китай' }; go('calcResult'); },
    calcOrder() { const c = S.calc.car; const r = calc(c, S.calc.ent); addLead({ t: `${c.t}${c.y ? ' ' + c.y : ''}`, total: r.ul ? null : r.total, src: c.src ? c.src + ' · ' + c.url : 'параметры вручную', car: c, ent: S.calc.ent }); },
    calcEnt(v) { S.calc.ent = v; render(); },
    ratesSave() { document.querySelectorAll('[data-rate]').forEach((i) => { const v = parseFloat(String(i.value).replace(',', '.')); if (!isNaN(v)) RATES[i.dataset.rate] = v; }); toast('Ставки сохранены — расчёты пересчитаны'); },
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
    importLead(i) {
      if (i !== undefined) { const f = OFFERS[+i]; return addLead({ t: f.t, total: f.p, src: 'Предложение недели' }); }
      const m = document.querySelector('#app input.inp'); addLead({ t: 'Подбор: ' + (m ? m.value : 'автомобиль'), total: null, src: 'Заявка на подбор' });
    },
    leadConfirm(n) {
      const l = findLead(n);
      const v = parseInt(String((document.getElementById('finalPrice') || {}).value || '').replace(/\D/g, ''), 10);
      l.final = v || l.total; l.st = 1; l.seen = false; render(); toast('Клиент получил уведомление с подтверждённой ценой');
    },
    leadSold(n) { findLead(n).st = 3; render(); toast('Клиенту отправлены 3 похожих машины'); },
    leadContract(n) { findLead(n).st = 2; render(); toast('Договор отправлен на подпись'); },
    buy() { S.partsOrder = { n: 'KC-2609-0152', items: S.parts.items.slice(), st: 0 }; S.parts.items = []; const k = S.role + ':' + curTab(); S.stacks[k] = [{ s: curTab(), p: {} }, { s: 'partsOrder', p: {} }]; render(); toast('Заказ принят. Менеджер подтвердит наличие'); },
    partsNode(k) { S.parts.node = k; render(); },
    partsSearch() { S.parts.q = (document.getElementById('pq') || {}).value || ''; render(); },
    partsClear() { S.parts.q = ''; render(); },
    partsCar() { S.parts.car = (S.parts.car + 1) % CARS.length; render(); toast('Подбор по VIN ' + CARS[S.parts.car].t); },
    partAdd(p) { const [n, i, j] = p.split(':'); const x = ITEMS[n][+i]; S.parts.items.push({ t: x.t, ...x.o[+j] }); toast('Добавлено в корзину'); },
    partDel(k) { S.parts.items.splice(+k, 1); render(); },
    partsNext() { S.partsOrder.st = Math.min(S.partsOrder.st + 1, 3); render(); },
    catF(p) { const [k, v] = p.split(':'); S.catF[k] = v; render(); },
    catOpen(id) { S.calc.car = CATALOG[+id]; go('calcResult'); },
    notif() { S.notif = !S.notif; render(); },
    bid(id) { S.bid[id] = true; render(); toast('Отклик отправлен клиенту'); },
    jobNext() { S.jobStep = Math.min(S.jobStep + 1, 4); render(); },
    vet(p) { const [id, v] = p.split(':'); S.proVerify[id] = v; render(); },
    dispute2(p) { S.dispute = 'решение: ' + p.toLowerCase(); render(); toast('Решение отправлено сторонам'); },
    roleMenu() { const order = ['client', 'pro', 'admin']; role(order[(order.indexOf(S.role) + 1) % 3]); toast({ client: 'Роль: клиент', pro: 'Роль: исполнитель', admin: 'Роль: площадка' }[S.role]); },
  };

  function keepManual() {
    const g = (id) => { const e = document.getElementById(id); return e ? e.value.replace(/\s/g, '') : null; };
    const m = S.calc.manual; if (g('mPrice') !== null) { m.price = g('mPrice'); m.cc = g('mCc'); m.hp = g('mHp'); }
  }
  V.calcWait = () => ({ title: 'Считаем', back: true, body: `<div class="spin"></div><p class="center">Читаем объявление ${esc(S.calc.car.src)}</p><p class="center sm mut" style="margin-top:6px">цена, год, объём, мощность · итоговую цену и наличие подтвердит менеджер</p>` });

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
  $app.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    if (e.target.id === 'msg') A.send();
    if (e.target.id === 'pq') A.partsSearch();
    if (e.target.id === 'calcUrl') A.calcRun();
  });

  // ── сценарии слева
  const SCEN = {
    client: [
      ['Вход по номеру телефона', () => { S.logged = false; S.stacks.login = [{ s: 'login', p: {} }]; render(); }],
      ['Главная: привоз, запчасти, услуги', () => { S.logged = true; tab('home'); }],
      ['Каталог авто с ценой под ключ', () => { S.logged = true; tab('cars'); }],
      ['Расчёт по ссылке → заявка менеджеру', () => { S.logged = true; tab('home'); go('calc'); }],
      ['Статус заявки на привоз', () => { S.logged = true; if (!S.leads.length) S.leads.push({ n: 'KC-2609-0153', who: 'Александр · +7 900 000-00-00', t: 'Kia Sportage 2.0 2023', total: calc(LISTINGS.encar).total, src: 'Encar · ' + LISTINGS.encar.url, car: LISTINGS.encar, ent: 'fl', st: 0, at: '10:05', seen: true }); tab('orders'); go('lead', { id: S.leads[0].n }); }],
      ['Привоз: этапы, документы, чат', () => { S.logged = true; tab('home'); go('import'); }],
      ['Запчасти по VIN: поиск, поставщики, заказ', () => { S.logged = true; tab('parts'); }],
      ['Заказать услугу → отклики → оплата', () => { S.logged = true; tab('home'); go('service', { id: 'avtozvuk-shumoizolyaciya' }); }],
      ['Статус услуги, чат, приёмка и отзыв', () => { S.logged = true; if (!S.order || S.order.st < 3) S.order = { s: 'avtozvuk-shumoizolyaciya', car: 'Kia Sorento 2023', st: 3, pro: PROS[0] }; tab('orders'); go('order'); }],
      ['Гараж: авто, ОСАГО, история', () => { S.logged = true; tab('profile'); go('garage'); }],
    ],
    pro: [
      ['Лента заказов рядом', () => tab('feed')],
      ['Откликнуться с ценой', () => { tab('feed'); go('feedItem', { id: 'f1' }); }],
      ['Работа по этапам и фото', () => { tab('jobs'); go('job'); }],
      ['Выплаты и удержание', () => tab('payouts')],
    ],
    admin: [
      ['Сводка: привоз, запчасти, услуги', () => tab('dash')],
      ['Заявки на привоз: расчёт → подтверждение', () => tab('aleads')],
      ['Проверка исполнителей', () => tab('vetting')],
      ['Все заказы', () => tab('aorders')],
      ['Разбор спора', () => tab('disputes')],
      ['Ставки калькулятора привоза', () => { tab('dash'); go('rates'); }],
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
