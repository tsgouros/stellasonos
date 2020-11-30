
//squares

import Synthesizer from './synthesizer.js';
import ImageCanvas from './imageCanvas.js';
var synth, imageCanvas;
var colPos = 0;

var settings = {
  brightness: 0.5,
  contrast: 0.5,
  invert: false,
  repetitions: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  spacing: {
    x: 0.16,
    y: 0.16
  },
  rotation: 0,
  play: true,
  speed: 0.7,
  drawMode: true,
  stroke_width: 0.1,
  stroke_repetitions: 0.3,
  stroke_opacity: 1.0,
  eraser: 0,
  stroke_offset: {
    x: 0.6,
    y: 0.6
  },
  scale: {
    numSteps: 100,
    note: "C",
    octave: 1,
    type: 'chromatic'
  }
};

var synthObj = {};

var lastTime = 0;
var scaleFrequencies;
var playheadCanvas, imageData, playheadCtx;
var requestId;

window.onload = function () {
  imageCanvas = new ImageCanvas(handlePlay);
  playheadCanvas = document.createElement("canvas");
  playheadCanvas.width = window.innerWidth;
  playheadCanvas.height = window.innerHeight;
  playheadCanvas.style.position = "fixed";
  playheadCanvas.style.top = "0px";
  playheadCanvas.style.left = "0px";
  playheadCtx = playheadCanvas.getContext('2d');

	synth = new Synthesizer();
  document.body.appendChild(playheadCanvas);
  setEventHandlers();
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
  playheadCanvas.addEventListener("touchstart", handleTouch, false);
  playheadCanvas.addEventListener("touchmove", handleTouch, false);
  playheadCanvas.addEventListener("mousedown", handleMouse, false);
  playheadCanvas.addEventListener("mousemove", handleMouse, false);
  window.addEventListener("resize", onResize);
}

function nextStep() {
  var step = Math.floor((synth.getCurrTime() - synth.getPrevTime()) * (settings.speed * 400 - 200));
  var col = colPos + step;
  if (col >= imageCanvas.canvas.width) {
    while (col >= imageCanvas.canvas.width) {
      col -= imageCanvas.canvas.width;
    }
  }
  if (col < 0) col += imageCanvas.canvas.width;
  playheadCtx.clearRect(0, 0, playheadCanvas.width, playheadCanvas.height);

  playheadCtx.fillStyle = "rgba(255, 0, 0, 1)";
  playheadCtx.fillRect(col - 5, 0, 10, imageCanvas.canvas.height);
  playheadCtx.fillStyle = "rgba(255, 255, 255, 1)";

  var gainVals = [];
  for (var i = 0; i < settings.scale.numSteps; i++) {
    var row = Math.floor((i + 0.5) * imageCanvas.canvas.height / settings.scale.numSteps);
    var off = (row * imageCanvas.canvas.width + col) * 4;
    var val;

    val = (imageCanvas.imageData[off]+imageCanvas.imageData[off+1]+imageCanvas.imageData[off+2])/(255*3);
    playheadCtx.fillRect(col - 5, row, 10, val * 5);
    gainVals[i] = val;
  }
  synth.updateGains(gainVals);
}

function handleMouse(e) {
  synth.resumeAudioContext();
  colPos = e.pageX;
  requestId = requestNextAnimationFrame(nextStep);
}

function handleTouch(e) {
  synth.resumeAudioContext();
  var touches = e.changedTouches;
  if (e.touches != undefined) {
	colPos = e.touches[0].pageX;
	requestId = requestNextAnimationFrame(nextStep);
  }
}

function onResize() {
  imageCanvas.resize(window.innerWidth, window.innerHeight);
  playheadCanvas.width = window.innerWidth;
  playheadCanvas.height = window.innerHeight;
}