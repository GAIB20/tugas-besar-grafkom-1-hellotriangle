import { Button } from "@/components/ui/button";
import { BiMinus, BiPolygon } from "react-icons/bi";
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
import { Polygon, Shape } from "@/types/Shapes";
import { CloudDownload, CloudUpload, Combine } from "lucide-react";
import { toast } from 'react-toastify';
import { AiOutlineClear } from "react-icons/ai";
import { RectangleHorizontal, Square } from "lucide-react";
import { convexHull } from "@/lib/convexHull";
import { v4 as uuidV4 } from 'uuid';

interface PanelProps {
    shapePanel: 'line' | 'square' | 'rectangle' | 'polygon',
    setShapePanel: (shape: 'line' | 'square' | 'rectangle' | 'polygon') => void
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
    polygonMode: 'convex' | 'free'
}

export default function Panel({ shapePanel, setShapePanel, shapes, setShapes, polygonMode }: PanelProps): JSX.Element {

    const handleUploadShapes = () => {
			const input = document.createElement('input');
			input.type = 'file';
			input.accept = '.json';
			input.onchange = async (e) => {
				const file = (e.target as HTMLInputElement).files?.[0];
				if (file) {
					const reader = new FileReader();
					reader.onload = async (e) => {
						try {
								const content = e.target?.result;
								if (typeof content === 'string') {
										const data = JSON.parse(content);
										setShapes(data);
										setShapePanel('line'); // Refresh panel state
										toast.success('Shapes imported successfully!');
								}
						} catch (error) {
								toast.error('Error reading file!');
						}
					};
					reader.onerror = () => {
						toast.error('Not a valid shapes file!');
					};
					reader.readAsText(file);
				}
			};
			input.click();
	};


	const handleDownloadShapes = () => {
			try {
					const data = JSON.stringify(shapes, null, 2);
					const blob = new Blob([data], { type: 'application/json' });
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = 'shapes.json';
					a.click();
					URL.revokeObjectURL(url);
					toast.success('Shapes exported successfully!');
			} catch (error) {
					toast.error('Error exporting shapes!');
			}
		};

		const handleClearCanvas = () => {
				setShapes([]);
		toast.success('Canvas cleared!');
	}

    const handleCombineShapes = () => {

        if (shapes.length < 2) {
            toast.error('Have at least two shapes to combine!');
            return;
        }

        const newVertices = convexHull(shapes);

        if (newVertices.length < 3) {
            toast.error('Have at least three vertices to combine!');
            return;
        }

        const newPolygon = {
            id: `polygon-${uuidV4()}`,
            type: 'polygon',
            vertices: newVertices,
            effect: {
                dx: 0,
                dy: 0,
                rotate: 0,
                scale: 1
            }
        } as Polygon;

        setShapes([newPolygon]);
        setShapePanel('polygon');

        toast.success('Shapes Combined!');
    }

    return (
        <div className="flex h-full w-[480px] overflow-hidden shadow">
            <div className="flex w-fit flex-col justify-between bg-[#111111] px-2 py-4">
                <div className="flex flex-col gap-3">
                    <TooltipProvider>
                        <Tooltip delayDuration={20}>
                            <TooltipTrigger>
                                <Button className={`aspect-square w-fit p-1 hover:bg-gray-700 ${shapePanel === "line" ? "bg-gray-700" : ""}`}
                                    onClick={() => setShapePanel('line')}
                                    >
                                    <BiMinus size={16} className="rotate-45 text-gray-300" />
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
                                    <Square size={16} className="text-gray-300" />
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
                                    <RectangleHorizontal size={16} className="text-gray-300" />
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
                    <TooltipProvider>
                        <Tooltip delayDuration={20}>
                            <TooltipTrigger>
                                <Button className={`aspect-square w-fit p-1 hover:bg-gray-700`}
                                    onClick={() => handleCombineShapes()}
                                >
                                    <Combine size={16} className="text-gray-300" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="border-0 bg-gray-700/95 text-sm text-white shadow-md">
                                <p>Combine Shapes</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip delayDuration={20}>
                            <TooltipTrigger>
                                <Button className={`aspect-square w-fit p-1 hover:bg-red-700 active:bg-red-900`}
                                    onClick={handleClearCanvas}
                                >
                                    <AiOutlineClear size={16} className="text-gray-300" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="border-0 bg-gray-700/95 text-sm text-white shadow-md">
                                <p>Clear canvas</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <div className="mb-1 flex flex-col gap-3">
                    <TooltipProvider>
                        <Tooltip delayDuration={20}>
                            <TooltipTrigger>
                                <Button className={`aspect-square w-fit p-1 hover:bg-gray-700`}
                                    onClick={handleUploadShapes}
                                >
                                    <CloudUpload size={16} className="text-gray-300" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="border-0 bg-gray-700/95 text-sm text-white shadow-md">
                                <p>Upload JSON</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip delayDuration={20}>
                            <TooltipTrigger>
                                <Button className={`aspect-square w-fit p-1 hover:bg-gray-700`}
                                    onClick={handleDownloadShapes}
                                >
                                    <CloudDownload size={16} className="text-gray-300" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="border-0 bg-gray-700/95 text-sm text-white shadow-md">
                                <p>Download JSON</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            <div className="flex size-full flex-col justify-center bg-zinc-900 py-5 pl-4 pr-1">
                {shapePanel === "line" ? (
                    <LineConfig shapes={shapes} setShapes={setShapes} />
                ) : shapePanel === "square" ? (
                    <SquareConfig shapes={shapes} setShapes={setShapes} />
                ) : shapePanel === "rectangle" ? (
                    <RectangleConfig shapes={shapes} setShapes={setShapes} />
                ) : (
                    <PolygonConfig shapes={shapes} setShapes={setShapes} polygonMode={polygonMode} />
                )}
            </div>
        </div>
    )
}
