/**
 * webpack 配置最佳实践 - 生产环境配置文件
 * 
 * 生产环境特点：
 * 1. 代码优化：压缩、混淆代码，减小体积
 * 2. 性能优化：分离CSS，优化缓存策略
 * 3. 资源处理：优化静态资源加载
 * 4. 安全考虑：移除开发调试信息
 * 5. 稳定可靠：生成稳定的构建产物
 */

const path = require('path');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common');

// 确保路径正确 - 调整为从项目根目录引用
const publicPath = path.resolve(__dirname, '../public');
const templatePath = path.join(publicPath, 'index.html');

module.exports = merge(commonConfig, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist/static'),
    filename: '[name].[contenthash].js',
    publicPath: '/static', // 生产环境使用根路径
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 生产环境提取CSS到单独文件
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    // 定义环境变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    // 提取CSS到单独文件
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    // 配置HTML输出
    new HtmlWebpackPlugin({
      template: templatePath,
      filename: '../index.html', // 生产环境输出到根目录
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 移除console
          },
        },
      }),
    ],
  },
  // 生产环境使用 source-map 提供错误追踪能力，同时不暴露源码
  devtool: 'source-map',
});