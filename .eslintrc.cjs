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
    quotes: ["error", "double"],
    "eol-last": ["error", "always"],
    "@typescript-eslint/no-unused-vars": ["error"],
    // Disable rules
    "no-unused-vars": "off", // Need to turn off this in favor of typescript-eslint
    "@typescript-eslint/explicit-function-return-type": "off",
  },
  overrides: [
    Object.assign(
      {
        files: ["**/*.test.ts", "**/tests/**/*.ts"],
        env: { jest: true },
        plugins: ["jest"],
      },
      require("eslint-plugin-jest").configs.recommended,
    ),
  ],
};
