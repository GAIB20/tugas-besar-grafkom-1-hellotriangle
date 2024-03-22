import { Shape, Line } from "@/types/Shapes"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { VscClose } from "react-icons/vsc"

interface LineConfigProps {
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
}

export default function LineConfig({ shapes, setShapes }: LineConfigProps): JSX.Element {
    const lines = shapes.filter(shape => shape.type === 'line') as Line[]

    return (
        <div className="flex size-full flex-col items-center justify-between">
            {/* Lines Config */}
            <div className="flex size-full flex-col gap-8 overflow-y-scroll pb-4 text-gray-100">
                {lines.map((line, index) => (
                    <div key={index} className="flex w-full flex-col gap-3 pr-2">
                        <div className="flex w-full justify-between">
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
                            color: '#ffffff'
                        } as Line])
                    }}
                >
                    Add Line
                </Button>
            </div>
        </div>
    )
}