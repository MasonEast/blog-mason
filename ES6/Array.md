# 静态函数Array.of()
```js
var a = Array( 3 );
     a.length;                       // 3
     a[0];                           // undefined
     var b = Array.of( 3 );
     b.length;                       // 1
     b[0];                           // 3
     var c = Array.of( 1, 2, 3 );
     c.length;                       // 3
     c;                              // [1,2,3]
```

# 静态函数Array.from()
将类数组对象转化为真正的数组
存在一个可选的第二个参数是映射回调。
```js
var arrLike = {
  length: 4,
  2: "foo"
}

Array.from(arrLike, (val, idx) => {
  if(typeof val === "string"){
    return val.toUpperCase()
  }else{
    return idx
  }
})

// [0, 1, "FOO", 3]

```

# 原型方法copyWithin（）
从一个数组中复制一部分到同一个数组的另一个位置，覆盖这个位置所有原来的值。
第一个参数是target，第二个参数start，第三个参数是end
```js
[1,2,3,4,5].copyWithin( 3, 0 );// [1,2,3,1,2]
[1,2,3,4,5].copyWithin( 3, 0, 1 );// [1,2,3,1,5]
[1,2,3,4,5].copyWithin( 0, -2 );// [4,5,3,4,5]
[1,2,3,4,5].copyWithin( 0, -2, -1 );// [4,2,3,4,5]
```

该方法不会增加数组的长度，到达数组结尾复制就会停止。

# 原型方法fill（）
用指定值完全（部分）填充已存在的数组。

# 原型方法find（）

```js
var a = [1,2,3,4,5]

a.find(v => v === 2)    //2

```

# 原型方法findIndex（）
如果需要严格匹配的索引值使用indexOf（），需要自定义匹配的索引值使用findIndex()

```js

a.findIndex( point => {
  return (
    point.x % 6 === 0 
  )
})
```

# 原型方法entries(), values(), keys()

```js
var a = [1,2,3]

[...a.values()]   //[1,2,3]
[...a.keys()]     //[0,1,2]
[...a.entries()]  //[[0,1], [1,2], [2,3]]

```


