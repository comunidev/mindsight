import { createSignal, type Component, createResource } from "solid-js"
import { createDraggable, useDragDropContext } from "@thisbeyond/solid-dnd"
import { RiDraggable } from "../../../icons/RiDraggable"
import { useMindsight } from "../../Mindsight"
import CodiconGrabber from "../../../icons/Grabber"

export const Card: Component<{
  id: string
  informationId: string
  width: number
  height: number
  isEditable?: boolean
  isDraggable?: boolean
  isSelectable?: boolean
  isSelected?: boolean
  draggerProps?: any
}> = props => {
  const { information, canvas } = useMindsight()
  const [state] = useDragDropContext()!
  const [resource] = createResource(props.informationId, informationId =>
    information.getInformation(informationId),
  )

  return (
    <div
      style={{
        width: `${props.width}px`,
        height: `${props.height}px`,
        "min-height": "60px",
      }}
      class="p-4 border-solid border-2  rounded-1 shadow-md bg-white min-w-36"
      classList={{
        "border-amber": props.isSelected,
        "border-coolgray": !props.isSelected,
      }}
      onClick={async e => {
        if (!props.isSelectable) return

        if (e.shiftKey) {
          await canvas.selectCanvasObject(props.id)
          return
        }
        await canvas.deselectAllCanvasObjects()
        await canvas.selectCanvasObject(props.id)
      }}
    >
      <div class="absolute top-0 left-0 w-full flex justify-center color-coolgray h-1">
        <div
          {...(props.isDraggable && props.draggerProps ? props.draggerProps : {})}
          class="h-4 cursor-grab"
          classList={{
            "cursor-grabbing": state.active.draggableId === props.id,
          }}
        >
          <CodiconGrabber class="draggable" />
        </div>
      </div>
      <h1
        class="text-xl font-bold text-dark"
        contentEditable
        onInput={async e => {
          await information.updateTitle(props.informationId, e.currentTarget.textContent!)
        }}
      >
        {resource()?.title ?? "resource.latest?.title"}
      </h1>
      <p
        class="case-initial"
        contentEditable
        onInput={async e => {
          await information.updateDescription(
            props.informationId,
            e.currentTarget.textContent!,
          )
        }}
      >
        {resource()?.description ?? resource.latest?.description}
      </p>
    </div>
  )
}
