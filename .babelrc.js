module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: "last 2 versions",
        },
      },
    ],
    "@babel/preset-typescript",
    "@babel/preset-react",
  ],
  plugins: [
    [
      "@babel/plugin-proposal-decorators",
      { legacy: true },
    ],
    [
      "@babel/plugin-proposal-class-properties",
      { loose: true },
    ],
    // [
    //   "module-resolver",
    //   { root: ["./src"] },
    // ],
    "react-hot-loader/babel",
  ]
};
