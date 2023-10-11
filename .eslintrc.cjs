const { join } = require("path")

module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["plugin:rxjs/recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint"],
  rules: {},
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: join(__dirname, "./tsconfig.json"),
    extraFileExtensions: [".astro"],
  },
  root: true,
}
