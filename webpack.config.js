const webpack = require('webpack');
const path = require('path');

const config = {
  entry: './src/index.tsx',
  externals: /^(react|react-dom)(\/.*)?$/,
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    clean: true,
    libraryTarget: 'window',
  },
  // optimization: {
  //   usedExports: false,
  // },
  target: 'web',
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader", exclude: "/node_modules/" },
    ]
  }
};

module.exports = config;
