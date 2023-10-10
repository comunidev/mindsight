import { type Component } from "solid-js"
import { Card } from "./Cards"
import { createDraggable } from "@thisbeyond/solid-dnd"

import { debugProps } from "@solid-devtools/logger"

export const CanvasObject: Component<{
  id: string
  width: number
  height: number
  isEditable?: boolean
  isDraggable?: boolean
  isSelectable?: boolean
  isSelected?: boolean
  type: string
  informationId: string
  x: number
  y: number
}> = props => {
  const draggable = createDraggable(props.id)

  debugProps(props)

  if (props.type === "card") {
    return (
      <div
        onDblClick={e => {
          e.stopPropagation()
        }}
        class="absolute"
        style={{
          left: `${props.x}px`,
          top: `${props.y}px`,
        }}
        ref={draggable.ref}
      >
        <div class="relative">
          <Card
            id={props.id}
            width={props.width}
            height={props.height}
            informationId={props.informationId}
            draggerProps={draggable.dragActivators}
            isDraggable={props.isDraggable}
            isEditable={props.isEditable}
            isSelectable={props.isSelectable}
            isSelected={props.isSelected}
          />
        </div>
      </div>
    )
  }

  return <></>
}
