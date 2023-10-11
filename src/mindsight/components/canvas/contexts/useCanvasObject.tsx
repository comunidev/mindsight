import { createContext, useContext, type ParentComponent, type Accessor } from "solid-js"
import type { ICanvasObject } from "../../../interfaces/ICanvasObject"

interface ICanvasObjectProviderProps {
  canvasObject?: Accessor<ICanvasObject | undefined>
}

export const CanvasObjectContext = createContext<ICanvasObjectProviderProps>({
  canvasObject: () => undefined,
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
