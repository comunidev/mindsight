import { ulid } from "ulid"
import type { LocalDb } from "../LocalDb"

export class SessionService {
  constructor(public db: LocalDb) {}

  async createSession() {
    const session = {
      id: ulid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "TODO",
      projectId: "TODO",
      canvasId: "TODO",
    }

    await this.db.sessions.add(session)

    return session
  }

  async getCurrentSession() {
    return this.db.sessions.orderBy("createdAt").last()
  }

  async createProject() {}
}
