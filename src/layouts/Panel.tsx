import { Button } from "@/components/ui/button";
import { BiMinus, BiPolygon, BiRectangle, BiSquare } from "react-icons/bi";
import LineConfig from "@/components/panel/LineConfig";
import SquareConfig from "@/components/panel/SquareConfig";
import RectangleConfig from "@/components/panel/RectangleConfig";
import PolygonConfig from "@/components/panel/PolygonConfig";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"  
import { Shape } from "@/types/Shapes";

interface PanelProps {
    shapePanel: 'line' | 'square' | 'rectangle' | 'polygon',
    setShapePanel: (shape: 'line' | 'square' | 'rectangle' | 'polygon') => void
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
}

export default function Panel({ shapePanel, setShapePanel, shapes, setShapes }: PanelProps): JSX.Element {

  return (
    <div className="flex h-full w-[480px] overflow-hidden shadow">
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
                    <TooltipContent side="right" className="border-0 bg-gray-700/95 text-sm text-white shadow-md">
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
                    <TooltipContent side="right" className="border-0 bg-gray-700/95 text-sm text-white shadow-md">
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
                    <TooltipContent side="right" className="border-0 bg-gray-700/95 text-sm text-white shadow-md">
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
                    <TooltipContent side="right" className="border-0 bg-gray-700/95 text-sm text-white shadow-md">
                        <p>Polygon</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>

        <div className="flex size-full flex-col justify-center bg-zinc-900 px-4 py-5">
            {shapePanel === "line" ? (
                <LineConfig shapes={shapes} setShapes={setShapes} />
            ) : shapePanel === "square" ? (
                <SquareConfig shapes={shapes} setShapes={setShapes} />
            ) : shapePanel === "rectangle" ? (
                <RectangleConfig shapes={shapes} setShapes={setShapes} />
            ) : (
                <PolygonConfig />
            )}
        </div>
    </div>
    )
}
