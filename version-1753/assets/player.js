import { H as Hls } from "./hls-vendor-bbsaiqh1.js";

document.addEventListener("DOMContentLoaded", function () {
  var video = document.querySelector("[data-hls-video]");
  var playButton = document.querySelector("[data-player-play]");

  if (!video) {
    return;
  }

  var source = video.dataset.source;

  if (source) {
    if (Hls && Hls.isSupported()) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(source);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, function (eventName, data) {
        if (data && data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    }
  }

  if (playButton) {
    playButton.addEventListener("click", function () {
      video.play();
    });

    video.addEventListener("play", function () {
      playButton.classList.add("is-hidden");
    });

    video.addEventListener("pause", function () {
      if (!video.ended) {
        playButton.classList.remove("is-hidden");
      }
    });
  }
});
