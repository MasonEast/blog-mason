# Symbol

一种新的原始数据类型，表示独一无二的值，具有唯一性，常用于定义常量， 定义对象属性名

# const定义的Array中的元素能否被修改?如果可以,那const修饰对象的意义是?

其中的值可以被修改， const只是定义了变量在内存中占用的地址不能修改， 而Array中的元素存在于堆上， **意义上， 主要是保护引用不被修改**

# 箭头函数与function函数的区别

1. 箭头函数用箭头操作符来定义函数， 是一个块函数作用域

2. 箭头函数体内的this对象， 就是定义时所在的对象， 而不是使用时所在的对象

3. 箭头函数不可以当做构造函数， 也就是说， 不可以使用new命令， 否则会抛出一个错误。

4. function函数的this指向运行时所在的作用域

# let， var， const区别

1. let:变量只能声明一次,还有一个好处就是当我们写代码比较多的时候可以避免在不知道的情况下重复声明变量.只会在对应的代码块内有效;适用场景:for循环的计数器;

2. var:变量可以多次声明.存在变量提升;

3. const:定义只读的常量,一旦声明,常量的值就不能改变,只声明不赋值就会报错.

# ES6对象的扩展有哪些

1. assign方法： 用于对象的合并， 将源对象的所有可枚举属性复制到目标对象。如果目标对象与源对象有同名属性， 后面的会覆盖前面的。

```js
const target = {a: 1, b: 1};
const source1 = {b: 2, c: 2};
const source2 = {c: 3, [Symbol('c')]: 'd'};
Object.assign(target, source1, source2); // {a: 1, b: 2, c: 3, Symbol(c): "d"}
```

2. defineProperty: 用来给对象定义属性

```js
const someOne = {};
Object.defineProperty(someOne, "name", {
    value: "xxx",
    writable: false // 设定了writable属性为false,导致这个不可修改
});
console.log(someOne.name); // xxx
someOne.name = "yyy";
console.log(someOne.name); // xxx
```

3. hasOwnProperty: 用于检查某一属性是不是存在对象本身， **不看原型链**

4. propertyIsEnumerable： 用来检测某一属性是否可遍历， 也就是能不能用for...in循环取到。

# ES6数组的新方法

1. map： 创建一个新数组,其结果是该数组中的每个元素都调用一个提供的函数后返回的结果

```js
let array1 = [1, 4, 9, 16];
const map1 = array1.map((x) => x * 2);
console.log(map1); // [2, 8, 18, 32]
```

2. reduce: 累加器和数组中的每个元素（从左到右）应用一个函数， 将其减少为单个值。

```js
const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
console.log(array1.reduce(reducer)); // 1 + 2 + 3 + 4
```

3. forEach: 对数组的每个元素执行一次提供的函数, 没有返回值

```js
const array1 = ['a', 'b', 'c'];
array1.forEach((element) => {
    console.log(element);
});
```

4. filter: 创建一个新数组， 其包含通过所提供函数过滤后的结果

```js
const words = ['spray', 'limit' ,'elite', 'exuberant', 'destruction', 'present'];
const result = words.filter(word => word.length > 6);
console.log(result);
```

# Map/Set的作用

Map类似Object对象， 不同的地方在于Map的键可以是复杂结构， 而Object只能是字符串结构

Set类似于数组， 但成员的值都是唯一的， 没有重复的值。

```js
const s = new Set();
[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));
for (let i of s) {
    console.log(i);
}
```

# ES6模块与CommonJS模块的区别

1. CommonJS模块输出的是一个值的拷贝， ES6模块输出的是一个值的引用

2. CommonJS模块是运行时加载， ES6模块是编译时输出接口

3. ES6输入的模块变量， 只是一个符号链接， 所以这个变量是只读的， 对它进行重新赋值会报错

# 修饰器

修饰器是一个对类进行处理的函数， 修饰器函数的第一个参数就是所要修饰的目标类， 修饰器只能用于类和类的方法， 不能用于函数， 因为存在函数提升， 如果一定要修饰函数， 可以采用高阶函数的形式直接执行。

```js
@testable
class MyTestableClass {
    // ...
}
function testable(target) {
    target.isTestable = true;
}
MyTestableClass.isTestable // true
```

# Proxy是什么， 使用场景？

Proxy用于**修改某些操作的默认行为**， 等同于在语言层面做出修改， 属于一种"元编程” ， 主要是在目标对象之前架设一层拦截， 外界对该对象的访问， 都必须先通过这层拦截， 因此提供了一种机制， 可以对外界的访问进行过滤和改写。

```js
let obj = new Proxy({}, {
    get: function(target, key, receiver) {
        console.log(`getting ${key}!`);
        return Reflect.get(target, key, receiver);
    },
    set: function(target, key, value, receiver) {
        console.log(`setting ${key}!`);
        return Reflect.set(target, key, value, receiver);
    }
});
obj.count = 1; // setting count!
++obj.count; // getting count! setting count!
```

# Reflect对象

将Object对象的一些明显属于语言内部的方法（如Object.defineProperty）放到Reflect对象上

修改某些Object方法的返回结果，让其变得更加合理。

```js
// 旧的写法
try {
    Object.defineProperty(target, property, attributes);
    // 成功的处理
} catch (e) {
    // 失败的处理
}

// 新的写法
if (Reflect.defineProperty(target, property, attributes)) {
    // 成功的处理
} else {
    // 失败的处理
}
```

# ArrayBuffer的作用是什么

由三类对象组成.

1. ArrayBufer对象: 代表内存之中的一段二进制数据,可以通过"视图"进行操作;

2. TypedArray视图: 用来读写简单类型的二进制数据;

3. DataView视图: 用来读写复杂类型的二进制数据.

```js
const buffer = new ArrayBuffer(12);
const x1 = new Int32Array(buffer);
x1[0] = 1;
const x2 = new Uint8Array(buffer);
x2[0] = 2;

x1[0] // 2
```

# getOwnPropertyDescriptor是什么

该方法会返回某个对象属性的描述对象(descriptor). ES7引入getOwnPropertyDescriptors方法,返回指定对象所有自身属性(非继承属性)的描述对象.

```js
const obj = {
    foo: 123,
    get bar() {return 'abc'}
};
Object.getOwnPropertyDescriptor(obj, 'bar');

// configurable: true
// enumerable: true
// get: ƒ bar()
// set: undefined
// __proto__: Object
```