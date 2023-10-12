import { createContext, useContext, type JSXElement } from "solid-js"
import { LocalDb } from "./LocalDb"
import type { IServerClient } from "./serverClient/IServerClient"
import { CanvasService } from "./services/Canvas"
import { InformationService } from "./services/Information"
import { SessionService } from "./services/Session"

export interface IMindsightContext {
  db: LocalDb
  canvas: CanvasService
  instanceId: string
  server: IServerClient
  information: InformationService
}

export const MindsightContext = createContext<IMindsightContext>(
  {} as unknown as IMindsightContext,
)
export const useMindsight = () => useContext(MindsightContext)

export class Mindsight {
  db: LocalDb
  canvas: CanvasService
  information: InformationService
  session: SessionService
  UIService: UIService

  constructor(
    public instanceId: string,
    public server: IServerClient,
  ) {
    this.db = new LocalDb(instanceId)
    this.canvas = new CanvasService(this.db)
    this.session = new SessionService(this.db)
    this.ui = new UIService(this.db)
    this.information = new InformationService(this.db, this.server)
    this.Provider = this.Provider.bind(this)
  }

  Provider(): JSXElement {
    return (
      <MindsightContext.Provider
        value={{
          db: this.db,
          canvas: this.canvas,
          instanceId: this.instanceId,
          server: this.server,
          information: this.information,
        }}
      >
        <slot />
      </MindsightContext.Provider>
    )
  }
}
