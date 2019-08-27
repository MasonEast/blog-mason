
运行 `npm rm express --save`。这个命令会把它从 `node_modules/` 中删除，还会更新 `package.json` 文件。

## 用Webpack构建Web程序

## 服务端框架

选用最合适的框架，既要看项目需要什么，也要看开发项目的团队。比如要给一家研究机构搭建一个内容管理系统，用来管理他们收集的法律文件：
1. 文件上传，下载，阅读   ---  express
2. 生成PDF的微服务    ---   hapi
3. 电子商务组件   ---   Sails.js

### 框架是什么

LoopBack项目用了如下定义：

1. API 框架——用于搭建 Web API 的库，有协助组织程序结构的框架支持。LoopBack 将自己定义为这类框架。
2. HTTP 服务器库——所有基于 `Express `的项目都可以归为这一类，包括 `Koa `和 `Kraken.js`。这些库帮我们围绕 HTTP 动词和路由搭建程序。
3. HTTP 服务器框架——用来搭建模块化 HTTP 服务器的框架。`hapi` 就是这种框架。
4. Web MVC 框架——模型视图控制器框架，`Sail.js `就是这种框架。
5. 全栈框架——这些框架在服务器端和浏览器上用的都是 JavaScript，并且两端可以共享代码。这被称为同构代码。`DerbyJS` 是个全栈 MVC 框架。

### Koa

Koa是以Express为基础开发的，但它用ES6中的生成器语法来定义中间件，主要特点：

库类型：       HTTP 服务器库
功能特性：     基于生成器的中间件，请求/响应模型
建议应用：     轻型 Web 程序、不严格的 HTTP API、单页 Web 程序 插件架构 中间件
文档：        http://koajs.com/
热门程度：     GitHub 10 000 颗星
授权许可：     MIT

```js
const koa = require('koa');
const app = koa();

app.use(function*(next) {
  const start = new Date;
  yield next;     //yield 以运行下 一个中间件组件
  const ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(function*() {
  this.body = 'Hello World';    //到当初 yield 的 位置继续执行
});
app.listen(3000);
```

#### koa-router，特点是链式API

```js
router
  .post('/pages', function*(next) {
  // 创建页面 
  })
  .get('/pages/:id', function*(next) { 
    // 渲染页面
  })
  .put('pages-update', '/pages/:id', function*(next) {
  // 更新页面 
  });
  ```

### Kraken

Kraken是基于Express的，又通过Paypal开发的一些定制模块添了些新功能，为程序提供安全层的Lusca是其中特别实用的一个模块。主要特点：

库类型：     HTTP 服务器库
功能特性：   对象项目结构要求严格、模型、模板(Dust)、安全强化(Lusca)、配置管理、国际化 
建议应用：   企业Web程序
插件架构：   Express 中间件
文档：       https://www.kraken.com/help/api
热门程度：   GitHub 4000 颗星
授权许可：   Apache 2.0

#### 设置

可以将Kraken作为中间件组件添加到Express项目中：

```js
const express = require('express'),
const kraken = require('kraken-js');

const app = express();
app.use(kraken());
app.listen(3000);
```

### hapi

hapi是个服务器框架，它的重点是Web API的开发，hapi有自己的插件API，完全没有客户端支持，也没有数据模型层。主要特性：

库类型：     HTTP 服务器库
功能特性：   高层服务器容器抽象，安全的头部信息 建议应用 单页 Web 程序、HTTP API
插件架构：   hapi 插件
文档：      http://hapijs.com/api
热门程度：   GitHub 6000 颗星
授权许可：   BSD3条款

优点：
hapi的插件API是它的最大的优势，插件不仅能扩展hapi的服务器，还可以添加各种各样的功能，比如数据校验和模板等。另外，由于hapi是基于http服务器的，所以**适合用在某些部署场景**中,或者需要做负载均衡时，hapi基于服务器的API可能比express和koa好用

弱点：
hapi的弱点跟express一样：极简，所以对项目结构没有把控。我们永远也不知道哪个插件的开发会停下来，所以过于依赖插件可能会造成将来难以维护。

### Sail.js

这是一个MVC框架（模型-视图-控制器）。Sails有一个跟数据库协同作用的对象关系映射（ORM）库，还能自动生成REST API，它支持WebSocket等现代化功能，它是前端无关的： Sails不是全栈框架。所以可以跟任何前端库或框架配合使用。主要特性：

库类型：     MVC 框架
功能特性：   有支持数据库的 ORM，生成 REST API，WebSocket 
建议应用：   Rails 风格的 MVC 程序
插件架构：   Express 中间件
文档：       http://sailsjs.org/documentation/concepts
热门程度：   GitHub 6000 颗星 
授权许可：   BSD3条款

优点：
自带的项目创建和 API 生成意味着可以快速设置项目，快速添加典型的 REST API。因为 Sails 项目的文件系统结构都是一样的，所以也有利于创建新项目和相互协作。Sails 的创建者 Mike McNeil 和 Irl Nathan 共同写了本书，叫 Sails in Action，书中阐述了 Sails 对 Node 新手是多么 友好。

缺点：
Sails 的弱点跟其他服务器端 MVC 框架一样:路由 API 意味着我们在设计程序时必须考虑到 Sails 的路由特性，并且由于 Waterline 的处理方式，可能很难将数据库模式调整为符合它的要求 的样子。

### DerbyJS

它是一个全栈框架，支持数据同步和视图的服务器端渲染，他用到了MongDB和Redis，数据同步层是由ShareJS提供的，支持冲突的自动解析。主要特性

功能特性：    有支持数据库的ORM（Racer）， 同构
建议应用：    有服务器端支持的单页Web程序
插件架构：    DerbyJS插件

### LoopBack

LoopBack是个API框架，但它的功能特性很适合跟数据库配合，也很适合跟MVC程序配合。它甚至还用个浏览和管理REST API的Web界面，如果你要给移动端和桌面端程序找个创建Web API的框架，那就是LoopBack了，主要特性：

功能特性：      ORM， API用户界面， WebSocket，客户端SDK（包括ios）
建议应用：      支持多客户端的API（移动端， 桌面端， Web）
插件架构：      Express中间件

优点：
帮我们免除了繁琐的套路化代码。它的 命令行工具几乎可以生成一个完整的 RESTful Web API 程序，甚至包括数据库模型和校验。同 时，LoopBack 对前端代码没有太多限制。它还让你考虑哪个模型可以通过浏览器访问，哪个只 能在服务器端使用。有些框架在这个问题上犯了错误，把所有事情都推给了浏览器。
如果有需要跟 Web API 通话的移动端程序，可以看看 LoopBack 的客户端 SDK。它支持 API 集成，可以给 iOS 和 Android 推送消息。

弱点：
LoopBack 基于 JSON 的模型 API 跟大部分 JavaScript 数据库 API 都不同。所以可能要花些时 间才能搞懂如何将它映射到已有的数据库模式上。另外，因为 HTTP 层是基于 Express 的，所以 在某种程度上会受限于 Express 所支持的功能。尽管 Express 是个很好的 HTTP 服务器库，但还 有支持更现代化的 API 的新库。LoopBack 没有特定的插件 API，虽然可以用 Express 中间件，但 毕竟不如 Flatiron 或 hapi 的插件 API 方便。

### 比较

乍一看，那些热门的Node服务器端框架都差不多，它们提供了轻便的HTTP API，使用可服务器端模型，而不是PHP那种页面模型。但他们在设计上的差别对项目的影响很大，所以要做个比较的话，应从HTTP层开始

#### HTTP服务器和路由

Koa 也是写 Express 的那个作者写的，但其用更加现代化的 JavaScript 特性实现了全新的工作 方式。如果你喜欢 Express，也喜欢用 ES2015 生成器语法，可以试试 Koa。
hapi 的服务器和路由 API 是高度模块化的，感觉跟 Express 那一类不一样。如果你觉得 Express 的语法比较尴尬，可以试试 hapi。hapi 让 HTTP 服务器变得更容易处理，如果你想把服 务器连起来，或者要做服务器集群，hapi 比 Express 及其后裔们好用。
Flatiron 的路由器能跟 Express 兼容，不过功能更多。跟 Express 风格的中间件栈不同，Flatiron 的路由器用了路由表，还会发出事件。我们可以给 Flatiron 的路由器传递一个对象常量。这个路 由器还能用在浏览器中，如果你的服务器端开发人员还要做现代化的客户端开发，那跟 React 路 由器之类的技术比起来，Flatiron 路由器会让他们觉得更舒服。

### 总结

1. Koa 轻便、极简，在中间件中使用 ES2015 生成器语法。适合依赖外部 Web API 的单页 Web程序。
2. hapi 的重点是 HTTP 服务器和路由。适合由很多小服务器组成的轻便后台。
3. Flatiron 是一组解耦的模块，既可以当作 Web MVC 框架来用，也可以当作更轻便的 Express
库。Flatiron 跟 Connect 中间件是兼容的。
4. Kraken 是基于 Express 的，添加了安全特性。可以用于 MVC。
5. Sails.js 是 Rails/Django 风格的 MVC 框架。有 ORM 和模板系统。
6. DerbyJS 是个同构框架，适合实时程序。
7. LoopBack 帮我们省掉了写套路化代码的工作。它可以快速生成带有数据库支持的 REST API，并有个 API 管理界面