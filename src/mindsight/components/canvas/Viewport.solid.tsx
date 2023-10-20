import {
  For,
  type Component,
  createMemo,
  createSignal,
  batch,
  createEffect,
} from "solid-js"
import { useMindsight } from "../../Mindsight"
import { CanvasObject } from "./CanvasObject.solid"
import { createDexieArrayQuery } from "solid-dexie"

import { createMousePosition } from "@solid-primitives/mouse"
import { createDraggingContext } from "./contexts/draggingContext"
import { makeEventListenerStack } from "@solid-primitives/event-listener"
import { set } from "lodash"

const WHEEL_DELTA = 120
const SCALE_FACTOR = 0.1

export const Viewport: Component<{
  id: string
  canvasId: string
}> = props => {
  const { canvas } = useMindsight()

  const objectIds = createDexieArrayQuery(() => canvas.getAllCanvasObjectIds())

  let viewportRef: HTMLDivElement
  let canvasRef: HTMLDivElement

  const mouse = createMousePosition()
  const viewportX = createMemo(() => mouse.x - viewportRef?.offsetLeft)
  const viewportY = createMemo(() => mouse.y - viewportRef?.offsetTop)
  const [viewportScale, setViewportScale] = createSignal(1)
  const [viewportCenterAt, setViewportCenterAt] = createSignal({ x: 0, y: 0 })

  const [hasMoved, setHasMoved] = createSignal(false)
  const [isPanning, setIsPanning] = createSignal(false)
  const [prevPanning, setPrevPanning] = createSignal({ x: 0, y: 0 })

  const viewportWidth = () => viewportRef?.clientWidth
  const viewportHeight = () => viewportRef?.clientHeight

  const viewportCenter = () => ({
    x: viewportWidth() / 2,
    y: viewportHeight() / 2,
  })

  const viewportMouse = createMemo(() => ({
    x: mouse.x - viewportCenter().x,
    y: viewportCenter().y - mouse.y,
  }))

  const canvasMouse = createMemo(() => ({
    x: viewportCenterAt().x + viewportMouse().x / viewportScale(),
    y: viewportCenterAt().y + viewportMouse().y / viewportScale(),
  }))

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

  const handleDoubleClick = () =>
    canvas.newCardOnCanvas("", canvasMouse().x, canvasMouse().y)

  const handleClick = e => {
    if (isPanning()) return
    canvas.deselectAllCanvasObjects()
  }

  const handleCaptureClick = e => {
    if (hasMoved()) {
      e.stopPropagation()
      return
    }
  }
  const handleMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return
    batch(() => {
      setHasMoved(false)
      setIsPanning(true)
      setPrevPanning({ x: mouse.x, y: mouse.y })
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isPanning()) return
    if (e.button === 0 && e.buttons === 0) {
      handleMouseUp(e)
    }

    // Set the cursor to grabbing
    viewportRef.style.cursor = "grabbing"

    const delta = {
      x: mouse.x - prevPanning().x,
      y: mouse.y - prevPanning().y,
    }

    batch(() => {
      setHasMoved(true)
      setPrevPanning({ x: mouse.x, y: mouse.y })
      setViewportCenterAt(prev => ({
        x: prev.x - delta.x / viewportScale(),
        y: prev.y + delta.y / viewportScale(),
      }))
    })
  }

  const handleMouseUp = (e: MouseEvent) => {
    if (e.button !== 0) return
    // Restore the cursor to default
    viewportRef.style.cursor = "default"

    e.stopPropagation()
    batch(() => {
      setIsPanning(false)
    })
  }

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.key === "Delete") {
      await canvas.deleteSelectedCanvasObjects()
      return
    }
  }

  const [windowListen] = makeEventListenerStack(window)
  const [documentListen] = makeEventListenerStack(document)

  const [zoomLevel, setZoomLevel] = createSignal(1)

  windowListen("wheel", e => {
    const zoomSteps = Math.floor(e.deltaY / WHEEL_DELTA)

    batch(() => {
      setViewportScale(prev => prev * (1 - zoomSteps * SCALE_FACTOR))
      setViewportCenterAt(prev => ({
        x:
          viewportCenterAt().x -
          (canvasMouse().x - viewportCenterAt().x) * SCALE_FACTOR * zoomSteps,
        y:
          viewportCenterAt().y -
          (canvasMouse().y - viewportCenterAt().y) * SCALE_FACTOR * zoomSteps,
      }))
    })
  })

  documentListen("keydown", e => {
    if (e.key === "m") {
      canvas.newMarkerOnCanvas("", canvasMouse().x, canvasMouse().y)
    }
  })

  const {
    DraggingProvider,
    store: draggingStore,
    setupDropZone,
  } = createDraggingContext({
    viewportX: () => canvasMouse().x,
    viewportY: () => canvasMouse().y,
  })

  return (
    <DraggingProvider>
      <div
        class="w-full h-full bg-neutral overflow-hidden relative"
        onDblClick={handleDoubleClick}
        ref={ref => {
          viewportRef = ref
          setupDropZone(viewportRef)
        }}
        onDragEnter={e => e.preventDefault()}
        onDragOver={e => e.preventDefault()}
        onDragEnd={handleMouseUp}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        oncapture:click={handleCaptureClick}
        onKeyDown={handleKeyDown}
      >
        <div
          class="w-full h-full absolute left-1/2 top-1/2  relative select-none"
          style={{
            "transform-origin": "top left",
            transform: `scale(${viewportScale()}) translate(${-viewportCenterAt().x}px, ${
              viewportCenterAt().y
            }px)`,
          }}
          ref={ref => {
            canvasRef = ref
          }}
        >
          <For each={objectIds}>{id => <CanvasObject id={id} />}</For>
        </div>
      </div>
    </DraggingProvider>
  )
}
