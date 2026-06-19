(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var toggle = document.querySelector(".nav-toggle");
        var nav = document.querySelector(".site-nav");

        if (toggle && nav) {
            toggle.addEventListener("click", function () {
                nav.classList.toggle("open");
            });
        }

        var hero = document.querySelector("[data-hero]");

        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var index = 0;

            function show(next) {
                if (!slides.length) {
                    return;
                }

                index = (next + slides.length) % slides.length;

                slides.forEach(function (slide, i) {
                    slide.classList.toggle("active", i === index);
                });

                dots.forEach(function (dot, i) {
                    dot.classList.toggle("active", i === index);
                });
            }

            dots.forEach(function (dot, i) {
                dot.addEventListener("click", function () {
                    show(i);
                });
            });

            setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        var input = document.querySelector("[data-search-input]");
        var select = document.querySelector("[data-tag-filter]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));

        function applyFilter() {
            var term = input ? input.value.trim().toLowerCase() : "";
            var tag = select ? select.value.trim().toLowerCase() : "";

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-tags")
                ].join(" ").toLowerCase();

                var matchText = !term || haystack.indexOf(term) !== -1;
                var matchTag = !tag || haystack.indexOf(tag) !== -1;

                card.classList.toggle("hidden-by-filter", !(matchText && matchTag));
            });
        }

        if (input) {
            input.addEventListener("input", applyFilter);
        }

        if (select) {
            select.addEventListener("change", applyFilter);
        }
    });

    window.initMoviePlayer = function (src) {
        var video = document.getElementById("movieVideo");
        var button = document.querySelector(".player-start");
        var hlsInstance = null;

        if (!video || !src) {
            return;
        }

        function attach() {
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                if (!video.getAttribute("src")) {
                    video.src = src;
                }
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                if (!hlsInstance) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(src);
                    hlsInstance.attachMedia(video);
                }
                return;
            }

            if (!video.getAttribute("src")) {
                video.src = src;
            }
        }

        function play() {
            attach();

            if (button) {
                button.classList.add("hidden");
            }

            var result = video.play();

            if (result && typeof result.catch === "function") {
                result.catch(function () {});
            }
        }

        attach();

        if (button) {
            button.addEventListener("click", play);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
    };
})();
