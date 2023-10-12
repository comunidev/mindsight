interface IViewport {
  id: string
  name: string
  canvasId: string
  width: number
  height: number
  centerAt: {
    x: number
    y: number
  }
  zoomLevel: number
  rotation: number
  scale: number
}
