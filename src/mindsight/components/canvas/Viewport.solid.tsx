import { For, batch, createEffect } from "solid-js"
import { useMindsight } from "../../Mindsight"
import { CanvasObject } from "./CanvasObject.solid"
import { createDexieArrayQuery } from "solid-dexie"
import { memo, signal } from "../../utils"

import { createContext, useContext, type ParentComponent, type Accessor } from "solid-js"

interface DraggingContextProviderProps {
  draggingX: Accessor<number>
  draggingY: Accessor<number>
  isDragging: Accessor<boolean>
  viewportX: Accessor<number>
  viewportY: Accessor<number>
  viewportWidth: Accessor<number>
  viewportHeight: Accessor<number>
  isInside: Accessor<boolean>
  updateViewport: (x: number, y: number) => void
  handleDragStart: (e: { x: number; y: number }) => void
  handleDrag: (e: { x: number; y: number }) => void
  handleDragEnd: () => void
}

export const DraggingContext = createContext<DraggingContextProviderProps>()

export const DraggingContextProvider: ParentComponent<
  DraggingContextProviderProps
> = props => {
  return (
    <DraggingContext.Provider value={props}>{props.children}</DraggingContext.Provider>
  )
}

export const useCanvasObject = () => {
  return useContext(DraggingContext)
}

export const Viewport = () => {
  const { canvas } = useMindsight()

  const objectIds = createDexieArrayQuery(() => canvas.getAllCanvasObjectIds())

  let viewportRef: HTMLDivElement
  const viewportX = signal(0)
  const viewportY = signal(0)
  const isDragging = signal(false)
  const dragStartX = signal(0)
  const dragStartY = signal(0)

  const viewportWidth = memo(() => viewportRef?.clientWidth ?? 0)
  const viewportHeight = memo(() => viewportRef?.clientHeight ?? 0)

  const isInside = memo(
    () =>
      viewportX.$ >= 0 &&
      viewportY.$ >= 0 &&
      viewportX.$ <= viewportWidth.$ &&
      viewportY.$ <= viewportHeight.$,
  )

  /*   const processedObjects = memo(() => {
    return objects.map(object => {
      const objectIsDragging = object.isDraggable && object.isSelected && isDragging.$
      return {
        ...object,
        isDragging: objectIsDragging,
        x: objectIsDragging ? object.x + draggingX.$ : object.x,
        y: objectIsDragging ? object.y + draggingY.$ : object.y,
      }
    })
  }) */

  const draggingX = memo(() => viewportX.$ - dragStartX.$)
  const draggingY = memo(() => viewportY.$ - dragStartY.$)

  const updateViewport = (x: number, y: number) => {
    batch(() => {
      viewportX(x - viewportRef.offsetLeft)
      viewportY(y - viewportRef.offsetTop)
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    updateViewport(e.clientX, e.clientY)
  }

  const handleDragStart = ({ x, y }: { x: number; y: number }) => {
    updateViewport(x, y)
    batch(() => {
      dragStartY(viewportY.$)
      dragStartX(viewportX.$)
    })
  }

  const handleDragEnd = async () => {
    isDragging(false)
  }

  const handleDrag = ({ x, y }: { x: number; y: number }) => {
    updateViewport(x, y)
  }

  const handleDoubleClick = () => canvas.newCardOnCanvas("", viewportX.$, viewportY.$)

  const handleClick = () => canvas.deselectAllCanvasObjects()

  return (
    <div class="w-full h-full bg-blue p-24">
      <div
        class="w-full h-full bg-neutral relative select-none overflow-hidden"
        ref={viewportRef!}
        onDblClick={handleDoubleClick}
        onMouseMove={handleMouseMove}
        onDragEnter={e => e.preventDefault()}
        onDragOver={e => e.preventDefault()}
        onClick={handleClick}
      >
        <For each={objectIds}>
          {object => (
            <CanvasObject
              id={object}
              onDrag={handleDrag}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          )}
        </For>
      </div>
    </div>
  )
}
