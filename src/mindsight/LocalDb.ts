import Dexie from "dexie"
import type { ICanvasObject } from "./interfaces/ICanvasObject"
import type { IInformation } from "./interfaces/IInformation"
import type { IProject } from "./interfaces/IProject"

interface Relation {
  id: string
  fromType: string
  fromId: string
  toType: string
  toId: string
  relation: string
  inverse: string
}

interface Type {
  id: string
  name: string
}

let indexedDB: IDBFactory | undefined = undefined
let IDBKeyRange: any = undefined

if (typeof window == "undefined") {
  const FakeIndexedDB = await import("fake-indexeddb")
  indexedDB = FakeIndexedDB.indexedDB
  IDBKeyRange = FakeIndexedDB.IDBKeyRange
}

export class LocalDb extends Dexie {
  public relations!: Dexie.Table<Relation, string>
  public canvasObjects!: Dexie.Table<ICanvasObject, string>
  public types!: Dexie.Table<Type, string>
  public informations!: Dexie.Table<IInformation, string>
  public sessions!: Dexie.Table<ISession, string>
  public projects!: Dexie.Table<IProject, string>
  public canvases!: Dexie.Table<ICanvas, string>

  public constructor(name: string) {
    if (indexedDB == undefined || IDBKeyRange == undefined) {
      super(name)
    } else {
      super(name, {
        indexedDB,
        IDBKeyRange,
      })
    }

    this.version(4).stores({
      relations: `
                id,
                [fromType+toType],
                [fromType+toType+fromId],
                [fromType+toType+toId],
                [fromType+toType+relation],
                [fromType+toType+inverse],
                [fromType+toType+fromId+toId],
                [fromType+toType+fromId+relation],
                [fromType+toType+toId+relation],
                [fromType+toType+fromId+inverse],
                [fromType+toType+toId+inverse],
                fromId,
                toId,
                relation
            `,
      canvases: `
              id,
              projectId
            `,
      projects: `
              id,
              name
            `,
      sessions: `
              id,
              userId,
              projectId
            `,
      canvasObjects: `
                id,
                type,
                name,
                width,
                height,
                depth,
                x,
                y,
                informationId,
                informationType
            `,
      canvasObjectsEdges: `
                [fromId+toId],
                fromId,
                toId
            `,
      informations: `
                id,
                type,
                content,
                properties,
                tags,
                createdAt,
                updatedAt,
                deletedAt
            `,
      types: `
                id,
                name
            `,
    })
  }
}
