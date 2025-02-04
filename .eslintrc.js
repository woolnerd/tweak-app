module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "airbnb",
    "airbnb/hooks",
    "universe/native",
    "prettier",
    "plugin:drizzle/all",
  ],
  rules: {
    "drizzle/enforce-delete-with-where": "error",
    "drizzle/enforce-update-with-where": "error",
    "no-use-before-define": ["error", { variables: false }],
    "no-param-reassign": "off",
    "react/function-component-definition": "off",
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-filename-extension": [
      1,
      { extensions: [".js", ".jsx", "ts", ".tsx"] },
    ],
    "react/jsx-uses-react": "off",
    "react/prop-types": [
      "error",
      { ignore: ["navigation", "navigation.navigate"] },
    ],
    "react/react-in-jsx-scope": "off",
    "no-console": "off",
    "no-unused-expressions": [
      "warn",
      { allowShortCircuit: true, allowTernary: true },
    ],
    "no-return-await": "off",
    "react/require-default-props": "off",
    "react/jsx-props-no-spreading": "off",
    "no-bitwise": "off",
  },
  plugins: ["drizzle"],
  overrides: [
    {
      // Test files only
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],
};
