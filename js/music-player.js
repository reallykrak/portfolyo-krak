document.addEventListener(‘DOMContentLoaded’, function () {

/* ── PLAYLIST ─────────────────────────────────────────── */
const playlist = [
{
title:  “Nuron’s Krak”,
artist: “reallykrak”,
src:    “Müzikler/hallettim.mp3”,
art:    “image/reallykrak.png”
}
/* Eklemek için:
{ title:”…”, artist:”…”, src:“Müzikler/….mp3”, art:“image/….png” } */
];

let idx       = 0;
let isPlaying = false;
let unlocked  = false;
let dragging  = false;

/* ── DOM ──────────────────────────────────────────────── */
const audio     = document.getElementById(‘audio’);
const playBtn   = document.getElementById(‘play-pause-btn’);
const prevBtn   = document.getElementById(‘prev-btn’);
const nextBtn   = document.getElementById(‘next-btn’);
const titleEl   = document.getElementById(‘song-title’);
const artistEl  = document.getElementById(‘song-artist’);
const artEl     = document.getElementById(‘album-art’);
const fillEl    = document.getElementById(‘sp-fill’);
const curEl     = document.getElementById(‘sp-current’);
const durEl     = document.getElementById(‘sp-duration’);
const barWrap   = document.getElementById(‘sp-bar-wrap’);

audio.volume = 0.65;

/* ── helpers ──────────────────────────────────────────── */
function fmt(s) {
const m = Math.floor(s / 60);
const sec = Math.floor(s % 60);
return m + ‘:’ + (sec < 10 ? ‘0’ : ‘’) + sec;
}

function setIcon() {
playBtn.querySelector(‘i’).className = isPlaying ? ‘fas fa-pause’ : ‘fas fa-play’;
if (isPlaying) artEl.classList.add(‘spinning’);
else           artEl.classList.remove(‘spinning’);
}

function load(i) {
const t = playlist[i];
audio.src          = t.src;
titleEl.textContent  = t.title;
artistEl.textContent = t.artist;
artEl.src          = t.art;
fillEl.style.width = ‘0%’;
curEl.textContent  = ‘0:00’;
durEl.textContent  = ‘0:00’;
}

function doPlay() {
const p = audio.play();
if (p) {
p.then(() => { isPlaying = true;  unlocked = true; setIcon(); })
.catch(() => { isPlaying = false; setIcon(); });
}
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
if (audio.currentTime > 3) {
audio.currentTime = 0; doPlay();
} else {
idx = (idx - 1 + playlist.length) % playlist.length;
load(idx); doPlay();
}
}

/* ── ilk yükleme ─────────────────────────────────────── */
load(idx);

/* ── AUTOPLAY ─────────────────────────────────────────
Tarayıcı izin verirse direkt başlar.
Vermezse → ilk herhangi bir dokunuşta başlar
(capture:true olduğu için play butonuna basınca da çalışır)
────────────────────────────────────────────────────── */
function unlock() {
if (unlocked) return;
unlocked = true;
doPlay();
}

audio.play()
.then(() => { isPlaying = true; unlocked = true; setIcon(); })
.catch(() => {
isPlaying = false; setIcon();
document.addEventListener(‘click’,      unlock, { capture:true, once:true });
document.addEventListener(‘touchstart’, unlock, { capture:true, once:true });
document.addEventListener(‘keydown’,    unlock, { capture:true, once:true });
});

/* ── Butonlar ────────────────────────────────────────── */
playBtn.addEventListener(‘click’, function(e) {
e.stopPropagation();
if (!unlocked) { unlock(); return; }
isPlaying ? doPause() : doPlay();
});
prevBtn.addEventListener(‘click’, function(e) {
e.stopPropagation();
if (!unlocked) { unlock(); return; }
prev();
});
nextBtn.addEventListener(‘click’, function(e) {
e.stopPropagation();
if (!unlocked) { unlock(); return; }
next();
});

/* ── Progress bar (tıklama + sürükleme) ─────────────── */
function seekFromEvent(e) {
const rect = barWrap.getBoundingClientRect();
const clientX = e.touches ? e.touches[0].clientX : e.clientX;
const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
if (isFinite(audio.duration)) {
audio.currentTime = ratio * audio.duration;
}
}

barWrap.addEventListener(‘mousedown’, function(e) {
dragging = true; seekFromEvent(e);
});
barWrap.addEventListener(‘touchstart’, function(e) {
dragging = true; seekFromEvent(e);
}, { passive:true });
document.addEventListener(‘mousemove’, function(e) {
if (dragging) seekFromEvent(e);
});
document.addEventListener(‘touchmove’, function(e) {
if (dragging) seekFromEvent(e);
}, { passive:true });
document.addEventListener(‘mouseup’,    () => dragging = false);
document.addEventListener(‘touchend’,   () => dragging = false);

/* ── Audio events ────────────────────────────────────── */
audio.addEventListener(‘timeupdate’, function() {
if (!dragging && isFinite(audio.duration) && audio.duration > 0) {
const pct = (audio.currentTime / audio.duration) * 100;
fillEl.style.width = pct + ‘%’;
curEl.textContent  = fmt(audio.currentTime);
}
});

audio.addEventListener(‘loadedmetadata’, function() {
if (isFinite(audio.duration)) durEl.textContent = fmt(audio.duration);
});

audio.addEventListener(‘ended’, next);

audio.addEventListener(‘play’,  function() { isPlaying = true;  setIcon(); });
audio.addEventListener(‘pause’, function() { isPlaying = false; setIcon(); });
});
