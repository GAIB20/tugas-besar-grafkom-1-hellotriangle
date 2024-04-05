import { Point, Transformation, Line, Square, Rectangle, Polygon } from '@/types/Shapes';
import { mat4, vec3 } from 'gl-matrix';

export function createTranslationMatrix(dx: number, dy: number, dz: number): mat4 {
    const m: mat4 = mat4.create();
    mat4.set(m,
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      dx, dy, dz, 1
    );
    return m;
}

export function createRotationMatrix(angle: number, axis: 'x' | 'y' | 'z'): mat4 {
    const rad = Math.PI / 180 * angle;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const m = mat4.create();

    switch (axis) {
        case 'x':
            mat4.set(m,
                1, 0, 0, 0,
                0, cos, -sin, 0,
                0, sin, cos, 0,
                0, 0, 0, 1
            );
            break;
        case 'y':
            mat4.set(m,
                cos, 0, sin, 0,
                0, 1, 0, 0,
                -sin, 0, cos, 0,
                0, 0, 0, 1
            );
            break;
        case 'z':
            mat4.set(m,
                cos, -sin, 0, 0,
                sin, cos, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            );
            break;
        default:
            throw new Error(`Unknown rotation axis: ${axis}`);
    }

    return m;
}

export function createScaleMatrix(sx: number, sy: number, sz: number): mat4 {
    const m = mat4.create();
    mat4.set(m,
        sx, 0, 0, 0,
        0, sy, 0, 0,
        0, 0, sz, 0,
        0, 0, 0, 1
    );
    return m;
}

export function applyEffect(point: Point, effect?: Transformation, center?: Point): Point {
    if (!effect) {
        return point;
    }
    const { dx, dy, rotate, scale } = effect;

    // If a center is provided, calculate translation to center before rotation
    const translationToCenter = center ? createTranslationMatrix(-center.x, -center.y, 0) : mat4.create();
    const translationMatrix = createTranslationMatrix(dx, dy, 0);
    const rotationMatrix = createRotationMatrix(rotate, 'z');
    const scaleMatrix = createScaleMatrix(scale, scale, 1);

    // Translate back from center after rotation if center was provided
    const translationBackFromCenter = center ? createTranslationMatrix(center.x, center.y, 0) : mat4.create();

    const transformationMatrix = mat4.create();
    mat4.multiply(transformationMatrix, rotationMatrix, translationToCenter);
    mat4.multiply(transformationMatrix, translationMatrix, transformationMatrix);
    mat4.multiply(transformationMatrix, translationBackFromCenter, transformationMatrix);
    mat4.multiply(transformationMatrix, scaleMatrix, transformationMatrix);

    const vec = vec3.fromValues(point.x, point.y, 0);
    vec3.transformMat4(vec, vec, transformationMatrix);
    return { ...point, x: vec[0], y: vec[1] };
}


export function transformSquare(square: Square): Square {
    const color = square.start.color;
    const centerX = square.final[0].x + square.sideLength / 2;
    const centerY = square.final[0].y + square.sideLength / 2;
    const center = { type: 'point', x: centerX, y: centerY, z: 0, color: color };

    // Transform vertices
    const x1 = square.final[0].x;
    const y1 = square.final[0].y;
    const x2 = square.final[1].x;
    const y2 = square.final[1].y;  
    const x3 = square.final[2].x;
    const y3 = square.final[2].y;
    const x4 = square.final[3].x;
    const y4 = square.final[3].y;

    const vertex1: Point = {type: 'point', x: x1, y: y1, z: 0, color: color};
    const vertex2: Point = {type: 'point', x: x2, y: y2, z: 0, color: color};
    const vertex3: Point = {type: 'point', x: x3, y: y3, z: 0, color: color};
    const vertex4: Point = {type: 'point', x: x4, y: y4, z: 0, color: color};

    const final1 = applyEffect(vertex1, square.effect, center as Point);
    const final2 = applyEffect(vertex2, square.effect, center as Point);
    const final3 = applyEffect(vertex3, square.effect, center as Point);
    const final4 = applyEffect(vertex4, square.effect, center as Point);

    const final = [final1, final2, final3, final4]

    const sideLength = square.sideLength * (square.effect?.scale || 1);

    return { ...square, start: final1, final, sideLength };
}

export function transformRectangle(rectangle: Rectangle): Rectangle {
    const centerX = rectangle.start.x + rectangle.width / 2;
    const centerY = rectangle.start.y + rectangle.height / 2;
    const center = { x: centerX, y: centerY, z: 0 };

    const start = applyEffect(rectangle.start, rectangle.effect, center as Point);
    const width = rectangle.width * (rectangle.effect?.scale || 1);
    const height = rectangle.height * (rectangle.effect?.scale || 1);

    return { ...rectangle, start, width, height };
}

export function transformPolygon(polygon: Polygon): Polygon {
    const centerX = polygon.vertices.reduce((acc, vertex) => acc + vertex.x, 0) / polygon.vertices.length;
    const centerY = polygon.vertices.reduce((acc, vertex) => acc + vertex.y, 0) / polygon.vertices.length;
    const center = { x: centerX, y: centerY, z: 0 };
    const vertices = polygon.vertices.map((vertex) => applyEffect(vertex, polygon.effect, center as Point));
    return { ...polygon, vertices };
}

export function transformLine(line: Line): Line {
    const center = { x: (line.start.x + line.end.x) / 2, y: (line.start.y + line.end.y) / 2, z: 0 };
    const start = applyEffect(line.start, line.effect, center as Point);
    const end = applyEffect(line.end, line.effect, center as Point);
    return { ...line, start, end };
}