import React, { useEffect, useRef } from 'react';
import './App.css';
import {useWindowSize} from './hooks';

let colorExtractor = undefined;

function getColorIndicesForCoord(x, y, width, imageData) {
  var red = y * (width * 4) + x * 4;
  var colorIndices = [red, red + 1, red + 2, red + 3];

  var redIndex = colorIndices[0];
  var greenIndex = colorIndices[1];
  var blueIndex = colorIndices[2];
  var alphaIndex = colorIndices[3];

  var redForCoord = imageData.data[redIndex];
  var greenForCoord = imageData.data[greenIndex];
  var blueForCoord = imageData.data[blueIndex];
  var alphaForCoord = imageData.data[alphaIndex];

  console.log(redForCoord);
  console.log(greenForCoord);
  console.log(blueForCoord);
  console.log(alphaForCoord);

}

function App() { 
  const canvasRef = useRef(undefined);
  const [width, height] = useWindowSize();
  
  useEffect(() => {
    const image = new Image()
    console.log(width);
    image.onload = () => {
      canvasRef.current.getContext("2d").drawImage(image, 0, 0)
    }
    image.src = "logo512.png"
    if(width>0){
      if(colorExtractor != undefined) {
        console.log("unbinding")
        canvasRef.current.removeEventListener('click', colorExtractor);
      }
      colorExtractor =  (e)=> getColorIndicesForCoord(e.layerX, e.layerY, width, canvasRef.current.getContext("2d").getImageData(0,0,width,height));
      canvasRef.current.addEventListener('click', colorExtractor);
    }
  }, [width, height])

  return (
    <div className="App">
      <canvas ref={canvasRef} width={width} height={height}/>
    </div>
  );
}

export default App;
