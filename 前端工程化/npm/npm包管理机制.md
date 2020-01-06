## package.json

在Node.js中， 模块是一个库或框架， 也是一个Node.js项目， Node.js项目遵循模块化的架构， 当我们创建了一个Node.js项目， 意味着创建了一个模块， 这个模块必须有一个描述文件， 就是`package.json`。

### 必备属性

package.json必须填写的属性只有： `name`和`version`， 这两个属性组成一个npm模块的唯一标识。

通过`npm view packagename`查看包是否被占用， 并可以查看它的一些基本信息。

关于package.json的一些信息可以[参考](/前端工程化/npm/关于package.json.md)

## 包版本管理机制

### 查看npm包版本

执行`npm view package version`查看某个`package`的最新版本

执行`npm view xxx versions`查看xxx在npm服务器上所有发布过的版本

执行`npm ls`查看当前仓库依赖树上所有包的版本信息

### SemVer规范

#### 标准版本

SemVer规范的标准版本号采用`x.y.z`的格式。
    - 主版本号（major）： 当你做了不兼容的API修改
    - 次版本号（minor）： 当你做了向下兼容的功能性新增
    - 修订号（patch）： 当你做了向下兼容的问题修正

#### 先行版本

当某个版本改动较大， 且非稳定可以先发布一个先行版本。

- 现象版本可以加到`主版本号.次版本号.修订号`的后面， 先加上一个连接号在加上一连串以句点分隔的标识符和版本编译信息。
    - 内部版本（alpha）
    - 公测版本（beta）
    - 正式版本的候选版本rc： 及Release candiate

#### 发布版本

在修改npm包某些功能后通常需要发布一个新版本， 通常做法是直接修改package.json到指定版本。 如果操作失误， 很容易造成版本号混乱， 可以借助符合Semver规范的命令来完成这一操作：
    - npm version patch： 升级修订版本号
    - npm version minor： 升级次版本号
    - npm version major： 升级主版本号

#### 锁定依赖版本

- lock文件

实际开发中， 经常会因为各种依赖不一致而产生奇怪的问题， 或者在某些场景下， 我们不希望依赖被更新， 建议在开发中使用`package-lock.json`

锁定依赖版本意味着我们不手动更新的情况下，每次安装依赖都会安装固定版本， 保证团队使用版本号一致的依赖。

- 定期更新依赖

使用`npm outdated`可以帮助我们列出哪些还没有升级到最新版本的依赖：
    - 黄色表示不符合我们制定的语义化版本范围-不需要升级
    - 红色表示符合执行的语义化版本范围-需要升级

执行`npm update`会升级所有的红色依赖。

## npm install 原理

![流程图](/img/npm下载流程.png)

执行`npm install`后， 依赖包被安装到了`node_modules`， 来具体了解下npm将依赖包安装到`node_modules`的具体机制。

考虑到包依赖嵌套太深的问题， `npm`在3.x版本将早起的嵌套结构改为扁平结构：
- 分析
    - 安装模块时， 不管是直接依赖还是子依赖的依赖， 优先将其安装在`node_modules`根目录
    - 当安装到相同模块时， 判断已安装的模块版本是否符合新模块的版本返回， 如果符合则跳过， 不符合则在当前模块的`node_modules`下安装该模块

- 模块查找流程：
  - 在当前模块路径下搜索
  - 在当前模块`node_modules`路径下搜索
  - 在上级模块的`node_modules`路径下搜索
  - ...

### lock文件

为了解决`npm install`的不确定性， 在npm 5.x版本新增了`package-lock.json`文件。

`package-lock.json`的作用是锁定依赖结构， 即只要你目录下有`package-lock.json`文件， 那么你每次执行`npm install`后生成的`node_modules`目录结构一定是完全相同的。



[参考](https://juejin.im/post/5df789066fb9a0161f30580c)