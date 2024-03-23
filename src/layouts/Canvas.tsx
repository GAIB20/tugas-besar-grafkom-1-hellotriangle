import { useEffect, useRef } from "react";
import { Point, Shape } from "@/types/Shapes";
import { renderLine, renderPolygon, renderRectangle, renderSquare } from "@/lib/renderShape";
import { initShaders } from "@/lib/shaders";

interface CanvasProps {
  shapes: Shape[];
}

export default function Canvas({ shapes }: CanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
            const x1 = shape.start.x
            const y1 = shape.start.y
            const x2 = shape.end.x
            const y2 = shape.end.y
            const dx = x2 - x1;
            const dy = y2 - y1;
            const dist = Math.abs(dy * mousePos.x - dx * mousePos.y + x2 * y1 - y2 * x1) / Math.sqrt(dy * dy + dx * dx);
            return dist < 5;
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
          const mousePos = getCanvasMousePosition(event) as Point;
          const hitShape = shapes.find(shape => hitTest(mousePos, shape));
          if (hitShape) {
            isDragging = true;
            dragShapeId = hitShape.id;
            lastMousePos = mousePos;
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
            drawShapes(gl, shapes);
          }

          lastMousePos = mousePos;
        };

        const mouseUpHandler = () => {
          isDragging = false;
          dragShapeId = null;
        };

        canvas.addEventListener('mousedown', mouseDownHandler);
        canvas.addEventListener('mousemove', mouseMoveHandler);
        window.addEventListener('mouseup', mouseUpHandler);

        canvas.addEventListener('mousemove', (event) => {
          const mousePos = getCanvasMousePosition(event) as Point;
          const hitShape = shapes.find(shape => hitTest(mousePos, shape));
          canvas.style.cursor = hitShape ? "pointer" : "default";
        });

        return () => {
          canvas.removeEventListener('mousedown', mouseDownHandler);
          canvas.removeEventListener('mousemove', mouseMoveHandler);
          window.removeEventListener('mouseup', mouseUpHandler);
        };
      }
    }
  }, [shapes]);

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