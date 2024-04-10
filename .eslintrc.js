module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: ["universe/native", "prettier", "plugin:drizzle/all"],
  rules: {
    "react-hooks/exhaustive-deps": "warn",
    "drizzle/enforce-delete-with-where": "error",
    "drizzle/enforce-update-with-where": "error",
  },
  plugins: ["drizzle"],
};
