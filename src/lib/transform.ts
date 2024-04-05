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
    mat4.multiply(transformationMatrix, transformationMatrix, translationBackFromCenter);
    mat4.multiply(transformationMatrix, transformationMatrix, scaleMatrix);
    mat4.multiply(transformationMatrix, transformationMatrix, rotationMatrix);
    mat4.multiply(transformationMatrix, transformationMatrix, translationToCenter);
    mat4.multiply(transformationMatrix, transformationMatrix, translationMatrix);

    const vec = vec3.fromValues(point.x, point.y, 0);
    vec3.transformMat4(vec, vec, transformationMatrix);
    return { ...point, x: vec[0], y: vec[1] };
}


export function transformSquare(square: Square): Square {
    const centerX = square.start.x + square.sideLength / 2;
    const centerY = square.start.y + square.sideLength / 2;
    const center = { x: centerX, y: centerY, z: 0 };
    const bl = applyEffect({ x: square.start.x, y: square.start.y, z: 0, color: square.vertices.bl.color, type:'point' }, square.effect, center as Point);
    const tl = applyEffect({ x: square.start.x, y: square.start.y + square.sideLength, z: 0, color: square.vertices.tl.color, type:'point' }, square.effect, center as Point);
    const tr = applyEffect({ x: square.start.x + square.sideLength, y: square.start.y + square.sideLength, z: 0, color: square.vertices.tr.color, type:'point' }, square.effect, center as Point);
    const br = applyEffect({ x: square.start.x + square.sideLength, y: square.start.y, z: 0, color: square.vertices.br.color, type:'point' }, square.effect, center as Point);
    const sideLength = square.sideLength * (square.effect?.scale || 1);
    const start = applyEffect(square.start, square.effect, center as Point);

    return { ...square, start, sideLength, vertices: { bl, tl, tr, br } };
}

export function transformRectangle(rectangle: Rectangle): Rectangle {
    const centerX = rectangle.start.x + rectangle.width / 2;
    const centerY = rectangle.start.y + rectangle.height / 2;
    const center = { x: centerX, y: centerY, z: 0 };

    const bl = applyEffect({ x: rectangle.start.x, y: rectangle.start.y, z: 0, color: rectangle.vertices.bl.color, type:'point' }, rectangle.effect, center as Point);
    const tl = applyEffect({ x: rectangle.start.x, y: rectangle.start.y + rectangle.height, z: 0, color: rectangle.vertices.tl.color, type:'point' }, rectangle.effect, center as Point);
    const tr = applyEffect({ x: rectangle.start.x + rectangle.width, y: rectangle.start.y + rectangle.height, z: 0, color: rectangle.vertices.tr.color, type:'point' }, rectangle.effect, center as Point);
    const br = applyEffect({ x: rectangle.start.x + rectangle.width, y: rectangle.start.y, z: 0, color: rectangle.vertices.br.color, type:'point' }, rectangle.effect, center as Point);

    const width = rectangle.width * (rectangle.effect?.scale || 1);
    const height = rectangle.height * (rectangle.effect?.scale || 1);

    const start = applyEffect(rectangle.start, rectangle.effect, center as Point);

    return { ...rectangle, start, width, height, vertices: { bl, tl, tr, br } };
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