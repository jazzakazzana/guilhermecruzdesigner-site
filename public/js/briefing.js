// Página /briefing: mostra as perguntas certas e envia as respostas por e-mail (Web3Forms).
(function () {
  'use strict';

  // >>> COLE AQUI a chave do Web3Forms (ela é pública por natureza e pode ficar no site). <<<
  var CHAVE = '254a854c-54cd-41d8-b600-cfab87e13114';
  var ENDERECO = 'https://api.web3forms.com/submit';
  var WHATS = 'https://wa.me/5551993627861';

  var form = document.getElementById('bf');
  if (!form) return;
  var rest = document.getElementById('bf-rest');
  var fsIdv = document.getElementById('bf-idv');
  var fsPrint = document.getElementById('bf-print');
  var fsLp = document.getElementById('bf-lp');
  var btn = document.getElementById('bf-btn');
  var msg = document.getElementById('bf-msg');
  var ok = document.getElementById('bf-ok');
  var prev = document.getElementById('bf-prev');
  var pecas = form.querySelectorAll('input[name="Peças e serviços"]');
  var whats = document.getElementById('f-whats');
  var empresaBox = document.getElementById('f-empresa-wrap');
  var empresa = document.getElementById('f-empresa');
  var enviando = false;

  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  function mostrar(el, sim) { el.hidden = !sim; if (el.tagName === 'FIELDSET') el.disabled = !sim; }

  function mensagem(texto, erro, comWhats) {
    msg.textContent = texto;
    msg.className = 'bf-msg' + (erro ? ' err' : '');
    if (comWhats) {
      msg.appendChild(document.createTextNode(' '));
      var a = document.createElement('a');
      a.href = WHATS; a.textContent = 'Chamar no WhatsApp';
      msg.appendChild(a);
    }
    msg.hidden = false;
  }

  // pelo menos uma peça marcada (só vale quando "Material impresso" está escolhido)
  function conferirPecas() {
    var algum = false;
    each(pecas, function (c) { if (c.checked) algum = true; });
    if (pecas.length) pecas[0].setCustomValidity(algum ? '' : 'Marque pelo menos uma opção.');
  }
  each(pecas, function (c) { c.addEventListener('change', conferirPecas); });

  function conferirWhats() {
    var digitos = whats.value.replace(/\D/g, '');
    whats.setCustomValidity(digitos.length >= 10 ? '' : 'Digite o número com DDD.');
  }
  whats.addEventListener('input', conferirWhats);

  // escolha do tipo de serviço
  var choices = form.querySelectorAll('.choice');
  function atualizarEscolha() {
    var marcado = form.querySelector('input[name="servico"]:checked');
    each(choices, function (l) { l.classList.toggle('on', l.querySelector('input').checked); });
    if (!marcado) return;
    mostrar(rest, true);
    var idv = marcado.value === 'Identidade visual';
    mostrar(fsIdv, idv);
    mostrar(fsPrint, marcado.value === 'Material impresso');
    mostrar(fsLp, marcado.value === 'Landing page');
    empresaBox.hidden = idv; // na identidade visual o nome da marca é a primeira pergunta
    empresa.disabled = idv;
    conferirPecas();
  }
  each(form.querySelectorAll('input[name="servico"]'), function (r) {
    r.addEventListener('change', atualizarEscolha);
    r.addEventListener('focus', function () { r.closest('.choice').classList.add('focus'); });
    r.addEventListener('blur', function () { r.closest('.choice').classList.remove('focus'); });
  });
  atualizarEscolha();

  // monta o conteúdo do e-mail com os nomes dos campos como rótulos
  function montarDados() {
    var dados = {};
    var grupos = {};
    each(form.elements, function (el) {
      if (!el.name || el.disabled || el.name === 'botcheck') return;
      if (el.type === 'radio' && !el.checked) return;
      if (el.type === 'checkbox') {
        if (!el.checked) return;
        if (!grupos[el.name]) { grupos[el.name] = []; dados[el.name] = ''; } // guarda o lugar na ordem do e-mail
        grupos[el.name].push(el.value);
        return;
      }
      var v = (el.value || '').trim();
      if (v) dados[el.name] = v;
    });
    Object.keys(grupos).forEach(function (k) { dados[k] = grupos[k].join(', '); });
    return dados;
  }

  function sucesso(real) {
    if (real) { try { window.dispatchEvent(new Event('briefing:enviado')); } catch (e) {} }
    form.hidden = true;
    ok.hidden = false;
    if (window.__BRIEFING_PREVIEW__ && prev) prev.hidden = false;
    ok.scrollIntoView({ behavior: 'smooth', block: 'start' });
    ok.focus({ preventScroll: true });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (enviando) return;
    conferirWhats(); conferirPecas();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var armadilha = form.querySelector('input[name="botcheck"]');
    if (armadilha && armadilha.checked) { sucesso(); return; } // robô: finge que deu certo

    var dados = montarDados();
    var nome = dados['Nome'] || '';
    var corpo = { access_key: CHAVE, subject: 'Novo briefing: ' + (dados['servico'] || '') + (nome ? ' — ' + nome : ''), from_name: 'Site guilhermecruzdesigner.com.br' };
    corpo['Tipo de serviço'] = dados['servico'];
    delete dados['servico'];
    Object.keys(dados).forEach(function (k) { corpo[k] = dados[k]; });

    enviando = true; btn.disabled = true; btn.textContent = 'Enviando…';
    msg.hidden = true;

    if (window.__BRIEFING_PREVIEW__) { setTimeout(function () { enviando = false; sucesso(); }, 700); return; }

    if (CHAVE.indexOf('COLE_AQUI') === 0) {
      enviando = false; btn.disabled = false; btn.textContent = 'Enviar briefing';
      mensagem('O envio ainda não está ligado nesta página.', true, true);
      return;
    }

    var ctl = typeof AbortController === 'function' ? new AbortController() : null;
    var t = setTimeout(function () { if (ctl) ctl.abort(); }, 20000);
    fetch(ENDERECO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(corpo),
      signal: ctl ? ctl.signal : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok && j.success !== false }; });
    }).then(function (res) {
      clearTimeout(t); enviando = false;
      if (res.ok) { sucesso(true); return; }
      throw new Error('falhou');
    }).catch(function () {
      clearTimeout(t); enviando = false;
      btn.disabled = false; btn.textContent = 'Enviar briefing';
      mensagem('Não consegui enviar agora. Tente de novo em instantes ou me chame no WhatsApp.', true, true);
    });
  });
})();
