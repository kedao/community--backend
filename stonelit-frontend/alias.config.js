 'use strict'
 const path = require('path')

 module.exports = {
  context: path.resolve(__dirname, './'),
  resolve: {
    mainFiles: ['index', 'Index'],
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve('src'),
      '@admin': path.resolve(__dirname, 'src/admin'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@comp': path.resolve(__dirname, 'src/components'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@plug': path.resolve(__dirname, 'src/plugins'),
      '@utils': path.resolve(__dirname, 'src/utils')
    }
  }
}