# String.raw()
这个函数基本不会被手动调用，而是和标签模板字面值一起使用
```js
var str = "bc"

String.raw `\ta${str}d\xE9`   // "\tabcd\xE9", 而不是" abcdé"

```

# 原型函数repeat()

```js
"foo".repeat(3)   //"foofoofoo"

```

# 字符串减产函数
startsWith(), endsWith(), includes()

