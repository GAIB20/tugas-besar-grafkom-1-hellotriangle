const vertexShaderSource = `
    attribute vec2 coordinates;
    uniform float scale; // Uniform variable for scaling
    attribute vec3 vertexColor;
    varying vec3 fragColor;
    void main(void) {
        gl_Position = vec4(coordinates * scale, 0.0, 1.0);
        fragColor = vertexColor;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    varying vec3 fragColor;
    void main(void) {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`;


function compileShader(
    gl: WebGLRenderingContext,
    source: string,
    type: number
): WebGLShader | null {
    const shader: WebGLShader | null = gl.createShader(type);
    if (!shader) {
        console.error("Failed to create shader");
        return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error");
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

export function initShaders(gl: WebGLRenderingContext) {
    const vertexShader = compileShader(
        gl,
        vertexShaderSource,
        gl.VERTEX_SHADER
    );

    if (!vertexShader) {
        console.error("Failed to compile vertex shader");
        return null;
    }

    const fragmentShader = compileShader(
        gl,
        fragmentShaderSource,
        gl.FRAGMENT_SHADER
    );

    if (!fragmentShader) {
        console.error("Failed to compile fragment shader");
        return null;
    }

    const shaderProgram = gl.createProgram();

    if (!shaderProgram) {
        console.error("Failed to create program");
        return null;
    }

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    return shaderProgram
}
