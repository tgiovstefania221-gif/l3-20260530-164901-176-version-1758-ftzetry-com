import { H as Hls } from './hls-vendor-bbsaiqh1.js';

var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

players.forEach(function (shell) {
  var video = shell.querySelector('video');
  var button = shell.querySelector('[data-play]');
  var streamUrl = shell.getAttribute('data-stream');
  var hls = null;

  if (!video || !streamUrl) {
    return;
  }

  var play = function () {
    shell.classList.add('is-playing');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.getAttribute('src')) {
        video.setAttribute('src', streamUrl);
      }

      video.play().catch(function () {});
      return;
    }

    if (Hls && Hls.isSupported()) {
      if (!hls) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      }

      if (video.readyState >= 1) {
        video.play().catch(function () {});
      } else {
        video.addEventListener('loadedmetadata', function () {
          video.play().catch(function () {});
        }, { once: true });
      }

      return;
    }

    if (!video.getAttribute('src')) {
      video.setAttribute('src', streamUrl);
    }

    video.play().catch(function () {});
  };

  if (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      play();
    });
  }

  shell.addEventListener('click', function (event) {
    if (event.target === video) {
      return;
    }

    play();
  });
});
