// Animações da home: blocos entrando ao rolar, palavras subindo nos títulos, ponto que acompanha o mouse.
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var io2 = null;

  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  // 1) Entrada dos blocos ao rolar (o mais importante: se der erro, mostra tudo)
  try {
    var items = document.querySelectorAll('[data-reveal]');
    if (!reduce && hasIO) {
      io2 = new IntersectionObserver(function (entries) {
        var n = 0; // blocos que aparecem juntos entram em sequência
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var t = e.target;
          if (!t.style.getPropertyValue('--d')) t.style.setProperty('--d', (n++ * 90) + 'ms');
          t.classList.add('in');
          io2.unobserve(t);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      each(items, function (el) { io2.observe(el); });
    } else {
      each(items, function (el) { el.classList.add('in'); });
    }

    // cards de trabalho são criados depois pelo portfolio.js: também entram animados
    var tag = function (el) {
      el.style.transition = 'none';
      el.setAttribute('data-reveal', '');
      void el.offsetWidth;
      el.style.transition = '';
      if (io2) io2.observe(el); else el.classList.add('in');
    };
    each(document.querySelectorAll('.wgrid'), function (grid) {
      var scan = function () { each(grid.querySelectorAll('.wcard:not([data-reveal])'), tag); };
      scan();
      if ('MutationObserver' in window) new MutationObserver(scan).observe(grid, { childList: true });
    });

    window.__anim = true;
  } catch (err) {
    root.className += ' no-anim';
  }

  // 2) Títulos: cada palavra sobe da máscara (inclusive palavras dentro de <span>, <em> etc.)
  if (!reduce) {
    try {
      var count;
      var wrap = function (node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (n) {
          if (n.nodeType === 3) {
            var frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(function (p) {
              if (!p) return;
              if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
              var o = document.createElement('span'); o.className = 'sw'; o.setAttribute('aria-hidden', 'true');
              var i = document.createElement('span'); i.className = 'si'; i.style.setProperty('--i', count++); i.textContent = p;
              o.appendChild(i); frag.appendChild(o);
            });
            n.parentNode.replaceChild(frag, n);
          } else if (n.nodeType === 1) { wrap(n); }
        });
      };
      var heads = [];
      each(document.querySelectorAll('main h1, main h2'), function (h) {
        if (h.classList.contains('js-slide') || !h.textContent.trim()) return; // o main.js já cuidou
        h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
        count = 0; wrap(h); h.classList.add('js-slide'); heads.push(h);
      });
      if (heads.length && hasIO) {
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
        }, { threshold: 0.3 });
        requestAnimationFrame(function () { heads.forEach(function (h) { io.observe(h); }); });
      } else { heads.forEach(function (h) { h.classList.add('in'); }); }
    } catch (err) { /* sem a animação dos títulos, eles continuam visíveis */ }
  }

  // 3) Ponto laranja que acompanha o mouse (só em tela com mouse)
  if (!reduce && window.matchMedia && window.matchMedia('(pointer:fine)').matches) {
    try {
      var dot = document.createElement('div');
      dot.className = 'cursor-dot'; dot.setAttribute('aria-hidden', 'true');
      document.body.appendChild(dot);
      var tx = 0, ty = 0, x = 0, y = 0, running = false;
      var loop = function () {
        x += (tx - x) * 0.2; y += (ty - y) * 0.2;
        dot.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) requestAnimationFrame(loop); else running = false;
      };
      window.addEventListener('mousemove', function (e) {
        tx = e.clientX; ty = e.clientY; dot.classList.add('on');
        if (!running) { running = true; requestAnimationFrame(loop); }
      }, { passive: true });
      document.addEventListener('mouseleave', function () { dot.classList.remove('on'); });
      document.addEventListener('mouseover', function (e) {
        dot.classList.toggle('big', !!(e.target.closest && e.target.closest('a,button')));
      });
    } catch (err) { /* sem o ponto, o site funciona igual */ }
  }
})();
