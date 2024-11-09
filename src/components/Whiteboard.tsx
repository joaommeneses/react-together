import React, { useEffect, useRef } from 'react';
import { useStateTogether } from 'react-together';

type DrawPoint = { x: number; y: number };

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useStateTogether('isDrawing', false);
  const [color, setColor] = useStateTogether('color', 'black');
  const [lineWidth, setLineWidth] = useStateTogether('lineWidth', 5);
  const [drawPath, setDrawPath] = useStateTogether('drawPath', [] as DrawPoint[][]); // Array of lines

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round'; // Makes line ends rounded
        contextRef.current = context;
      }
    }
  }, []);

  // Draw all lines in drawPath
  useEffect(() => {
    if (contextRef.current && canvasRef.current) {
      const context = contextRef.current;
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      context.strokeStyle = color;
      context.lineWidth = lineWidth;

      drawPath.forEach((line) => {
        context.beginPath(); // Start a new path for each line
        line.forEach((point, index) => {
          if (index === 0) {
            context.moveTo(point.x, point.y);
          } else {
            context.lineTo(point.x, point.y);
          }
        });
        context.stroke();
      });
    }
  }, [drawPath, color, lineWidth]);

  const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
    const { offsetX, offsetY } = nativeEvent;
    setIsDrawing(true);
    // Start a new line
    setDrawPath((paths) => [...paths, [{ x: offsetX, y: offsetY }]]);
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

  const draw = ({ nativeEvent }: React.MouseEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const newPoint: DrawPoint = { x: offsetX, y: offsetY };

    // Append new point to the latest line in drawPath
    setDrawPath((paths) => {
      const updatedPaths = [...paths];
      const currentLine = [...updatedPaths[updatedPaths.length - 1], newPoint];
      updatedPaths[updatedPaths.length - 1] = currentLine;
      return updatedPaths;
    });

    // Draw point in real-time without re-rendering the entire drawPath
    const context = contextRef.current;
    if (context) {
      const currentLine = drawPath[drawPath.length - 1];
      const prevPoint = currentLine[currentLine.length - 1];

      context.beginPath();
      context.moveTo(prevPoint.x, prevPoint.y);
      context.lineTo(offsetX, offsetY);
      context.stroke();
    }
  };

  const clearCanvas = () => {
    if (contextRef.current && canvasRef.current) {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setDrawPath([]); // Clear the synchronized drawing path
    }
  };

  return (
    <div>
      <div className="toolbar">
        <label>
          Brush Color:
          <input
            type="color"
            onChange={(e) => setColor(e.target.value)}
            value={color}
          />
        </label>
        <label>
          Brush Size:
          <input
            type="range"
            min="1"
            max="20"
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
            value={lineWidth}
          />
        </label>
        <button onClick={clearCanvas}>Clear</button>
      </div>
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