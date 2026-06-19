function initVideoPlayer(source) {
  var video = document.getElementById('moviePlayer');
  var overlay = document.getElementById('playerOverlay');
  var loaded = false;
  var hls = null;

  function attach() {
    if (!video || loaded) {
      return;
    }
    loaded = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        maxBufferLength: 30,
        enableWorker: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }
  }

  function start() {
    attach();
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
    if (video) {
      video.controls = true;
      var playResult = video.play();
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(function () {});
      }
    }
  }

  if (overlay) {
    overlay.addEventListener('click', start);
  }
  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });
  }
}
