const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, '../src/remoteApp/index.tsx'),
  output: {
    path: path.resolve(__dirname, '../dist-remote'),
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: path.resolve(__dirname, '../tsconfig.json'),
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      title: 'Remote App',
    }),
    new webpack.container.ModuleFederationPlugin({
      name: 'remoteApp',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': path.resolve(__dirname, '../src/remoteApp/Button'),
      },
      shared: {
        react: { singleton: true, requiredVersion: require('../package.json').dependencies.react },
        'react-dom': { singleton: true, requiredVersion: require('../package.json').dependencies['react-dom'] },
      },
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, '../public'),
    },
    compress: true,
    port: 3001,
    hot: true,
    historyApiFallback: true,
    open: false,
  },
  devtool: 'eval-source-map',
};

