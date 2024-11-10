import { useRef, useState, useEffect } from "react";
import '@styles/DrawingBoard.css';
import { useFunctionTogether, useStateTogether } from "react-together";
import { interpolate_line } from "@hooks";
import { SessionManager } from 'react-together';
import { Session } from "inspector/promises";
import { useConnectedUsers } from 'react-together'
import { useJoinUrl } from 'react-together'
import { useAuth } from '../context/AuthContext'; // Import useAuth to access the logout function

export type Coords = {
    x: number,
    y: number
};

export type Point = {
    coords: Coords,
};

export type Line = {
    points: Point[],
    color: string,
    lineWidth: number,
};

export function DrawingBoard() {
    const { logout } = useAuth(); // Access logout function
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const canvasRef = useRef(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("black");
    const [lineWidth, setLineWidth] = useState(5);
    const joinUrl = useJoinUrl()
    const [lines, setLines] = useStateTogether<Line[]>('all_of_the_lines', []);
    const [line, setLine] = useState<Line | null>(null);
    const connectedUsers = useConnectedUsers()
  const currentUser = connectedUsers.find((user) => user.isYou);
  const [drawerStack, setDrawerStack] = useStateTogether<string[]>('drawerStack',[]);
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

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);

        const p = {
            coords: { x: offsetX, y: offsetY },
            color: color,
            lineWidth: lineWidth,
        };

        const l: Line = {
            points: [p],
            color: color,
            lineWidth: lineWidth,
        };
        setLine(l);

        if (currentUser) {
            // Add to the stack only if the user is not already in it
            setDrawerStack((prevStack) => {
              if (!prevStack.includes(currentUser.name)) {
                return [...prevStack, currentUser.name];  // Add user only if not already in stack
              }
              return prevStack;  // If already in stack, do nothing
            });
          }
    };

    const finishDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.closePath();
        setIsDrawing(false);

        if (line) {
            const p = {
                coords: { x: offsetX, y: offsetY },
                color: color,
                lineWidth: lineWidth,
            };
            line.points.push(p);
            setLines([...lines, line]);
        }
        setLine(null);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();

        if (num_points % MOD === 0) {
            const p = {
                coords: { x: offsetX, y: offsetY },
                color: color,
                lineWidth: lineWidth,
            };
            line.points.push(p);
        }
        num_points++;
    };

    const clearCanvas = useFunctionTogether('clear', () => {
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setLines([]);
    });

    const handleBoxClick = (drawerName: string) => {
        setDrawerStack((prevStack) => prevStack.filter((name) => name !== drawerName)); // Remove from the stack when clicked
      };
    
      let sessionUrl = ''; // Global or higher scope

      
    return (
        <div>

{drawerStack.map((drawer, index) => (
        <div
          key={index}
          onClick={() => handleBoxClick(drawer)} // Remove from stack when clicked
          style={{
            position: 'absolute',
            top: `${10 + index * 40}px`, // Stack boxes vertically
            right: '10px',
            backgroundColor: '#28a745',
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#fff',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
          }}
        >
          {drawer} has a doubt
        </div>
      ))}
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
                        onChange={(e) => setLineWidth(Number(e.target.value))}
                        value={lineWidth}
                    />
                </label>
                <button onClick={() => clearCanvas()}>Clear</button>
                <button
  onClick={() => {
    const newTab = window.open(joinUrl, '_blank');
  }}
>
  Connect to a new session!
</button>

            </div>

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
}

export default DrawingBoard;
