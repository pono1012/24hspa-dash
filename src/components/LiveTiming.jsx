import React from 'react';
import './LiveTiming.css';

const LiveTiming = () => {
  return (
    <div className="timing-container" style={{ padding: 0, height: '100%', width: '100%', background: '#000' }}>
      <iframe 
        src="/swisstiming/index.html?profile=sro"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Swiss Timing Live Timing"
        allowFullScreen
        allow="fullscreen"
      ></iframe>
    </div>
  );
};


export default LiveTiming;
