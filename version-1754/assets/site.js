(function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var nav = document.querySelector('[data-mobile-nav]');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var index = 0;

    var show = function (nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    };

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

  panels.forEach(function (panel) {
    var input = panel.querySelector('[data-search-input]');
    var chips = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-value]'));
    var grid = panel.nextElementSibling;
    var cards = grid ? Array.prototype.slice.call(grid.querySelectorAll('[data-movie-card]')) : [];
    var empty = panel.querySelector('[data-empty-state]');
    var activeValue = '全部';

    var normalize = function (value) {
      return String(value || '').toLowerCase().trim();
    };

    var apply = function () {
      var query = normalize(input ? input.value : '');
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-search'));
        var channel = card.getAttribute('data-channel') || '';
        var region = card.getAttribute('data-region') || '';
        var genre = card.getAttribute('data-genre') || '';
        var type = card.getAttribute('data-type') || '';
        var year = card.getAttribute('data-year') || '';
        var filterText = [channel, region, genre, type, year].join(' ');
        var matchesQuery = !query || haystack.indexOf(query) !== -1;
        var matchesFilter = activeValue === '全部' || filterText.indexOf(activeValue) !== -1;
        var isVisible = matchesQuery && matchesFilter;

        card.classList.toggle('hidden', !isVisible);

        if (isVisible) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    };

    if (input) {
      input.addEventListener('input', apply);
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeValue = chip.getAttribute('data-filter-value') || '全部';

        chips.forEach(function (item) {
          item.classList.toggle('active', item === chip);
        });

        apply();
      });
    });
  });
})();
