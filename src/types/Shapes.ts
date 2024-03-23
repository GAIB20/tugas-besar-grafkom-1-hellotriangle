type Color = {
    r: number;
    g: number;
    b: number;
    a: number;
}

type Point = {
    type: 'point'
    x: number;
    y: number;
    color: Color;
}

type Line = {
    id: string;
    type: 'line';
    start: Point
    end: Point;
    color: Color;
}

type Square = {
    id: string;
    type: 'square';
    start: Point;
    sideLength: number;
    color: Color;
}

type Rectangle = {
    id: string;
    type: 'rectangle';
    start: Point;
    width: number;
    height: number;
    color: Color;
}

type Polygon = {
    id: string;
    type: 'polygon';
    vertices: Point[];
    edges: Line[];
    color: Color;
}

type Shape = Line | Square | Rectangle | Polygon;

export type { Color, Point, Shape, Line, Square, Rectangle, Polygon }