import type { ICanvasObject } from "../interfaces/ICanvasObject";
import type { IInformation } from "../interfaces/IInformation";
import type { IServerClient } from "./IServerClient";


export const getFakeServerClient = () => {

    const fakeDb = {
        users: {
            "1": {
                id: "1",
                name: "Fake User",
                email: "fake_email@example.com"
            },
            "2": {
                id: "2",
                name: "Fake User 2",
                email: "fake_email_2@example.com"
            }
        },
        objects: {
            "1": {
                id: "1",
                canvasId: "1",
                width: 100,
                height: 100,
                name: "Fake Object",
                isSelectable: true,
                isDraggable: true,
                isEditable: true,
                depth: 0,
                x: 56,
                y: 67,
                informationId: "1",
                informationType: "article",
                type: "card",
                creatorId: "1",
            },
            "2": {
                id: "2",
                canvasId: "1",
                width: 100,
                height: 100,
                name: "Fake Object 2",
                isSelectable: true,
                isDraggable: true,
                isEditable: true,
                depth: 0,
                x: 56,
                y: 67,
                informationId: "2",
                informationType: "article",
                type: "card",
                creatorId: "2",
            },
            "3": {
                id: "3",
                canvasId: "1",
                width: 150,
                height: 150,
                name: "Fake Object",
                isSelectable: true,
                isDraggable: true,
                isEditable: true,
                depth: 0,
                x: 56,
                y: 67,
                informationId: "3",
                informationType: "article",
                type: "card",
                creatorId: "1",
            }
        },
        canvases: {
            "1": {
                id: "1",
                name: "Fake Canvas",
                description: "This is a fake canvas",
                objects: ["1", "2", "3"],
            },
        },
        information: {
            "1": {
                id: "1",
                title: "Fake Information",
                description: "This is a fake information",
                type: "article",
            },
            "2": {
                id: "2",
                title: "Fake Information 2",
                description: "This is a fake information",
                type: "article",
            },
            "3": {
                id: "3",
                title: "Fake Information 3",
                description: "This is a fake information",
                type: "article",
            }
        },
    } satisfies {
        users: Record<string, IUser>
        objects: Record<string, ICanvasObject>
        information: Record<string, IInformation>
        canvases: Record<string, ICanvas>
    }


    return {
        objects: {
            fetch: async (id: string) => {
                // @ts-ignore
                return fakeDb.objects[id]
            },
            fetchMany: async (ids: string[]) => {
                // @ts-ignore
                return ids.map(id => fakeDb.objects[id])
            }
        },
        information: {
            fetch: async (id: string) => {
                // @ts-ignore
                return fakeDb.information[id]
            },
            fetchMany: async (ids: string[]) => {
                // @ts-ignore
                return ids.map(id => fakeDb.information[id])
            }
        },
        canvas: {
            fetch: async (id: string) => {
                // @ts-ignore
                return fakeDb.canvases[id]
            }
        }
    } satisfies IServerClient
} 