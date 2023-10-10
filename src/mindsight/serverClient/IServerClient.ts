import type { ICanvasObject } from "../interfaces/ICanvasObject";
import type { IInformation } from "../interfaces/IInformation";

export interface IServerClient {
    canvas: {
        fetch: (id: string) => Promise<ICanvasObject | null>,
    }
    information: {
        fetch: (id: string) => Promise<IInformation | null>,
        fetchMany: (ids: string[]) => Promise<(IInformation | null)[]>,
    },
    objects: {
        fetch: (id: string) => Promise<ICanvasObject>,
        fetchMany: (ids: string[]) => Promise<(ICanvasObject | null)[]>,
    }
}