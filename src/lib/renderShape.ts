import { Line, Square, Rectangle, Polygon } from "@/types/Shapes";

export function renderLine(
    gl: WebGLRenderingContext,
    line: Line,
    positionBuffer: WebGLBuffer,
    positionAttributeLocation: number
) {
    const x1 = line.start.x;
    const y1 = line.start.y;
    const x2 = line.end.x;
    const y2 = line.end.y;

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([x1, y1, x2, y2]),
        gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINES, 0, 2);
}

export function renderSquare(
    gl: WebGLRenderingContext,
    square: Square,
    positionBuffer: WebGLBuffer,
    positionAttributeLocation: number
) {}

export function renderRectangle(
    gl: WebGLRenderingContext,
    rectangle: Rectangle,
    positionBuffer: WebGLBuffer,
    positionAttributeLocation: number
) {}

export function renderPolygon(
    gl: WebGLRenderingContext,
    polygon: Polygon,
    positionBuffer: WebGLBuffer,
    positionAttributeLocation: number
) {}
