window.addEventListener('DOMContentLoaded', function () {

  var TRACKS = [
    { title: "Tolunay", src: "css/hallettim.mp3",  art: "image/reallykrak.png" },
    { title: "Tolunay", src: "css/hallettim1.mp3", art: "image/tolunay.png"    },
    { title: "Tolunay", src: "css/hallettim2.mp3", art: "image/pode.png"       }
  ];

  var idx      = 0;
  var wasPlaying = false;

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
  var player  = document.getElementById('mini-player');

  if (!audio || !playBtn) return;

  audio.volume = 0.65;

  /* ── format ── */
  function fmt(s) {
    if (!s || !isFinite(s)) return '0:00';
    var m = Math.floor(s / 60), sc = Math.floor(s % 60);
    return m + ':' + (sc < 10 ? '0' : '') + sc;
  }

  /* ── UI sync ── */
  function syncUI() {
    var ic = playBtn.querySelector('i');
    var playing = !audio.paused;
    ic.className = playing ? 'fas fa-pause' : 'fas fa-play';
    if (playing) {
      artImg.classList.add('spin');
      if (player) player.classList.add('playing');
    } else {
      artImg.classList.remove('spin');
      if (player) player.classList.remove('playing');
    }
    // Nav now playing
    var ns = document.getElementById('nav-song-name');
    if (ns) ns.textContent = playing ? TRACKS[idx].title + ' (' + (idx+1) + '/' + TRACKS.length + ')' : 'Paused';
  }

  /* ── load track — FIX: src değiştir → load() → sonra play ── */
  function loadTrack(i, autoplay) {
    var t = TRACKS[i];
    audio.src = t.src;
    audio.load(); // ← bu kritik, olmadan track değişmiyor

    titleEl.textContent = t.title;
    // Art geçiş animasyonu
    artImg.style.opacity = '0';
    artImg.style.transform = 'scale(0.85)';
    setTimeout(function() {
      artImg.src = t.art;
      artImg.style.opacity = '1';
      artImg.style.transform = 'scale(1)';
    }, 200);

    fillEl.style.width = '0%';
    curEl.textContent  = '0:00';
    durEl.textContent  = '0:00';

    // Track dots güncelle
    updateDots();

    if (autoplay) {
      audio.addEventListener('canplay', function onCanPlay() {
        audio.removeEventListener('canplay', onCanPlay);
        audio.play().catch(function(e){ console.log(e); });
      });
    }
  }

  /* ── track dots ── */
  function updateDots() {
    var dots = document.querySelectorAll('.track-dot');
    dots.forEach(function(d, i) {
      d.classList.toggle('active', i === idx);
    });
  }

  /* ── ilk yükleme ── */
  loadTrack(idx, false);

  /* ── play/pause ── */
  playBtn.onclick = function () {
    if (audio.paused) {
      audio.play().catch(function(e){ console.log(e); });
    } else {
      audio.pause();
    }
  };

  /* ── prev ── */
  prevBtn.onclick = function () {
    wasPlaying = !audio.paused;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      if (wasPlaying) audio.play().catch(function(e){});
    } else {
      idx = (idx - 1 + TRACKS.length) % TRACKS.length;
      loadTrack(idx, true);
    }
  };

  /* ── next ── */
  nextBtn.onclick = function () {
    idx = (idx + 1) % TRACKS.length;
    loadTrack(idx, true);
  };

  /* ── progress bar ── */
  var dragging = false;
  function seekTo(clientX) {
    var rect = barEl.getBoundingClientRect();
    var r = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    if (audio.duration) audio.currentTime = r * audio.duration;
  }
  barEl.addEventListener('mousedown', function(e) { dragging = true; seekTo(e.clientX); e.preventDefault(); });
  barEl.addEventListener('touchstart', function(e) { dragging = true; if(e.touches[0]) seekTo(e.touches[0].clientX); }, { passive: true });
  document.addEventListener('mousemove', function(e) { if (dragging) seekTo(e.clientX); });
  document.addEventListener('touchmove', function(e) { if (dragging && e.touches[0]) seekTo(e.touches[0].clientX); }, { passive: true });
  document.addEventListener('mouseup',  function() { dragging = false; });
  document.addEventListener('touchend', function() { dragging = false; });

  /* ── audio events ── */
  audio.addEventListener('timeupdate', function () {
    if (dragging) return;
    if (audio.duration > 0) {
      fillEl.style.width = (audio.currentTime / audio.duration * 100) + '%';
      curEl.textContent  = fmt(audio.currentTime);
    }
  });
  audio.addEventListener('loadedmetadata', function () {
    durEl.textContent = fmt(audio.duration);
  });
  audio.addEventListener('play',  syncUI);
  audio.addEventListener('pause', syncUI);
  audio.addEventListener('ended', function () {
    idx = (idx + 1) % TRACKS.length;
    loadTrack(idx, true);
  });

  /* ── Keyboard shortcuts ── */
  document.addEventListener('keydown', function(e) {
    // Input alanlarında çalışmasın
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.code === 'Space') {
      e.preventDefault();
      playBtn.onclick();
    }
    if (e.code === 'ArrowRight') {
      e.preventDefault();
      nextBtn.onclick();
    }
    if (e.code === 'ArrowLeft') {
      e.preventDefault();
      prevBtn.onclick();
    }
  });

  /* ── Autoplay ── */
  audio.play().catch(function () {
    // İlk tıklamada başlat
    document.addEventListener('click', function startOnClick() {
      audio.play().catch(function(){});
      document.removeEventListener('click', startOnClick);
    }, { once: true });
  });
});
