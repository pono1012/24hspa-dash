import React from 'react';
import './MapsView.css';

const MapsView = () => {
  return (
    <div className="maps-container">
      {/* Track Map SVG Panel */}
      <div className="glass-panel map-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h3 className="panel-title map-title">Circuit de Spa-Francorchamps</h3>
        <div className="track-map-wrapper">
          <svg viewBox="0 0 800 600" className="track-svg">
            <path 
              d="M 200,500 L 100,450 C 50,400 50,300 80,250 L 150,150 C 180,100 250,80 300,100 L 450,180 C 500,200 600,200 650,220 C 700,240 750,300 700,380 C 650,450 500,480 400,480 L 250,480 Z"
              fill="none"
              stroke="var(--accent-color)"
              strokeWidth="12"
              strokeLinejoin="round"
            />
            {/* Some mock corner labels */}
            <circle cx="100" cy="450" r="8" fill="#fff" />
            <text x="60" y="470" fill="#fff" fontSize="14">La Source</text>
            
            <circle cx="80" cy="250" r="8" fill="#fff" />
            <text x="30" y="240" fill="#fff" fontSize="14">Eau Rouge</text>
            
            <circle cx="300" cy="100" r="8" fill="#fff" />
            <text x="280" y="80" fill="#fff" fontSize="14">Les Combes</text>
            
            <circle cx="700" cy="380" r="8" fill="#fff" />
            <text x="720" y="390" fill="#fff" fontSize="14">Blanchimont</text>
            
            <circle cx="250" cy="480" r="8" fill="#fff" />
            <text x="220" y="510" fill="#fff" fontSize="14">Bus Stop</text>
          </svg>
        </div>
      </div>

      {/* Weather Radar Panel */}
      <div className="glass-panel map-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h3 className="panel-title map-title">Live Weather Radar (Spa)</h3>
        <div className="weather-radar-wrapper">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=°C&metricWind=km/h&zoom=10&overlay=rain&product=radar&level=surface&lat=50.437&lon=5.971&message=true" 
            frameBorder="0"
            title="Windy Weather Radar"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default MapsView;
