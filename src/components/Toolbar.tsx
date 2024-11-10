import React from 'react';
import { Pencil, Square, Eraser } from 'lucide-react';
import './Whiteboard.css';

interface ToolbarProps {
  color: string;
  setColor: (color: string) => void;
  lineWidth: number;
  setLineWidth: (width: number) => void;
  onClear: () => void;
}

export function Toolbar({ color, setColor, lineWidth, setLineWidth, onClear }: ToolbarProps) {
  const sizeOptions = [
    { size: 2, class: 'small' },
    { size: 5, class: 'medium' },
    { size: 10, class: 'large' }
  ];
  
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <div className="size-controls">
          {sizeOptions.map((option) => (
            <button
              key={option.size}
              onClick={() => setLineWidth(option.size)}
              className={`size-btn ${option.class} ${lineWidth === option.size ? 'active' : ''}`}
              aria-label={`Set line width to ${option.size}`}
            />
          ))}
        </div>
      </div>
      
      <div className="toolbar-center">
        <div className="drawing-tools">
          <button className="tool-btn active" aria-label="Pencil tool">
            <Pencil size={24} />
          </button>
          <button className="tool-btn" aria-label="Square tool">
            <Square size={24} />
          </button>
          <button className="tool-btn" aria-label="Eraser tool">
            <Eraser size={24} />
          </button>
        </div>
      </div>
      
      <div className="toolbar-right flex items-center">
        <div className="color-picker-container mr-4">
          <button className="color-picker-button">
            <div className="color-preview" style={{ backgroundColor: color }}>
              <input
                type="color"
                className="opacity-0 w-full h-full cursor-pointer"
                onChange={(e) => setColor(e.target.value)}
                value={color}
                aria-label="Color picker"
              />
            </div>
          </button>
        </div>
        <button 
          onClick={onClear}
          className="tool-btn"
          aria-label="Clear canvas"
        >
          Clear
        </button>
      </div>
    </div>
  );
}