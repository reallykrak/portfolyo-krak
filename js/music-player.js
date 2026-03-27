document.addEventListener('DOMContentLoaded', function () {

  // ── PLAYLIST ─────────────────────────────────────────────
  const playlist = [
    {
      title:  "Nuron's Krak",
      artist: "reallykrak",
      src:    "Müzikler/hallettim.mp3",
      art:    "image/reallykrak.png"
    }
    // Yeni şarkı: { title:"...", artist:"...", src:"Müzikler/....mp3", art:"image/....png" }
  ];

  let currentIndex = 0;
  let isPlaying    = false;

  // ── DOM ───────────────────────────────────────────────────
  const audio        = document.getElementById('audio');
  const playBtn      = document.getElementById('play-pause-btn');
  const prevBtn      = document.getElementById('prev-btn');
  const nextBtn      = document.getElementById('next-btn');
  const volumeSlider = document.getElementById('volume');
  const songTitle    = document.getElementById('song-title');
  const songArtist   = document.getElementById('song-artist');
  const albumArt     = document.getElementById('album-art');

  // ── YARDIMCI ─────────────────────────────────────────────
  function loadTrack(index) {
    const t = playlist[index];
    audio.src              = t.src;
    songTitle.textContent  = t.title;
    songArtist.textContent = t.artist;
    albumArt.src           = t.art;
  }

  function updateIcon() {
    playBtn.querySelector('i').className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
  }

  function play() {
    const p = audio.play();
    if (p !== undefined) {
      p.then(()  => { isPlaying = true;  updateIcon(); })
       .catch(() => { isPlaying = false; updateIcon(); });
    }
  }

  function pause() {
    audio.pause();
    isPlaying = false;
    updateIcon();
  }

  function playNext() {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadTrack(currentIndex);
    play();
  }

  function playPrev() {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      play();
    } else {
      currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
      loadTrack(currentIndex);
      play();
    }
  }

  // ── İLK YÜKLEME ──────────────────────────────────────────
  audio.volume = parseFloat(volumeSlider.value);
  loadTrack(currentIndex);

  // ── OTO-BAŞLATMA ─────────────────────────────────────────
  const attempt = audio.play();
  if (attempt !== undefined) {
    attempt
      .then(() => { isPlaying = true; updateIcon(); })
      .catch(() => {
        // Tarayıcı engeli — ilk dokunuşta başlat
        isPlaying = false;
        updateIcon();
        const start = () => {
          play();
          document.removeEventListener('click',      start);
          document.removeEventListener('keydown',    start);
          document.removeEventListener('touchstart', start);
        };
        document.addEventListener('click',      start, { once: true });
        document.addEventListener('keydown',    start, { once: true });
        document.addEventListener('touchstart', start, { once: true });
      });
  }

  // ── BUTONLAR ─────────────────────────────────────────────
  playBtn.addEventListener('click', e => { e.stopPropagation(); isPlaying ? pause() : play(); });
  prevBtn.addEventListener('click', e => { e.stopPropagation(); playPrev(); });
  nextBtn.addEventListener('click', e => { e.stopPropagation(); playNext(); });
  volumeSlider.addEventListener('input', function () { audio.volume = parseFloat(this.value); });
  audio.addEventListener('ended', playNext);
});
