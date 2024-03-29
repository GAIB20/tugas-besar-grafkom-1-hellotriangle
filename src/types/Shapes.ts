type Color = {
    r: number;
    g: number;
    b: number;
    a: number;
}

type Transformation = {
    dx: number;
    dy: number;
    rotate: number;
    scale: number;
}

type Point = {
    type: 'point'
    x: number;
    y: number;
    z: 0;
    color: Color;
}

type Line = {
    id: string;
    type: 'line';
    start: Point
    end: Point;
    color: Color;
    effect?: Transformation;
}

type Square = {
    id: string;
    type: 'square';
    start: Point;
    sideLength: number;
    color: Color;
    effect?: Transformation;
}

type Rectangle = {
    id: string;
    type: 'rectangle';
    start: Point;
    width: number;
    height: number;
    color: Color;
    effect?: Transformation;
}

type Polygon = {
    id: string;
    type: 'polygon';
    vertices: Point[];
    edges: Line[];
    color: Color;
    effect?: Transformation;
}

type Shape = Line | Square | Rectangle | Polygon;

export type { Color, Point, Shape, Line, Square, Rectangle, Polygon, Transformation }