(function () {
    var toggle = document.querySelector('[data-nav-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var index = 0;

        function setHero(next) {
            if (!slides.length) {
                return;
            }

            index = (next + slides.length) % slides.length;

            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });

            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                setHero(i);
            });
        });

        setInterval(function () {
            setHero(index + 1);
        }, 5200);
    }

    var filterList = document.querySelector('[data-filter-list]');
    var filterInput = document.querySelector('[data-filter-input]');
    var filterYear = document.querySelector('[data-filter-year]');

    if (filterList) {
        var cards = Array.prototype.slice.call(filterList.querySelectorAll('.movie-card'));

        function applyFilter() {
            var query = filterInput ? filterInput.value.trim().toLowerCase() : '';
            var year = filterYear ? filterYear.value : '';

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-tags')
                ].join(' ').toLowerCase();
                var matchText = !query || haystack.indexOf(query) !== -1;
                var matchYear = !year || card.getAttribute('data-year') === year;

                card.classList.toggle('is-hidden', !(matchText && matchYear));
            });
        }

        if (filterInput) {
            filterInput.addEventListener('input', applyFilter);
        }

        if (filterYear) {
            filterYear.addEventListener('change', applyFilter);
        }
    }
})();
