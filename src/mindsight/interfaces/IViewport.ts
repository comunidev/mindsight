interface IViewport {
  id: string
  name: string
  width: number
  height: number
  canvasId: string
  centerAt: {
    x: number
    y: number
  }
  zoomLevel: number
  rotation: number
  scale: number
}
