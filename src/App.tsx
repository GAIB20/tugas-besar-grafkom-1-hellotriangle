import { CSSProperties, useState, useEffect } from "react"
import Canvas from "./layouts/Canvas"
import Panel from "./layouts/Panel"
import { Shape } from "./types/Shapes"
import { motion } from 'framer-motion';
import logo from "./assets/logo.png";

function App(): JSX.Element {

  const [shapePanel, setShapePanel] = useState<'line' | 'square' | 'rectangle' | 'polygon'>('line')
  const [shapes, setShapes] = useState<Shape[]>([])
  const [splash, setSplash] = useState<boolean>(true)

  useEffect(() => {
    setTimeout(() => {
      setSplash(false)
    }, 1000)
  }, [])

  const containerStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    position: 'relative'
  };

  return (
    splash ? 
      <motion.div
        className="flex h-screen w-screen items-center justify-center bg-zinc-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}>
        <div style={containerStyles}>
          <motion.img src={logo} alt="Logo"
            className="absolute"
            style={{ top: '50%', left: '50%', translate: '-50% -50%' }}
            initial={{ scale: 0.1 }}
            animate={{ scale: 0.16 }}
            transition={{ duration: 0.75 }} />
        </div>
    </motion.div> :
    <div className="fadeIn flex h-screen w-screen overflow-hidden bg-zinc-950">
      <Panel shapePanel={shapePanel} setShapePanel={setShapePanel} shapes={shapes} setShapes={setShapes} />
      <Canvas shapePanel={shapePanel} shapes={shapes} setShapes={setShapes} />
    </div>
  )
}

export default App
