import { Color } from "@/types/Shapes";

export default function colorToRGBA(color: Color): string {
    const { r, g, b, a } = color;
    return `rgba(${r},${g},${b},${a})`;
}

export function colorToHex(color: Color): string {
    const { r, g, b, a } = color;
    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}${Math.round(a * 255).toString(16)}`;
}