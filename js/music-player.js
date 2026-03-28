// Müzik oynatıcı — en sade, en güvenilir yaklaşım
(function() {
‘use strict’;

var TRACKS = [
{
title:  “Nuron’s Krak”,
artist: “reallykrak”,
src:    “Muzikler/hallettim.mp3”,   // klasör adı: Muzikler (ü yok)
art:    “image/reallykrak.png”
}
];

var idx = 0;

// DOM — window.onload ile bekliyoruz (DOMContentLoaded daha erken ama
// bazı mobil tarayıcılarda audio elementi hazır olmayabilir)
window.addEventListener(‘load’, function() {

```
var audio   = document.getElementById('the-audio');
var playBtn = document.getElementById('sp-play');
var prevBtn = document.getElementById('sp-prev');
var nextBtn = document.getElementById('sp-next');
var artImg  = document.getElementById('sp-art');
var titleEl = document.getElementById('sp-title');
var artEl   = document.getElementById('sp-artist');
var fillEl  = document.getElementById('sp-fill');
var curEl   = document.getElementById('sp-cur');
var durEl   = document.getElementById('sp-dur');
var barEl   = document.getElementById('sp-bar');

if (!audio || !playBtn) return;

audio.volume = 0.65;

/* ── format time ── */
function fmt(s) {
  if (!isFinite(s) || s < 0) s = 0;
  var m = Math.floor(s / 60);
  var sec = Math.floor(s % 60);
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

/* ── sync buton ikonu ve dönen art ── */
function syncUI() {
  var ic = playBtn.querySelector('i');
  if (!audio.paused) {
    ic.className = 'fas fa-pause';
    artImg.classList.add('spin');
  } else {
    ic.className = 'fas fa-play';
    artImg.classList.remove('spin');
  }
}

/* ── şarkı yükle ── */
function loadTrack(i) {
  var t = TRACKS[i];
  audio.src           = t.src;
  titleEl.textContent = t.title;
  artEl.textContent   = t.artist;
  artImg.src          = t.art;
  fillEl.style.width  = '0%';
  curEl.textContent   = '0:00';
  durEl.textContent   = '0:00';
}

/* ── PLAY — doğrudan, user gesture içinde ── */
function doPlay() {
  var p = audio.play();
  if (p && p.catch) {
    p.catch(function(e) {
      console.warn('Audio play blocked:', e.message);
    });
  }
}

/* ── INIT ── */
loadTrack(idx);

/* ── PLAY BUTTON — en basit doğrudan onclick ── */
playBtn.onclick = function() {
  if (audio.paused) {
    doPlay();
  } else {
    audio.pause();
  }
};

prevBtn.onclick = function() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    doPlay();
  } else {
    idx = (idx - 1 + TRACKS.length) % TRACKS.length;
    loadTrack(idx);
    doPlay();
  }
};

nextBtn.onclick = function() {
  idx = (idx + 1) % TRACKS.length;
  loadTrack(idx);
  doPlay();
};

/* ── Progress bar tıklama ── */
var dragging = false;

function seekFromEvent(clientX) {
  var rect = barEl.getBoundingClientRect();
  var r = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  if (audio.duration && isFinite(audio.duration)) {
    audio.currentTime = r * audio.duration;
  }
}

barEl.addEventListener('mousedown', function(e) {
  dragging = true; seekFromEvent(e.clientX); e.preventDefault();
});
barEl.addEventListener('touchstart', function(e) {
  dragging = true;
  if (e.touches[0]) seekFromEvent(e.touches[0].clientX);
}, { passive: true });
document.addEventListener('mousemove', function(e) {
  if (dragging) seekFromEvent(e.clientX);
});
document.addEventListener('touchmove', function(e) {
  if (dragging && e.touches[0]) seekFromEvent(e.touches[0].clientX);
}, { passive: true });
document.addEventListener('mouseup',  function() { dragging = false; });
document.addEventListener('touchend', function() { dragging = false; });

/* ── Audio events ── */
audio.addEventListener('timeupdate', function() {
  if (dragging) return;
  if (audio.duration > 0 && isFinite(audio.duration)) {
    fillEl.style.width = (audio.currentTime / audio.duration * 100) + '%';
    curEl.textContent  = fmt(audio.currentTime);
  }
});

audio.addEventListener('loadedmetadata', function() {
  if (isFinite(audio.duration)) durEl.textContent = fmt(audio.duration);
});

audio.addEventListener('play',  syncUI);
audio.addEventListener('pause', syncUI);
audio.addEventListener('ended', function() {
  idx = (idx + 1) % TRACKS.length;
  loadTrack(idx); doPlay();
});

/* ── Autoplay denemesi ── */
doPlay();
```

});
})();
