module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
  },
  env: {
    browser: true,
    node: true,
  },
  extends: "standard",
  globals: {
    __static: true,
  },
  plugins: ["html"],
  rules: {
    "arrow-parens": 0,
    "generator-star-spacing": 0,
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    "no-extra-semi": 0,
    "no-undef": 0,
    semi: 0,
    quotes: 0,
    indent: 0,
    curly: 0,
    eqeqeq: 0,
    "node/no-deprecated-api": 0,
    "no-deprecated-api": 0,
    "no-mixed-spaces-and-tabs": 0,
    "no-tabs": 0,
    "space-unary-ops": 0,
    "no-multi-spaces": 0,
    "one-var": 0,
    "no-return-assign": 0,
    "arrow-spacing": 0,
    "block-spacing": 0,
    "no-new": 0,
    "eslint-plugin-vue": 0,
    "spaced-comment": 0,
    "space-before-function-paren": 0,
    "space-before-blocks": 0,
    "no-unused-vars": 0,
    "padded-blocks": 0,
    "no-multiple-empty-lines": 0,
    "new-cap": 0,
    "brace-style": 0,
    "no-useless-escape": 0,
    "handle-callback-err": 0,
    "comma-dangle": 0,
    "no-trailing-spaces": 0,
  },
};
