window.addEventListener('DOMContentLoaded', function() {

  var TRACKS = [
    { title: "Tolunay",       src: "css/hallettim.mp3",        art: "image/reallykrak.png" },
    { title: "Tolunay",       src: "css/hallettim1.mp3",       art: "image/tolunay.png" },
    { title: "Tolunay",       src: "css/hallettim2.mp3",       art: "image/pode.png" }
  ];

  var idx = 0;

  var audio   = document.getElementById('the-audio');
  var playBtn = document.getElementById('sp-play');
  var prevBtn = document.getElementById('sp-prev');
  var nextBtn = document.getElementById('sp-next');
  var fillEl  = document.getElementById('sp-fill');
  var curEl   = document.getElementById('sp-cur');
  var durEl   = document.getElementById('sp-dur');
  var barEl   = document.getElementById('sp-bar');
  var artImg  = document.getElementById('sp-art');
  var titleEl = document.getElementById('sp-title');

  if (!audio || !playBtn) return;

  audio.volume = 0.65;

  function fmt(s) {
    if (!s || !isFinite(s)) return '0:00';
    var m = Math.floor(s / 60), sc = Math.floor(s % 60);
    return m + ':' + (sc < 10 ? '0' : '') + sc;
  }

  function loadTrack(i) {
    var t = TRACKS[i];
    audio.src          = t.src;
    titleEl.textContent = t.title;
    artImg.src         = t.art;
    fillEl.style.width = '0%';
    curEl.textContent  = '0:00';
    durEl.textContent  = '0:00';
    // Nav now-playing güncelle
    var navSong = document.getElementById('nav-song-name');
    if (navSong) navSong.textContent = t.title;
  }

  function syncUI() {
    playBtn.querySelector('i').className = audio.paused ? 'fas fa-play' : 'fas fa-pause';
    if (!audio.paused) artImg.classList.add('spin');
    else artImg.classList.remove('spin');
  }

  function doPlay() {
    audio.play().catch(function(e){ console.log(e); });
  }

  loadTrack(idx);

  // Butonlar
  playBtn.onclick = function() { audio.paused ? doPlay() : audio.pause(); };

  prevBtn.onclick = function() {
    if (audio.currentTime > 3) {
      audio.currentTime = 0; doPlay();
    } else {
      idx = (idx - 1 + TRACKS.length) % TRACKS.length;
      loadTrack(idx); doPlay();
    }
  };

  nextBtn.onclick = function() {
    idx = (idx + 1) % TRACKS.length;
    loadTrack(idx); doPlay();
  };

  // Progress bar
  if (barEl) {
    barEl.onclick = function(e) {
      var rect = barEl.getBoundingClientRect();
      var r = (e.clientX - rect.left) / rect.width;
      if (audio.duration) audio.currentTime = r * audio.duration;
    };
  }

  audio.addEventListener('timeupdate', function() {
    if (audio.duration > 0) {
      fillEl.style.width = (audio.currentTime / audio.duration * 100) + '%';
      curEl.textContent  = fmt(audio.currentTime);
    }
  });

  audio.addEventListener('loadedmetadata', function() {
    durEl.textContent = fmt(audio.duration);
  });

  audio.addEventListener('play',  syncUI);
  audio.addEventListener('pause', syncUI);
  audio.addEventListener('ended', function() {
    idx = (idx + 1) % TRACKS.length;
    loadTrack(idx); doPlay();
  });

  // Autoplay denemesi
  doPlay();
});
