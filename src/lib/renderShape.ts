import { Line, Square, Rectangle, Polygon } from "@/types/Shapes";

export function renderLine(
    gl: WebGLRenderingContext,
    line: Line,
    uColor:  WebGLUniformLocation,
) {
    const vertices = new Float32Array([
        line.start.x, line.start.y,
        line.end.x, line.end.y,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Set the color uniform
    gl.uniform4f(uColor, line.color.r / 255, line.color.g / 255, line.color.b / 255, line.color.a);

    gl.drawArrays(gl.LINES, 0, 2);
}

export function renderSquare(
    gl: WebGLRenderingContext,
    square: Square,
    uColor: WebGLUniformLocation
) {
    const x1 = square.start.x;
    const y1 = square.start.y;
    const x2 = x1 + square.sideLength;
    const y2 = y1;
    const x3 = x1;
    const y3 = y1 + square.sideLength;
    const x4 = x2;
    const y4 = y3;
    const vertices = new Float32Array([
        x1, y1, x2, y2, x3, y3,
        x3, y3, x2, y2, x4, y4
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.uniform4f(uColor, square.color.r / 255, square.color.g / 255, square.color.b / 255, square.color.a);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

export function renderRectangle(
    gl: WebGLRenderingContext,
    rectangle: Rectangle,
    uColor: WebGLUniformLocation
) {
    const x1 = rectangle.start.x;
    const y1 = rectangle.start.y;
    const x2 = x1 + rectangle.width;
    const y2 = y1;
    const x3 = x1;
    const y3 = y1 + rectangle.height;
    const x4 = x2;
    const y4 = y3;
    const vertices = new Float32Array([
        x1, y1, x2, y2, x3, y3,
        x3, y3, x2, y2, x4, y4
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.uniform4f(uColor, rectangle.color.r / 255, rectangle.color.g / 255, rectangle.color.b / 255, rectangle.color.a);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

export function renderPolygon(
    gl: WebGLRenderingContext,
    polygon: Polygon,
    uColor: WebGLUniformLocation
) {}
