# Node.js

## 什么是Node.js

Node.js是一个基于Chrome v8引擎的js运行时的环境。

运行时环境是一个平台，它把运行在底层的操作系统和体系结构的特点抽象出来，承担了解释与编译，堆管理，垃圾回收机制，内存分配，安全机制等功能。

简而言之，js运行时环境就是一个能够执行js语句的运行环境，**它提供一系列以往由处理器和操作系统才能提供的功能**，使得开发者能够脱离底层指令，从而专注于业务逻辑开发。

在Node.js之前，js主要运行在浏览器环境中，这是因为只有浏览器才具有能够解释js的机制，而Node.js使得js突破了浏览器的限制，开启了js的后端开发之路。


## Node.js的特点和应用场景

Node使用了**事件驱动**， **非阻塞I/O模型**， **轻量又高效**。

事件驱动定义了一种由事件驱动的数据处理方式，应用发送的所有事件都会被**载入附加存储区**，每一个事件都代表了一系列的**数据变更**。被保留下来的事件会作为操作历史留存下来，与此同时事件流会被不间断的同步到客户端供其使用，

对比CRUD，事件驱动的优势：
1. 已经发生的事件是不可更改的，并且只在附加区域中存储而不影响主线程，因此对事件进行处理的操作完全可以在后台进行而不影响到客户端的UI和内容展示。
2. 不同用户对同一个对象的同时操作不会产生冲突，因为这种数据处理方式避免了对数据本身的直接更改。
3. 附加区域中存储的事件流实际上提供了一个监听机制，使开发者能够通过重演历史事件的方式来获取当前状态，进而有助于系统的测试和漏洞修复

事件驱动的异步I/O模型使得Node.js非常适合用来处理I/O密集型应用。

## Web代理工具NProxy

NProxy是一个跨平台，支持单文件，多文件及目录替换，支持HTTP和HTTPS协议的Web代理工具，在文件替换功能上尤其出色。

## Koa

Koa中有一个非常重要的概念叫上下文。即Context

### 什么是Context对象

Koa将Node.js的Request和Response对象封装到Context对象中，所以也可以把context对象称为一次对话的上下文，通过加工Context对象，就可以控制返回给用户的内容。

Koa应用程序中的每个请求都将创建一个Context，并在中间件中被作为参数引用。

```js
//可以使用ctx，也可以使用this关键字访问context对象
app.use(async ctx => {
    ctx;            //这是context
    ctx.request;
    ctx.response;
    this;           //这也是context
    this.request;
    this.response;
})
```

### 常用属性和方法

#### ctx.request

```js
const koa = require('koa')
const app = new koa()
//获取get请求中的参数
app.use(async ctx => {
    ctx.response.body = {
        url: ctx.request.url,           //获取请求url
        query: ctx.request.query,        //获取解析的查询字符串
        querystring: ctx.request.querystring  //获取原始查询字符串
    }
})

//获取post请求中的参数
app.use(async ctx => {
    let postdata = ''
    ctx.req.on('data', data => {           //监听data事件
        postdata += data                    //拼装post请求的参数
    })
    ctx.req.on('end', () => {
        console.log(postdata)
    })
})
//也可以通过koa-bodyparser中间件来获取post请求的参数
```

#### ctx.response

type： 设置响应的Content-Type， 浏览器默认是'text/plain'
status： 设置请求状态
body： 设置请求的响应主体
redirect： 这个方法用于将状态码302重定向到URL

#### ctx.state

ctx.state是推荐的命名空间，用于通过中间件传递信息和前端视图。

```js
//把user属性存放到ctx.state对象中，以便能够被另一个中间件读取
ctx.state.user = yield User.find(id)
```

#### ctx.cookies

用于设置和获取cookie

```js
ctx.cookies.get(name, [options])        //获取cookie
ctx.cookies.set(name, value, [options]) //设置cookie
```
options的配置：
maxAge: cookie过期时间
signed： cookie签名值
expires： cookie过期的Date
path： cookie路径， 默认是/
domain： cookie域名
secure： 安全cookie，只能使用https访问
httpOnly： 如果为true， 则cookie无法被js获取到
overwrite： 一个布尔值，表示是否覆盖以前设置的同名cookie

#### ctx.throw

用于抛出错误，把错误信息返回给用户

### Koa的中间件

Koa应用程序其实就是一个包含一组中间件函数的对象，而且有了async/await这种高级的语法糖，使得中间件写起来更加简单。

#### 中间件概念

```js
const logger = async function(ctx, next) {
    console.log(ctx.method, ctx.host + ctx.url)
    await next()
}

app.use(logger)     //使用app.use加载中间件

```

抽象的logger函数就是中间件，通过app.use()函数来加载中间件

中间件的函数是一个带有ctx和next两个参数的简单函数， next用于把中间件的执行权交给下游的中间件。在next()之前使用await关键字是因为next()会返回一个Promise对象，而在当前中间件中位于next（）之后的代码，类似于一种先进后出的堆栈结构，

```js
app.use (async function (ctx , next) { 
    console.log(’one start’);
    await next() ;
    console.log('one end');
));
app.use (async function (ctx， next) {
    console.log(’two start’); 
    ctx.body= ’two’;
    await next(); 
    console.log(’two end’);
));
app. use (async function (ctx, next) {
    console.log(’three start’); 
    await next() ; 
    console.log(’three end’);
));
//执行结果
one start 
two start 
three start 
three end 
two end
one end
```

如果想将多个中间件组合成一个单一的中间件，便于重用或导出，可以使用koa-compose
```js

const compose = require('koa-compose')
async function middleware1(ctx, next) {
    //...
    await next()
}
async function middleware2(ctx, next) {
    //...
    await next()
}
async function middleware3(ctx, next) {
    //...
    await next()
}

const all = compose(middleware1, middleware2, middleware3)

app.use(all)
```

```js
//使用中间件获取响应时间

const koa = require('koa')
const app = new koa()
app.use(async (ctx, next) => {
    let stime = new Date().getTime()
    await next()
    let etime = new Date().getTime()
    ctx.response.type = 'text/html'
    ctx.response.body = '<h1>,,,</h1>'
    console.log(响应时间：${etime - stime})
})

```

### 常用中间件介绍

koa-bodyparser： 解析post请求
koa-router： 路由
koa-static和koa-views： 在实际开发中，不但会把html写在单独的文件中，还会引用单独的css样式及js文件，koa-static是专门用于加载静态资源的中间件，通过它可以为页面请求加载css，js等静态资源，koa-views用于加载html模板文件

## 路由介绍

路由是根据url的变更重新渲染页面布局和内容的过程。

### 路由的概念

前端路由主要解决了两个问题： 
    1. 在页面不刷新的前提下实现url的变化
    2. 捕捉url的变化并执行相应的页面逻辑。

### koa-router路由中间件

koa-router具有丰富的API，可以实现命名参数，命名路由，多路由中间件，多路由，嵌套路由等功能。

```js
const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
router.get('/', async (ctx, next) => {
    //...
})
app.use(router.routes())
```

router.all()方法一般用来设置请求头， 如设置过期时间， CORS等

```js
router.all('/*', async (ctx, next) => {
    ctx.set("Access-Control-allow-Origin", "https://www.xxx.com")
    await.next()
})
```

#### 命名路由

有时候通过名称来标识一个路由显得更方便，特别是在拼接具体的URL或执行跳转时，下面创建一个ROuter实例并给某个路由设置名称：

```js
//设置路由的名称为user
router.get('user', '/users/:id', function(ctx, next){
    //...
})
//通过调用路由的名称user，生成路由 == '/users/3'
router.url('user', 3)
//也可以
router.url('user', {id: 3})

router.use((ctx, next) => {
    //重定向到路由名称为sign-in的页面
    ctx.redirect(ctx.router.url('sign-in'))
})
//使用router.url()方法可以在代码中根据路由名称和参数生成具体的URL，而不用采用字符串拼接的方式去生成URL
```

#### 多中间件

koa-router支持单个路由多中间件的处理。通过这个特性，能够为一个路由添加特殊的中间件，也可以把一个路由要做的事情拆分成多个步骤去实现。当路由处理函数中有异步操作时，这种写法的可读性和可维护性更高。

```js
router.get(
    '/users/:id',
    (ctx, next) => {
        return User.findOne(ctx.params.id).then(user => {
            //异步操作，首先读取用户的信息
            ctx.user = user
            //控制权传递，调用下一个中间件
            next()
        })
    },
    (ctx, next) => {
        //在这个中间件中再对用户信息做一些处理
        console.log(ctx.user)
    }
)
```

#### 嵌套路由

在实际项目中，应用界面通常由多层嵌套的组件组合而成，而后端接口同样按某种结构定义嵌套路由。

```js
const forums = new Router()
const posts = new Router()
posts.get('/', (ctx, next) => {
    //...
})
posts.get('/:pid', (ctx, next) => {})

forums.use('forums/:fid/posts', posts.routes(), posts.allowedMethods())
//获取互联网板块列表的接口
//"/forums/:fid/posts/:pid" => "/forums/123/posts"
//获取互联网板块下某篇文章的接口
// "/forums/:fid/posts/:pid" => "forums/123/posts/22"
app.use(forums.routes())
```

#### 路由前缀

通过prefix参数，可以为一组路由添加统一的前缀，和嵌套路由类似，这样做有利于管理路由及简化路由的写法：

```js
let router = new Router({
    prefix: '/users'
})
//匹配路由"/users"
router.get('/', ...)
```

#### URL 参数

koa-router也支持URL参数，该参数会被添加到ctx.params中，参数可以是一个正则表达式，原理是把URL字符串转化成正则对象

```js

router.get('/:category/:title', (ctx, next) => {
    //响应请求  'programming/how-to-koa'
    console.log(ctx.params)
    //参数解析 =》 {category: 'programming', title: 'how-to-koa'}
})

```

### 通过koa-router实现接口的权限控制

常见鉴别用户权限的两种方式：
    1. 基于Cookie的认证模式
    2. 基于Token的认证模式

Token方式最大的优点在于采用了无状态的机制，在此基础上，可以实现天然的跨域支持，前后端分离等，同时降低了服务端开发和维护的成本。

Token方式的缺点在于服务器每次都需要对Token进行校验，会对服务器产生运算压力，另外，无状态API缺乏对用户流程或异常的控制，为了避免出现危险，应该设置较短的过期时间，且需要对密钥进行严格的保护。对于具有复杂流程的高危场景，则要谨慎选择Token认证模式。

Token的中间件实现选择koa-jwt，它会在中间件流程中通过JWT完成对Token的校验和解码。

Token会把每次请求通过请求头中的Authorization字段传给服务器端，koa-jwt支持自定义getToken方法， Cookie和Header中的Authorization等三种校验方式。

流程是客户端访问login接口后获取Token， 之后的请求需要将请求头中的Authorization设置为Bearer加Token的内容，当请求经过koa-jwt中间件时，JWT会解码并校验Token，如果有权限会进入下一层中间件，否则会阻止访问。

```js

const {sign} = require('jsonwebtoken')
const secret = 'demo'
const jwt = require('koa-jwt')({secret})

router
    .post('/api/login', async (ctx, next) => {
        const user = ctx.request.body
        if(user && user.username){
            let {username} = user
            const token = sign({username}, secret, {expiresIn: '1h'})
            ctx.body = {
                message: 'Get Token Success',
                code: 1,
                token
            }
        }else {
            ctx.body = {
                message: 'Param Error',
                code: -1
            }
        }
    })
    .get('/api/userInfo', jwt, async ctx => {   //获取用户信息，需要校验
        ctx.body = {username: ctx.state.username}
    })
    .get('/api/adminInfo', jwt, admin, async ctx => {   
        //管理员接口，检查是否为管理员
        ctx.body = {username: ctx.state.user.username}
    })

    //上面的admin中间件
    module.exports = () => {
        return async (ctx, next) => {
            if(ctx.state.user.username === 'admin') {
                next()
            }else {
                ctx.body = {
                    code: -1,
                    message: 'Authentication Error'
                }
            }
        }
    }

```

koa-jwt 会将校验后的用户信息放在上下文的State对象上，方便开发者调用，但开发者应该尽量不使用此信息进行业务查询等操作，以保持中间件的职责单一。

除此之外， 还可以利用koa-router的嵌套路由，在URL地址的某个层级上进行权限控制，减少接口的重复设置：

```js
const user = new Router()
const detail = new Router()

detail.get('/info', async ctx => {
    ctx.body = {username: ctx.state.user.username}
})

user.get('/api/login', async (ctx, next) => {
    //...
})
//将权限控制放在/api/user层级，所有在detail上的接口都需要权限
    .use('/api/user', jwt, dtail.routes(), detail.allowedMethods())

app.use(router.routes()).use(router.allowedMethods())
```





### RESTful规范

REST的全称是Representational state Transfer， 即表现层状态转移。

REST设计一般符合以下条件：
    1. 程序或应用的事物都应该被抽象为资源
    2. 每个资源对应唯一的URI
    3. 使用统一的接口对资源进行操作
    4. 对资源的各种操作不会改变资源标识
    5. 所有的操作都是无状态的

在RESTful架构中，所有的关键点都集中在如何**定义资源和如何提供资源的访问**上。

在非RESTful架构中的设计：
```js

https://api.test.com/addUser        // POST方法，请求发送新增用户信息
https://api. test. com/deleteUser   //POST方法，请求发送用户的 ID https://api.test.com/updateUser      // POST方法，请求发送用户的 ID和修改的信息 
https://api.test.com/getUser        //GET方法，请求发送用户 ID
```

而基于RESTful架构的API，全局只提供唯一的URI： https://api.test.com/users

```js
https://api.test.com/users          POST方法， 请求发送新增用户信息
https://api.test.com/users/:id      DELETE方法，用户 ID是URI的一部分
https://api.test.com/users/: id     PUT方法，请求发送用户的信息,ID是 URI 的一部分
https://api.test .com/users/:id     GET方法，用户 ID是 URI 的一部分

//使用koa实现RESTful架构设计
router
    .post('/users', (ctx, next) => {
        ctx.body = '新增'
    })
    .del('/users/:id', (ctx, next) => {
        ctx.body = '删除id的用户'
    })
    .put('/users/:id', (ctx, next) => {
        ctx.body = '修改id的用户'
    })
    .get('/users/:id', (ctx, next) => {
        ctx.body = 'id的用户信息'
    })
```


# HTTP

HTTP/0.9： http第一个版本，只支持get请求，用于传输基础的文本内容

HTTP/1.0： 增加了访问不同对象类型的功能，不仅可以传输文本，还可以传输图像，视频，二进制文件等， 同时，在GET请求命令的基础上， 增加了POST， PUT， HEAD， DELETE， LINK等命令，另外还增加了头部信息， 如User-Agent， Accept， Last-Modified, Content-Type等

HTTP/1.1： 目前依旧被广泛的使用在互联网领域， 在1.0的基础上又做了大量的改进：
    1. 默认使用持久连接的机制
    2. 引入管道方式支持多请求发送
    3. 请求头增加Host字段，使一台物理服务器中可以存在多个虚拟机，共享同一个IP地址
    4. 响应头增加Transfer-Encoding字段，引入了chunked分块传输编码机制
    5. 增加Cache-Control头域， 缓存机制更加灵活强大
    6. 增加Content-Range头域， 实现带宽优化
    7. 新增请求方法： OPTIONS， TRACE， CONNECT等
    8. 新增24个HTTP状态码： 203，205，206，303，305等

HTTP/2.0： 在1.1的基础上保持原有语义和功能不变，但极大的提升了性能

    1. 采用二进制格式传输数据： 1.1使用的是文本格式，在2.0中，基本的协议单位是帧，每个数据流均以消息形式发送，消息由一个或多个帧组合而成。
   
    2. 多路复用： 在1.0中如果需要发送多个请求，则必须创建多个TCP连接， 并且浏览器对单个域名的请求有相应的数量限制，一般为6个；在1.1中，引入流水线技术，但先天的先进先出机制导致当前请求的执行依赖于上一个请求执行的完成，容易引起报头阻塞； 2.0从新定义了底层的HTTP语义映射，允许在同一个连接上使用请求和响应双向数据流。至此，同一个域名只要占用一个TCP连接，通过数据流，以帧为基本协议单位，从根本上解决了这个问题，避免了频繁创建连接产生的延迟，减少了内存消耗，提升了性能。


    3. 流的优先级： 在2.0中，可以为每个流设置优先级，高优先级的流会被服务优先处理并返回给客户端，同时，流的优先级允许根据场景的不同进行动态改变。客户端可以在流中设置优先级帧来改变流的优先级。

    4. 首部压缩

    5. 服务端推送： 服务端主动推送与当前请求相关的内容，同时，服务端推送遵循同源策略，可以被浏览器缓存，实现多页面共享缓存资源。


## URI和URL

URI： 统一资源标识符，一个紧凑的字符序列，用于标识抽象或物理资源
URL： 统一资源定位符，是URI的子集

一个完整的URL一般由7个部分组成：
    1. scheme： 使用的协议， 如FTP， HTTP等
    2. user[:password]： 表示访问资源的用户名和密码，常见于FTP协议
    3. host： 主机， 如IP地址或域名
    4. port： 端口号， 如HTTP默认为80端口
    5. path： 访问资源的路径
    6. query： 请求数据， 以？开头
    7. fragment： 定位锚点， 以#开头，可用于快速定位网页对应的段落

## 常见的HTTP状态码

1**： 消息
2**： 成功
3**： 重定向
4**： 请求错误
5** 和6**： 服务器错误

## 常用的HTTP首部字段

User-Agent： HTTP客户端程序的信息
Last-Modified： 资源的最后修改的日期和时间
Content-Length： 实体主体的大小，单位为字节
Content-Encoding： 实体主体适用的编码方式，如gzip，compress，deflate等
Content-Type： 实体主体的媒体类型， 如image/png， application/x-javascript， text/html等
Expires： 实体主体过期日期和时间
Set-Cookie： 开始状态管理所使用的Cookie信息
Cookie： 服务器接收到的Cookie信息
Cache-Control： 控制缓存的行为， 如public， private， no-cache等
ETag： 资源的匹配信息
Vary： 代理服务器缓存的管理信息
Server： HTTP服务器的安装信息


## Node.js的querystring模块

```js
const querystring = require('querystring')

querystring.escape("id=1")      //返回id%3D1
querystring.unescape("id%3D1")  //返回id=1
querystring.parse("type=1&status=0")    //返回{type: '1', status: '0'}
querystring.stringify({type: '1', status: '0'})     //返回type=1&status=0
```

### koa-router中的querystring

当服务器接收到请求后，一般都需要把请求带过来的数据解析出来，koa-router封装了上下文的Request对象，在该对象中内置了query属性和querystring属性。通过它们可以直接获取GET请求的数据，唯一不同的是query返回的是对象，querystring返回的是查询字符串。

# 构建Koa Web应用

## MVC

MVC全称是Model View Controller，即模型，视图，控制器。MVC是一种软件设计典范，用逻辑，数据，视图分离的方式组织代码，在对界面及用户交互进行修改的同时，业务逻辑部分的代码可以保持不变。

## 模板引擎

开发Web应用时， 必然会涉及两个方向： 一个是前端界面，另一个是后端服务。在大部分项目中，需要后端服务提供数据信息给前端界面进行展示。常规的操作是前端发起HTTP请求，以Ajax的方式调用后端提供的服务接口，后端接口接收到请求后，进行相应的逻辑处理，并返回对应的数据给前端，然后由前端进行动态的HTML片段替换。这样有一定的弊端： 
    1. 不利于SEO
    2. 不利于SSR

### 什么是模板引擎

模板引擎是Web应用中用来生成动态的HTML的工具，负责将数据模型和HTML模板结合，生成最终的HTML

### 常见的模板引擎

常见的有EJS， Jade（现在叫Pug）， Handlebars， Nunjucks， Swig等。

用不同的模板引擎实现下面代码：

```js
<div class="entry"> 
    <h1>Template Engine</h1>
    <div class="body">
        <p>This is the best template engine</p>
    </div>
</div>
```

1. Ejs

```js
<div class="entry">
    <% if(title){ %>
        <h1><%=title%></h1>
    <% } %>
    <div class="body">
        <p><% =body %></p>
    </div>
</div>
```

2. Jade

```js
div.entry
    if title
        h1= title
    div.body
        p= body
```

3. Nunjucks

```js
<div class="entry">
    {% if(title){ %}
            <h1>{{title}}</h1>
    {% } %}
    <div class="body">
        <p>{{ body }}</p>
    </div>
</div>
```

## 静态资源

若客户端请求的是静态资源，如js脚本，图片， css样式表等，服务器会直接把静态资源的内容响应给客户端； 若客户端请求的是动态资源， 如个人中心页面，服务器会先从数据库或第三方接口中获取对应的Model数据，然后把View模板文件与Model数据相结合，转化为静态资源，最后把静态资源响应给客户端。

### 静态资源的类型

浏览器通过MIME Type来确定资源的媒体类型

MIME Type通常是通过HTTP，由Web服务器告知浏览器的，被定义在Content-Type header中。

### koa-static简介

koa-static中间件的API接收两个参数--root和opts

```js
const Koa = require('koa')
const app = new Koa()
app.use(require('koa-static')(root, opts))
```

root为字符串类型，用来指定静态资源的相对目录路径，opts为对象类型，可以通过opts对静态资源进行详细配置。koa-staic常用配置：

1. maxage： 浏览器默认的最大缓存时长max-age
2. hidden： 是否允许传输隐藏的文件，默认false
3. index： 默认的文件名，默认为index.html
4. defer： 是否推迟响应， 如果为true，koa-static中间件将会在其他中间件执行完成后再执行
5. gzip： 默认为true，即支持gzip压缩
6. setHeaders： 设置请求头函数
7. extensions： 当资源匹配不到时，根据传入的数组参数依次进行匹配，返回匹配到的第一个资源。

### 使用koa-multer中间件实现文件上传

主要用于上传文件，处理multipart/form-data类型的表单数据

注： Multer不会处理任何非mutipart/form-data类型的表单数据

```js
const Koa = require('koa')
const multer = require('koa-multer')
const app = new Koa()
app.use(multer({ dest: './uploads/' }))
app.listen(3000)
```

multer接收一个options对象，其中最基本的是dest属性，用来设置上传文件的存储地址。如果省略options对象， 上传文件将被保存到内存中，不会写入磁盘。为了避免命名冲突，multer会修改上传文件的文件名。

options对象属性：

dest
fileFilter： 文件过滤器
limits： 限制上传的数据
preservePath： 保存包含文件名的完整文件路径

```js
const Koa = require('koa')

const Router = require('koa-router')
const multer = require('koa-multer')

const app = new Koa()
const router = new Router()

const upload = multer({
    dest: 'uploads/'
})

const types = upload.single('avatar')
router.get('/upload', async (ctx, next) => {
    ctx.response.body = ...
})

router.post('/profile', types)  //文件上传请求路由

app.use(router.routes())
app.listen(3000)
```

# 数据库

数据库主要具备以下特点：
    1. 数据共享，数据库中的数据可以同时被多人查询和写入
    2. 减少数据冗余度，与文件系统相比，数据库共享了数据，从而避免了文件的复制，降低了数据冗余度
    3. 数据独立： 数据库中的数据和业务是对立的
    4. 数据一致性和可维护性： 数据库中的数据应当保持一致，以防止数据丢失和越权使用。在同一周期内，既能允许对数据实现多路存取，也能防止用户之间的数据操作相互影响。
    5. 故障恢复： 可以及时发现故障和修复，从而防止数据被损坏

数据库一般采用索引来提升查询效率

为了实现数据的一致性，数据库操作是基于事务的。

数据库按照存储的数据模型，分为关系型数据库和非关系型数据库：
    1. 关系型数据库： 把复杂的数据结构归结为简单的二维表格形式，表格之间的数据关系通过主外键来维系。
    2. 非关系型数据库： 直接处理对象的数据库

## 常见的数据库

### 关系型数据库

1. Oracle
2. MySQL
3. MariaDB

### 非关系型数据库

1. MongoDB： 一种文档导向的数据库，可以直接存储对象
2. Memcached： 一套分布式高速缓存系统，基于键值存储，通常应用于高速缓存
3. Redis： 一套基于内存的可持久化的键值对存储数据库

在开发时，结构简单的应用一般会采用MongoDB这样的数据库来存储，为了提升系统性能，一般也会采用Redis这样的内存数据库作为高速缓存。

## 在Koa中应用MySQL数据库

## 在Koa中应用MongoDB数据库


在操作数据库前，需要建立数据库连接：

```js
const mongoose = require('mongoose')
mongoose.connect( 'mongodb://localhost/test',{
    user: 'username',
    pass: 'password',
    poolSize: 10
})

const db = mongoose.connection
db.on('error', err => {
    console.error(err)
})
db.on('open', () => {
    console.log('we are connected')
})
```

在Mongoose中，一切都基于Schema，Mongoose定义了数据模型的结构：

```js
const categorySchema = new mongoose.Schema({
    name: String,
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})
```

在定义类型时，也可以定义一些约束：

required： 是否必填
default： 默认值
select： 定义在查询时，是否默认输出该字段
get： 定义Getter，可以通过它定义计算字段
set： 定义Setter，在写入数据时，可以对写入的数据进行预处理
alias： 别名

为了提高查询效率，一般会对查询的字段配置索引来优化查询，通过index属性来开启

```js
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
        unique: true
    }
    ...
})
//和关系型数据库中的索引一样，在写入数据时，需要维护索引信息，这会降低数据写入的效率，不要滥用索引
```

定义了Schema之后，可以通过model方法得到模型
`const Category = mongoose.model('Category', categorySchema)`

在得到的模型上，可以直接调用其原型上的方法对模型进行数据操作，新增数据的代码：

```js
const category = new Category({     //直接实例化一个新的对象来新增数据
    name: 'test', 
    description: 'test category'
})

category.save(error => {
    if(error){
        console.error(error)
        return
    }
    console.log('saved')
})

Category.create({       //也可以直接通过模型的create方法新增数据
    name: 'test',
    description: 'test category'
}, (error, category) => {
    if(error){
        console.error(error)
    }else{
        console.log(category)
    }
})

Category.find({
    name: 'test'    //通过find直接查询name=‘test’的结果
    name: /^t/      //可以使用正则，对字符串类型支持模糊查询
}, (error, res) => {
    if(error){
        ...
    }else{
        ...
    }
})

Category.where('createdAt') //通过where方法对指定字段查询
    .lt(new Date())         //通过lt对where指定的字段继续限定查询条件
    .select('name, description')    //指定查询结果输出的字段
    .sort({createdAt: 1})   //指定排序规则
    .limit(10)              //限定查询10条数据
    .exec((err, res) => {}) //执行查询

Category.remove({       //删除操作
    name: 'test'
}).then(res => {})

Category.update({       //更新操作
    name: 'test'
}, {
    name: 'tesst1',
    description: 'test1'
}).then(res => {})
```

在进行数据操作之前需要打开数据库连接，由于是在HTTP接口中调用数据操作，所以为了避免频繁打开和关闭数据库连接，这里定义了中间件，在请求的开始和结束时分别调用建立连接和关闭连接的方法：

```js
app.use( async (ctx, next) => {
    await connect()     //处理请求前建立连接
    await next()        //处理请求
    await close()       //处理请求后关闭连接
})
```

## 在Koa中应用Redis数据库

Redis可用作数据库， 高速缓存和消息队列代理， Redis非常适合处理那些短时间内被高频访问但又不需要长期访问的简单数据存储，如用户的登录信息或游戏中的数据。


# 优化与部署

## 服务优化

在实际开发中，开发仅是整个开发流程的一小部分，当编写的程序运行在线上服务器时，可能会出现多种意想不到的问题。

### 使用log4js记录日志

在排查分析线上问题时，日志起着关键作用。

```js
const log4js = require('log4js')
const logger = log4js.getLogger()       //获取日志记录器，默认输出到console中
logger.level = 'debug'                  //设置日志输出级别
logger.debug('Some debug messages')     //记录debug级别的日志

const log4js = require('log4js')
log4js.configure({
    appenders: {
        cheese: {
            type: 'file',
            filename: 'cheese.log'
        }
    },
    categories: {
        default: {
            appenders: ['cheese'],
            level: 'error'  
        }
    }
})

const logger = log4js.getLogger('cheese')
logger.trace('Entering cheese testing')
logger.debug('Got cheese')
logger.info('Cheese is Gouda')
```

基础知识：
1. 日志分类： 一般可以分为访问日志和应用日志，访问日志一般记录客户端对应用的访问信息，例如，在HTTP服务中主要记录HTTP请求头中的重要数据。应用日志是开发者在应用中根据业务需要输出的调用跟踪， 警告和异常等信息， 方便开发人员查看项目的运行状态和分析， 排查Bug。应用日志包括debug， warn和error等不同级别。

    日志等级：
        1. trace： 记录应用调用的跟踪信息，级别最低
        2. debug： 记录调试信息，方便调试时使用
        3. info： 记录非调试和跟踪的信息，相对来说较重要的信息
        4. warn： 记录警告信息
        5. error： 记录错误信息， 这些错误不会导致整个服务完全不可用
        6. fatal： 记录严重错误信息，这些错误导致整个服务不可用


2. 日志切割： 记录的日志都会存储在 cheese.log文件中。随着应用的运行，这个文件 会越来越大。日益增大的文件给查看和跟踪问题带来了诸多不便 ， 同时，某些文件系统还 对单个文件存在大小限制。为了控制单个日志文件的体积， log4js 提供了 一些方法对日志进行 分割。本节将按照日期对日志文件进行分割。例如 ， 第 l 天将日志存储在 task-2018-04-0l.log 文件中，第 2 天将会存储在 task-2018-04-02.log 文件中。这样不仅方便开发人员按照日期排 查问题，还方便对日志文件进行迁移。

### 自定义错误页

Koa可以通过中间件来实现这一功能， 该中间件需要具备以下功能：

    1. 在页面响应400， 500等异常状态码时，引导用户跳转至错误提示页面
    2. 提供默认错误提示页面
    3. 允许用户自定义错误提示页面

1. 捕捉异常

```js
module.exports = () => {
    return async (ctx, next) => {
        try {
            await next()
            if(ctx.response.status === 404 && !ctx.response.body) ctx.throw(404)
        }catch (e) {
            //此处进行异常处理
        }
    }
}
```

注意： 要将该中间件放在“洋葱模型”的最外层。

```js
const miHttpError = require('./xxx')
module.exports = app => {
    app.use(miHttpError())
    //后面是其他中间件的注册代码
}
```

2. 异常处理逻辑

异常处理逻辑主要是针对HTTP错误码进行判断，并根据不同的错误情况渲染不同的文件：

```js
let fileName = 'other'
let status = parseInt(e.status)

const message = e.message

if(status >= 400){
    switch (status) {
        case 400:
        case 404:
        case 500:
            fileName = status
            break
        default:            //其他错误指定渲染other文件
            fileName = 'other'
    }
}
```

3. 渲染错误页面

采用了Nunjucks模板

```js
<head>
    <title>Error - {{status}}</title>
</head>
<body>
    <div id="error">
        <h1>Error - {{status}}</h1>
        <p>Looks like something broke!</p>
        {% if(env === 'development') %}
        <h2>Message:</h2>
        <pre>
            <code>
                {{error}}
            </code>
        </pre>
        <h2>Stack: </h2>
        <pre>
            <code>
                {{stack}}
            </code>
        </pre>
        {% endif %}
    </div>
</body>
```

为了便于维护，一般会将错误页面保存在同一个目录下，并在应用项目中维护这些错误页面，而错误页面的中间件一般单独发布到NPM上，以便在多个项目中复用。

有一个类似的中间件koa-error

