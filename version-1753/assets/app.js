document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector("[data-nav-toggle]");
  var menu = document.querySelector("[data-nav-menu]");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    var activeIndex = 0;

    function showSlide(index) {
      activeIndex = index % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.dataset.heroDot || 0));
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5600);
    }
  }

  document.querySelectorAll(".poster img").forEach(function (image) {
    image.addEventListener("error", function () {
      image.style.opacity = "0";
      var poster = image.closest(".poster");
      if (poster) {
        poster.classList.add("is-missing");
      }
    });
  });

  var searchInput = document.querySelector("[data-page-search]");
  var searchList = document.querySelector("[data-search-list]");

  if (searchInput && searchList) {
    searchInput.addEventListener("input", function () {
      var keyword = searchInput.value.trim().toLowerCase();
      var items = searchList.querySelectorAll("[data-search-text]");

      items.forEach(function (item) {
        var text = (item.dataset.searchText || item.textContent || "").toLowerCase();
        item.classList.toggle("is-filtered-out", keyword.length > 0 && text.indexOf(keyword) === -1);
      });
    });
  }
});
