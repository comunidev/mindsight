import { defineConfig } from "astro/config"
import UnoCSS from "unocss/astro"
import solidJs from "@astrojs/solid-js"

import svelte from "@astrojs/svelte"
import extractorSvelte from "@unocss/extractor-svelte"

// https://astro.build/config
export default defineConfig({
  integrations: [
    UnoCSS({
      injectReset: true,
      extractors: [extractorSvelte()],
    }),
    solidJs(),
    svelte(),
  ],
})
