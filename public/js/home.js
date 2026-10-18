// Setas do carrossel de projetos da home
(function () {
  var track = document.getElementById('home-works');
  if (!track) return;
  function go(dir) {
    var step = Math.max(240, track.clientWidth * 0.8);
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  }
  var prev = document.getElementById('car-prev');
  var next = document.getElementById('car-next');
  if (prev) prev.addEventListener('click', function () { go(-1); });
  if (next) next.addEventListener('click', function () { go(1); });
})();
