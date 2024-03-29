import { useEffect, useRef } from "react";
import { Point, Shape } from "@/types/Shapes";
import { renderLine, renderPolygon, renderRectangle, renderSquare } from "@/lib/renderShape";
import { initShaders } from "@/lib/shaders";
import { v4 as uuidv4 } from 'uuid';
import debounce from 'lodash/debounce';

interface CanvasProps {
  shapePanel: 'line' | 'square' | 'rectangle' | 'polygon';
  shapes: Shape[];
  setShapes: (shapes: Shape[]) => void;
}

export default function Canvas({ shapePanel, shapes, setShapes }: CanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    const uColor = gl.getUniformLocation(shaderProgram, 'uColor');
    const scaleUniform = gl.getUniformLocation(shaderProgram, "scale");

    // Render the shapes
    shapes.forEach((shape) => {
      if (shape.type === "line") {
        renderLine(gl, shape, coordinates, uColor!, scaleUniform!)
      } else if (shape.type === "square") {
        renderSquare(gl, shape, coordinates, uColor!, scaleUniform!)
      } else if (shape.type === "rectangle") {
        renderRectangle(gl, shape, coordinates, uColor!, scaleUniform!)
      } else {
        renderPolygon(gl, shape, coordinates, uColor!, scaleUniform!)
      }
    });
  };

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

        let isDragging = false;
        let dragShapeId: string | null = null;
        let lastMousePos = { x: 0, y: 0 };

        // Function to check if a mouse position is within a shape
        const hitTest = (mousePos: Point, shape: Shape) => {
          if (shape.type === "line") {
            const hitTolerance = 2;
            const x0 = mousePos.x;
            const y0 = mousePos.y;

            const x1 = shape.start.x;
            const y1 = shape.start.y;
            const x2 = shape.end.x;
            const y2 = shape.end.y;

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
            const x = shape.start.x;
            const y = shape.start.y;
            const size = shape.sideLength;
            return mousePos.x >= x && mousePos.x <= x + size && mousePos.y >= y && mousePos.y <= y + size;
          } else if (shape.type === "rectangle") {
            const x = shape.start.x;
            const y = shape.start.y;
            const width = shape.width;
            const height = shape.height;
            return mousePos.x >= x && mousePos.x <= x + width && mousePos.y >= y && mousePos.y <= y + height;
          } else {
            const points = shape.vertices
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

          const mousePos = getCanvasMousePosition(event) as Point;
          const hitShape = shapes.slice().reverse().find(shape => hitTest(mousePos, shape));
          if (hitShape) {
            isDragging = true;
            dragShapeId = hitShape.id;
            lastMousePos = mousePos;
            
            if (canvas.classList.contains("grabbable") || isDragging) {
              canvas.classList.remove("grabbable");
              canvas.classList.add("grabbing");
            }
          }
        };

        const mouseMoveHandler = (event: MouseEvent) => {
          if (!isDragging) return;
          const mousePos = getCanvasMousePosition(event);
          const dx = mousePos.x - lastMousePos.x;
          const dy = mousePos.y - lastMousePos.y;

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
              draggedShape.vertices = draggedShape.vertices.map(point => ({ x: point.x + dx, y: point.y + dy } as Point));
            }
            setShapes(shapes);
            drawShapes(gl, shapes);
          }

          lastMousePos = mousePos;
        };

        const mouseUpHandler = () => {
          isDragging = false;
          dragShapeId = null;

          if (canvas.classList.contains("grabbing")) {
            canvas.classList.remove("grabbing");
            canvas.classList.add("grabbable");
          }
        };

        const doubleClickHandler = (event: MouseEvent) => {
          event.preventDefault();

          // Instantiate a shape based on the current tool
          const mousePos = getCanvasMousePosition(event) as Point;

          // If mouse position is on top of an existing shape, do nothing
          if (shapes.some(shape => hitTest(mousePos, shape))) return;

          if (shapePanel === "line") {
            const lineLength = 6
            const newLine: Shape = {
              id: `line-${uuidv4()}`,
              type: "line",
              start: { type: 'point', x: mousePos.x - lineLength / 2, y: mousePos.y - lineLength / 2, z: 0, color: { r: 255, g: 255, b: 255, a: 1 } },
              end: { type: 'point', x: mousePos.x + lineLength, y: mousePos.y + lineLength, z: 0, color: { r: 255, g: 255, b: 255, a: 1 } },
              color: { r: 255, g: 255, b: 255, a: 1 },
            };
            debouncedSetShapes([...shapes, newLine]);
          } else if (shapePanel === "square") {
            const squareSize = 6;
            const newSquare: Shape = {
              id: `square-${uuidv4()}`,
              type: "square",
              start: { type: 'point', x: mousePos.x - squareSize / 2, y: mousePos.y - squareSize / 2, z: 0, color: { r: 255, g: 255, b: 255, a: 1 } },
              sideLength: squareSize,
              color: { r: 255, g: 255, b: 255, a: 1 },
            };
            debouncedSetShapes([...shapes, newSquare]);
          } else if (shapePanel === "rectangle") {
            const rectangleSize = { width: 10, height: 5 };
            const newRectangle: Shape = {
              id: `rectangle-${uuidv4()}`,
              type: "rectangle",
              start: { type: 'point', x: mousePos.x - rectangleSize.width / 2, y: mousePos.y - rectangleSize.height / 2, z: 0, color: { r: 255, g: 255, b: 255, a: 1 } },
              width: rectangleSize.width,
              height: rectangleSize.height,
              color: { r: 255, g: 255, b: 255, a: 1 },
            };
            debouncedSetShapes([...shapes, newRectangle]);
          } else {
            const polygonRadius = 5;
            const polygonVertices = 5;
            const newPolygon: Shape = {
              id: `polygon-${uuidv4()}`,
              type: "polygon",
              vertices: Array.from({ length: polygonVertices }, (_, i) => {
                const angle = (Math.PI * 2 * i) / polygonVertices;
                return {
                  type: 'point',
                  x: mousePos.x + polygonRadius * Math.cos(angle),
                  y: mousePos.y + polygonRadius * Math.sin(angle),
                  z: 0,
                  color: { r: 255, g: 255, b: 255, a: 1 },
                };
              }),
              edges: [],
              color: { r: 255, g: 255, b: 255, a: 1 },
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
          if (hitShape) {
            canvas.classList.remove("pointer");
            canvas.classList.add("grabbable");
          } else {
            canvas.classList.remove("grabbable");
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