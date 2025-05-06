// webpack.config.js
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
  ...defaultConfig,
  entry: {
    media: path.resolve(__dirname, 'src/media.js'),
    post: path.resolve(__dirname, 'src/post.js'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
};
