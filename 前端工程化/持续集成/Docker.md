

## 环境配置难题

环境配置如此麻烦，换一台机器，就要重来一次，旷日费时。很多人想到，能不能从根本上解决问题，软件可以带环境安装？也就是说，安装的时候，把原始环境一模一样地复制过来。

## 虚拟机

虚拟机就是带环境安装的一种解决方案， 它可以在一种操作系统里面运行另一种操作系统， 比如在Windows系统里面运行Linux系统， 应用程序对此毫无感知， 因为虚拟机看上去跟真实系统一模一样， 而对于底层系统来说， 虚拟机就是一个普通文件， 不需要了就删掉， 对其他部分毫无影响。

### 虚拟机的缺点

- 资源占用多
- 冗余步骤多
- 启动慢

## Linux容器

Linux发展出了另一种虚拟化技术： Linux容器（LXC， Linux Container）

Linux容器不是模拟一个完整的操作系统， 而是对进程进行隔离。 或者说， 在正常进程外面套一个保护层。对于容器里面的进程来说， 它接触到的各种资源都是虚拟的， 从而实现与底层系统的隔离。

### 容器优势

- 启动快
- 资源占用少
- 体积小

容器有点像轻量级的虚拟机， 能够提供虚拟化的环境， 但是成本开销小的多。

## Docker

Docker是一个开源的应用容器引擎，让开发者可以打包他们的应用及依赖包到一个可移植的容器中，然后发布到Linux，也可以实现虚拟化，容器是完全使用沙箱机制，相互之间不会有任何借口。

一个完整的Docker组成部分：
    1. DockerClient客户端
    2. Docker Daemon守护进程
    3. Docker Image镜像
    4. DockerContainer容器

## Docker架构

Docker使用客户端-服务器（C/S)架构模式，使用远程API来管理和创建Docker容器，Docker容器通过Docker镜像来创建，容器与镜像的关系类似于面向对象编程中的对象和类。

Docker daemon作为服务端接受来自客户的请求，并处理这些请求（创建， 运行， 分发容器）。客户端和服务端既可以运行在一个机器上，也可以通过socket或者RESTful API来进行通信。

Docker的典型场景：
    使应用的打包和部署自动化
    创建轻量， 私密的PAAS环境
    实现自动化测试和持续的集成/部署
    部署与扩展webapp， 数据库和后台服务


Docker在本质上是一个附加系统。使用文件系统的不同层构建一个应用是有可能的。每个组件被添加到之前已经创建组件之上，可以作为一个文件系统更加明智。

### Docker主要用途

- 提供一次性的环境。 比如本地测试他人的软件， 持续集成的时候提供单元测试和构建的环境
- 提供弹性的云服务。 因为Docker容器可以随开随关， 很适合动态扩容和缩容。
- 组建微服务架构。 通过多个容器， 一台机器可以跑多个服务， 因此在本机就可以模拟出微服务架构。

### image文件

**Docker把应用程序及其依赖， 打包在image文件里面**。 只有通过这个文件， 才能生成Docker容器。image文件可以看作是容器的模板。 Docker根据image文件生成容器的实例。 同一个image文件， 可以生成多个同时运行的容器实例。

image是二进制文件。 实际开发中， 一个image文件往往通过继承另一个image文件， 加上一些个性化设置而生成。 

### 容器文件

image文件生成的容器实例， 本身也是一个文件， 称为容器文件。 也就是说， 一旦容器生成， 就会同时存在两个文件： image文件和容器文件。 


## 制作自己的Docker容器

1. 编写Dockerfile文件

在项目的根目录下， 新建一个文本文件.dockerignore和文本文件Dockerfile

```js
//.dockerignore
.git
node_modules
npm-debug.log

//Dockerfile
FROM node:8.4    //该 image 文件继承官方的 node image，冒号表示标签，这里标签是8.4，即8.4版本的 node。   
COPY . /app     //将当前目录下的所有文件（除了.dockerignore排除的路径），都拷贝进入 image 文件的/app目录。
WORKDIR /app    //指定接下来的工作路径为/app。
RUN npm install --registry=https://registry.npm.taobao.org      //在/app目录下，运行npm install命令安装依赖。注意，安装后所有的依赖，都将打包进入 image 文件。
EXPOSE 3000        //将容器 3000 端口暴露出来， 允许外部连接这个端口。
CMD node demos/01.js  //容器启动以后，这个命令就已经执行了，不用再手动输入
```

2. 创建image文件

有了Dockerfile文件， 就可以使用`docker image build`命令创建image文件了。

```js
docker image build -t koa-demo .        //-t参数用来指定image文件的名字
or
docker image build -t koa-demo:0.0.1 .
```

3. 生成容器

``` bash
$ docker container run -p 8000:3000 -it koa-demo /bin/bash

-p参数：容器的 3000 端口映射到本机的 8000 端口。
-it参数：容器的 Shell 映射到当前的 Shell，然后你在本机窗口输入的命令，就会传入容器。
koa-demo:0.0.1：image 文件的名字（如果有标签，还需要提供标签，默认是 latest 标签）。
/bin/bash：容器启动以后，内部第一个执行的命令。这里是启动 Bash，保证用户可以使用 Shell。
```

顺利的话，就会进入容器中， 此时就可以运行项目了。

这个例子中， Node进程运行在Docker容器的虚拟环境里面， 进程接触到的文件系统和网络接口都是虚拟的， 与本机的文件系统和网络接口是隔离的， 因此需要定义容器与物理机的端口映射。


常用命令：

``` bash
# 列出本机正在运行的容器
docker container ls

# 列出本机所有容器， 包括终止运行的容器
docker container ls --all

# 新建容器并运行
docker container run

# 启动已经生成， 已经停止运行的容器文件
docker container start

# 查看容器输出

docker container log 【containerID】

# 进入一个正在运行的docker容器
如果docker run命令运行容器的时候，没有使用-it参数，就要用这个命令进入容器。一旦进入了容器，就可以在容器的 Shell 执行命令了。
docker container exec -it 【containerID】 /bin/bash

# 修改容器时区
echo  'Asia/Shanghai' > /etc/timezone

# 关闭容器
docker container kill

# 移除容器
docker container rm 【containerID】

# 也可以使用`docker container run`命令的--rm参数， 在容器终止运行后自动删除容器文件

$ docker container run --rm -p 8000:3000 -it koa-demo /bin/bash

# -dit的含义
后台启动应用， 不用占shell

# -v的含义
docker run -it -v /test:/soft centos /bin/bash

这样在容器启动后，容器内会自动创建/soft的目录。通过这种方式，我们可以明确一点，即-v参数中，冒号":"前面的目录是宿主机目录，后面的目录是容器内目录。
```

## 在docker中配置jenkins实现自动打包， 部署

```bash
docker run --rm -u root -p 8000:8080  -v jenkins-data:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock -v "$HOME":/home jenkinsci/blueocean
```

配置-dit： 后台启动应用， 不用占shell

映射容器的8080端口到本地的8000端口；

如果遇到`node not found`:

进入docker： 

``` bash
docker container exec -it 1769dbd67b09 /bin/bash

apk add --no-cache nodejs   # 自己手动安装nodejs
```

jenkins配置：

安装插件： 

publish over ssh用于连接远程服务器  

Deploy to container插件用于把打包的应用发布到远程服务器

NodeJS plugin

----

系统设置：

配置远程服务器ssh： 配置host， password， remote directory等

新建项目：

自由构建 -》源码管理选择git -> 构建触发器（定时构建， 轮询SCM： 设置时间， 轮询github仓库代码变化即执行构建部署） -> 构建环境（Node） -> 构建执行shell

``` bash
cd /var/jenkins_home/workspace/mason-test #进入Jenkins工作空间下项目目录
node -v #检测node版本（此条命令非必要）
npm -v #检测npm版本（此条命令非必要）

cnpm install #安装项目中的依赖

npm run build #打包

tar -zcvf build.tar.gz build/  #压缩，方便传输，我这里打包的文件名是build

```

-> 构建后操作：

Source files     项目构建后的目录

Remove prefix    去前缀

Remote directoty 发布的目录

Exec command     发布完执行的命令

``` bash
cd /root/dreamONE
tar -zxvf build.tar.gz
rm -rf build.tar.gz
```