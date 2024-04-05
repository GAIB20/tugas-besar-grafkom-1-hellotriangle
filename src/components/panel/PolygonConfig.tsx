import { Shape, Polygon, Point } from "@/types/Shapes"
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
import { useEffect, useRef, useState } from "react"
import TransformModal from "../modal/TransformModal"
import Chrome from '@uiw/react-color-chrome';
import { v4 as uuidv4 } from 'uuid';
import buttonClick from '../../assets/button-click.mp3'
import useSound from "use-sound"
import { convexHull } from "@/lib/convexHull"
import { Copy } from "lucide-react"

interface PolygonConfigProps {
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
    polygonMode: 'convex' | 'free';
}

interface ColorPickerVisibility {
  [key: string]: boolean;
}

interface ColorPickerRefs {
  [key: string]: HTMLDivElement | null;
}


export default function PolygonConfig({ shapes, setShapes, polygonMode }: PolygonConfigProps): JSX.Element {
    const [polygons, setPolygons] = useState<Polygon[]>(shapes.filter(shape => shape.type === 'polygon') as Polygon[])
    const [showModal, setShowModal] = useState<number>(-1)
    const [colorPickerVisibility, setColorPickerVisibility] = useState<ColorPickerVisibility>({});
    const colorPickerRefs = useRef<ColorPickerRefs>({});
    const [playButtonClick] = useSound(buttonClick);

    useEffect(() => {
        console.log("Polygons updated");

        const newShapes = shapes.filter(shape => shape.type === 'polygon') as Polygon[]

        // Enforce all polygons to be convex if the mode is set to convex
        if (polygonMode === "convex") {
            newShapes.forEach(polygon => {
                polygon.vertices = convexHull([polygon]);
            })
        }

        if (newShapes.length !== polygons.length) {
            setPolygons(newShapes)
        }
    }, [shapes])

    useEffect(() => {
        const newShapes = shapes.filter(shape => shape.type !== 'polygon') as Shape[]

        newShapes.push(...polygons)

        setShapes(newShapes)
    }, [polygons])

    // Effect for handling clicks outside to close color pickers
		useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				Object.entries(colorPickerRefs.current).forEach(([key, ref]) => {
					// If click is outside a color picker, hide it
					if (ref && !ref.contains(event.target as Node)) {
						setColorPickerVisibility(prev => ({ ...prev, [key]: false }));
					}
				});
			};

			// Attach the event listener
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				// Cleanup the event listener
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}, []);

    function calculateCentroid(vertices: Point[]) {
        const centroid = { x: 0, y: 0 };
        vertices.forEach(vertex => {
            centroid.x += vertex.x;
            centroid.y += vertex.y;
        });
        centroid.x /= vertices.length;
        centroid.y /= vertices.length;
        return centroid;
    }

    function findClosestEdge(vertices: Point[]) {
        const centroid = calculateCentroid(vertices);
        let closestEdge = { index: 0, distance: Infinity };
    
        vertices.forEach((vertex, index) => {
            const nextVertex = vertices[(index + 1) % vertices.length];
            const midPoint = {
                x: (vertex.x + nextVertex.x) / 2,
                y: (vertex.y + nextVertex.y) / 2
            };
            const distance = Math.hypot(midPoint.x - centroid.x, midPoint.y - centroid.y);
            if (distance < closestEdge.distance) {
                closestEdge = { index, distance };
            }
        });
    
        return closestEdge.index;
    }
    
    function insertVertexOutside(vertices: Point[], edgeIndex: number) {
        const centroid = calculateCentroid(vertices);
        const vertex = vertices[edgeIndex];
        const nextVertex = vertices[(edgeIndex + 1) % vertices.length];
        const midPoint = {
            x: (vertex.x + nextVertex.x) / 2,
            y: (vertex.y + nextVertex.y) / 2
        };
    
        // Calculate vector from centroid to midpoint
        let direction = { x: midPoint.x - centroid.x, y: midPoint.y - centroid.y };
        const magnitude = Math.hypot(direction.x, direction.y);
    
        // Normalize the direction vector
        direction = { x: direction.x / magnitude, y: direction.y / magnitude };
    
        // Extend the midpoint slightly outside the polygon
        const extensionDistance = 4;
        const newVertex = {
            x: midPoint.x + direction.x * extensionDistance,
            y: midPoint.y + direction.y * extensionDistance,
            z: 0,
            color: { r: Math.floor(vertex.color.r), g: Math.floor(vertex.color.g), b: Math.floor(vertex.color.b), a: 1 }
        };
    
        vertices.splice(edgeIndex + 1, 0, newVertex as Point);
    
        return vertices;
    }

    const handleVertexColorChange = (polygonId: string, vertexIndex: number, color: { r: number, g: number, b: number, a: number }) => {
			const updatedPolygons = polygons.map(polygon => {
				if (polygon.id === polygonId) {
					// Update the color of the specific vertex
					const updatedVertices = polygon.vertices.map((vertex, vIndex) => {
						if (vIndex === vertexIndex) {
							return { ...vertex, color };
						}
						return vertex;
					});
					return { ...polygon, vertices: updatedVertices };
				}
				return polygon;
			});
		
			setPolygons(updatedPolygons);
		};

    return (
        <div className="flex size-full flex-col items-center justify-between">
            {/* Polygons Config */}
            <div className="flex size-full snap-y snap-mandatory flex-col gap-6 overflow-y-scroll pb-4 text-gray-100">
                {polygons.map((polygon, index) => (
                    <div key={index} >
                        {/* Transform Modal */}
                        {(showModal === index) && 
                            <TransformModal
                                shapes={polygons}
                                setShapes={(newShapes: Shape[]) => setPolygons(newShapes as Polygon[])}
                                shapeIndex={index}
                                onClose={() => setShowModal(-1)}
                        />}
                        
                        {/* Color Pickers */}
                        <div
													ref={(el) => colorPickerRefs.current[`polygon-${polygon.id}-all`] = el}
													style={{ display: colorPickerVisibility[`polygon-${polygon.id}-all`] ? 'block' : 'none' }}
													className="absolute left-[356px] top-2 flex size-fit flex-col gap-4 rounded-lg bg-zinc-900 p-2"
												>
													<Chrome
														color={colorToHex({
															r: Math.floor(polygon.vertices.reduce((acc, vertex) => acc + vertex.color.r, 0) / polygon.vertices.length),
															g: Math.floor(polygon.vertices.reduce((acc, vertex) => acc + vertex.color.g, 0) / polygon.vertices.length),
															b: Math.floor(polygon.vertices.reduce((acc, vertex) => acc + vertex.color.b, 0) / polygon.vertices.length),
															a: 1.0
														})}
														onChange={(color) => {
															// Update polygon-wide colors without debounce for immediate feedback
															const newPolygons = polygons.map((p) => {
																if (p.id === polygon.id) {
																	// Update all vertex colors to the new color
																	const updatedVertices = p.vertices.map(vertex => ({
																		...vertex,
																		color: {
																			r: color.rgba.r,
																			g: color.rgba.g,
																			b: color.rgba.b,
																			a: color.rgba.a,
																		}
																	}));
																	return { ...p, vertices: updatedVertices };
																}
																return p;
															});
															setPolygons(newPolygons);
														}}
													/>
												</div>

												{polygons.map((polygon) => (
													polygon.vertices.map((vertex, vIndex) => {
														const pickerKey = `polygon-${polygon.id}-vertex-${vIndex}`;
														return (
															<div key={vIndex}>																
																{/* Vertex color picker */}
																{colorPickerVisibility[pickerKey] && (
																	<div
																		ref={(el) => (colorPickerRefs.current[pickerKey] = el)}
																		className="absolute left-[356px] top-2 flex size-fit flex-col gap-4 rounded-lg bg-zinc-900 p-2"
																	>
																		<Chrome
																			color={colorToHex(vertex.color)}
																			onChange={(color) => handleVertexColorChange(polygon.id, vIndex, color.rgba)}
																		/>
																	</div>
																)}
															</div>
														);
													})
												))}

                        {/* Polygon Config */}
                        <div className="flex w-full snap-start flex-col gap-3 pr-2">
                            <div className="mb-1 flex w-full justify-between">
                            <div className="flex items-center justify-center gap-2">
                                    <h1 className="font-medium">Polygon {index+1}</h1>
                                    <TooltipProvider>
                                        <Tooltip delayDuration={20}>
                                            <TooltipTrigger>
                                                <button className="flex h-full flex-col items-center" onClick={() => {}} >
                                                    <Copy className="mb-0.5 ml-1 text-gray-300" size={14} />
                                                </button>
                                            </TooltipTrigger>

                                            <TooltipContent side="bottom" className="border-0 bg-gray-700/95 text-sm text-white shadow-md">
                                                <p>Duplicate</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
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
                                        onClick={() => {
																					const pickerKey = `polygon-${polygon.id}-all`;
																					const newVisibility = { ...colorPickerVisibility };
																					newVisibility[pickerKey] = !newVisibility[pickerKey];
																					setColorPickerVisibility(newVisibility);
                                        }}
                                        style={{ backgroundColor: colorToRGBA({
                                            r: Math.floor(polygon.vertices.reduce((acc, vertex) => acc + vertex.color.r, 0) / polygon.vertices.length),
                                            g: Math.floor(polygon.vertices.reduce((acc, vertex) => acc + vertex.color.g, 0) / polygon.vertices.length),
                                            b: Math.floor(polygon.vertices.reduce((acc, vertex) => acc + vertex.color.b, 0) / polygon.vertices.length),
                                            a: 1.0
                                        }) }}
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
                                        value={Math.floor(polygon.vertices.reduce((acc, vertex) => acc + vertex.color.r, 0) / polygon.vertices.length)}
                                        onChange={(e) => {
                                            const newpolygons = [...polygons]
                                            newpolygons[index].vertices.forEach(vertex => vertex.color.r = parseInt(e.target.value))
                                            setPolygons(newpolygons)
                                        }}
                                    />
                                    <Input
                                        className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                        type="number"
                                        min={0}
                                        max={255}
                                        value={Math.floor(polygon.vertices.reduce((acc, vertex) => acc + vertex.color.g, 0) / polygon.vertices.length)}
                                        onChange={(e) => {
                                            const newpolygons = [...polygons]
                                            newpolygons[index].vertices.forEach(vertex => vertex.color.g = parseInt(e.target.value))
                                            setPolygons(newpolygons)
                                        }}
                                    />
                                    <Input
                                        className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                        type="number"
                                        min={0}
                                        max={255}
                                        value={Math.floor(polygon.vertices.reduce((acc, vertex) => acc + vertex.color.b, 0) / polygon.vertices.length)}
                                        onChange={(e) => {
                                            const newpolygons = [...polygons]
                                            newpolygons[index].vertices.forEach(vertex => vertex.color.b = parseInt(e.target.value))
                                            setPolygons(newpolygons)
                                        }}
                                    />
                                    <Input
                                        className="w-full border-none p-0 text-center text-xs focus:border-none focus:ring-0"
                                        type="number"
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={Math.floor(polygon.vertices.reduce((acc, vertex) => acc + vertex.color.a, 0) / polygon.vertices.length)}
                                        onChange={(e) => {
                                            const newpolygons = [...polygons]
                                            newpolygons[index].vertices.forEach(vertex => vertex.color.a = parseFloat(e.target.value))
                                            setPolygons(newpolygons)
                                        }}
                                    />
                                </div>

                            </div> 

                            {polygon.vertices.map((vertex, vertexIndex) => (
                                <div key={vertexIndex} className="flex w-full items-center gap-2.5">
                                    <button
                                        onClick={() => {
																					const pickerKey = `polygon-${polygon.id}-vertex-${vertexIndex}`;
																					const newVisibility = { ...colorPickerVisibility };
																					newVisibility[pickerKey] = !newVisibility[pickerKey];
																					setColorPickerVisibility(newVisibility);
                                        }}
                                        style={{ backgroundColor: colorToRGBA({
                                            r: vertex.color.r,
                                            g: vertex.color.g,
                                            b: vertex.color.b,
                                            a: 1
                                        }) }}
                                        className="mb-0.5 ml-2 aspect-square size-3 rounded-full"
                                    />
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
                                        className={`text-gray-600 transition-all duration-200 ease-in-out`}
                                        onClick={() => {
                                            const newPolygons = [...polygons]
                                            newPolygons[index].vertices.splice(vertexIndex, 1)

                                            // If it is the third last vertex, remove the polygon
                                            if (newPolygons[index].vertices.length === 2) {
                                                newPolygons.splice(index, 1)
                                            }
                                            setPolygons(newPolygons)
                                        }}
                                    >
                                        <VscClose />
                                    </button>
                                </div>
                            ))}

                            {/* Add Vertex */}
                            <Button className="mb-1 w-full rounded-lg bg-zinc-800 py-1 hover:bg-gray-700"
                                onClick={() => {
                                    const newPolygons = [...polygons];
                                    const edgeIndex = findClosestEdge(newPolygons[index].vertices);
                                    newPolygons[index].vertices = insertVertexOutside(newPolygons[index].vertices, edgeIndex);
                                    setPolygons(newPolygons);
                                }}
                            >Add Vertex</Button>
                            
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
                        playButtonClick();
                        const color = { r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255), a: 1 };
                        setPolygons([
                            ...polygons,
                            {
                                id: `polygon-${uuidv4()}`,
                                type: 'polygon',
                                vertices: [
                                    { x: -5, y: 0, z:0, color: color } as Point,
                                    { x: 0, y: 5, z:0, color: color } as Point,
                                    { x: 5, y: 0, z:0, color: color } as Point
                                ],
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