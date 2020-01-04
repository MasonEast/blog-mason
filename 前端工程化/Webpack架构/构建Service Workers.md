
## 构建离线应用

离线应用是指通过离线缓存技术，让资源在第一次被加载后缓存在本地，下次访问它时直接返回本地的文件，就算没有网络连接。

离线应用有以下优点：
1. 在没有网络的情况下也能打开网页
2. 由于部分被缓存的资源直接从本地加载，对用户来说可以加速网页加载速度，对网站运营者来说可以减少服务器压力及传输流量费用

### 认识Service Workers

Service Workers是一个在浏览器后台运行的脚本，它生命周期完全独立于网页，它无法直接访问DOM，但可以通过`postMessage`接口发送消息和UI进程通信。拦截网络请求是Service Workers的一个重要功能，通过它能完成离线缓存，编辑响应，过滤响应等功能。

判断浏览器是否支持Service Workers：
```js
// 如果 navigator 对象上存在 serviceWorker 对象，就表示支持
if (navigator.serviceWorker) {
  // 通过 navigator.serviceWorker 使用
}
```

### 注册Service Workers

```js
if (navigator.serviceWorker) {
  window.addEventListener('DOMContentLoaded',function() {
    // 调用 serviceWorker.register 注册，参数 /sw.js 为脚本文件所在的 URL 路径
      navigator.serviceWorker.register('/sw.js');
  });
}
```

### 使用Service Workers实现离线缓存
Service Workers 在注册成功后会在其生命周期中派发出一些事件，通过监听对应的事件在特点的时间节点上做一些事情。

在 Service Workers 脚本中，引入了新的关键字 self 代表当前的 Service Workers 实例。

在 Service Workers 安装成功后会派发出 install 事件，需要在这个事件中执行缓存资源的逻辑，实现代码如下：

```js
// 当前缓存版本的唯一标识符，用当前时间代替
var cacheKey = new Date().toISOString();

// 需要被缓存的文件的 URL 列表
var cacheFileList = [
  '/index.html',
  '/app.js',
  '/app.css'
];

// 监听 install 事件
self.addEventListener('install', function (event) {
  // 等待所有资源缓存完成时，才可以进行下一步
  event.waitUntil(
    caches.open(cacheKey).then(function (cache) {
      // 要缓存的文件 URL 列表
      return cache.addAll(cacheFileList);
    })
  );
});
```

接下来需要监听网络请求事件去拦截请求，复用缓存：
```js
self.addEventListener('fetch', function(event) {
  event.respondWith(
    // 去缓存中查询对应的请求
    caches.match(event.request).then(function(response) {
        // 如果命中本地缓存，就直接返回本地的资源
        if (response) {
          return response;
        }
        // 否则就去用 fetch 下载资源
        return fetch(event.request);
      }
    )
  );
});
```

### 更新缓存

浏览器针对 Service Workers 有如下机制：

1. 每次打开接入了 Service Workers 的网页时，浏览器都会去重新下载 Service Workers 脚本文件（所以要注意该脚本文件不能太大），如果发现和当前已经注册过的文件存在字节差异，就将其视为“新服务工作线程”。
2. 新 Service Workers 线程将会启动，且将会触发其 install 事件。
3. 当网站上当前打开的页面关闭时，旧 Service Workers 线程将会被终止，新 Service Workers 线程将会取得控制权。
4. 新 Service Workers 线程取得控制权后，将会触发其 activate 事件。

新 Service Workers 线程中的 activate 事件就是最佳的清理旧缓存的时间点，代码如下：
```js
// 当前缓存白名单，在新脚本的 install 事件里将使用白名单里的 key 
var cacheWhitelist = [cacheKey];

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // 不在白名单的缓存全部清理掉
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // 删除缓存
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### 完整版

```js
// 当前缓存版本的唯一标识符，用当前时间代替
var cacheKey = new Date().toISOString();

// 当前缓存白名单，在新脚本的 install 事件里将使用白名单里的 key
var cacheWhitelist = [cacheKey];

// 需要被缓存的文件的 URL 列表
var cacheFileList = [
  '/index.html',
  'app.js',
  'app.css'
];

// 监听 install 事件
self.addEventListener('install', function (event) {
  // 等待所有资源缓存完成时，才可以进行下一步
  event.waitUntil(
    caches.open(cacheKey).then(function (cache) {
      // 要缓存的文件 URL 列表
      return cache.addAll(cacheFileList);
    })
  );
});

// 拦截网络请求
self.addEventListener('fetch', function (event) {
  event.respondWith(
    // 去缓存中查询对应的请求
    caches.match(event.request).then(function (response) {
        // 如果命中本地缓存，就直接返回本地的资源
        if (response) {
          return response;
        }
        // 否则就去用 fetch 下载资源
        return fetch(event.request);
      }
    )
  );
});

// 新 Service Workers 线程取得控制权后，将会触发其 activate 事件
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          // 不在白名单的缓存全部清理掉
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // 删除缓存
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### 接入Webpack

用Webpack构建接入Service Workers的离线应用要解决的关键问题在于如何生成上面的sw.js，并且sw.js文件中的cacheFileList变量，代表需要被缓存文件的URL列表，需要根据输出文件列表所对应的URL来决定，而不是写成静态值

假如构建输出的文件目录结构为：

├── app_4c3e186f.js
├── app_7cc98ad0.css
└── index.html
那么 sw.js 文件中 cacheFileList 的值应该是：

```js
var cacheFileList = [
  '/index.html',
  'app_4c3e186f.js',
  'app_7cc98ad0.css'
];
```

社区有个插件`serviceworker-webpack-plugin`可以方便的解决以上问题：
```js
npm i -D serviceworker-webpack-plugin webpack-dev-server

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { WebPlugin } = require('web-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

module.exports = {
  entry: {
    app: './main.js'// Chunk app 的 JS 执行入口文件
  },
  output: {
    filename: '[name].js',
    publicPath: '',
  },
  module: {
    rules: [
      {
        test: /\.css$/,// 增加对 CSS 文件的支持
        // 提取出 Chunk 中的 CSS 代码到单独的文件中
        use: ExtractTextPlugin.extract({
          use: ['css-loader'] // 压缩 CSS 代码
        }),
      },
    ]
  },
  plugins: [
    // 一个 WebPlugin 对应一个 HTML 文件
    new WebPlugin({
      template: './template.html', // HTML 模版文件所在的文件路径
      filename: 'index.html' // 输出的 HTML 的文件名称
    }),
    new ExtractTextPlugin({
      filename: `[name].css`,// 给输出的 CSS 文件名称加上 Hash 值
    }),
    new ServiceWorkerWebpackPlugin({
      // 自定义的 sw.js 文件所在路径
      // ServiceWorkerWebpackPlugin 会把文件列表注入到生成的 sw.js 中
      entry: path.join(__dirname, 'sw.js'),
    }),
  ],
  devServer: {
    // Service Workers 依赖 HTTPS，使用 DevServer 提供的 HTTPS 功能。
    https: true,
  }
};
```

以上配置有2点需要注意：

1. 由于 Service Workers 必须在 HTTPS 环境下才能拦截网络请求实现离线缓存
2. serviceworker-webpack-plugin 插件为了保证灵活性，允许使用者自定义 sw.js，构建输出的 sw.js 文件中会在头部注入一个变量 `serviceWorkerOption.assets` 到全局，里面存放着所有需要被缓存的文件的 URL 列表。