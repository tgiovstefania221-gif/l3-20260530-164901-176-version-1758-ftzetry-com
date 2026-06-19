(function () {
  const video = document.querySelector("[data-video]");
  const layer = document.querySelector("[data-play-cover]");
  const button = document.querySelector("[data-play-button]");

  if (!video || typeof streamUrl === "undefined") {
    return;
  }

  let attached = false;
  let hlsInstance = null;

  function attachStream() {
    if (attached) {
      return;
    }

    attached = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = streamUrl;
  }

  function hideLayer() {
    if (layer) {
      layer.classList.add("is-hidden");
    }
  }

  function startPlay() {
    attachStream();
    hideLayer();
    const playAction = video.play();
    if (playAction && typeof playAction.catch === "function") {
      playAction.catch(function () {});
    }
  }

  if (button) {
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      startPlay();
    });
  }

  if (layer) {
    layer.addEventListener("click", startPlay);
  }

  video.addEventListener("play", hideLayer);

  window.addEventListener("beforeunload", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
