import type { Action } from "svelte/action"

export interface MouseInfo {
  viewportX: number
  viewportY: number
  isInside: boolean
}

export function createMouseAction(): Action<
  HTMLElement,
  undefined,
  { "on:mouseMoveRelative": (e: CustomEvent<MouseInfo>) => void }
> {
  return function mouseInfo(relative: HTMLElement) {
    function handleMouseEnter() {}
    function handleMouseMove(event: MouseEvent) {
      const viewportX = event.x - relative.offsetLeft
      const viewportY = event.y - relative.offsetTop
      const isInside =
        viewportX >= 0 &&
        viewportY >= 0 &&
        viewportX <= relative.clientWidth &&
        viewportY <= relative.clientHeight

      relative.dispatchEvent(
        new CustomEvent("mouseMoveRelative", {
          detail: {
            viewportX,
            viewportY,
            isInside,
          },
        }),
      )
    }

    function handleMouseLeave() {}

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return {
      destroy() {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseleave", handleMouseLeave)
        document.removeEventListener("mouseenter", handleMouseEnter)
      },
    }
  }
}
