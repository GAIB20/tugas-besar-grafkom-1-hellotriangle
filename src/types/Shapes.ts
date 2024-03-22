type Point = {
    type: 'point'
    x: number;
    y: number;
    color: string;
}

type Line = {
    type: 'line';
    id: string;
    start: Point
    end: Point;
    color: string;
}

type Square = {
    type: 'square';
    id: string;
    start: Point;
    sideLength: number;
    color: string;
}

type Rectangle = {
    type: 'rectangle';
    id: string;
    start: Point;
    width: number;
    height: number;
    color: string;
}

type Polygon = {
    type: 'polygon';
    id: string;
    vertices: Point[];
    color: string;
}

type Shape = Line | Square | Rectangle | Polygon;

export type { Point, Shape, Line, Square, Rectangle, Polygon }