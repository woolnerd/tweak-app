module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "@babel/transform-react-jsx-source",
      ["inline-import", { extensions: [".sql"] }],
      "nativewind/babel",
    ],
  };
};
