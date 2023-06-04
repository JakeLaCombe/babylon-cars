const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: '[name].[contenthash].js',
    hashFunction: 'xxhash64'
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".glsl"],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      { test: /\.glsl$/, loader: "webpack-glsl-loader" },
      {
        test: /\.(png|jpe?g|gif|glb|gltf|babylon)$/i,
        loader: "file-loader",
        options: {
          publicPath: "./",
          name: "[name].[ext]",
        },
      }
    ],
  },
  plugins: [
    new CopyPlugin({
        patterns: [
            { from: "public" },
        ],
    }),
    new HtmlWebpackPlugin({
      template: "!!handlebars-loader!src/index.hbs",
    }),
  ],
}
