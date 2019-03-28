const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    bundle: './src/SheetHelper.js',
  },
  output: {
    library: 'SheetHelper',
    libraryExport: 'SheetHelper',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['lodash'],
            presets: [['@babel/preset-env', { modules: false }]],
          },
        },
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
  ],
  optimization: {
    minimize: false,
  },
};
