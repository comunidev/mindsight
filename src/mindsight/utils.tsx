import { BehaviorSubject } from "rxjs"
import {
  createMemo,
  createSignal,
  type EffectFunction,
  type MemoOptions,
  type Setter,
  type SignalOptions,
} from "solid-js"

export class SvelteSubject<T> extends BehaviorSubject<T> {
  constructor(value: T) {
    super(value)
  }

  set(value: T): T {
    super.next(value)
    return value
  }
}

export function memo<Next extends Prev, Init = Next, Prev = Next>(
  fn: EffectFunction<Init | Prev | undefined, Next>,
  value?: Init,
  options?: MemoOptions<Next>,
): { readonly $: Next } {
  const m = createMemo(fn, value, options)
  return {
    get $() {
      return m()
    },
  }
}

export function signal<T>(
  value: T,
  options?: SignalOptions<T>,
): Setter<T> & { readonly $: T } {
  const [get, set] = createSignal<T>(value, options)

  Object.defineProperty(set, "$", {
    get,
  })

  return set as unknown as Setter<T> & { readonly $: T }
}
