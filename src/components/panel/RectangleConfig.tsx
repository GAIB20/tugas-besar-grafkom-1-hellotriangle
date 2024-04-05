import { Shape, Rectangle } from "@/types/Shapes"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { VscClose, VscWand } from "react-icons/vsc"
import { Slider } from "../ui/slider"
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
import { CornerBottomLeftIcon, CornerBottomRightIcon, CornerTopLeftIcon, CornerTopRightIcon } from "@radix-ui/react-icons"
import { Copy, RectangleHorizontal } from "lucide-react"
import buttonClick from '../../assets/button-click.mp3'
import useSound from "use-sound"

interface RectangleConfigProps {
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
}

interface ColorPickerVisibility {
    [rectangleId: string]: {
      rectangle: boolean;
      tl: boolean;
      tr: boolean;
      bl: boolean;
      br: boolean;
    };
}

interface ColorPickerRefs {
    [rectangleId: string]: {
      rectangle: HTMLElement | null;
      tl: HTMLElement | null;
			tr: HTMLElement | null;
			bl: HTMLElement | null;
			br: HTMLElement | null;
    };
}

export default function RectangleConfig({ shapes, setShapes }: RectangleConfigProps): JSX.Element {
    const [rectangles, setRectangles] = useState<Rectangle[]>(shapes.filter(shape => shape.type === 'rectangle') as Rectangle[])
    const [showModal, setShowModal] = useState<number>(-1)
    const [colorPickerVisibility, setColorPickerVisibility] = useState<ColorPickerVisibility>({});
    const colorPickerRefs = useRef<ColorPickerRefs>({});
	const [playButtonClick] = useSound(buttonClick);

    useEffect(() => {
        console.log("Rectangles Updated")
        const newShapes = shapes.filter(shape => shape.type === 'rectangle') as Rectangle[]

        if (newShapes.length !== rectangles.length) {
            setRectangles(newShapes)
        }
    }, [shapes])

    useEffect(() => {
        const newShapes = shapes.filter(shape => shape.type !== 'rectangle') as Shape[]

        newShapes.push(...rectangles)

        setShapes(newShapes)
    }, [rectangles])

    useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				const newVisibility: ColorPickerVisibility = { ...colorPickerVisibility };
				Object.keys(colorPickerRefs.current).forEach((rectangleId) => {
					Object.keys(colorPickerRefs.current[rectangleId]).forEach((pickerType) => {
						if (colorPickerRefs.current[rectangleId][pickerType as keyof ColorPickerRefs[string]] && !colorPickerRefs.current[rectangleId][pickerType as keyof ColorPickerRefs[string]]?.contains(event.target as Node)) {
							newVisibility[rectangleId] = { ...(newVisibility[rectangleId] || { rectangle: false, tl: false, tr: false, bl: false, br: false }), [pickerType]: false };
						}
					});
				});
				setColorPickerVisibility(newVisibility);
			};
		
			document.addEventListener('mousedown', handleClickOutside);
			return () => document.removeEventListener('mousedown', handleClickOutside);
		}, [colorPickerVisibility]);

    return (
        <div className="flex size-full flex-col items-center justify-between">
            {/* Rectangle Config */}
            <div className="flex size-full snap-y snap-mandatory flex-col gap-6 overflow-y-scroll pb-8 text-gray-100">
                {rectangles.map((rectangle, index) => (
                    <div key={index}>
												{/* Transform Modal */}
                        {(showModal === index) && 
                            <TransformModal
                                shapes={rectangles}
                                setShapes={(newShapes: Shape[]) => setRectangles(newShapes as Rectangle[])}
                                shapeIndex={index}
                                onClose={() => setShowModal(-1)}
                        />}

												{/* Color Pickers */}
												<div
													ref={(el) => colorPickerRefs.current[rectangle.id] = { ...colorPickerRefs.current[rectangle.id], rectangle: el }}
													style={{ display: colorPickerVisibility[rectangle.id]?.rectangle ? 'block' : 'none' }}
													className="absolute left-[356px] top-2 flex size-fit flex-col gap-4 rounded-lg bg-zinc-900 p-2"
												>
													<Chrome
														// Color is averaged from the 4 corners
														color={colorToHex({
															r: Math.round((rectangle.vertices.tl.color.r + rectangle.vertices.tr.color.r + rectangle.vertices.bl.color.r + rectangle.vertices.br.color.r) / 4),
															g: Math.round((rectangle.vertices.tl.color.g + rectangle.vertices.tr.color.g + rectangle.vertices.bl.color.g + rectangle.vertices.br.color.g) / 4),
															b: Math.round((rectangle.vertices.tl.color.b + rectangle.vertices.tr.color.b + rectangle.vertices.bl.color.b + rectangle.vertices.br.color.b) / 4),
															a: 1
														})}
														onChange={(color) => {
																const newRectangles = [...rectangles]
																newRectangles[index].vertices.tl.color = color.rgba
																newRectangles[index].vertices.tr.color = color.rgba
																newRectangles[index].vertices.bl.color = color.rgba
																newRectangles[index].vertices.br.color = color.rgba
																setRectangles(newRectangles)
														}}
													/>
												</div>

												<div
														ref={(el) => colorPickerRefs.current[rectangle.id] = { ...colorPickerRefs.current[rectangle.id], tl: el }}
														style={{ display: colorPickerVisibility[rectangle.id]?.tl ? 'block' : 'none' }}
														className="absolute left-[356px] top-2 flex size-fit flex-col gap-4 rounded-lg bg-zinc-900 p-2"
												>
													<Chrome
														color={colorToHex(rectangle.vertices.tl.color)}
														onChange={(color) => {
																const newRectangles = [...rectangles]
																newRectangles[index].vertices.tl.color = color.rgba
																setRectangles(newRectangles)
															}
														}
													/>
												</div>

												<div
														ref={(el) => colorPickerRefs.current[rectangle.id] = { ...colorPickerRefs.current[rectangle.id], tr: el }}
														style={{ display: colorPickerVisibility[rectangle.id]?.tr ? 'block' : 'none' }}
														className="absolute left-[356px] top-2 flex size-fit flex-col gap-4 rounded-lg bg-zinc-900 p-2"
												>
													<Chrome
														color={colorToHex(rectangle.vertices.tr.color)}
														onChange={(color) => {
																const newRectangles = [...rectangles]
																newRectangles[index].vertices.tr.color = color.rgba
																setRectangles(newRectangles)
															}
														}
													/>
												</div>

												<div
														ref={(el) => colorPickerRefs.current[rectangle.id] = { ...colorPickerRefs.current[rectangle.id], bl: el }}
														style={{ display: colorPickerVisibility[rectangle.id]?.bl ? 'block' : 'none' }}
														className="absolute left-[356px] top-2 flex size-fit flex-col gap-4 rounded-lg bg-zinc-900 p-2"
												>
													<Chrome
														color={colorToHex(rectangle.vertices.bl.color)}
														onChange={(color) => {
																const newRectangles = [...rectangles]
																newRectangles[index].vertices.bl.color = color.rgba
																setRectangles(newRectangles)
															}
														}
													/>
												</div>

												<div
														ref={(el) => colorPickerRefs.current[rectangle.id] = { ...colorPickerRefs.current[rectangle.id], br: el }}
														style={{ display: colorPickerVisibility[rectangle.id]?.br ? 'block' : 'none' }}
														className="absolute left-[356px] top-2 flex size-fit flex-col gap-4 rounded-lg bg-zinc-900 p-2"
												>
													<Chrome
														color={colorToHex(rectangle.vertices.br.color)}
														onChange={(color) => {
																const newRectangles = [...rectangles]
																newRectangles[index].vertices.br.color = color.rgba
																setRectangles(newRectangles)
															}
														}
													/>
												</div>	
                        
                        <div className="flex w-full snap-start flex-col gap-3 pr-2">
                            <div className="mb-1 flex w-full justify-between">
                            <div className="flex items-center justify-center gap-2">
                                    <h1 className="font-medium">Rectangle {index+1}</h1>
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
                                            const newRectangles = [...rectangles]
                                            newRectangles.splice(index, 1)
                                            setRectangles(newRectangles)
                                        }
                                    }
                                >
                                    <VscClose />
                                </button>
                            </div>

                            <div className="my-2 flex items-center justify-between px-2">
															<div className="flex items-center gap-2">
																<button
																		onClick={() => {
																				setColorPickerVisibility({
																						...colorPickerVisibility,
																						[rectangle.id]: { ...colorPickerVisibility[rectangle.id], rectangle: !colorPickerVisibility[rectangle.id]?.rectangle }
																				});
																		}}
																		style={{ backgroundColor: colorToRGBA({
																			r: Math.round((rectangle.vertices.tl.color.r + rectangle.vertices.tr.color.r + rectangle.vertices.bl.color.r + rectangle.vertices.br.color.r) / 4),
																			g: Math.round((rectangle.vertices.tl.color.g + rectangle.vertices.tr.color.g + rectangle.vertices.bl.color.g + rectangle.vertices.br.color.g) / 4),
																			b: Math.round((rectangle.vertices.tl.color.b + rectangle.vertices.tr.color.b + rectangle.vertices.bl.color.b + rectangle.vertices.br.color.b) / 4),
																			a: 1
																		}) }}
																		className="mb-0.5 aspect-square size-3 rounded-full"
																/>
																<p>
																	<RectangleHorizontal size={12} />
																</p>

															</div>
															<div className="flex items-center gap-2">
																<button
																		onClick={() => {
																				setColorPickerVisibility({
																						...colorPickerVisibility,
																						[rectangle.id]: { ...colorPickerVisibility[rectangle.id], tl: !colorPickerVisibility[rectangle.id]?.tl }
																				});
																		}}
																		style={{ backgroundColor: colorToRGBA(rectangle.vertices.tl.color) }}
																		className="mb-0.5 aspect-square size-3 rounded-full"
																/>
																<p className="text-xs">
																	<CornerTopLeftIcon />
																</p>

															</div>
															<div className="flex items-center gap-2">
																<button
																		onClick={() => {
																				setColorPickerVisibility({
																						...colorPickerVisibility,
																						[rectangle.id]: { ...colorPickerVisibility[rectangle.id], tr: !colorPickerVisibility[rectangle.id]?.tr }
																				});
																		}}
																		style={{ backgroundColor: colorToRGBA(rectangle.vertices.tr.color) }}
																		className="mb-0.5 aspect-square size-3 rounded-full"
																/>
																<p className="text-xs">
																	<CornerTopRightIcon />
																</p>

															</div>
															<div className="flex items-center gap-2">
																<button
																		onClick={() => {
																				setColorPickerVisibility({
																						...colorPickerVisibility,
																						[rectangle.id]: { ...colorPickerVisibility[rectangle.id], bl: !colorPickerVisibility[rectangle.id]?.bl }
																				});
																		}}
																		style={{ backgroundColor: colorToRGBA(rectangle.vertices.bl.color) }}
																		className="mb-0.5 aspect-square size-3 rounded-full"
																/>
																<p className="text-xs">
																	<CornerBottomLeftIcon />
																</p>

															</div>
															<div className="flex items-center gap-2">
																<button
																		onClick={() => {
																				setColorPickerVisibility({
																						...colorPickerVisibility,
																						[rectangle.id]: { ...colorPickerVisibility[rectangle.id], br: !colorPickerVisibility[rectangle.id]?.br }
																				});
																		}}
																		style={{ backgroundColor: colorToRGBA(rectangle.vertices.br.color) }}
																		className="mb-0.5 aspect-square size-3 rounded-full"
																/>
																<p className="text-xs">
																	<CornerBottomRightIcon />
																</p>

															</div>
														</div>

                            <div className="flex w-full gap-4">
                                <div className="flex items-center gap-2.5">
                                    <p className="text-sm">X</p>
                                    <Input
                                        className="w-full border-gray-700 text-gray-200"
                                        type="number"
                                        value={rectangle.start.x}
                                        onChange={(e) => {
                                            const newRectangles = [...rectangles]
                                            newRectangles[index].start.x = parseFloat(e.target.value)
                                            setRectangles(newRectangles)
                                        }} />
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <p className="text-sm">Y</p>
                                    <Input
                                        className="w-full border-gray-700 text-gray-200"
                                        type="number"
                                        value={rectangle.start.y}
                                        onChange={(e) => {
                                            const newRectangles = [...rectangles]
                                            newRectangles[index].start.y = parseFloat(e.target.value)
                                            setRectangles(newRectangles)
                                        }} />
                                </div>
                            </div>
                            <div className="mt-2 flex w-full items-center gap-3">
                                <div className="flex w-full flex-col gap-4">
                                    <p className="text-sm">Width</p>
                                    <Slider
                                        className="h-fit w-full rounded-md bg-gray-300"
                                        defaultValue={[rectangle.width]} 
                                        min={1} 
                                        max={40}
                                        onValueChange={(value) => {
                                            const newRectangles = [...rectangles]
                                            newRectangles[index].width = value[0]
                                            setRectangles(newRectangles)
                                        }} 
                                        step={1} />
                                </div>
                                <div className="flex w-full flex-col gap-4">
                                    <p className="text-sm">Height</p>
                                    <Slider
                                        className="h-fit w-full rounded-md bg-gray-300"
                                        defaultValue={[rectangle.height]} 
                                        min={1} 
                                        max={40}
                                        onValueChange={(value) => {
                                            const newRectangles = [...rectangles]
                                            newRectangles[index].height = value[0]
                                            setRectangles(newRectangles)
                                        }} 
                                        step={1} />
                                </div>
                            </div>

                            {/* Rectangle Separator */}
                            {index < rectangles.length - 1 && (
                                <div className="mt-4 w-full rounded border-t border-stone-800"/>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Rectangle Button */}
            <div className="sticky bottom-0 flex w-full items-center justify-end bg-zinc-900 py-1 pr-2">
                <Button className="w-fit bg-zinc-800 px-4 py-1 hover:bg-gray-700"
                    onClick={() => {
						playButtonClick();
						const color = { r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255), a: 1 };
                        const width = 12;
						const height = 8;
						setRectangles([
                            ...rectangles,
                            {
                                id: `rectangle-${uuidv4()}`,
                                type: 'rectangle',
                                start: { type: 'point', x: 0, y: 0, z:0, color: { r: 255, g: 255, b: 255, a: 1 } },
                                width: width,
                                height: height,
								vertices: {
									tl: { type: 'point', x: -width / 2, y: height / 2, z: 0, color },
									tr: { type: 'point', x: width / 2, y: height / 2, z: 0, color },
									bl: { type: 'point', x: -width / 2, y: -height / 2, z: 0, color },
									br: { type: 'point', x: width / 2, y: -height / 2, z: 0, color }
								},
                                effect: { dx: 0, dy: 0, rotate: 0, scale: 1 }
                            }
                        ])
                    }}
                >
                    Add Rectangle
                </Button>
            </div>
        </div>
    )
}