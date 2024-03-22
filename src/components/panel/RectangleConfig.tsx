import { Shape, Rectangle } from "@/types/Shapes"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { VscClose } from "react-icons/vsc"
import { Slider } from "../ui/slider"

interface RectangleConfigProps {
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
}

export default function RectangleConfig({ shapes, setShapes }: RectangleConfigProps): JSX.Element {
    const rectangles = shapes.filter(shape => shape.type === 'rectangle') as Rectangle[]

    return (
        <div className="flex size-full flex-col items-center justify-between">
            {/* Rectangle Config */}
            <div className="flex size-full snap-y snap-mandatory flex-col gap-6 overflow-y-scroll pb-8 text-gray-100">
                {rectangles.map((rectangle, index) => (
                    <div key={index} className="flex w-full snap-start flex-col gap-3 pr-2">
                        <div className="flex w-full justify-between">
                            <h1 className="font-medium">Rectangle {index+1}</h1>
                            <button className="transition-all duration-200 ease-in-out hover:text-red-500"
                                onClick={
                                    () => {
                                        const newRectangles = [...rectangles]
                                        newRectangles.splice(index, 1)
                                        setShapes(newRectangles)
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
                                    value={rectangle.start.x}
                                    onChange={(e) => {
                                        const newRectangles = [...rectangles]
                                        newRectangles[index].start.x = parseInt(e.target.value)
                                        setShapes(newRectangles)
                                    }} />
                            </div>
                            <div className="flex items-center gap-2.5">
                                <p className="text-sm">Y1</p>
                                <Input
                                    className="w-full border-gray-700 text-gray-200"
                                    type="number"
                                    min={0}
                                    value={rectangle.start.y}
                                    onChange={(e) => {
                                        const newRectangles = [...rectangles]
                                        newRectangles[index].start.y = parseInt(e.target.value)
                                        setShapes(newRectangles)
                                    }} />
                            </div>
                        </div>
                        <div className="mt-1 flex w-full flex-col gap-4">
                            <p className="text-sm">Width</p>
                            <Slider
                                className="h-fit w-full rounded-md bg-gray-300"
                                defaultValue={[rectangle.width]} 
                                min={1} 
                                max={200} 
                                step={1} />
                        </div>
                        <div className="mt-4 flex w-full flex-col gap-4">
                            <p className="text-sm">Height</p>
                            <Slider
                                className="h-fit w-full rounded-md bg-gray-300"
                                defaultValue={[rectangle.height]} 
                                min={1} 
                                max={200} 
                                step={1} />
                        </div>
                        {/* Line Separator */}
                        {index < rectangles.length - 1 && (
                            <div className="mt-4 w-full rounded border-t border-stone-800"/>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Rectangle Button */}
            <div className="sticky bottom-0 flex w-full items-center justify-end bg-zinc-900 py-1 pr-2">
                <Button className="w-fit bg-zinc-800 px-4 py-1 hover:bg-gray-700"
                    onClick={() => {
                        setShapes([...shapes, {
                            type: 'rectangle',
                            start: { x: 0, y: 0 },
                            width: 10,
                            height: 10,
                            color: '#ffffff'
                        } as Rectangle])
                    }}
                >
                    Add Rectangle
                </Button>
            </div>
        </div>
    )
}