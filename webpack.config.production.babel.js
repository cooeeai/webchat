import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';

module.exports = {
  cache: true,
  debug: true,
  devtool: 'source-map',
  entry: {
    main: [
      './src/index.js'
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve('./dist'),
    publicPath: '/webchat/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.scss$/,
        include: path.resolve('./src/styles'),
        loaders: [
          'style',
          'css',
          'postcss',
          'sass'
        ]
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream"
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file"
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml"
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
        'FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
        'FIREBASE_URL': JSON.stringify(process.env.FIREBASE_URL),
        'FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
        'FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
        'GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.GOOGLE_MAPS_API_KEY),
        'CHAT_SERVER': JSON.stringify(process.env.CHAT_SERVER)
      }
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        dead_code: true,
        screw_ie8: true,
        unused: true,
        warnings: false
      }
    })
  ],
  postcss() {
    return [autoprefixer({ browsers: ['last 3 versions']})];
  },
  sassLoader: {
    includePaths: [path.resolve('node_modules')]
  },
  resolve: {
    extensions: ['', '.js', '.scss'],
    modulesDirectories: ['node_modules'],
    root: path.resolve('./src')
  },
  stats: {
    cached: true,
    cachedAssets: true,
    chunks: true,
    chunkModules: false,
    colors: true,
    hash: false,
    reasons: true,
    timings: true,
    version: true
  }
};
