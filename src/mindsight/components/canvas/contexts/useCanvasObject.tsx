import { createContext, useContext, type ParentComponent, type Accessor } from "solid-js"
import type { ICanvasObject } from "../../../interfaces/ICanvasObject"

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      registerDragger: null
    }
  }
}

interface ICanvasObjectProviderProps {
  registerDragger<T>(el: HTMLElement, value?: T): void
  canvasObject?: Accessor<ICanvasObject | undefined>
}

export const CanvasObjectContext = createContext<ICanvasObjectProviderProps>({
  registerDragger: () => {},
})

export const CanvasObjectProvider: ParentComponent<
  ICanvasObjectProviderProps
> = props => {
  return (
    <CanvasObjectContext.Provider value={props}>
      {props.children}
    </CanvasObjectContext.Provider>
  )
}

export const useCanvasObject = () => {
  return useContext(CanvasObjectContext)
}
