# JS基本类型的语法比较

{} == {} 比较结果为false

[1] == [1] 比较结果为false

null == null 比较结果为true

undefined == null 比较结果为true

undefined === null 比较结果为false

注: == 表示值相等; === 表示值和类型都要一致;

能力扩展:指针与引用的区别? 指针是一个实体,需要分配内存空间. 引用只是变量的别名,不需要分配内存空间.

# 引用传递， 值传递

js中对象类型是引用传递， 基础数据类型是值传递， 可以通过将基础类型包装后进行引用传递。

# void和undefined的区别

void是js中的一个运算符， 在js中判断是否是undefined， 一般这样写：

```js
function isUndefined(input) {
  return input === void 0;
}
```

undefined是术语， 类型， 值， 属性， 而且可以被重写！

# 编写一个json对象的拷贝函数

根据深拷贝的启发， 不拷贝引用对象， 拷贝一个字符串会开辟一个新的存储地址， 这样就切断了引用对象的指针联系

```js
const test = {
    a: "xxxx",
    b: "yyyy",
    c: [
        {d: "div", e: "element"},
        {v: "video"}
    ]
};
const test1 = JSON.parse(JSON.stringify(test)); // 先序列化为字符串再反序列化为对象
console.log(test);
console.log(test1);
test.c[0].d="dom"; // 改变test的c属性的对象d属性值
console.log(test); // test的d属性值为dom
console.log(test1); // test1的d属性值保持为div不变
```

# js中不同类型以及不同环境下变量的内存都是何时释放？

引用类型： 在没有引用之后， 通过V8d的GC自动回收。

值类型： 如果处于闭包的情况下， 要等到闭包没有引用才会被GC回收， 非闭包的情况下等待V8的新生代（new space）切换的时候回收。

浏览器环境： 只有当页面关闭时， 全局作用域下的变量才会被销毁。

V8引擎： GC策略采用分代GC， 新生代使用Scavenge算法进行回收， 旧分代使用标记和精简GC， 当堆超过阈值， 启动GC。

```js
let arr = []
while(true){
    arr.push(1)
}
//结果： 内存爆掉， 提示错误： allocation failure GC in old space requested

let arr = [];
while (true) {
    arr.push();
}
//结果： while(true)一直死循环下去,CPU资源耗尽.

let arr = [];
while (true) {
    arr.push(new Buffer(1000));
}
//结果： 最后系统的内存爆掉,因为Buffer申请的是堆外的内存空间

function out() {
    const bigData = new Buffer(100);
    inner = function() {
        void bigData;
    }
}
//这个示例inner直接挂载在了root上,从而导致内存泄露(因为bigData不会释放)
```

进阶扩展: 所有JS对象都是通过V8堆来分配的,存活时间较短的对象放在新生代,存活时间较长的对象放在老生代.内存回收策略上,新生代使用Scavenge算法进行回收,该算法实现中主要采用cheney算法.老生代使用标记-清除(Mark-Sweep)和标记-紧缩(Mark-Compact)来回收内存.

# AMD, CMD, UMD, CommonJS四者的区别

AMD是RequireJS推出的,是异步加载模块,也就是提前执行依赖; CMD是seajs推崇的规范,依赖就近,用的时候再require; CommonJS加载的模块是同步的,它推崇一个单独文件就是一个模块; UMD是AMD+CommonJS的组合,解决跨平台;

# JS作用域是什么

所谓作用域是指代码在运行时， 各个变量， 对象， 函数的可访问性， 作用域决定了你的代码在区域的可见性， 大多数语言里面都是块作用域， 以{}进行限定， 而**js却是函数作用域**， 就是一个变量在函数里有效。

# 常用js类定义的方法有哪些

1. 使用构造函数原型定义类

```js
function Person() {
    this.name = "xxx";
}
Person.prototype.sayName = function() {
    alert(this.name);
};
const person = new Person();
person.sayName();
```

2. 使用对象创建

```js
const Person = {
    name: "xxx",
    sayName: function() {
        alert(this.name);
    }
};
const person = Object.create(Person);
person.sayName();
```

3. 使用es6的class创建

```js
class Person {
    constructor(name){
        this.name = name
    }
    sayName(){
        alert(this.name)
    }
}

const person = new Person('xxx')
```

# js类继承的方法

1. 原型继承

```js
function Animal() {
    this.name = 'animal';
}
Animal.prototype.sayName = function() {
    alert(this.name);
};
function Person() {}
Person.prototype = Animal.prototype; // Person继承自Animal
Person.prototype.constructor = 'Person'; // 更新构造函数为Person
```

2. 属性复制

```js
function Animal() {
    this.name = 'animal';
}
Animal.prototype.sayName = function() {
    alert(this.name);
};

function Person() {}
// 复制Animal的所有属性到Person
for (var prop in Animal.prototype) {
    Person.prototype[prop] = Animal.prototype[prop];
}
Person.prototype.constructor = 'Person'; // 更新构造函数为Person
```

3. apply, call, bind

```js
function Animal() {
    this.name = "animal";
}
Animal.prototype.sayName = function() {
    alert(this.name);
};
function Person() {
    Animal.call(this); // apply, call, bind方法都可以,只是有细微区别
}
```

4. 组合继承

```js
// 父类
function People(name) {
    this.name = name;
    this.say = function() {
        console.log("my name is : " + this.name);
    };
}
// 子类
function Child(name) {
    People.call(this);
    this.name = name;
}
Child.prototype = Object.create(People.prototype);
Child.prototype.constructor = Child;
var child = new Child('zqjflash');
child.say(); // my name is : zqjflash
```

# 什么是闭包？ 闭包有哪些用处？

闭包就是在函数声明时创建的作用域。 

# js中的this

this指的是当前正在执行或调用该函数的对象的值。 this值的变化取决于我们使用它的上下文和我们在哪里使用它。

# 如何实现防抖和节流？

防抖： 将目标方法包装在setTimeout里面,然后这个方法是一个事件回调函数,如果这个回调一直执行,那么这些动作就一直不执行.

```js
function debounce(func, delay) {
    let tiemout;
    return function(e) {
        clearTimeout(timeout)   //这里就是保证回调一直执行,setTimeout里面的就不执行
        let context = this.args = arguments
        timeout = setTimeout(() => {
            func.apply(context, args)
        }, delay)               // 等到用户不在触发debounce,那么setTimeout就自然执行里面的方法
    }
}
```

节流： 控制单位时间内执行的次数,每次需要保存上次执行的时间点与定时器.

```js
function throttle(fn, threshhold) {
    var timeout;
    var start = new Date; // 事件触发时间点
    var threshhold = threshhold || 160; // 控制单位时间
    return function() {
        var context = this.args = arguments;
        var curr = new Date() - 0; // 时间触发结束点
        clearTimeout(timeout); // 总是干掉事件回调
        if (curr - start >= threshhold) {
            fn.apply(context, args); // 只执行一部分方法,这些方法是在某个时间段内执行一次.
            start = curr; // 以当次结束点作为下次的开始点
        } else {
            timeout = setTimeout(function() {
                fn.apply(context, args);
            }, threshhold);
        }
    }
}
```

# 链式调用的实现

1. 原型方法实现

```js
function Person() {
}
Person.prototype.setName = function(name) {
    this.name = name;
    return this;
};
Person.prototype.getName = function() {
    return this.name;
};
var pp = new Person();
console.log(pp.setName("xxx").getName());
```

2. 静态方法实现

```js
function Person(name) {
    var _name = name;
    this.setName = function(name) {
        _name = name;
        return this;
    };
    this.getName = function(callback) {
        callback.call(this, _name);
        return this;
    };
}
var pp = new Person('yyy');
pp.getName(console.log).setName("zzz").getName(console.log);
```

# js自定义事件的实现方式

1. createEvent:设置事件类型,是html事件还是鼠标事件;

2. initEvent: 初始化事件,事件名称,是否允许冒泡,是否阻止自定义事件;

3. dispatchEvent: 触发事件.

# 原生实现一个ajax

```js
/**
 * @param url 请求地址
 * @param method 请求方法 get/post
 * @param headers 请求头
 * @param data 请求数据
 */
function ajax({ url, method, headers, data}) {
    return new Promise((resolve, reject) => {
        headers = headers || 'application/x-www-form-urlencoded; charset=UTF-8'
        let request = new XMLHttpRequest(); // 实例化xhr对象
        request.open(method, url, true);
        request.setRequestHeader('Content-type', headers);
        request.onload = function(progressEvent) {
            let response = progressEvent.currentTarget;
            let {status, statusText, responseText, responseUrl} = response; // 解构读取
            console.log(status);
            if(status > 199 && status < 400) {
                resolve(responseText);
            } else {
                reject(statusText);
            }
        }
        request.onerror = function(error) {
            reject(error);
        }
        request.send(data);
    });
}
ajax("http://m.baidu.com/", "post", null, {"test": 1}).catch((error) => {
    console.log(222);
})
.then((value) => {
    console.log(value);
});
```

# 请用js实现一个函数parseUrl(url),将一段url字符串解析为Object.

parseUrl("http://www.baidu.com/product/list?id=111&sort=discount#title");

==>

```js
{
    protocol: "http",
    host: "www.baidu.com",
    path: "/product/list",
    params: {
        id: "111",
        sort: "discount"
    },
    hash: "title"
}
```

实现：

```js
function parseUrl(url) {
    let a = document.createElement("a");
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (() => {
            let ret = {};
            let querys = [];
            let searchQuery = a.search.replace(/^\?/,'').split('&');
            for (var i = 0; i < searchQuery.length; i++) {
                if (searchQuery[i]) {
                    querys = searchQuery[i].split('=');
                    ret[querys[0]] = querys[1];
                }
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i)),
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
}
```

# 实现一个事件收发器Event类， 继承自此类的对象拥有on， off， once和trigger方法

```js
function Event() {
    if (!(this instanceof Event)) {
        return new Event();
    }
    this._callbacks = {};
}
Event.prototype.on = function(type, handler) {
    this._callbacks = this._callbacks || {};
    this._callbacks[type] = this._callbacks[type] || [];
    this._callbacks[type].push(handler);
    return this;
};
Event.prototype.off = function(type, handler) {
    let list = this._callbacks[type];
    if (list) {
        for (let i = list.length; i >= 0; --i) {
            if (list[i] === handler) {
                list.splice(i, 1);
            }
        }
    }
};
Event.prototype.trigger = function(type, data) {
    let list = this._callbacks[type];
    if (list) {
        for (let i = 0, len = list.length; i < len; ++i) {
            list[i].call(this, data);
        }
    }
};
Event.prototype.once = function(type, handler) {
    let self = this;
    function wrapper() {
        handler.apply(self, arguments);
        self.off(type, wrapper);
    }
    this.on(type, wrapper);
    return this;
}
```

# 实现一个deepEqual函数， 判断两个输入参数是否相等（对于对象或者数组需要深度比对）

```js
function deepEqual(x, y) {
    if (x === y) {
        return true;
    }
    if (typeof x !== 'object' || x === null || typeof y !== 'object' || y === null) {
        return false;
    }
    if (Object.keys(x).length !== Object.keys(y).length) {
        return false;
    }
    for (let prop in x) {
        if (y.hasOwnProperty(prop)) {
            if (!deepEqual(x[prop], y[prop])) {
                return false;
            }
        } else {
            return false;
        }
    }
    return true;
}
```

# 实现一个parseUrl函数，解析输入url字符串的所有参数

```js
function parseUrl(url) {
    const res = {};
    if (typeof url !== 'string') {
        return res;
    }
    const a = document.createElement('a');
    a.href = url;
    const search = a.search.replace(/^\?/, '');
    if (!search) {
        return res;
    }
    const paramStrArr = search.split('&');
    for (let i = 0; i < paramStrArr.length; i++) {
        const tempRes = paramStrArr[i].split('=');
        if (tempRes[0] && tempRes[1]) {
            res[tempRes[0]] = decodeURIComponent(tempRes[1]);
        }
    }
    return res;
}
```

# 实现一个EventBus

```js
class EventBus {
    constructor() {
        this.eventList = new Map();
    }
    $emit(evName, ...args) {
        let fn = this.eventList.get(evName);
        if(!fn) {
            console.error(`'${evName}' is undefined`);
            return;
        }
        this.eventList.get(evName).apply(this, args);
    }
    $on(evName, fn) {
        // 防止相同事件重复监听
        if(this.eventList.get(evName)) {
            console.error(`duplicated event name : '${evName}'`);
            return;
        }
        this.eventList.set(evName, fn);
        return {
            remove: () => {
                this.eventList.delete(evName); // 提供delete事件
            }
        };
    }
}
var eventBus = new EventBus();
eventBus.$on("receive", function(params) {
    console.log(`${params}`);
});
eventBus.$emit("receive", "test"); // 打印出test
```


# service worker 如何实现离线缓存？

SW介于服务器和网页之间的拦截器,能够拦截进出的HTTP请求,从而完全控制你的网站.

主要的特点:

1. 在页面中注册安装成功后,运行于浏览器后台,不受页面刷新的影响;

2. 网站必须使用HTTPS

3. 可以控制打开的作用域范围下所有的页面请求

4. 单独的作用域范围,单独的运行环境和执行线程

5. 不能操作页面的DOM,但可以通过事件机制来处理

6. 事件驱动型服务线程

执行流程:

1. 调用register()函数时,SW开始下载;

2. 在注册过程中,浏览器会下载、解析并执行SW;

3. 一旦SW成功执行,install事件就会激活;
4. 安装完成之后,SW便会激活,并控制在其范围内的一切.

# js对象比较

基本类型： js进行值比较
对象： js通过应用地址或存储变量的内存中的地址进行比较

```js
let a = {a: 1}
let b = {a: 1}
let c = a

a === b         //false: 引用地址不同

a === c         //true： 引用地址相同
```

# 逗号运算符

逗号运算符从左到右求值， 并返回右边最后一个项目或最后一个操作数的值。

```js
let a = 1
a = a++, a-5        // -4
a = (a++ , a *= 2, a -= 5, a += 10);    //9
```

# 执行上下文

执行上下文是当前正在执行的“代码环境”， 分为`编译`和`执行`两个阶段。

- **编译**： JS 引荐获取所有函数声明并将其提升到其作用域的顶部，以便我们稍后可以引用它们并获取所有变量声明（使用var关键字进行声明），还会为它们提供默认值： undefined。
- **执行**： 在这个阶段中，它将值赋给之前提升的变量，并执行或调用函数(对象中的方法)。

# 什么是作用域

JS有三种作用域： `全局作用域`， `函数作用域`和块`作用域（ES6）`

# IIFE

立即执行函数。 主要作用是： **避免与全局作用域内的其他变量命名冲突或污染全局命名空间**

# 什么是函数式编程

函数式编程是通过编写纯函数， 避免共享状态， 可变数据， 副作用来构建软件的过程。

**JS支持闭包和高阶函数是函数式编程语言的特点**

# 高阶函数

高阶函数只是将函数作为参数或返回值的函数。

# Object.create可以创建没有原型的对象

# ES6的类class

它是使用构造函数的语法糖， 在底层中使用的仍然是原型和基于原型的继承。

# 什么是async/await

async/await是js中编写异步或非阻塞代码的新方法， 它建立在Promise之上。
```js
async function callApi() {
  try {
    const resp = await fetch("url/to/api/endpoint");
    const data = await resp.json();
    //do something with "data"
  } catch (e) {
    //do something with "err"
  }
}
```
**使用 try/catch 语法来捕获异常**

**该方法会隐式返回一个Promise**

# 检查对象中是否存在某个属性

1. in(会看原型链)
2. hasOwnProperty(不会看原型链)
3. obj[xxx]

# new关键字做了什么

- 创建空对象{}
- 将空对象分配给this值
- 将空对象的__proto__指向构造函数的prototype
- 如果没有使用显式return语句， 则返回this

