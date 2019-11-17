const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    // Only output to intermediary, it will be post-processed from thereon
    path: path.resolve(__dirname, 'intermediary')
  }
}
