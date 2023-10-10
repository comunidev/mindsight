({
    "showValueOnSelection": true,
    // "showInlineValues": true,
    // "showTypes": true,
})

import Dexie from "dexie";

interface Relation {
    id: string;
    fromType: string;
    fromId: string;
    toType: string;
    toId: string;
    relation: string;
    inverse: string;
}

interface CanvasObject {
    id: string;
    type: string;
    name: string;
    x: number;
    y: number;
}

interface Type {
    id: string;
    name: string;
}

let indexedDB: IDBFactory | undefined = undefined;
let IDBKeyRange: any = undefined;

if (typeof window == "undefined") {
    const FakeIndexedDB = await import("fake-indexeddb");
    indexedDB = FakeIndexedDB.indexedDB;
    IDBKeyRange = FakeIndexedDB.IDBKeyRange;
}


class AppDatabase extends Dexie {
    public relations !: Dexie.Table<Relation, string>;
    public canvasObjects !: Dexie.Table<CanvasObject, string>;
    public types !: Dexie.Table<Type, string>;

    public constructor() {
        super("AppDatabase", {
            indexedDB,
            IDBKeyRange
        });

        this.version(1).stores({
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
            canvasObjects: `
                id,
                type,
                name,
                informationId
                x,
                y
            `,
            informations: `
                id,
                title,
                description,
            `,
            types: `
                id,
                name
            `
        });
    }
}

const db = new AppDatabase()

await db.relations.put({
    id: "1",
    fromType: "a",
    fromId: "1",
    toType: "b",
    toId: "1",
    relation: "r",
    inverse: "ir"
}) //?.

await db.relations.toArray() //?.

var start = performance.now()
await db.canvasObjects.put({
    id: "1",
    type: "a",
    name: "a",
    x: 0,
    y: 0
})
var end = performance.now()
await db.canvasObjects.clear()
console.log(end - start)

var start = performance.now()
for (let i = 0; i < 1000; i++) {
    await db.canvasObjects.add({
        id: i.toString(),
        type: "a",
        name: "a",
        x: 0,
        y: 0
    })
}
var end = performance.now()
await db.canvasObjects.clear()
console.log(end - start)

var start = performance.now()
await db.canvasObjects.bulkAdd([...Array(1000).keys()].map((i: number) => {
    return {
        id: i.toString(),
        type: "a",
        name: "a",
        x: 0,
        y: 0
    }
}))
var end = performance.now()
console.log(end - start)

var start = performance.now()
await db.canvasObjects.toArray()
var end = performance.now()
console.log(end - start)


