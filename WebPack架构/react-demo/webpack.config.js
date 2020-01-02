const path = require('path')
const Webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')        //通过我们给定的html模板输出一个包含打包后的js文件的html文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin')    //注意大括号， 通过这个插件我们可以清除之前打包生成的js文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')     //该插件可以帮助我们拆分js文件中的css为单独的css文件， 通过外链的形式引入, 注意： 使用了该插件后， 就不要再使用style-loader了， 两个loader存在冲突， 一个是将css直接以字符串的形式注入到js中， 一个是将css拆分为单独文件
const os = require('os')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })     //根据系统决定开启几个线程池来处理loader转换， 提高打包效率
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const ISDEV = process.env.NODE_ENV === 'development'

const getPath = (_path) => {
    return path.resolve(__dirname, _path)
}

module.exports = {

    entry: getPath('./src/app.js'),                     //打包入口
    output: {                                           //打包出口
        filename: '[name].[hash:8].js',                 // 打包后的文件名称      
        path: getPath('./dist')                         // 打包后的目录
    },
    module: {
        noParse: /jquery/,
        rules: [
            {                                               //解析js/jsx文件
                test: /\.jsx?$/,
                use: [{
                    loader: 'happypack/loader?id=happyBabel'
                }],
                exclude: /node_modules/
            },
            {                                               //解析less、css文件
                test: /\.less|\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,    //使用了该loader就不要再用style-loader了
                        options: {                              //配置在开发环境下， css发生变化也可以热更新，方便开发
                            hmr: ISDEV,
                            reloadAll: true,
                        },
                    },
                    // 'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [require('autoprefixer')]
                        }
                    },
                    {
                        loader: "less-loader",
                        options: {
                            javascriptEnabled: true
                        }
                    }
                ] // 从右向左解析原则
            },
            {                                               //解析图片文件
                test: /\.(jpe?g|png|gif)$/i, //图片文件
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'img/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {                                               //解析媒体文件
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'media/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {                                               //解析字体图标文件
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'fonts/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
        ]
    },
    plugins: [                                          //插件
        new HtmlWebpackPlugin({
            template: getPath('./public/index.html')
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: ISDEV ? '[name].css' : '[name].[hash].css',
            chunkFilename: ISDEV ? '[id].css' : '[id].[hash].css'
        }),
        new HappyPack({
            id: 'happyBabel',                            //与loader对应的id标识
            loaders: [
                {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true            //开启缓存， 将 loader 的编译结果写入硬盘缓存。再次构建会先比较一下，如果文件较之前的没有发生变化则会直接使用缓存
                    }
                }
            ],
            threadPool: happyThreadPool                 //共享线程池
        }),
        // new Webpack.HotModuleReplacementPlugin(),
        new Webpack.DllReferencePlugin({                //通过dllplugin抽离很少变动的第三方包
            context: __dirname,
            manifest: require('./vendor-manifest.json')
        }),
        new CopyWebpackPlugin([                         // 拷贝生成的文件到dist目录 这样每次不必手动去cv
            { from: 'static', to: 'static' }
        ]),
    ],
    resolve: {
        alias: {
            ' @': getPath('./src')
        },
        extensions: ['*', '.js', '.jsx']
    },
    optimization: {
        minimizer: ISDEV ? [] : [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: false, // Must be set to true if using source-maps in production
                terserOptions: {
                    // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                }
            }),
            // new WebpackParallelUglifyPlugin({
            //     cacheDir: '.cache/',
            //     uglifyJS: {

            //     }
            // })
        ]
    },
    externals: {                                            //这里配置的依赖， 通过script标签形式引入项目， 让我们依然可以使用AMD， CMD的方法引入项目使用
        jquery: 'jQuery'
    },
    // devServer: {                                            //通过webpack-dev-server启动一个前端服务方便开发
    //     port: 3000,
    //     hot: true,
    //     contentBase: './dist'
    // }
}


/**
 *优化webpack配置的方法：
 1.缩小文件的搜索范围(配置include exclude alias noParse extensions)
    alias: 当我们代码中出现 import 'xx'时， webpack会采用向上递归搜索的方式去node_modules 目录下找。为了减少搜索范围我们可以直接告诉webpack去哪个路径下查找。也就是别名(alias)的配置。
    include exclude: 同样配置include exclude也可以减少webpack loader的搜索转换时间。
    noParse:  当我们代码中使用到import jq from 'jquery'时，webpack会去解析jq这个库是否有依赖其他的包。但是我们对类似jquery这类依赖库，一般会认为不会引用其他的包(特殊除外,自行判断)。增加noParse属性,告诉webpack不必解析，以此增加打包速度。
    extensions:  webpack会根据extensions定义的后缀查找文件(频率较高的文件类型优先写在前面)
2.使用HappyPack开启多进程Loader转换
    在webpack构建过程中，实际上耗费时间大多数用在loader解析转换以及代码的压缩中。日常开发中我们需要使用Loader对js，css，图片，字体等文件做转换操作，并且转换的文件数据量也是非常大。
    由于js单线程的特性使得这些转换操作不能并发处理文件，而是需要一个个文件进行处理。HappyPack的基本原理是将这部分任务分解到多个子进程中去并行处理，子进程处理完成后把结果发送到主进程中，
    从而减少总的构建时间
3. 使用webpack-parallel-uglify-plugin 增强优化代码压缩时间
4. 抽离第三方模块
    使用webpack内置的DllPlugin DllReferencePlugin进行抽离，在与webpack配置文件同级目录下新建webpack.dll.config.js
5. 配置缓存
    安装cache-loader， 在一些性能开销较大的 loader 之前添加cache-loader即可
6. 优化打包体积
    安装webpack-bundle-analyzer，通过该插件我们可以查看文件依赖， 并做优化
7. Externals
    如果我们想引用一个库，但是又不想让webpack打包，并且又不影响我们在程序中以CMD、AMD或者window/global全局等方式进行使用，那就可以通过配置Externals
 */