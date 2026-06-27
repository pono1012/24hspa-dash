import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { GripHorizontal, ExternalLink } from 'lucide-react';
import './DraggablePanel.css';

const DraggablePanel = ({ children, title, defaultSize, defaultPosition, zIndexOffset = 0 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [zIndex, setZIndex] = useState(10 + zIndexOffset);

  const storageKey = `panel-state-${title.replace(/\s+/g, '-').toLowerCase()}`;
  
  // Read initial state from localStorage or use defaults
  const getInitialState = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to load panel state", e);
    }
    return { position: defaultPosition, size: defaultSize };
  };

  const [initialState] = useState(getInitialState);

  // Bring to front on interaction
  const bringToFront = () => {
    setZIndex(prev => prev + 100); 
  };

  const saveState = (updates) => {
    try {
      const current = JSON.parse(localStorage.getItem(storageKey) || '{}');
      localStorage.setItem(storageKey, JSON.stringify({ ...current, ...updates }));
    } catch (e) {
      console.warn("Failed to save panel state", e);
    }
  };

  return (
    <Rnd
      default={{
        ...initialState.position,
        ...initialState.size,
      }}
      minWidth={300}
      minHeight={200}
      bounds="parent"
      cancel=".panel-content-area"
      dragGrid={[20, 20]}
      resizeGrid={[20, 20]}
      onDragStart={() => {
        setIsDragging(true);
        bringToFront();
      }}
      onDragStop={(e, d) => {
        setIsDragging(false);
        saveState({ position: { x: d.x, y: d.y } });
      }}
      onResizeStart={bringToFront}
      onResizeStop={(e, direction, ref, delta, position) => {
        saveState({
          size: { width: ref.style.width, height: ref.style.height },
          position: position
        });
      }}
      style={{ zIndex }}
      className={`rnd-wrapper ${isDragging ? 'dragging' : ''}`}
    >
      <div className="glass-panel draggable-panel">
        <div className="panel-drag-handle">
          <div className="drag-handle-left">
            <GripHorizontal size={16} className="drag-icon" />
            <span className="drag-title">{title}</span>
          </div>
          {(title === 'Live Timing' || title === 'Race Control') && (
            <button 
              className="external-popup-btn" 
              onClick={() => window.open('https://www.timing71.org/timing/5a215fae-faec-4a7c-b0af-77c74dc03bb4', '_blank', 'width=1200,height=800')}
              title="Open Timing71 (External)"
              style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '0 5px' }}
            >
              <ExternalLink size={14} />
            </button>
          )}
        </div>
        <div className="panel-content-area">
          {children}
          {/* Visual Resize Handle Indicator */}
          <div className="panel-resize-indicator"></div>
        </div>
      </div>
    </Rnd>
  );
};

export default DraggablePanel;
