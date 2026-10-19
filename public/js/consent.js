// Aviso de cookies + pixels de anúncio. Enquanto os IDs abaixo estiverem vazios,
// nada é carregado e o aviso nem aparece (o site não rastreia ninguém).
(function () {
  'use strict';

  // >>> Quando tiver as contas de anúncio, preencha aqui (só o número/código). <<<
  var META_PIXEL_ID = '';   // exemplo: '123456789012345'
  var GOOGLE_TAG_ID = '';   // exemplo: 'G-XXXXXXXXXX' ou 'AW-123456789'

  var CHAVE = 'cookies-gc';
  var temFerramenta = !!(META_PIXEL_ID || GOOGLE_TAG_ID);

  function ler() { try { return localStorage.getItem(CHAVE); } catch (e) { return null; } }
  function gravar(v) { try { localStorage.setItem(CHAVE, v); } catch (e) {} }

  var abrir = document.querySelector('.ck-open');
  if (!temFerramenta) return;
  if (abrir) abrir.hidden = false;

  var st = document.createElement('style');
  st.textContent =
      '.ck{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;background:#FFFFFF;color:#111111;border:5px solid #111111;box-shadow:8px 8px 0 #DE6D20;padding:18px 20px;font-family:Inter,Arial,sans-serif;font-weight:700;font-size:.98rem;line-height:1.45}' +
    '.ck p{margin:0 0 14px}.ck a{color:#111111;text-underline-offset:3px}' +
    '.ck .bt{display:flex;flex-wrap:wrap;gap:10px}' +
    '.ck button{font:inherit;font-family:"Plus Jakarta Sans",Arial,sans-serif;font-weight:800;font-size:.9rem;text-transform:none;padding:11px 18px;border:4px solid #111111;background:#FFFFFF;color:#111111;cursor:pointer}' +
    '.ck button.sim{background:#DE6D20}.ck button:focus-visible{outline:3px solid #111111;outline-offset:3px}' +
    '.ck-open{font:inherit;color:inherit;background:none;border:0;padding:0;text-decoration:underline;text-underline-offset:3px;cursor:pointer}';
  document.head.appendChild(st);

  var carregado = false;
  function carregar() {
    if (carregado) return;
    carregado = true;
    if (META_PIXEL_ID) {
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq('init', META_PIXEL_ID);
      window.fbq('track', 'PageView');
    }
    if (GOOGLE_TAG_ID) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', GOOGLE_TAG_ID);
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GOOGLE_TAG_ID);
      document.head.appendChild(s);
    }
  }

  // briefing enviado de verdade = conversão (só conta se a pessoa aceitou os cookies)
  window.addEventListener('briefing:enviado', function () {
    if (!carregado) return;
    if (window.fbq) window.fbq('track', 'Lead');
    if (window.gtag) window.gtag('event', 'generate_lead');
  });

  var caixa = null;
  function fechar() { if (caixa) { caixa.remove(); caixa = null; } }

  function escolher(valor) {
    var antes = ler();
    gravar(valor);
    fechar();
    if (valor === 'sim') carregar();
    else if (antes === 'sim') location.reload(); // para parar de vez o que já tinha carregado
  }

  function mostrar() {
    if (caixa) return;
    caixa = document.createElement('div');
    caixa.className = 'ck';
    caixa.setAttribute('role', 'dialog');
    caixa.setAttribute('aria-label', 'Aviso de cookies');
    caixa.innerHTML =
      '<p>Posso usar cookies de anúncios e medição para saber se meus anúncios funcionam? Sem isso o site funciona igual. <a href="/privacidade/">Saiba mais</a>.</p>' +
      '<div class="bt"><button type="button" class="sim">Aceitar</button><button type="button" class="nao">Recusar</button></div>';
    caixa.querySelector('.sim').addEventListener('click', function () { escolher('sim'); });
    caixa.querySelector('.nao').addEventListener('click', function () { escolher('nao'); });
    document.body.appendChild(caixa);
  }

  if (abrir) abrir.addEventListener('click', mostrar);

  var v = ler();
  if (v === 'sim') carregar();
  else if (v !== 'nao') mostrar();
})();
