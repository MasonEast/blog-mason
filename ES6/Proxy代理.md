# 代理是一种由你创建的特殊的对象，它“封装”另一个普通对象
```js

var obj = {a: 1},
    handler = {
      get(target, key, context){
        // target === obj     context === pobj
        console.log('~~~')
        return Reflect.get(     //转发
          target, key, context
        )
      }
    }
    pobj = new Proxy(obj, handlers)

obj.a     //1
pobj.a    //~~~~  1

```

# 代理局限性
可以在对象上执行的很广泛的一组基本操作都可以通过这些元编程处理函数trap，但有一些操作是无法拦截的。

# 可取消代理
可取消代理使用Proxy.reocable()创建
```js
 var obj = { a: 1 },
         handlers = {
get(target,key,context) {
// 注意:target === obj,
// context === pobj
console.log( "accessing: ", key ); return target[key];
} },
         { proxy: pobj, revoke: prevoke } =
             Proxy.revocable( obj, handlers );
     pobj.a;
     // accessing: a
     // 1
// 然后: prevoke();
     pobj.a;
     // TypeError
```

# 使用代理
我们使用代理可以拦截对象的几乎所有行为。


