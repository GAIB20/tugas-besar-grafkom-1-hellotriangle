import { useState } from "react"
import Canvas from "./layouts/Canvas"
import Panel from "./layouts/Panel"

function App(): JSX.Element {

  const [shapePanel, setShapePanel] = useState<'line' | 'square' | 'rectangle' | 'polygon'>('line')

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-900">
      <Panel shapePanel={shapePanel} setShapePanel={setShapePanel} />
      <Canvas />
    </div>
  )
}

export default App
