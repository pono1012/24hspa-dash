import React, { useState } from 'react';
import './StreamViewer.css';

const STREAMS = [
  { id: '8Hxnx2cKFFk', label: 'Main Stream (DE)', type: 'main', lang: 'DE' },
  { id: '1bbj47g_FOs', label: 'Main Stream (EN)', type: 'main', lang: 'EN' }
];

const StreamViewer = () => {
  const [activeStream, setActiveStream] = useState(STREAMS[0]);
  const [showSelector, setShowSelector] = useState(false);

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
                {STREAMS.map(stream => (
                  <button 
                    key={stream.id} 
                    className={`stream-option ${activeStream.id === stream.id ? 'active' : ''}`}
                    onClick={() => { setActiveStream(stream); setShowSelector(false); }}
                  >
                    {stream.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="stream-badges">
          <span className="badge-live">WAITING</span>
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
