import { Point, Line } from "@components/drawing";

function interpolate(point1: Point, point2: Point): Point {
    const t = 0.5;
    const x = point1.coords.x + t * (point2.coords.x - point1.coords.x);
    const y = point1.coords.y + t * (point2.coords.y - point1.coords.y);

    const p: Point = {
        coords: { x: x, y: y },
    }
    return p;
}

function interpolate_line(line: Line): Line {
    const new_line: Line = {
        points: [],
        color: line.color,
        lineWidth: line.lineWidth,
    }
    for (let i = 0; i < line.points.length - 1; i++) {
        const p1 = line.points[i];
        const p2 = line.points[i + 1];
        new_line.points.push(p1);
        new_line.points.push(interpolate(p1, p2));
    }
    new_line.points.push(line.points[line.points.length - 1]);

    return new_line;
}

export default interpolate_line;
