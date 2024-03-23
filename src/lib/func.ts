import { Color } from "@/types/Shapes";

export default function colorToRGBA(color: Color): string {
    const { r, g, b, a } = color;
    return `rgba(${r},${g},${b},${a})`;
}