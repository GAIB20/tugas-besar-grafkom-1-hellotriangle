const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color
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
        return;
    }

    const fragmentShader = compileShader(
        gl,
        fragmentShaderSource,
        gl.FRAGMENT_SHADER
    );

    if (!fragmentShader) {
        console.error("Failed to compile fragment shader");
        return;
    }

    const shaderProgram = gl.createProgram();

    if (!shaderProgram) {
        console.error("Failed to create program");
        return;
    }

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
}
