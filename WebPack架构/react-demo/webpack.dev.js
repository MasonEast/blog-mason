//开发环境主要实现的是热更新,不要压缩代码，完整的sourceMap

const Webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const WebpackMerge = require('webpack-merge')           //合并配置
module.exports = WebpackMerge(webpackConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        port: 5555,
        hot: true,
        contentBase: './dist'
    },
    plugins: [
        new Webpack.HotModuleReplacementPlugin()
    ]
})
