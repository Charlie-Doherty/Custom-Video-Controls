const video = document.querySelector('video');
const videoContainer = document.querySelector('.video-container');

const overlay = document.querySelector('.overlay');
const controls = document.querySelector('.controls');
const playToggle = document.querySelector('.play-toggle i');

const volume = document.querySelector('.volume i');
const volumeBar = document.querySelector('.volume-bar');
const volumeBarContainer = document.querySelector('.volume-bar-container');

const timeBar = document.querySelector('.time-bar');
const timeBarContainer = document.querySelector('.time-bar-container');
const timeText = document.querySelector('.time');

const fullscreenToggle = document.querySelector('.fullscreen-toggle i');

let previousVolume = 1;
let newVolume = 1;

playToggle.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
overlay.addEventListener('click', togglePlay);

volume.addEventListener('click', toggleMute);
volumeBarContainer.addEventListener('click', changeVolume);

video.addEventListener('timeupdate', updateTime);
video.addEventListener('canplay', updateTime);
timeBarContainer.addEventListener('click', setTime);

fullscreenToggle.addEventListener('click', toggleFullscreen);

window.addEventListener('keydown', handleKeypress);

function togglePlay(){
    if(video.paused){
        video.play();
        playToggle.className = 'fas fa-pause';
        controls.classList.remove('paused');
    }
    else{
        video.pause();
        playToggle.className = 'fas fa-play';
        controls.classList.add('paused');
    }

    overlay.style.display = 'none';
}

function toggleMute(){
  if(video.volume){
    video.volume = 0;
    volume.className = 'fas fa-volume-mute';
    volumeBar.style.width = '0';
  }
  else if (newVolume > 0.65) {
    volume.className = 'fas fa-volume-up';
    video.volume = previousVolume;
    volumeBar.style.width = `${previousVolume * 100}%`;
  } 
  else if (newVolume > 0 && newVolume < 0.65 && newVolume > 0.3) {
    volume.className = 'fas fa-volume';
    video.volume = previousVolume;
    volumeBar.style.width = `${previousVolume * 100}%`;
  }
  else if (newVolume > 0 && newVolume < 0.3 && newVolume < 0.65) {
    volume.className = 'fas fa-volume-down';
    video.volume = previousVolume;
    volumeBar.style.width = `${previousVolume * 100}%`;
  } 
}

function changeVolume(e) {
  newVolume = e.offsetX / volumeBarContainer.offsetWidth;
  volumeBar.style.width = `${newVolume * 100}%`;
  video.volume = newVolume;
  if (newVolume > 0.65) {
    volume.className = 'fas fa-volume-up';
  } 
  else if (newVolume > 0 && newVolume < 0.65 && newVolume > 0.3) {
    volume.className = 'fas fa-volume';
  }
  else if (newVolume > 0 && newVolume < 0.3 && newVolume < 0.65) {
    volume.className = 'fas fa-volume-down';
  } 
  else if (newVolume == 0) {
    volume.className = 'fas fa-volume-mute';
  }
  previousVolume = newVolume;
}

function updateTime(){
    timeBar.style.width = `${video.currentTime / video.duration * 100}%`;

    if(video.ended){
        playToggle.className = 'fas fa-redo';
        controls.classList.add('paused');
    }

    timeText.textContent = `${timeFormat(video.currentTime)} / ${timeFormat(video.duration)}`;
}

function setTime(e){
	const newTime = e.offsetX / timeBarContainer.offsetWidth;
	timeBar.style.width = `${newTime * 100}%`;
  video.currentTime = newTime * video.duration;
  
  if(video.paused){
    playToggle.className = 'fas fa-play';
  }
  else{
      playToggle.className = 'fas fa-pause';
  }
}

function timeFormat(time){
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = Math.floor(time % 60);

	seconds = seconds <= 9 ? `0${seconds}` : seconds;
	return `${minutes}:${seconds}`;
}

function openFullscreen(element){
    fullscreenToggle.className = 'fas fa-compress';
    if(element.requestFullscreen) {
      element.requestFullscreen();
    } 
    else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } 
    else if(element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } 
    else if(element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  function exitFullscreen(){
    fullscreenToggle.className = 'fas fa-expand';
    if(document.exitFullscreen) {
      document.exitFullscreen();
    } 
    else if(document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } 
    else if(document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  let fullscreen = false;
  function toggleFullscreen(){
    fullscreen ? exitFullscreen() : openFullscreen(videoContainer)
    fullscreen = !fullscreen;
  }

function handleKeypress(e){
	if(e.code == 'Space'){
        togglePlay();
    }
    if(e.code == 'KeyF'){
        toggleFullscreen();
    }
}