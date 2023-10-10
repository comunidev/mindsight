export interface IInformation {
    id: string;
    type: string;
    title: string
    description: string
    properties?: Map<string, any>
    tags?: string[]
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}