document.addEventListener('DOMContentLoaded', function() {
  const audio = document.getElementById('audio');
  const playBtn = document.getElementById('play-pause-btn');
  const volumeSlider = document.getElementById('volume');
  const vinylRecord = document.querySelector('.vinyl-record');
  const playerContainer = document.querySelector('.vinyl-player-container');
  const icon = playBtn.querySelector('i');

  audio.volume = 0.5;

  function togglePlay() {
    if (audio.paused) {
      // Tarayıcı bug'ını engellemek için Promise yapısı
      let playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(_ => {
          icon.className = 'fas fa-pause';
          vinylRecord.classList.add('spinning');
          playerContainer.classList.add('active');
        }).catch(error => {
          console.log("Otomatik oynatma engeli. Bir kere ekrana tıklanması gerek.", error);
        });
      }
    } else {
      audio.pause();
      icon.className = 'fas fa-play';
      vinylRecord.classList.remove('spinning');
      playerContainer.classList.remove('active');
    }
  }

  document.getElementById('vinyl-wrapper').addEventListener('click', togglePlay);
  playBtn.addEventListener('click', togglePlay);

  volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
  });

  audio.addEventListener('ended', () => {
    icon.className = 'fas fa-play';
    vinylRecord.classList.remove('spinning');
    playerContainer.classList.remove('active');
  });
});
