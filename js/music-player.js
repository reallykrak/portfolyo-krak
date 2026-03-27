document.addEventListener('DOMContentLoaded', function() {
  const audio = document.getElementById('audio');
  const playBtn = document.getElementById('play-pause-btn');
  const icon = playBtn.querySelector('i');
  
  const progressFill = document.querySelector('.progress-fill');
  const progressBarContainer = document.getElementById('progress-container');
  const currentTimeEl = document.querySelector('.current-time');
  const totalTimeEl = document.querySelector('.total-time');

  // Başlangıç sesi seviyesi
  audio.volume = 0.5;

  // Saniyeleri "0:00" formatına dönüştürür
  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  // Oynat / Duraklat Fonksiyonu
  function togglePlay() {
    if (audio.paused) {
      audio.play();
      icon.className = 'fas fa-pause';
    } else {
      audio.pause();
      icon.className = 'fas fa-play';
    }
  }

  playBtn.addEventListener('click', togglePlay);

  // Müzik çalarken progress bar ve zamanlayıcıyı günceller
  audio.addEventListener('timeupdate', () => {
    if(audio.duration) {
      const percent = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${percent}%`;
      currentTimeEl.textContent = formatTime(audio.currentTime);
      totalTimeEl.textContent = formatTime(audio.duration);
    }
  });

  // Şarkı metadataları yüklendiğinde toplam süreyi sağ tarafa yazar
  audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
  });

  // Tıklanan yere göre şarkıyı ileri/geri sarma
  progressBarContainer.addEventListener('click', (e) => {
    const width = progressBarContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
  });

  // Şarkı bitince player'ı başa sarar
  audio.addEventListener('ended', () => {
    icon.className = 'fas fa-play';
    progressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
  });
});
