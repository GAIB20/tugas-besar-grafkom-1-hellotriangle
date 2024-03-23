import { useEffect, useRef } from "react";
import { Shape } from "@/types/Shapes";
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