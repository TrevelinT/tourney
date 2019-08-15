const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkIsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  mode: "production",
  // mode: "development",
  entry: {
    bundle: "./src/index.tsx",
  },
  output: {
    filename: "[name].js",
    publicPath: "/tourney/",
    // publicPath: "/",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "cheap-module-eval-source-map",
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      meta: {
        viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
      },
    }),
    new ForkIsCheckerWebpackPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
