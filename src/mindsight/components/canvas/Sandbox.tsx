import {
  For,
  type Component,
  createSignal,
  createMemo,
  observable,
  createResource,
  type Signal,
  createEffect,
} from "solid-js"
import { toObserver, useSubscription } from "@solidjs-use/rxjs"

import type { StandardLonghandProperties } from "csstype"
import type { ICanvasObject } from "../../interfaces/ICanvasObject"
import { createMousePosition } from "@solid-primitives/mouse"

import { useDragDropContext } from "@thisbeyond/solid-dnd"
import { liveQuery } from "dexie"
import { CanvasObject } from "./CanvasObject"
import { useMindsight } from "../../Mindsight"
import { from as toAccessor } from "solid-js"
import {
  BehaviorSubject,
  bufferTime,
  filter,
  from,
  map,
  mergeMap,
  pairwise,
  tap,
  toArray,
  withLatestFrom,
  groupBy,
  distinctUntilChanged,
} from "rxjs"
import { isMatch } from "lodash"

import "@solid-devtools/debugger/setup"

import { useDebugger } from "@solid-devtools/debugger"
import { useLocator } from "@solid-devtools/debugger"
import { createStore, reconcile, unwrap } from "solid-js/store"

export const Card2: Component<{
  id: string
  x: number
  y: number
  width: number
  height: number
  isSelected?: boolean
  informationId: string
  informationType: string
}> = props => {
  const { canvas, information } = useMindsight()
  const resource = toAccessor(
    liveQuery(() => information.getInformation(props.informationId)),
  )

  createEffect(() => {
    console.log(resource())
  })
  return (
    <div
      style={{
        position: "absolute",
        left: `${props.x}px`,
        top: `${props.y}px`,
        width: `${props.width}px`,
        height: `${props.height}px`,
        "min-height": "60px",
      }}
      classList={{
        "color-amber": props.isSelected,
      }}
      class="p-4 border-solid border-2  rounded-1 shadow-md bg-white min-w-36"
      onClick={async e => {
        if (e.shiftKey) {
          if (props.isSelected) {
            await canvas.deselectCanvasObject(props.id)
            return
          }
          await canvas.selectCanvasObject(props.id)
          return
        }
        if (props.isSelected) return
        await canvas.deselectAllCanvasObjects()
        await canvas.selectCanvasObject(props.id)
      }}
    >
      <span class="select-none">{props.id}</span>
      <h1 class="select-none">{resource()?.title}</h1>
    </div>
  )
}
export const Sandbox: Component<{
  width: StandardLonghandProperties["width"]
  height: StandardLonghandProperties["height"]
}> = props => {
  // App
  const { canvas } = useMindsight()
  const debug = useDebugger()

  // Dragging
  const [, { onDragEnd, onDragMove }] = useDragDropContext()!
  const draggingEvent$ = new BehaviorSubject<"start" | "move" | "end" | "idle">("idle")

  // Mouse position
  const mouse = createMousePosition()
  const mouseMemo = createMemo(() => ({ x: mouse.x, y: mouse.y }))

  const mousePositions$ = from(observable(mouseMemo))
  const deltaMouse$ = mousePositions$.pipe(
    pairwise(),
    map(([prev, curr]) => ({
      deltaX: curr.x - prev.x,
      deltaY: curr.y - prev.y,
    })),
  )

  // Canvas objects
  const canvasObjects$ = from(liveQuery(() => canvas.getAllCanvasObjects())).pipe(
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    map(canvasObjects =>
      from(canvasObjects).pipe(
        groupBy(canvasObject => canvasObject.isSelected),
        mergeMap(group$ => {
          if (group$.key === true) {
            return group$
            return group$.pipe(
              tap(e => console.log(e)),
              withLatestFrom(deltaMouse$),
              map(([canvasObject, deltaMouse]) => ({
                ...canvasObject,
                x: canvasObject.x,
                y: canvasObject.y,
              })),
            )
          }

          return group$
        }),
        toArray(),
      ),
    ),
  )

  const [canvasObjects, setCanvasObjects] = createSignal<ICanvasObject[]>([])

  useSubscription(
    canvasObjects$.subscribe(c => c.subscribe(toObserver(setCanvasObjects))),
  )

  const deltasEverySecond$ = deltaMouse$.pipe(
    bufferTime(1000),
    map(deltas =>
      deltas.reduce(
        (acc, delta) => ({
          deltaX: acc.deltaX + delta.deltaX,
          deltaY: acc.deltaY + delta.deltaY,
        }),
        { deltaX: 0, deltaY: 0 },
      ),
    ),
  )

  onDragMove(() => {
    if (draggingEvent$.getValue() === "idle") {
      draggingEvent$.next("start")
      return
    }

    draggingEvent$.next("move")
  })

  onDragEnd(() => {
    draggingEvent$.next("end")
    draggingEvent$.next("idle")
  })

  return (
    <div
      class="bg-neutral w-full h-full"
      onDblClick={() => canvas.newCardOnCanvas("", mouse.x, mouse.y)}
    >
      <For each={canvasObjects()} fallback={<></>}>
        {canvasObject => (
          <Card2
            id={canvasObject.id}
            x={canvasObject.x}
            y={canvasObject.y}
            width={canvasObject.width!}
            height={canvasObject.height!}
            isSelected={canvasObject.isSelected}
            informationId={canvasObject.informationId}
            informationType={canvasObject.informationType}
            key={canvasObject.id}
          />
        )}
        {/* {canvasObject => (
          <CanvasObject
            x={canvasObject.x}
            y={canvasObject.y}
            id={canvasObject.id}
            width={canvasObject.width}
            height={canvasObject.height}
            type={canvasObject.type}
            informationId={canvasObject.informationId}
            isDraggable={canvasObject.isDraggable}
            isEditable={canvasObject.isEditable}
            isSelectable={canvasObject.isSelectable}
            isSelected={canvasObject.isSelected}
          />
        )} */}
      </For>
    </div>
  )
}
