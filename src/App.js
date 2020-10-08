import React, { useEffect, useRef } from 'react';
import './App.css';
import {useWindowSize} from './hooks';

function App() { 
  const canvasRef = useRef(undefined);
  const [width, height] = useWindowSize();
  
  useEffect(() => {
    const image = new Image()
    image.onload = () => {
      canvasRef.current.getContext("2d").drawImage(image, 0, 0)
    }
    image.src = "logo512.png"
  }, [width, height])

  return (
    <div className="App">
      <canvas ref={canvasRef} width={width} height={height}/>
    </div>
  );
}

export default App;
