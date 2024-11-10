import { useRef, useState, useEffect } from "react";
import '@styles/DrawingBoard.css';
import { useFunctionTogether, useStateTogether } from "react-together";
import { interpolate_line } from "@hooks";
import { SessionManager } from 'react-together';
import { jsPDF } from "jspdf";
import { loadPdf } from './pdf'; // Import the loadPdf function

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

export function DrawingBoard() {
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [pdfBackground, setPdfBackground] = useState(null); // State to store PDF background
    const [color, setColor] = useState("black");
    const [lineWidth, setLineWidth] = useState(5);
    const [lines, setLines] = useStateTogether<Line[]>('all_of_the_lines', []);
    const [line, setLine] = useState<Line | null>(null);
    const canvasRef = useRef(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    var num_points = 0;
    const MOD = 3;

    useEffect(() => {
        if (context === null) {
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
            
            // Draw PDF background if it's loaded
            if (pdfBackground) {
                contextRef.current.drawImage(pdfBackground, 0, 0, canvasRef.current.width, canvasRef.current.height);
            }

            // Draw all lines
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

            contextRef.current.lineCap = "round";
            contextRef.current.strokeStyle = color;
            contextRef.current.lineWidth = lineWidth;
        }
    }, [color, lineWidth, lines, pdfBackground]); // Include pdfBackground as a dependency

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
    };

    const finishDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.closePath();
        setIsDrawing(false);

        const p = {
            coords: { x: offsetX, y: offsetY },
            color: color,
            lineWidth: lineWidth,
        };
        line.points.push(p);
        setLines([...lines, line]);
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
        setPdfBackground(null); // Clear the PDF background when clearing the canvas
    });

    const generatePDF = () => {
        const doc = new jsPDF();
        const canvasImage = canvasRef.current.toDataURL("image/png");
        doc.addImage(canvasImage, 'PNG', 10, 10, 190, 160);
        doc.save('drawing-board.pdf');
    };

    // Handle PDF file upload
    const handlePdfUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const canvas = await loadPdf(file); // Load PDF and get the canvas
                setPdfBackground(canvas); // Set the canvas as the background
            } catch (error) {
                console.error("Error loading PDF:", error);
            }
        }
    };

    return (
        <div>
            <div className="toolbar">
                <label>
                    Upload PDF:
                    <input type="file" onChange={handlePdfUpload} />
                </label>
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
                <button onClick={generatePDF}>Download as PDF</button> {/* Add PDF button */}
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
};

export default DrawingBoard;
