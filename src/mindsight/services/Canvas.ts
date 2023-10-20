import { ulid } from "ulid"
import type { LocalDb } from "../LocalDb"
import type { ICanvasObject } from "../interfaces/ICanvasObject"
import { keyBy } from "lodash"
import { async } from "rxjs"

export class CanvasService {
  constructor(public db: LocalDb) {}

  async moveCanvasObject(id: string, x: number, y: number) {
    await this.db.canvasObjects.update(id, { x, y })
  }

  async deleteCanvasObject(id: string) {
    await this.db.canvasObjects.delete(id)
  }

  async createCard(canvasObject: ICanvasObject) {
    const informationId = ulid()

    await this.db.transaction(
      "rw",
      this.db.informations,
      this.db.canvasObjects,
      async () => {
        await this.db.informations.add({
          id: informationId,
          title: "untitled",
          description: "...",
          type: "concept",
        })
        await this.db.canvasObjects.add({
          ...canvasObject,
          informationId,
          informationType: "concept",
        })
      },
    )
  }

  async newCardOnCanvas(canvasId: string, x: number, y: number) {
    await this.createCard({
      id: ulid(),
      x,
      y,
      canvasId,
      type: "card",
      creatorId: "TODO",
      depth: 0,
      height: 100,
      width: 100,
      isDraggable: true,
      isEditable: true,
      isSelectable: true,
      isSelected: false,
    })
  }

  async newMarkerOnCanvas(canvasId: string, x: number, y: number) {
    await this.db.canvasObjects.add({
      id: ulid(),
      x,
      y,
      canvasId,
      type: "marker",
      name: "untitled",
      depth: 0,
      height: 100,
      width: 100,
      isDraggable: true,
      isEditable: true,
      isSelectable: true,
      isSelected: false,
    })
  }

  getCanvasObject(id: string) {
    return this.db.canvasObjects.get(id)
  }

  async selectCanvasObjects(ids: string[]) {
    await this.db.transaction("rw", this.db.canvasObjects, async () => {
      const canvasObjects = await this.db.canvasObjects.bulkGet(ids)
      const updates = canvasObjects
        .filter(co => co != null)
        .filter(co => !!co?.isSelected)
        .map(co => ({ ...co, isSelected: true }))

      await this.db.canvasObjects.bulkPut(updates)
    })
  }

  async selectCanvasObject(id: string) {
    await this.db.canvasObjects.update(id, { isSelected: true })
  }

  async deselectCanvasObject(id: string) {
    await this.db.canvasObjects.update(id, { isSelected: false })
  }

  async deselectAllCanvasObjects() {
    await this.db.transaction("rw", this.db.canvasObjects, async () => {
      const canvasObjects = await this.db.canvasObjects
        .filter(co => !!co.isSelected)
        .toArray()

      const updates = canvasObjects
        .filter(co => co != null)
        .filter(co => co?.isSelected)
        .map(co => ({ ...co, isSelected: false }))

      await this.db.canvasObjects.bulkPut(updates)
    })
  }

  getAllCanvasObjectIds() {
    return this.db.canvasObjects.toCollection().primaryKeys()
  }

  getAllCanvasObjects() {
    return this.db.canvasObjects.toArray()
  }

  async moveSelectedObjects(dx: number, dy: number) {
    const selectedObjects = await this.getAllSelectedCanvasObjects()
    const updates = selectedObjects.map(co => ({
      ...co,
      x: co.x + dx,
      y: co.y + dy,
    }))

    await this.db.canvasObjects.bulkPut(updates)
  }

  getAllSelectedCanvasObjects() {
    return this.db.canvasObjects.filter(co => co.isSelected!!).toArray()
  }

  deleteSelectedCanvasObjects() {
    return this.db.canvasObjects
      .filter(co => co.isSelected!!)
      .primaryKeys()
      .then(ids => this.db.canvasObjects.bulkDelete(ids))
  }
}
