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



