export interface IProject {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  canvasIds: string[]
  ownerId: string
  permissions: {
    userId: string
    read: boolean
    write: boolean
    admin: boolean
  }[]
}
