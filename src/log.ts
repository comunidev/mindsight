import { consolePlugin } from "@1log/console"
import { noopLog } from "@1log/core"
import { getLogObservable } from "@1log/rxjs"

export const log = noopLog.add(consolePlugin())
export const logObservable = getLogObservable(log)
