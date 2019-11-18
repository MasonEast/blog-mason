# 什么是TypeScript

TypeScript是JavaScript的一个超集，主要提供了类型系统和对ES6的支持。

## TS的优势

1. 增加了代码的可读性和可维护性
   类型系统实际上是最好的文档，大部分的函数看看类型的定义就可以知道如何使用了
   可以在编译阶段就发现大部分错误
   增强了编辑器和IDE的功能，包括代码补全，接口提示，跳转到定义，重构等

2. ts非常包容
   即使不显式的定义类型，也能够自动做出类型推导；
   可以定义从简单到复杂的几乎一切类型；
   即使ts编译报错，也可以生成js文件；
   兼容第三方库，即使第三方库不是用ts写的，也可以编写单独的类型文件供ts读取

3. 活跃的社区

## TS的缺点

1. 有一定的学习成本，需要理解接口（Interfaces）， 泛型（Generics）， 类（Classes）， 枚举类型（Enums）等前端不熟悉的概念
2. 短期增加开发成本，但可以减少后期维护成本
3. 集成到构建流程需要一定的工作量
4. 可能和一些库结合的不是很完美

# 安装TS

`npm i typescript -g`
以上命令会在全局环境下安装`tsc`命令，安装完成后，我们就可以在任何地方执行`tsc`命令了。
`tsc hello.ts`


# 小demo

```js
// hello.ts

function sayHello(person: string) {
    return 'Hello, ' + person;
}

let user = 'Tom';
console.log(sayHello(user));
```

执行`tsc hello.ts`会：

```js
//hello.js

function sayHello(person) {
    return 'Hello, ' + person;
}
var user = 'Tom';
console.log(sayHello(user));
```

## ts只会进行静态检查，如果发现有错误，编译的时候就会报错

如果在报错的时候终止js文件的生成，可以在`tsconfig.json`中配置`noEmitOnError`就可以了。


