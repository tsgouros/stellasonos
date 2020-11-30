
//squares

import Synthesizer from './synthesizer.js';
import ImageCanvas from './imageCanvas.js';
import PlayheadCanvas from './playheadCanvas.js';

var synth, imageCanvas;
var colPos = 0;

var settings = {
  play: true,
  speed: 0.7,
  scale: {
    numSteps: 100,
  }
};

var synthObj = {};

var lastTime = 0;
var playheadCanvas;
var requestId;

window.onload = function () {
  imageCanvas = new ImageCanvas();
  playheadCanvas = new PlayheadCanvas();
	synth = new Synthesizer();
  setEventHandlers();
  handlePlay();
};

function requestNextAnimationFrame (callback, element) {
	var currTime = new Date().getTime();
	var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	var id = window.setTimeout(function() { callback(currTime + timeToCall); },
	  timeToCall);
	lastTime = currTime + timeToCall;
	return id;
};

function handlePlay() {
  synth.resumeAudioContext();
  settings.play = true;
}

function setEventHandlers() {
  playheadCanvas.addEventHandler("touchstart", handleTouch, false);
  playheadCanvas.addEventHandler("touchmove", handleTouch, false);
  playheadCanvas.addEventHandler("mousedown", handleMouse, false);
  playheadCanvas.addEventHandler("mousemove", handleMouse, false);
}

function getNextColumnToProcess() {
  var step = Math.floor((synth.getCurrTime() - synth.getPrevTime()) * (settings.speed * 400 - 200));
  var col = colPos + step;
  if (col >= window.innerWidth) {
    while (col >= window.innerWidth) {
      col -= window.innerWidth;
    }
  }
  if (col < 0) col += window.innerWidth;

  return col;
}

function sonifyColumn() {
  const col = getNextColumnToProcess();
  playheadCanvas.paintDisplayBar(col);
  updateSound(col);
}

//basically sonifying based on color intensity
function updateSound(col) {
  var gainVals = [];
  for (var i = 0; i < settings.scale.numSteps; i++) {
    var row = Math.floor((i + 0.5) * window.innerHeight / settings.scale.numSteps);
    var off = (row * window.innerWidth + col) * 4; //gets index in image data array
    var val = (imageCanvas.imageData[off]+imageCanvas.imageData[off+1]+imageCanvas.imageData[off+2])/(255*3); //avg value rgb
    playheadCanvas.paintVisualIndicationOfSonificationOnDisplayBar(col, row, val);
    gainVals[i] = val;
  }
  synth.updateGains(gainVals);
}

function handleMouse(e) {
  synth.resumeAudioContext();
  colPos = e.pageX;
  requestId = requestNextAnimationFrame(sonifyColumn);
}

function handleTouch(e) {
  synth.resumeAudioContext();
  var touches = e.changedTouches;
  if (e.touches != undefined) {
	colPos = e.touches[0].pageX;
	requestId = requestNextAnimationFrame(sonifyColumn);
  }
}