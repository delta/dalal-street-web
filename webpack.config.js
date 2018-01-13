const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  cache: true,
  entry: ["babel-polyfill", "./public/src/index.ts"],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  plugins: [
    // automatically optimizes - need to use this because webpack uses default uglifyjs
    // and default uglifyjs has a problem with ES6. UglifyJsPlugin uses uglifyjs-es which
    // supports ES6
    new UglifyJsPlugin({
      cache: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [
            path.resolve(__dirname, 'public/src'),
            path.resolve(__dirname, 'public/proto_build'),
        ],
        exclude: /node_modules/,
        loaders: ["babel-loader", "ts-loader"], // tsc converts to es6. convert that to es5
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  }
};
