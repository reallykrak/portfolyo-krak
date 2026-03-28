document.addEventListener(‘DOMContentLoaded’, function () {

/* ── PLAYLIST ─────────────────────────────────────────── */
var playlist = [
{
title:  “Nuron’s Krak”,
artist: “reallykrak”,
src:    “Müzikler/hallettim.mp3”,
art:    “image/reallykrak.png”
}
/* Yeni şarkı eklemek:
,{ title:”…”, artist:”…”, src:“Müzikler/….mp3”, art:“image/….png” } */
];

var idx      = 0;
var playing  = false;
var dragging = false;

/* ── DOM ──────────────────────────────────────────────── */
var audio   = document.getElementById(‘audio’);
var playBtn = document.getElementById(‘play-pause-btn’);
var prevBtn = document.getElementById(‘prev-btn’);
var nextBtn = document.getElementById(‘next-btn’);
var titleEl = document.getElementById(‘song-title’);
var artEl   = document.getElementById(‘song-artist’);
var imgEl   = document.getElementById(‘album-art’);
var fill    = document.getElementById(‘sp-fill’);
var curEl   = document.getElementById(‘sp-current’);
var durEl   = document.getElementById(‘sp-duration’);
var barWrap = document.getElementById(‘sp-bar-wrap’);

audio.volume = 0.65;

/* ── helpers ──────────────────────────────────────────── */
function fmt(s) {
s = isFinite(s) ? s : 0;
var m = Math.floor(s / 60);
var sec = Math.floor(s % 60);
return m + ‘:’ + (sec < 10 ? ‘0’ : ‘’) + sec;
}

function syncUI() {
var ic = playBtn.querySelector(‘i’);
ic.className = playing ? ‘fas fa-pause’ : ‘fas fa-play’;
if (playing) imgEl.classList.add(‘spinning’);
else         imgEl.classList.remove(‘spinning’);
}

function loadTrack(i) {
var t = playlist[i];
audio.src           = t.src;
titleEl.textContent = t.title;
artEl.textContent   = t.artist;
imgEl.src           = t.art;
fill.style.width    = ‘0%’;
curEl.textContent   = ‘0:00’;
durEl.textContent   = ‘0:00’;
}

/* ── play / pause — her zaman güvenli ─────────────────── */
function doPlay() {
var p = audio.play();
if (p && typeof p.then === ‘function’) {
p.then(function() {
playing = true; syncUI();
}).catch(function(err) {
console.warn(‘Play engellendi:’, err.message);
playing = false; syncUI();
});
} else {
/* eski tarayıcılar */
playing = true; syncUI();
}
}

function doPause() {
audio.pause();
playing = false; syncUI();
}

function togglePlay() {
if (playing) doPause(); else doPlay();
}

function next() {
idx = (idx + 1) % playlist.length;
loadTrack(idx); doPlay();
}

function prev() {
if (audio.currentTime > 3) {
audio.currentTime = 0; doPlay();
} else {
idx = (idx - 1 + playlist.length) % playlist.length;
loadTrack(idx); doPlay();
}
}

/* ── İlk yükleme ──────────────────────────────────────── */
loadTrack(idx);

/* ── Autoplay denemesi (tarayıcı izin verirse başlar) ─── */
audio.play().then(function() {
playing = true; syncUI();
}).catch(function() {
/* Tarayıcı reddetti — kullanıcı play’e basınca başlayacak */
playing = false; syncUI();
});

/* ── Butonlar ─────────────────────────────────────────── */
playBtn.addEventListener(‘click’, function() {
togglePlay();
});

prevBtn.addEventListener(‘click’, function() {
prev();
});

nextBtn.addEventListener(‘click’, function() {
next();
});

/* ── Progress bar tıklama / sürükleme ─────────────────── */
function seekTo(clientX) {
var rect = barWrap.getBoundingClientRect();
var ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
if (isFinite(audio.duration) && audio.duration > 0) {
audio.currentTime = ratio * audio.duration;
}
}

barWrap.addEventListener(‘mousedown’, function(e) {
dragging = true; seekTo(e.clientX);
});
barWrap.addEventListener(‘touchstart’, function(e) {
dragging = true;
if (e.touches[0]) seekTo(e.touches[0].clientX);
}, { passive: true });
document.addEventListener(‘mousemove’, function(e) {
if (dragging) seekTo(e.clientX);
});
document.addEventListener(‘touchmove’, function(e) {
if (dragging && e.touches[0]) seekTo(e.touches[0].clientX);
}, { passive: true });
document.addEventListener(‘mouseup’,  function() { dragging = false; });
document.addEventListener(‘touchend’, function() { dragging = false; });

/* ── Audio event listeners ────────────────────────────── */
audio.addEventListener(‘timeupdate’, function() {
if (dragging) return;
if (audio.duration > 0 && isFinite(audio.duration)) {
fill.style.width   = (audio.currentTime / audio.duration * 100) + ‘%’;
curEl.textContent  = fmt(audio.currentTime);
}
});

audio.addEventListener(‘loadedmetadata’, function() {
if (isFinite(audio.duration)) durEl.textContent = fmt(audio.duration);
});

audio.addEventListener(‘play’,  function() { playing = true;  syncUI(); });
audio.addEventListener(‘pause’, function() { playing = false; syncUI(); });
audio.addEventListener(‘ended’, next);
});
