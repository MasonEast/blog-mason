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
