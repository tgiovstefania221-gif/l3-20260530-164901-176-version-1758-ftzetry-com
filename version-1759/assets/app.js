(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    function initNav() {
        var toggle = document.querySelector("[data-nav-toggle]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function () {
            menu.classList.toggle("is-open");
            document.body.classList.toggle("no-scroll", menu.classList.contains("is-open"));
        });
        menu.addEventListener("click", function (event) {
            if (event.target.tagName === "A") {
                menu.classList.remove("is-open");
                document.body.classList.remove("no-scroll");
            }
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                start();
            });
        });

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function initFilters() {
        Array.prototype.slice.call(document.querySelectorAll("[data-filter-form]")).forEach(function (form) {
            var input = form.querySelector("[data-search-input]");
            var year = form.querySelector("[data-filter-year]");
            var region = form.querySelector("[data-filter-region]");
            var container = document.querySelector("[data-card-container]");
            if (!container) {
                return;
            }
            var cards = Array.prototype.slice.call(container.querySelectorAll("[data-card]"));
            var empty = document.querySelector("[data-empty-state]");
            var params = new URLSearchParams(window.location.search);
            var queryValue = params.get("q");

            if (input && queryValue) {
                input.value = queryValue;
            }

            function apply() {
                var keyword = normalize(input ? input.value : "");
                var yearValue = normalize(year ? year.value : "");
                var regionValue = normalize(region ? region.value : "");
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = normalize(card.getAttribute("data-search"));
                    var cardYear = normalize(card.getAttribute("data-year"));
                    var cardRegion = normalize(card.getAttribute("data-region"));
                    var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                    var matchYear = !yearValue || cardYear === yearValue;
                    var matchRegion = !regionValue || cardRegion === regionValue;
                    var matched = matchKeyword && matchYear && matchRegion;

                    card.classList.toggle("is-hidden", !matched);
                    if (matched) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            [input, year, region].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });

            apply();
        });

        Array.prototype.slice.call(document.querySelectorAll("[data-home-search]")).forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input");
                var query = input ? input.value.trim() : "";
                var target = "./categories.html";
                if (query) {
                    target += "?q=" + encodeURIComponent(query);
                }
                window.location.href = target;
            });
        });
    }

    window.initPlayer = function (videoId, sourceUrl, triggerId, overlayId) {
        var video = document.getElementById(videoId);
        var trigger = document.getElementById(triggerId);
        var overlay = document.getElementById(overlayId);
        var loaded = false;
        var hlsInstance = null;

        if (!video || !sourceUrl) {
            return;
        }

        function hideOverlay() {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        }

        function bindSource() {
            if (loaded) {
                return;
            }
            loaded = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = sourceUrl;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(sourceUrl);
                hlsInstance.attachMedia(video);
                return;
            }

            video.src = sourceUrl;
        }

        function play() {
            bindSource();
            hideOverlay();
            video.controls = true;
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
            }
        }

        if (trigger) {
            trigger.addEventListener("click", play);
        }

        if (overlay) {
            overlay.addEventListener("click", play);
        }

        video.addEventListener("click", function () {
            if (!loaded || video.paused) {
                play();
            }
        });

        video.addEventListener("play", hideOverlay);

        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };

    ready(function () {
        initNav();
        initHero();
        initFilters();
    });
})();
