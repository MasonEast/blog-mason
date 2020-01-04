# 实战

## 使用ES6

虽然目前部分浏览器和Node.js已经支持ES6，但由于它们对ES6所有的标准支持不全，通常我们需要把采用ES6别写的代码转换成ES5的代码，这包含两件事：
1. 把新的ES6语法用ES5实现
2. 给新的API注入polyfill，例如项目中使用fetch时，只有注入对应的polyfill才能在低版本的浏览器中正常运行。

### Babel

Babel是一个JS编译器，能将ES6代码装换为ES5代码。在Babel执行编译过程中，会从项目根目录下的`.babelrc`文件读取配置：
```js
{
  "plugins": [
    [
      "transform-runtime",
      {
        "polyfill": false
      }
    ]
   ],
  "presets": [
    [
      "es2015",
      {
        "modules": false
      }
    ],
    "stage-2",
    "react"
  ]
}
```

#### Plugins

告诉Babel要使用哪些插件，插件可以控制如何转换代码。

以上配置文件里的 `transform-runtime` 对应的插件全名叫做 `babel-plugin-transform-runtime`,作用是减小babel编译出来的代码的文件大小，和`babel-runtime`配套使用。

#### Presets

该属性告诉Babel要转换的源码使用了哪些新的语法特性，一个Presets对一组新语法特性提供支持，多个Presets可以叠加

### 接入Babel
```js

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
      },
    ]
  },
  // 输出 source-map 方便直接调试 ES6 源码
  devtool: 'source-map'
};

```
配置命中了项目目录下的所有js文件，通过babel-loader去调用Babel完成转换工作

```js
//Webpack 接入 Babel 必须依赖的模块
npm i -D babel-core babel-loader 
//根据你的需求选择不同的 Plugins 或 Presets
npm i -D babel-preset-env
```

## 使用TypeScript

TS是JS的一个超集，主要提供了类型检查系统和对ES6语法的支持，但不支持新的API

学习TS推荐《Learning TypeScript中文版》

由于TS是JS的超集，直接把后缀.js改成.ts是可以的。

```js
// show.ts
// 操作 DOM 元素，把 content 显示到网页上
// 通过 ES6 模块规范导出 show 函数
// 给 show 函数增加类型检查 
export function show(content: string) {
  window.document.getElementById('app').innerText = 'Hello,' + content;
}
// main.ts
// 通过 ES6 模块规范导入 show 函数
import {show} from './show';
// 执行 show 函数
show('Webpack');
```

TS官方提供了能把TS转换成JS的编译器，需要在当前项目根目录下新建一个用于配置编译选项的`tsconfig.json`文件，编译器会默认读取和使用这个文件：

```js
{
  "compilerOptions": {
    "module": "commonjs", // 编译出的代码采用的模块规范
    "target": "es5", // 编译出的代码采用 ES 的哪个版本
    "sourceMap": true // 输出 Source Map 方便调试

    "importHelpers": true  //会把辅助函数由注入改成引入，避免代码冗余，依赖tslib这个库。
  },
  "exclude": [ // 不编译这些目录里的文件
    "node_modules"
  ]
}
```

### 集成Webpack

需要解决两个问题：
1. 通过Loader把TS转换成JS， 可以使用`awesome-typescript-loader`解决
2. Webpack在寻找模块对应的文件时需要尝试ts后缀， 修改默认的resolve.extensions配置项。

```js

module.exports = {
  // 执行入口文件
  entry: './main',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  resolve: {
    // 先尝试 ts 后缀的 TypeScript 源码文件
    extensions: ['.ts', '.js'] 
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  devtool: 'source-map',// 输出 Source Map 方便在浏览器里调试 TypeScript 代码
};
```

需要安装依赖：
`npm i -D typescript awesome-typescript-loader`


## 使用Flow检查器

### 认识Flow

Flow是一个Facebook开源的JS静态类型检测器，它是js语言的超集，你所需要做的就是在需要的地方加上类型检查。

```js
// @flow

// 静态类型检查
function square1(n: number): number {
  return n * n;
}
square1('2'); // Error: square1 需要传入 number 作为参数

// 类型推断检查
function square2(n) {
  return n * n; // Error: 传入的 string 类型不能做乘法运算
}
square2('2');
```
需要注意的是代码中的第一行//@flow告诉Flow检查器这个文件需要被检查

### 使用Flow

安装可执行文件`npm i -D flow-bin`

配置Npm Script
```js
"script": {
  "flow": "flow"
}
```

通过 `npm run flow`去调用Flow执行代码检查。

采用了Flow静态类型语法的JS是无法直接在目前的JS引擎中运行的，需要把静态类型语法去掉，例如：
```js
// 采用 Flow 的源代码
function foo(one: any, two: number, three?): string {}

// 去掉静态类型语法后输出代码
function foo(one, two, three) {}
```

有两种方式可以做到：
1. `flow-remove-types`可单独使用，速度快
2. `babel-preset-flow`与babel集成

### 集成Webpack

安装依赖`npm i babel-preset-flow -D`

修改.baberc配置文件，加入Flow Preset

```js
"presets": [
  ...,
  "flow"
]
```

## 使用PostCSS

### 认识PostCSS

postcss是一个css处理工具，用处很大。可以给css自动加前缀，使用下一代css语法等，它很可能成为css预处理器的最终赢家。

postcss和css的关系就像babel和js的关系。
postcss和scss的关系就像babel和ts的关系。

深入学习，推荐《深入PostCSS Web设计》

给css自动加前缀，增加浏览器的兼容性：
```js
/*输入*/
h1 {
  display: flex;
}

/*输出*/
h1 {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
```

使用下一代css语法：
```js
/*输入*/
:root {
  --red: #d33;
}

h1 {
  color: var(--red);
}


/*输出*/
h1 { 
  color: #d33;
}
```

postcss全部采用js编写，运行在node.js上，postcss启动时，会从目录下的postcss.config.js文件中去读取所需配置
```js
module.exports = {
  plugins: [
    //需要使用的插件列表
    require('postcss-cssnext')  //可以让你使用下一代css语法编码的插件，并且该插件还包含给css自动加前缀的功能
  ]
}
```

### 接入Webpack

安装依赖

```js
//安装 Webpack Loader 依赖
npm i -D postcss-loader css-loader style-loader
//根据你使用的特性安装对应的 PostCSS 插件依赖
npm i -D postcss-cssnext

module.exports = {
  module: {
    rules: [
      {
        // 使用 PostCSS 处理 CSS 文件
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ]
  },
};
```

## 使用React框架

### React语法特征

React项目的代码特征是JSX和Class语法

### React与Babel

要在使用Babel的项目中接入React框架是很简单的，只需要加入所依赖的Presets： babel-preset-react

```js
//安装 React 基础依赖
npm i -D react react-dom
//安装 babel 完成语法转换所需依赖
npm i -D babel-preset-react

//修改.babelrc配置文件加入React Presets
"presets": [
  "react"
]
```

### React 与 Typescript

1. 使用了jsx语法的文件后缀必须是tsx
2. 由于React不是采用TypeScript编写的，需要安装react和react-dom对应的TypeScript接口描述模块`@types/react`和`types/react-dom`才能通过编译。

修改ts编译器配置文件tsconfig.json增加对jsx语法的支持：
```js
{
  "compilerOptions": {
    "jsx": "react"
  }
}
```

安装依赖：`npm i react react-dom @types/react @types/react-dom`

```js
const path = require('path');

module.exports = {
  // TS 执行入口文件
  entry: './main',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  resolve: {
    // 先尝试 ts，tsx 后缀的 TypeScript 源码文件 
    extensions: ['.ts', '.tsx', '.js',] 
  },
  module: {
    rules: [
      {
        // 同时匹配 ts，tsx 后缀的 TypeScript 源码文件 
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  devtool: 'source-map',// 输出 Source Map 方便在浏览器里调试 TypeScript 代码
};
```

## 使用Vue框架

Vue官方提供了对应的`vue-loader`可以非常方便的完成单文件组件的转换
```js

//Vue 框架运行需要的库
npm i -S vue
//构建所需的依赖
npm i -D vue-loader css-loader vue-template-compiler


module: {
  rules: [
    {
      test: /\.vue$/,
      use: ['vue-loader']
    }
  ]
}
```

