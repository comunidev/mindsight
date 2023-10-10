<script lang="ts">
  import { setContext } from "svelte"
  import { Mindsight } from "../../Mindsight"
  import { getFakeServerClient } from "../../serverClient/FakeServerClient"
  import { pick } from "lodash"
  import Sandbox from "../canvas/Sandbox.svelte"

  export let instanceId: string

  const app = new Mindsight(instanceId, getFakeServerClient())

  setContext(
    "mindsight",
    pick(app, ["db", "canvas", "instanceId", "server", "information"]),
  )
</script>

<Sandbox />
