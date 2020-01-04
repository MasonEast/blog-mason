# 入门
## 前端的发展

模块化： CommonJS， AMD， ES6模块化， 样式文件模块化
新框架： React， Vue， Angular
新语言： ES6， TypeScript

## 常见的构建工具

构建就是将源代码转换成发布到线上的可执行JavaScript， CSS， HTML代码，包括如下内容：
1. 代码转换： ts -> js  ,scss -> css等
2. 文件优化： 压缩代码，压缩合并图片等
3. 代码分割： 提取多个页面的公告代码，提取首屏不需要执行部分的代码让其异步加载。
4. 模块合并： 在采用模块化的项目里有多个模块和文件，需要构建功能把模块分类合并成一个文件。
5. 自动刷新： 监听本地源代码的变化，自动重新构建，刷新浏览器。
6. 代码校验： 在代码被提交到仓库前需要校验代码是否符合规范，以及单元测试是否通过。
7. 自动发布： 更新完代码后，自动构建出线上发布代码并传输给发布系统。


### Grunt
Grunt的优点是：

灵活，它只负责执行你定义的任务；
大量的可复用插件封装好了常见的构建任务。
Grunt的缺点是集成度不高，要写很多配置后才可以用，无法做到开箱即用。

Grunt 相当于进化版的 Npm Script，它的诞生其实是为了弥补 Npm Script 的不足。

### Gulp
一个基于流的自动化构建工具

通过 gulp.task 注册一个任务；
通过 gulp.run 执行任务；
通过 gulp.watch 监听文件变化；
通过 gulp.src 读取文件；
通过 gulp.dest 写文件。

Gulp 的优点是好用又不失灵活，既可以单独完成构建也可以和其它工具搭配使用。其缺点是和 Grunt 类似，集成度不高，要写很多配置后才可以用，无法做到开箱即用。

可以将Gulp 看作 Grunt 的加强版。相对于 Grunt，Gulp增加了监听文件、读写文件、流式处理的功能。

### Webpack

在Webpack里一切文件都是模块，通过`Loader`转换文件，通过`Plugin`注入钩子，最后输出由多个模块组合成的文件，Webpack专注于构建模块化项目。
这样的好处是能清晰的描述出各个模块之间的依赖关系，以方便Webpack对模块进行组合和打包。经过Webpack处理，最终会输出浏览器能使用的静态资源。

Webpack的优点：
1. 专注于处理模块化的项目，能做到开箱即用一步到位
2. 通过Plugin扩展，完整好用又灵活
3. 社区庞大活跃


## Loader

```js
const path = require('path');

module.exports = {
  // JavaScript 执行入口文件
  entry: './main.js',
  output: {
    // 把所有依赖的模块合并输出到一个 bundle.js 文件
    filename: 'bundle.js',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        // 用正则去匹配要用该 loader 转换的 CSS 文件
        test: /\.css$/,
        use: ['style-loader', 'css-loader?minimize'],
      }
    ]
  }
};

```

Loader可以看作具有文件转换功能的翻译员，配置里的module.rules数组配置了一组规则，告诉Webpack在遇到哪些文件时使用哪些Loaer去加载和转换。
注意：
1. use属性的值需要是一个由Loader名称组成的数组，Loader的执行顺序是由后到前的。
2. 每一个Loader都可以通过URL querystring的方式传入参数，例如css-loader?minimize中的minimize告诉css-loader要开启css压缩

给Loader传入属性的方式除了`querystring`，还可以通过配置`options`

```js
use: [
  'style-loader',
  {
    loader: 'css-lader',
    options: {
      minimize: true
    }
  }
]
```

除了在`webpack.config.js`文件中配置Loader，还可以在源码中指定用什么Loader去处理文件，比如
```js
require('style-loader!css-loader?minimize!./main.css')
```

## Plugin
Plugin是用来扩展Webpack功能的，通过在构建流程里注入钩子实现，它给Webpack带来了极大的灵活性。

```js
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  // JavaScript 执行入口文件
  entry: './main.js',
  output: {
    // 把所有依赖的模块合并输出到一个 bundle.js 文件
    filename: 'bundle.js',
    // 把输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        // 用正则去匹配要用该 loader 转换的 CSS 文件
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          // 转换 .css 文件需要使用的 Loader
          use: ['css-loader'],
        }),
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({     //把注入到bundle.js文件的css提取到单独的文件
      // 从 .js 文件中提取出来的 .css 文件的名称
      filename: `[name]_[contenthash:8].css`,
    }),
  ]
};
```

Webpack通过plugins属性来配置需要使用的插件列表，plugins是一个数组，黎绵的每一项都是插件的一个实例，在实例化一个组件时可以通过构造函数传入这个组件支持的配置属性。

## DevServer
实际开发中可能会需要：
1. 提供HTTP服务而不是使用本地文件预览
2. 监听文件的变化并自动刷新网页，做到实时预览
3. 支持Source Map，以方便调试

DevServer会启动一个HTTP服务器用于服务网页请求，同时会帮助启动Webpack，并接收Webpack发出的文件变更信号，通过`WebSocket`协议自动刷新网页做到实时预览。

需要安装`webpack-dev-server`模块

如果尝试修改 index.html 文件并保存，你会发现这并不会触发以上机制，导致这个问题的原因是 Webpack 在启动时会以配置里的 entry 为入口去递归解析出 entry 所依赖的文件，只有 entry 本身和依赖的文件才会被 Webpack 添加到监听列表里。 而 index.html 文件是脱离了 JavaScript 模块化系统的，所以 Webpack 不知道它的存在。

### 模块热更新
模块热更新能做到在不重新加载整个网页的情况下，通过将被更新过的模块替换老的模块，再重新执行一次来实现实时预览。
开启模块热更新，只要在启动DevServer时带上`--hot`参数即可。

### 支持Source Map
调试工具可以通过Source Map映射代码，实现在源代码上断点调试。
启动webpack时带上`--devtool source-map`参数即可。

## 核心概念

1. Entry： 入口
2. Module： 模块，一个模块对应着一个文件，Webpack会从配置的Entry开始递归找出所有依赖的模块
3. Chunk： 代码块，一个Chunk由多个模块组合而成，用于代码合并与分割
4. Loader： 模块转换器
5. Plugin： 扩展插件
6. Output： 输出结果

Webpack启动后会从`Entry`里配置的`Module`开始**递归解析**Entry依赖的所有Module。每找到一个Module，就会根据配置的`Loader`去找对应的转换规则，对Module进行转换后，再解析出当前Module依赖的Module。这些模块会以Entry为单位进行分组，一个Entry和其所有依赖的Module被分到一个组就是一个`Chunk`，最后Webpack会把所有Chunk转换成文件输出。在整个流程中Webpack会在恰当的时机执行`Plugin`里定义的逻辑。


# 配置

配置Webpack的方式：
1. 只能通过命令行参数传入的选项，这种最为少见
2. 只能通过配置文件配置的选项
3. 通过两种方式都可以配置的选项。

## Entry

entry是配置模块的入口，可抽象成输入，可以是string, array, object, 是必填项。

Webpack在寻找相对路径的文件时是以执行启动Webpack时所在的当前目录`context`为根目录，如果要修改该默认配置，可以：
```js
module.exports = {
  context: path.resolve(__dirname, 'app')   //context必须是一个绝对路径的字符串
}
```

### Chunk

Webpack会为每个生成的Chunk取一个名称
1. 如果entry是一个string或array，就只会生成一个Chunk，这时Chunk的名称是main
2. 如果entry是一个object，就可能生成多个Chunk，名称是object键值对里键的名称。

### 配置动态Entry

假如项目里有多个页面需要为每个页面的入口配置一个Entry，但这些页面的数量可能会不断增长，则这时Entry的配置会受到其他因素的影响导致不能写成静态的值，解决方法是把Entry设置成一个函数去动态返回上面所说的配置：
```js
// 同步函数
entry: () => {
  return {
    a:'./pages/a',
    b:'./pages/b',
  }
};
// 异步函数
entry: () => {
  return new Promise((resolve)=>{
    resolve({
       a:'./pages/a',
       b:'./pages/b',
    });
  });
};
```

## Output

output配置如何输出最终想要的代码，它是一个object。

output的配置项：
### filename
 配置输出文件的名称，如果有多个Chunk需要输出时，需要借助模板和变量：

```js
filename: '[name].js'
```

内置变量除了name，还有id，hash，chunkhash

### path

配置输出文件存放在本地的目录，必须是string类型的绝对路径
```js
path: path.resolve(__dirname, 'dist_[hash]')
```

### publicPath

在复杂的项目里可能会有构建一些资源需要异步加载，加载这些异步资源需要对应的URL地址。

举个例子，需要把构建出的资源文件上传到CDN服务上，以利于加快页面的打开速度：

```js
filename: '[name]_[chunkhash: 8].js'
publicPath: 'https://cdn.xxx/xxx/'
```

这时发布到线上的html在引入js文件时：
```js
<script src='https://cdn.example.com/assets/a_12345678.js'></script>
```

### crossOriginLoading

Webpack输出的部分代码块可能需要异步架子，而异步加载是通过JSONP方式实现的，JSONP原理是动态的向html中插入一个`<script src="url"></script>
`标签去加载异步资源。

script标签的crossorigin属性可以取以下值：
1. anonymous在加载此脚本资源时不会带上用户的cookies
2. use-credentials在加载此脚本资源时会带上用户的cookies

通常用设置crossorigin来获取异步加载的脚本执行时的详细错误信息。

### libraryTarget和library

当用Webpack去构建一个可以被其他模块导入使用的库时需要用到它们。

1. output.libraryTarget配置以何种方式导出库
2. output.library配置导出库的名称


## Module

### 配置Loader

rules配置模块的读取和解析规则
1. 条件匹配： test， include， exclude
2. 应用规则： 对象中的文件通过`use`配置项来应用Loader
3. 重置顺序： 通过enforce选项可以让其中一个Loader的执行顺序放到最前或最后。

```js
module: {
  rules: [
    {
      // 命中 JavaScript 文件
      test: /\.js$/,
      // 用 babel-loader 转换 JavaScript 文件
      // ?cacheDirectory 表示传给 babel-loader 的参数，用于缓存 babel 编译结果加快重新编译速度
      use: ['babel-loader?cacheDirectory'],
      // 只命中src目录里的js文件，加快 Webpack 搜索速度
      include: path.resolve(__dirname, 'src')
    },
    {
      // 命中 SCSS 文件
      test: /\.scss$/,
      // 使用一组 Loader 去处理 SCSS 文件。
      // 处理顺序为从后到前，即先交给 sass-loader 处理，再把结果交给 css-loader 最后再给 style-loader。
      use: ['style-loader', 'css-loader', 'sass-loader'],
      // 排除 node_modules 目录下的文件
      exclude: path.resolve(__dirname, 'node_modules'),
    },
    {
      // 对非文本文件采用 file-loader 加载
      test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
      use: ['file-loader'],
    },
  ]
}
```

在Loader需要传入很多参数时，可以通过一个Object来描述：
```js
use: [
  {
    loader:'babel-loader',
    options:{
      cacheDirectory:true,
    },
    // enforce:'post' 的含义是把该 Loader 的执行顺序放到最后
    // enforce 的值还可以是 pre，代表把 Loader 的执行顺序放到最前面
    enforce:'post'
  },
  // 省略其它 Loader
]
```

test, include, exclude 还支持数组：

```js
{
  test:[
    /\.jsx?$/,
    /\.tsx?$/
  ],
  include:[
    path.resolve(__dirname, 'src'),
    path.resolve(__dirname, 'tests'),
  ],
  exclude:[
    path.resolve(__dirname, 'node_modules'),
    path.resolve(__dirname, 'bower_modules'),
  ]
  ```

### noParse

可以让Webpack忽略对部分没采用模块化的文件的递归解析和处理，提高构建性能。

```js
// 使用正则表达式
noParse: /jquery|chartjs/

// 使用函数，从 Webpack 3.0.0 开始支持
noParse: (content)=> {
  // content 代表一个模块的文件路径
  // 返回 true or false
  return /jquery|chartjs/.test(content);
}
```
注意被忽略掉的文件不应该包含import， require， define等模块化语句，不然会导致构建出的代码中包含无法再浏览器环境下执行的模块化语句。

### parser

和noParse配置项的区别在于parser可以精确到语法层面，而noParse只能控制哪些文件不被解析。

```js
module: {
  rules: [
    {
      test: /\.js$/,
      use: ['babel-loader'],
      parse: {
        amd: false,   //禁用AMD
        commonjs: false, // 禁用 CommonJS
        system: false, // 禁用 SystemJS
        harmony: false, // 禁用 ES6 import/export
        requireInclude: false, // 禁用 require.include
        requireEnsure: false, // 禁用 require.ensure
        requireContext: false, // 禁用 require.context
        browserify: false, // 禁用 browserify
        requireJs: false, // 禁用 requirejs
      }
    }
  ]
}
```

## Resolve

Resolve配置Webpack如何寻找模块所对应的文件。Webpack内置JS模块化语法解析功能，默认会采用模块化标准里约定好的规则去寻找。

### alias

通过别名把原导入路径映射成一个新的导入路径。

```js
resolve:{
  alias: {
    components: './src/components/'
  }
}

```
当你通过 `import Button from 'components/button'` 导入时，实际上被 alias 等价替换成了 `import Button from './src/components/button'`

alias还支持$符号来缩小范围到只命中以关键字结尾的导入语句

```js
resolve:{
  alias:{
    'react$': '/path/to/react.min.js'
  }
}
```

### mainFields

有一些第三方模块会针对不同环境提供几份代码，该配置项决定Webpack优先采用哪份代码。

### extensions

在导入语句没带文件后缀时，Webpack会自动带上后缀去尝试访问文件是否存在，默认是：
```js
extensions: ['.js', '.json']
```

### modules

配置Webpack去哪些目录下寻找第三方模块，默认只会去node_modules目录下找

假如哪些被大量导入的模块都在`./src/components`目录下：
```js
modules: ['./src/components', 'node_modules']
```

这样你就可简单通过`import 'button' `导入


## 配置Plugin

```js
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

module.exports = {
  plugins: [
    // 所有页面都会用到的公共代码提取到 common 代码块中
    new CommonsChunkPlugin({
      name: 'common',
      chunks: ['a', 'b']
    }),
  ]
};
```
使用Plugin的难点在于掌握Plugin本身提供的配置项


## devServer

### hot
启用DevServer的模块热更新功能。

### inline
配置是否自动注入这个代理客户端到将运行在页面里的Chunk中，默认是自动注入。
如果开启inline，DevServer会在构建完变化后的代码时通过代理客户端控制网页刷新
如果关闭inline，DevServer将无法直接控制要开发的玩野，这时它会通过iframe的方式去运行要开发的网页。

### contentBase

配置DevServer HTTP服务器的文件根目录，默认情况下为当前执行目录，通常是项目根目录。假如你想把项目根目录下的public目录设置成DevServer服务器的文件根目录：

```js
devServer: {
  contentBase： paht.join(__dirname, 'public'）

}
```

DevServer服务器通过HTTP服务暴露出的文件分为两类：
1. 暴露本地文件
2. 暴露Webpack构建出的结果，由于构建出的结果交给了DevServer，所以你在使用了DevServer时在本地找不到构建出的文件。

contentBase只能用来配置暴露本地文件的规则，可以通过`contentBase: false`来关闭暴露本地文件。

### headers

该配置项可以在HTTP响应中注入一些HTTP响应头：
```js
devServer: {
  headers: {
    'X-foo':'bar'
  }
}
```

### host

用于配置DevServer服务监听的地址

### allowedHosts

配置一个白名单列表，只有HTTP请求的HOST在列表里才正常返回
```js
allowedHosts: [
  // 匹配单个域名
  'host.com',
  'sub.host.com',
  // host2.com 和所有的子域名 *.host2.com 都将匹配
  '.host2.com'
]
```

### https

默认使用HTTP协议服务，它也能通过HTTPS协议服务，要切换HTTPS服务也很简单：
```js
devServer: {
  https: true
}
```

DevServer会自动为你生成一份HTTPS证书，也可以自己配置：

```js
devServer:{
  https: {
    key: fs.readFileSync('path/to/server.key'),
    cert: fs.readFileSync('path/to/server.crt'),
    ca: fs.readFileSync('path/to/ca.pem')
  }
}
```

### compress

该配置决定是否启用gzip压缩，默认为false



## 其他配置项

### Target

target配置项可以让webpack构建出针对不同运行环境的代码，target可以是以下之一：

web：针对浏览器，默认选项，所有代码集中在一个文件里
node： 针对Node.js，使用require语句加载chunk代码
async-node： 针对Node.js，异步加载chunk代码
webworker： 针对WebWorker
electron-main： 针对Electron主线程
elertron-renderer： 针对Electron渲染线程

### Devtool

配置Webpack如何生成Source Map, 默认值是false，想为构建出的代码生成Source Map可以：
```js
module.export = {
  devtool: 'source-map'
}
```

### Watch和WatchOptions

它支持监听文件更新，在文件发生变化时重新编译，默认是关闭的：
```js
module.export = {
  watch: true
}
```

在使用DevServer时，监听模式默认是开启的

watchOptions配置项可以更灵活的控制监听模式:

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

### Externals

配置Webpack要构建的代码中使用了哪些不用被打包的模块，也就是说这些模板是外部环境提供的，Webpack在打包时可以忽略它们。

通过Externals可以告诉Webpack JavaScript运行环境已经内置了那些全局变量，针对这些全局变量不用打包进代码中而是直接使用全局变量：

```js
module.export = {
  externals: {
    // 把导入语句里的 jquery 替换成运行环境里的全局变量 jQuery
    jquery: 'jQuery'
  }
}
```

###  ResolveLoader
用来告诉Webpack如何去寻找Loader

```js
module.exports = {
  resolveLoader:{
    // 去哪个目录下寻找 Loader
    modules: ['node_modules'],
    // 入口文件的后缀
    extensions: ['.js', '.json'],
    // 指明入口文件位置的字段
    mainFields: ['loader', 'main']
  }
}
```
该配置项通常用于加载本地的Loader


## 整体配置结构

```js
const path = require('path');

module.exports = {
  // entry 表示 入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
  // 类型可以是 string | object | array   
  entry: './app/entry', // 只有1个入口，入口只有1个文件
  entry: ['./app/entry1', './app/entry2'], // 只有1个入口，入口有2个文件
  entry: { // 有2个入口
    a: './app/entry-a',
    b: ['./app/entry-b1', './app/entry-b2']
  },

  // 如何输出结果：在 Webpack 经过一系列处理后，如何输出最终想要的代码。
  output: {
    // 输出文件存放的目录，必须是 string 类型的绝对路径。
    path: path.resolve(__dirname, 'dist'),

    // 输出文件的名称
    filename: 'bundle.js', // 完整的名称
    filename: '[name].js', // 当配置了多个 entry 时，通过名称模版为不同的 entry 生成不同的文件名称
    filename: '[chunkhash].js', // 根据文件内容 hash 值生成文件名称，用于浏览器长时间缓存文件

    // 发布到线上的所有资源的 URL 前缀，string 类型
    publicPath: '/assets/', // 放到指定目录下
    publicPath: '', // 放到根目录下
    publicPath: 'https://cdn.example.com/', // 放到 CDN 上去

    // 导出库的名称，string 类型
    // 不填它时，默认输出格式是匿名的立即执行函数
    library: 'MyLibrary',

    // 导出库的类型，枚举类型，默认是 var
    // 可以是 umd | umd2 | commonjs2 | commonjs | amd | this | var | assign | window | global | jsonp ，
    libraryTarget: 'umd', 

    // 是否包含有用的文件路径信息到生成的代码里去，boolean 类型
    pathinfo: true, 

    // 附加 Chunk 的文件名称
    chunkFilename: '[id].js',
    chunkFilename: '[chunkhash].js',

    // JSONP 异步加载资源时的回调函数名称，需要和服务端搭配使用
    jsonpFunction: 'myWebpackJsonp',

    // 生成的 Source Map 文件名称
    sourceMapFilename: '[file].map',

    // 浏览器开发者工具里显示的源码模块名称
    devtoolModuleFilenameTemplate: 'webpack:///[resource-path]',

    // 异步加载跨域的资源时使用的方式
    crossOriginLoading: 'use-credentials',
    crossOriginLoading: 'anonymous',
    crossOriginLoading: false,
  },

  // 配置模块相关
  module: {
    rules: [ // 配置 Loader
      {  
        test: /\.jsx?$/, // 正则匹配命中要使用 Loader 的文件
        include: [ // 只会命中这里面的文件
          path.resolve(__dirname, 'app')
        ],
        exclude: [ // 忽略这里面的文件
          path.resolve(__dirname, 'app/demo-files')
        ],
        use: [ // 使用那些 Loader，有先后次序，从后往前执行
          'style-loader', // 直接使用 Loader 的名称
          {
            loader: 'css-loader',      
            options: { // 给 html-loader 传一些参数
            }
          }
        ]
      },
    ],
    noParse: [ // 不用解析和处理的模块
      /special-library\.js$/  // 用正则匹配
    ],
  },

  // 配置插件
  plugins: [
  ],

  // 配置寻找模块的规则
  resolve: { 
    modules: [ // 寻找模块的根目录，array 类型，默认以 node_modules 为根目录
      'node_modules',
      path.resolve(__dirname, 'app')
    ],
    extensions: ['.js', '.json', '.jsx', '.css'], // 模块的后缀名
    alias: { // 模块别名配置，用于映射模块
       // 把 'module' 映射 'new-module'，同样的 'module/path/file' 也会被映射成 'new-module/path/file'
      'module': 'new-module',
      // 使用结尾符号 $ 后，把 'only-module' 映射成 'new-module'，
      // 但是不像上面的，'module/path/file' 不会被映射成 'new-module/path/file'
      'only-module$': 'new-module', 
    },
    alias: [ // alias 还支持使用数组来更详细的配置
      {
        name: 'module', // 老的模块
        alias: 'new-module', // 新的模块
        // 是否是只映射模块，如果是 true 只有 'module' 会被映射，如果是 false 'module/inner/path' 也会被映射
        onlyModule: true, 
      }
    ],
    symlinks: true, // 是否跟随文件软链接去搜寻模块的路径
    descriptionFiles: ['package.json'], // 模块的描述文件
    mainFields: ['main'], // 模块的描述文件里的描述入口的文件的字段名称
    enforceExtension: false, // 是否强制导入语句必须要写明文件后缀
  },

  // 输出文件性能检查配置
  performance: { 
    hints: 'warning', // 有性能问题时输出警告
    hints: 'error', // 有性能问题时输出错误
    hints: false, // 关闭性能检查
    maxAssetSize: 200000, // 最大文件大小 (单位 bytes)
    maxEntrypointSize: 400000, // 最大入口文件大小 (单位 bytes)
    assetFilter: function(assetFilename) { // 过滤要检查的文件
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },

  devtool: 'source-map', // 配置 source-map 类型

  context: __dirname, // Webpack 使用的根目录，string 类型必须是绝对路径

  // 配置输出代码的运行环境
  target: 'web', // 浏览器，默认
  target: 'webworker', // WebWorker
  target: 'node', // Node.js，使用 `require` 语句加载 Chunk 代码
  target: 'async-node', // Node.js，异步加载 Chunk 代码
  target: 'node-webkit', // nw.js
  target: 'electron-main', // electron, 主线程
  target: 'electron-renderer', // electron, 渲染线程

  externals: { // 使用来自 JavaScript 运行环境提供的全局变量
    jquery: 'jQuery'
  },

  stats: { // 控制台输出日志控制
    assets: true,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: true,
  },

  devServer: { // DevServer 相关的配置
    proxy: { // 代理到后端服务接口
      '/api': 'http://localhost:3000'
    },
    contentBase: path.join(__dirname, 'public'), // 配置 DevServer HTTP 服务器的文件根目录
    compress: true, // 是否开启 gzip 压缩
    historyApiFallback: true, // 是否开发 HTML5 History API 网页
    hot: true, // 是否开启模块热替换功能
    https: false, // 是否开启 HTTPS 模式
    },

    profile: true, // 是否捕捉 Webpack 构建的性能信息，用于分析什么原因导致构建性能不佳

    cache: false, // 是否启用缓存提升构建速度

    watch: true, // 是否开始
    watchOptions: { // 监听模式选项
    // 不监听的文件或文件夹，支持正则匹配。默认为空
    ignored: /node_modules/,
    // 监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
    // 默认为300ms 
    aggregateTimeout: 300,
    // 判断文件是否发生变化是不停的去询问系统指定文件有没有变化，默认每隔1000毫秒询问一次
    poll: 1000
  },
}
```

## 多种配置类型

除了通过导出一个Object来描述Webpack所需的配置外，还有其他更灵活的方式。

### 导出一个Function

在大多数时候你需要从同一份源码中构建出多份代码，一份用于开发时，一份用于发布线上。

如果采用导出一个Object来描述Webpack所需的配置的文件，需要写两个文件。在启动时通过`webpack --config webpack.config.js`来指定使用哪个配置文件。

采用导出一个Function的方式，能通过JavaScript灵活的控制配置，做到只用一个配置文件就能完成以上要求。

```js
const path = require('path');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

module.exports = function (env = {}, argv) {
  const plugins = [];

  const isProduction = env['production'];

  // 在生成环境才压缩
  if (isProduction) {
    plugins.push(
      // 压缩输出的 JS 代码
      new UglifyJsPlugin()
    )
  }

  return {
    plugins: plugins,
    // 在生成环境不输出 Source Map
    devtool: isProduction ? undefined : 'source-map',
  };
}
```

在运行 Webpack 时，会给这个函数传入2个参数，分别是：

env：当前运行时的 Webpack 专属环境变量，env 是一个 Object。读取时直接访问 Object 的属性，设置它需要在启动 Webpack 时带上参数。例如启动命令是 `webpack --env.production --env.bao=foo`时，则 env 的值是 `{"production":"true","bao":"foo"}`。
argv：代表在启动 Webpack 时所有通过命令行传入的参数，例如 --config、--env、--devtool，可以通过 webpack -h 列出所有 Webpack 支持的命令行参数。
就以上配置文件而言，在开发时执行命令 webpack 构建出方便调试的代码，在需要构建出发布到线上的代码时执行 `webpack --env.production` 构建出压缩的代码。

### 导出一个返回Promise的函数
```js
module.exports = function(env = {}, argv) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        // ...
      })
    }, 5000)
  })
}
```

### 导出多份配置

Wepack支持导出一个数组，数组汇总可以包含每份配置，并且每份配置都会执行一遍构建。

```js
module.exports = [
  // 采用 Object 描述的一份配置
  {
    // ...
  },
  // 采用函数描述的一份配置
  function() {
    return {
      // ...
    }
  },
  // 采用异步函数描述的一份配置
  function() {
    return Promise();
  }
]
```

这特别适合用Webpack构建一个要上传到Npm仓库的库，因为库中可能需要包含多种模块化格式的代码，例如CommonJS， UMD


## 总结

从前面的配置看来选项很多，通常可用如下经验去判断如何配置Webpack：

1. 想让源文件加入到构建流程中去被Webpack控制，配置entry
2. 想自定义输出文件的位置和名称，配置output
3. 想自定义寻找依赖模块时的策略， 配置resolve
4. 想自定义解析和转换文件的策略， 配置module， 通常是配置module.rules里的Loader
5. 其他的大部分需求可能要通过Plugin去实现，配置Plugin


