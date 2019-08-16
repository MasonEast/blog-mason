#  优化

## 优化开发体验

### 优化构建速度

#### 缩小文件搜索范围

Webpack启动后会从配置的Entry出发，解析出文件中的导入语句，再递归的解析。在遇到导入语句时Webpack会做两件事：

1. 根据导入语句去寻找对应的要导入的文件。
2. 根据找到的要导入文件的后缀，使用配置的Loader去处理文件。

尽量减少以上两件事情的发生可以提高速度：

#### 优化Loader配置

由于Loader对文件的转换操作很耗时，需要让尽可能少的文件被Loader处理,通过test, include, exclude三个配置项命中Loader要应用规则的文件，尽可能少的让文件被Loader处理

```js
module.exports = {
  module: {
    rules: [
      {
        // 如果项目源码中只有 js 文件就不要写成 /\.jsx?$/，提升正则表达式性能
        test: /\.js$/,
        // babel-loader 支持缓存转换出的结果，通过 cacheDirectory 选项开启
        use: ['babel-loader?cacheDirectory'],
        // 只对项目根目录下的 src 目录中的文件采用 babel-loader
        include: path.resolve(__dirname, 'src'),
      },
    ]
  },
};
```

#### 优化resolve.modules配置

resolve.modules用于配置Webpack去哪些目录下寻找第三方模块。默认值是`node_modules`。含义是先去当前目录下的 `./node_modules` 目录下去找想找的模块，如果没找到就去上一级目录` ../node_modules` 中找，再没有就去 `../../node_modules` 中找，以此类推，这和 Node.js 的模块寻找机制很相似。

当安装的第三方模块都放在项目根目录下的`./node_modules`目录下时，可以指明存放第三方模块的绝对路径，减少寻找：

```js
module.exports = {
  resolve: {
    // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
    // 其中 __dirname 表示当前工作目录，也就是项目根目录
    modules: [path.resolve(__dirname, 'node_modules')]
  },
};
```

#### 优化resolve.mainFields配置

该配置用于配置第三方模块使用哪个入口文件。
为了减少搜索步骤，在明确第三方模块的入口文件描述字段时，可以把它设置的尽量少：
```js
module.exports = {
  resolve: {
    //只采用main字段作为入口文件描述字段，以减少搜索步骤
    mainFields: ['main']
  }
}
```
注意：**使用本方法优化时，一定要确定第三方模块的入口文件描述字段**

#### 优化resolve.alias配置

该配置项通过别名把原来导入路径映射成一个新的导入路径。

以 React 库为例，安装到 node_modules 目录下的 React 库的目录结构如下：

├── dist
│   ├── react.js
│   └── react.min.js
├── lib
│   ... 还有几十个文件被忽略
│   ├── LinkedStateMixin.js
│   ├── createClass.js
│   └── React.js
├── package.json
└── react.js

默认情况下 Webpack 会从入口文件 `./node_modules/react/react.js` 开始递归的解析和处理依赖的几十个文件，这会时一个耗时的操作。 通过配置 resolve.alias 可以让 Webpack 在处理 React 库时，直接使用单独完整的 react.min.js 文件，从而跳过耗时的递归解析操作。

```js
module.exports = {
  resolve: {
    // 使用 alias 把导入 react 的语句换成直接使用单独完整的 react.min.js 文件，
    // 减少耗时的递归解析操作
    alias: {
      'react': path.resolve(__dirname, './node_modules/react/dist/react.min.js'), // react15
      // 'react': path.resolve(__dirname, './node_modules/react/umd/react.production.min.js'), // react16
    }
  },
};
```

#### 优化resolve.extensions配置

在导入语句没带文件后缀时，Webpack会自动带上后缀去尝试询问文件是否存在。默认是`extensions: ['.js', '.json']`
也就是说当遇到 `require('./data')` 这样的导入语句时，Webpack 会先去寻找 `./data.js` 文件，如果该文件不存在就去寻找 `./data.json` 文件，如果还是找不到就报错。

所以如果这个列表越长，或者正确的后缀在越后面，就会造成尝试的次数越多，在配置时要做到：

1. 后缀尝试列表要尽可能的小
2. 频率出现最高的文件后缀要优先放在最前面
3. 在源码中写导入语句时，尽可能带上后缀，从而避免寻找过程。
4. 
```js
module.exports = {
  resolve: {
    // 尽可能的减少后缀尝试的可能性
    extensions: ['js'],
  },
};
```
#### 优化module.noParse配置

module.noParse配置项可以让Webpack忽略对部分没采用模块化的文件的递归解析处理，这样做的好处是提高构建性能。

```js
const path = require('path');

module.exports = {
  module: {
    // 独完整的 `react.min.js` 文件就没有采用模块化，忽略对 `react.min.js` 文件的递归解析处理
    noParse: [/react\.min\.js$/],
  },
};
```

#### 使用DllPlugin

以.dll为后缀的文件被称为**动态链接库**，在一个动态链接库中可以包含给其他模块调用的函数和数据。

要给Web项目接入动态链接库的思想需要：
1. 把网页依赖的基础模块抽离出来，打包到一个个单独的动态链接库中去，一个动态链接库可以包含多个模块。
2. 当需要导入的模块存在于某个动态链接库中时，这个模块不能被再次打包，而是去动态链接库中获取。
3. 页面依赖的所有动态链接库需要被加载。

接入动态链接库可以大大提升构建速度，原因在于包含大量复用模块的动态链接库只需要编译一次，在之后的构建过程中被动态链接库包含的模块将不会再重新编译。

Webpack内置了对动态链接库的支持，需要通过2个内置的插件接入：

1. DllPlugin插件： 用于打包出一个个单独的动态链接库文件。
2. DllReferencePlugin插件： 用于在主要配置文件中去引入DllPlugin插件打包好的动态链接库文件。

下面以基本的React项目为例，为其接入DllPlugin，在开始前先看下最终构建出的项目结构：

├── main.js
├── polyfill.dll.js
├── polyfill.manifest.json
├── react.dll.js
└── react.manifest.json

其中包含两个动态链接库文件，分别是：

1. polyfill.dll.js：里面包含项目所有依赖的polyfill，例如Promise， fetch等API
2. react.dll.js： 里面包含React的基础运行环境，也就是react和react-dom模块

react.dll.js文件内容大致如下：

```js
var _dll_react = (function(modules) {
  // ... 此处省略 webpackBootstrap 函数代码
}([
  function(module, exports, __webpack_require__) {
    // 模块 ID 为 0 的模块对应的代码
  },
  function(module, exports, __webpack_require__) {
    // 模块 ID 为 1 的模块对应的代码
  },
  // ... 此处省略剩下的模块对应的代码 
]));
```

react.manifest.json文件大致内容：

```js
{
  // 描述该动态链接库文件暴露在全局的变量名称
  "name": "_dll_react",
  "content": {
    "./node_modules/process/browser.js": {
      "id": 0,
      "meta": {}
    },
    // ... 此处省略部分模块
    "./node_modules/react-dom/lib/ReactBrowserEventEmitter.js": {
      "id": 42,
      "meta": {}
    },
    "./node_modules/react/lib/lowPriorityWarning.js": {
      "id": 47,
      "meta": {}
    },
    // ... 此处省略部分模块
    "./node_modules/react-dom/lib/SyntheticTouchEvent.js": {
      "id": 210,
      "meta": {}
    },
    "./node_modules/react-dom/lib/SyntheticTransitionEvent.js": {
      "id": 211,
      "meta": {}
    },
  }
}
```

manifest.json文件清楚的描述了与其对应的dll.js文件中包含了哪些模块，以及每个模块的路径和ID

main.js文件是编译出来的执行入口文件，当遇到其依赖的模块再dll.js文件中时，会直接通过dll.js文件暴露出的全局变量去获取打包在dll.js文件的模块，所以在index.html文件中需要把依赖的两个dll.js文件给加载进去：

```js
<html>
<head>
  <meta charset="UTF-8">
</head>
<body>
<div id="app"></div>
<!--导入依赖的动态链接库文件-->
<script src="./dist/polyfill.dll.js"></script>
<script src="./dist/react.dll.js"></script>
<!--导入执行入口文件-->
<script src="./dist/main.js"></script>
</body>
</html>
```

##### 构建出动态链接库文件

构建输出的以下这四个文件

├── polyfill.dll.js
├── polyfill.manifest.json
├── react.dll.js
└── react.manifest.json
和以下这一个文件

├── main.js
是由两份不同的构建分别输出的。

动态链接库文件相关的文件需要一份独立的构建输出，用于给主构建使用。新建一个Webpack配置文件webpack_dll.config.js专门用于构建它们：

```js
const path = require('path');
const DllPlugin = require('webpack/lib/DllPlugin');

module.exports = {
  // JS 执行入口文件
  entry: {
    // 把 React 相关模块的放到一个单独的动态链接库
    react: ['react', 'react-dom'],
    // 把项目需要所有的 polyfill 放到一个单独的动态链接库
    polyfill: ['core-js/fn/object/assign', 'core-js/fn/promise', 'whatwg-fetch'],
  },
  output: {
    // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称，
    // 也就是 entry 中配置的 react 和 polyfill
    filename: '[name].dll.js',
    // 输出的文件都放到 dist 目录下
    path: path.resolve(__dirname, 'dist'),
    // 存放动态链接库的全局变量名称，例如对应 react 来说就是 _dll_react
    // 之所以在前面加上 _dll_ 是为了防止全局变量冲突
    library: '_dll_[name]',
  },
  plugins: [
    // 接入 DllPlugin
    new DllPlugin({
      // 动态链接库的全局变量名称，需要和 output.library 中保持一致
      // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
      // 例如 react.manifest.json 中就有 "name": "_dll_react"
      name: '_dll_[name]',
      // 描述动态链接库的 manifest.json 文件输出时的文件名称
      path: path.join(__dirname, 'dist', '[name].manifest.json'),
    }),
  ],
};

```

用于输出main.js的主Weboack配置文件：

```js
const path = require('path');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');

module.exports = {
  entry: {
    // 定义入口 Chunk
    main: './main.js'
  },
  output: {
    // 输出文件的名称
    filename: '[name].js',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        // 项目源码使用了 ES6 和 JSX 语法，需要使用 babel-loader 转换
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: path.resolve(__dirname, 'node_modules'),
      },
    ]
  },
  plugins: [
    // 告诉 Webpack 使用了哪些动态链接库
    new DllReferencePlugin({
      // 描述 react 动态链接库的文件内容
      manifest: require('./dist/react.manifest.json'),
    }),
    new DllReferencePlugin({
      // 描述 polyfill 动态链接库的文件内容
      manifest: require('./dist/polyfill.manifest.json'),
    }),
  ],
  devtool: 'source-map'
};
```

注意：在 webpack_dll.config.js 文件中，DllPlugin 中的 name 参数必须和 output.library 中保持一致。 原因在于 DllPlugin 中的 name 参数会影响输出的 manifest.json 文件中 name 字段的值， 而在 webpack.config.js 文件中 DllReferencePlugin 会去 manifest.json 文件读取 name 字段的值， 把值的内容作为在从全局变量中获取动态链接库中内容时的全局变量名。

##### 执行构建

在修改好以上两个 Webpack 配置文件后，需要重新执行构建。 重新执行构建时要注意的是需要先把动态链接库相关的文件编译出来，因为主 Webpack 配置文件中定义的 DllReferencePlugin 依赖这些文件。

执行构建时流程如下：

1. 如果动态链接库相关的文件还没有编译出来，就需要先把它们编译出来。方法是执行 webpack --config webpack_dll.config.js 命令。
2. 在确保动态链接库存在时，才能正常的编译出入口执行文件。方法是执行 webpack 命令。这时你会发现构建速度有了非常大的提升。


#### 使用HappyPack

在整个Webpack构建流程中，最耗时的流程可能就是Loader对文件的转换操作。Happypack的核心原理就是把这部分的任务分解到多个进程去并行处理，从而减少总的构建时间。

#### 使用ParallelUglifyPlugin

ParallelUglifyPlugin 做了这样一件事， 当 Webpack 有多个 JavaScript 文件需要输出和压缩时，原本会使用 UglifyJS 去一个个挨着压缩再输出， 但是 ParallelUglifyPlugin 则会开启多个子进程，把对多个文件的压缩工作分配给多个子进程去完成，每个子进程其实还是通过 UglifyJS 去压缩代码，但是变成了并行执行。 所以 ParallelUglifyPlugin 能更快的完成对多个文件的压缩工作。

### 优化使用体验

#### 使用自动刷新

##### 文件监听

文件监听是在发现源码文件发生变化时，自动重新构建出新的输出文件。

```js
module.export = {
  // 只有在开启监听模式时，watchOptions 才有意义
  // 默认为 false，也就是不开启
  watch: true,
  // 监听模式运行时的参数
  // 在开启监听模式时，才有意义
  watchOptions: {
    // 不监听的文件或文件夹，支持正则匹配
    // 默认为空
    ignored: /node_modules/,
    // 监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
    // 默认为 300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停的去询问系统指定文件有没有变化实现的
    // 默认每隔1000毫秒询问一次
    poll: 1000
  }
}
```

##### 自动刷新浏览器

监听到文件更新后的下一步是去刷新浏览器，webpack模块负责监听文件，webpack-dev-server模块则负责刷新浏览器，在使用 webpack-dev-server 模块去启动 webpack 模块时，webpack 模块的监听模式默认会被开启。 webpack 模块会在文件发生变化时告诉 webpack-dev-server 模块。

控制浏览器刷新有三种方法：
1. 借助浏览器扩展去通过浏览器提供的接口刷新， WebStorm IDE的LiveEdit功能就是这样实现的。
2. 往要开发的网页中注入代理客户端代码，通过代理客户端去刷新整个页面
3. 往要开发的网页装入一个iframe中，通过刷新iframe去看到最新效果

DevServer支持第二，三中方法，第二种是DevServer默认采用的刷新方法

**优化自动刷新的性能：**

devServer.inline配置项是用来控制是否往Chunk中注入代理客户端的，默认会注入。当你的项目需要输出多个Chunk时，会给它们都注入一个代理客户端，其实网页只要依赖了其中一个Chunk，代理客户端就被注入网页中期。

这里的优化思路是关闭还不够优雅的inline模式，只注入一个代理客户端， 可通过执行`webpack-dev-server --inline false`（也可在配置文件中设置）

要开发的网页被放进了一个 iframe 中，编辑源码后，iframe 会被自动刷新。 同时你会发现构建时间从 1566ms 减少到了 1130ms，说明优化生效了。构建性能提升的效果在要输出的 Chunk 数量越多时会显得越突出。

在你关闭了 inline 后，DevServer 会自动地提示你通过新网址 http://localhost:8080/webpack-dev-server/ 去访问，这点是做的很人性化的。

如果你不想通过 iframe 的方式去访问，但同时又想让网页保持自动刷新功能，你需要手动往网页中注入代理客户端脚本，往 index.html 中插入以下标签：

<!--注入 DevServer 提供的代理客户端脚本，这个服务是 DevServer 内置的-->
<script src="http://localhost:8080/webpack-dev-server.js"></script>
给网页注入以上脚本后，独立打开的网页就能自动刷新了。但是要注意在发布到线上时记得删除掉这段用于开发环境的代码。

#### 开启模块热替换

原理是当一个源码发生变化时，只重新编译发生变化的模块，再用新输出的模块替换掉浏览器中对应的老模块，优势有：

1. 实时预览反应更快，等待时间更短
2. 不刷新浏览器能保留当前网页的运行状态，例如在使用Redux来管理数据的应用中搭配模块热替换能做到代码更新时Recux中的数据还保持不变。

DevServer默认不会开启模块热替换模式，要开启只需在启动时带上参数`--hot`。也可以通过接入Plugin实现：

```js
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');

module.exports = {
  entry:{
    // 为每个入口都注入代理客户端
    main:['webpack-dev-server/client?http://localhost:8080/', 'webpack/hot/dev-server','./src/main.js'],
  },
  plugins: [
    // 该插件的作用就是实现模块热替换，实际上当启动时带上 `--hot` 参数，会注入该插件，生成 .hot-update.json 文件。
    new HotModuleReplacementPlugin(),
  ],
  devServer:{
    // 告诉 DevServer 要开启模块热替换模式
    hot: true,      
  }  
};
```

## 优化输出质量

### 区分环境

在开发网页时，一般都会有多套运行环境：

1. 在开发过程中方便开发调试的环境
2. 发布到线上给用户使用的运行环境

这两套不同的环境都是由同一套源代码编译而来，但是代码内容不一样，差异包括：

1. 线上代码被压缩了
2. 开发用的代码包含一些用于提示开发者的提示日志，这些日志普通用户不可能给去看
3. 开发用的代码所连接的后端数据接口地址也可能和线上环境不同，因为要避免开发过程中造成对线上数据的影响

为了尽可能的复用代码，在构建过程中需要根据目标代码要运行的环境而输出不同的代码

```js
if (process.env.NODE_ENV === 'production') {
  console.log('你正在线上环境');
} else {
  console.log('你正在使用开发环境');
}
```

在构建线上环境代码时，需要给当前运行环境设置环境变量`NODE_ENV = 'production'`:

```js
const DefinePlugin = require('webpack/lib/DefinePlugin');

module.exports = {
  plugins: [
    new DefinePlugin({
      // 定义 NODE_ENV 环境变量为 production
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
  ],
};
```

`process.env.NODE_ENV !== 'production'` 中的 NODE_ENV 和 `'production'` 两个值是社区的约定，通常使用这条判断语句在区分开发环境和线上环境。

#### 压缩代码

浏览器从服务器访问网页时获取的 JavaScript、CSS 资源都是文本形式的，文件越大网页加载时间越长。 为了提升网页加速速度和减少网络传输流量，可以对这些资源进行压缩。 压缩的方法除了可以通过 GZIP 算法对文件压缩外，还可以对文本本身进行压缩。

对文本本身进行压缩的作用除了有提升网页加载速度的优势外，还具有混淆源码的作用。 由于压缩后的代码可读性非常差，就算别人下载到了网页的代码，也大大增加了代码分析和改造的难度。

##### 压缩JS

目前最成熟的js代码压缩工具是`UglifyJS`，要在Webpack中接入UglifyJS，有两个成熟的插件：

1. UglifyJsPlugin： 通过封装UglifyJS实现压缩
2. ParallelUglifyPlugin： 多进程并行处理压缩

说下UglifyJsPlugin：
```js
const UglifyJSPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

module.exports = {
  plugins: [
    // 压缩输出的 JS 代码
    new UglifyJSPlugin({
      compress: {
        // 在UglifyJs删除没有用到的代码时不输出警告
        warnings: false,
        // 删除所有的 `console` 语句，可以兼容ie浏览器
        drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true,
      },
      output: {
        // 最紧凑的输出
        beautify: false,
        // 删除所有的注释
        comments: false,
      }
    }),
  ],
};
```

除此之外，Webpack还提供了在启动Webpack带上`--optimize-minimize`参数，这样Webpack会自动为你注入一个带有默认配置的UglifyJSPlugin

##### 压缩ES6

为了压缩ES6代码，需要使用专门针对Es6代码的`UglifyES`.

```js
npm i -D uglifyjs-webpack-plugin@beta

const UglifyESPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  plugins: [
    new UglifyESPlugin({
      // 多嵌套了一层
      uglifyOptions: {
        compress: {
          // 在UglifyJs删除没有用到的代码时不输出警告
          warnings: false,
          // 删除所有的 `console` 语句，可以兼容ie浏览器
          drop_console: true,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true,
        },
        output: {
          // 最紧凑的输出
          beautify: false,
          // 删除所有的注释
          comments: false,
        }
      }
    })
  ]
}
```
同时，为了不让 babel-loader 输出 ES5 语法的代码，需要去掉 .babelrc 配置文件中的 babel-preset-env，但是其它的 Babel 插件，比如 babel-preset-react 还是要保留， 因为正是 babel-preset-env 负责把 ES6 代码转换为 ES5 代码。

##### 压缩CSS

目前比较成熟可靠的CSS压缩工具是`cssnano`

把 cssnano 接入到 Webpack 中也非常简单，因为 css-loader 已经将其内置了，要开启 cssnano 去压缩代码只需要开启 css-loader 的 minimize 选项。

```js
const path = require('path');
const {WebPlugin} = require('web-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,// 增加对 CSS 文件的支持
        // 提取出 Chunk 中的 CSS 代码到单独的文件中
        use: ExtractTextPlugin.extract({
          // 通过 minimize 选项压缩 CSS 代码
          use: ['css-loader?minimize']
        }),
      },
    ]
  },
  plugins: [
    // 用 WebPlugin 生成对应的 HTML 文件
    new WebPlugin({
      template: './template.html', // HTML 模版文件所在的文件路径
      filename: 'index.html' // 输出的 HTML 的文件名称
    }),
    new ExtractTextPlugin({
      filename: `[name]_[contenthash:8].css`,// 给输出的 CSS 文件名称加上 Hash 值
    }),
  ],
};
```

#### CDN加速




### 减少用户能感知到的加载时间

### 提升流畅度