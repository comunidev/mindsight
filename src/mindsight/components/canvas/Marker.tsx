import { type Component } from "solid-js"
import { useCanvasObject } from "./contexts/useCanvasObject"
import { useDragging } from "./contexts/draggingContext"
import { MaterialSymbolsLocationOn } from "../../../icons"

export const Marker: Component<{
  id: string
}> = () => {
  const { canvasObject } = useCanvasObject()
  const { registerDragger } = useDragging()

  return (
    <div
      class="select-none"
      classList={{
        "border-2 border-blue-5": canvasObject?.()?.isSelected,
      }}
      ref={el => {
        registerDragger(el, () =>
          Boolean(canvasObject?.()?.isDraggable && canvasObject?.()?.isSelected),
        )
      }}
    >
      <MaterialSymbolsLocationOn class="color-red-6 text-8" />
      <span>{canvasObject?.()?.name}</span>
    </div>
  )
}
