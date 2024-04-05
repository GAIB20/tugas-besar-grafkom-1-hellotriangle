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
    effect: Transformation;
}

type Square = {
    id: string;
    type: 'square';
    start: Point;
    sideLength: number;
    vertices: {
        tl: Point;
        tr: Point;
        bl: Point;
        br: Point;
    };
    effect: Transformation;
}

type Rectangle = {
    id: string;
    type: 'rectangle';
    start: Point;
    width: number;
    height: number;
    vertices: {
        tl: Point;
        tr: Point;
        bl: Point;
        br: Point;
    };
    effect: Transformation;
}

type Polygon = {
    id: string;
    type: 'polygon';
    vertices: Point[];
    effect: Transformation;
}

type Shape = Line | Square | Rectangle | Polygon;

export type { Color, Point, Shape, Line, Square, Rectangle, Polygon, Transformation }

// To specify which shape a vertex belongs to
export type VertexWithShape = {
    vertex: Point,
    shape: Shape
}

export function getVertexWithShapes(shape: Shape): VertexWithShape[] {
    if (shape.type === "line") {
        return [
            {
                vertex: shape.start,
                shape: shape
            },
            {
                vertex: shape.end,
                shape: shape
            }
        ]
    } else if (shape.type === "square") {
        return [
            {
                vertex: shape.start,
                shape: shape
            },
            {
                vertex: {...shape.start, x: shape.start.x + shape.sideLength },
                shape: shape
            },
            {
                vertex: {...shape.start, y: shape.start.y + shape.sideLength},
                shape: shape
            },
            {
                vertex: {...shape.start, x: shape.start.x + shape.sideLength, y: shape.start.y + shape.sideLength},
                shape: shape
            }
        ]
    } else if (shape.type === "rectangle") {
        return [
            {
                vertex: shape.start,
                shape: shape
            },
            {
                vertex: {...shape.start, x: shape.start.x + shape.width },
                shape: shape
            },
            {
                vertex: {...shape.start, y: shape.start.y + shape.height},
                shape: shape
            },
            {
                vertex: {...shape.start, x: shape.start.x + shape.width, y: shape.start.y + shape.height},
                shape: shape
            }
        ]
    }
    else if (shape.type === "polygon") {
        return shape.vertices.map((vertex) => ({
            vertex: vertex,
            shape: shape
        }))
    }
    return []
}