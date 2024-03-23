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

interface LineConfigProps {
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
}

export default function LineConfig({ shapes, setShapes }: LineConfigProps): JSX.Element {
    const [lines, setLines] = useState<Line[]>(shapes.filter(shape => shape.type === 'line') as Line[])
    const [showModal, setShowModal] = useState<number>(-1)
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false)
    const colorPickerRef = useRef(null);


    useEffect(() => {
        const newShapes = shapes.filter(shape => shape.type !== 'line') as Shape[]

        newShapes.push(...lines)

        setShapes(newShapes)
    }, [lines])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
                setShowColorPicker(false);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    

    return (
        <div className="flex size-full flex-col items-center justify-between">
            {/* Lines Config */}
            <div className="flex size-full snap-y snap-mandatory flex-col gap-6 overflow-y-scroll pb-4 text-gray-100">
                {lines.map((line, index) => (
                    <>
                        {(showModal === index) && 
                            <TransformModal
                                shape={line}
                                shapeIndex={index}
                                onClose={() => setShowModal(-1)}
                        />}
                        {(showColorPicker) && 
                            <div ref={colorPickerRef} className="absolute left-[356px] top-2 flex size-fit flex-col gap-4 rounded-lg bg-zinc-900 p-2">
                                <Chrome
                                    color={colorToHex(line.color)}
                                    onChange={(color) => {
                                        const newLines = [...lines]
                                        newLines[index].color = color.rgba
                                        setLines(newLines)
                                    }}
                                />
                            </div>
                        }
                        <div key={index} className="flex w-full snap-start flex-col gap-3 pr-2">
                            {/* Transform Modal */}
                            <div className="mb-1 flex w-full justify-between">
                                <div className="flex items-center justify-center gap-2">
                                    <h1 className="font-medium">Line {index+1}</h1>

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

                            {/* RGBA Color */}
                            <div className="flex w-full items-center gap-6 rounded-lg border-[0.5px] border-gray-700 px-2 py-1">
                                
                                <div className="flex items-center gap-2.5">    
                                    <button
                                        onClick={() => setShowColorPicker(!showColorPicker)}
                                        style={{ backgroundColor: colorToRGBA(line.color) }}
                                        className="mb-0.5 aspect-square size-3 rounded-full"
                                    />
                                    <p className="mb-1 font-mono">rgba</p>
                                </div>

                                <div className="flex w-full items-center gap-0.5">
                                    <Input
                                        className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                        type="number"
                                        max={255}
                                        value={line.color.r}
                                        onChange={(e) => {
                                            const newLines = [...lines]
                                            newLines[index].color.r = parseInt(e.target.value)
                                            setLines(newLines)
                                        }}
                                    />
                                    <Input
                                        className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                        type="number"
                                        max={255}
                                        value={line.color.g}
                                        onChange={(e) => {
                                            const newLines = [...lines]
                                            newLines[index].color.g = parseInt(e.target.value)
                                            setLines(newLines)
                                        }}
                                    />
                                    <Input
                                        className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                        type="number"
                                        max={255}
                                        value={line.color.b}
                                        onChange={(e) => {
                                            const newLines = [...lines]
                                            newLines[index].color.b = parseInt(e.target.value)
                                            setLines(newLines)
                                        }}
                                    />
                                    <Input
                                        className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                        type="number"
                                        max={1}
                                        step={0.01}
                                        value={line.color.a}
                                        onChange={(e) => {
                                            const newLines = [...lines]
                                            newLines[index].color.a = parseFloat(e.target.value)
                                            setLines(newLines)
                                        }}
                                    />
                                </div>

                            </div> 

                            <div className="flex w-full gap-4">
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
                            <div className="flex w-full gap-4">
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
                    </>
                ))}
            </div>

            {/* Add Line Button */}
            <div className="sticky bottom-0 flex w-full items-center justify-end bg-zinc-900 py-1 pr-2">
                <Button className="w-fit bg-zinc-800 px-4 py-1 hover:bg-gray-700"
                    onClick={() => {
                        setLines(
                            [
                                ...lines,
                                {
                                    type: 'line',
                                    id: `line-${Math.random().toString(36).substr(2, 9)}`,
                                    start: { type: 'point', x: 0, y: 0, color: { r: 255, g: 255, b: 255, a: 1 } },
                                    end: { type: 'point', x: 0, y: 0, color: { r: 255, g: 255, b: 255, a: 1 } },
                                    color: { r: 255, g: 255, b: 255, a: 1 }
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