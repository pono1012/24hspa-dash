import React, { useState, useEffect } from 'react';
import './OnboardsPanel.css';

const AVAILABLE_ONBOARDS = [
  { id: '3HVTTZMN5kc', car: '96', team: 'Rutronik Racing', driver: 'Lamborghini', class: 'PRO' },
  { id: 'nJrsgDUrH_s', car: '97', team: 'Rutronik Racing', driver: 'Porsche', class: 'PRO' },
  { id: '7aBqiEKRQ1Y', car: '93', team: 'Ziggo Sport Tempesta', driver: 'Porsche', class: 'PRO' },
  { id: '6eBn9aZ-yCg', car: '74', team: 'Kessel Racing', driver: 'Ferrari', class: 'BRONZE' },
  { id: 'l-CG2lzgkkY', car: '0', team: 'Johor Motorsports', driver: 'Corvette', class: 'PRO-AM' },
  { id: '8Hxnx2cKFFk', car: 'TV', team: 'Main Feed', driver: 'German Stream', class: 'PRO' }
];

const extractYoutubeId = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : url; // fallback to url
};

const OnboardSlot = ({ initialSlot, allOnboards }) => {
  const safeInitial = initialSlot % allOnboards.length;
  const [selectedOnboard, setSelectedOnboard] = useState(allOnboards[safeInitial]);

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
            const onboard = allOnboards.find(ob => ob.id === e.target.value);
            if (onboard) setSelectedOnboard(onboard);
          }}
        >
          {allOnboards.map(ob => (
            <option key={ob.id} value={ob.id}>Car {ob.car} - {ob.driver}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

const OnboardsPanel = () => {
  const [slotCount, setSlotCount] = useState(5);
  const slots = Array.from({ length: slotCount }, (_, i) => i);

  const [customOnboards, setCustomOnboards] = useState(() => {
    const saved = localStorage.getItem('dashboard-custom-onboards');
    return saved ? JSON.parse(saved) : [];
  });

  const allOnboards = [...AVAILABLE_ONBOARDS, ...customOnboards];

  const handleAddCustomOnboard = () => {
    const url = window.prompt("Enter YouTube URL for the custom onboard camera:");
    if (!url) return;
    
    const id = extractYoutubeId(url);
    if (!id) {
      alert("Invalid YouTube URL. Please try again.");
      return;
    }
    
    const carNum = window.prompt("Enter the Car Number (e.g. '99'):", "00");
    if (!carNum) return;

    const driverName = window.prompt("Enter the Driver or Team Name:", "Custom Car");
    if (!driverName) return;
    
    const newOnboard = { id, car: carNum, team: 'Custom', driver: driverName, class: 'CSTM' };
    const updatedCustoms = [...customOnboards, newOnboard];
    setCustomOnboards(updatedCustoms);
    localStorage.setItem('dashboard-custom-onboards', JSON.stringify(updatedCustoms));
  };

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
        <button 
          className="settings-select" 
          style={{ marginLeft: '12px', cursor: 'pointer', background: '#333' }}
          onClick={handleAddCustomOnboard}
        >
          + Add Custom Link
        </button>
      </div>
      <div className="onboards-grid">
        {slots.map(i => (
          <OnboardSlot key={i} initialSlot={i} allOnboards={allOnboards} />
        ))}
      </div>
    </div>
  );
};

export default OnboardsPanel;
