import { Input } from "../ui/input";
import { Shape } from "@/types/Shapes";
import { AngleIcon } from "@radix-ui/react-icons";
import { Maximize2, Minimize2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface TransformModalProps {
    shape: Shape;
    shapeIndex: number;
    onClose: () => void;
}

export default function TransformModal({ shape, shapeIndex, onClose }: TransformModalProps): JSX.Element {
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
                            defaultValue={0}
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
                            defaultValue={0}
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
                            defaultValue={0}
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
                            defaultValue={0}
                            min={-360}
                            max={360}
                        />
                    </div>
                </div>
            </div>
    )
}