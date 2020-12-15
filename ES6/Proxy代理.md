<!--
 * @Description: 
 * @Date: 2019-08-12 21:26:36
 * @Author: mason
-->
# 代理是一种由你创建的特殊的对象，它“封装”另一个普通对象

Proxy对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义修改（如属性查找， 赋值， 枚举， 函数调用等）

## 语法

```js
    const proxy = new Proxy(target, handlers)
```

## 和Object.defineProperty比较

1. Object.defineProperty只能监听对象属性的读写，而Proxy除读写外还可以监听对象中属性的删除，对对象当中方法的调用等等。
2. Object.defineProperty对数组操作的监听一般是重写数组的方法， 而Proxy可以直接监听数组变化。

## 用处

```js
1. 基础用法
    const handlers = {
        get: function(obj, prop){
            return prop in obj ? obj[prop] : false
        }
    }
    const p = new Proxy({}, handlers)
    p.a = 1
    p.b = undefined
    console.log(p.a, p.b, p.c)   // 1, undefined, false

2. 无操作转发代理
    let target = {}
    const p = new Proxy(target, {})
    p.a = 1         //操作转发到目标
    console.log(target.a)       // 1

3. 做对象验证， 追加属性， 以及修改属性值
    let handlers = {
        get: function(obj, prop) {
                // 附加一个属性
                if (prop === 'latestBrowser') {
                    return obj.browsers[obj.browsers.length - 1];
                }
                // 默认行为是返回属性值
                return obj[prop];
            },
        set: function(obj, prop, value) {
            if (prop === 'age') {
                if (!Number.isInteger(value)) {
                    throw new TypeError('The age is not an integer');
                }
                if (value > 200) {
                    throw new RangeError('The age seems invalid');
                }
            }

            obj[prop] = value + 1;      //将传值加1

            // 表示成功
            return true;
        }
        };

    let person = new Proxy({}, handlers);

    person.age = 100;

    console.log(person.age);    // 101

    person.age = 'young';
    // 抛出异常: Uncaught TypeError: The age is not an integer

    person.age = 300;
    // 抛出异常: Uncaught RangeError: The age seems invalid
```

