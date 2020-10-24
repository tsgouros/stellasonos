import React from 'react';

import './App.css';
import ReactTouchPosition from 'touch-position-react';
import TouchPositionLabel from './TouchPositionLabel';

export default function App() { 
  return (
    <div className="App">
      <ReactTouchPosition>
        <TouchPositionLabel />
      </ReactTouchPosition>
    </div>
  );
}