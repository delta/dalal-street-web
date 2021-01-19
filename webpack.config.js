const webpack = require('webpack');
const path = require('path');


module.exports = {
  mode: 'production',
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
},
  cache: true,
  entry: ["babel-polyfill", "./public/src/index.tsx"],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  //devtool: 'inline-source-map', -> this guy bloats the size of bundle.js a heck lot.
  // commented out till required
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [
            path.resolve(__dirname, 'public/src'),
            path.resolve(__dirname, 'public/proto_build'),
        ],
        use: ["babel-loader", "ts-loader"], // tsc converts to es6. convert that to es5
        exclude: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'ts-protoc-gen')
        ],
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: [
          path.resolve(__dirname, 'node_modules'),
        ],
      }
    ]
  },
  plugins: [
      new webpack.optimize.AggressiveMergingPlugin(),
    ],
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  },
  devServer: {
    historyApiFallback: true
  },
};
