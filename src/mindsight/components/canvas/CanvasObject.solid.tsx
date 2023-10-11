import { Switch, type Component, Match, createEffect, Show, onCleanup } from "solid-js"
import { useMindsight } from "../../Mindsight"
import { createDexieSignalQuery } from "solid-dexie"
import { Card } from "./Card.solid"
import { memo } from "../../utils"
import { CanvasObjectProvider } from "./contexts/useCanvasObject"

export const CanvasObject: Component<{
  id: string
  onDragStart: (e: { x: number; y: number }) => void
  onDrag: (e: { x: number; y: number }) => void
  onDragEnd: (e: { x: number; y: number }) => void
}> = props => {
  const app = useMindsight()

  const object = createDexieSignalQuery(() => app.canvas.getCanvasObject(props.id))

  const informationId = memo(() => object()?.informationId)

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer?.setData("text/plain", object()?.id || "")
    e.dataTransfer?.setDragImage(document.createElement("span"), 0, 0)
    e.dataTransfer!.effectAllowed = "move"

    props.onDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleDrag = (e: DragEvent) => {
    props.onDrag({ x: e.clientX, y: e.clientY })
  }

  const handleDragEnd = (e: DragEvent) => {
    props.onDragEnd({ x: e.clientX, y: e.clientY })
  }

  const handleSelect = async (e: MouseEvent) => {
    e.stopPropagation()
    if (e.shiftKey) {
      if (object()?.isSelected) {
        await app.canvas.deselectCanvasObject(object()?.id ?? "")
        return
      }
      await app.canvas.selectCanvasObject(object()?.id ?? "")
      return
    }
    if (object()?.isSelected) return
    await app.canvas.deselectAllCanvasObjects()
    await app.canvas.selectCanvasObject(object()?.id ?? "")
  }

  return (
    <CanvasObjectProvider
      registerDragger={(el, v) => {
        el.draggable = Boolean(object()?.isDraggable && object()?.isSelected)

        function handleOnMouseEnter(e: MouseEvent) {
          e.target.style.cursor = "grab"
          e.target.draggable = object?.()?.isDraggable && object?.()?.isSelected
        }

        function handleOnMouseLeave(e: MouseEvent) {
          e.target.style.cursor = "auto"
          e.target.draggable = false
        }

        el.addEventListener("mouseenter", handleOnMouseEnter)
        el.addEventListener("mouseleave", handleOnMouseLeave)

        onCleanup(() => {
          el.removeEventListener("mouseenter", handleOnMouseEnter)
          el.removeEventListener("mouseleave", handleOnMouseLeave)
        })
      }}
      canvasObject={object}
    >
      <Show when={object() !== undefined}>
        <div
          id={`canvas-object:${object()?.id}`}
          class="absolute top-0 left-0"
          style={{
            transform: `translate(${object()?.x}px, ${object()?.y}px)`,
          }}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onClick={handleSelect}
        >
          <Switch fallback={<></>}>
            <Match when={object()?.type === "card"}>
              <Card id={props.id} informationId={informationId.$} />
            </Match>
          </Switch>
        </div>
      </Show>
    </CanvasObjectProvider>
  )
}
