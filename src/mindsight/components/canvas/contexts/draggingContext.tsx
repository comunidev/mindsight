import { makeEventListenerStack } from "@solid-primitives/event-listener"
import {
  createContext,
  type Accessor,
  useContext,
  type ParentComponent,
  createEffect,
} from "solid-js"
import { createStore } from "solid-js/store"
import { useMindsight } from "../../../Mindsight"

interface DraggingContext {
  draggingX: number
  draggingY: number
  deltaX: number
  deltaY: number
  dragStartX: number
  dragStartY: number
  isDragging: boolean
  prevDraggingX: number
  prevDraggingY: number
  registerDragger: (el: HTMLElement, isDraggable?: Accessor<boolean>) => void
}

const createDefault = (): DraggingContext => ({
  draggingX: 0,
  draggingY: 0,
  deltaX: 0,
  deltaY: 0,
  dragStartX: 0,
  dragStartY: 0,
  isDragging: false,
  prevDraggingX: 0,
  prevDraggingY: 0,
  registerDragger: () => {},
})

const Context = createContext<DraggingContext>(createDefault())

export function useDragging() {
  return useContext(Context)
}

export function createDraggingContext(props: {
  viewportX: Accessor<number>
  viewportY: Accessor<number>
}) {
  const [store, setStore] = createStore<DraggingContext>(createDefault())

  const app = useMindsight()

  const handleDragStart = (e: MouseEvent) => {
    e.dataTransfer?.setData("text/plain", "")
    e.dataTransfer?.setDragImage(document.createElement("span"), 0, 0)

    setStore({
      ...store,
      isDragging: true,
      dragStartX: props.viewportX(),
      dragStartY: props.viewportY(),
    })
  }

  const handleDrag = async () => {
    if (!store.isDragging) {
      return
    }

    const draggingX = props.viewportX() - store.dragStartX
    const draggingY = props.viewportY() - store.dragStartY
    const deltaX = draggingX - store.prevDraggingX
    const deltaY = draggingY - store.prevDraggingY

    setStore({
      ...store,
      draggingX,
      draggingY,
      deltaX,
      deltaY,
      prevDraggingX: draggingX,
      prevDraggingY: draggingY,
    })
  }

  const handleDragEnd = async () => {
    await app.canvas.moveSelectedObjects(store.draggingX, store.draggingY)
    setStore({
      ...store,
      isDragging: false,
      draggingX: 0,
      draggingY: 0,
      deltaX: 0,
      deltaY: 0,
      dragStartX: 0,
      dragStartY: 0,
      prevDraggingX: 0,
      prevDraggingY: 0,
    })
  }

  function registerDragger(el: HTMLElement, isDraggable?: Accessor<boolean>) {
    createEffect(() => {
      el.draggable = Boolean(isDraggable?.())
    })

    const [listen] = makeEventListenerStack(el, { passive: true })

    listen("dragstart", handleDragStart)
    listen("drag", handleDrag)
    listen("dragend", handleDragEnd)
  }

  setStore({
    ...store,
    registerDragger,
  })

  const DraggingProvider: ParentComponent = props => (
    <Context.Provider value={store}>{props.children}</Context.Provider>
  )

  function setupDropZone(el: HTMLElement) {
    const [listen] = makeEventListenerStack(el)
    listen("dragenter", e => e.preventDefault())
    listen("dragover", e => e.preventDefault())
  }

  return {
    store,
    DraggingProvider,
    setupDropZone,
  }
}
