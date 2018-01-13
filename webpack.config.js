const webpack = require('webpack');
const path = require('path');

module.exports = {
  cache: true,
  entry: ["babel-polyfill", "./public/src/index.ts"],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  //devtool: 'inline-source-map', -> this guy bloats the size of bundle.js a heck lot.
  // commented out till required
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
