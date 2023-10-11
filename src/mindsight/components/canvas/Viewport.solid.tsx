import { For, type Component, createMemo, createSignal } from "solid-js"
import { useMindsight } from "../../Mindsight"
import { CanvasObject } from "./CanvasObject.solid"
import { createDexieArrayQuery } from "solid-dexie"

import { createMousePosition } from "@solid-primitives/mouse"
import { createDraggingContext } from "./contexts/draggingContext"
import { makeEventListenerStack } from "@solid-primitives/event-listener"
import { set } from "lodash"

export const Viewport: Component<{
  id: string
  canvasId: string
}> = props => {
  const { canvas } = useMindsight()

  const objectIds = createDexieArrayQuery(() => canvas.getAllCanvasObjectIds())

  let viewportRef: HTMLDivElement

  const mouse = createMousePosition()
  const viewportX = createMemo(() => mouse.x - viewportRef?.offsetLeft)
  const viewportY = createMemo(() => mouse.y - viewportRef?.offsetTop)

  const viewportWidth = createMemo(() => viewportRef?.clientWidth)
  const viewportHeight = createMemo(() => viewportRef?.clientHeight)

  const center = createMemo(() => ({
    x: viewportWidth() / 2,
    y: viewportHeight() / 2,
  }))

  const isInside = createMemo(
    () =>
      viewportX() >= 0 &&
      viewportY() >= 0 &&
      viewportX() <= viewportWidth() &&
      viewportY() <= viewportHeight(),
  )

  const handleDoubleClick = () => canvas.newCardOnCanvas("", viewportX(), viewportY())

  const handleClick = () => canvas.deselectAllCanvasObjects()

  const [listen] = makeEventListenerStack(window)

  const [zoomLevel, setZoomLevel] = createSignal(1)

  listen("wheel", e => {
    setZoomLevel(zoomLevel() - e.deltaY / 1000)
  })

  const {
    DraggingProvider,
    store: draggingStore,
    setupDropZone,
  } = createDraggingContext({ viewportX, viewportY })

  return (
    <DraggingProvider>
      <div
        class="w-full h-full bg-neutral overflow-hidden"
        onDblClick={handleDoubleClick}
      >
        <div
          class="w-full h-full  relative select-none "
          style={{
            "transform-origin": `top left`,
            transform: `scale(${zoomLevel()})`,
          }}
          ref={ref => {
            viewportRef = ref
            setupDropZone(viewportRef)
          }}
          onDragEnter={e => e.preventDefault()}
          onDragOver={e => e.preventDefault()}
          onClick={handleClick}
        >
          <For each={objectIds}>{id => <CanvasObject id={id} />}</For>
        </div>
      </div>
    </DraggingProvider>
  )
}
