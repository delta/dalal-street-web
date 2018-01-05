const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: "./public/src/index.ts",
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [
            path.resolve(__dirname, 'public/src'),
            path.resolve(__dirname, 'public/proto_build')
        ],
        exclude: /node_modules/,
        loader: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  }
};
