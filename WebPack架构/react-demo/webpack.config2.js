//多入口文件： 通过生成多个html-webpack-plugin实例

const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')    //注意大括号， 通过这个插件我们可以清除之前打包生成的js文件

const getPath = (_path) => {
    return path.resolve(__dirname, _path)
}

module.exports = {
    entry: {
        main: getPath('./src/app.js'),
        main2: getPath('src/app2.js')
    },
    output: {
        path: getPath('./dist2'),
        filename: '[name].[hash:8].js'
    },
    plugins: [
        new htmlWebpackPlugin({
            template: getPath('./public/index.html'),
            filename: 'index.html',
            chunks: ['main'] // 与入口文件对应的模块名
        }),
        new htmlWebpackPlugin({
            template: getPath('./public/index.html'),
            filename: 'index2.html',
            chunks: ['main2'] // 与入口文件对应的模块名
        }),
        new CleanWebpackPlugin()
    ]
}