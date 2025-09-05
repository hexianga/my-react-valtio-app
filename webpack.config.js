const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  console.log('isProduction', argv.mode, isProduction);

  // 加载环境变量
  const envVars = dotenv.config().parsed || {};
  console.log(envVars);

  // 确保路径正确
  const publicPath = path.resolve(__dirname, 'public');
  const templatePath = path.join(publicPath, 'index.html');

  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist/static'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      publicPath: isProduction ? '/static/' : '/', // 开发环境使用根路径，生产环境使用 /static/
    },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/pages': path.resolve(__dirname, 'src/pages'),
      '@/store': path.resolve(__dirname, 'src/store'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/services': path.resolve(__dirname, 'src/services'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: path.resolve(__dirname, 'tsconfig.json'),
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: templatePath,
      filename: isProduction ? '../index.html' : 'index.html', // 开发环境输出到 static 目录，生产环境输出到根目录
    }),
    // 定义环境变量
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        ...envVars,
        NODE_ENV: isProduction ? 'production' : 'development',
      }),
    }),
    ...(isProduction
      ? [
          new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
          }),
        ]
      : []),
  ],
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: isProduction,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  devServer: {
    static: {
      directory: publicPath,
    },
    compress: true,
    port: 3001,
    hot: true,
    historyApiFallback: true,
    open: true,
  },
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  };
};
