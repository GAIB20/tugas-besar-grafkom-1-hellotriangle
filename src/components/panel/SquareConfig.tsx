import { Shape, Square } from "@/types/Shapes"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { VscClose } from "react-icons/vsc"
import { Slider } from "../ui/slider"

interface SquareConfigProps {
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
}

export default function SquareConfig({ shapes, setShapes }: SquareConfigProps): JSX.Element {
    const squares = shapes.filter(shape => shape.type === 'square') as Square[]

    return (
        <div className="flex size-full flex-col items-center justify-between">
            {/* Square Config */}
            <div className="flex size-full snap-y snap-mandatory flex-col gap-6 overflow-y-scroll pb-8 text-gray-100">
                {squares.map((square, index) => (
                    <div key={index} className="flex w-full snap-start flex-col gap-3 pr-2">
                        <div className="flex w-full justify-between">
                            <h1 className="font-medium">Square {index+1}</h1>
                            <button className="transition-all duration-200 ease-in-out hover:text-red-500"
                                onClick={
                                    () => {
                                        const newSquares = [...squares]
                                        newSquares.splice(index, 1)
                                        setShapes(newSquares)
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
                                    value={square.start.x}
                                    onChange={(e) => {
                                        const newSquares = [...squares]
                                        newSquares[index].start.x = parseInt(e.target.value)
                                        setShapes(newSquares)
                                    }} />
                            </div>
                            <div className="flex items-center gap-2.5">
                                <p className="text-sm">Y1</p>
                                <Input
                                    className="w-full border-gray-700 text-gray-200"
                                    type="number"
                                    min={0}
                                    value={square.start.y}
                                    onChange={(e) => {
                                        const newSquares = [...squares]
                                        newSquares[index].start.y = parseInt(e.target.value)
                                        setShapes(newSquares)
                                    }} />
                            </div>
                        </div>
                        <div className="mt-1 flex w-full flex-col gap-4">
                            <p className="text-sm">Side Length</p>
                            <Slider
                                className="h-fit w-full rounded-md bg-gray-300"
                                defaultValue={[square.sideLength]} 
                                min={1} 
                                max={200} 
                                step={1} />
                        </div>
                        {/* Line Separator */}
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
                        setShapes([...shapes, {
                            type: 'square',
                            start: { x: 0, y: 0 },
                            sideLength: 10,
                            color: '#ffffff'
                        } as Square])
                    }}
                >
                    Add Square
                </Button>
            </div>
        </div>
    )
}