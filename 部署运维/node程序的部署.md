# 安置Node 程序

基于Node的HTTP服务器的Web程序，浏览器不需要通过Apache或Nginx这样的专用HTTP服务器跟程序通话，但也可以在应用程序之前放一个Nginx这样的服务器，所以Node程序基本上可以放在之前你放置Web服务器的所有地方。

  有三种可靠且可扩展的方式运行Node程序：
    1. 平台即服务
    2. 服务器或虚拟主机
    3. 容器： 比如Docker

## 平台即服务

有了平台即服务（PaaS），程序部署的准备工作基本上就是注册个账号，创建新程序，然后给项目添加一个远程Git地址，把程序推送到那个地址就部署好了。

## 服务器

因为有些东西是PaaS无法提供的，所以我们只能用自己的服务器。不用担心在哪里运行数据库，只要你愿意，可以把PostgreSQL， MySQL，甚至是Redis装在同一台服务器上。你想在服务器上装什么就装什么： 定制的日志软件， HTTP服务器， 缓存层等等。

需要决定：
  1. 用什么操作系统
  2. 如何向外界开放对程序的访问： 可以将访问流从80和443端口转发给你的程序，也可以在前面部署Nginx做代理，同时让它处理静态文件。

## 容器

软件容器可以看作是将程序的部署自动化的OS虚拟化技术。Docker是其中最著名的项目。

Docker允许将程序定义为映像。比如要搭建一个典型的由图片处理微服务，存储程序数据的主服务和后端数据库组成的内容管理系统，可以分成四个独立的Docker映像来部署：
  映像1： 对上传到CMS中的图片进行缩放的微服务
  映像2： PostgreSQL
  映像3： 带管理界面的CMS程序主体
  映像4： 面向公众的前端Web程序

在将程序容器化之后，用一条命令就可以带起一个新鲜的实例，这是使用容器的奇妙之处。

用Docker运行Node程序的例子：

示例：https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

要用Docker运行Node程序，先要做好下面这几件事：
  1. 安装Docker
  2. 创建一个Node程序
  3. 在项目中添加文件Dockerfile

这个Dockfile会告诉Docker如何创建程序的映像，以及如何安装这个程序并运行它。

在官方的 Node Docker 映像中，Dockerfile 指定了 FROM node:boron，然后用 RUN 和 CMD 指令运行 npm install 及 npm start。完整的代码如下所示：

```js
FROM node:argon

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
EXPOSE 3000
CMD ["npm", "start"]
```

创建好Dockerfile之后，可以在命令行中运行`docker build`构建程序的映像。只需要指定构建的目录，比如在根目录中，运行`docker build`就会创建它的映像并发送给Docker后台。

`docker images`是查看映像列表的命令
`docker run -p 8080:3000 -d <image ID>`是根据映像ID运行指定程序的命令。其中`-p 8080:3000`是指将内部端口3000绑定到本机上的8080端口，所以要用http://localhost:8080访问这个程序。

# 部署的基础知识

对于只是想要展示一下的Web程序，或者要在部署到生产环境之前测试一下的商业程序，可能会先简单部署一下，而那些让在线时长和性能最大化的工作要往后放。临时性部署不会做跨越重启的持久化工作，但配置起来简单快速。

## 从Git库部署

1. 用SSH连接到服务器
2. 如果需要的话，在服务器上安装Node和版本控制工具（比如Git）
3. 从版本库中将程序文件，包括Node脚本，图片，css样式表等，下载到服务器上
4. 启动程序

跟PHP一样，Node部署作为后台任务运行的。所以说，如果我们按前面列出的基本步骤部署，SSH连接关闭后程序就退出了，不过只需要一个简单的工具就可解决这个问题。

**自动化部署**： Node程序的部署可以实现自动化，比容我们可以用Fleet这样的工具，通过git push将程序部署到一到多台服务器上。

## 保证Node不掉线

部署好后，你肯定不想自己断开SSH连接它就掉线了。

Nodejitsu的Forever是解决这个问题最常用的工具。用`Forver`启动后，它会监测程序，崩溃后悔重启程序。

全局安装Forever有时需要用到sudo命令。

```js
npm install -g forever

forever start server.js

forever stop server.js

forever list

forever -w start server.js  //源码发生变化自动重启程序
```

## 在线时长和性能的最大化

除了把所有的 CPU 内核都用上，在高容量生产站点上还应该避免用 Node 提供静态文件。 Node 擅长运行交互式程序，比如 Web 程序和 TCP/IP 协议，在静态文件上，它不如那些专用的软 件效率高。应该用 Nginx 之类的技术来处理静态文件，它是专门做这个的。另外也可以把所有静 态文件都放到内容交付网络上(CDN)，比如 Amazon S3，然后在程序中指向这些文件。

### 用Upstart保证在线时长

在macOS上可以创建launchd文件（npm上的node-launchd可以做这个），装好Upstart之后，需要给每个程序添加一个Upstart配置文件，这些文件应该放在 /etc/init 目录中，名称类似于 my_application_name.conf。无须给配置文件分配可执行权限。

典型的Upstart配置文件

```js
author  "Robert DeGrimston" 
description "hellonode"

setuid "nonrootuser"    //以用户 nonrootuser 的身份运行程序
时关停 
start on (local-filesystems and net-device-up IFACE=eth0)  //在服务器启动时，等 文件系统和网络准 备好之后运行程序
stop on shutdown   //在程序 崩溃后 重新启 动它

respawn
console log   //将 stdin 和 stderr 写入 /var/log/ upstart/yourapp.log
env NODE_ENV=production   //设定程序所需的所有环境变量

exec /usr/bin/node /path/to/server.js   //执行程序的命令
```

Upstart会依照这个配置文件保证你的程序在服务器重启，甚至是意外崩溃后运行。程序的所有输出都会放在/var/log/upstart/hellonode.log 里。Upstart还会帮你管理日志的轮转。

创建好配置文件，可以用下面这条命令启动程序：

`sudo service hellonode`

Upstart 的可配置化程度很高。请参考它的在线文档了解其配置项。

## 集群API： 充分利用多核处理器

Node进程是在单核上运行的。如果想让Node程序最大限度的调用服务器的资源，可以在
不同的TCP/IP端口上开启多个程序实例，然后通过负载平衡将Web流量分发到这些实例上。

Node的集群API可以让单个程序利用多核处理器：

```js
const cluster = require('cluster')
const http = require('http')
const numCPUs = require('os').cpus().length  //确定服务器的内核数量

if(cluster.isMaster){
  for (let i = 0; i < numCPUs; i++){  //给每个核创建一个分叉
    cluster.fork()
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log('Worker %s died.', worker.process.pid)
  })
}else{
  http.Server((req, res) => {   //定义每个工作进程的工作
    res.writeHead(200)
    res.end('running in ' + process.id)
  }).listen(8000)
}
```

因为主进程和各个工作进程都是各自独立的系统进程，所以如果它们分别运行在各自独立的系统进程，所以如果它们分别运行在各自的内核上，是无法通过全局变量共享状态的。但集群API没有提供让主进程跟工作进程通信的办法。

```js
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const workers = {};
let requests = 0;
if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    workers[i] = cluster.fork();
    ((i) => {
      workers[i].on('message', (message) => {   //监听来自工作 进程的消息
        if (message.cmd == 'incrementRequestTotal') {
          requests++;     //  增加总 请求数
          for (var j = 0; j < numCPUs; j++) {
            workers[j].send({   //将新的总请求数发 给所有工作进程
              cmd: 'updateOfRequestTotal',
              requests: requests
            }); 
          }
        }  
      });
    })(i); 
  }      //用闭包保留当前工 作进程的索引

  cluster.on('exit', (worker, code, signal) => {
    console.log('Worker %s died.', worker.process.pid);
  });
} else {
    process.on('message', (message) => {    //监听来自主进程的消息
      if (message.cmd === 'updateOfRequestTotal') {
        requests = message.requests;  //根据主进程的消息更新请求数
      }
    });
http.Server((req, res) => {
  res.writeHead(200)
  res.end(`Worker ${process.pid}: ${requests} requests.`)
  process.send({cmd: 'incrementRequestTotal'})  //让主进程知道该增加总请求数了
}).listen(8000)
```

通过Node集群API使用多核处理器是种简单易行的方法

## 静态文件及代理

开源的Nginx是专门提供静态文件服务的，跟Node搭配起来也很容易配置。跟 Node 搭配起来也很容易配置。一般在 Nginx/ Node 的搭配中，**所有请求最初都是到 Nginx**那里，然后再由它将非静态文件的请求发给 Node。



# 部署

## Node.js进程管理器PM2

进程管理器用于对应用状态进行管理，可以启动，暂停，重启或删除应用进程，也可以对进程进行监控。

一般情况下应用都需要一个进程管理器来守护运行的进程。Node.js进程会因为各种意外崩溃，而守护进程会立即重启该进程，保证服务的可用性。

全局安装PM2： `npm i pm2@lastst -g`

通过start命令可以启动守护和监控应用： `pm2 start app.js`


在一些复杂的环境配置需求中，可以使用独立的YAML或JSON格式的配置文件:

```js
{
    "apps": [{
        "script": "./app.js",               //需要执行的脚本
        "instances": -1,                    //启动的实例数量
        "exec_mode": "cluster",             //执行模式为cluster
        "watch": true,                      //热重启
            "env": {                        //环境变量
                "NODE_ENV": "prod"
            }
    }]
}
```

Node.js是一个单进程异步模型，不能很好的利用CPU资源，cluster模式可以让Node.js开发的Web服务动态分配请求给多个CPU内核，从而提升服务性能，这里配置为-1， 意味着会启动CPU的所有核数量减1的cluster。
    注意： 在cluster模式下，由于多个进程运行相同的代码，可能会存在多个进程同时操作同一文件和数据库的情况，进而引起**文件锁**或**数据库锁**


## 应用容器引擎Docker

Docker是一个更适合“云”时代的开发部署方式。传统的部署中都需要对宿主机进行大量的环境配置，有时候需要开发人员和运维人员配合才能完成部署；而在Docker部署中，开发人员可以直接打包一个Docker环境的镜像，所有的配置都在镜像中完成； 运维人员只需将镜像加载到Docker中即可、 通过容器， 还可以隔离不同容器中的应用环境， 从而能在宿主机中运行大量应用，而这些应用不会相互影响。


## 服务监控

### Node.js服务性能指标及采集

服务的性能一般分为两部分： **服务的吞吐量和服务对资源的占用量**

服务器的资源主要包括CPU， 内存， 磁盘， 网络等。其中CPU和内存的信息可以直接通过process对象来获取：

```js
let previousCpuUsage = process.cpuUsage()
let previousHrTime = process.hrtime()
setInterval(() => {
    const const currentCpuUsage = process.cpuUsage(previousCpuUsage)
    const currentHrTime = process.hrtime(previousHrTime)
    const duration = currentHrTime[0]* 1e6 + currentHrTime[1]
    previousTime = currentHrTime
    previousCpuUsage = currentCpuUsage
    const cpuPercent = {
        user: currentCpuUsage.user / duration       //CPU用户资源占比
        system: currentCpuUsage.system / duration   //CPU系统资源占比
    }
    console.log(cpuPercent)
}, 1000)
