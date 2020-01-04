# DevServer

DevServer是基于`webpack-dev-middleware`和`express`实现的，而`webpack-dev-middleware`是Esprss的一个中间件。

实现DevServer基本功能的代码：
```js

const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');

// 从 webpack.config.js 文件中读取 Webpack 配置 
const config = require('./webpack.config.js');
// 实例化一个 Expressjs app
const app = express();

// 用读取到的 Webpack 配置实例化一个 Compiler
const compiler = webpack(config);
// 给 app 注册 webpackMiddleware 中间件
app.use(webpackMiddleware(compiler));
// 启动 HTTP 服务器，服务器监听在 3000 端口 
app.listen(3000);

```
webpackMiddleware 函数的返回结果是一个 Expressjs 的中间件，该中间件有以下功能：

1. 接收来自 Webpack Compiler 实例输出的文件，但不会把文件输出到硬盘，而是保存在内存中；
2. 往 Expressjs app 上注册路由，拦截 HTTP 收到的请求，根据请求路径响应对应的文件内容；
通过 webpack-dev-middleware 能够将 DevServer 集成到你现有的 HTTP 服务器中，让你现有的 HTTP 服务器能返回 Webpack 构建出的内容，而不是在开发时启动多个 HTTP 服务器。 这特别适用于后端接口服务采用 Node.js 编写的项目。

## webpack-dev-middleware支持的配置项

```js
// webpackMiddleware 函数的第二个参数为配置项
app.use(webpackMiddleware(compiler, {
    // webpack-dev-middleware 所有支持的配置项
    // 只有 publicPath 属性为必填，其它都是选填项

    // Webpack 输出资源绑定在 HTTP 服务器上的根目录，
    // 和 Webpack 配置中的 publicPath 含义一致 
    publicPath: '/assets/',

    // 不输出 info 类型的日志到控制台，只输出 warn 和 error 类型的日志
    noInfo: false,

    // 不输出任何类型的日志到控制台
    quiet: false,

    // 切换到懒惰模式，这意味着不监听文件变化，只会在请求到时再去编译对应的文件，
    // 这适合页面非常多的项目。
    lazy: true,

    // watchOptions
    // 只在非懒惰模式下才有效
    watchOptions: {
        aggregateTimeout: 300,
        poll: true
    },

    // 默认的 URL 路径, 默认是 'index.html'.
    index: 'index.html',

    // 自定义 HTTP 头
    headers: {'X-Custom-Header': 'yes'},

    // 给特定文件后缀的文件添加 HTTP mimeTypes ，作为文件类型映射表
    mimeTypes: {'text/html': ['phtml']},

    // 统计信息输出样式
    stats: {
        colors: true
    },

    // 自定义输出日志的展示方法
    reporter: null,

    // 开启或关闭服务端渲染
    serverSideRender: false,
}));
```

## webpack-dev-middleware与模块热更新

