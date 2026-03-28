document.addEventListener(‘DOMContentLoaded’, function () {

const playlist = [
{
title:  “Nuron’s Krak”,
artist: “reallykrak”,
src:    “Müzikler/hallettim.mp3”,
art:    “image/reallykrak.png”
}
];

let idx       = 0;
let isPlaying = false;
let unlocked  = false;

const audio   = document.getElementById(‘audio’);
const playBtn = document.getElementById(‘play-pause-btn’);
const prevBtn = document.getElementById(‘prev-btn’);
const nextBtn = document.getElementById(‘next-btn’);
const titleEl = document.getElementById(‘song-title’);
const artistEl= document.getElementById(‘song-artist’);
const artEl   = document.getElementById(‘album-art’);

audio.volume = 0.60;

/* ── helpers ── */
function load(i) {
const t = playlist[i];
audio.src     = t.src;
titleEl.textContent  = t.title;
artistEl.textContent = t.artist;
artEl.src     = t.art;
}

function setIcon() {
const ic = playBtn.querySelector(‘i’);
ic.className = isPlaying ? ‘fas fa-pause’ : ‘fas fa-play’;
}

function doPlay() {
const p = audio.play();
if (p) p.then(() => { isPlaying = true;  setIcon(); })
.catch(() => { isPlaying = false; setIcon(); });
}

function doPause() {
audio.pause();
isPlaying = false;
setIcon();
}

function next() {
idx = (idx + 1) % playlist.length;
load(idx); doPlay();
}

function prev() {
if (audio.currentTime > 3) { audio.currentTime = 0; doPlay(); }
else { idx = (idx - 1 + playlist.length) % playlist.length; load(idx); doPlay(); }
}

/* ── ilk yükleme ── */
load(idx);

/* ── autoplay:
Önce sessizce dene. Tarayıcı izin verirse başlar.
Vermezse: herhangi bir yere DOKUNULUNCA başlar.
Sayfa kendi play butonuna basınca da çalışır.        ── */
audio.play()
.then(() => { isPlaying = true; unlocked = true; setIcon(); })
.catch(() => {
// Tarayıcı autoplay’i engelledi
isPlaying = false; setIcon();

```
  function onFirstInteraction() {
    if (unlocked) return;
    unlocked = true;
    doPlay();
    document.removeEventListener('click',      onFirstInteraction, true);
    document.removeEventListener('touchstart', onFirstInteraction, true);
    document.removeEventListener('keydown',    onFirstInteraction, true);
  }
  // capture:true → play butonuna basıldığında da tetiklenir
  document.addEventListener('click',      onFirstInteraction, { capture:true, once:true });
  document.addEventListener('touchstart', onFirstInteraction, { capture:true, once:true });
  document.addEventListener('keydown',    onFirstInteraction, { capture:true, once:true });
});
```

/* ── butonlar (tüm tıklamalar stopPropagation yapmaz,
böylece ilk tıklama unlock’u da tetikler)           ── */
playBtn.addEventListener(‘click’, function() {
if (!unlocked) { unlocked = true; doPlay(); return; }
isPlaying ? doPause() : doPlay();
});

prevBtn.addEventListener(‘click’, function() {
if (!unlocked) { unlocked = true; load(idx); doPlay(); return; }
prev();
});

nextBtn.addEventListener(‘click’, function() {
if (!unlocked) { unlocked = true; load(idx); doPlay(); return; }
next();
});

audio.addEventListener(‘ended’, next);
});
