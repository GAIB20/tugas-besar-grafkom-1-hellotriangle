// PROGRAM TRANSFORMASI TITIK

// Mendefinisikan tipe data Point
type Point = [number, number, number];

// Fungsi membuat matriks kolom 2D (3x3, affine space)
function createMatrix(): number[][] {
    return [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
}

// Fungsi mengalikan dua buah matriks 3x3
function multiplyMatrix(matrix1: number[][], matrix2: number[][]): number[][] {
    const result: number[][] = createMatrix();

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                result[i][j] += matrix1[i][k] * matrix2[k][j];
            }
        }
    }
    return result;
}


// Fungsi TRANSLASI terhadap sebuah titik
export function translatePoint(point: Point, dx: number, dy: number): Point {
    const translationMatrix: number[][] = createMatrix();
    translationMatrix[0][0] = 1;
    translationMatrix[1][1] = 1;
    translationMatrix[2][2] = 1;
    translationMatrix[0][2] = dx;
    translationMatrix[1][2] = dy;

    const result: number[] = multiplyMatrix(translationMatrix, [[point[0]], [point[1]], [point[2]]])
        .map(arr => parseFloat(arr[0].toFixed(5)));
    return result as Point;
}


// Fungsi ROTASI terhadap sebuah titik
export function rotatePoint(point: Point, angle: number, center_x: number, center_y: number): Point {
    const rotationMatrix: number[][] = createMatrix();
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    rotationMatrix[0][0] = cosAngle;
    rotationMatrix[0][1] = -sinAngle;
    rotationMatrix[1][0] = sinAngle;
    rotationMatrix[1][1] = cosAngle;
    rotationMatrix[2][2] = 1;

    const result: number[] = multiplyMatrix(rotationMatrix, [[point[0]-center_x], [point[1]-center_y], [point[2]]])
        .map(arr => parseFloat(arr[0].toFixed(5)));
    const final_result: number[] = [result[0]+center_x, result[1]+center_y, result[2]];
    return final_result as Point;
}

// Fungsi SCALING terhadap sebuah titik
export function scalePoint(point: Point, sx: number, sy: number): Point {
    const scalingMatrix: number[][] = createMatrix();
    scalingMatrix[0][0] = sx;
    scalingMatrix[1][1] = sy;
    scalingMatrix[2][2] = 1;

    const result: number[] = multiplyMatrix(scalingMatrix, [[point[0]], [point[1]], [point[2]]])
        .map(arr => parseFloat(arr[0].toFixed(5)));
    return result as Point;
}

// Fungsi SHEAR terhadap sebuah titik
export function shearPoint(point: Point, shx: number, shy: number): Point {
    const shearMatrix: number[][] = createMatrix();
    shearMatrix[0][0] = 1;
    shearMatrix[0][1] = shx;
    shearMatrix[1][1] = 1;
    shearMatrix[1][0] = shy;
    shearMatrix[2][2] = 1;

    const result: number[] = multiplyMatrix(shearMatrix, [[point[0]], [point[1]], [point[2]]])
        .map(arr => parseFloat(arr[0].toFixed(5)));
    return result as Point;
}



// Contoh Penggunaan
const point: Point = [1, 1, 1];

console.log("Titik awal: ", point);

const translatedPoint = translatePoint(point, 2, 3);
console.log("Titik setelah translasi: ", translatedPoint);

const rotatedPoint = rotatePoint(point, Math.PI / 4, 0, 0);
console.log("Titik setelah rotasi: ", rotatedPoint);

const scaledPoint = scalePoint(point, 2, 2);
console.log("Titik setelah scaling: ", scaledPoint);

const shearedPoint = shearPoint(point, 0.5, 0.5);
console.log("Titik setelah shear: ", shearedPoint);