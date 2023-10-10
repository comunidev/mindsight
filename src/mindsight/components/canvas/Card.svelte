<script lang="ts">
  import type { ICanvasObject } from "../../interfaces/ICanvasObject"
  import type { IInformation } from "../../interfaces/IInformation"
  import { registerDragger } from "./CanvasObject.svelte"

  export let information: IInformation
  export let isSelected: boolean
  export let canvasObject: ICanvasObject

  const getSelectedStyle = (isSelected?: boolean) =>
    isSelected ? "border-2 border-blue-500" : ""
</script>

{#if information}
  <div
    class="select-none {getSelectedStyle(isSelected)} bg-white rounded-1 dragger"
    use:registerDragger={canvasObject}
  >
    <div class=" w-full h-full p-2">
      <span
        class="text-3 italic text-coolgray-5 lower"
        on:mousedown={e => {
          e.stopPropagation()
        }}>#{information.id}</span
      >
      <h1>{information.title}</h1>
    </div>
  </div>
{/if}
