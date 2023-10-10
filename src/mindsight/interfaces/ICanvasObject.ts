export interface ICanvasObject {
  id: string
  canvasId: string
  width?: number
  height?: number
  name?: string
  isSelectable?: boolean
  isSelected?: boolean
  isDraggable?: boolean
  isEditable?: boolean
  depth?: number
  x: number
  y: number
  informationId?: string
  informationType?: string
  creatorId?: string
  type: "node" | "edge" | "marker" | "card" | "image"
  isDragging?: boolean
}
