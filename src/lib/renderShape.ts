import { Line, Square, Rectangle, Polygon, Color } from "@/types/Shapes";
import { transformLine, transformPolygon, transformRectangle, transformSquare } from "./transform";
import { convexHull } from "./convexHull";
import earcut from 'earcut';

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
    square = transformSquare(square)
    // Calculate center
    // const color = square.start.color;
    // const centerX = square.start.x + square.sideLength / 2;
    // const centerY = square.start.y + square.sideLength / 2;
    // const center = { type: 'point', x: centerX, y: centerY, z: 0, color: color };

    // // Transform vertices
    // const x1 = square.start.x
    // const y1 = square.start.y;
    // const x2 = x1 + square.sideLength
    // const y2 = y1;  
    // const x3 = x1
    // const y3 = y1 + square.sideLength;
    // const x4 = x2
    // const y4 = y3;

    // const vertex1: Point = {type: 'point', x: x1, y: y1, z: 0, color: color};
    // const vertex2: Point = {type: 'point', x: x2, y: y2, z: 0, color: color};
    // const vertex3: Point = {type: 'point', x: x3, y: y3, z: 0, color: color};
    // const vertex4: Point = {type: 'point', x: x4, y: y4, z: 0, color: color};

    // const final1 = applyEffect(vertex1, square.effect, center as Point);
    // const final2 = applyEffect(vertex2, square.effect, center as Point);
    // const final3 = applyEffect(vertex3, square.effect, center as Point);
    // const final4 = applyEffect(vertex4, square.effect, center as Point);

    // const finalX1 = final1.x;
    // const finalY1 = final1.y;
    // const finalX2 = final2.x;
    // const finalY2 = final2.y;
    // const finalX3 = final3.x;
    // const finalY3 = final3.y;
    // const finalX4 = final4.x;
    // const finalY4 = final4.y;

    
    // const verticesUncolored = [finalX1, finalY1, finalX2, finalY2, finalX3, finalY3, finalX4, finalY4]
    const verticesUncolored = [square.final[0].x, square.final[0].y, square.final[1].x, square.final[1].y, square.final[2].x, square.final[2].y, square.final[3].x, square.final[3].y]
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

function tessellatePolygon(polygon: Polygon) {
    const vertices = polygon.vertices.flatMap(vertex => [vertex.x, vertex.y]);
    
    // Assuming no holes for simplicity
    const trianglesIndices = earcut(vertices);

    const triangles = [];
    for (let i = 0; i < trianglesIndices.length; i += 3) {
        triangles.push([
            polygon.vertices[trianglesIndices[i]],
            polygon.vertices[trianglesIndices[i + 1]],
            polygon.vertices[trianglesIndices[i + 2]]
        ]);
    }

    return triangles;
}

export function renderPolygon(
    gl: WebGLRenderingContext,
    polygon: Polygon,
    coordinatesAttributePointer: number,
    scaleUniform: WebGLUniformLocation,
    vertexColorLocation: number,
    polygonMode: 'convex' | 'free'
) {
    const transformedPolygon = transformPolygon(polygon);
    const vertices: number[] = []

    const colors = polygon.vertices.flatMap(vertex => [vertex.color.r / 255.0, vertex.color.g / 255.0, vertex.color.b / 255.0]);

    if (polygonMode === 'convex') {
        transformedPolygon.vertices = convexHull([transformedPolygon]);
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
    } else {
        // Tessellate the polygon for rendering
        const triangles = tessellatePolygon(transformedPolygon);

        triangles.forEach(triangle => {
            const flatVertices: number[] = [];
            const colors: Color[] = [];

            triangle.forEach(vertex => {
                const currentVertex = [vertex.x, vertex.y]
                adjustHorizontalStretch(gl, currentVertex)
                flatVertices.push(...currentVertex);
                colors.push({r: vertex.color.r / 255.0, g: vertex.color.g / 255.0, b: vertex.color.b / 255.0, a: 1.0});
            });

            const vertexBuffer = new Float32Array(flatVertices);
            const colorBuffer = new Float32Array(colors.flatMap(color => [color.r, color.g, color.b, color.a]));

            const vBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertexBuffer, gl.STATIC_DRAW);
            gl.vertexAttribPointer(coordinatesAttributePointer, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(coordinatesAttributePointer);

            const cBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, colorBuffer, gl.STATIC_DRAW);
            gl.vertexAttribPointer(vertexColorLocation, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(vertexColorLocation);

            gl.uniform1f(scaleUniform, 0.05);
            gl.drawArrays(gl.TRIANGLES, 0, 3);

            gl.deleteBuffer(vBuffer);
            gl.deleteBuffer(cBuffer);
        });
    }
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