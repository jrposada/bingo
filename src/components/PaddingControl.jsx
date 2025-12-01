import React, { useRef, useCallback } from 'react';
import './PaddingControl.css';

const PaddingControl = ({ 
  paddingTop, 
  paddingRight, 
  paddingBottom, 
  paddingLeft,
  onPaddingChange,
  isVisible = true,
  maxPadding = 200
}) => {
  if (!isVisible) return null;

  const draggingRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const startValueRef = useRef(0);

  const handleMouseDown = useCallback((edge, currentValue, e) => {
    e.preventDefault();
    draggingRef.current = edge;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    startValueRef.current = currentValue;

    const handleMouseMove = (moveEvent) => {
      if (!draggingRef.current) return;

      const deltaX = moveEvent.clientX - startPosRef.current.x;
      const deltaY = moveEvent.clientY - startPosRef.current.y;
      
      let newValue = startValueRef.current;
      
      switch (draggingRef.current) {
        case 'top':
          newValue = startValueRef.current + deltaY;
          break;
        case 'right':
          newValue = startValueRef.current - deltaX;
          break;
        case 'bottom':
          newValue = startValueRef.current - deltaY;
          break;
        case 'left':
          newValue = startValueRef.current + deltaX;
          break;
      }

      newValue = Math.max(0, Math.min(maxPadding, Math.round(newValue)));
      onPaddingChange(draggingRef.current, newValue);
    };

    const handleMouseUp = () => {
      draggingRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onPaddingChange, maxPadding]);

  return (
    <div className="padding-control-overlay">
      {/* Top edge control */}
      <div 
        className="padding-edge-control top"
        style={{ 
          top: 0,
          left: `${paddingLeft}px`,
          right: `${paddingRight}px`,
          height: `${Math.max(20, paddingTop)}px`
        }}
        onMouseDown={(e) => handleMouseDown('top', paddingTop, e)}
      >
        <span className="padding-value">{paddingTop}px</span>
      </div>

      {/* Right edge control */}
      <div 
        className="padding-edge-control right"
        style={{ 
          top: `${paddingTop}px`,
          right: 0,
          bottom: `${paddingBottom}px`,
          width: `${Math.max(20, paddingRight)}px`
        }}
        onMouseDown={(e) => handleMouseDown('right', paddingRight, e)}
      >
        <span className="padding-value">{paddingRight}px</span>
      </div>

      {/* Bottom edge control */}
      <div 
        className="padding-edge-control bottom"
        style={{ 
          bottom: 0,
          left: `${paddingLeft}px`,
          right: `${paddingRight}px`,
          height: `${Math.max(20, paddingBottom)}px`
        }}
        onMouseDown={(e) => handleMouseDown('bottom', paddingBottom, e)}
      >
        <span className="padding-value">{paddingBottom}px</span>
      </div>

      {/* Left edge control */}
      <div 
        className="padding-edge-control left"
        style={{ 
          top: `${paddingTop}px`,
          left: 0,
          bottom: `${paddingBottom}px`,
          width: `${Math.max(20, paddingLeft)}px`
        }}
        onMouseDown={(e) => handleMouseDown('left', paddingLeft, e)}
      >
        <span className="padding-value">{paddingLeft}px</span>
      </div>

      {/* Corner resize handles */}
      <div className="corner-handle top-left" style={{ top: 0, left: 0 }} />
      <div className="corner-handle top-right" style={{ top: 0, right: 0 }} />
      <div className="corner-handle bottom-left" style={{ bottom: 0, left: 0 }} />
      <div className="corner-handle bottom-right" style={{ bottom: 0, right: 0 }} />
    </div>
  );
};

export default PaddingControl;
