const { join } = require("path")

module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:svelte/recommended",
    "plugin:rxjs/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["@typescript-eslint"],
  rules: {},
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: join(__dirname, "./tsconfig.json"),
    extraFileExtensions: [".svelte", ".astro"],
  },
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  ],
  root: true,
}
