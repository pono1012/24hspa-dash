import React, { useState } from 'react';
import './OnboardsPanel.css';

const AVAILABLE_ONBOARDS = [
  { id: '3HVTTZMN5kc', car: '96', team: 'Rutronik Racing', driver: 'Lamborghini', class: 'PRO' },
  { id: 'nJrsgDUrH_s', car: '97', team: 'Rutronik Racing', driver: 'Porsche', class: 'PRO' },
  { id: '7aBqiEKRQ1Y', car: '93', team: 'Ziggo Sport Tempesta', driver: 'Porsche', class: 'PRO' },
  { id: '6eBn9aZ-yCg', car: '74', team: 'Kessel Racing', driver: 'Ferrari', class: 'BRONZE' },
  { id: 'l-CG2lzgkkY', car: '0', team: 'Johor Motorsports', driver: 'Corvette', class: 'PRO-AM' },
  { id: '8Hxnx2cKFFk', car: 'TV', team: 'Main Feed', driver: 'German Stream', class: 'PRO' }
];

const OnboardSlot = ({ initialSlot }) => {
  const [selectedOnboard, setSelectedOnboard] = useState(AVAILABLE_ONBOARDS[initialSlot]);

  return (
    <div className="onboard-mini-card">
      <div className="onboard-mini-video">
        <iframe
          src={`https://www.youtube.com/embed/${selectedOnboard.id}?mute=1`}
          title={`Onboard Car ${selectedOnboard.car}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="onboard-mini-overlay">
        <span className="mini-car-badge">{selectedOnboard.car}</span>
        <span className="mini-driver-name">{selectedOnboard.driver}</span>
        
        {/* Small Dropdown to select stream */}
        <select 
          className="mini-onboard-selector"
          value={selectedOnboard.id}
          onChange={(e) => {
            const onboard = AVAILABLE_ONBOARDS.find(ob => ob.id === e.target.value);
            if (onboard) setSelectedOnboard(onboard);
          }}
        >
          {AVAILABLE_ONBOARDS.map(ob => (
            <option key={ob.id} value={ob.id}>Car {ob.car} - {ob.driver}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

const OnboardsPanel = () => {
  const [slotCount, setSlotCount] = useState(4);
  const slots = Array.from({ length: slotCount }, (_, i) => i);

  return (
    <div className="onboards-container">
      <div className="onboards-settings">
        <span className="settings-label">Grid Size:</span>
        <select 
          className="settings-select"
          value={slotCount} 
          onChange={e => setSlotCount(Number(e.target.value))}
        >
          <option value={1}>1 Camera</option>
          <option value={2}>2 Cameras</option>
          <option value={3}>3 Cameras</option>
          <option value={4}>4 Cameras</option>
          <option value={5}>5 Cameras</option>
          <option value={6}>6 Cameras</option>
          <option value={7}>7 Cameras</option>
          <option value={8}>8 Cameras</option>
        </select>
      </div>
      <div className="onboards-grid">
        {slots.map(i => (
          <OnboardSlot key={i} initialSlot={i % AVAILABLE_ONBOARDS.length} />
        ))}
      </div>
    </div>
  );
};

export default OnboardsPanel;
