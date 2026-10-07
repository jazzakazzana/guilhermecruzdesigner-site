// Portfólio público: lê /api/works (D1). Se o backend ainda não existir, usa /data/works.json.
(function () {
  var CATS = { papelaria: 'Papelaria e impressos', identidade: 'Identidade visual', campanhas: 'Conteúdo e campanhas' };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function safeSrc(u) { return typeof u === 'string' && /^\/(media\/works|img)\/[A-Za-z0-9._-]+$/.test(u) ? u : ''; }

  function getJSON(url) {
    return fetch(url, { headers: { Accept: 'application/json' } }).then(function (r) {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    });
  }
  function loadAll() {
    return getJSON('/api/works').catch(function () { return getJSON('/data/works.json'); });
  }

  function card(w) {
    var a = el('a', 'wcard');
    a.href = '/portfolio/' + encodeURIComponent(w.slug);
    var img = document.createElement('img');
    img.src = safeSrc(w.cover) || safeSrc((w.images || [])[0]);
    img.alt = w.title + (w.client ? ' — ' + w.client : '');
    img.loading = 'lazy';
    img.decoding = 'async';
    a.appendChild(img);
    a.appendChild(el('div', 'n', w.client || w.title));
    a.appendChild(el('div', 'p', w.client ? w.title : (w.categoryLabel || CATS[w.category] || '')));
    return a;
  }

  function renderGrid(box, list, emptyMsg) {
    box.textContent = '';
    if (!list.length) { box.appendChild(el('p', 'empty', emptyMsg)); return; }
    list.forEach(function (w) { box.appendChild(card(w)); });
  }

  // Home: destaques (ou os 4 mais recentes)
  var home = document.getElementById('home-works');
  if (home) {
    loadAll().then(function (all) {
      var feat = all.filter(function (w) { return w.featured; });
      renderGrid(home, (feat.length ? feat : all).slice(0, 4), 'Em breve, trabalhos por aqui.');
    }).catch(function () { renderGrid(home, [], 'Não consegui carregar os trabalhos agora. Tenta de novo em instantes.'); });
  }

  // Lista com filtros
  var grid = document.getElementById('works');
  var filters = document.getElementById('filters');
  if (grid && filters) {
    loadAll().then(function (all) {
      var current = (location.hash || '').replace('#', '');
      if (!CATS[current]) current = 'todos';
      function draw() {
        var list = current === 'todos' ? all : all.filter(function (w) { return w.category === current; });
        renderGrid(grid, list, 'Ainda não tem trabalhos nessa categoria.');
        Array.prototype.forEach.call(filters.children, function (b) { b.setAttribute('aria-pressed', String(b.dataset.cat === current)); });
      }
      var keys = ['todos'].concat(Object.keys(CATS).filter(function (k) { return all.some(function (w) { return w.category === k; }); }));
      keys.forEach(function (k) {
        var b = el('button', null, k === 'todos' ? 'Todos (' + all.length + ')' : CATS[k]);
        b.type = 'button';
        b.dataset.cat = k;
        b.addEventListener('click', function () { current = k; history.replaceState(null, '', k === 'todos' ? location.pathname : '#' + k); draw(); });
        filters.appendChild(b);
      });
      draw();
    }).catch(function () { renderGrid(grid, [], 'Não consegui carregar os trabalhos agora. Tenta de novo em instantes.'); });
  }

  // Página de projeto
  var proj = document.getElementById('project');
  if (proj) {
    var parts = location.pathname.split('/').filter(Boolean);
    var slug = parts[0] === 'portfolio' && parts[1] ? decodeURIComponent(parts[1]) : (new URLSearchParams(location.search).get('slug') || '');
    var back = proj.querySelector('.back');
    function notFound() {
      proj.textContent = '';
      proj.appendChild(back);
      proj.appendChild(el('h1', null, 'Projeto não encontrado'));
      proj.appendChild(el('p', 'intro', 'Esse link não existe mais ou ainda não foi publicado.'));
    }
    if (!slug) notFound(); else
    getJSON('/api/works/' + encodeURIComponent(slug)).catch(function () {
      return getJSON('/data/works.json').then(function (all) {
        var w = all.filter(function (x) { return x.slug === slug; })[0];
        if (!w) throw new Error('404');
        return w;
      });
    }).then(function (w) {
      document.title = w.title + (w.client ? ' — ' + w.client : '') + ' · Guilherme Cruz';
      proj.textContent = '';
      proj.appendChild(back);
      proj.appendChild(el('h1', null, w.title));
      var meta = el('div', 'meta');
      if (w.client) meta.appendChild(el('span', null, w.client));
      if (w.year) meta.appendChild(el('span', null, String(w.year)));
      meta.appendChild(el('span', null, w.categoryLabel || CATS[w.category] || ''));
      proj.appendChild(meta);
      if (w.tags && w.tags.length) {
        var ul = el('ul', 'chips');
        w.tags.forEach(function (t) { ul.appendChild(el('li', null, t)); });
        proj.appendChild(ul);
      }
      if (w.description) {
        var d = el('div', 'desc');
        w.description.split(/\n{2,}/).forEach(function (p) { d.appendChild(el('p', null, p)); });
        proj.appendChild(d);
      }
      var g = el('div', 'gallery');
      (w.images || []).forEach(function (u, i) {
        var s = safeSrc(u); if (!s) return;
        var im = document.createElement('img');
        im.src = s; im.alt = w.title + ' — imagem ' + (i + 1); im.loading = i ? 'lazy' : 'eager'; im.decoding = 'async';
        g.appendChild(im);
      });
      proj.appendChild(g);
      var row = el('div', 'cta-row');
      var wa = el('a', 'btn', 'Quero algo assim');
      wa.href = 'https://wa.me/5551993627861?text=' + encodeURIComponent('Olá, Guilherme! Vi o projeto "' + w.title + '" no seu site e gostaria de conversar sobre um projeto.');
      var more = el('a', 'btn alt', 'Ver outros trabalhos');
      more.href = '/portfolio/';
      row.appendChild(wa); row.appendChild(more);
      proj.appendChild(row);
    }).catch(notFound);
  }
})();
