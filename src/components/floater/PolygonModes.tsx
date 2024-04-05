import { Pentagon } from "lucide-react";
import { PiBezierCurve } from "react-icons/pi";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"  
import { Button } from "../ui/button";

interface PolygonModesProps {
    polygonMode: 'convex' | 'free';
    onPolygonModeChange: (mode: 'convex' | 'free') => void;
}

const PolygonModes = ({ polygonMode, onPolygonModeChange }: PolygonModesProps) => {
    return (
        <div className="absolute right-4 top-4 flex gap-1.5 rounded-xl bg-zinc-800 p-2">
            <TooltipProvider>
                <Tooltip delayDuration={20}>
                    <TooltipTrigger>
                        <Button className={`aspect-square size-8 p-1 hover:bg-gray-700 ${polygonMode === "convex" ? "bg-gray-700" : ""}`}
                            onClick={() => onPolygonModeChange('convex')}
                            >
                            <Pentagon size={14} className="text-gray-300" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="border-0 bg-gray-700/95 text-sm text-white shadow-md">
                        <p>Convex</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip delayDuration={20}>
                    <TooltipTrigger>
                        <Button className={`aspect-square size-8 p-1 hover:bg-gray-700 ${polygonMode === "free" ? "bg-gray-700" : ""}`}
                            onClick={() => onPolygonModeChange('free')}
                            >
                            <PiBezierCurve size={14} className="text-gray-300" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="border-0 bg-gray-700/95 text-sm text-white shadow-md">
                        <p>Free</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}

export default PolygonModes;