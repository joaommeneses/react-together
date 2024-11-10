export interface Coords {
    x: number;
    y: number;
  }
  
  export interface Point {
    coords: Coords;
  }
  
  export interface Line {
    points: Point[];
    color: string;
    lineWidth: number;
  }