(function () {
  const movies = Array.isArray(window.siteMovies) ? window.siteMovies : [];

  function closePanels() {
    document.querySelectorAll("[data-search-panel]").forEach(function (panel) {
      panel.classList.remove("is-open");
    });
  }

  function renderSearch(input, panel) {
    const value = input.value.trim().toLowerCase();
    if (!value) {
      panel.innerHTML = "";
      panel.classList.remove("is-open");
      return;
    }

    const matched = movies.filter(function (movie) {
      const haystack = [
        movie.title,
        movie.year,
        movie.region,
        movie.type,
        movie.genre,
        movie.category
      ].join(" ").toLowerCase();
      return haystack.includes(value);
    }).slice(0, 10);

    if (matched.length === 0) {
      panel.innerHTML = '<div class="search-empty">没有找到相关影片</div>';
      panel.classList.add("is-open");
      return;
    }

    panel.innerHTML = matched.map(function (movie) {
      return [
        '<a class="search-item" href="' + movie.url + '">',
        '<img src="' + movie.cover + '" alt="' + movie.title.replace(/"/g, '&quot;') + '">',
        '<span><strong>' + movie.title + '</strong><span>' + movie.year + ' · ' + movie.region + ' · ' + movie.type + '</span></span>',
        '</a>'
      ].join("");
    }).join("");
    panel.classList.add("is-open");
  }

  document.querySelectorAll("[data-global-search]").forEach(function (input) {
    const wrap = input.parentElement;
    const panel = wrap ? wrap.querySelector("[data-search-panel]") : null;
    if (!panel) {
      return;
    }

    input.addEventListener("input", function () {
      renderSearch(input, panel);
    });

    input.addEventListener("keydown", function (event) {
      if (event.key !== "Enter") {
        return;
      }
      const first = panel.querySelector("a");
      if (first) {
        window.location.href = first.href;
      }
    });
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".header-search") && !event.target.closest(".hero-search")) {
      closePanels();
    }
  });

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", mobileNav.classList.contains("is-open"));
    });
  }

  document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
    const slides = Array.from(slider.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(slider.querySelectorAll("[data-hero-dot]"));
    const prev = slider.querySelector("[data-hero-prev]");
    const next = slider.querySelector("[data-hero-next]");
    let active = 0;
    let timer = null;

    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === active);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (slides.length > 1) {
      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          show(index);
          start();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(active - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(active + 1);
          start();
        });
      }

      slider.addEventListener("mouseenter", stop);
      slider.addEventListener("mouseleave", start);
      start();
    }
  });

  document.querySelectorAll("[data-filter-root]").forEach(function (root) {
    const search = root.querySelector("[data-filter-search]");
    const type = root.querySelector("[data-filter-type]");
    const year = root.querySelector("[data-filter-year]");
    const count = root.querySelector("[data-filter-count]");
    const cards = Array.from(root.querySelectorAll("[data-movie-card]"));

    function apply() {
      const keyword = search ? search.value.trim().toLowerCase() : "";
      const selectedType = type ? type.value : "";
      const selectedYear = year ? year.value : "";
      let visible = 0;

      cards.forEach(function (card) {
        const title = (card.getAttribute("data-title") || "").toLowerCase();
        const cardType = card.getAttribute("data-type") || "";
        const cardYear = card.getAttribute("data-year") || "";
        const matchKeyword = !keyword || title.includes(keyword);
        const matchType = !selectedType || cardType === selectedType;
        const matchYear = !selectedYear || cardYear === selectedYear;
        const matched = matchKeyword && matchType && matchYear;
        card.classList.toggle("is-hidden", !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = visible + " 部影片";
      }
    }

    [search, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });
  });
})();
