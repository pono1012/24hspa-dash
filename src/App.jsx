import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StreamViewer from './components/StreamViewer';
import LiveTiming from './components/LiveTiming';
import WeatherWidget from './components/WeatherWidget';
import RaceControl from './components/RaceControl';
import OnboardsPanel from './components/OnboardsPanel';
import DraggablePanel from './components/DraggablePanel';
import './App.css';

function App() {
  const [visiblePanels, setVisiblePanels] = useState(() => {
    const saved = localStorage.getItem('dashboard-visible-panels');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved visible panels", e);
      }
    }
    return {
      broadcast: true,
      timing: true,
      raceControl: true,
      weather: true,
      map: false,
      onboards: true
    };
  });

  useEffect(() => {
    localStorage.setItem('dashboard-visible-panels', JSON.stringify(visiblePanels));
  }, [visiblePanels]);

  return (
    <div className="dashboard-app floating-layout">
      <div className="mobile-warning">
        <h2>🖥️ Desktop Recommended</h2>
        <p>This professional telemetry dashboard is designed for large desktop monitors. Please view on a larger screen for the best experience.</p>
      </div>

      <Header visiblePanels={visiblePanels} setVisiblePanels={setVisiblePanels} />
      
      <main className="dashboard-workspace">
        {/* Main Broadcast Window */}
        {visiblePanels.broadcast && (
          <DraggablePanel 
            title="Broadcast" 
            defaultPosition={{ x: 979, y: 285 }} 
            defaultSize={{ width: 1260, height: 840 }}
            zIndexOffset={1}
          >
            <StreamViewer />
          </DraggablePanel>
        )}

        {/* Live Timing Window */}
        {visiblePanels.timing && (
          <DraggablePanel 
            title="Live Timing" 
            defaultPosition={{ x: 14, y: 272 }} 
            defaultSize={{ width: 960, height: 920 }}
            zIndexOffset={1}
          >
            <LiveTiming />
          </DraggablePanel>
        )}

        {/* Race Control Window */}
        {visiblePanels.raceControl && (
          <DraggablePanel 
            title="Race Control" 
            defaultPosition={{ x: 738, y: 281 }} 
            defaultSize={{ width: 300, height: 320 }}
            zIndexOffset={2}
          >
            <RaceControl />
          </DraggablePanel>
        )}

        {/* Weather Status Window */}
        {visiblePanels.weather && (
          <DraggablePanel 
            title="Conditions" 
            defaultPosition={{ x: 730, y: 738 }} 
            defaultSize={{ width: 320, height: 240 }}
            zIndexOffset={4}
          >
            <WeatherWidget />
          </DraggablePanel>
        )}

        {/* Track Map Window */}
        {visiblePanels.map && (
          <DraggablePanel 
            title="Circuit Map (Beta)" 
            defaultPosition={{ x: 860, y: 240 }} 
            defaultSize={{ width: 400, height: 230 }}
            zIndexOffset={5}
          >
          <div className="widget-wrapper track-bg">
            <svg viewBox="0 0 800 800" className="track-svg" style={{ width: '100%', height: '100%' }}>
              {/* More accurate Spa-Francorchamps approximation */}
              <path 
                d="M 300,650 C 250,650 200,600 250,550 C 280,520 300,500 280,450 C 250,400 350,250 400,150 C 450,50 550,50 600,150 C 620,200 550,250 550,300 C 550,350 600,400 650,450 C 700,500 750,550 700,650 C 650,750 550,700 500,700 L 400,700 C 350,700 350,650 300,650 Z"
                fill="none"
                stroke="var(--accent-color)"
                strokeWidth="14"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <circle cx="300" cy="650" r="10" fill="#fff" />
              <text x="220" y="680" fill="#fff" fontSize="16" fontWeight="bold">La Source</text>
              
              <circle cx="280" cy="450" r="10" fill="#fff" />
              <text x="170" y="440" fill="#fff" fontSize="16" fontWeight="bold">Eau Rouge</text>
              
              <circle cx="600" cy="150" r="10" fill="#fff" />
              <text x="620" y="140" fill="#fff" fontSize="16" fontWeight="bold">Les Combes</text>
              
              <circle cx="700" cy="650" r="10" fill="#fff" />
              <text x="720" y="660" fill="#fff" fontSize="16" fontWeight="bold">Blanchimont</text>
              
              <circle cx="450" cy="700" r="10" fill="#fff" />
              <text x="400" y="730" fill="#fff" fontSize="16" fontWeight="bold">Bus Stop</text>
            </svg>
          </div>
        </DraggablePanel>
        )}

        {/* Weather Radar Window */}
        {visiblePanels.weather && (
          <DraggablePanel 
            title="Weather Radar" 
            defaultPosition={{ x: 740, y: 521 }} 
            defaultSize={{ width: 300, height: 280 }}
            zIndexOffset={3}
          >
            <div className="widget-wrapper">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km/h&zoom=10&overlay=rain&product=radar&level=surface&lat=50.437&lon=5.971&message=true" 
                frameBorder="0"
                title="Windy Weather Radar"
              ></iframe>
            </div>
          </DraggablePanel>
        )}

        {/* Live Onboards Grid Window */}
        {visiblePanels.onboards && (
          <DraggablePanel 
            title="Live Onboards Grid" 
            defaultPosition={{ x: 19, y: 0 }} 
            defaultSize={{ width: 2540, height: 360 }}
            zIndexOffset={0}
          >
            <OnboardsPanel />
          </DraggablePanel>
        )}
      </main>
    </div>
  );
}

export default App;
