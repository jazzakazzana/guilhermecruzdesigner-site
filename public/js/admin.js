// Painel de administração do portfólio. Só funciona atrás do Cloudflare Access.
(function () {
  var H = { 'X-Requested-With': 'admin-ui' };
  var form = document.getElementById('form');
  var list = document.getElementById('list');
  var thumbs = document.getElementById('thumbs');
  var files = document.getElementById('files');
  var msg = document.getElementById('msg');
  var saveBtn = document.getElementById('save');
  var cancelBtn = document.getElementById('cancel');
  var title = document.getElementById('form-title');
  var state = { works: [], editing: null, images: [] };

  function say(text, err) {
    msg.hidden = !text; msg.textContent = text || '';
    msg.className = 'msg' + (err ? ' err' : '');
    if (text) msg.scrollIntoView({ block: 'nearest' });
  }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function api(path, opts) {
    opts = opts || {};
    opts.headers = Object.assign({}, H, opts.headers || {});
    opts.credentials = 'same-origin';
    return fetch(path, opts).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (!r.ok) throw new Error(d.error || ('Erro ' + r.status));
        return d;
      });
    }, function () {
      throw new Error('Sem conexão ou sessão expirada. Recarregue a página e entre de novo.');
    });
  }

  // ---------- imagens ----------
  function resize(file) {
    return createImageBitmap(file).then(function (bmp) {
      var max = 1600, s = Math.min(1, max / Math.max(bmp.width, bmp.height));
      var c = document.createElement('canvas');
      c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
      c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
      return new Promise(function (ok, no) {
        c.toBlob(function (b) { b ? ok(b) : no(new Error('Não consegui converter a imagem.')); }, 'image/webp', 0.86);
      });
    });
  }
  function upload(blob) {
    return api('/api/admin/upload', { method: 'POST', body: blob, headers: { 'Content-Type': blob.type } }).then(function (d) { return d.url; });
  }
  function drawThumbs() {
    thumbs.textContent = '';
    state.images.forEach(function (u, i) {
      var li = el('li');
      if (i === 0) li.appendChild(el('span', 'tag', 'CAPA'));
      var im = document.createElement('img'); im.src = u; im.alt = 'Imagem ' + (i + 1);
      li.appendChild(im);
      var ctl = el('div', 'ctl');
      [['◀', -1], ['▶', 1], ['✕', 0]].forEach(function (b) {
        var bt = el('button', null, b[0]); bt.type = 'button';
        bt.setAttribute('aria-label', b[1] === 0 ? 'Remover imagem' : b[1] < 0 ? 'Mover pra esquerda' : 'Mover pra direita');
        bt.addEventListener('click', function () {
          if (b[1] === 0) state.images.splice(i, 1);
          else { var j = i + b[1]; if (j < 0 || j >= state.images.length) return; var t = state.images[i]; state.images[i] = state.images[j]; state.images[j] = t; }
          drawThumbs();
        });
        ctl.appendChild(bt);
      });
      li.appendChild(ctl); thumbs.appendChild(li);
    });
  }
  files.addEventListener('change', function () {
    var picked = Array.prototype.slice.call(files.files);
    files.value = '';
    if (!picked.length) return;
    if (state.images.length + picked.length > 12) { say('No máximo 12 imagens por trabalho.', true); return; }
    saveBtn.disabled = true;
    var chain = Promise.resolve(), n = 0;
    picked.forEach(function (f) {
      chain = chain.then(function () {
        say('Enviando imagem ' + (++n) + ' de ' + picked.length + '…');
        return resize(f).then(upload).then(function (u) { state.images.push(u); drawThumbs(); });
      });
    });
    chain.then(function () { say('Imagens enviadas. Agora é só salvar o trabalho.'); })
      .catch(function (e) { say(e.message, true); })
      .then(function () { saveBtn.disabled = false; });
  });

  // ---------- formulário ----------
  function resetForm() {
    form.reset(); state.editing = null; state.images = []; drawThumbs();
    form.elements.published.checked = true;
    title.textContent = 'Novo trabalho'; cancelBtn.hidden = true; saveBtn.textContent = 'Salvar trabalho';
  }
  function edit(w) {
    state.editing = w.id; state.images = w.images.slice();
    form.elements.title.value = w.title; form.elements.client.value = w.client;
    form.elements.category.value = w.category; form.elements.year.value = w.year || '';
    form.elements.description.value = w.description; form.elements.tags.value = w.tags.join(', ');
    form.elements.published.checked = w.published; form.elements.featured.checked = w.featured;
    drawThumbs();
    title.textContent = 'Editando: ' + w.title; cancelBtn.hidden = false; saveBtn.textContent = 'Salvar alterações';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  cancelBtn.addEventListener('click', function () { resetForm(); say(''); });

  function payload(over) {
    var f = form.elements;
    return Object.assign({
      title: f.title.value, client: f.client.value, category: f.category.value,
      year: f.year.value, description: f.description.value, tags: f.tags.value,
      images: state.images, published: f.published.checked, featured: f.featured.checked,
    }, over || {});
  }
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!form.elements.title.value.trim()) { say('Dá um título pro trabalho.', true); return; }
    saveBtn.disabled = true;
    var editing = state.editing;
    api(editing ? '/api/admin/works/' + editing : '/api/admin/works', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload()),
    }).then(function () { resetForm(); say(editing ? 'Alterações salvas.' : 'Trabalho salvo!'); return load(); })
      .catch(function (e) { say(e.message, true); })
      .then(function () { saveBtn.disabled = false; });
  });

  // ---------- lista ----------
  function toggle(w) {
    api('/api/admin/works/' + w.id, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: w.title, client: w.client, category: w.category, year: w.year, description: w.description,
        tags: w.tags, images: w.images, published: !w.published, featured: w.featured }),
    }).then(function () { say(w.published ? 'Trabalho ocultado do site.' : 'Trabalho publicado.'); return load(); })
      .catch(function (e) { say(e.message, true); });
  }
  function remove(w) {
    if (!confirm('Excluir "' + w.title + '" de vez? As imagens enviadas também serão apagadas.')) return;
    api('/api/admin/works/' + w.id, { method: 'DELETE' })
      .then(function () { if (state.editing === w.id) resetForm(); say('Trabalho excluído.'); return load(); })
      .catch(function (e) { say(e.message, true); });
  }
  function draw() {
    list.textContent = '';
    if (!state.works.length) { list.appendChild(el('li', null, 'Nenhum trabalho ainda. Cadastre o primeiro acima.')); return; }
    state.works.forEach(function (w) {
      var li = el('li');
      var im = document.createElement('img'); im.src = w.cover || ''; im.alt = ''; li.appendChild(im);
      var box = el('div');
      box.appendChild(el('div', 't', w.title));
      var s = el('div', 's');
      s.appendChild(el('span', 'b' + (w.published ? '' : ' off'), w.published ? 'PUBLICADO' : 'RASCUNHO'));
      if (w.featured) s.appendChild(el('span', 'b', 'DESTAQUE'));
      s.appendChild(document.createTextNode((w.client ? w.client + ' · ' : '') + w.categoryLabel));
      box.appendChild(s); li.appendChild(box);
      var act = el('div', 'act');
      [['Editar', function () { edit(w); }, ''], [w.published ? 'Ocultar' : 'Publicar', function () { toggle(w); }, ''], ['Excluir', function () { remove(w); }, 'del']]
        .forEach(function (b) { var bt = el('button', b[2], b[0]); bt.type = 'button'; bt.addEventListener('click', b[1]); act.appendChild(bt); });
      li.appendChild(act); list.appendChild(li);
    });
  }
  function load() {
    return api('/api/admin/works').then(function (d) { state.works = d; draw(); });
  }

  api('/api/admin/me').then(function (d) { document.getElementById('who').textContent = d.email || ''; }).catch(function () {});
  load().catch(function (e) { say(e.message, true); });
})();
