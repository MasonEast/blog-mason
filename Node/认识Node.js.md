# Node.js 是什么

大体上来说，Node和JS的优势之一是它们的单线程编程模型。但没有哪个用户想在浏览器执行网络访问或文件获取这样的低速操作时干等着，为了解决这个问题，浏览器引入了事件机制： 在你点击按钮时，就有一个事件被触发，还有一个之前定义的函数会跑起来，这种机制可以规避一些在线程编程中经常出现的问题，比如资源死锁和竞态条件。

我们希望在读取文件或通过网络发送消息时，运行平台不会阻塞业务逻辑的执行。Node用三种技术来解决这个问题： 事件， 异步API， 非阻塞I/O。

有几个特点:简单入门快、无缝衔接前端(JS、JSON)、轻量可扩展,异步非阻塞 IO,可以适应分块传输数据以及较慢的网络环境,尤其擅长高并发访问;轻量:node 本身即是代码又是服务器;前后端使用统一一套语言;同时有海量的第三方应用组件

## 非阻塞I/O
程序可以在做其他事情时 发起一个请求来获取网络资源，然后当网络操作完成时，将会运行一个回调函数来处理这个操作 的结果。

## 事件轮询

Node内置的HTTP服务器库，即核心模块http.Server，负责用流， 事件， Node的HTTP请求解析器的组合来处理请求。

事件轮询是单向运行的先入先出队列.

## Node自带的工具

### npm
可以用它来安装npm注册中心的包，也可以用它来查找和分享自己的项目

### 核心模块

Node的核心模块就相当于其他语言的标准库，它们是编写服务器端JavaScript所需的工具。

1. 文件系统
Node 不仅有文件系统库(`fs、path`)、TCP 客户端和服务端库(`net`)、HTTP 库(`http 和 https`) 和域名解析库(`dns`)，还有一个经常用来写测试的断言库(`assert`)，以及一个用来查询平台信息 的操作系统库(`os`)。
Node 还有一些独有库。事件模块是一个处理事件的小型库，Node 的大多数 API 都是以它为 基础来做的。比如说，流模块用事件模块提供了一个处理流数据的抽象接口。因为 Node 中的所 有数据流用的都是同样的 API，所以你可以很轻松地组装出软件组件。如果你有一个文件流读取 器，就可以很方便地把它跟压缩数据的 zlib 连接到一起，然后这个 zlib 再连接一个文件流写入器， 从而形成一个文件流处理管道。

使用核心模块和流：

```js
const fs = require('fs');
const zlib = require('zlib');
const gzip = zlib.createGzip();
const outStream = fs.createWriteStream('output.js.gz'); //写流
fs.createReadStream('./node-stream.js')   //读流
  .pipe(gzip)     //实现压缩
  .pipe(outStream);
```

2. http模块

使用Node的http模块：

```js
const http = require('http');
const port = 8080;
const server = http.createServer((req, res) => {
  res.end('Hello, world.');
});
server.listen(port, () => {
console.log('Server listening on: http://localhost:%s', port);
});
```

3. 调试器

Node自带的调试器支持单步执行和REPL（读取-计算-输出-循环）。带`debug`参数运行程序，就可以对这个程序开启调试器
`node debug xxx.js`

# 定义Node应用程序

Node程序主要可以分成三类： Web应用程序， 命令行工具和后台程序， 桌面程序。提供单页应用的简单程序， REST微服务以及全栈的Web应用都属于Web应用程序。桌面程序一般是用Electron框架写的软件，Electron用Node作为基于Web的桌面应用的后台，Atom和VS code文本编辑器都术语这一类。

