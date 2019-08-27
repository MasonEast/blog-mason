# 用模板保持代码的整洁性

在Node中可以像其他Web技术一样，用MVC模式开发传统的Web程序。MVC的主要思想是将逻辑，数据和展示层分离，在遵循MVC模式的web程序中，一般是用户向服务器请求资源，然后控制器向模型请求数据，得到数据后传给视图。在使用模板时，视图会将模型返回的数据传给模板引擎。

# Pug

## pug基础知识

Pug的标签名跟HTML一样，但抛弃了前面的<和后面的>字符，并用缩进表示标签的嵌套关系，标签可以用.<classname>关联一个或多个css类：
  `div.content.siderbar#feature`(因为div常用，pug可以默认省略直接.)

### 指定标签的属性
将标签的属性放在括号中，每个属性之间用逗号分开。
`a(href='http://xxxxx.com', target='_blank')`,
也可以这样：
`a(href='http://xxxxx.com', 
    target='_blank')`

### 用块扩展组织代码

```js
ul
  li: a(href='http://nodejs.org/') Node.js homepage
  li: a(href='http://npmjs.org/') NPM homepage
  li: a(href='http://nodebits.org/') Nodebits blog
```

### 将数据纳入到pug模板

上下文值也可以作为属性的值。下面这个例子会渲染出<a href="http://google.com"> </a>:

```js
const pug = require('pug');
const template = 'a(href = url)';
const context = { url: 'http://google.com' };
const fn = pug.compile(template);
console.log(fn(context));
```

## Pug模板中的逻辑


