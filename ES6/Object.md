# 静态函数Object.is()

执行比===更严格的值比较。
```js
var x = NaN , y = 0, z = -0
x === x   //false
y === z   //true

Object.is(x, x)     //true
Object.is(y, z)     //false

```

# 静态函数Object.getOwnPropertySymbols()
直接从对象上获取所有的符号属性。

# 静态函数Object.setPrototypeOf()
设置对象的[[Prototype]]用于行为委托

```js
var o1 = {
  foo(){}
}
var o2 = {
  //...
}

Object.setPrototypeOf(o2, o1)
o2.foo()

//也可以
var o2 = Object.setPrototypeOf({
  //...
}, o1)

```

# 静态函数Object.assign()
浅复制。
第一个参数是target，其他参数都是源
