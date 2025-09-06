/**
 * webpack 配置最佳实践 - 基础配置文件
 * 
 * 为什么拆分配置文件是最佳实践：
 * 1. 关注点分离：将配置按环境拆分，使每个文件职责单一，易于维护
 * 2. 代码复用：共享配置放在 common 文件中，避免重复代码
 * 3. 配置清晰：开发和生产环境的差异一目了然，降低出错风险
 * 4. 扩展性强：便于添加更多环境（如测试、预发布等）
 * 5. 团队协作：不同团队成员可以专注于不同环境的配置
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

// 🔧 环境变量加载策略 - 支持多环境配置
// 根据 NODE_ENV 自动加载对应的环境配置文件
// 加载顺序：.env.[environment] -> .env.local -> .env
const loadEnvironmentVariables = () => {
  const environment = process.env.NODE_ENV || 'development';
  const envFiles = [
    path.resolve(__dirname, `../.env.${environment}`),  // 环境特定配置
    path.resolve(__dirname, '../.env.local'),            // 本地配置（不提交到版本控制）
    path.resolve(__dirname, '../.env'),                  // 默认配置
  ];
  
  let envVars = {};
  
  // 按优先级加载环境变量（后加载的会覆盖先加载的）
  envFiles.forEach(envFile => {
    try {
      const result = dotenv.config({ path: envFile });
      if (result.parsed) {
        envVars = { ...envVars, ...result.parsed };
        console.log(`✅ 加载环境配置: ${envFile}`);
      }
    } catch (error) {
      // 文件不存在时静默跳过
      console.log(`⚠️  环境配置文件不存在: ${envFile}`);
    }
  });
  
  return envVars;
};

const envVars = loadEnvironmentVariables();

module.exports = {
  entry: path.resolve(__dirname, '../src/index.tsx'),
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@/components': path.resolve(__dirname, '../src/components'),
      '@/pages': path.resolve(__dirname, '../src/pages'),
      '@/store': path.resolve(__dirname, '../src/store'),
      '@/utils': path.resolve(__dirname, '../src/utils'),
      '@/types': path.resolve(__dirname, '../src/types'),
      '@/hooks': path.resolve(__dirname, '../src/hooks'),
      '@/services': path.resolve(__dirname, '../src/services'),
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
            configFile: path.resolve(__dirname, '../tsconfig.json'),
          },
        },
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
    // 定义环境变量
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        ...envVars,
      }),
    }),
  ],
  optimization: {
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
};