# 工作原理概括

## 核心概念

1. Entry: 入口
2. Module： 模块， 在Webpack里一切皆模块，一个模块对应着一个文件。Webpack会从配置的Entry开始递归找出所有依赖的模块
3. Chunk： 代码块，一个Chunk由多个模块组合而成，用于代码合并和分割
4. Loader：模块转换器，用于把模块原内容按照需求转换成新内容
5. Plugin：扩展插件，在Webpack构建流程中的特定时机会广播出对应的事件，插件可以监听这些事件的发生，在特定时机做对应的事情

## 流程概括

1. 初始化参数： 从配置文件和Shell语句中读取与合并参数，得出最终的参数
2. 开始编译： 用上一步得到的参数初始化Compiler对象，加载所有配置的插件，执行对象的run方法开始执行编译
3. 确定入口： 根据配置中的entry找出所有的入口文件
4. 编译模块： 从入口文件出发，调用所有配置的Loader对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
5. 完成模块编译： 在经过第四步使用Loader翻译完，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
6. 输出资源： 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk，再把每个Chunk转换成一个单独的文件加入到输出列表，这一步是可以修改输出内容的最后机会
7. 输出完成： 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

## 流程细节

构建流程三大阶段：
1. 初始化： 启动构建，读取与合并配置参数，加载Plugin，实例化Compiler
2. 编译： 从Entry发出，针对每个Module串行调用对应的Loader去翻译文件内容，再找出该Module依赖的Module，递归的进行编译处理
3. 输出： 对编译后的Module组合成Chunk，把Chunk转换成文件，输出到文件系统

# Loader

一个Loader的职责是单一的，只需要完成一种转换，如果一个源文件需要经过多步转换才能正常使用，就通过多个Loader去转换。在调用多个Loader去转换一个文件时，每个Loader会链式的顺序执行。

## Loader基础

由于Webpack是运行在Node.js上的，一个Loader其实就是一个Node.js模块，这个模块需要导出一个函数，这个导出的函数的工作就是获得处理前的原内容，对原内容执行处理后，返回处理后的内容。

一个最简单的Loader源码：

```js
module.exports = function(source) {
  // source 为 compiler 传递给 Loader 的一个文件的原内容
  // 该函数需要返回处理后的内容，这里简单起见，直接把原内容返回了，相当于该 Loader 没有做任何转换
  return source;
};
```
由于Loader运行在Node.js中，你可以调用任何Node.js自带的API，或者安装第三方模块进行调用

```js
const sass = require('node-sass');
module.exports = function(source) {
  return sass(source);
};
```

## Loader进阶

### 获得Loader的option

```js

const loaderUtils = require('loader-utils');
module.exports = function(source) {
  // 获取到用户给当前 Loader 传入的 options
  const options = loaderUtils.getOptions(this);
  return source;
};

```

### 返回其他结果

上面的Loader只是返回了原内容转换后的内容，但有些场景下还需要返回除了内容之外的东西

```js

module.exports = function(source) {
  // 通过 this.callback 告诉 Webpack 返回的结果
  this.callback(null, source, sourceMaps);
  // 当你使用 this.callback 返回内容时，该 Loader 必须返回 undefined，
  // 以让 Webpack 知道该 Loader 返回的结果在 this.callback 中，而不是 return 中 
  return;
};


```
其中的`this.callback`是Webpack给Loader注入的API，以方便Loader和Webpack之间通信，详细使用方法：

```js
this.callback(
    // 当无法转换原内容时，给 Webpack 返回一个 Error
    err: Error | null,
    // 原内容转换后的内容
    content: string | Buffer,
    // 用于把转换后的内容得出原内容的 Source Map，方便调试
    sourceMap?: SourceMap,
    // 如果本次转换为原内容生成了 AST 语法树，可以把这个 AST 返回，
    // 以方便之后需要 AST 的 Loader 复用该 AST，以避免重复生成 AST，提升性能
    abstractSyntaxTree?: AST
);
```

### 同步与异步

Loader有同步和异步之分，当需要通过网络请求才能得到结果，如果采用同步的方式网络请求就会阻塞整个构建，导致构建非常缓慢

```js
module.exports = function(source) {
    // 告诉 Webpack 本次转换是异步的，Loader 会在 callback 中回调结果
    var callback = this.async();
    someAsyncOperation(source, function(err, result, sourceMaps, ast) {
        // 通过 callback 返回异步执行后的结果
        callback(err, result, sourceMaps, ast);
    });
};
```

### 处理二进制数据

在默认的情况下，Webpack传给Loader的原内容都是UTF-8格式编码的字符串。但有些场景下Loader不是处理文本文件，而是二进制文件，例如file-loader，这就需要Webpack给Loader传入二进制数据：

```js
module.exports = function(source) {
    // 在 exports.raw === true 时，Webpack 传给 Loader 的 source 是 Buffer 类型的
    source instanceof Buffer === true;
    // Loader 返回的类型也可以是 Buffer 类型的
    // 在 exports.raw !== true 时，Loader 也可以返回 Buffer 类型的结果
    return source;
};
// 通过 exports.raw 属性告诉 Webpack 该 Loader 是否需要二进制数据 
module.exports.raw = true;
```

### 缓存加速

有些转换操作需要大量计算非常耗时，如果每次构建都重新执行重复的转换操作，构建将会变得非常缓慢，为此，Webpack会默认缓存所有Loader的处理结果，如果想让Webpack不缓存Loader的处理结果：

```js
module.exports = function(source) {
  // 关闭该 Loader 的缓存功能
  this.cacheable(false);
  return source;
};
```

### 其他Loader API

1. this.context：当前处理文件的所在目录，假如当前 Loader 处理的文件是 /src/main.js，则 this.context 就等于 /src。

2. this.resource：当前处理文件的完整请求路径，包括 querystring，例如 /src/main.js?name=1。

3. this.resourcePath：当前处理文件的路径，例如 /src/main.js。

4. this.resourceQuery：当前处理文件的 querystring。

5. this.target：等于 Webpack 配置中的 Target，详情见 2-7其它配置项-Target。

6. this.loadModule：当 Loader 在处理一个文件时，如果依赖其它文件的处理结果才能得出当前文件的结果时， 就可以通过 this.loadModule(request: string, callback: function(err, source, sourceMap, module)) 去获得 request 对应文件的处理结果。

7. this.resolve：像 require 语句一样获得指定文件的完整路径，使用方法为 resolve(context: string, request: string, callback: function(err, result: string))。

8. this.addDependency：给当前处理文件添加其依赖的文件，以便再其依赖的文件发生变化时，会重新调用 Loader 处理该文件。使用方法为 addDependency(file: string)。

9. this.addContextDependency：和 addDependency 类似，但 addContextDependency 是把整个目录加入到当前正在处理文件的依赖中。使用方法为 addContextDependency(directory: string)。

10. this.clearDependencies：清除当前正在处理文件的所有依赖，使用方法为 clearDependencies()。

11. this.emitFile：输出一个文件，使用方法为 emitFile(name: string, content: Buffer|string, sourceMap: {...})。

其它没有提到的 API 可以去 Webpack 官网 查看

### 加载本地Loader

#### Npm link
Npm link 专门用于开发和调试本地 Npm 模块，能做到在不发布模块的情况下，把本地的一个正在开发的模块的源码链接到项目的 node_modules 目录下，让项目可以直接使用本地的 Npm 模块。 由于是通过软链接的方式实现的，编辑了本地的 Npm 模块代码，在项目中也能使用到编辑后的代码。

完成 Npm link 的步骤如下：

1. 确保正在开发的本地 Npm 模块（也就是正在开发的 Loader）的 package.json 已经正确配置好；
2. 在本地 Npm 模块根目录下执行 npm link，把本地模块注册到全局；
3. 在项目根目录下执行 npm link loader-name，把第2步注册到全局的本地 Npm 模块链接到项目的 node_moduels 下，其中的 loader-name 是指在第1步中的 package.json 文件中配置的模块名称。
链接好 Loader 到项目后你就可以像使用一个真正的 Npm 模块一样使用本地的 Loader 了。

#### ResolveLoader

ResolveLoader用于配置Webpack如何寻找Loader，默认情况下只会去node_modules目录下寻找，为了让Webpack加载放在本地项目中的Loader需要修改resolveLoader.modules

假如在本地的Loader在项目目录中的`./loaders/loader-name`中：

```js

module.exports = {
  resolveLoader:{
    // 去哪些目录下寻找 Loader，有先后顺序之分
    modules: ['node_modules','./loaders/'],
  }
}

```

### 实战

```js
function replace(source) {
    // 使用正则把 // @require '../style/index.css' 转换成 require('../style/index.css');  
    return source.replace(/(\/\/ *@require) +(('|").+('|")).*/, 'require($2);');
}

module.exports = function (content) {
    return replace(content);
};
```

# 编写Plugin

在Webpack运行的生命周期中会广播出许多事件，Plugin可以监听这些事件，在合适的时机通过Webpack提供的API改变输出结果

一个最基础的Plugin:

```js
class BasicPlugin{
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options){
  }

  // Webpack 会调用 BasicPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler){
    compiler.plugin('compilation',function(compilation) {
    })
  }
}

// 导出 Plugin
module.exports = BasicPlugin;

//使用

const BasicPlugin = require('./BasicPlugin.js');
module.export = {
  plugins:[
    new BasicPlugin(options),
  ]
}
```

//------------------------Plugin未完待续




# 常用Loaders

## 加载文件

1. raw-loader：把文本文件的内容加载到代码中去，加载SVG 中有介绍。
2. file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件，在 3-19加载图片、3-20加载 SVG、CDN 加速 中有介绍。
3. url-loader：和 file-loader 类似，但是能在文件很小的情况下以 base64 的方式把文件内容注入到代码中去，在 3-19加载图片、3-20加载 SVG 中有介绍。
4. source-map-loader：加载额外的 Source Map 文件，以方便断点调试，在 3-21加载 Source Map 中有介绍。
5. svg-inline-loader：把压缩后的 SVG 内容注入到代码中，加载 SVG 中有介绍。
6. node-loader：加载 Node.js 原生模块 .node 文件。
7. image-loader：加载并且压缩图片文件。
8. json-loader：加载 JSON 文件。
9. yaml-loader：加载 YAML 文件。

## 编译模板

1. pug-loader：把 Pug 模版转换成 JavaScript 函数返回。
2. handlebars-loader：把 Handlebars 模版编译成函数返回。
3. ejs-loader：把 EJS 模版编译成函数返回。
4. haml-loader：把 HAML 代码转换成 HTML。
5. markdown-loader：把 Markdown 文件转换成 HTML。

## 转换脚本语言

1. babel-loader：把 ES6 转换成 ES5，在3-1使用 ES6 语言中有介绍。
2. ts-loader：把 TypeScript 转换成 JavaScript，在3-2使用 TypeScript 语言中有遇到。
3. awesome-typescript-loader：把 TypeScript 转换成 JavaScript，性能要比 ts-loader 好。
4. coffee-loader：把 CoffeeScript 转换成 JavaScript。

## 检查代码

1. eslint-loader：通过 ESLint 检查 JavaScript 代码，在 3-16检查代码中有介绍。
2. tslint-loader：通过 TSLint 检查 TypeScript 代码。
3. mocha-loader：加载 Mocha 测试用例代码。
4. coverjs-loader：计算测试覆盖率。

## 其他
1. vue-loader：加载 Vue.js 单文件组件，在3-7使用 Vue 框架中有介绍。
2. i18n-loader：加载多语言版本，支持国际化。
3. ignore-loader：忽略掉部分文件，在3-11构建同构应用中有介绍。
4. ui-component-loader：按需加载 UI 组件库，例如在使用 antd UI 组件库时，不会因为只用到了 Button 组件而打包进所有的组件。

# 常用Plugin

## 用于修改行为

1. define-plugin：定义环境变量，在4-7区分环境中有介绍。
2. context-replacement-plugin：修改 require 语句在寻找文件时的默认行为。
3. ignore-plugin：用于忽略部分文件。

## 用于优化

commons-chunk-plugin：提取公共代码，在4-11提取公共代码中有介绍。
extract-text-webpack-plugin：提取 JavaScript 中的 CSS 代码到单独的文件中，在1-5使用 Plugin 中有介绍。
prepack-webpack-plugin：通过 Facebook 的 Prepack 优化输出的 JavaScript 代码性能，在 4-13使用 Prepack 中有介绍。
uglifyjs-webpack-plugin：通过 UglifyES 压缩 ES6 代码，在 4-8压缩代码中有介绍。
webpack-parallel-uglify-plugin：多进程执行 UglifyJS 代码压缩，提升构建速度。
imagemin-webpack-plugin：压缩图片文件。
webpack-spritesmith：用插件制作雪碧图。
ModuleConcatenationPlugin：开启 Webpack Scope Hoisting 功能，在4-14开启 ScopeHoisting中有介绍。
dll-plugin：借鉴 DDL 的思想大幅度提升构建速度，在4-2使用 DllPlugin中有介绍。
hot-module-replacement-plugin：开启模块热替换功能。

## 其他

1. serviceworker-webpack-plugin：给网页应用增加离线缓存功能，在3-14 构建离线应用中有介绍。
2. stylelint-webpack-plugin：集成 stylelint 到项目中，在3-16检查代码中有介绍。
3. i18n-webpack-plugin：给你的网页支持国际化。
4. provide-plugin：从环境中提供的全局变量中加载模块，而不用导入对应的文件。
5. web-webpack-plugin：方便的为单页应用输出 HTML，比 html-webpack-plugin 好用。

