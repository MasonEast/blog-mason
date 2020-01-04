# 什么是代码检查

代码检查主要是用来发现代码错误，统一代码风格。

在 JavaScript 项目中，我们一般使用 `ESLint` 来进行代码检查。它通过插件化的特性极大的丰富了适用范围，搭配 `typescript-eslint-parser` 之后，甚至可以用来检查 TypeScript 代码。

`TSLint` 与 `ESLint` 类似，不过除了能检查常规的 js 代码风格之外，TSLint 还能够通过 TypeScript 的语法解析，利用类型系统做一些 ESLint 做不到的检查。

# 应该使用哪种代码检查工具

TSLint的优点：

1. 专为TypeScript服务，bug比ESLint少
2. 不受限于ESlint使用的语法树ESTree
3. 能直接通过`tsconfig.json`中的配置编译整个项目，使得在一个文件中的类型定义能够联动到其他文件的代码检查

ESLint的优点：

1. 基础规则比TSLint多很多
2. 社区繁荣，插件众多

建议：

新项目还是考虑ESLint

## 在TypeScript中使用ESLint

`npm i eslint -S`
`npm i typescript typescript-eslint-parser -S`安装解析器。
`npm i eslint-plugin-typescript -S`安装补充插件


