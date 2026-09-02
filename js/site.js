// Сайт КонсулКар: меню, карусель предложений, формы, список запроса
(function () {
  'use strict';

  // ── бургер
  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  if (burger && nav) burger.addEventListener('click', function () {
    var open = nav.hasAttribute('data-open');
    if (open) nav.removeAttribute('data-open'); else nav.setAttribute('data-open', '');
    burger.setAttribute('aria-expanded', String(!open));
  });
  // закрытое мобильное меню не должно ловить фокус с клавиатуры
  if (nav) {
    var syncNav = function () {
      var mobile = window.matchMedia('(max-width:960px)').matches;
      var hidden = mobile && !nav.hasAttribute('data-open');
      nav.querySelectorAll('a').forEach(function (a) {
        if (hidden) a.setAttribute('tabindex', '-1'); else a.removeAttribute('tabindex');
      });
      nav.setAttribute('aria-hidden', String(hidden));
    };
    syncNav();
    if (burger) burger.addEventListener('click', function () { setTimeout(syncNav, 0); });
    window.addEventListener('resize', syncNav);
  }

  // ── карусель предложений
  var car = document.querySelector('[data-carousel]');
  if (car) {
    var slides = [].slice.call(car.querySelectorAll('[data-slide]'));
    var dots = [].slice.call(document.querySelectorAll('[data-dot]'));
    var cur = 0, timer;
    // связываем кнопки и слайды: без этого экранный диктор не понимает, чем управляют точки
    slides.forEach(function (s, k) {
      s.id = s.id || 'offer-slide-' + k;
      s.setAttribute('role', 'tabpanel');
      s.setAttribute('aria-label', 'Предложение ' + (k + 1) + ' из ' + slides.length);
    });
    dots.forEach(function (d, k) {
      d.setAttribute('aria-controls', slides[k] ? slides[k].id : '');
      d.setAttribute('tabindex', k === 0 ? '0' : '-1');
    });
    function show(i) {
      cur = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        if (k === cur) { s.hidden = false; s.setAttribute('data-current', ''); }
        else { s.hidden = true; s.removeAttribute('data-current'); }
      });
      dots.forEach(function (d, k) {
        d.setAttribute('aria-selected', String(k === cur));
        d.setAttribute('tabindex', k === cur ? '0' : '-1');
      });
    }
    function auto() { clearInterval(timer); if (slides.length > 1) timer = setInterval(function () { show(cur + 1); }, 8000); }
    dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k); auto(); }); });
    if (slides.length > 1) { show(0); auto(); }
    car.addEventListener('mouseenter', function () { clearInterval(timer); });
    car.addEventListener('mouseleave', auto);
    // автопрокрутка не должна уезжать, пока человек читает или вкладка скрыта
    car.addEventListener('focusin', function () { clearInterval(timer); });
    car.addEventListener('focusout', auto);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearInterval(timer); else auto();
    });
    // управление стрелками, как ожидается от набора вкладок
    dots.forEach(function (d, k) {
      d.addEventListener('keydown', function (e) {
        var next = e.key === 'ArrowRight' ? k + 1 : e.key === 'ArrowLeft' ? k - 1 : null;
        if (next === null) return;
        e.preventDefault();
        show(next); auto();
        var t = dots[(next + dots.length) % dots.length];
        if (t) t.focus();
      });
    });
  }

  // ── список запроса по запчастям (localStorage)
  var KEY = 'kc_cart';
  function cart() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
  function badge() {
    var n = cart().length;
    document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = n ? '(' + n + ')' : ''; });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cart]');
    if (!b) return;
    e.preventDefault();
    var art = b.getAttribute('data-cart'), name = b.getAttribute('data-name') || art;
    var c = cart();
    if (!c.some(function (x) { return x.art === art; })) c.push({ art: art, name: name });
    save(c); badge();
    var old = b.textContent;
    b.textContent = 'В списке ✓'; b.disabled = true;
    setTimeout(function () { b.textContent = old; b.disabled = false; }, 1800);
  });

  // ── страница списка запроса
  var list = document.getElementById('cart-list');
  if (list) {
    function render() {
      var c = cart();
      if (!c.length) {
        list.innerHTML = '<div class="note">Список пуст. Откройте <a href="/catalog/">каталог</a> ' +
          'и добавьте нужные позиции — или сразу отправьте <a href="/catalog/podbor-po-vin/">VIN на подбор</a>.</div>';
        return;
      }
      list.innerHTML = '<div class="tbl-wrap"><table><thead><tr><th>Позиция</th><th>Артикул</th><th></th></tr></thead><tbody>' +
        c.map(function (x, i) {
          return '<tr><td><b>' + x.name + '</b></td><td>' + x.art + '</td>' +
            '<td style="text-align:right"><button class="btn btn--ghost btn--sm" data-del="' + i + '">Убрать</button></td></tr>';
        }).join('') + '</tbody></table></div>';
      var items = document.getElementById('k-items');
      if (items) items.value = c.map(function (x) { return x.art + ' — ' + x.name; }).join('; ');
      bindForms();
    }
    list.addEventListener('click', function (e) {
      var d = e.target.closest('[data-del]');
      if (!d) return;
      var c = cart(); c.splice(+d.getAttribute('data-del'), 1); save(c); badge(); render();
    });
    render();
  }

  // ── формы: телефон, отправка без перезагрузки
  function mask(el) {
    el.addEventListener('input', function () {
      var d = el.value.replace(/\D/g, '').replace(/^8/, '7').replace(/^([^7])/, '7$1').slice(0, 11);
      var o = '+7';
      if (d.length > 1) o += ' (' + d.slice(1, 4);
      if (d.length >= 4) o += ') ' + d.slice(4, 7);
      if (d.length >= 7) o += '-' + d.slice(7, 9);
      if (d.length >= 9) o += '-' + d.slice(9, 11);
      el.value = d.length <= 1 ? '' : o;
    });
  }
  function bindForms() {
    document.querySelectorAll('form[data-form]').forEach(function (f) {
      if (f.__bound) return;
      f.__bound = true;
      var p = f.querySelector('input[name=phone]');
      if (p) mask(p);
      var pg = f.querySelector('input[name=page]');
      if (pg) pg.value = location.pathname;
      var op = f.querySelector('[data-opened]');
      if (op) op.value = String(Date.now());
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        if (f.getAttribute('data-demo')) {
          var m = f.querySelector('[data-msg]');
          m.className = 'form__msg form__msg--ok';
          m.textContent = 'Это демонстрационная версия — заявка не отправлена. На рабочем сайте она уйдёт на почту и в amoCRM.';
          return;
        }
        var msg = f.querySelector('[data-msg]'), btn = f.querySelector('button[type=submit]');
        var phone = (f.querySelector('input[name=phone]') || {}).value || '';
        if (phone.replace(/\D/g, '').length < 11) {
          msg.className = 'form__msg form__msg--err';
          msg.textContent = 'Проверьте номер телефона — нужно 11 цифр.';
          return;
        }
        btn.disabled = true; var t = btn.textContent; btn.textContent = 'Отправляем…';
        fetch(f.action, { method: 'POST', body: new FormData(f) })
          .then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); })
          .then(function (r) {
            if (r && r.ok) {
              if (window.ym && window.__ymId) ym(window.__ymId, 'reachGoal', 'lead');
              location.href = '/spasibo/';
            } else throw new Error((r && r.error) || 'fail');
          })
          .catch(function () {
            msg.className = 'form__msg form__msg--err';
            var ph = window.__phone || '';
            msg.innerHTML = 'Не удалось отправить заявку. Позвоните, пожалуйста' +
              (ph ? ': <a href="tel:' + (window.__phoneHref || '') + '">' + ph + '</a>' : '') +
              ' — мы примем обращение по телефону.';
          })
          .finally(function () { btn.disabled = false; btn.textContent = t; });
      });
    });
  }
  bindForms(); badge();

  // ── плавное появление блоков при скролле
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.sec__head, .card, .step, .prod, .chip, .fact, .offer, .form, .faq details');
    if (targets.length && targets.length < 1200) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
      targets.forEach(function (t, i) {
        // первый экран показываем сразу — иначе главная «мигает» при загрузке
        if (t.getBoundingClientRect().top < window.innerHeight * 1.05) { t.classList.add('is-in'); return; }
        t.setAttribute('data-rise', '');
        t.style.transitionDelay = (Math.min(i % 4, 3) * 60) + 'ms';
        io.observe(t);
      });
    }
  }
})();
