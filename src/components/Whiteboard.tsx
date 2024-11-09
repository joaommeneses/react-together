import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Pencil, Eraser, Trash2 } from 'lucide-react';
import { useStateTogether } from 'react-together';
import ColorPicker from './ColorPicker';
import './Whiteboard.css';

type DrawPoint = { x: number; y: number };
type DrawSettings = {
  color: string;
  lineWidth: number;
  tool: 'pencil' | 'eraser';
};

const PENCIL_SIZES = [2, 5, 10];
const ERASER_SIZES = [8, 20, 40];

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useStateTogether('isDrawing', false);
  const [drawPath, setDrawPath] = useStateTogether('drawPath', [] as DrawPoint[][]);
  const [pathSettings, setPathSettings] = useStateTogether('pathSettings', []);
  const [isColorPickerOpen, setIsColorPickerOpen] = useStateTogether('isColorPickerOpen', false);

  // Group color, lineWidth, and tool into a single state object for easier management
  const [currentSettings, setCurrentSettings] = useStateTogether('currentSettings', {
    color: '#000000',
    lineWidth: PENCIL_SIZES[1],
    tool: 'pencil'
  });


  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.scale(window.devicePixelRatio, window.devicePixelRatio);
        context.lineCap = 'round';
        contextRef.current = context;
      }
    }
  }, []);

  useEffect(() => {
    if (contextRef.current && canvasRef.current) {
      const context = contextRef.current;
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      
      context.clearRect(0, 0, rect.width, rect.height);

      drawPath.forEach((line, index) => {
        const settings = pathSettings[index];
        context.beginPath();
        context.strokeStyle = settings.tool === 'eraser' ? 'white' : settings.color;
        context.lineWidth = settings.lineWidth;

        line.forEach((point, pointIndex) => {
          if (pointIndex === 0) {
            context.moveTo(point.x, point.y);
          } else {
            context.lineTo(point.x, point.y);
          }
        });
        context.stroke();
      });
    }
  }, [drawPath, pathSettings]);

  const getMousePos = (canvas: HTMLCanvasElement, evt: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (evt.clientX - rect.left) / (scaleX / window.devicePixelRatio),
      y: (evt.clientY - rect.top) / (scaleY / window.devicePixelRatio)
    };
  };

  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const { x, y } = getMousePos(canvasRef.current, nativeEvent);
    
    setIsDrawing(true);
    setDrawPath((paths) => [...paths, [{ x, y }]]);
    setPathSettings((settings) => [...settings, { ...currentSettings }]);
  };

  const finishDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);
    // Synchronize the drawn line only when the user stops drawing
    // Note: Here, we trigger synchronization once the user stops
    const currentLine = drawPath[drawPath.length - 1];
    setDrawPath((prevDrawPath) => [...prevDrawPath, currentLine]); // Add the finished line

    // Sync logic can be placed here (e.g., send the line to a server or store)
    console.log("Line synchronized:", currentLine); // Example for synchronization
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const { x, y } = getMousePos(canvasRef.current, nativeEvent);
    
    setDrawPath((paths) => {
      const updatedPaths = [...paths];
      const currentLine = [...updatedPaths[updatedPaths.length - 1], { x, y }];
      updatedPaths[updatedPaths.length - 1] = currentLine;
      return updatedPaths;
    });
  };

  const clearCanvas = () => {
    if (contextRef.current && canvasRef.current) {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setDrawPath([]); // Clear the synchronized drawing path
      setPathSettings([]);
    }    
  };

  const getSizeButtons = () => {
    const sizes = currentSettings.tool === 'pencil' ? PENCIL_SIZES : ERASER_SIZES;
    return sizes.map((size, index) => (
      <button 
        key={size}
        className={`size-btn ${index === 0 ? 'small' : index === 1 ? 'medium' : 'large'} ${currentSettings.lineWidth === size ? 'active' : ''}`}
        onClick={() => setCurrentSettings(prev => ({ ...prev, lineWidth: size }))}
      />
    ));
  };

  return (
    <div className="whiteboard-container">
      <header className="header">
        <div className="header-top">
          <button className="back-button">
            <ArrowLeft size={24} />
          </button>
          <h1>Class 1</h1>
        </div>
        
        <div className="toolbar">
          <div className="toolbar-left">
            <div className="size-controls">
              {getSizeButtons()}
              <button className="clear-btn" onClick={clearCanvas}>
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          <div className="toolbar-center">
            <div className="drawing-tools">
              <button 
                className={`tool-btn ${currentSettings.tool === 'pencil' ? 'active' : ''}`}
                onClick={() => {
                  setCurrentSettings(prev => ({
                    ...prev,
                    tool: 'pencil',
                    lineWidth: PENCIL_SIZES[1]
                  }));
                }}
              >
                <Pencil size={24} />
              </button>
              <button 
                className={`tool-btn ${currentSettings.tool === 'eraser' ? 'active' : ''}`}
                onClick={() => {
                  setCurrentSettings(prev => ({
                    ...prev,
                    tool: 'eraser',
                    lineWidth: ERASER_SIZES[1]
                  }));
                }}
              >
                <Eraser size={24} />
              </button>
            </div>
          </div>

          <div className="toolbar-right">
            {currentSettings.tool === 'pencil' && (
              <div className="color-picker-container">
                <button 
                  className="color-picker-button"
                  onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                >
                  <div 
                    className="color-preview" 
                    style={{ backgroundColor: currentSettings.color }} 
                  />
                </button>
                <ColorPicker
                  isOpen={isColorPickerOpen}
                  onColorSelect={(color) => setCurrentSettings(prev => ({ ...prev, color }))}
                  onClose={() => setIsColorPickerOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseLeave={finishDrawing}
        className="drawing-board"
      />
    </div>
  );
};

export default Whiteboard;