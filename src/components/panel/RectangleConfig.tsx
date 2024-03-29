import { Shape, Rectangle } from "@/types/Shapes"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { VscClose, VscWand } from "react-icons/vsc"
import { Slider } from "../ui/slider"
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

interface RectangleConfigProps {
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
}

export default function RectangleConfig({ shapes, setShapes }: RectangleConfigProps): JSX.Element {
    const [rectangles, setRectangles] = useState<Rectangle[]>(shapes.filter(shape => shape.type === 'rectangle') as Rectangle[])
    const [showModal, setShowModal] = useState<number>(-1)
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false)
    const colorPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const newShapes = shapes.filter(shape => shape.type !== 'rectangle') as Shape[]

        newShapes.push(...rectangles)

        setShapes(newShapes)
    }, [rectangles])

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
            {/* Rectangle Config */}
            <div className="flex size-full snap-y snap-mandatory flex-col gap-6 overflow-y-scroll pb-8 text-gray-100">
                {rectangles.map((rectangle, index) => (
                    <>
                        {(showModal === index) && 
                            <TransformModal
                                shapes={rectangles}
                                setShapes={(newShapes: Shape[]) => setRectangles(newShapes as Rectangle[])}
                                shapeIndex={index}
                                onClose={() => setShowModal(-1)}
                        />}
                        {(showColorPicker) && 
                            <div ref={colorPickerRef} className="absolute left-[356px] top-2 flex size-fit flex-col gap-4 rounded-lg bg-zinc-900 p-2">
                                <Chrome
                                    color={colorToHex(rectangle.color)}
                                    onChange={(color) => {
                                        const newRectangles = [...rectangles]
                                        newRectangles[index].color = color.rgba
                                        setRectangles(newRectangles)
                                    }}
                                />
                            </div>
                        }
                        <div key={index} className="flex w-full snap-start flex-col gap-3 pr-2">
                            <div className="mb-1 flex w-full justify-between">
                            <div className="flex items-center justify-center gap-2">
                                    <h1 className="font-medium">Rectangle {index+1}</h1>

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
                                            const newRectangles = [...rectangles]
                                            newRectangles.splice(index, 1)
                                            setRectangles(newRectangles)
                                        }
                                    }
                                >
                                    <VscClose />
                                </button>
                            </div>

                            <div className="flex w-full items-center gap-6 rounded-lg border-[0.5px] border-gray-700 px-2 py-1">
                                
                                <div className="flex items-center gap-2.5">    
                                    <button
                                        onClick={() => setShowColorPicker(!showColorPicker)}
                                        style={{ backgroundColor: colorToRGBA(rectangle.color) }}
                                        className="mb-0.5 aspect-square size-3 rounded-full"
                                    />
                                    <p className="mb-1 font-mono">rgba</p>
                                </div>

                                <div className="flex w-full items-center gap-0.5">
                                    <Input
                                        className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                        type="number"
                                        min={0}
                                        max={255}
                                        value={rectangle.color.r}
                                        onChange={(e) => {
                                            const newrectangles = [...rectangles]
                                            newrectangles[index].color.r = parseInt(e.target.value)
                                            setRectangles(newrectangles)
                                        }}
                                    />
                                    <Input
                                        className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                        type="number"
                                        min={0}
                                        max={255}
                                        value={rectangle.color.g}
                                        onChange={(e) => {
                                            const newrectangles = [...rectangles]
                                            newrectangles[index].color.g = parseInt(e.target.value)
                                            setRectangles(newrectangles)
                                        }}
                                    />
                                    <Input
                                        className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                        type="number"
                                        min={0}
                                        max={255}
                                        value={rectangle.color.b}
                                        onChange={(e) => {
                                            const newrectangles = [...rectangles]
                                            newrectangles[index].color.b = parseInt(e.target.value)
                                            setRectangles(newrectangles)
                                        }}
                                    />
                                    <Input
                                        className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                        type="number"
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={rectangle.color.a}
                                        onChange={(e) => {
                                            const newrectangles = [...rectangles]
                                            newrectangles[index].color.a = parseFloat(e.target.value)
                                            setRectangles(newrectangles)
                                        }}
                                    />
                                </div>

                            </div> 

                            <div className="flex w-full gap-4">
                                <div className="flex items-center gap-2.5">
                                    <p className="text-sm">X</p>
                                    <Input
                                        className="w-full border-gray-700 text-gray-200"
                                        type="number"
                                        value={rectangle.start.x}
                                        onChange={(e) => {
                                            const newRectangles = [...rectangles]
                                            newRectangles[index].start.x = parseFloat(e.target.value)
                                            setRectangles(newRectangles)
                                        }} />
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <p className="text-sm">Y</p>
                                    <Input
                                        className="w-full border-gray-700 text-gray-200"
                                        type="number"
                                        value={rectangle.start.y}
                                        onChange={(e) => {
                                            const newRectangles = [...rectangles]
                                            newRectangles[index].start.y = parseFloat(e.target.value)
                                            setRectangles(newRectangles)
                                        }} />
                                </div>
                            </div>
                            <div className="mt-2 flex w-full items-center gap-3">
                                <div className="flex w-full flex-col gap-4">
                                    <p className="text-sm">Width</p>
                                    <Slider
                                        className="h-fit w-full rounded-md bg-gray-300"
                                        defaultValue={[rectangle.width]} 
                                        min={1} 
                                        max={40}
                                        onValueChange={(value) => {
                                            const newRectangles = [...rectangles]
                                            newRectangles[index].width = value[0]
                                            setRectangles(newRectangles)
                                        }} 
                                        step={1} />
                                </div>
                                <div className="flex w-full flex-col gap-4">
                                    <p className="text-sm">Height</p>
                                    <Slider
                                        className="h-fit w-full rounded-md bg-gray-300"
                                        defaultValue={[rectangle.height]} 
                                        min={1} 
                                        max={40}
                                        onValueChange={(value) => {
                                            const newRectangles = [...rectangles]
                                            newRectangles[index].height = value[0]
                                            setRectangles(newRectangles)
                                        }} 
                                        step={1} />
                                </div>
                            </div>

                            {/* Rectangle Separator */}
                            {index < rectangles.length - 1 && (
                                <div className="mt-4 w-full rounded border-t border-stone-800"/>
                            )}
                        </div>
                    </>
                ))}
            </div>

            {/* Add Rectangle Button */}
            <div className="sticky bottom-0 flex w-full items-center justify-end bg-zinc-900 py-1 pr-2">
                <Button className="w-fit bg-zinc-800 px-4 py-1 hover:bg-gray-700"
                    onClick={() => {
                        setRectangles([
                            ...rectangles,
                            {
                                id: `rectangle-${uuidv4()}`,
                                type: 'rectangle',
                                start: { type: 'point', x: 0, y: 0, z:0, color: { r: 255, g: 255, b: 255, a: 1 } },
                                width: 12,
                                height: 8,
                                color: { r: 255, g: 255, b: 255, a: 1 },
                                effect: { dx: 0, dy: 0, rotate: 0, scale: 1 }
                            }
                        ])
                    }}
                >
                    Add Rectangle
                </Button>
            </div>
        </div>
    )
}