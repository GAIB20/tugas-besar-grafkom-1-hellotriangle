import { Button } from "@/components/ui/button";
import { BiMinus, BiPolygon, BiRectangle, BiSquare } from "react-icons/bi";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"  

interface PanelProps {
    shapePanel: 'line' | 'square' | 'rectangle' | 'polygon',
    setShapePanel: (shape: 'line' | 'square' | 'rectangle' | 'polygon') => void
}

export default function Panel({ shapePanel, setShapePanel }: PanelProps): JSX.Element {
  return (
    <div className="flex h-full w-[480px] overflow-hidden">
        <div className="flex w-fit flex-col gap-3 bg-zinc-950 px-2 py-4">
            <TooltipProvider>
                <Tooltip delayDuration={20}>
                    <TooltipTrigger>
                        <Button className={`aspect-square w-fit p-1 hover:bg-gray-700 ${shapePanel === "line" ? "bg-gray-700" : ""}`}
                            onClick={() => setShapePanel('line')}
                            >
                            <BiMinus size={16} className="text-gray-300" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="border-0 bg-gray-900/90 text-white shadow-md">
                        <p>Line</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip delayDuration={20}>
                    <TooltipTrigger>
                        <Button className={`aspect-square w-fit p-1 hover:bg-gray-700 ${shapePanel === "square" ? "bg-gray-700" : ""}`}
                            onClick={() => setShapePanel('square')}
                        >
                            <BiSquare size={16} className="text-gray-300" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="border-0 bg-gray-900/90 text-white shadow-md">
                        <p>Square</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip delayDuration={20}>
                    <TooltipTrigger>
                        <Button className={`aspect-square w-fit p-1 hover:bg-gray-700 ${shapePanel === "rectangle" ? "bg-gray-700" : ""}`}
                            onClick={() => setShapePanel('rectangle')}
                        >
                            <BiRectangle size={16} className="text-gray-300" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="border-0 bg-gray-900/90 text-white shadow-md">
                        <p>Rectangle</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip delayDuration={20}>
                    <TooltipTrigger>
                        <Button className={`aspect-square w-fit p-1 hover:bg-gray-700 ${shapePanel === "polygon" ? "bg-gray-700" : ""}`}
                            onClick={() => setShapePanel('polygon')}
                        >
                            <BiPolygon size={16} className="text-gray-300" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="border-0 bg-gray-900/90 text-white shadow-md">
                        <p>Polygon</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>

        <div className="size-full bg-zinc-900 p-4">
            <div className="flex size-full flex-col">

            </div>
        </div>
    </div>
    )
}
