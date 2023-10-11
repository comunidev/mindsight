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
  defaultCenterAt: {
    x: number
    y: number
  }
  defaultZoomLevel: number
  defaultRotation: number
  defaultScale: number
}
