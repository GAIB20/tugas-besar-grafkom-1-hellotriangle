import { Shape, Square } from "@/types/Shapes"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { VscClose, VscWand } from "react-icons/vsc"
import { Slider } from "../ui/slider"
import colorToRGBA from "@/lib/func"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { useEffect, useState } from "react"

interface SquareConfigProps {
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
}

export default function SquareConfig({ shapes, setShapes }: SquareConfigProps): JSX.Element {
    const [squares, setSquares] = useState<Square[]>(shapes.filter(shape => shape.type === 'square') as Square[])

    // Detect if lines changes, then update the shapes
    useEffect(() => {
        // Delete all lines from shapes
        const newShapes = shapes.filter(shape => shape.type !== 'square') as Shape[]

        // Add new lines to shapes
        newShapes.push(...squares)

        // Update shapes
        setShapes(newShapes)
    })

    return (
        <div className="flex size-full flex-col items-center justify-between">
            {/* Square Config */}
            <div className="flex size-full snap-y snap-mandatory flex-col gap-6 overflow-y-scroll pb-8 text-gray-100">
                {squares.map((square, index) => (
                    <div key={index} className="flex w-full snap-start flex-col gap-3 pr-2">
                        <div className="mb-1 flex w-full justify-between">
                            <div className="flex items-center justify-center gap-2">
                                <h1 className="font-medium">Square {index+1}</h1>

                                <TooltipProvider>
                                    <Tooltip delayDuration={20}>
                                        <TooltipTrigger>
                                            <button className="flex h-full flex-col items-center">
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
                                        const newSquares = [...squares]
                                        newSquares.splice(index, 1)
                                        setSquares(newSquares)
                                    }
                                }
                            >
                                <VscClose />
                            </button>
                        </div>

                        <div className="flex w-full items-center gap-6 rounded-lg border-[0.5px] border-gray-700 px-2 py-1">
                            
                            <div className="flex items-center gap-2.5">    
                                <div
                                    style={{ backgroundColor: colorToRGBA(square.color) }}
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
                                    value={square.color.r}
                                    onChange={(e) => {
                                        const newsquares = [...squares]
                                        newsquares[index].color.r = parseInt(e.target.value)
                                        setSquares(newsquares)
                                    }}
                                />
                                <Input
                                    className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                    type="number"
                                    min={0}
                                    max={255}
                                    value={square.color.g}
                                    onChange={(e) => {
                                        const newsquares = [...squares]
                                        newsquares[index].color.g = parseInt(e.target.value)
                                        setSquares(newsquares)
                                    }}
                                />
                                <Input
                                    className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                    type="number"
                                    min={0}
                                    max={255}
                                    value={square.color.b}
                                    onChange={(e) => {
                                        const newsquares = [...squares]
                                        newsquares[index].color.b = parseInt(e.target.value)
                                        setSquares(newsquares)
                                    }}
                                />
                                <Input
                                    className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                    type="number"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={square.color.a}
                                    onChange={(e) => {
                                        const newsquares = [...squares]
                                        newsquares[index].color.a = parseFloat(e.target.value)
                                        setSquares(newsquares)
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
                                    value={square.start.x}
                                    onChange={(e) => {
                                        const newSquares = [...squares]
                                        newSquares[index].start.x = parseFloat(e.target.value)
                                        setSquares(newSquares)
                                    }} />
                            </div>
                            <div className="flex items-center gap-2.5">
                                <p className="text-sm">Y</p>
                                <Input
                                    className="w-full border-gray-700 text-gray-200"
                                    type="number"
                                    value={square.start.y}
                                    onChange={(e) => {
                                        const newSquares = [...squares]
                                        newSquares[index].start.y = parseFloat(e.target.value)
                                        setSquares(newSquares)
                                    }} />
                            </div>
                        </div>
                        <div className="mt-1 flex w-full flex-col gap-4">
                            <p className="text-sm">Side Length</p>
                            <Slider
                                className="h-fit w-full rounded-md bg-gray-300"
                                defaultValue={[square.sideLength]} 
                                min={1} 
                                max={40} 
                                onValueChange={(value) => {
                                    const newSquares = [...squares]
                                    newSquares[index].sideLength = value[0]
                                    setSquares(newSquares)
                                }}
                                step={0.5} />
                        </div>

                        {/* Square Separator */}
                        {index < squares.length - 1 && (
                            <div className="mt-4 w-full rounded border-t border-stone-800"/>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Square Button */}
            <div className="sticky bottom-0 flex w-full items-center justify-end bg-zinc-900 py-1 pr-2">
                <Button className="w-fit bg-zinc-800 px-4 py-1 hover:bg-gray-700"
                    onClick={() => {
                        setSquares([
                            ...squares,
                            {
                                type: 'square',
                                id: Math.random().toString(36).substring(7),
                                start: { type: 'point', x: 0, y: 0, color: { r: 255, g: 255, b: 255, a: 1 } },
                                sideLength: 10,
                                color: { r: 255, g: 255, b: 255, a: 1 }
                            }
                        ])
                    }}
                >
                    Add Square
                </Button>
            </div>
        </div>
    )
}