(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-site-nav]');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var activeIndex = 0;
    var timer = null;

    function activate(index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === activeIndex);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === activeIndex);
      });
    }

    function startTimer() {
      timer = window.setInterval(function () {
        activate(activeIndex + 1);
      }, 5200);
    }

    function resetTimer() {
      if (timer) {
        window.clearInterval(timer);
      }
      startTimer();
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        activate(Number(dot.getAttribute('data-hero-dot')) || 0);
        resetTimer();
      });
    });

    startTimer();
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var cardList = document.querySelector('[data-card-list]');

  if (filterInput && cardList) {
    var cards = Array.prototype.slice.call(cardList.querySelectorAll('[data-card]'));

    filterInput.addEventListener('input', function () {
      var keyword = filterInput.value.trim().toLowerCase();

      cards.forEach(function (card) {
        var value = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre')
        ].join(' ').toLowerCase();

        card.classList.toggle('is-hidden', keyword && value.indexOf(keyword) === -1);
      });
    });
  }

  function startVideo(video, overlay) {
    var source = video.getAttribute('data-video-src');

    if (!source) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.src) {
        video.src = source;
      }
      video.play();
      if (overlay) {
        overlay.classList.add('hidden');
      }
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (!video.hlsPlayer) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        video.hlsPlayer = hls;
      }
      video.play();
      if (overlay) {
        overlay.classList.add('hidden');
      }
      return;
    }

    video.src = source;
    video.play();
    if (overlay) {
      overlay.classList.add('hidden');
    }
  }

  var video = document.querySelector('[data-video-src]');
  var playButton = document.querySelector('[data-play-button]');

  if (video) {
    video.addEventListener('click', function () {
      startVideo(video, playButton);
    });
  }

  if (video && playButton) {
    playButton.addEventListener('click', function () {
      startVideo(video, playButton);
    });
  }

  var results = document.querySelector('[data-search-results]');
  var searchInput = document.querySelector('[data-search-page-input]');
  var searchCount = document.querySelector('[data-search-count]');

  if (results && window.MOVIE_SEARCH_DATA) {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (searchInput) {
      searchInput.value = initialQuery;
    }

    function makeCard(item) {
      return [
        '<article class="movie-card">',
        '  <a class="poster-link" href="' + item.href + '">',
        '    <img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
        '  </a>',
        '  <div class="movie-card-body">',
        '    <div class="movie-meta-line"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span></div>',
        '    <h2><a href="' + item.href + '">' + escapeHtml(item.title) + '</a></h2>',
        '    <p>' + escapeHtml(item.oneLine) + '</p>',
        '    <div class="tag-row"><span>' + escapeHtml(item.genre) + '</span></div>',
        '  </div>',
        '</article>'
      ].join('');
    }

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function renderSearch(query) {
      var normalized = String(query || '').trim().toLowerCase();
      var source = window.MOVIE_SEARCH_DATA;
      var list = normalized
        ? source.filter(function (item) {
            return [item.title, item.year, item.region, item.type, item.genre, item.oneLine]
              .join(' ')
              .toLowerCase()
              .indexOf(normalized) !== -1;
          })
        : source.slice(0, 60);

      results.innerHTML = list.slice(0, 120).map(makeCard).join('');

      if (searchCount) {
        searchCount.textContent = list.length + ' 部';
      }
    }

    renderSearch(initialQuery);

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        renderSearch(searchInput.value);
      });
    }
  }
})();
