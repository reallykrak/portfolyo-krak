document.addEventListener('DOMContentLoaded', function() {
  const audio = document.getElementById('audio');
  const playBtn = document.getElementById('play-pause-btn');
  const volumeSlider = document.getElementById('volume');
  const vinylRecord = document.querySelector('.vinyl-record');
  const playerContainer = document.querySelector('.vinyl-player-container');
  const icon = playBtn.querySelector('i');

  // Başlangıç sesi
  audio.volume = 0.5;

  function togglePlay() {
    if (audio.paused) {
      audio.play();
      icon.className = 'fas fa-pause';
      vinylRecord.classList.add('spinning');
      playerContainer.classList.add('active'); // Mobilde açık kalsın
    } else {
      audio.pause();
      icon.className = 'fas fa-play';
      vinylRecord.classList.remove('spinning');
      playerContainer.classList.remove('active');
    }
  }

  // Plağa tıklayınca da çalsın/dursun
  document.getElementById('vinyl-wrapper').addEventListener('click', togglePlay);
  playBtn.addEventListener('click', togglePlay);

  volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
  });

  audio.addEventListener('ended', () => {
    icon.className = 'fas fa-play';
    vinylRecord.classList.remove('spinning');
  });
});
