
//squares

import Synthesizer from './synthesizer.js';
import ScaleMaker  from 'scale-maker';
import ImageCanvas from './imageCanvas.js';
var synth, imageCanvas;
//squares

var prevTime, data;
var colPos = 0;
var isPlaying = true;

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
var playheadCanvas, imageData, ctx, playheadCtx, compressor, ongoingTouches, mouse, touchObject, audioCtx, backgroundColor, oscillators;
var requestId, startTime;
window.AudioContext = window.AudioContext || window.webkitAudioContext;

window.onload = function () {
  init();
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
  prevTime = audioCtx.currentTime;
  settings.play = true;
  
  if (audioCtx.resume) {
    audioCtx.resume();
  }
}

function regenerateSynth() {
  synth.endSynth();
  var note = settings.scale.note + "" + settings.scale.octave;
  scaleFrequencies = ScaleMaker.makeScale(settings.scale.type, note, parseInt(settings.scale.numSteps)).inHertz;
  synth = new Synthesizer(scaleFrequencies, compressor, audioCtx);
}

function handleStop() {
  settings.play = false;
  if (audioCtx.suspend) {
    audioCtx.suspend();
  } else {
    var gainVals = [];
    for (var i = 0; i < settings.scale.numSteps; i++) {
      gainVals[i] = 0;
    }
    synth.updateGains(gainVals);
    cancelAnimationFrame(requestId);
  }
}

function init() {
  document.body.removeChild(document.getElementById("landing"));
  ongoingTouches = new Array();

  touchObject = {};
  oscillators = {};

  imageCanvas = new ImageCanvas(settings, handlePlay);
  playheadCanvas = document.createElement("canvas");
  playheadCanvas.width = window.innerWidth;
  playheadCanvas.height = window.innerHeight;
  playheadCanvas.style.position = "fixed";
  playheadCanvas.style.top = "0px";
  playheadCanvas.style.left = "0px";
  playheadCtx = playheadCanvas.getContext('2d');
  backgroundColor = "rgba(242, 35, 12, 0.1)";

  initAudioCtx();
  audioCtx.resume();

  document.body.appendChild(playheadCanvas);
  setEventHandlers();
}

function setEventHandlers() {
  playheadCanvas.addEventListener("touchstart", handleTouchStart, false);
  playheadCanvas.addEventListener("touchend", handleTouchEnd, false);
  playheadCanvas.addEventListener("touchcancel", handleTouchCancel, false);
  playheadCanvas.addEventListener("touchmove", handleTouchMove, false);
  playheadCanvas.addEventListener("mousedown", handleMouseStart, false);
  playheadCanvas.addEventListener("mousemove", handleMouseMove, false);
  playheadCanvas.addEventListener("mouseup", handleMouseUp, false);
  playheadCanvas.addEventListener("mouseout", handleMouseUp, false);
  playheadCanvas.addEventListener("mouseleave", handleMouseUp, false);
  window.addEventListener("resize", onResize);
}

function initAudioCtx() {
	audioCtx = new window.AudioContext();
	compressor = audioCtx.createDynamicsCompressor();
	compressor.connect(audioCtx.destination);
	scaleFrequencies = ScaleMaker.makeScale(settings.scale.type, 'C3', settings.scale.numSteps).inHertz;
	synth = new Synthesizer(scaleFrequencies, compressor, audioCtx);
}

function nextStep() {
  //var col = Math.floor(audioCtx.currentTime*settings.speed);
  var step = Math.floor((audioCtx.currentTime - prevTime) * (settings.speed * 400 - 200));
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
  prevTime = audioCtx.currentTime;
}

function handleMouseStart(e) {
  audioCtx.resume();
  colPos = e.pageX;
  requestId = requestNextAnimationFrame(nextStep);
}

function handleMouseMove(e) {
  audioCtx.resume();
  colPos = e.pageX;
  requestId = requestNextAnimationFrame(nextStep);
}

function handleMouseUp() {
	audioCtx.resume();
}

function handleTouchStart(e) {
  audioCtx.resume();
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

function handleTouchMove(e) {
	audioCtx.resume();
}

function handleTouchEnd(e) {
}

function handleTouchCancel(e) {}