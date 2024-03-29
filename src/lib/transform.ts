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
    mat4.multiply(transformationMatrix, translationMatrix, translationToCenter);
    mat4.multiply(transformationMatrix, transformationMatrix, rotationMatrix);
    mat4.multiply(transformationMatrix, transformationMatrix, translationBackFromCenter);
    mat4.multiply(transformationMatrix, transformationMatrix, scaleMatrix);

    const vec = vec3.fromValues(point.x, point.y, 0);
    vec3.transformMat4(vec, vec, transformationMatrix);
    return { ...point, x: vec[0], y: vec[1] };
}


export function transformSquare(square: Square): Square {
    const centerX = square.start.x + square.sideLength / 2;
    const centerY = square.start.y + square.sideLength / 2;
    const center = { x: centerX, y: centerY, z: 0 };

    const start = applyEffect(square.start, square.effect, center as Point);
    const sideLength = square.sideLength * (square.effect?.scale || 1);

    return { ...square, start, sideLength };
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
    const vertices = polygon.vertices.map((vertex) => applyEffect(vertex, polygon.effect));
    const edges = polygon.edges.map((edge) => transformLine(edge));
    return { ...polygon, vertices, edges };
}

export function transformLine(line: Line): Line {
    const start = applyEffect(line.start, line.effect);
    const end = applyEffect(line.end, line.effect);
    return { ...line, start, end };
}