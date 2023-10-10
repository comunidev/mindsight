<script lang="ts">
  import { liveQuery } from "dexie"
  import { getContext } from "svelte"
  import type { IMindsightContext } from "../../Mindsight"
  import Card from "./Card.svelte"
  import CanvasObject from "./CanvasObject.svelte"
  import { from, map } from "rxjs"
  import type { ICanvasObject } from "../../interfaces/ICanvasObject"
  const { canvas } = getContext<IMindsightContext>("mindsight")

  let currentObjects$ = from(liveQuery(() => canvas.getAllCanvasObjects()))
  let viewportRef: HTMLDivElement
  let viewportX = 0
  let viewportY = 0
  let isDragging = false
  let dragStartX = 0
  let dragStartY = 0

  $: objectIds = liveQuery(() => canvas.getAllCanvasObjectIds())

  $: processedObjects = currentObjects$.pipe(
    map(objects =>
      objects.map(object => {
        const objectIsDragging = object.isDraggable && object.isSelected && isDragging
        console.log("gen")
        return {
          ...object,
          isDragging: objectIsDragging,
          x: objectIsDragging ? object.x + draggingX : object.x,
          y: objectIsDragging ? object.y + draggingY : object.y,
        }
      }),
    ),
  )

  $: viewportWidth = viewportRef?.clientWidth
  $: viewportHeight = viewportRef?.clientHeight
  $: isInside =
    viewportX >= 0 &&
    viewportY >= 0 &&
    viewportX <= viewportWidth &&
    viewportY <= viewportHeight

  $: draggingX = viewportX - dragStartX
  $: draggingY = viewportY - dragStartY

  const updateViewport = (x: number, y: number) => {
    viewportX = x - viewportRef.offsetLeft
    viewportY = y - viewportRef.offsetTop
  }

  const handleDrag = (e: CustomEvent<{ id: string; x: number; y: number }>) => {
    updateViewport(e.detail.x, e.detail.y)
  }

  const handleMouseMove = (e: MouseEvent) => {
    updateViewport(e.clientX, e.clientY)
  }

  const handleDragStart = (e: CustomEvent<{ id: string; x: number; y: number }>) => {
    updateViewport(e.detail.x, e.detail.y)
    dragStartX = viewportX
    dragStartY = viewportY
    isDragging = true
  }

  const handleDragEnd = async (e: CustomEvent<{ id: string; x: number; y: number }>) => {
    isDragging = false
    await Promise.all(
      $processedObjects
        .filter(object => object.isDragging)
        .map(object => canvas.moveCanvasObject(object.id, object.x, object.y)),
    )
  }

  const handleDoubleClick = () => {
    canvas.newCardOnCanvas("", viewportX, viewportY)
  }

  const handleClick = async () => {
    await canvas.deselectAllCanvasObjects()
  }
</script>

<div class="w-full h-full bg-blue p-24">
  <div
    class="w-full h-full bg-neutral relative select-none overflow-hidden"
    role="region"
    bind:this={viewportRef}
    on:dblclick={handleDoubleClick}
    on:mousemove={handleMouseMove}
    on:dragenter|preventDefault={() => {}}
    on:dragover|preventDefault={() => {}}
    on:click={handleClick}
  >
    {#if $objectIds}
      {#each $objectIds as id}
        <CanvasObject
          {id}
          on:dragstart={handleDragStart}
          on:drag={handleDrag}
          on:dragend={handleDragEnd}
        />
      {/each}
    {/if}
  </div>
</div>
