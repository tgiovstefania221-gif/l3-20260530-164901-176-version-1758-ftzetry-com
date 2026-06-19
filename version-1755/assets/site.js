(function () {
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      mobileNav.hidden = expanded;
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  if (slides.length > 1) {
    var current = 0;
    var showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5800);
  }

  var filterForm = document.querySelector('[data-filter-form]');
  if (filterForm) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
    var empty = document.querySelector('[data-empty-state]');
    var params = new URLSearchParams(window.location.search);
    var queryInput = filterForm.querySelector('[name="q"]');
    var regionSelect = filterForm.querySelector('[name="region"]');
    var yearSelect = filterForm.querySelector('[name="year"]');
    var categorySelect = filterForm.querySelector('[name="category"]');
    if (queryInput && params.get('q')) {
      queryInput.value = params.get('q');
    }
    var normalize = function (value) {
      return String(value || '').trim().toLowerCase();
    };
    var applyFilters = function () {
      var q = normalize(queryInput && queryInput.value);
      var region = normalize(regionSelect && regionSelect.value);
      var year = normalize(yearSelect && yearSelect.value);
      var category = normalize(categorySelect && categorySelect.value);
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = normalize([
          card.dataset.title,
          card.dataset.region,
          card.dataset.genre,
          card.dataset.tags,
          card.dataset.year
        ].join(' '));
        var passQuery = !q || haystack.indexOf(q) !== -1;
        var passRegion = !region || normalize(card.dataset.region).indexOf(region) !== -1;
        var passYear = !year || normalize(card.dataset.year) === year;
        var passCategory = !category || normalize(card.dataset.category) === category;
        var pass = passQuery && passRegion && passYear && passCategory;
        card.style.display = pass ? '' : 'none';
        if (pass) {
          visible += 1;
        }
      });
      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    };
    filterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilters();
    });
    ['input', 'change'].forEach(function (eventName) {
      filterForm.addEventListener(eventName, applyFilters);
    });
    applyFilters();
  }

  var playerBoxes = Array.prototype.slice.call(document.querySelectorAll('.player-box'));
  playerBoxes.forEach(function (box) {
    var video = box.querySelector('video');
    var button = box.querySelector('.play-cover');
    var stream = box.getAttribute('data-stream');
    var started = false;
    var hlsInstance = null;
    var attachStream = function () {
      if (!video || !stream) {
        return;
      }
      if (started) {
        return;
      }
      started = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      } else {
        video.src = stream;
      }
    };
    var play = function () {
      attachStream();
      if (button) {
        button.classList.add('hidden');
      }
      var promise = video && video.play ? video.play() : null;
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          if (button) {
            button.classList.remove('hidden');
          }
        });
      }
    };
    if (button) {
      button.addEventListener('click', play);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (!started) {
          play();
        }
      });
    }
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
