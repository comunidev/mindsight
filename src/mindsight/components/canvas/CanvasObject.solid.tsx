import { Switch, type Component, Match, Show, createMemo } from "solid-js"
import { useMindsight } from "../../Mindsight"
import { createDexieSignalQuery } from "solid-dexie"
import { Card } from "./Card.solid"
import { CanvasObjectProvider } from "./contexts/useCanvasObject"
import { useDragging } from "./contexts/draggingContext"

export const CanvasObject: Component<{
  id: string
}> = props => {
  const app = useMindsight()

  const object = createDexieSignalQuery(() => app.canvas.getCanvasObject(props.id))

  const informationId = createMemo(() => object()?.informationId)

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
    await app.canvas.deselectAllCanvasObjects()
    await app.canvas.selectCanvasObject(object()?.id ?? "")
  }

  const dragging = useDragging()

  const isDraggable = createMemo(() =>
    Boolean(object?.()?.isDraggable && object?.()?.isSelected && dragging.isDragging),
  )

  const x = createMemo(() =>
    isDraggable() ? dragging.draggingX + object?.()?.x : object()?.x,
  )
  const y = createMemo(() =>
    isDraggable() ? dragging.draggingY + object?.()?.y : object()?.y,
  )

  return (
    <CanvasObjectProvider canvasObject={object}>
      <Show when={object() !== undefined}>
        <div
          id={`canvas-object:${object()?.id}`}
          class="absolute top-0 left-0"
          style={{
            transform: `translate(${x()}px, ${y()}px)`,
          }}
          onClick={handleSelect}
        >
          <Switch fallback={<></>}>
            <Match when={object()?.type === "card"}>
              <Card id={props.id} informationId={informationId() ?? ""} />
            </Match>
          </Switch>
        </div>
      </Show>
    </CanvasObjectProvider>
  )
}
