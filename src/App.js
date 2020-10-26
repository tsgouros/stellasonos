import React, {useEffect, useRef, useState} from 'react';

import './App.css';
import ReactTouchPosition from 'touch-position-react';
import PaintImage from './PaintImage';
import PlaySound from './PlaySound';
import * as Tone from 'tone'

export default function App() { 

  const player = useRef(null);
  const [isLoaded, setLoaded] = useState(false);
  
  useEffect(()=>{
    player.current = new Tone.Player("/galactic_all.mp3", 
    () => {
      setLoaded(true);
    }).toDestination();
  }, [])

  if(isLoaded) {
    return (
      <div className="App">
        <ReactTouchPosition>
          <PaintImage />
          <PlaySound player ={player.current}/>
        </ReactTouchPosition>
      </div>
    );
  } else {
    return (<div className="App">
      loading
    </div>);
  }
}