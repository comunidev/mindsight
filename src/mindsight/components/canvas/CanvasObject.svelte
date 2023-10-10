<script lang="ts" context="module">
  export function registerDragger(element: HTMLElement, canvasObject: ICanvasObject) {
    const handleMouseDown = (e: MouseEvent) => {
      if (!canvasObject.isSelected) {
        return
      }
      e.target.setAttribute("draggable", "true")
    }
    const handleDragEnd = (e: DragEvent) => {
      if (!canvasObject.isDragging) {
        return
      }
      e.target.setAttribute("draggable", "false")
    }

    element.addEventListener("mousedown", handleMouseDown)
    element.addEventListener("dragend", handleDragEnd)

    return {
      destroy() {
        element.removeEventListener("mousedown", handleMouseDown)
        element.removeEventListener("dragend", handleDragEnd)
      },
    }
  }
</script>

<script lang="ts">
  import { createEventDispatcher, getContext, onMount, setContext } from "svelte"
  import Card from "./Card.svelte"
  import type { ICanvasObject } from "../../interfaces/ICanvasObject"
  import type { IMindsightContext } from "../../Mindsight"
  import { liveQuery } from "dexie"

  const app = getContext<IMindsightContext>("mindsight")

  export let canvasObject: ICanvasObject
  const dispatch = createEventDispatcher<{
    dragstart: { id: string; x: number; y: number }
    drag: { id: string; x: number; y: number }
    dragend: { id: string; x: number; y: number }
  }>()

  $: information = liveQuery(() =>
    app.information.getInformation(canvasObject.informationId!),
  )

  const handleDragEvent = async (e: DragEvent) => {
    if (e.type === "dragstart") {
      e.dataTransfer!.setData("text/plain", canvasObject.id)
      e.dataTransfer?.setDragImage(document.createElement("span"), 0, 0)
      e.dataTransfer!.effectAllowed = "copyMove"
    }

    dispatch(e.type, { id: canvasObject.id, x: e.clientX, y: e.clientY })
  }

  const handleSelect = async (e: MouseEvent) => {
    e.stopPropagation()
    if (e.shiftKey) {
      if (canvasObject.isSelected) {
        await app.canvas.deselectCanvasObject(canvasObject.id)
        return
      }
      await app.canvas.selectCanvasObject(canvasObject.id)
      return
    }
    await app.canvas.deselectAllCanvasObjects()
    await app.canvas.selectCanvasObject(canvasObject.id)
  }
</script>

{#if canvasObject}
  <div
    id="canvas-object:{canvasObject.id}"
    style:left="{canvasObject.x}px"
    style:top="{canvasObject.y}px"
    class="absolute hover:cursor-grab"
    on:dragstart={handleDragEvent}
    on:drag={handleDragEvent}
    on:dragend={handleDragEvent}
    on:click={handleSelect}
  >
    {#if (canvasObject.informationType = "card")}
      <Card
        information={$information}
        isSelected={canvasObject.isSelected}
        {canvasObject}
      />
    {/if}
  </div>
{/if}
