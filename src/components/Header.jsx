import React, { useState, useEffect } from 'react';
import { Settings, Maximize, Bell, Clock, Timer } from 'lucide-react';
import './Header.css';

const RACE_START = new Date('2026-06-27T16:30:00+02:00'); // Race starts at 16:30 CEST

const Header = ({ visiblePanels, setVisiblePanels }) => {
  const [time, setTime] = useState(new Date());
  const [raceState, setRaceState] = useState('PRE-RACE');
  const [countdown, setCountdown] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleExportProfile = () => {
    const profile = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('panel-state-') || key === 'dashboard-visible-panels') {
        profile[key] = localStorage.getItem(key);
      }
    }
    profile['dashboard-visible-panels'] = JSON.stringify(visiblePanels);

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "dashboard-profile.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportProfile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const profile = JSON.parse(e.target.result);
        Object.keys(profile).forEach(key => {
          if (key.startsWith('panel-state-') || key === 'dashboard-visible-panels') {
            localStorage.setItem(key, profile[key]);
          }
        });
        window.location.reload();
      } catch (err) {
        alert("Invalid profile file!");
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);

      const diff = RACE_START - now;
      const hours24 = 24 * 60 * 60 * 1000;

      if (diff > 0) {
        setRaceState('PRE-RACE');
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setCountdown(`T- ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      } else if (diff <= 0 && diff > -hours24) {
        setRaceState('LIVE');
        const elapsed = Math.abs(diff);
        const rem = hours24 - elapsed;
        const h = Math.floor(rem / (1000 * 60 * 60));
        const m = Math.floor((rem / 1000 / 60) % 60);
        const s = Math.floor((rem / 1000) % 60);
        setCountdown(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} REMAINING`);
      } else {
        setRaceState('FINISHED');
        setCountdown('00:00:00');
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Europe/Brussels'
    });
  };

  return (
    <header className="glass-panel header-container animate-fade-in">
      <div className="header-left">
        <div className="logo-container">
          <div className="logo-mock">
            <span className="logo-accent">24H</span>
            <span className="logo-text">SPA</span>
          </div>
          <div className="event-info">
            <h1 className="event-title">CrowdStrike 24 Hours of Spa</h1>
            <span className="event-subtitle">GT World Challenge Europe</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="session-status">
          <div className={`status-indicator ${raceState === 'LIVE' ? 'active' : 'pre'}`}></div>
          <span className="status-text">{raceState === 'LIVE' ? 'RACE - LIVE' : raceState}</span>
        </div>
        
        <div className="countdown-timer">
          <Timer size={16} className="time-icon" />
          <span className="countdown-text">{countdown}</span>
        </div>

        <div className="local-time">
          <Clock size={16} className="time-icon" />
          <span>Local Time: {formatTime(time)} (CEST)</span>
        </div>
      </div>

      <div className="header-right" style={{ position: 'relative' }}>
        <button className="action-btn" title="Notifications">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>
        <button 
          className="action-btn" 
          title="Settings"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={20} />
        </button>
        <button 
          className="action-btn" 
          title="Fullscreen"
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
              });
            } else {
              if (document.exitFullscreen) {
                document.exitFullscreen();
              }
            }
          }}
        >
          <Maximize size={20} />
        </button>

        {showSettings && visiblePanels && (
          <div className="settings-dropdown">
            <h3>Visible Panels</h3>
            <div className="panel-toggle-list">
              {Object.keys(visiblePanels).map((panelKey) => (
                <label key={panelKey} className="panel-toggle-item">
                  <input 
                    type="checkbox" 
                    checked={visiblePanels[panelKey]}
                    onChange={() => {
                      setVisiblePanels(prev => ({
                        ...prev,
                        [panelKey]: !prev[panelKey]
                      }));
                    }}
                  />
                  {panelKey.charAt(0).toUpperCase() + panelKey.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
              ))}
            </div>
            
            <div className="profile-actions" style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                onClick={handleExportProfile} 
                style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Export Layout Profile
              </button>
              <label 
                style={{ padding: '0.4rem', background: 'var(--accent-color)', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', textAlign: 'center', fontSize: '0.8rem' }}
              >
                Import Layout Profile
                <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportProfile} />
              </label>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
