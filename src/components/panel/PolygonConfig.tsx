import { Shape, Polygon, Point, Line } from "@/types/Shapes"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { VscClose, VscWand } from "react-icons/vsc"
import colorToRGBA, { colorToHex } from "@/lib/colors"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { ChevronsUpDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import TransformModal from "../modal/TransformModal"
import Chrome from '@uiw/react-color-chrome';
import { v4 as uuidv4 } from 'uuid';

interface PolygonConfigProps {
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
}

export default function PolygonConfig({ shapes, setShapes }: PolygonConfigProps): JSX.Element {
    const [polygons, setPolygons] = useState<Polygon[]>(shapes.filter(shape => shape.type === 'polygon') as Polygon[])
    const [showModal, setShowModal] = useState<number>(-1)
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false)
    const colorPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const newShapes = shapes.filter(shape => shape.type !== 'polygon') as Shape[]

        newShapes.push(...polygons)

        setShapes(newShapes)
    }, [polygons])

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
            {/* Polygons Config */}
            <div className="flex size-full snap-y snap-mandatory flex-col gap-6 overflow-y-scroll pb-4 text-gray-100">
                {polygons.map((polygon, index) => (
                    <div key={index} >
                        {(showModal === index) && 
                            <TransformModal
                                shapes={polygons}
                                setShapes={(newShapes: Shape[]) => setPolygons(newShapes as Polygon[])}
                                shapeIndex={index}
                                onClose={() => setShowModal(-1)}
                        />}
                        {(showColorPicker) && 
                            <div ref={colorPickerRef} className="absolute left-[356px] top-2 flex size-fit flex-col gap-4 rounded-lg bg-zinc-900 p-2">
                                <Chrome
                                    color={colorToHex(polygon.color)}
                                    onChange={(color) => {
                                        const newPolygons = [...polygons]
                                        newPolygons[index].color = color.rgba
                                        setPolygons(newPolygons)
                                    }}
                                />
                            </div>
                        }
                        <div className="flex w-full snap-start flex-col gap-3 pr-2">
                            <div className="mb-1 flex w-full justify-between">
                            <div className="flex items-center justify-center gap-2">
                                    <h1 className="font-medium">Polygon {index+1}</h1>

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
                                            const newPolygons = [...polygons]
                                            newPolygons.splice(index, 1)
                                            setPolygons(newPolygons)
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
                                            setPolygons(newpolygons)
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
                                            setPolygons(newpolygons)
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
                                            setPolygons(newpolygons)
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
                                            setPolygons(newpolygons)
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
                                            value={vertex.x}
                                            onChange={(e) => {
                                                const newPolygons = [...polygons]
                                                newPolygons[index].vertices[vertexIndex].x = parseInt(e.target.value)
                                                setPolygons(newPolygons)
                                            }} />
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <p className="text-sm">Y{vertexIndex+1}</p>
                                        <Input
                                            className="w-full border-gray-700 text-gray-200"
                                            type="number"
                                            value={vertex.y}
                                            onChange={(e) => {
                                                const newPolygons = [...polygons]
                                                newPolygons[index].vertices[vertexIndex].y = parseInt(e.target.value)
                                                setPolygons(newPolygons)
                                            }} />
                                    </div>
                                    <button
                                        title={polygon.edges.some(edge => edge.start === vertex || edge.end === vertex) ? 'Cannot delete vertex because it is part of an edge' : ''}
                                        className={`text-gray-600 transition-all duration-200 ease-in-out ${
                                            polygon.edges.some(edge => edge.start === vertex) || polygon.edges.some(edge => edge.end === vertex) ? 'cursor-not-allowed' : 'hover:text-red-500'}
                                        `}
                                        disabled={
                                            // Cannot delete if there is an edge attached to the vertex
                                            polygon.edges.some(edge => edge.start === vertex) || polygon.edges.some(edge => edge.end === vertex)
                                        }
                                        onClick={() => {
                                            const newPolygons = [...polygons]
                                            newPolygons[index].vertices.splice(vertexIndex, 1)
                                            setPolygons(newPolygons)

                                            // If it is the third last vertex, remove the polygon
                                            if (newPolygons[index].vertices.length === 2) {
                                                newPolygons.splice(index, 1)
                                                setPolygons(newPolygons)
                                            }
                                        }}
                                    >
                                        <VscClose />
                                    </button>
                                </div>
                            ))}

                            {/* Add Vertex */}
                            <Button className="mb-1 w-full rounded-lg bg-zinc-800 py-1 hover:bg-gray-700"
                                onClick={() => {
                                    const newPolygons = [...polygons]
                                    newPolygons[index].vertices.push({ x: 0, y: 0 } as Point)
                                    setPolygons(newPolygons)
                                }}
                            >Add Vertex</Button>

                            {polygon.edges.map((edge, edgeIndex) => (
                                <div key={edgeIndex} className="flex w-full gap-2">
                                    <div className="flex w-full flex-col gap-2.5">
                                        <p className="text-sm">Start</p>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button className="flex w-full items-center justify-between bg-zinc-800 py-1 hover:bg-gray-700">
                                                    <p className="mt-0.5">Vertex {polygon.vertices.findIndex(vertex => vertex === edge.start) + 1}</p>
                                                    <ChevronsUpDown className="text-gray-300" size={12} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent side="bottom" className="border-gray-700 bg-zinc-800 text-white">
                                                <DropdownMenuLabel className="font-medium">Vertices</DropdownMenuLabel>
                                                <DropdownMenuSeparator className="bg-gray-700"/>
                                                <DropdownMenuRadioGroup
                                                    value={polygon.vertices.findIndex(vertex => vertex === edge.start).toString()}
                                                    onValueChange={(value) => {
                                                        const newPolygons = [...polygons]
                                                        newPolygons[index].edges[edgeIndex].start = newPolygons[index].vertices[parseInt(value)]
                                                        setPolygons(newPolygons)
                                                    }}
                                                >
                                                    {polygon.vertices.map((vertex, vertexIndex) => (
                                                        vertex !== edge.end && (
                                                            <DropdownMenuRadioItem
                                                                key={vertexIndex}
                                                                value= {vertexIndex.toString()}
                                                            >
                                                                Vertex {vertexIndex + 1}
                                                            </DropdownMenuRadioItem>
                                                        )
                                                    ))}
                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="flex w-full flex-col gap-2.5">
                                        <p className="text-sm">End</p>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button className="flex w-full items-center justify-between bg-zinc-800 py-1 hover:bg-gray-700">
                                                    <p className="mt-0.5">Vertex {polygon.vertices.findIndex(vertex => vertex === edge.end) + 1}</p>
                                                    <ChevronsUpDown className="text-gray-300" size={12} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent side="bottom" className="border-gray-700 bg-zinc-800 text-white">
                                                <DropdownMenuLabel className="font-medium">Vertices</DropdownMenuLabel>
                                                <DropdownMenuSeparator className="bg-gray-700"/>
                                                <DropdownMenuRadioGroup
                                                    value={polygon.vertices.findIndex(vertex => vertex === edge.end).toString()}
                                                    onValueChange={(value) => {
                                                        const newPolygons = [...polygons]
                                                        newPolygons[index].edges[edgeIndex].end = newPolygons[index].vertices[parseInt(value)]
                                                        setPolygons(newPolygons)
                                                    }}
                                                >
                                                    {polygon.vertices.map((vertex, vertexIndex) => (
                                                            vertex !== edge.start && (
                                                                <DropdownMenuRadioItem
                                                                    key={vertexIndex}
                                                                    value= {vertexIndex.toString()}
                                                                >
                                                                    Vertex {vertexIndex + 1}
                                                                </DropdownMenuRadioItem>
                                                            )
                                                    ))}
                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <button
                                        className="mt-7 text-gray-600 transition-all duration-200 ease-in-out hover:text-red-500"
                                        onClick={() => {
                                            const newPolygons = [...polygons]
                                            newPolygons[index].edges.splice(edgeIndex, 1)
                                            setPolygons(newPolygons)
                                        }}
                                    >
                                        <VscClose />
                                    </button>
                                </div>
                            ))}

                            {/* Add Edges */}
                            <Button className={`w-full rounded-lg bg-zinc-800 py-1 hover:bg-gray-700 ${polygon.vertices.length < 2 ? 'hidden' : ''} ${ 
                            // TODO: Think about this later
                            polygon.vertices.every((vertex, vertexIndex) => {
                                const nextIndex = vertexIndex === polygon.vertices.length - 1 ? 0 : vertexIndex + 1
                                return polygon.edges.some(edge => edge.id === `${vertexIndex}-${nextIndex}`) && polygon.edges.some(edge => edge.id === `${nextIndex}-${vertexIndex}`)
                            })} hidden`}
                                onClick={() => {
                                    const newPolygons = [...polygons]
                                    // Create a placeholder edge from the first available vertex to the second
                                    newPolygons[index].edges.push({
                                        type: 'line',
                                        id: `${0}-${1}`,
                                        start: newPolygons[index].vertices[0],
                                        end: newPolygons[index].vertices[1],
                                        color: { r: 255, g: 255, b: 255, a: 1 }
                                    } as Line)
                                    setPolygons(newPolygons)
                                }}
                            >Add Edges</Button>
                            
                            {/* Polygon Separator */}
                            {index < polygons.length - 1 && (
                                <div className="mt-4 w-full rounded border-t border-stone-800"/>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Polygon Button */}
            <div className="sticky bottom-0 flex w-full items-center justify-end bg-zinc-900 py-1 pr-2">
                <Button className="w-fit bg-zinc-800 px-4 py-1 hover:bg-gray-700"
                    onClick={() => {
                        setPolygons([
                            ...polygons,
                            {
                                id: `polygon-${uuidv4()}`,
                                type: 'polygon',
                                vertices: [
                                    { x: -5, y: 0, z:0 } as Point,
                                    { x: 0, y: 5, z:0 } as Point,
                                    { x: 5, y: 0, z:0 } as Point
                                ],
                                edges: [],
                                color: { r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255), a: 1 },
                                effect: { dx: 0, dy: 0, rotate: 0, scale: 1 }
                            } as Polygon
                        ])
                    }}
                >
                    Add Polygon
                </Button>
            </div>
        </div>
    )
}