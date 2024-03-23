import { Line, Square, Rectangle, Polygon } from "@/types/Shapes";

export function renderLine(
    gl: WebGLRenderingContext,
    line: Line,
    coordinatesAttributePointer: number,
    uColor:  WebGLUniformLocation,
    scaleUniform: WebGLUniformLocation
) {
    const vertices = new Float32Array([
        line.start.x, line.start.y,
        line.end.x, line.end.y,
    ]);
    adjustHorizontalStretch(gl, vertices)

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(coordinatesAttributePointer, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coordinatesAttributePointer);
    gl.uniform4f(uColor, line.color.r / 255, line.color.g / 255, line.color.b / 255, line.color.a);
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
    const x1 = square.start.x
    const y1 = square.start.y;
    const x2 = x1 + square.sideLength
    const y2 = y1;
    const x3 = x1
    const y3 = y1 + square.sideLength;
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
    gl.uniform4f(uColor, square.color.r / 255, square.color.g / 255, square.color.b / 255, square.color.a);
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
    adjustHorizontalStretch(gl, vertices)

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(coordinatesAttributePointer, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coordinatesAttributePointer);
    gl.uniform4f(uColor, rectangle.color.r / 255, rectangle.color.g / 255, rectangle.color.b / 255, rectangle.color.a);
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