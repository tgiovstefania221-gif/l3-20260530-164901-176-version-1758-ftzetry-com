(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu]');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  var search = document.querySelector('[data-page-search]');
  if (search) {
    search.addEventListener('input', function () {
      var key = search.value.trim().toLowerCase();
      var items = document.querySelectorAll('[data-search]');
      items.forEach(function (item) {
        var text = item.getAttribute('data-search') || '';
        item.classList.toggle('is-hidden-by-search', key && text.indexOf(key) === -1);
      });
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var show = function (index) {
      current = index % slides.length;
      slides.forEach(function (slide, n) {
        slide.classList.toggle('is-active', n === current);
      });
      dots.forEach(function (dot, n) {
        dot.classList.toggle('is-active', n === current);
      });
    };
    dots.forEach(function (dot, n) {
      dot.addEventListener('click', function () {
        show(n);
      });
    });
    if (slides.length > 1) {
      window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }
  }
})();
