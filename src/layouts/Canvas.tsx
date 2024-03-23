import { useEffect, useRef } from "react";
import { Shape } from "@/types/Shapes";

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
      let vertices: Float32Array;

      if (shape.type === "line") {
        vertices = new Float32Array([
            shape.start.x, shape.start.y,
            shape.end.x, shape.end.y,
        ]);
      } else if (shape.type === "square") {
        const x1 = shape.start.x;
        const y1 = shape.start.y;
        const x2 = x1 + shape.sideLength;
        const y2 = y1;
        const x3 = x1;
        const y3 = y1 + shape.sideLength;
        const x4 = x2;
        const y4 = y3;
        vertices = new Float32Array([
            x1, y1, x2, y2, x3, y3,
            x3, y3, x2, y2, x4, y4
        ]);
      } else if (shape.type === "rectangle") {
        const x1 = shape.start.x;
        const y1 = shape.start.y;
        const x2 = x1 + shape.width;
        const y2 = y1;
        const x3 = x1;
        const y3 = y1 + shape.height;
        const x4 = x2;
        const y4 = y3;
        vertices = new Float32Array([
            x1, y1, x2, y2, x3, y3,
            x3, y3, x2, y2, x4, y4
        ]);
      }

      // TODO: Render polygon

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      const coord = gl.getAttribLocation(shaderProgram, "coordinates");
      gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(coord);

      // Configure the vertex attribute pointer
      gl.vertexAttribPointer(coordinates, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(coordinates);

      // Set the color uniform
      gl.uniform4f(uColor, shape.color.r / 255, shape.color.g / 255, shape.color.b / 255, shape.color.a);

      // Set the scale uniform
      gl.uniform1f(scaleUniform, 0.05);

      // Draw the shape
      if (shape.type === 'line') {
          gl.drawArrays(gl.LINES, 0, 2);
      } else if (shape.type === 'square' || shape.type === 'rectangle') {
        gl.drawArrays(gl.TRIANGLES, 0, 6); // Draw 6 vertices = 2 triangles
      }

      // Detach and delete shaders
      gl.deleteBuffer(buffer);
      
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
