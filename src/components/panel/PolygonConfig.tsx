import { Shape, Polygon, Point } from "@/types/Shapes"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { VscClose, VscWand } from "react-icons/vsc"
import colorToRGBA from "@/lib/func"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

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
                        <div className="flex items-center justify-center gap-2">
                                <h1 className="font-medium">Polygon {index+1}</h1>

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
                                        const newPolygons = [...polygons]
                                        newPolygons.splice(index, 1)
                                        setShapes(newPolygons)
                                    }
                                }
                            >
                                <VscClose />
                            </button>
                        </div>

                        <div className="flex w-full items-center gap-6 rounded-lg border-[0.5px] border-gray-700 px-2 py-1">
                            
                            <div className="flex items-center gap-2.5">    
                                <div
                                    style={{ backgroundColor: colorToRGBA(polygon.color) }}
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
                                    value={polygon.color.r}
                                    onChange={(e) => {
                                        const newpolygons = [...polygons]
                                        newpolygons[index].color.r = parseInt(e.target.value)
                                        setShapes(newpolygons)
                                    }}
                                />
                                <Input
                                    className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                    type="number"
                                    min={0}
                                    max={255}
                                    value={polygon.color.g}
                                    onChange={(e) => {
                                        const newpolygons = [...polygons]
                                        newpolygons[index].color.g = parseInt(e.target.value)
                                        setShapes(newpolygons)
                                    }}
                                />
                                <Input
                                    className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                    type="number"
                                    min={0}
                                    max={255}
                                    value={polygon.color.b}
                                    onChange={(e) => {
                                        const newpolygons = [...polygons]
                                        newpolygons[index].color.b = parseInt(e.target.value)
                                        setShapes(newpolygons)
                                    }}
                                />
                                <Input
                                    className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                    type="number"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={polygon.color.a}
                                    onChange={(e) => {
                                        const newpolygons = [...polygons]
                                        newpolygons[index].color.a = parseFloat(e.target.value)
                                        setShapes(newpolygons)
                                    }}
                                />
                            </div>

                        </div> 

                        {polygon.vertices.map((vertex, vertexIndex) => (
                            <div key={vertexIndex} className="flex w-full gap-2">
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
                                <button
                                    className="text-gray-600 transition-all duration-200 ease-in-out hover:text-red-500"
                                    onClick={() => {
                                        const newPolygons = [...polygons]
                                        newPolygons[index].vertices.splice(vertexIndex, 1)
                                        setShapes(newPolygons)

                                        // If it is the last vertex, remove the polygon
                                        if (newPolygons[index].vertices.length === 0) {
                                            newPolygons.splice(index, 1)
                                            setShapes(newPolygons)
                                        }
                                    }}
                                >
                                    <VscClose />
                                </button>
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
                            color: {r: 255, g: 255, b: 255, a: 1}
                        } as Polygon])
                    }}
                >
                    Add Polygon
                </Button>
            </div>
        </div>
    )
}