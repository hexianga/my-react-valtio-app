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
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common');

// 确保路径正确 - 调整为从项目根目录引用
const publicPath = path.resolve(__dirname, '../public');
const templatePath = path.join(publicPath, 'index.html');

module.exports = merge(commonConfig, {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../dist'),
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
    // 配置HTML输出
    new HtmlWebpackPlugin({
      template: templatePath,
    }),
    // 🔧 开发环境变量定义
    // NODE_ENV 会被自动设置，其他环境变量从 .env.development 加载
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    // 🔥 启用热模块替换
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, '../public'),
    },
    compress: true,
    port: 3001,
    hot: true,           // 🔥 启用热更新
    historyApiFallback: true,
    open: true,
    client: {
      overlay: {
        errors: true,      // 显示错误覆盖层
        warnings: false,   // 隐藏警告避免干扰
      },
    },
    // 🔧 API 代理配置（可选）
    proxy: {
      '/api': {
        target: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // 开发环境使用 eval-source-map 提供更好的调试体验
  devtool: 'eval-source-map',
});