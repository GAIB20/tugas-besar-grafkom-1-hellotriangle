import { Line, Square, Rectangle, Polygon } from "@/types/Shapes";
import { transformLine, transformRectangle, transformSquare } from "./transform";

export function renderLine(
    gl: WebGLRenderingContext,
    line: Line,
    coordinatesAttributePointer: number,
    uColor:  WebGLUniformLocation,
    scaleUniform: WebGLUniformLocation
) {
    const transformedLine = transformLine(line);
    const vertices = new Float32Array([
        transformedLine.start.x, transformedLine.start.y,
        transformedLine.end.x, transformedLine.end.y,
    ]);
    adjustHorizontalStretch(gl, vertices)

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(coordinatesAttributePointer, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coordinatesAttributePointer);
    gl.uniform4f(uColor, transformedLine.color.r / 255, transformedLine.color.g / 255, transformedLine.color.b / 255, transformedLine.color.a);
    gl.uniform1f(scaleUniform, 0.05);
    gl.drawArrays(gl.LINES, 0, 2);
    gl.deleteBuffer(buffer);

}

export function renderSquare(
    gl: WebGLRenderingContext,
    square: Square,
    coordinatesAttributePointer: number,
    uColor: WebGLUniformLocation,
    scaleUniform: WebGLUniformLocation
) {
    const transformedSquare = transformSquare(square);
    const x1 = transformedSquare.start.x
    const y1 = transformedSquare.start.y;
    const x2 = x1 + transformedSquare.sideLength
    const y2 = y1;
    const x3 = x1
    const y3 = y1 + transformedSquare.sideLength;
    const x4 = x2
    const y4 = y3;
    const vertices = new Float32Array([
        x1, y1, x2, y2, x3, y3,
        x3, y3, x2, y2, x4, y4
    ]);
    adjustHorizontalStretch(gl, vertices)

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(coordinatesAttributePointer, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coordinatesAttributePointer);
    gl.uniform4f(uColor, transformedSquare.color.r / 255, transformedSquare.color.g / 255, transformedSquare.color.b / 255, transformedSquare.color.a);
    gl.uniform1f(scaleUniform, 0.05);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.deleteBuffer(buffer);
}

export function renderRectangle(
    gl: WebGLRenderingContext,
    rectangle: Rectangle,
    coordinatesAttributePointer: number,
    uColor: WebGLUniformLocation,
    scaleUniform: WebGLUniformLocation
) {
    const transformedRectangle = transformRectangle(rectangle);
    const x1 = transformedRectangle.start.x;
    const y1 = transformedRectangle.start.y;
    const x2 = x1 + transformedRectangle.width;
    const y2 = y1;
    const x3 = x1;
    const y3 = y1 + transformedRectangle.height;
    const x4 = x2;
    const y4 = y3;
    const vertices = new Float32Array([
        x1, y1, x2, y2, x3, y3,
        x3, y3, x2, y2, x4, y4
    ]);
    adjustHorizontalStretch(gl, vertices)

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(coordinatesAttributePointer, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coordinatesAttributePointer);
    gl.uniform4f(uColor, transformedRectangle.color.r / 255, transformedRectangle.color.g / 255, transformedRectangle.color.b / 255, transformedRectangle.color.a);
    gl.uniform1f(scaleUniform, 0.05);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.deleteBuffer(buffer);
}

export function renderPolygon(
    gl: WebGLRenderingContext,
    polygon: Polygon,
    coordinatesAttributePointer: number,
    uColor: WebGLUniformLocation,
    scaleUniform: WebGLUniformLocation
) {
    const vert: number[] = [];
        polygon.vertices.forEach(vertex => {
          vert.push(vertex.x, vertex.y);
        });

    const vertices = new Float32Array(vert);
    adjustHorizontalStretch(gl, vertices);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(coordinatesAttributePointer, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coordinatesAttributePointer);
    gl.uniform4f(uColor, polygon.color.r / 255, polygon.color.g / 255, polygon.color.b / 255, polygon.color.a);
    gl.uniform1f(scaleUniform, 0.05);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, polygon.vertices.length);
    gl.deleteBuffer(buffer);
}

/**
 * Since our canvas is rectangular but the coordinate system in OpenGL starts from -1 to 1, 
 * which is square shaped, the x coordinate was stretched by OpenGL to make sure the width is
 * equal to the height in our coordinate system. This makes the shapes look a bit distorted.
 * A quick fix is to unstretch it so they will look like the intended shapes
 */
function adjustHorizontalStretch(gl: WebGLRenderingContext, vertices: Float32Array) {
    const horizontalStretch = gl.canvas.width / gl.canvas.height
    vertices.forEach((_, index) => {
        if (index % 2 === 0) {
            vertices[index] /= horizontalStretch
        }
    })
}