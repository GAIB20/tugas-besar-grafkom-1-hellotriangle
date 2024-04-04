import { Point, Shape } from "@/types/Shapes";

function cross(o: Point, a: Point, b: Point): number {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

// Graham's scan algorithm
export function convexHull(shapes: Shape[]): Point[] {
    let points: Point[] = [];

    // Extract all points from shapes
    shapes.forEach(shape => {
        if (shape.type === "line") {
            points.push(shape.start);
            points.push(shape.end);
        } else if (shape.type === "square") {
            points.push({ ...shape.start, color: shape.vertexColors.bl });
            points.push({ ...shape.start, x: shape.start.x + shape.sideLength, color: shape.vertexColors.br });
            points.push({ ...shape.start, y: shape.start.y + shape.sideLength, color: shape.vertexColors.tl });
            points.push({ ...shape.start, x: shape.start.x + shape.sideLength, y: shape.start.y + shape.sideLength, color: shape.vertexColors.tr });
        } else if (shape.type === "rectangle") {
            points.push({ ...shape.start, color: shape.vertexColors.bl });
            points.push({ ...shape.start, x: shape.start.x + shape.width, color: shape.vertexColors.br });
            points.push({ ...shape.start, y: shape.start.y + shape.height, color: shape.vertexColors.tl });
            points.push({ ...shape.start, x: shape.start.x + shape.width, y: shape.start.y + shape.height, color: shape.vertexColors.tr });
        } else if (shape.type === "polygon") {
            points = points.concat(shape.vertices);
        }
    });

    // Sort points by y-coordinate and x-coordinate
    points.sort((a, b) => a.y - b.y || a.x - b.x);

    const lower: Point[] = [];
    for (let i = 0; i < points.length; i++) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
            lower.pop();
        }
        lower.push(points[i]);
    }

    const upper: Point[] = [];
    for (let i = points.length - 1; i >= 0; i--) {
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
            upper.pop();
        }
        upper.push(points[i]);
    }

    // Remove duplicates
    upper.pop();
    lower.pop();
    return lower.concat(upper);
}