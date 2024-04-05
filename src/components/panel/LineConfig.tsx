import { Shape, Line } from "@/types/Shapes"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { VscWand, VscClose } from "react-icons/vsc"
import colorToRGBA, { colorToHex } from "@/lib/colors"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { useEffect, useRef, useState } from "react"
import TransformModal from "../modal/TransformModal"
import Chrome from '@uiw/react-color-chrome';
import { v4 as uuidv4 } from 'uuid';
import { debounce } from "lodash"
import buttonClick from '../../assets/button-click.mp3'
import useSound from "use-sound"
import { Copy } from "lucide-react"

interface LineConfigProps {
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
}

interface ColorPickerVisibility {
    [lineId: string]: {
      line: boolean;
      start: boolean;
      end: boolean;
    };
}

interface ColorPickerRefs {
    [lineId: string]: {
      line: HTMLElement | null;
      start: HTMLElement | null;
      end: HTMLElement | null;
    };
}

export default function LineConfig({ shapes, setShapes }: LineConfigProps): JSX.Element {
    const [lines, setLines] = useState<Line[]>(shapes.filter(shape => shape.type === 'line') as Line[])
    const [showModal, setShowModal] = useState<number>(-1)
    const [colorPickerVisibility, setColorPickerVisibility] = useState<ColorPickerVisibility>({});
    const colorPickerRefs = useRef<ColorPickerRefs>({});
    const [play] = useSound(buttonClick);
    
    useEffect(() => {
        console.log("Lines Updated");
        const newShapes = shapes.filter(shape => shape.type === 'line') as Line[]

        if (newShapes.length !== lines.length) {
            setLines(newShapes)
        }
    }, [shapes])

    useEffect(() => {
        const newShapes = shapes.filter(shape => shape.type !== 'line') as Shape[]
        newShapes.push(...lines)

        setShapes(newShapes)
    }, [lines])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          const newVisibility: ColorPickerVisibility = { ...colorPickerVisibility };
          Object.keys(colorPickerRefs.current).forEach((lineId) => {
            Object.keys(colorPickerRefs.current[lineId]).forEach((pickerType) => {
              if (colorPickerRefs.current[lineId][pickerType as keyof ColorPickerRefs[string]] && !colorPickerRefs.current[lineId][pickerType as keyof ColorPickerRefs[string]]?.contains(event.target as Node)) {
                newVisibility[lineId] = { ...(newVisibility[lineId] || { line: false, start: false, end: false }), [pickerType]: false };
              }
            });
          });
          setColorPickerVisibility(newVisibility);
        };
      
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, [colorPickerVisibility]);
      

    return (
        <div className="flex size-full flex-col items-center justify-between">
            {/* Lines Config */}
            <div className="flex size-full snap-y snap-mandatory flex-col gap-6 overflow-y-scroll pb-4 text-gray-100">
                {lines.map((line, index) => (
                    <div key={index}>
                        {(showModal === index) && 
                            <TransformModal
                                shapes={lines}
                                setShapes={(newShapes: Shape[]) => setLines(newShapes as Line[])}
                                shapeIndex={index}
                                onClose={() => setShowModal(-1)}
                        />}
                        <div className="flex w-full snap-start flex-col gap-3 pr-2">
                            {/* Transform Modal */}
                            <div className="mb-1 flex w-full justify-between">
                                <div className="flex items-center justify-center gap-2">
                                    <h1 className="font-medium">Line {index+1}</h1>
                                    <TooltipProvider>
                                        <Tooltip delayDuration={20}>
                                            <TooltipTrigger>
                                                <button className="flex h-full flex-col items-center" onClick={() => {}} >
                                                    <Copy className="mb-0.5 ml-1 text-gray-300" size={14} />
                                                </button>
                                            </TooltipTrigger>

                                            <TooltipContent side="bottom" className="border-0 bg-gray-700/95 text-sm text-white shadow-md">
                                                <p>Duplicate</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                        <Tooltip delayDuration={20}>
                                            <TooltipTrigger>
                                                <button className="flex h-full flex-col items-center" onClick={() => setShowModal(index)} >
                                                    <VscWand className="mb-0.5 animate-pulse text-gray-300" size={16} />
                                                </button>
                                            </TooltipTrigger>

                                            <TooltipContent side="right" className="border-0 bg-gray-700/95 text-sm text-white shadow-md">
                                                <p>Transform Shape</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <button className="transition-all duration-200 ease-in-out hover:text-red-500"
                                    onClick={
                                        () => {
                                            if (showModal === index) {
                                                setShowModal(-1)
                                            }
                                            const newLines = [...lines]
                                            newLines.splice(index, 1)
                                            setLines(newLines)
                                        }
                                    }
                                >
                                    <VscClose />
                                </button>
                            </div>

                            {/* Color Pickers */}
                            <div
                                ref={(el) => colorPickerRefs.current[line.id] = { ...colorPickerRefs.current[line.id], line: el }}
                                style={{ display: colorPickerVisibility[line.id]?.line ? 'block' : 'none' }}
                                className="absolute left-[356px] top-2 flex size-fit flex-col gap-4 rounded-lg bg-zinc-900 p-2"
                            >
                                <Chrome
                                    color={colorToHex({
                                        r: (line.start.color.r + line.end.color.r) / 2,
                                        g: (line.start.color.g + line.end.color.g) / 2,
                                        b: (line.start.color.b + line.end.color.b) / 2,
                                        a: (line.start.color.a + line.end.color.a) / 2
                                    })}
                                    onChange={(color) => debounce(() => {
                                        const newLines = [...lines]
                                        newLines[index].start.color = color.rgba
                                        newLines[index].end.color = color.rgba
                                        setLines(newLines)
                                    }, 10)()}
                                />
                            </div>

                            <div
                                ref={(el) => colorPickerRefs.current[line.id] = { ...colorPickerRefs.current[line.id], start: el }}
                                style={{ display: colorPickerVisibility[line.id]?.start ? 'block' : 'none' }}
                                className="absolute left-[356px] top-2 flex size-fit flex-col gap-4 rounded-lg bg-zinc-900 p-2"
                            >
                                <Chrome
                                    color={colorToHex(line.start.color)}
                                    onChange={(color) => debounce(() => {
                                        const newLines = [...lines]
                                        newLines[index].start.color = color.rgba
                                        setLines(newLines)
                                    }, 10)()}
                                />
                            </div>

                            <div
                                ref={(el) => colorPickerRefs.current[line.id] = { ...colorPickerRefs.current[line.id], end: el }}
                                style={{ display: colorPickerVisibility[line.id]?.end ? 'block' : 'none' }}
                                className="absolute left-[356px] top-2 flex size-fit flex-col gap-4 rounded-lg bg-zinc-900 p-2"
                            >
                                <Chrome
                                    color={colorToHex(line.end.color)}
                                    onChange={(color) => debounce(() => {
                                        const newLines = [...lines]
                                        newLines[index].end.color = color.rgba
                                        setLines(newLines)
                                    }, 10)()}
                                />
                            </div>

                            {/* RGBA Color */}
                            <div className="flex w-full items-center gap-6 rounded-lg border-[0.5px] border-gray-700 px-2 py-1">
                                
                                <div className="flex items-center gap-2.5">    
                                    <button
                                        onClick={() => {
                                            const newVisibility = { ...colorPickerVisibility };
                                            newVisibility[line.id] = { ...(newVisibility[line.id] || { line: false, start: false, end: false }), line: !newVisibility[line.id]?.line };
                                            setColorPickerVisibility(newVisibility);
                                        }}
                                        style={{ backgroundColor: colorToRGBA({
                                            r: (line.start.color.r + line.end.color.r) / 2,
                                            g: (line.start.color.g + line.end.color.g) / 2,
                                            b: (line.start.color.b + line.end.color.b) / 2,
                                            a: (line.start.color.a + line.end.color.a) / 2
                                        }) }}
                                        className="mb-0.5 aspect-square size-3 rounded-full"
                                    />
                                    <p className="mb-1 font-mono">rgba</p>
                                </div>

                                <div className="flex w-full items-center gap-0.5">
                                    <Input
                                        className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                        type="number"
                                        max={255}
                                        value={(line.start.color.r + line.end.color.r) / 2}
                                        onChange={(e) => {
                                            const newLines = [...lines]
                                            newLines[index].start.color.r = parseInt(e.target.value)
                                            newLines[index].end.color.r = parseInt(e.target.value)
                                            setLines(newLines)
                                        }}
                                    />
                                    <Input
                                        className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                        type="number"
                                        max={255}
                                        value={(line.start.color.g + line.end.color.g) / 2}
                                        onChange={(e) => {
                                            const newLines = [...lines]
                                            newLines[index].start.color.g = parseInt(e.target.value)
                                            newLines[index].end.color.g = parseInt(e.target.value)
                                            setLines(newLines)
                                        }}
                                    />
                                    <Input
                                        className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                        type="number"
                                        max={255}
                                        value={(line.start.color.b + line.end.color.b) / 2}
                                        onChange={(e) => {
                                            const newLines = [...lines]
                                            newLines[index].start.color.b = parseInt(e.target.value)
                                            newLines[index].end.color.b = parseInt(e.target.value)
                                            setLines(newLines)
                                        }}
                                    />
                                    <Input
                                        className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                        type="number"
                                        max={1}
                                        step={0.01}
                                        value={(line.start.color.a + line.end.color.a) / 2}
                                        onChange={(e) => {
                                            const newLines = [...lines]
                                            newLines[index].start.color.a = parseFloat(e.target.value)
                                            newLines[index].end.color.a = parseFloat(e.target.value)
                                            setLines(newLines)
                                        }}
                                    />
                                </div>
                            </div> 

                            <div className="flex w-full items-center gap-2.5">
                                <button
                                    onClick={() => {
                                        const newVisibility = { ...colorPickerVisibility };
                                        newVisibility[line.id] = { ...(newVisibility[line.id] || { line: false, start: false, end: false }), start: !newVisibility[line.id]?.start };
                                        setColorPickerVisibility(newVisibility);
                                    }}
                                    style={{ backgroundColor: colorToRGBA(line.start.color) }}
                                    className="mb-0.5 ml-2 aspect-square size-3 rounded-full"
                                />
                                <div className="flex items-center gap-2.5">
                                    <p className="text-sm">X1</p>
                                    <Input
                                        className="w-full border-gray-700 text-gray-200"
                                        type="number"
                                        value={line.start.x}
                                        onChange={(e) => {
                                            const newLines = [...lines]
                                            newLines[index].start.x = parseFloat(e.target.value)
                                            setLines(newLines)
                                        }} />
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <p className="text-sm">Y1</p>
                                    <Input
                                        className="w-full border-gray-700 text-gray-200"
                                        type="number"
                                        value={line.start.y}
                                        onChange={(e) => {
                                            const newLines = [...lines]
                                            newLines[index].start.y = parseFloat(e.target.value)
                                            setLines(newLines)
                                        }} />
                                </div>
                            </div>
                            
                            <div className="flex w-full items-center gap-2.5">
                                <button
                                    onClick={() => {
                                        const newVisibility = { ...colorPickerVisibility };
                                        newVisibility[line.id] = { ...(newVisibility[line.id] || { line: false, start: false, end: false }), end: !newVisibility[line.id]?.end };
                                        setColorPickerVisibility(newVisibility);
                                    }}
                                    style={{ backgroundColor: colorToRGBA(line.end.color) }}
                                    className="mb-0.5 ml-2 aspect-square size-3 rounded-full"
                                />
                                <div className="flex items-center gap-2.5">
                                    <p className="text-sm">X2</p>
                                    <Input
                                        className="w-full border-gray-700 text-gray-200"
                                        type="number"
                                        value={line.end.x}
                                        onChange={(e) => {
                                            const newLines = [...lines]
                                            newLines[index].end.x = parseFloat(e.target.value)
                                            setLines(newLines)
                                        }} />
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <p className="text-sm">Y2</p>
                                    <Input
                                        className="w-full border-gray-700 text-gray-200"
                                        type="number"
                                        value={line.end.y}
                                        onChange={(e) => {
                                            const newLines = [...lines]
                                            newLines[index].end.y = parseFloat(e.target.value)
                                            setLines(newLines)
                                        }} />
                                </div>
                            </div>

                            {/* Line Separator */}
                            {index < lines.length - 1 && (
                                <div className="mt-4 w-full rounded border-t border-stone-800"/>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Line Button */}
            <div className="sticky bottom-0 flex w-full items-center justify-end bg-zinc-900 py-1 pr-2">
                <Button className="w-fit bg-zinc-800 px-4 py-1 hover:bg-gray-700"
                    onClick={() => {
                        play();
                        
                        const color = { r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255), a: 1 };
                        const id = `line-${uuidv4()}`;
                        colorPickerRefs.current[id] = { line: null, start: null, end: null };

                        setLines(
                            [
                                ...lines,
                                {
                                    type: 'line',
                                    id: id,
                                    start: { type: 'point', x: -5, y: 5, z:0, color: color },
                                    end: { type: 'point', x: 5, y: -5, z:0, color: color },
                                    effect: { dx: 0, dy: 0, rotate: 0, scale: 1 }
                                }
                            ]
                        )
                    }}
                >
                    Add Line
                </Button>
            </div>
        </div>
    )
}