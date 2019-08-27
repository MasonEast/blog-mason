Express是在Connect的基础上，通过添加高层糖衣扩展和搭建出来的。

# Connect

## 创建Connect程序

```js
$ npm install connect@3.4.0

const app = require('connect')();
app.use((req, res, next) => { 3
      res.end('Hello, world!');
    });
app.listen(3000);
```

## 了解Connect中间件的工作机制

Connect中间件就是JS函数，这个函数一般会用三个参数： 请求对象，响应对象，以及一个名为next的回调函数。一个中间件完成自己的工作，要执行后续的中间件时，可以调用这个回调函数。

在中间件运行之前，Connect会用分派器接管请求对象，然后交给程序中的第一个中间件。

步骤解析：
Dispatch  ->  logger  ->  bodyParser  ->  static  ->  customMiddleware
分派器收到请求，把它传给第一个中间件   ->   记录请求日志，并用next（）传给下一个中间件    ->   如果有，请求头会被解析，并用next()传给下一个中间件     ->    如果请求的是静态文件，用那个文件做响应，不再调用next(),否则请求进入下一个中间件   ->   请求被一个定制的中间件处理好，响应结束。

## 组合中间件

Connect中的use方法就是用来组合中间件的。

使用多个Connect中间件：
```js
const connect = require('connect');
function logger(req, res, next) {
  console.log('%s %s', req.method, req.url);
  next(); 
}

function hello(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello world');
}   

connect()
  .use(logger)
  .use(hello)
  .listen(3000);

```
这两个中间件的名称签名不一样:一个有 next，一个没有。因为后面这个中间件完成了 HTTP 响应，再也不需要把控制权交还给分派器了。

## 中间件的顺序

## 创建可配置的中间件

为了做到可配置，中间件一般会遵循一个简单的惯例： 用一个函数返回另一个函数（闭包）。

```js
function setup(options){
  //设置逻辑，中间件的初始化

  return function(req, res, next){
    //中间件逻辑，即使被外部函数返回了，仍然可以访问options
  }
}
```

这种中间件的用法：
`app.use(setup({some: 'options'}))`

可配置的Connect中间件logger：

```js
function setup(format){   //setup函数可以用不同的配置调用多次
  const regexp = /:(\W+)/g  //logger组件用正则匹配请求属性

  return function createLogger(req, res, next) {  //logger组件
    const str = format.replace(regexp, (match, property) => {
      return req[property]
    })
    console.log(str)    //将日志条目输出到控制台
    next()    //将控制权交给下一个中间件组件
  }
}
module.exports = setup
```

# Express

## 生成程序框架

Express对程序结构不作要求，路由可以放在多个文件中，公共资源文件也可以放到任何目录下。

极简的Express程序：

```js

const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send('hello')
})

app.listen(3000)

```


## Express和程序配置

在线留言板程序的规划
下面是这个在线留言板程序的需求。
(1) 用户应该可以注册、登录、退出。
(2) 用户应该可以发消息(条目)。
(3) 站点的访问者可以分页浏览条目。
(4) 应该有个支持认证的简单的 REST API。 

针对这些需求，我们要存储数据和处理用户认证，还需要对用户的输入进行校验。必要的路由应该有以下两种。 
 API 路由：
   GET /api/entries: 获取条目列表。
   GET /api/entries/page:获取单页条目。 
   POST /api/entry:创建新的留言条目。
 Web UI 路由：
   GET /post:显示创建新条目的表单。 
   POST /post:提交新条目。
   GET /register:显示注册表单。
   POST /register:创建新的用户账号。
   GET /login:显示登录表单。
   POST /login:登录。
   GET /logout:退出。

这个布局跟大多数 Web 程序一样。

## 渲染视图

把数据传给视图，然后视图对数据进行转换，对web来说，通常是转换成html。

### 改变查找目录

`app.set('view', __dirname + '/views')`
这个配置项指明了Express查找视图的目录。

### 使用默认的模板引擎

```js
app.set('view engine', 'pug')
app.get('/', function(){
  res.render('index')
})

app.get('/feed', function(){
  res.render('rss.ejs')
})
```

### 视图缓存

在生产环境中， `view cache`是默认开启的，以防止后续的render()从硬盘中读取模板文件。因为模板文件中的内容会被放在内存中，所以性能会得到显著提升.

### 将数据传递给视图的方法

在express中，要给被渲染的视图传递数据有几种办法，其中最常用的就是将要传递的数据作为`res.render()`的参数，此外，还可以在路由处理器之前的中间件中设定一些变量，比如用`app.locals`传递程序层面的数据，用`res.locals`传递请求层面的数据。

## Express路由

### 注册新用户

1. 添加注册路由

```js
const register = require('./routes/register')

app.get('/register', register.form)
app.post('/register', register.submit)

exports.form = (req, res) => {
  res.render('register', {title: 'Register'})
}
```

2. 创建注册表单

3. 把反馈消息传达给用户

4. 如果要跨越请求传递消息，要用到会话存放临时的消息

```js
const express = require('express');
function message(req) {
  return (msg, type) => {
    type = type || 'info';
    let sess = req.session;
    sess.messages = sess.messages || [];
    sess.messages.push({ type: type, string: msg });
}; };

const session = require('express-session');
app.use(session({
  secret: 'secret',
  resave: false, saveUninitialized: true
}));
```

创建一个中间件，在每个请求上用res.session.messages上的内容组装出res.locals.messages，这样可以更高效的把消息输出到所有要渲染的模板上。

```js
//messages.js
module.exports = (req, res, next) => {
  res.message = message(req)
  res.error = msg => {
    return res.message(msg, 'error')
  }
  res.locals.messages = req.session.messages || []
  res.locals.removeMessages = () => {
    req.session.messages = []
  }
}

//app.js
const register = require('./routes/register');
const messages = require('./middleware/messages');
...
app.use(express.methodOverride());
app.use(express.cookieParser());
    app.use(session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true
   }));
app.use(messages);
...
```

5. 实现用户注册

用提交的数据创建用户

```js
const User = require('../models/user');
    ...
exports.submit = (req, res, next) => {
 


const data = req.body.user;
User.getByName(data.name, (err, user) => {    
    if (err) return next(err);  //   顺延传递数据库连接错误和其他错误
    // redis will default it
    if (user.id) {    //检查用户名 是否唯一
      res.error('Username already taken!');
      res.redirect('back');
    } else {
      user = new User({
        name: data.name,
        pass: data.pass
      });
      user.save((err) => {    //保存新 用户
        if (err) return next(err);
        req.session.uid = user.id;
        res.redirect('/');
      }); 
    }
  });
};

```

### 已注册用户登录

1. 登录认证

```js
const User = require('../models/user')

exports.submit = (req, res, next) => {
  const data = req.body.user
  User.authenticate(data.name, data.pass, (err, user) => {
    if(err) return next(err)
    if(user){
      req.session.uid = user.id   //认证存储uid
      res.redirect('/')
    }else{
      res.error('Sorry! error')
      res.redirect('back')
    }
  })
}
```

### 用户加载中间件

在做Web程序时，一般都需要从数据库中加载用户信息，通常会表示为js对象，为了使其与用户交互更简单，要保证这项数据可持续访问。可以用中间件为每个请求加载用户数据。

加载已登录用户数据的中间件：

```js

//user.js
const User = require('../models/user')

module.exports = (req, res, next) => {
  const uid = req.session.uid
  if(!uid) return next()
  User.get(uid, (err, user) => {
    if(err) return next(err)
    req.user = res.locals.user = user
    next()
  })
}

//app.js

const user = require('./middleware/user');
...
app.use(express.session());
app.use(express.static(__dirname + '/public'));
app.use(user);
app.use(messages);
app.use(app.router);
...
```

### 创建REST API

1. 设计API

在动手写代码之前最好先想清楚会涉及哪些路由，我们会在RESTful API的路径前加上/api，可以自定。

比如：
```js
app.get('/api/user/:id', api.user);
app.get('/api/entries/:page?', api.entries);
app.post('/api/entry', api.add);
```

2. 添加基本的认证

使用api.auth实现，app.use()方法接受路径参数，这在express中称为**挂载点**，不管是什么HTTP谓词，只要请求的路径以挂载点开头，就会触发这个中间件。

```js
//auth
npm install --save basic-auth

const auth = require('basic-auth');
const express = require('express');
const User = require('../models/user');

exports.auth = (req, res, next) => {
  const { name, pass } = auth(req);
  User.authenticate(name, pass, (err, user) => {
    if (user) req.remoteUser = user;
    next(err);
  });
};

//使用
const api = require('./routes/api')

app.use('/api', api.auth)
app.use(user)
```

3. 实现路由

```js
exports.user = (req, res, next) => {
  User.get(req.params.id, (err, user) => {
    if (err) return next(err);
    if (!user.id) return res.sendStatus(404);
    res.json(user);
  }); 
};

//app.js

app.get('/api/user/:id', api.user)
```

4. 实现分页中间件

```js
module.exports = (cb, perpage) => {
  perpage = perpage || 10
  return (req, res, next) => {
    let page = Math.max(
      parseInt(req.params.page || '1', 10),
      1
    ) - 1;
    cb((err, total) => {
      if(err) return next(err)
      req.page = res.locals.page = {
        number: page,
        perpage: perpage,
        from: page * perpage,
        to: page * perpage + perpage - 1,
        total: total,
        count: Math.ceil(total / perpage)
      }
      next()
    })
  }
}
```

5. 启用内容协商

HTTP 通过 Accept 请求头域提供了内容协商机制。比如说，某个客户端可能更喜欢 HTML， 但也可以接受普通文本，则可以这样设定请求头:
`Accept: text/plain; q=0.5, text/html`

qvalue 或 quality value(例子中的 q=0.5)表明即便 text/html 放在了第二个，它的优先 级也要比 text/plain 高 50%。Express 会解析这个信息并提供一个规范化的 req.accepted 数组:
    [{ value: 'text/html', quality: 1 },
     { value: 'text/plain', quality: 0.5 }]

实现内容协商：

```js
exports.entries = (req, res, next) => {
  const page = req.page
  Entry.getRange(page.from, page.to, (err, entries) => {
    if(err) return next(err)
    res.format({
      'application/json': () => {
        res.send(entries)
      },
      'application/xml': () => {
        res.write('<entries>\n');
        entries.forEach( entry => {
          res.write(```
            <entry>
              <title>${entry.title}</title>
              <body>${entry.body}</body>
              <username>${entry.username}</username>
            </entry>
          ```)
        })
        res.end('</entries>')
      }
    })
  })
}
```



