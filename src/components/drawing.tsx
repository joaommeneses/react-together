import { useRef, useState, useEffect } from "react";
import '@styles/DrawingBoard.css'
import { ArrowLeft, Pencil, Eraser, Trash2 } from 'lucide-react';
import { useFunctionTogether, useStateTogether } from "react-together";
import { interpolate_line } from "@hooks";
import { SessionManager } from 'react-together';
import { Session } from "inspector/promises";
import { Header } from './Header';
import { Toolbar } from './Toolbar';
import { Canvas } from './Canvas';
import './Whiteboard.css';
import ColorPicker from "./ColorPicker";


export type Coords = {
x: number,
y: number
}

export type Point = {
coords: Coords,
}

export type Line = {
points: Point[],
color: string,
lineWidth: number,
}

const PENCIL_SIZES = [2, 5, 10];
const ERASER_SIZES = [8, 20, 40];

export function DrawingBoard() {

const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
const canvasRef = useRef(null);
const contextRef = useRef<CanvasRenderingContext2D | null>(null);
const [isDrawing, setIsDrawing] = useState(false);
const [color, setColor] = useState("black");
const [lineWidth, setLineWidth] = useState(5);
const [lines, setLines] = useStateTogether<Line[]>('all_of_the_lines', []);
const [line, setLine] = useState<Line | null>(null);
const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
var num_points = 0;
const MOD = 3;


useEffect(() => {
    if (context === null) {
        setLines([]);
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const context: CanvasRenderingContext2D = canvas.getContext("2d");
        context.lineCap = "round";
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        contextRef.current = context;
        setContext(context);
    } else {
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        lines.forEach((line) => {
            const new_line = interpolate_line(line);
            contextRef.current.beginPath();
            contextRef.current.strokeStyle = new_line.color;
            contextRef.current.lineWidth = new_line.lineWidth;
            for (let i = 0; i < new_line.points.length - 1; i++) {
                const p1 = new_line.points[i];
                const p2 = new_line.points[i + 1];
                contextRef.current.moveTo(p1.coords.x, p1.coords.y);
                contextRef.current.lineTo(p2.coords.x, p2.coords.y);
                contextRef.current.stroke();
            }
        });

        context.lineCap = "round";
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        contextRef.current = context;
        setContext(context);
    }
}, [color, lineWidth, lines]);

const [currentSettings, setCurrentSettings] = useState({
    color: '#000000',
    lineWidth: PENCIL_SIZES[1],
    tool: 'pencil'
  });

const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.strokeStyle = currentSettings.tool === 'eraser' ? "white" : currentSettings.color;
    contextRef.current.lineWidth = currentSettings.lineWidth;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);

    const p = {
        coords: { x: offsetX, y: offsetY },
        color: currentSettings.color,
        lineWidth: currentSettings.lineWidth,
    };

    const l: Line = {
        points: [p],
        color: currentSettings.color,
        lineWidth: currentSettings.lineWidth,
    }
    setLine(l);
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

const finishDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.strokeStyle = currentSettings.tool === 'eraser' ? "white" : currentSettings.color;
    contextRef.current.closePath();
    setIsDrawing(false);

    const p = {
        coords: { x: offsetX, y: offsetY },
        color: currentSettings.color,
        lineWidth: currentSettings.lineWidth,
    };
    line.points.push(p);
    setLines([...lines, line]);
    setLine(null);
};

const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;

    contextRef.current.strokeStyle = currentSettings.tool === 'eraser' ? "white" : currentSettings.color;
    contextRef.current.lineWidth = currentSettings.lineWidth;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    if (num_points % MOD == 0) {
        const p = {
            coords: { x: offsetX, y: offsetY },
            color: currentSettings.color,
            lineWidth: currentSettings.lineWidth,
        };
        line.points.push(p);
    }
    num_points++;
};

const clearCanvas = useFunctionTogether('clear', () => {
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setLines([]);
});

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
                    color: 'white',
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
        <SessionManager />
    </div>
);
};

export default DrawingBoard;