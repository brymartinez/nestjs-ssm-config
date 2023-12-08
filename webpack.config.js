/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const slsw = require('serverless-webpack');
const ForkTSCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
require('source-map-support').install();
const TerserPlugin = require('terser-webpack-plugin');

// List of Nestjs lazy imports
const lazyImports = [
  '@nestjs/microservices',
  '@nestjs/microservices/microservices-module',
  '@nestjs/websockets/socket-module',
  '@nestjs/platform-express',
  '@grpc/grpc-js',
  '@grpc/proto-loader',
  'kafkajs',
  'mqtt',
  'nats',
  'ioredis',
  'amqplib',
  'amqp-connection-manager',
  'pg-native', // for `pg` only
  'cache-manager',
  'class-validator',
  'class-transformer',
];

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  devtool: 'source-map',
  entry: slsw.lib.entries,
  target: 'node',
  resolve: {
    extensions: ['.cjs', '.mjs', '.js', '.ts'],
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  externals: [],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.webpack.json',
          transpileOnly: true,
          experimentalFileCaching: true,
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
        },
      }),
    ],
  },
  plugins: [
    new ForkTSCheckerWebpackPlugin(),
    new webpack.IgnorePlugin({
      checkResource(resource) {
        if (lazyImports.includes(resource)) {
          try {
            require.resolve(resource);
          } catch (err) {
            return true;
          }
        }
        return false;
      },
    }),
  ],
};
