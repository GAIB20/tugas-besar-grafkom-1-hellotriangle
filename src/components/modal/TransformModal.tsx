import { Input } from "../ui/input";
import { Shape } from "@/types/Shapes";
import { AngleIcon } from "@radix-ui/react-icons";
import { Maximize2, Minimize2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface TransformModalProps {
    shapes: Shape[];
    setShapes: (shapes: Shape[]) => void;
    shapeIndex: number;
    onClose: () => void;
}

export default function TransformModal({ shapes, setShapes, shapeIndex, onClose }: TransformModalProps): JSX.Element {
    const shape = shapes[shapeIndex];

    return (
            <div
                onClick={(e) => e.stopPropagation()}
                className="absolute left-[356px] top-2 flex size-fit flex-col gap-4 rounded-lg bg-zinc-900 p-4"
            >
                <div className="flex w-full justify-between">
                    <h2 className="text-white">Transform {shape.type.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())} {shapeIndex + 1}</h2>
                    <button className="mb-1 text-gray-400 transition-all duration-200 ease-in-out hover:text-slate-500">
                        <Minimize2 size={12} onClick={onClose} className="rotate-90" />
                    </button>
                </div>
                <div className="flex items-center justify-between gap-4 text-gray-300">
                    <div className="flex items-center gap-2">
                        <TooltipProvider>
                            <Tooltip delayDuration={10} >
                                <TooltipTrigger>
                                    <p className="font-['jsMath-cmmi10'] tracking-widest">Δx</p>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-800/95 text-sm">
                                    <p>Translate x-axis</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Input 
                            className="w-16 border border-gray-700 px-2 py-0 text-xs focus-visible:ring-0"
                            type="number"
                            value={shape.effect?.dx || 0}
                            onChange={(e) => {
                                const newShapes = shapes.filter((_, i) => i !== shapeIndex);

                                const newShape = { ...shape, effect: { ...shape.effect, dx: Number(e.target.value) } };
                                newShapes.splice(shapeIndex, 0, newShape as Shape);

                                setShapes(newShapes);
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <TooltipProvider>
                            <Tooltip delayDuration={10} >
                                <TooltipTrigger>
                                    <p className="font-['jsMath-cmmi10'] tracking-widest">Δy</p>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-800/95 text-sm">
                                    <p>Translate y-axis</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Input 
                            className="w-16 border border-gray-700 px-2 py-0 text-xs focus-visible:ring-0"
                            type="number"
                            value={shape.effect?.dy || 0}
                            onChange={(e) => {
                                const newShapes = shapes.filter((_, i) => i !== shapeIndex);

                                const newShape = { ...shape, effect: { ...shape.effect, dy: Number(e.target.value) } };
                                newShapes.splice(shapeIndex, 0, newShape as Shape);

                                setShapes(newShapes);
                            }}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4 text-gray-300">
                    <div className="flex items-center gap-4">
                        <TooltipProvider>
                            <Tooltip delayDuration={10} >
                                <TooltipTrigger>
                                    <Maximize2 size={16} className="text-gray-300" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-800/95 text-sm">
                                    <p>Scale</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Input 
                            className="w-16 border border-gray-700 px-2 py-0 text-xs focus-visible:ring-0"
                            type="number"
                            value={shape.effect?.scale || 1}
                            min={0}
                            max={10}
                            step={0.1}
                            onChange={(e) => {
                                const newShapes = shapes.filter((_, i) => i !== shapeIndex);

                                const newShape = { ...shape, effect: { ...shape.effect, scale: Number(e.target.value) } };
                                newShapes.splice(shapeIndex, 0, newShape as Shape);

                                setShapes(newShapes);
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <TooltipProvider>
                            <Tooltip delayDuration={10} >
                                <TooltipTrigger>
                                    <AngleIcon className="text-gray-300" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-800/95 text-sm">
                                    <p>Rotate °</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Input 
                            className="w-16 border border-gray-700 px-2 py-0 text-xs focus-visible:ring-0"
                            type="number"
                            value={shape.effect?.rotate || 0}
                            min={-360}
                            max={360}
                            onChange={(e) => {
                                const newShapes = shapes.filter((_, i) => i !== shapeIndex);

                                const newShape = { ...shape, effect: { ...shape.effect, rotate: Number(e.target.value) } };
                                newShapes.splice(shapeIndex, 0, newShape as Shape);

                                setShapes(newShapes);
                            }}
                        />
                    </div>
                </div>
            </div>
    )
}