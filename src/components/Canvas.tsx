import React, { useRef, useEffect, useCallback } from 'react';
import { Line, Point } from '../types/index.js';

interface CanvasProps {
  context: CanvasRenderingContext2D | null;
  setContext: (context: CanvasRenderingContext2D) => void;
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
  color: string;
  lineWidth: number;
  line: Line | null;
  setLine: (line: Line | null) => void;
  lines: Line[];
  setLines: (lines: Line[]) => void;
}

export function Canvas({
  context,
  setContext,
  isDrawing,
  setIsDrawing,
  color,
  lineWidth,
  line,
  setLine,
  lines,
  setLines,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  let numPoints = 0;
  const MOD = 3;

  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    contextRef.current = ctx;
    setContext(ctx);
  }, [color, lineWidth, setContext]);

  useEffect(() => {
    initializeCanvas();
    
    const handleResize = () => {
      initializeCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initializeCanvas]);

  useEffect(() => {
    if (!contextRef.current) return;
    contextRef.current.strokeStyle = color;
    contextRef.current.lineWidth = lineWidth;
  }, [color, lineWidth]);

  const getCoordinates = (event: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in event) {
      const touch = event.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!contextRef.current) return;

    const { x, y } = getCoordinates(e);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);

    const point: Point = {
      coords: { x, y }
    };

    const newLine: Line = {
      points: [point],
      color,
      lineWidth
    };
    setLine(newLine);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !contextRef.current || !line) return;
    
    const { x, y } = getCoordinates(e);
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();

    if (numPoints % MOD === 0) {
      const point: Point = {
        coords: { x, y }
      };
      setLine({ ...line, points: [...line.points, point] });
    }
    numPoints++;
  };

  const finishDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!contextRef.current || !line) return;
    
    const { x, y } = getCoordinates(e);
    contextRef.current.closePath();
    setIsDrawing(false);

    const point: Point = {
      coords: { x, y }
    };
    
    const updatedLine = {
      ...line,
      points: [...line.points, point]
    };
    
    setLines([...lines, updatedLine]);
    setLine(null);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      onMouseLeave={finishDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={finishDrawing}
      className="w-full h-full touch-none"
    />
  );
}