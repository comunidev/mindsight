import { Show, type Component, createEffect } from "solid-js"
import { useMindsight } from "../../Mindsight"
import { createDexieSignalQuery } from "solid-dexie"
import type { PromiseExtended } from "dexie"
import type { IInformation } from "../../interfaces/IInformation"
import { useCanvasObject } from "./contexts/useCanvasObject"
// import { useCanvasObject } from "./contexts/useCanvasObject"

export const Card: Component<{
  id: string
  //canvasObjectId: string
  informationId: string
}> = props => {
  const app = useMindsight()
  const information = createDexieSignalQuery(
    () =>
      app.information.getInformation(props.informationId) as PromiseExtended<
        IInformation | undefined
      >,
  )

  const { registerDragger, canvasObject } = useCanvasObject()

  return (
    <Show when={information() !== undefined}>
      <div
        class="select-none bg-white rounded-1  p-2"
        use:registerDragger={null}
        classList={{
          "border-2 border-blue-5": canvasObject?.()?.isSelected,
        }}
      >
        <div class="w-full h-full">
          <span class="text-3 italic text-coolgray-5 lowercase">
            #{information()?.id}
          </span>
          <h1>{information()?.title}</h1>
        </div>
      </div>
    </Show>
  )
}
