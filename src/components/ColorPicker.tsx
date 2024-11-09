import React from 'react';
import './ColorPicker.css';

interface ColorPickerProps {
  isOpen: boolean;
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

const COLORS = [
  '#000000', '#666666', '#999999', '#FFFFFF',
  '#FFEB3B', '#4CAF50', '#00BCD4', '#2196F3',
  '#9C27B0', '#E91E63', '#F44336', '#FF9800'
];

const ColorPicker: React.FC<ColorPickerProps> = ({ isOpen, onColorSelect, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="color-picker-overlay" onClick={onClose} />
      <div className="color-picker-dropdown">
        <div className="color-grid">
          {COLORS.map((color) => (
            <button
              key={color}
              className="color-option"
              style={{ backgroundColor: color }}
              onClick={() => {
                onColorSelect(color);
                onClose();
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ColorPicker;