import { Shape, Line } from "@/types/Shapes"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { VscClose } from "react-icons/vsc"
import colorToRGBA from "@/lib/func"

interface LineConfigProps {
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
}

export default function LineConfig({ shapes, setShapes }: LineConfigProps): JSX.Element {
    const lines = shapes.filter(shape => shape.type === 'line') as Line[]

    return (
        <div className="flex size-full flex-col items-center justify-between">
            {/* Lines Config */}
            <div className="flex size-full snap-y snap-mandatory flex-col gap-6 overflow-y-scroll pb-4 text-gray-100">
                {lines.map((line, index) => (
                    <div key={index} className="flex w-full snap-start flex-col gap-3 pr-2">
                        <div className="mb-1 flex w-full justify-between">
                            <h1 className="font-medium">Line {index+1}</h1>
                            <button className="transition-all duration-200 ease-in-out hover:text-red-500"
                                onClick={
                                    () => {
                                        const newLines = [...lines]
                                        newLines.splice(index, 1)
                                        setShapes(newLines)
                                    }
                                }
                            >
                                <VscClose />
                            </button>
                        </div>

                        {/* RGBA Color */}
                        <div className="flex w-full items-center gap-6 rounded-lg border-[0.5px] border-gray-700 px-2 py-1">
                            
                            <div className="flex items-center gap-2.5">    
                                <div
                                    style={{ backgroundColor: colorToRGBA(line.color) }}
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
                                    value={line.color.r}
                                    onChange={(e) => {
                                        const newLines = [...lines]
                                        newLines[index].color.r = parseInt(e.target.value)
                                        setShapes(newLines)
                                    }}
                                />
                                <Input
                                    className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                    type="number"
                                    min={0}
                                    max={255}
                                    value={line.color.g}
                                    onChange={(e) => {
                                        const newLines = [...lines]
                                        newLines[index].color.g = parseInt(e.target.value)
                                        setShapes(newLines)
                                    }}
                                />
                                <Input
                                    className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                    type="number"
                                    min={0}
                                    max={255}
                                    value={line.color.b}
                                    onChange={(e) => {
                                        const newLines = [...lines]
                                        newLines[index].color.b = parseInt(e.target.value)
                                        setShapes(newLines)
                                    }}
                                />
                                <Input
                                    className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                    type="number"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={line.color.a}
                                    onChange={(e) => {
                                        const newLines = [...lines]
                                        newLines[index].color.a = parseFloat(e.target.value)
                                        setShapes(newLines)
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
                                    min={0}
                                    value={line.start.x}
                                    onChange={(e) => {
                                        const newLines = [...lines]
                                        newLines[index].start.x = parseInt(e.target.value)
                                        setShapes(newLines)
                                    }} />
                            </div>
                            <div className="flex items-center gap-2.5">
                                <p className="text-sm">Y1</p>
                                <Input
                                    className="w-full border-gray-700 text-gray-200"
                                    type="number"
                                    min={0}
                                    value={line.start.y}
                                    onChange={(e) => {
                                        const newLines = [...lines]
                                        newLines[index].start.y = parseInt(e.target.value)
                                        setShapes(newLines)
                                    }} />
                            </div>
                        </div>
                        <div className="flex w-full gap-4">
                            <div className="flex items-center gap-2.5">
                                <p className="text-sm">X2</p>
                                <Input
                                    className="w-full border-gray-700 text-gray-200"
                                    type="number"
                                    min={0}
                                    value={line.start.x}
                                    onChange={(e) => {
                                        const newLines = [...lines]
                                        newLines[index].start.x = parseInt(e.target.value)
                                        setShapes(newLines)
                                    }} />
                            </div>
                            <div className="flex items-center gap-2.5">
                                <p className="text-sm">Y2</p>
                                <Input
                                    className="w-full border-gray-700 text-gray-200"
                                    type="number"
                                    min={0}
                                    value={line.start.y}
                                    onChange={(e) => {
                                        const newLines = [...lines]
                                        newLines[index].start.y = parseInt(e.target.value)
                                        setShapes(newLines)
                                    }} />
                            </div>
                        </div>

                        {/* Line Separator */}
                        {index < lines.length - 1 && (
                            <div className="mt-4 w-full rounded border-t border-stone-800"/>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Line Button */}
            <div className="sticky bottom-0 flex w-full items-center justify-end bg-zinc-900 py-1 pr-2">
                <Button className="w-fit bg-zinc-800 px-4 py-1 hover:bg-gray-700"
                    onClick={() => {
                        setShapes([...shapes, {
                            type: 'line',
                            start: { x: 0, y: 0 },
                            end: { x: 0, y: 0 },
                            color: { r: 255, g: 255, b: 255, a: 1},
                        } as Line])
                    }}
                >
                    Add Line
                </Button>
            </div>
        </div>
    )
}