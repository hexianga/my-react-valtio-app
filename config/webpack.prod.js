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
    publicPath: process.env.CDN_URL || '/static/', // 🔧 支持 CDN 配置
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
      // 注意：移除了 LESS 配置，因为 Ant Design 5.x 使用 CSS-in-JS
    ],
  },
  plugins: [
    // 🔧 生产环境变量定义
    // NODE_ENV 会被自动设置，其他环境变量从 .env.production 加载
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    // 🎨 提取CSS到单独文件
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    // 📄 配置HTML输出
    new HtmlWebpackPlugin({
      template: templatePath,
      filename: '../index.html', // 生产环境输出到根目录
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
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
  // 🔍 Source Map 配置 - 生产环境最佳实践
  // 根据 GENERATE_SOURCEMAP 环境变量决定是否生成 source map
  // - 生产环境默认禁用以减小文件体积和保护源码
  // - 可通过设置 GENERATE_SOURCEMAP=true 启用（便于错误监控）
  devtool: process.env.GENERATE_SOURCEMAP === 'true' ? 'source-map' : false,
});
