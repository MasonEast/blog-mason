# 原始数据类型

## 布尔值

```js
let isDone: boolean = false
```

## 数值

```js
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
// ES6 中的二进制表示法
let binaryLiteral: number = 0b1010;
// ES6 中的八进制表示法
```

## 字符串

```js
let myName: string = 'Tom'

let sentence: string = `hello, my name is ${myName}`

```

## 空值

JS中没有空值（void）的概念， 在ts中，可以用`void`表示没有任何返回值的函数
```js

function alertName(): void {
    alert('my name is Tom')
}

```

声明一个`void`类型的变量没有什么用，因为只能讲它赋值为`undefined`和`null`
```JS
let unusable: void = undefined
```

## Null和Undefined

```js
let u: undefined = undefined
let n: null = null
```

与void的区别是， undefined和null是所有类型的子类型。也就是说undefined类型的变量，可以赋值给number类型的变量：

```js
let num: number = undefined
//这样不会报错

let u: undefined
let num: number = u
//这样也不会报错

let u: void
let num: number = u
//Type 'void' is not assignable to type 'number'.
```

# 任意值

任意值（Any）用来表示允许赋值为任意类型

如果是一个普通类型，在赋值过程中改变类型是不被允许的,但如果是`any`类型，则被允许赋值为任意类型：
```js

let str: string = 'sens'
str = 5
// Type 'number' is not assignable to type 'string'

let str: any = 'sens'
str = 5
// ok

```

在任意值上访问任何属性都是允许的,也允许调用任何方法：

```js

let anyThing: any = 'hello';
console.log(anyThing.myName);
console.log(anyThing.myName.firstName);

let anyThing: any = 'Tom';
anyThing.setName('Jerry');
anyThing.setName('Jerry').sayHello();
anyThing.myName.setFirstName('Cat');

```

可以认为， **声明一个变量为任意值之后，对它的任何操作，返回的内容的类型都是任意值**

## 未声明类型的变量

变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型。

# unknown

unknown 和 any 的主要区别是 unknown 类型会更加严格:在对unknown类型的值执行大多数操作之前,我们必须进行某种形式的检查,而在对 any 类型的值执行操作之前,我们不必进行任何检查。

# never

never 类型表示的是那些永不存在的值的类型，never 类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是 never 的子类型或可以赋值给 never 类型（除了never本身之外）。

## 常见场景

```js
// 抛出异常的函数永远不会有返回值
function error(message: string): never {
    throw new Error(message);
}

// 空数组，而且永远是空的
const empty: never[] = []
```

# 类型推论

ts会在没有明确的指定类型的时候推测出一个类型，这就是类型推论。

**如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成any类型而完全不被类型检查**

# 联合类型

联合类型表示取值可以为多种类型中的一种

```js

let str: string | number

```
联合类型使用`|`分隔每个类型

## 访问联合类型的属性和方法

当ts不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法：

```js
function getLength(something: string | number): number {
    return something.length;
}
// index.ts(2,22): error TS2339: Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'
```

# 对象的类型 -- 接口

在ts中，使用接口（interfaces）来定义对象的类型

## 什么是接口

在面向对象的语言中，接口是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类去实现。

```js
interface Person {
    name: strin;
    age: number;
}

let tom: Person = {
    name: 'Tom',
    age: 23
}
```

接口一般首字母大写。

定义的变量比接口少了一些属性是不被允许的，多一些属性也是不允许的。赋值的时候， **变量的形状和接口的形状必须保持一致**

## 可选属性

有时我们希望不要完全匹配一个形状，那么可以用可选属性：

```js
interface Person {
    name: string;
    age?: number;
}
```

## 任意属性

有时我们希望一个接口允许有任意的属性：

```js
interface Person {
    name: string;
    age?: number;
    [propName: string]: any
}
// 使用[propName: string]定义了任意属性取string类型的值
```

需要注意，一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集：

```js
interface Person {
    name: string;
    age?: number;
    [propName: string]: string;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};
//报错，因为age是number类型不是strin的子类型
```

## 只读属性

```js
interface Person {
    readonly: id: number;
    name: string;
    age: number;
    [propName: string]: any
}
```

## 继承接口

```js
interface VIPUser extends User {
    broadcast: () => void
}

//还可以继承多个接口

interface VIPUser extends User, SupperUser {
    broadcast: () => void
}
```




注意：**只读的约束在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候。**

# 数组的类型

在ts中，数组类型有多种定义方式，比较灵活。

1. 
```js
let fib: number[] = [1,2,3]
//数组的项中不允许出现非number类型
```

2. 数组泛型

```js
let fib: Array<number> = [1,2,3]
```

3. 用接口表示数组

```js
interface NumberArray {
    [index: number]: number
}
//上面的定义表示: 只要索引的类型是数字时，那么值得类型必须是数字
let fib: NumberArray = [1,2,3]
```

4. 类数组

```js

function sum() {
    let args: number[] = arguments
} 
//报错，arguments是一个类数组，不能用普通的数组定义，而是使用接口：

function sum() {
    let args: {
        [index: number]: number;
        length: number;
        callee: Function;
    } = arguments;
}

```

事实上，常用的类数组都有自己的接口定义， 如IArguments， NodeList， HTMLCollection等：

```js
function sum() {
    let args: IArguments = arguments
}
```

## any在数组中的应用

```js
let list: any[] = ['dd', 2, {ss: 'cc'}]
```

# 元组（Tuple）

元组类型和数组类型非常相似， 表示一个已知元素数量和类型的数组， 各元素的类型不必相同。

```ts
let x: [string, number]
x = ['hello', 10, false]           //error
x = ['hello']                      //error
x = [10, 'helllo']                 //error
```
元组中包含的元素，必须与声明的类型一致，而且不能多、不能少，甚至顺序不能不符。

元组继承于数组，但是比数组拥有更严格的类型检查。

# Object

object表示非原始类型， 也就是除 number， string， boolean， symbol， null或undefined之外的类型。

对象， 枚举， 数组， 元组统统都是`object`类型

# 枚举类型

当我们声明一个枚举类型时，虽然没有给他们赋值， 但是它们的值其实是默认的数字类型， 而且默认从0开始依次累加：

```ts
enum Direction {
    Up,
    Down, 
    Left, 
    Right
}

console.log(Direction.Up === 0); // true
console.log(Direction.Down === 1); // true
console.log(Direction.Left === 2); // true
console.log(Direction.Right === 3); // true

//如果给` Up=10 ` 则是10， 11， 12 ，13
```

也可以是字符串类型：

```ts
enum Direction {
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right'
}

console.log(Direction['Right'], Direction.Up); // Right Up
```

## 枚举的本质

我们印象中一个 JavaScript 对象一般都是正向映射的，即 `name => value`，为什么在枚举中是可以正反向同时映射的？即 `name <=> value`。

来看下上面的例子被编译为js后的样子：

```js
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 10] = "Up";
    Direction[Direction["Down"] = 11] = "Down";
    Direction[Direction["Left"] = 12] = "Left";
    Direction[Direction["Right"] = 13] = "Right";
})(Direction || (Direction = {}));
```

##  常量枚举

```js
const enum Direction {
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right'
}

const a = Direction.Up;

//编译后：

var a = 'Up'
```
这就是常量枚举的作用,因为下面的变量 a 已经使用过了枚举类型,之后就没有用了,也没有必要存在与 JavaScript 中了, TypeScript 在这一步就把 Direction 去掉了,我们直接使用 Direction 的值即可,这是**性能提升**的一个方案。

## 为枚举添加静态方法

```ts
enum Month {
    January,
    February,
    March,
    April,
    May,
    June,
    July,
    August,
    September,
    October,
    November,
    December,
}

namespace Month {
    export function isSummer(month: Month) {
        switch (month) {
            case Month.June:
            case Month.July:
            case Month.August:
                return true;
            default:
                return false
        }
    }
}

console.log(Month.isSummer(Month.January)) // false
```


# 函数的类型

```js
//函数声明
function sum(x: number, y: number): number {
    return x + y
}

//函数表达式

let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};
//注意： 不要混淆了ts中的箭头和es6中的箭头
//在ts中箭头表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。

```

注意： 输入多余的参数是不被允许的。

## 用接口定义函数的形状

```js
interface Search {
    (source: string, sub: string): boolean
}

let mySearch: Search

mySearch = function(source: string, sub: string) {
    return boolean
}
```

## 可选参数

前面强调输入多余（少于）参数，是不允许的，但可以用`?`表示可选参数：

```js
function buildName(firstName: string, lastName?: string) {
    if (lastName) {
        return firstName + ' ' + lastName;
    } else {
        return firstName;
    }
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');
```

注意： 可选参数必须在必需参数后面，换句话说，可选参数后面不允许再出现必须参数了。

## 参数默认值

ts会将添加了默认值的参数识别为可选参数。

## 剩余参数

es6中，可以用`...`的方式获取函数中的剩余参数：

```js
function push(array: any[], ...items: any[]){}
```

## 重载

可以使用重载定义多个`reverse`的函数类型：

```js
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```
上例中，我们重复定义了多次函数 reverse，前几次都是函数定义，最后一次是函数实现。在编辑器的代码提示中，可以正确的看到前两个提示。

注意： ts会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。

# 类型断言

两种写法：
```js
<类型>值

值 as 类型
//react只能使用第二种
```

```js

function getLength(something: string | number): number {
    if ((something as string).length) {
        return something as string).length;
    } else {
        return something.toString().length;
    }
}

```

类型断言不是类型转换，断言成一个联合类型中不存在的类型是不允许的。

# 声明文件

当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码不全，接口提示等功能。

声明文件必须以`.d.ts`为后缀

当一个第三方库没有提供声明文件时，我们就需要自己书写声明文件了。

库的主要使用场景：
1. 全局变量： 通过<script>标签引入第三方库，注入全局变量。
2. npm包： 通过`import xx from xx`引入， 符合es6模块规范
3. UMD库： 既可以通过<script>引入，也可以import导入。
4. 直接扩展全局变量： 通过<script>引入，改变一个全局变量的结构
5. 在npm包或UMD库中扩展全局变量
6. 模块插件： 通过<script>或import导入后，改变另一个模块的结构

```js
// src/jQuery.d.ts

declare const jQuery: (selector: string) => any;

jQuery('#foo');
// 使用 declare const 定义的 jQuery 类型，禁止修改这个全局变量
jQuery = function(selector) {
    return document.querySelector(selector);
};
// ERROR: Cannot assign to 'jQuery' because it is a constant or a read-only property.
```

一般来说， 全局变量都是禁止修改的常量。所以一般使用const

## declare function

用来定义全局函数的类型：

```js
declare function jQuery(selector: string): any
```

## declare class

用来定义一个类的全局变量：

```js
declare class Animal {
    name: string;
    constructor(name: string);
    sayHi(): string
}
```

## declare enum

使用`declare enum`定义的枚举类型也称作外部枚举：

```js
declare enum Directions {
    Up,
    Down,
    Left,
    Right
}

//使用
let directions = [Directions.Up,Direction.Down, ...]
```

## declare namespace

用来表示全局变量是一个对象，包含很多子属性。 如果对象有深层的层级， 则需要用嵌套的`namespace`来声明深层的属性的类型。

```js
declare namespace jQuery {
    function ajax(url: string, settings?: any): void;
    namespace fn {
        function extend(object: any): void
    }
}
```

## interface和type

除了全局变量之外， 可能有一些类型我们也希望能暴露出来，在类型声明文件中，我们可以直接使用interface或type来声明一个全局的接口或类型：

```js
interface AjaxSettings {
    method?: 'GET' | 'POST'
    data?: any
}

declare namespace jQuery {
    function ajax(url: string, settings?: AjaxSettings): void
}
```

### 防止命名冲突

暴露在最外层的interface或type会作为全局类型作用于整个项目中，我们应该尽可能的减少全局变量或全局类型的数量，故最好把它们放在`namespace`下：

```js
declare namespace jQuery {
    interface AjaxSettings{

    }
}
```

## npm包

npm包的声明文件可能存在于两个地方：
1. 与该npm包绑定在一起，判断依据是package.json中有types字典，或者有一个`index.d.ts`声明文件
2. 发布到`@types`里，通过`npm i @types/foo -S`安装。

假如以上两种方式都没有找到对应的声明文件，那么我们就需要自己为他写声明文件。

npm包的声明文件主要有以下几种语法：

1. export导出变量
2. export namespace导出对象
3. export default ES6默认导出
4. export = commonjs  导出模块

```js
// types/foo/index.d.ts

export const name: string;
export function getName(): string;
export class Animal {
    constructor(name: string);
    sayHi(): string;
}
export enum Directions {
    Up,
    Down,
    Left,
    Right
}
export interface Options {
    data: any;
}
```

也可以使用declare先声明多个变量，最后再用export一次性导出
```js
// types/foo/index.d.ts

declare const name: string;
declare function getName(): string;
declare class Animal {
    constructor(name: string);
    sayHi(): string;
}
declare enum Directions {
    Up,
    Down,
    Left,
    Right
}
interface Options {
    data: any;
}

export { name, getName, Animal, Directions, Options };
```

## 三斜线指令

类似于声明文件中的import，它可以用来导入另一个声明文件。
使用场景：
当我们在书写一个全局变量的声明文件时
当我们需要依赖一个全局变量的声明文件时

在全局变量的声明文件中，是不允许出现import， export关键字的。一旦出现了，那么他就会被视为一个 npm 包或 UMD 库，就不再是全局变量的声明文件了。故当我们在书写一个全局变量的声明文件时，如果需要引用另一个库的类型，那么就必须用三斜线指令了。

```js
// types/jquery-plugin/index.d.ts

/// <reference types="jquery" />

declare function foo(options: JQuery.AjaxSettings): string;
```




