'use strict'
process.env.NODE_ENV = 'production'

const webpack = require('webpack')
const webpackConfig = require('./webpack.prod.conf')

webpack(webpackConfig, (err, stats) => {})
