import { Line, Square, Rectangle, Polygon, Point } from "@/types/Shapes";
import { transformLine, transformPolygon, transformRectangle, transformSquare } from "./transform";

export function renderLine(
    gl: WebGLRenderingContext,
    line: Line,
    coordinatesAttributePointer: number,
    scaleUniform: WebGLUniformLocation,
    vertexColorLocation: number
) {
    const transformedLine = transformLine(line);
    const verticesUncolored = [
        transformedLine.start.x, transformedLine.start.y,
        transformedLine.end.x, transformedLine.end.y,
    ];
    
    adjustHorizontalStretch(gl, verticesUncolored)

    const colors = [
        line.start.color.r / 255.0, line.start.color.g / 255.0, line.start.color.b / 255.0,
        line.end.color.r / 255.0, line.end.color.g / 255.0, line.end.color.b / 255.0
    ]

    const vertices = new Float32Array([
        verticesUncolored[0], verticesUncolored[1],  // Vertex 1 position
        verticesUncolored[2], verticesUncolored[3],  // Vertex 2 position
        colors[0], colors[1], colors[2],             // Vertex 1 color
        colors[3], colors[4], colors[5]              // Vertex 2 color
    ]);
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    // Set up attribute pointers for position and color
    gl.vertexAttribPointer(coordinatesAttributePointer, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribPointer(vertexColorLocation, 3, gl.FLOAT, false, 0, 4 * Float32Array.BYTES_PER_ELEMENT); // Offset for color data
    

    gl.enableVertexAttribArray(coordinatesAttributePointer);
    gl.enableVertexAttribArray(vertexColorLocation);
    
    gl.uniform1f(scaleUniform, 0.05);
    gl.drawArrays(gl.LINES, 0, 2);
    gl.deleteBuffer(buffer);

}

export function renderSquare(
    gl: WebGLRenderingContext,
    square: Square,
    coordinatesAttributePointer: number,
    scaleUniform: WebGLUniformLocation,
    vertexColorLocation: number
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
    
    const verticesUncolored = [x1, y1, x2, y2, x3, y3, x4, y4]
    adjustHorizontalStretch(gl, verticesUncolored)

    // Colors for each vertex
    const colors = [
        square.vertexColors.bl.r / 255.0, square.vertexColors.bl.g / 255.0, square.vertexColors.bl.b / 255.0, // 4
        square.vertexColors.br.r / 255.0, square.vertexColors.br.g / 255.0, square.vertexColors.br.b / 255.0, // 3
        square.vertexColors.tl.r / 255.0, square.vertexColors.tl.g / 255.0, square.vertexColors.tl.b / 255.0, // 1
        square.vertexColors.br.r / 255.0, square.vertexColors.br.g / 255.0, square.vertexColors.br.b / 255.0, // 3
        square.vertexColors.tr.r / 255.0, square.vertexColors.tr.g / 255.0, square.vertexColors.tr.b / 255.0, // 2 
        square.vertexColors.tl.r / 255.0, square.vertexColors.tl.g / 255.0, square.vertexColors.tl.b / 255.0, // 2
    ]

    // Combine position and color data
    const vertices = new Float32Array([
        verticesUncolored[0], verticesUncolored[1], colors[0], colors[1], colors[2],  // 1
        verticesUncolored[2], verticesUncolored[3], colors[3], colors[4], colors[5],  // 2
        verticesUncolored[4], verticesUncolored[5], colors[6], colors[7], colors[8],  // 3
        verticesUncolored[2], verticesUncolored[3], colors[9], colors[10], colors[11], // 2
        verticesUncolored[6], verticesUncolored[7], colors[12], colors[13], colors[14], // 4
        verticesUncolored[4], verticesUncolored[5], colors[15], colors[16], colors[17] // 3
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(coordinatesAttributePointer, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(vertexColorLocation, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

    gl.enableVertexAttribArray(coordinatesAttributePointer);
    gl.enableVertexAttribArray(vertexColorLocation);

    gl.uniform1f(scaleUniform, 0.05);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.deleteBuffer(buffer);
}

export function renderRectangle(
    gl: WebGLRenderingContext,
    rectangle: Rectangle,
    coordinatesAttributePointer: number,
    scaleUniform: WebGLUniformLocation,
    vertexColorLocation: number
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

    const verticesUncolored = [x1, y1, x2, y2, x3, y3, x4, y4]
    adjustHorizontalStretch(gl, verticesUncolored)

    // Colors for each vertex
    const colors = [
        rectangle.vertexColors.bl.r / 255.0, rectangle.vertexColors.bl.g / 255.0, rectangle.vertexColors.bl.b / 255.0, // 4
        rectangle.vertexColors.br.r / 255.0, rectangle.vertexColors.br.g / 255.0, rectangle.vertexColors.br.b / 255.0, // 3
        rectangle.vertexColors.tl.r / 255.0, rectangle.vertexColors.tl.g / 255.0, rectangle.vertexColors.tl.b / 255.0, // 1
        rectangle.vertexColors.br.r / 255.0, rectangle.vertexColors.br.g / 255.0, rectangle.vertexColors.br.b / 255.0, // 3
        rectangle.vertexColors.tr.r / 255.0, rectangle.vertexColors.tr.g / 255.0, rectangle.vertexColors.tr.b / 255.0, // 2 
        rectangle.vertexColors.tl.r / 255.0, rectangle.vertexColors.tl.g / 255.0, rectangle.vertexColors.tl.b / 255.0, // 2
    ]

    // Combine position and color data
    const vertices = new Float32Array([
        verticesUncolored[0], verticesUncolored[1], colors[0], colors[1], colors[2],  // 1
        verticesUncolored[2], verticesUncolored[3], colors[3], colors[4], colors[5],  // 2
        verticesUncolored[4], verticesUncolored[5], colors[6], colors[7], colors[8],  // 3
        verticesUncolored[2], verticesUncolored[3], colors[9], colors[10], colors[11], // 2
        verticesUncolored[6], verticesUncolored[7], colors[12], colors[13], colors[14], // 4
        verticesUncolored[4], verticesUncolored[5], colors[15], colors[16], colors[17] // 3
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(coordinatesAttributePointer, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(vertexColorLocation, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

    gl.enableVertexAttribArray(coordinatesAttributePointer);
    gl.enableVertexAttribArray(vertexColorLocation);

    gl.uniform1f(scaleUniform, 0.05);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.deleteBuffer(buffer);
}

export function renderPolygon(
    gl: WebGLRenderingContext,
    polygon: Polygon,
    coordinatesAttributePointer: number,
    scaleUniform: WebGLUniformLocation,
    vertexColorLocation: number
) {
    const transformedPolygon = transformPolygon(polygon);
    const vertices: number[] = []

    const colors = polygon.vertices.flatMap(vertex => [vertex.color.r / 255.0, vertex.color.g / 255.0, vertex.color.b / 255.0]);

    // Sort vertices in counter-clockwise order
    function calculateCentroid(vertices: Point[]) {
        const centroid = { x: 0, y: 0 };
        vertices.forEach(vertex => {
            centroid.x += vertex.x;
            centroid.y += vertex.y;
        });
        centroid.x /= vertices.length;
        centroid.y /= vertices.length;
        return centroid;
    }

    function sortVertices(vertices: Point[]) {
        const centroid = calculateCentroid(vertices);
        vertices.sort((a, b) => {
            const angleA = Math.atan2(a.y - centroid.y, a.x - centroid.x);
            const angleB = Math.atan2(b.y - centroid.y, b.x - centroid.x);
            return angleA - angleB;
        });
        return vertices;
    }

    transformedPolygon.vertices = sortVertices(transformedPolygon.vertices);

    transformedPolygon.vertices.forEach((vertex, i) => {
        const currentVertex = [vertex.x, vertex.y]
        adjustHorizontalStretch(gl, currentVertex)
        vertices.push(...currentVertex);
        for (let j = 0; j < 3; j++) {
            vertices.push(colors[i * 3 + j]);
        }
    });

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(coordinatesAttributePointer, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(vertexColorLocation, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

    gl.enableVertexAttribArray(coordinatesAttributePointer);
    gl.enableVertexAttribArray(vertexColorLocation);

    gl.uniform1f(scaleUniform, 0.05);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, transformedPolygon.vertices.length);
    gl.deleteBuffer(buffer);
}

/**
 * Since our canvas is rectangular but the coordinate system in OpenGL starts from -1 to 1, 
 * which is square shaped, the x coordinate was stretched by OpenGL to make sure the width is
 * equal to the height in our coordinate system. This makes the shapes look a bit distorted.
 * A quick fix is to unstretch it so they will look like the intended shapes
 */
function adjustHorizontalStretch(gl: WebGLRenderingContext, vertices: Float32Array | number[]) {
    const horizontalStretch = gl.canvas.width / gl.canvas.height
    
    vertices.forEach((_, index) => {
        if (index % 2 === 0) {
            vertices[index] /= horizontalStretch
        }
    })
}