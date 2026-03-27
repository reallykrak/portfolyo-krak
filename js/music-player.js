document.addEventListener('DOMContentLoaded', function() {
  const audio = document.getElementById('audio');
  const playPauseBtn = document.getElementById('play-pause-btn-new');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const progressContainer = document.getElementById('progress-container');
  const progressFill = document.getElementById('progress-fill');
  const currTimeEl = document.getElementById('curr-time');
  const durTimeEl = document.getElementById('dur-time');

  // Süreyi dakika:saniye formatına çevirir
  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  // Oynatma / Duraklatma
  function togglePlay() {
    if (audio.paused) {
      audio.play();
      playPauseBtn.className = 'fas fa-pause';
    } else {
      audio.pause();
      playPauseBtn.className = 'fas fa-play';
    }
  }

  playPauseBtn.addEventListener('click', togglePlay);

  // Müzik yüklenince süreyi yaz
  audio.addEventListener('loadedmetadata', () => {
    durTimeEl.textContent = formatTime(audio.duration);
  });

  // Müzik çalarken progress barı güncelle
  audio.addEventListener('timeupdate', () => {
    const duration = audio.duration;
    const currentTime = audio.currentTime;
    
    if(!isNaN(duration)) {
      const progressPercent = (currentTime / duration) * 100;
      progressFill.style.width = `${progressPercent}%`;
      currTimeEl.textContent = formatTime(currentTime);
      durTimeEl.textContent = formatTime(duration);
    }
  });

  // Progress bara tıklayarak sarmayı sağlar
  progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
  });

  // Şarkı bittiğinde sıfırla
  audio.addEventListener('ended', () => {
    // Autoplay ve Loop aktifse buraya düşmeden kendi tekrar başlar
    // Ama düşerse play ikonuna dönsün
    if(!audio.loop) {
      playPauseBtn.className = 'fas fa-play';
      progressFill.style.width = '0%';
      audio.currentTime = 0;
    }
  });

  // İleri geri butonları (Tek şarkı var, başa sarmaya yarar)
  prevBtn.addEventListener('click', () => {
    audio.currentTime = 0;
  });
  nextBtn.addEventListener('click', () => {
    audio.currentTime = audio.duration; // Bitişe götürür
  });
});
