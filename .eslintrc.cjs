module.exports = {
  env: {
    node: true,
  },
  extends: ["eslint:recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    semi: ["error", "always"],
    indent: ["error", 2],
    "eol-last": ["error", "always"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "ignoreRestSiblings": true
      }
    ],
    // Disable rules
    "no-unused-vars": "off", // Need to turn off this in favor of typescript-eslint
    "@typescript-eslint/explicit-function-return-type": "off"
  }
};
