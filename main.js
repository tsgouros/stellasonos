
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
  console.log("hello")
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

function getGainValuesAndPaintIndicatorBar(col) {
  var gainVals =[]
  var sonificationInfo = []

  var row = 0
  var sonificationDataIndex = 0;
  while(row < window.innerHeight){
    const index = (row * window.innerWidth + col) * 4; //gets index in image data array
    const red = imageCanvas.imageData[index];
    const green = imageCanvas.imageData[index + 1]
    const blue = imageCanvas.imageData[index + 2]
    
    const averageIntensity = (imageCanvas.imageData[index]+imageCanvas.imageData[index+1]+imageCanvas.imageData[index+2])/(255*3); //avg value rgb
    playheadCanvas.paintVisualIndicationOfSonificationOnDisplayBar(col, row, averageIntensity);

    if(averageIntensity != 0) {
      if(!sonificationInfo[sonificationDataIndex]) {
        sonificationInfo[sonificationDataIndex] = {
          startRow: row,
          endRow: row,
          red: red,
          green: green,
          blue: blue,
        }
      } else {
        sonificationInfo[sonificationDataIndex].endRow = row
        sonificationInfo[sonificationDataIndex].red += red
        sonificationInfo[sonificationDataIndex].green += green
        sonificationInfo[sonificationDataIndex].blue += blue
      }
    } else if(sonificationInfo[sonificationDataIndex]){
      var totalSize = sonificationInfo[sonificationDataIndex].endRow - sonificationInfo[sonificationDataIndex].startRow + 1
      sonificationInfo[sonificationDataIndex].red = sonificationInfo[sonificationDataIndex].red/totalSize
      sonificationInfo[sonificationDataIndex].green = sonificationInfo[sonificationDataIndex].green/totalSize
      sonificationInfo[sonificationDataIndex].blue = sonificationInfo[sonificationDataIndex].blue/totalSize
      sonificationDataIndex = sonificationDataIndex + 1
    }
    row = row + 1;
  }
  //console.log(sonificationInfo)
  return gainVals;
}

//basically sonifying based on color intensity
function updateSound(col) {
  var gainVals = getGainValuesAndPaintIndicatorBar(col)
  synth.updateGains(gainVals);
}

function handleMouse(e) {
  synth.resumeAudioContext();
  colPos = e.pageX;
  requestId = requestNextAnimationFrame(sonifyColumn);
}

function handleTouch(e) {
  console.log("touch registered")
  synth.resumeAudioContext();
	var touches = e.changedTouches;
  if (e.touches != undefined) {
	  colPos = e.touches[0].pageX;
	  requestId = requestNextAnimationFrame(sonifyColumn);
  }
}