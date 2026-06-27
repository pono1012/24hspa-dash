import React, { useState, useEffect } from 'react';
import './StreamViewer.css';

const STREAMS = [
  { id: '8Hxnx2cKFFk', label: 'Main Stream (DE)', type: 'main', lang: 'DE' },
  { id: '1bbj47g_FOs', label: 'Main Stream (EN)', type: 'main', lang: 'EN' }
];

const extractYoutubeId = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : url; // fallback to url in case they just pasted the ID
};

const StreamViewer = () => {
  const [customStreams, setCustomStreams] = useState(() => {
    const saved = localStorage.getItem('dashboard-custom-streams');
    return saved ? JSON.parse(saved) : [];
  });
  
  const allStreams = [...STREAMS, ...customStreams];
  
  const [activeStream, setActiveStream] = useState(allStreams[0]);
  const [showSelector, setShowSelector] = useState(false);

  const handleAddCustomStream = () => {
    const url = window.prompt("Enter YouTube URL for the custom stream:");
    if (!url) return;
    
    const id = extractYoutubeId(url);
    if (!id) {
      alert("Invalid YouTube URL. Please try again.");
      return;
    }
    
    const name = window.prompt("Enter a short name for this stream (e.g. 'Fan Cam'):", "Custom Stream");
    if (!name) return;
    
    const newStream = { id, label: name, type: 'custom', lang: 'CSTM' };
    const updatedCustoms = [...customStreams, newStream];
    setCustomStreams(updatedCustoms);
    localStorage.setItem('dashboard-custom-streams', JSON.stringify(updatedCustoms));
    setActiveStream(newStream);
    setShowSelector(false);
  };

  return (
    <div className="stream-container" style={{ animationDelay: '0.1s' }}>
      <div className="stream-header">
        <div className="stream-title-group">
          <h2 className="panel-title">Live Broadcast</h2>
          <div className="stream-selector-container">
            <button className="stream-select-btn" onClick={() => setShowSelector(!showSelector)}>
              {activeStream.label} ▾
            </button>
            {showSelector && (
              <div className="stream-dropdown">
                {allStreams.map(stream => (
                  <button 
                    key={stream.id} 
                    className={`stream-option ${activeStream.id === stream.id ? 'active' : ''}`}
                    onClick={() => { setActiveStream(stream); setShowSelector(false); }}
                  >
                    {stream.label}
                  </button>
                ))}
                <div style={{ borderTop: '1px solid #333', margin: '4px 8px 0', paddingTop: '4px' }}>
                  <button className="stream-option" style={{ color: '#ffcc00', padding: '6px 8px' }} onClick={handleAddCustomStream}>
                    + Add Custom Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="stream-badges">
          <span className="badge-live" style={{ color: '#ff3344', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '10px' }}>●</span> LIVE
          </span>
          <span className="badge-lang">{activeStream.lang}</span>
        </div>
      </div>
      <div className="video-wrapper">
        <iframe
          src={`https://www.youtube.com/embed/${activeStream.id}?autoplay=1&mute=1`}
          title={`CrowdStrike 24 Hours of Spa - ${activeStream.label}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
      <div className="stream-footer">
        <p className="stream-description">
          {activeStream.type === 'main' ? 'Official GT World Challenge Europe Powered by AWS Stream' : 'Live Onboard Camera Feed'}
        </p>
      </div>
    </div>
  );
};

export default StreamViewer;
