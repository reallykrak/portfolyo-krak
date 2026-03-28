window.addEventListener('DOMContentLoaded', function() {

  var audio   = document.getElementById('the-audio');
  var playBtn = document.getElementById('sp-play');
  var prevBtn = document.getElementById('sp-prev');
  var nextBtn = document.getElementById('sp-next');
  var fillEl  = document.getElementById('sp-fill');
  var curEl   = document.getElementById('sp-cur');
  var durEl   = document.getElementById('sp-dur');
  var barEl   = document.getElementById('sp-bar');
  var artImg  = document.getElementById('sp-art');

  function fmt(s) {
    if (!s || !isFinite(s)) return '0:00';
    var m = Math.floor(s / 60);
    var sc = Math.floor(s % 60);
    return m + ':' + (sc < 10 ? '0' : '') + sc;
  }

  function updateIcon() {
    var ic = playBtn.querySelector('i');
    ic.className = audio.paused ? 'fas fa-play' : 'fas fa-pause';
    if (!audio.paused) artImg.classList.add('spin');
    else artImg.classList.remove('spin');
  }

  // PLAY BUTTON - en basit
  playBtn.onclick = function() {
    if (audio.paused) {
      audio.play().catch(function(e){ console.log(e); });
    } else {
      audio.pause();
    }
  };

  prevBtn.onclick = function() {
    audio.currentTime = 0;
    audio.play().catch(function(e){ console.log(e); });
  };

  nextBtn.onclick = function() {
    audio.currentTime = 0;
    audio.play().catch(function(e){ console.log(e); });
  };

  // Progress bar tıklama
  if (barEl) {
    barEl.onclick = function(e) {
      var rect = barEl.getBoundingClientRect();
      var r = (e.clientX - rect.left) / rect.width;
      if (audio.duration) audio.currentTime = r * audio.duration;
    };
  }

  // Zaman güncelleme
  audio.addEventListener('timeupdate', function() {
    if (audio.duration > 0) {
      fillEl.style.width = (audio.currentTime / audio.duration * 100) + '%';
      curEl.textContent = fmt(audio.currentTime);
    }
  });

  audio.addEventListener('loadedmetadata', function() {
    durEl.textContent = fmt(audio.duration);
  });

  audio.addEventListener('play',  updateIcon);
  audio.addEventListener('pause', updateIcon);
  audio.addEventListener('ended', function() {
    audio.currentTime = 0;
    updateIcon();
  });
});
