import { Shape, Square } from "@/types/Shapes"
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
import { Copy, Square as SquareIcon } from "lucide-react"
import buttonClick from '../../assets/button-click.mp3'
import useSound from "use-sound"

interface SquareConfigProps {
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
}

interface ColorPickerVisibility {
    [squareId: string]: {
      square: boolean;
      tl: boolean;
      tr: boolean;
      bl: boolean;
      br: boolean;
    };
}

interface ColorPickerRefs {
    [squareId: string]: {
      square: HTMLElement | null;
      tl: HTMLElement | null;
			tr: HTMLElement | null;
			bl: HTMLElement | null;
			br: HTMLElement | null;
    };
}

export default function SquareConfig({ shapes, setShapes }: SquareConfigProps): JSX.Element {
    const [squares, setSquares] = useState<Square[]>(shapes.filter(shape => shape.type === 'square') as Square[])
    const [showModal, setShowModal] = useState<number>(-1)
    const [colorPickerVisibility, setColorPickerVisibility] = useState<ColorPickerVisibility>({});
    const colorPickerRefs = useRef<ColorPickerRefs>({});
	const [playButtonClick] = useSound(buttonClick)

    useEffect(() => {
        console.log("Squares updated");
        const newShapes = shapes.filter(shape => shape.type === 'square') as Square[]

        if (newShapes.length !== squares.length) {
            setSquares(newShapes)
        }
    }, [shapes])

    useEffect(() => {
        const newShapes = shapes.filter(shape => shape.type !== 'square') as Shape[]

        newShapes.push(...squares)

        setShapes(newShapes)
    }, [squares])

    useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				const newVisibility: ColorPickerVisibility = { ...colorPickerVisibility };
				Object.keys(colorPickerRefs.current).forEach((squareId) => {
					Object.keys(colorPickerRefs.current[squareId]).forEach((pickerType) => {
						if (colorPickerRefs.current[squareId][pickerType as keyof ColorPickerRefs[string]] && !colorPickerRefs.current[squareId][pickerType as keyof ColorPickerRefs[string]]?.contains(event.target as Node)) {
							newVisibility[squareId] = { ...(newVisibility[squareId] || { square: false, tl: false, tr: false, bl: false, br: false }), [pickerType]: false };
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
            {/* Square Config */}
            <div className="flex size-full snap-y snap-mandatory flex-col gap-6 overflow-y-scroll pb-8 text-gray-100">
                {squares.map((square, index) => (
                    <div key={index} >
						{/* Transform Modal */}
                        {(showModal === index) && 
                            <TransformModal
                                shapes={squares}
                                setShapes={(newShapes: Shape[]) => setSquares(newShapes as Square[])}
                                shapeIndex={index}
                                onClose={() => setShowModal(-1)}
                        />}

												{/* Color Pickers */}
												<div
													ref={(el) => colorPickerRefs.current[square.id] = { ...colorPickerRefs.current[square.id], square: el }}
													style={{ display: colorPickerVisibility[square.id]?.square ? 'block' : 'none' }}
													className="absolute left-[356px] top-2 flex size-fit flex-col gap-4 rounded-lg bg-zinc-900 p-2"
												>
													<Chrome
														// Color is averaged from the 4 corners
														color={colorToHex({
															r: Math.round((square.vertices.tl.color.r + square.vertices.tr.color.r + square.vertices.bl.color.r + square.vertices.br.color.r) / 4),
															g: Math.round((square.vertices.tl.color.g + square.vertices.tr.color.g + square.vertices.bl.color.g + square.vertices.br.color.g) / 4),
															b: Math.round((square.vertices.tl.color.b + square.vertices.tr.color.b + square.vertices.bl.color.b + square.vertices.br.color.b) / 4),
															a: 1
														})}
														onChange={(color) => {
																const newSquares = [...squares]
																newSquares[index].vertices.tl.color = color.rgba
																newSquares[index].vertices.tr.color = color.rgba
																newSquares[index].vertices.bl.color = color.rgba
																newSquares[index].vertices.br.color = color.rgba
																setSquares(newSquares)
														}}
													/>
												</div>

												<div
														ref={(el) => colorPickerRefs.current[square.id] = { ...colorPickerRefs.current[square.id], tl: el }}
														style={{ display: colorPickerVisibility[square.id]?.tl ? 'block' : 'none' }}
														className="absolute left-[356px] top-2 flex size-fit flex-col gap-4 rounded-lg bg-zinc-900 p-2"
												>
													<Chrome
														color={colorToHex(square.vertices.tl.color)}
														onChange={(color) => {
																const newSquares = [...squares]
																newSquares[index].vertices.tl.color = color.rgba
																setSquares(newSquares)
															}
														}
													/>
												</div>

												<div
														ref={(el) => colorPickerRefs.current[square.id] = { ...colorPickerRefs.current[square.id], tr: el }}
														style={{ display: colorPickerVisibility[square.id]?.tr ? 'block' : 'none' }}
														className="absolute left-[356px] top-2 flex size-fit flex-col gap-4 rounded-lg bg-zinc-900 p-2"
												>
													<Chrome
														color={colorToHex(square.vertices.tr.color)}
														onChange={(color) => {
																const newSquares = [...squares]
																newSquares[index].vertices.tr.color= color.rgba
																setSquares(newSquares)
															}
														}
													/>
												</div>

												<div
														ref={(el) => colorPickerRefs.current[square.id] = { ...colorPickerRefs.current[square.id], bl: el }}
														style={{ display: colorPickerVisibility[square.id]?.bl ? 'block' : 'none' }}
														className="absolute left-[356px] top-2 flex size-fit flex-col gap-4 rounded-lg bg-zinc-900 p-2"
												>
													<Chrome
														color={colorToHex(square.vertices.bl.color)}
														onChange={(color) => {
																const newSquares = [...squares]
																newSquares[index].vertices.bl.color = color.rgba
																setSquares(newSquares)
															}
														}
													/>
												</div>

												<div
														ref={(el) => colorPickerRefs.current[square.id] = { ...colorPickerRefs.current[square.id], br: el }}
														style={{ display: colorPickerVisibility[square.id]?.br ? 'block' : 'none' }}
														className="absolute left-[356px] top-2 flex size-fit flex-col gap-4 rounded-lg bg-zinc-900 p-2"
												>
													<Chrome
														color={colorToHex(square.vertices.br.color)}
														onChange={(color) => {
																const newSquares = [...squares]
																newSquares[index].vertices.br.color = color.rgba
																setSquares(newSquares)
															}
														}
													/>
												</div>	

                        <div className="flex w-full snap-start flex-col gap-3 pr-2">
                            <div className="mb-1 flex w-full justify-between">
                                <div className="flex items-center justify-center gap-2">
                                    <h1 className="font-medium">Square {index+1}</h1>
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
                                            const newSquares = [...squares]
                                            newSquares.splice(index, 1)
                                            setSquares(newSquares)
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
																						[square.id]: { ...colorPickerVisibility[square.id], square: !colorPickerVisibility[square.id]?.square }
																				});
																		}}
																		style={{ backgroundColor: colorToRGBA({
																			r: Math.round((square.vertices.tl.color.r + square.vertices.tr.color.r + square.vertices.bl.color.r + square.vertices.br.color.r) / 4),
																			g: Math.round((square.vertices.tl.color.g + square.vertices.tr.color.g + square.vertices.bl.color.g + square.vertices.br.color.g) / 4),
																			b: Math.round((square.vertices.tl.color.b + square.vertices.tr.color.b + square.vertices.bl.color.b + square.vertices.br.color.b) / 4),
																			a: 1
																		}) }}
																		className="mb-0.5 aspect-square size-3 rounded-full"
																/>
																<p>
																	<SquareIcon size={12} />
																</p>

															</div>
															<div className="flex items-center gap-2">
																<button
																		onClick={() => {
																				setColorPickerVisibility({
																						...colorPickerVisibility,
																						[square.id]: { ...colorPickerVisibility[square.id], tl: !colorPickerVisibility[square.id]?.tl }
																				});
																		}}
																		style={{ backgroundColor: colorToRGBA(square.vertices.tl.color)}}
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
																						[square.id]: { ...colorPickerVisibility[square.id], tr: !colorPickerVisibility[square.id]?.tr }
																				});
																		}}
																		style={{ backgroundColor: colorToRGBA(square.vertices.tr.color)}}
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
																						[square.id]: { ...colorPickerVisibility[square.id], bl: !colorPickerVisibility[square.id]?.bl }
																				});
																		}}
																		style={{ backgroundColor: colorToRGBA(square.vertices.bl.color)}}
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
																						[square.id]: { ...colorPickerVisibility[square.id], br: !colorPickerVisibility[square.id]?.br }
																				});
																		}}
																		style={{ backgroundColor: colorToRGBA(square.vertices.br.color)}}
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
                                        value={square.start.x}
                                        onChange={(e) => {
                                            const newSquares = [...squares]
                                            newSquares[index].start.x = parseFloat(e.target.value)
                                            setSquares(newSquares)
                                        }} />
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <p className="text-sm">Y</p>
                                    <Input
                                        className="w-full border-gray-700 text-gray-200"
                                        type="number"
                                        value={square.start.y}
                                        onChange={(e) => {
                                            const newSquares = [...squares]
                                            newSquares[index].start.y = parseFloat(e.target.value)
                                            setSquares(newSquares)
                                        }} />
                                </div>
                            </div>
                            <div className="mt-1 flex w-full flex-col gap-4">
                                <p className="text-sm">Side Length</p>
                                <Slider
                                    className="h-fit w-full rounded-md bg-gray-300"
                                    defaultValue={[square.sideLength]} 
                                    min={1} 
                                    max={40} 
                                    onValueChange={(value) => {
                                        const newSquares = [...squares]
                                        newSquares[index].sideLength = value[0]
                                        setSquares(newSquares)
                                    }}
                                    step={0.5} />
                            </div>

                            {/* Square Separator */}
                            {index < squares.length - 1 && (
                                <div className="mt-4 w-full rounded border-t border-stone-800"/>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Square Button */}
            <div className="sticky bottom-0 flex w-full items-center justify-end bg-zinc-900 py-1 pr-2">
                <Button className="w-fit bg-zinc-800 px-4 py-1 hover:bg-gray-700"
                    onClick={() => {
						playButtonClick();
                        const color = { r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255), a: 1 }
                        setSquares([
                            ...squares,
                            {
                                id: `square-${uuidv4()}`,
                                type: 'square',
                                start: { type: 'point', x: 0, y: 0, z:0, color: { r: 255, g: 255, b: 255, a: 1 } },
                                sideLength: 10,
                                vertices: { 
									bl: { x: -5, y: -5, color: color, z: 0, type: 'point' }, 
									tl: { x: -5, y: 5, color: color, z: 0, type: 'point'}, 
									tr: { x: 5, y: 5, color: color, z: 0, type: 'point'}, 
									br: { x: 5, y: -5, color: color, z: 0, type: 'point'} 
								},
                                effect: { dx: 0, dy: 0, rotate: 0, scale: 1 }
                            }
                        ])
                    }}
                >
                    Add Square
                </Button>
            </div>
        </div>
    )
}