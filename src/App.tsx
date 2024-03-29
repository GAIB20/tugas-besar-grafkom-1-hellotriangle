import { useState, useEffect } from "react"
import Canvas from "./layouts/Canvas"
import Panel from "./layouts/Panel"
import { Shape } from "./types/Shapes"

function App(): JSX.Element {

  const [shapePanel, setShapePanel] = useState<'line' | 'square' | 'rectangle' | 'polygon'>('line')
  const [shapes, setShapes] = useState<Shape[]>([])

  useEffect(() => {
    console.log("Fungsi update");
    
}, [shapes]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950">
      <Panel shapePanel={shapePanel} setShapePanel={setShapePanel} shapes={shapes} setShapes={setShapes} />
      <Canvas shapePanel={shapePanel} shapes={shapes} setShapes={setShapes} />
    </div>
  )
}

export default App
