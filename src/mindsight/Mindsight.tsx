import { createContext, useContext } from "solid-js";
import { LocalDb } from "./LocalDb";
import type { IServerClient } from "./serverClient/IServerClient";
import { CanvasService } from "./services/Canvas";
import { InformationService } from "./services/Information";

export class Mindsight {
  db: LocalDb;
  canvas: CanvasService;
  information: InformationService;

  constructor(
    public instanceId: string,
    public server: IServerClient
  ) {
    this.db = new LocalDb(instanceId);
    this.canvas = new CanvasService(this.db);
    this.information = new InformationService(this.db, this.server);
  }
}

export interface IMindsightContext {
  db: LocalDb;
  canvas: CanvasService;
  instanceId: string;
  server: IServerClient;
  information: InformationService;
}

export const MindsightContext = createContext<IMindsightContext | null>(null);

export const useMindsight = () => {
  const mindsight = useContext(MindsightContext);

  if (mindsight == null) {
    throw new Error("MindsightContext is null");
  }

  return mindsight;
};
