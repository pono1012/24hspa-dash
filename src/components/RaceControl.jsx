import React from 'react';
import './RaceControl.css';

const RaceControl = () => {
  return (
    <div className="race-control-container" style={{ padding: 0, height: '100%', width: '100%', background: '#000' }}>
      <iframe 
        src="/swisstiming/index.html?profile=sro"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Swiss Timing Race Control"
        allowFullScreen
        allow="fullscreen"
      ></iframe>
    </div>
  );
};

export default RaceControl;
