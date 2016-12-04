import path from 'path';
import webpack from 'webpack';

module.exports = {
  devtool: 'inline-source-map',
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
        exclude: /node_modules/,
        loader: 'null'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('test'),
        'FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
        'FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
        'FIREBASE_URL': JSON.stringify(process.env.FIREBASE_URL),
        'FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
        'FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
        'GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.GOOGLE_MAPS_API_KEY)
      }
    }),
  ],
  resolve: {
    extensions: ['', '.js', '.scss'],
    modulesDirectories: ['src', 'node_modules'],
    root: path.resolve('./test')
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
    version: false
  }
};
