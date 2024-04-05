import { useEffect, useRef } from "react";
import { Point, Shape, VertexWithShape, getVertexWithShapes } from "@/types/Shapes";
import { renderLine, renderPolygon, renderRectangle, renderSquare } from "@/lib/renderShape";
import { initShaders } from "@/lib/shaders";
import { v4 as uuidv4 } from 'uuid';
import debounce from 'lodash/debounce';
import { transformLine, transformPolygon, transformRectangle, transformSquare } from "@/lib/transform";
import useSound from 'use-sound'
import bloop from '../assets/bloop.mp3'

interface CanvasProps {
  shapePanel: 'line' | 'square' | 'rectangle' | 'polygon';
  shapes: Shape[];
  setShapes: (shapes: Shape[]) => void;
  polygonMode: 'convex' | 'free';
}

export default function Canvas({ shapePanel, shapes, setShapes, polygonMode }: CanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [play] = useSound(bloop);

  const debouncedSetShapes = debounce(setShapes, 100);

  const drawShapes = (gl: WebGLRenderingContext, shapes: Shape[]) => {
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Initialize shader program
    const shaderProgram = initShaders(gl)

    if (!shaderProgram) {
      alert("Failed to initialize shader program")
      return;
    }

    // Attributes and uniforms
    const coordinates = gl.getAttribLocation(shaderProgram, 'coordinates');
    const scaleUniform = gl.getUniformLocation(shaderProgram, "scale");
    const vertexColorLocation = gl.getAttribLocation(shaderProgram, 'vertexColor')

    // Render the shapes
    shapes.forEach((shape) => {
      if (shape.type === "line") {
        renderLine(gl, shape, coordinates, scaleUniform!, vertexColorLocation)
      } else if (shape.type === "square") {
        renderSquare(gl, shape, coordinates, scaleUniform!, vertexColorLocation)
      } else if (shape.type === "rectangle") {
        renderRectangle(gl, shape, coordinates, scaleUniform!, vertexColorLocation)
      } else {
        renderPolygon(gl, shape, coordinates, scaleUniform!, vertexColorLocation, polygonMode)
      }
    });
  };

  useEffect(() => {
    // Redraw the shapes when the polygon mode changes
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const gl = canvas.getContext("webgl", { antialias: true });

      if (gl) {
        debouncedSetShapes([...shapes]);
        drawShapes(gl, shapes);
      }
    }
  }, [polygonMode])

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const gl = canvas.getContext("webgl", { antialias: true });

      if (gl) {
        // Consider the device pixel ratio for high-DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        gl.viewport(0, 0, canvas.width, canvas.height);

        drawShapes(gl, shapes);

        let isDraggingShape = false;
        let isDraggingVertex = false;
        let dragShapeId: string | null = null;
        let lastMousePos = { x: 0, y: 0 };
        let draggedVertexWithShape: VertexWithShape | null = null;
        let cornerDraggedForRect: 'tl' | 'tr' | 'bl' | 'br' | null = null;

        // Function to check if a mouse position is within a shape
        const hitTest = (mousePos: Point, shape: Shape) => {
          if (shape.type === "line") {
            const line = transformLine(shape);

            const hitTolerance = 1;
            const x0 = mousePos.x;
            const y0 = mousePos.y;

            const x1 = line.start.x;
            const y1 = line.start.y;
            const x2 = line.end.x;
            const y2 = line.end.y;

            // Calculate the line segment's length squared
            const lineLenSq = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);

            // Calculate the projection of the point onto the line segment
            const t = ((x0 - x1) * (x2 - x1) + (y0 - y1) * (y2 - y1)) / lineLenSq;

            // Check if the projection falls within the line segment
            if (t < 0 || t > 1) {
                const distToStartSq = (x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1);
                const distToEndSq = (x0 - x2) * (x0 - x2) + (y0 - y2) * (y0 - y2);
                return Math.sqrt(Math.min(distToStartSq, distToEndSq)) < hitTolerance;
            } else {
                const A = y2 - y1;
                const B = x1 - x2;
                const C = x2 * y1 - x1 * y2;
                const distance = Math.abs(A * x0 + B * y0 + C) / Math.sqrt(A * A + B * B);
                return distance < hitTolerance;
            }
          } else if (shape.type === "square") {
            const square = transformSquare(shape);
            const x = square.start.x;
            const y = square.start.y;
            const size = square.sideLength;
            return mousePos.x >= x && mousePos.x <= x + size && mousePos.y >= y && mousePos.y <= y + size;
          } else if (shape.type === "rectangle") {
            const rectangle = transformRectangle(shape);
            const x = rectangle.start.x;
            const y = rectangle.start.y;
            const width = rectangle.width;
            const height = rectangle.height;
            return mousePos.x >= x && mousePos.x <= x + width && mousePos.y >= y && mousePos.y <= y + height;
          } else {
            const polygon = transformPolygon(shape);
            const points = polygon.vertices
            let inside = false;
            for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
              const xi = points[i].x;
              const yi = points[i].y;
              const xj = points[j].x;
              const yj = points[j].y;
              const intersect = ((yi > mousePos.y) !== (yj > mousePos.y)) &&
                (mousePos.x < (xj - xi) * (mousePos.y - yi) / (yj - yi) + xi);
              if (intersect) inside = !inside;
            }
            return inside;
          }
        };

        const hitVertexTest = (mousePos: Point, vertex: Point) => {
          const hitTolerance = 0.5
          const dx = mousePos.x - vertex.x
          const dy = mousePos.y - vertex.y
          const distance = Math.sqrt(dx*dx + dy*dy)
          return distance < hitTolerance
        }

        const getCanvasMousePosition = (event: MouseEvent) => {
          const rect = canvas.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
      
          // Normalize mouse coordinates to range [0, 1]
          const normalizedX = x / rect.width;
          const normalizedY = y / rect.height;
      
          // Transform to range [-1, 1] with WebGL's origin (0,0) at the center
          const webGLX = normalizedX * 2 - 1;
          const webGLY = 1 - normalizedY * 2;
      
          // Adjust for the aspect ratio
          const uniformScale = 0.15;
          const aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
          const dpr = window.devicePixelRatio || 1;
          const adjustedX = webGLX * aspectRatio * dpr / uniformScale;
          const adjustedY = webGLY * dpr / uniformScale;
      
          return { x: adjustedX, y: adjustedY };
        };
      
        const mouseDownHandler = (event: MouseEvent) => {
          event.preventDefault();
          const vertexWithShape = shapes.slice().reverse().flatMap(shape => getVertexWithShapes(shape))
          const mousePos = getCanvasMousePosition(event) as Point;
          const hitVertexWithShape = vertexWithShape.find(vertexWithShape => hitVertexTest(mousePos, vertexWithShape.vertex))
          const hitShape = shapes.slice().reverse().find(shape => hitTest(mousePos, shape));

          if (hitVertexWithShape) {
            isDraggingVertex = true;
            draggedVertexWithShape = hitVertexWithShape;
            lastMousePos = mousePos;

            if (canvas.classList.contains("grabbable") || isDraggingVertex) {
              canvas.classList.remove("grabbable");
              canvas.classList.add("crosshair");
            }

          } else if (hitShape) {
            isDraggingShape = true;
            dragShapeId = hitShape.id;
            lastMousePos = mousePos;
            
            if (canvas.classList.contains("grabbable") || isDraggingShape) {
              canvas.classList.remove("grabbable");
              canvas.classList.add("grabbing");
            }
          }
        };

        const mouseMoveHandler = (event: MouseEvent) => {
          const mousePos = getCanvasMousePosition(event);
          const dx = mousePos.x - lastMousePos.x;
          const dy = mousePos.y - lastMousePos.y;

          if (isDraggingVertex && draggedVertexWithShape) {
            if (draggedVertexWithShape.shape.type === "line") {
              if (draggedVertexWithShape.vertex == draggedVertexWithShape.shape.start) {
                draggedVertexWithShape.shape.start.x = mousePos.x
                draggedVertexWithShape.shape.start.y = mousePos.y
              } else {
                draggedVertexWithShape.shape.end.x = mousePos.x
                draggedVertexWithShape.shape.end.y = mousePos.y
              }
            } else if (draggedVertexWithShape.shape.type === "square") {
              const square = draggedVertexWithShape.shape;
              if (draggedVertexWithShape.vertex === square.start || cornerDraggedForRect === 'bl') {
                  // Adjust bottom left vertex
                  cornerDraggedForRect = 'bl';
                  square.sideLength = Math.abs(mousePos.x - (square.start.x + square.sideLength));
                  square.start.x = mousePos.x;
                  square.start.y = mousePos.y;
              } else if ((draggedVertexWithShape.vertex.x === square.start.x + square.sideLength && draggedVertexWithShape.vertex.y === square.start.y) || cornerDraggedForRect === 'br') {
                  // Adjust bottom right vertex
                  cornerDraggedForRect = 'br';
                  square.sideLength = Math.abs(mousePos.x - square.start.x);
                  square.start.y = mousePos.y;
              } else if ((draggedVertexWithShape.vertex.x === square.start.x && draggedVertexWithShape.vertex.y === square.start.y + square.sideLength) || cornerDraggedForRect === 'tl') {
                  // Adjust top left vertex
                  cornerDraggedForRect = 'tl';
                  square.sideLength = Math.abs(mousePos.x - (square.start.x + square.sideLength));
                  square.start.x = mousePos.x;
                  square.start.y = mousePos.y - square.sideLength;
              } else {
                  // Adjust top right vertex
                  cornerDraggedForRect = 'tr';
                  square.sideLength = Math.abs(mousePos.x - square.start.x);
                  square.start.y = mousePos.y - square.sideLength;
              }
              
            } else if (draggedVertexWithShape.shape.type === "rectangle") {
              const rectangle = draggedVertexWithShape.shape;
              if (draggedVertexWithShape.vertex === rectangle.start || cornerDraggedForRect === 'bl') {
                  // Adjust bottom left vertex
                  cornerDraggedForRect = 'bl';
                  rectangle.width = Math.abs(mousePos.x - (rectangle.start.x + rectangle.width));
                  rectangle.height = Math.abs(mousePos.y - (rectangle.start.y + rectangle.height));
                  rectangle.start.x = mousePos.x;
                  rectangle.start.y = mousePos.y;
              } else if ((draggedVertexWithShape.vertex.x === rectangle.start.x + rectangle.width && draggedVertexWithShape.vertex.y === rectangle.start.y) || cornerDraggedForRect === 'br') {
                  // Adjust bottom right vertex
                  cornerDraggedForRect = 'br';
                  rectangle.width = Math.abs(mousePos.x - rectangle.start.x);
                  rectangle.height = Math.abs(mousePos.y - (rectangle.start.y + rectangle.height));
                  rectangle.start.y = mousePos.y;
              } else if ((draggedVertexWithShape.vertex.x === rectangle.start.x && draggedVertexWithShape.vertex.y === rectangle.start.y + rectangle.height) || cornerDraggedForRect === 'tl') {
                  // Adjust top left vertex
                  cornerDraggedForRect = 'tl';
                  rectangle.width = Math.abs(mousePos.x - (rectangle.start.x + rectangle.width));
                  rectangle.height = Math.abs(mousePos.y - rectangle.start.y);
                  rectangle.start.x = mousePos.x;
              } else {
                  // Adjust top right vertex
                  cornerDraggedForRect = 'tr';
                  rectangle.width = Math.abs(mousePos.x - rectangle.start.x);
                  rectangle.height = Math.abs(mousePos.y - rectangle.start.y);
                  rectangle.start.y = mousePos.y - rectangle.height;
              }

            } else if (draggedVertexWithShape.shape.type === "polygon") {
              draggedVertexWithShape.vertex.x += dx;
              draggedVertexWithShape.vertex.y += dy;
            }

            debouncedSetShapes([...shapes]);
            drawShapes(gl, shapes);
            lastMousePos = mousePos;
            return;
          }

          if (isDraggingShape) {
            // Update the position of the dragged shape
            const draggedShape = shapes.find(shape => shape.id === dragShapeId);
            if (draggedShape) {
              if (draggedShape.type === "line") {
                draggedShape.start.x += dx;
                draggedShape.start.y += dy;
                draggedShape.end.x += dx;
                draggedShape.end.y += dy;
              } else if (draggedShape.type === "square") {
                draggedShape.start.x += dx;
                draggedShape.start.y += dy;
              } else if (draggedShape.type === "rectangle") {
                draggedShape.start.x += dx;
                draggedShape.start.y += dy;
              } else {
                draggedShape.vertices = draggedShape.vertices.map(point => ({ x: point.x + dx, y: point.y + dy, color: point.color } as Point));
              }
              debouncedSetShapes([...shapes]);
              drawShapes(gl, shapes);
            }
  
            lastMousePos = mousePos;
            return;
          } 
        }; 

        const mouseUpHandler = () => {
          isDraggingShape = false;
          isDraggingVertex = false;
          dragShapeId = null;
          cornerDraggedForRect = null;

          if (canvas.classList.contains("grabbing")) {
            canvas.classList.remove("grabbing");
            canvas.classList.add("grabbable");
          }
        };

        const doubleClickHandler = (event: MouseEvent) => {
          event.preventDefault();

          play();

          // Instantiate a shape based on the current tool
          const mousePos = getCanvasMousePosition(event) as Point;

          // If mouse position is on top of an existing shape, do nothing
          if (shapes.some(shape => hitTest(mousePos, shape))) return;

          if (shapePanel === "line") {
            const lineLength = 7;
            const color = { r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255), a: 1 };
            const newLine: Shape = {
              id: `line-${uuidv4()}`,
              type: "line",
              start: { type: 'point', x: mousePos.x - lineLength / 2, y: mousePos.y + lineLength / 2, z: 0, color: color },
              end: { type: 'point', x: mousePos.x + lineLength, y: mousePos.y - lineLength, z: 0, color: color },
              effect: { dx: 0, dy: 0, rotate: 0, scale: 1 },
            };
            debouncedSetShapes([...shapes, newLine]);
          } else if (shapePanel === "square") {
            const squareSize = 10;
            const color = { r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255), a: 1 };
            const newSquare: Shape = {
              id: `square-${uuidv4()}`,
              type: "square",
              start: { type: 'point', x: mousePos.x - squareSize / 2, y: mousePos.y - squareSize / 2, z: 0, color: { r: 255, g: 255, b: 255, a: 1 } },
              sideLength: squareSize,
              vertices: { 
                tl: { x: mousePos.x - squareSize / 2, y: mousePos.y - squareSize / 2, color: color, z: 0, type: 'point' }, 
                tr: { x: mousePos.x + squareSize / 2, y: mousePos.y - squareSize / 2, color: color, z: 0, type: 'point' }, 
                bl: { x: mousePos.x - squareSize / 2, y: mousePos.y + squareSize / 2, color: color, z: 0, type: 'point' }, 
                br: { x: mousePos.x + squareSize / 2, y: mousePos.y + squareSize / 2, color: color, z: 0, type: 'point' } 
              },
              effect: { dx: 0, dy: 0, rotate: 0, scale: 1 },
            };
            debouncedSetShapes([...shapes, newSquare]);
          } else if (shapePanel === "rectangle") {
            const rectangleSize = { width: 12, height: 8 };
            const color = { r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255), a: 1 };
            const newRectangle: Shape = {
              id: `rectangle-${uuidv4()}`,
              type: "rectangle",
              start: { type: 'point', x: mousePos.x - rectangleSize.width / 2, y: mousePos.y - rectangleSize.height / 2, z: 0, color: { r: 255, g: 255, b: 255, a: 1 } },
              width: rectangleSize.width,
              height: rectangleSize.height,
              vertices: { 
                tl: { x: mousePos.x - rectangleSize.width / 2, y: mousePos.y - rectangleSize.height / 2, color: color, z: 0, type: 'point'}, 
                tr: { x: mousePos.x + rectangleSize.width / 2, y: mousePos.y - rectangleSize.height / 2, color: color, z: 0, type: 'point' }, 
                bl: { x: mousePos.x - rectangleSize.width / 2, y: mousePos.y + rectangleSize.height / 2, color: color, z: 0, type: 'point'}, 
                br: { x: mousePos.x + rectangleSize.width / 2, y: mousePos.y + rectangleSize.height / 2, color: color, z: 0, type: 'point'} 
              },
              effect: { dx: 0, dy: 0, rotate: 0, scale: 1 },
            };
            debouncedSetShapes([...shapes, newRectangle]);
          } else {
            const polygonRadius = 5;
            const polygonVertices = 5;
            const color = { r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255), a: 1 };
            const newPolygon: Shape = {
              id: `polygon-${uuidv4()}`,
              type: "polygon",
              vertices: Array.from({ length: polygonVertices }, (_, i) => {
                const angle = (Math.PI * 2 * i) / polygonVertices + Math.PI / 2;
                return {
                  type: 'point',
                  x: mousePos.x + polygonRadius * Math.cos(angle),
                  y: mousePos.y + polygonRadius * Math.sin(angle),
                  z: 0,
                  color: color,
                };
              }),
              effect: { dx: 0, dy: 0, rotate: 0, scale: 1 },
            };
            debouncedSetShapes([...shapes, newPolygon]);
          }
        }

        canvas.addEventListener('mousedown', mouseDownHandler);
        canvas.addEventListener('mousemove', mouseMoveHandler);
        window.addEventListener('mouseup', mouseUpHandler);
        canvas.addEventListener('dblclick', doubleClickHandler);

        canvas.addEventListener('mousemove', (event) => {
          const mousePos = getCanvasMousePosition(event) as Point;
          const hitShape = shapes.find(shape => hitTest(mousePos, shape));
          const vertexWithShape = shapes.slice().reverse().flatMap(shape => getVertexWithShapes(shape))
          const hitVertexWithShape = vertexWithShape.find(vertexWithShape => hitVertexTest(mousePos, vertexWithShape.vertex))
          if (hitVertexWithShape) {
            canvas.classList.remove("pointer");
            canvas.classList.add("crosshair")
          } else if (hitShape) {
            canvas.classList.remove("pointer");
            canvas.classList.add("grabbable");
          } else {
            canvas.classList.remove("grabbable");
            canvas.classList.remove("crosshair");
            canvas.classList.add("pointer");
          }
        });

        return () => {
          canvas.removeEventListener('mousedown', mouseDownHandler);
          canvas.removeEventListener('mousemove', mouseMoveHandler);
          window.removeEventListener('mouseup', mouseUpHandler);
          canvas.removeEventListener('dblclick', doubleClickHandler);
        };
      }
    }
  }, [shapes, shapePanel]);

  return (
    <div className="flex size-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="grid-pattern size-full bg-[#1E1E1E]"
        id="glcanvas"
      ></canvas>
    </div>
  );
}