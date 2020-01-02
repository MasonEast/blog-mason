// webpack.dll.config.js
//如果我们没有更新第三方依赖包，就不必npm run dll
const path = require("path");
const webpack = require("webpack");
module.exports = {
    // 开发项目中不经常会变更的静态依赖文件,以后只要我们不升级第三方包的时候，那么webpack就不会对这些库去打包，这样可以快速的提高打包的速度
    entry: {
        vendor: ['react', 'react-dom', 'antd']
    },
    output: {
        path: path.resolve(__dirname, 'static/js'), // 打包后文件输出的位置
        filename: '[name].dll.js',
        library: '[name]_library'
        // 这里需要和webpack.DllPlugin中的`name: '[name]_library',`保持一致。
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve(__dirname, '[name]-manifest.json'),
            name: '[name]_library',
            context: __dirname
        })
    ]
};
