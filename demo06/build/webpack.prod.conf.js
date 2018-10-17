'use strict'
const path = require('path')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

const prodWebpackConfig = merge(baseWebpackConfig, {
  devtool: '#source-map',
  plugins: []
})

module.exports = prodWebpackConfig
