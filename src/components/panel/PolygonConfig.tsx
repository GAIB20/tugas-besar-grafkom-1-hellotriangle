import { Shape, Polygon, Point } from "@/types/Shapes"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { VscClose } from "react-icons/vsc"

interface PolygonConfigProps {
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
}

export default function PolygonConfig({ shapes, setShapes }: PolygonConfigProps): JSX.Element {
    const polygons = shapes.filter(shape => shape.type === 'polygon') as Polygon[]

    return (
        <div className="flex size-full flex-col items-center justify-between">
            {/* Polygons Config */}
            <div className="flex size-full snap-y snap-mandatory flex-col gap-6 overflow-y-scroll pb-4 text-gray-100">
                {polygons.map((polygon, index) => (
                    <div key={index} className="flex w-full snap-start flex-col gap-3 pr-2">
                        <div className="mb-1 flex w-full justify-between">
                            <h1 className="font-medium">Polygon {index+1}</h1>
                            <button className="transition-all duration-200 ease-in-out hover:text-red-500"
                                onClick={
                                    () => {
                                        const newPolygons = [...polygons]
                                        newPolygons.splice(index, 1)
                                        setShapes(newPolygons)
                                    }
                                }
                            >
                                <VscClose />
                            </button>
                        </div>
                        
                        {/* <div className="flex w-full gap-4">
                            <div className="flex items-center gap-2.5">
                                <p className="text-sm">X1</p>
                                <Input
                                    className="w-full border-gray-700 text-gray-200"
                                    type="number"
                                    min={0}
                                    value={polygon.start.x}
                                    onChange={(e) => {
                                        const newPolygons = [...polygons]
                                        newPolygons[index].start.x = parseInt(e.target.value)
                                        setShapes(newPolygons)
                                    }} />
                            </div>
                            <div className="flex items-center gap-2.5">
                                <p className="text-sm">Y1</p>
                                <Input
                                    className="w-full border-gray-700 text-gray-200"
                                    type="number"
                                    min={0}
                                    value={polygon.start.y}
                                    onChange={(e) => {
                                        const newPolygons = [...polygons]
                                        newPolygons[index].start.y = parseInt(e.target.value)
                                        setShapes(newPolygons)
                                    }} />
                            </div>
                        </div> */}

                        {polygon.vertices.map((vertex, vertexIndex) => (
                            <div key={vertexIndex} className="flex w-full gap-4">
                                <div className="flex items-center gap-2.5">
                                    <p className="text-sm">X{vertexIndex+1}</p>
                                    <Input
                                        className="w-full border-gray-700 text-gray-200"
                                        type="number"
                                        min={0}
                                        value={vertex.x}
                                        onChange={(e) => {
                                            const newPolygons = [...polygons]
                                            newPolygons[index].vertices[vertexIndex].x = parseInt(e.target.value)
                                            setShapes(newPolygons)
                                        }} />
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <p className="text-sm">Y{vertexIndex+1}</p>
                                    <Input
                                        className="w-full border-gray-700 text-gray-200"
                                        type="number"
                                        min={0}
                                        value={vertex.y}
                                        onChange={(e) => {
                                            const newPolygons = [...polygons]
                                            newPolygons[index].vertices[vertexIndex].y = parseInt(e.target.value)
                                            setShapes(newPolygons)
                                        }} />
                                </div>
                            </div>
                        ))}

                        {/* Add Vertex */}
                        <Button className="w-full rounded-lg bg-zinc-800 py-1 hover:bg-gray-700"
                            onClick={() => {
                                const newPolygons = [...polygons]
                                newPolygons[index].vertices.push({ x: 0, y: 0 } as Point)
                                setShapes(newPolygons)
                            }}
                        >Add Vertex</Button>
                        
                        {/* Polygon Separator */}
                        {index < polygons.length - 1 && (
                            <div className="mt-4 w-full rounded border-t border-stone-800"/>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Polygon Button */}
            <div className="sticky bottom-0 flex w-full items-center justify-end bg-zinc-900 py-1 pr-2">
                <Button className="w-fit bg-zinc-800 px-4 py-1 hover:bg-gray-700"
                    onClick={() => {
                        setShapes([...shapes, {
                            type: 'polygon',
                            vertices: [{ x: 0, y: 0 }],
                            color: '#ffffff'
                        } as Polygon])
                    }}
                >
                    Add Polygon
                </Button>
            </div>
        </div>
    )
}