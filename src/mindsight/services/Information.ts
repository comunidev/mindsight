import type { LocalDb } from "../LocalDb"
import type { IServerClient } from "../serverClient/IServerClient"

export class InformationService {
  constructor(
    public db: LocalDb,
    public server: IServerClient,
  ) {}

  async loadInformation(id: string) {
    const information = await this.server.information.fetch(id)

    if (information == null) {
      return
    }

    await this.db.informations.put(information)
  }

  async getInformation(id: string, refetch = false) {
    if (refetch) {
      await this.loadInformation(id)
    }

    const information = await this.db.informations.get(id)

    if (information == undefined && !refetch) {
      await this.loadInformation(id)

      return this.db.informations.get(id)
    }

    return information
  }

  async updateTitle(id: string, title: string) {
    await this.db.informations.update(id, { title })
  }

  async updateDescription(id: string, description: string) {
    await this.db.informations.update(id, { description })
  }
}
