// Animação única e discreta: os blocos aparecem suavemente ao rolar a página.
// Se algo falhar, o site aparece normal (classe no-anim).
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  try {
    var items = document.querySelectorAll('[data-reveal]');
    if (reduce || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('in');
          io.unobserve(e.target);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -4% 0px' });
      Array.prototype.forEach.call(items, function (el) { io.observe(el); });
    }
    window.__anim = true;
  } catch (err) {
    root.className += ' no-anim';
  }
})();
