document.addEventListener(‘DOMContentLoaded’, function () {

const playlist = [
{
title:  “Nuron’s Krak”,
artist: “reallykrak”,
src:    “Müzikler/hallettim.mp3”,
art:    “image/reallykrak.png”
}
// Yeni şarkı: { title:”…”, artist:”…”, src:“Müzikler/….mp3”, art:“image/….png” }
];

let currentIndex = 0;
let isPlaying    = false;

const audio      = document.getElementById(‘audio’);
const playBtn    = document.getElementById(‘play-pause-btn’);
const prevBtn    = document.getElementById(‘prev-btn’);
const nextBtn    = document.getElementById(‘next-btn’);
const songTitle  = document.getElementById(‘song-title’);
const songArtist = document.getElementById(‘song-artist’);
const albumArt   = document.getElementById(‘album-art’);

function loadTrack(i) {
const t = playlist[i];
audio.src              = t.src;
songTitle.textContent  = t.title;
songArtist.textContent = t.artist;
albumArt.src           = t.art;
}

function updateIcon() {
playBtn.querySelector(‘i’).className = isPlaying ? ‘fas fa-pause’ : ‘fas fa-play’;
}

function play() {
audio.play()
.then(()  => { isPlaying = true;  updateIcon(); })
.catch(() => { isPlaying = false; updateIcon(); });
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
audio.currentTime = 0; play();
} else {
currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
loadTrack(currentIndex); play();
}
}

// İlk yükleme
audio.volume = 0.55;
loadTrack(currentIndex);

// Oto-başlat
audio.play()
.then(()  => { isPlaying = true;  updateIcon(); })
.catch(() => {
isPlaying = false; updateIcon();
const start = () => {
play();
document.removeEventListener(‘click’,      start);
document.removeEventListener(‘keydown’,    start);
document.removeEventListener(‘touchstart’, start);
};
document.addEventListener(‘click’,      start, { once:true });
document.addEventListener(‘keydown’,    start, { once:true });
document.addEventListener(‘touchstart’, start, { once:true });
});

playBtn.addEventListener(‘click’, e => { e.stopPropagation(); isPlaying ? pause() : play(); });
prevBtn.addEventListener(‘click’, e => { e.stopPropagation(); playPrev(); });
nextBtn.addEventListener(‘click’, e => { e.stopPropagation(); playNext(); });
audio.addEventListener(‘ended’, playNext);
});
