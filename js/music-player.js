/* js/music-player.js */
document.addEventListener('DOMContentLoaded', function () {

  // ── PLAYLIST ──────────────────────────────────────────────
  const playlist = [
    {
      title:  "Nuron's Krak",
      artist: "reallykrak",
      src:    "Müzikler/hallettim.mp3",
      art:    "image/reallykrak.png"
    }
  ];

  let currentIndex = 0;
  let isPlaying    = false;

  // ── DOM REFERANSLARI ──────────────────────────────────────
  const audio       = document.getElementById('audio');
  const playBtn     = document.getElementById('play-pause-btn');
  const prevBtn     = document.getElementById('prev-btn');
  const nextBtn     = document.getElementById('next-btn');
  const volumeSlider= document.getElementById('volume');
  const songTitle   = document.getElementById('song-title');
  const songArtist  = document.getElementById('song-artist');
  const albumArt    = document.getElementById('album-art');
  const bannerMusicArt = document.getElementById('banner-music-art'); // YENİ REFERANS

  // ── YARDIMCI FONKSİYONLAR ────────────────────────────────

  function loadTrack(index) {
    const track = playlist[index];
    audio.src         = track.src;
    songTitle.textContent  = track.title;
    songArtist.textContent = track.artist;
    albumArt.src      = track.art;
    // YENİ: Bannerdaki resmi de müzik kapağıyla güncelle
    if (bannerMusicArt) {
      bannerMusicArt.src = track.art;
    }
  }

  function updateIcon() {
    const icon = playBtn.querySelector('i');
    icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
  }

  function play() {
    const promise = audio.play();
    if (promise !== undefined) {
      promise.then(() => {
        isPlaying = true;
        updateIcon();
      }).catch(() => {
        isPlaying = false;
        updateIcon();
      });
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

  // ── İLK YÜKLEME ───────────────────────────────────────────
  audio.volume = parseFloat(volumeSlider.value);
  loadTrack(currentIndex);

  // ── OTO-BAŞLATMA ──────────────────────────────────────────
  audio.muted = false;
  const autoPlayAttempt = audio.play();
  if (autoPlayAttempt !== undefined) {
    autoPlayAttempt.then(() => {
      isPlaying = true;
      updateIcon();
    }).catch(() => {
      isPlaying = false;
      updateIcon();
      const startOnInteraction = () => {
        play();
        document.removeEventListener('click',     startOnInteraction);
        document.removeEventListener('keydown',   startOnInteraction);
        document.removeEventListener('touchstart',startOnInteraction);
      };
      document.addEventListener('click',      startOnInteraction, { once: true });
      document.addEventListener('keydown',    startOnInteraction, { once: true });
      document.addEventListener('touchstart', startOnInteraction, { once: true });
    });
  }

  // ── BUTON ETKİNLEŞTİRME ───────────────────────────────────
  playBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    isPlaying ? pause() : play();
  });

  prevBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    playPrev();
  });

  nextBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    playNext();
  });

  volumeSlider.addEventListener('input', function () {
    audio.volume = parseFloat(this.value);
  });

  audio.addEventListener('ended', playNext);
});
