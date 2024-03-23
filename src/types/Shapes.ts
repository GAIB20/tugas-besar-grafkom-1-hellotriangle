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
    type: 'line';
    id: string;
    start: Point
    end: Point;
    color: Color;
}

type Square = {
    type: 'square';
    id: string;
    start: Point;
    sideLength: number;
    color: Color;
}

type Rectangle = {
    type: 'rectangle';
    id: string;
    start: Point;
    width: number;
    height: number;
    color: Color;
}

type Polygon = {
    type: 'polygon';
    id: string;
    vertices: Point[];
    color: Color;
}

type Shape = Line | Square | Rectangle | Polygon;

export type { Color, Point, Shape, Line, Square, Rectangle, Polygon }