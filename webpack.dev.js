/**
 * webpack 配置最佳实践 - 开发环境配置文件
 * 
 * 开发环境特点：
 * 1. 快速构建：优化开发体验，减少构建时间
 * 2. 便于调试：提供源码映射，方便定位问题
 * 3. 热更新：实时预览修改结果，提高开发效率
 * 4. 开发服务器：提供本地服务和代理功能
 */

const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader', // 开发环境使用 style-loader
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    // 定义环境变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    // 启用热模块替换
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    compress: true,
    port: 3001,
    hot: true,
    historyApiFallback: true,
    open: true,
  },
  // 开发环境使用 eval-source-map 提供更好的调试体验
  devtool: 'eval-source-map',
});