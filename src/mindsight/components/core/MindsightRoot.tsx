import type { Component } from "solid-js"
import { Mindsight, MindsightContext } from "../../Mindsight"
import { getFakeServerClient } from "../../serverClient/FakeServerClient"
import { Sandbox } from "../canvas/Sandbox.solid"
import "solid-devtools"
import { attachDevtoolsOverlay } from "@solid-devtools/overlay"

attachDevtoolsOverlay()

export const MindsightRoot: Component<{
  instanceId: string
}> = props => {
  const app = new Mindsight(props.instanceId, getFakeServerClient())

  return (
    <MindsightContext.Provider value={{ ...app }}>
      <Sandbox />
    </MindsightContext.Provider>
  )
}
