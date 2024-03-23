import { useEffect, useRef } from "react";
import { Shape } from "@/types/Shapes";
import { renderLine, renderPolygon, renderRectangle, renderSquare } from "@/lib/renderShape";

interface CanvasProps {
  shapes: Shape[];
}

export default function Canvas({ shapes }: CanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawShapes = (gl: WebGLRenderingContext, shapes: Shape[]) => {
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShaderCode = `
      attribute vec2 coordinates;
      uniform float scale; // Uniform variable for scaling
      void main(void) {
        gl_Position = vec4(coordinates * scale, 0.0, 1.0);
      }
    `;

    const fragmentShaderCode = `
      precision mediump float;
      uniform vec4 uColor;
      void main(void) {
        gl_FragColor = uColor;
      }
    `;

    function compileShader(source: string, type: number) {
      const shader = gl.createShader(type);
      if (!shader) {
          console.error('Failed to create shader');
          return null;
      }
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
      }
      return shader;
    }

    const vertexShader = compileShader(vertexShaderCode, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderCode, gl.FRAGMENT_SHADER);

    // Create and link the shader program
    const shaderProgram = gl.createProgram();
    if (!shaderProgram || !vertexShader || !fragmentShader) {
      console.error('Failed to create shader program');
      return;
    }
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return;
    }

    gl.useProgram(shaderProgram);

    // Attributes and uniforms
    const coordinates = gl.getAttribLocation(shaderProgram, 'coordinates');
    const uColor = gl.getUniformLocation(shaderProgram, 'uColor');
    const scaleUniform = gl.getUniformLocation(shaderProgram, "scale");

    // Render the shapes
    shapes.forEach((shape) => {
      // let vertices: Float32Array;

      if (shape.type === "line") {
        // vertices = new Float32Array([
        //     shape.start.x, shape.start.y,
        //     shape.end.x, shape.end.y,
        // ]);
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