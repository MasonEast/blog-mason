# 开始一个新的Node项目

## Node模块化
Node 查找文件的顺序是先找核心 模块，然后是当前目录，最后是 node_modules。

Node不允许重写 exports：
为了让前面那个模块的代码能用，需要把 exports 换成 module.exports。用 module. exports 可以对外提供单个变量、函数或者对象。如果你创建了一个既有 exports 又有 module.exports 的模块，那它会返回 module.exports，而 exports 会被忽略。

`exports.myFunc `只是 `module.exports. myFunc` 的简写。

所以，如果把 exports 设定为别的，就打破了 module.exports 和 exports 之间的引用 关系。可是因为真正导出的是 module.exports，那样 exports 就不能用了，因为它不再指向 module.exports 了。如果你想保留那个链接，可以像下面这样让 module.exports 再次引用 exports:
     module.exports = exports = Currency;
根据需要使用 exports 或 module.exports 可以将功能组织成模块，规避掉程序脚本 一直增长所产生的弊端。

## 使用异步编程技术

在Node的世界里流行两种响应逻辑管理方式： 回调和事件监听。

**回调**通常用来定义一次性响应的逻辑，比如数据库查询，可以指定一个回调函数来确定如何处理查询结果。

**事件监听**本质上也是一个回调，不同的是，它跟事件相关联，比如点击事件。

### 用回调处理一次性事件

```js
const http = require('http');
const fs = require('fs');
http.createServer((req, res) => {
  getTitles(res);
}).listen(8000, '127.0.0.1');

function getTitles(res) {
  fs.readFile('./titles.json', (err, data) => {
      if (err) return hadError(err, res);
      getTemplate(JSON.parse(data.toString()), res);
    }); 
}

function getTemplate(titles, res) {
  fs.readFile('./template.html', (err, data) => {
    if (err) return hadError(err, res);     //在这里不再创建一个 else 分 支，而是直接 return，因为 如果出错的话，也没必要继续 执行这个函数了
    formatHtml(titles, data.toString(), res);
  });
}

function formatHtml(titles, tmpl, res) {
  const html = tmpl.replace('%', titles.join('</li><li>'));
  res.writeHead(200, { 'Content-Type': 'text/html'});
  res.end(html);
}

function hadError(err, res) {
  console.error(err);
  res.end('Server Error');
}
```

Node 的异步回调惯例
Node 中的大多数内置模块在使用回调时都会带两个参数:第一个用来放可能会发生的错
误，第二个用来放结果。错误参数经常缩写为 err。 下面这个是常用的函数签名的典型示例:
```js
const fs = require('fs');
fs.readFile('./titles.json', (err, data) => {
  if (err) throw err;
// 如果没有错误发生，则对数据进行处理 
});
```

### 用事件发射器处理重复性事件

#### 用on方法响应事件
实现了一个 echo 服务器。当有客户端连接上来时，它就会创建一个 socket。 socket 是一个事件发射器，可以用 on 方法添加监听器响应 data 事件。只要 socket 上有新数据 过来，就会发出这些 data 事件。
```js
const net = require('net')
const server = net.createServer(socket => {
  socket.on('data', data => {
    socket.write(data)
  })
})
server.listen(8888)
```

#### 用once方法响应只应该发生一次的事件

#### 创建事件发射器

```js
const EventEmitter = require('events').EventEmitter;
const channel = new EventEmitter();
channel.on('join', () => {
  console.log('Welcome!');
});

channel.emit('join')
```

用事件发射器实现简单的发布/预定系统:

```js
const events = require('events');
const net = require('net');
const channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on('join', function(id, client) {  //添加 join 事件的监听器，保 存用户的 client 对象，以便 程序可以将数据发送给用户
  this.clients[id] = client;
  this.subscriptions[id] = (senderId, message) => {
    if (id != senderId) {   //忽略发出这一广播 数据的用户
      this.clients[id].write(message);
    } 
  };
  this.on('broadcast', this.subscriptions[id]); //添加一个专门针对当前 用户的 broadcast 事件 监听器
});

const server = net.createServer(client => {
  const id = `${client.remoteAddress}:${client.remotePort}`;
  channel.emit('join', id, client);   //当有用户连到服务器上时发出 一个 join 事件，指明用户 ID 和 client 对象

  client.on('data', data => {
  data = data.toString();

  channel.emit('broadcast', id, data);   //当有用户发送数据时，发出一个频道 broadcast 事件，
  }); 
}); 

server.listen(8888);
```
把聊天服务器跑起来后，打开一个新的命令行窗口，并在其中输入下面的命令进入聊天程序:
`telnet 127.0.0.1 8888`

这个聊天服务器还有一个问题，在用户关闭连接离开聊天室后，原来那个监听器还在，仍会 尝试向已经断开的连接写数据。这样自然就会出错：

创建一个在用户断开连接时能“打扫战场”的监听器

```js
channel.on('leave', function(id) {    //创建 leave 事件 的监听器
  channel.removeListener(
    'broadcast', this.subscriptions[id]
  );
  channel.emit('broadcast', id, `${id} has left the chatroom.\n`);
 });  //移除指定客户端的 broadcast 监听器

const server = net.createServer(client => {
  client.on('close', () => {
    channel.emit('leave', id);   //  在用户断开连接时 发出 leave 事件

  });
 });
server.listen(8888);
```

### 异步逻辑顺序化

在异步程序的执行过程中，有些任务可能会随时发生，跟程序中的其他部分在做什么没有关系，什么时候做这些任务都不会出问题，但有些任务只能在某些特定的任务之前或之后做。

让一组异步任务顺序执行的概念就是**流程控制**，这种控制分为： 串行和并行

在实现串行流程控制时，需要跟踪当前执行的任务，或维护一个尚未执行任务的队列。实现并行化流程控制时需要跟踪有多少个任务要执行完成了。

#### 使用串行流程控制

使用async实现串行化控制

```js
const async = require('async');
async.series([
  callback => {
    setTimeout(() => {
      console.log('I execute first.');
      callback();
    }, 1000);
  },
  callback => {
    setTimeout(() => {
      console.log('I execute next.');
      callback();
  }, 500); },
  callback => {
    setTimeout(() => {
      console.log('I execute last.');
      callback();
    }, 100);
  } 
]);
```

#### 实现串行化流程控制

为了用串行流程控制让几个异步任务顺序执行，需要先把这些任务按预期的执行顺序放到一个数组中，这个数组将起到**队列**的作用： 完成一个任务后按顺序从数组中取出下一个。

```js
const tasks = [   //  把所有要做的任务按执行 顺序添加到一个数组中
  checkForRSSFile,
  readRSSFile,
  downloadRSSFeed,
  parseRSSFeed
];
function next(err, result) {    // 负责执行任务 的 next 函数, 每个函数都调用以下next函数
  if (err) throw err;     //如果任务出错，则抛出异常
  const currentTask = tasks.shift();  //从任务数组中取出下个任务
  if (currentTask) {
    currentTask(result);    // 执行当前任务
 
  }
}

next() //开始任务的 串行化执行
```

#### 实现并行化流程控制

为了让异步任务并行执行，仍然是要把任务放到数组中，但任务的存放顺序无关紧要，每个任务都应该调用处理器函数增加已完成任务的计数值。当所有任务都完成后，处理函数应该执行后续的逻辑。

```js
const fs = require('fs');
const tasks = [];
const wordCounts = {};
const filesDir = './text';
let completedTasks = 0;
function checkIfComplete() {
  completedTasks++;
  if (completedTasks === tasks.length) {
    for (let index in wordCounts) {   //当所有任务全部完成后，列出 文件中用到的每个单词以及 用了多少次
console.log(`${index}: ${wordCounts[index]}`);
    } 
  }
}

function addWordCount(word) {
  wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1;
}

function countWordsInText(text) {
  const words = text
    .toString()
    .toLowerCase()
    .split(/\W+/)
    .sort();
  words
    .filter(word => word)
    .forEach(word => addWordCount(word));
}

fs.readdir(filesDir, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    const task = (file => {
      return () => {
        fs.readFile(file, (err, text) => {
          if (err) throw err;
          countWordsInText(text);
          checkIfComplete();
        });
      };
    })(`${filesDir}/${file}`);
    tasks.push(task);   //把所有任务都添加到函数调用数组中
}
  tasks.forEach(task => task());  //开始并行执行任务
});
```