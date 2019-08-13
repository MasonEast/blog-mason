# this到底是什么
this是在运行时进行绑定的，并不是在编写时绑定，它的上下文取决于函数调用时的各种条件。this的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。

当一个函数被调用时，会创建**执行上下文**，它会包含函数的调用栈，函数的调用方法，传入的参数等信息，this就是其中一个属性。

# this全面解析
分析下函数的执行过程中调用位置如何决定this的绑定对象。
1. 默认绑定：指向全局对象。（严格模式无法绑定全局对象，this会绑定undefined）

```js
function foo(){
  console.log(this.a)
}
var a = 2;
foo() //2
```

2. 隐式绑定：当函数引用有上下文对象时，隐式绑定规则会把函数调用中的this绑定到这个上下文对象。

简单点理解就是，必须在一个对象内部包含一个指向函数的属性，并通过这个属性间接引用函数，从而把this间接（隐式）绑定到这个对象上。

```js
function foo() { 
  console.log( this.a );
}
var obj = { 
  a: 2,
  foo: foo
};
obj.foo(); // 2
```

**隐式丢失**
1)
```js
function foo () {
  console.log(this.a)
}
var obj = {
  a: 2,
  foo
}
var bar = obj.foo
var a = 3
bar() //3
```
解析： 虽然bar是obj.foo的一个引用，但是实际上，他引用的是foo函数本身，因此此时的bar()其实是一个不带任何修饰的函数调用，因此应用了默认绑定。

1) 在传入回调函数时
```js
function foo() { 
  console.log( this.a );
}
function doFoo(fn) {
// fn 其实引用的是 foo fn(); // <-- 调用位置!
  fn()
}
var obj = { 
  a: 2,
  foo: foo 
};
var a = "oops, global"; // a 是全局对象的属性 
doFoo( obj.foo ); // "oops, global"
```

3. 显式绑定

通过使用`call()`，`apply()`和`bind()`来实现this的绑定。

`call()`和`apply()`的工作原理：
它们的第一个参数是一个对象，它们会把this绑定到这个对象，接着调用函数时指定这个this。

注： 如果你传入了一个原始值（字符串，布尔值）来当做this的绑定对象，这个原始值会被转换成它的对象形式（new String(), new Boolean()等)，这通常称为“**装箱**”。

1) 硬绑定

```js
function foo() { 
  console.log( this.a );
}
var obj = { 
  a:2
};
var bar = function() { 
  foo.call( obj );
};
  bar(); // 2
  setTimeout( bar, 100 ); // 2
// 硬绑定的 bar 不可能再修改它的 this 
bar.call( window ); // 2
```
解析：创建函数bar(),并在它的内部手动调用了`foo.call(obj)`,强制把foo的this绑定到了obj，无论之后如何调用bar，它总会手动在obj上调用foo。

bind()方法就是硬绑定的实现，返回一个硬编码的新函数，它会把参数设置为this的上下文并调用原始函数。

4. new绑定

在JavaScript中，构造函数只是一些使用new操作符时被调用的函数。
使用new来调用函数，会执行下面的操作：
1) 创建一个全新的对象
2) 这个新对象会被执行[[原型]]连接
3) 这个新对象会绑定到函数调用的this
4) 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象

## 四种this绑定的优先级
new > call，apply显式绑定 > 隐式绑定 > 默认绑定

## 意外情况
把`null`或`undefined`作为this的绑定对象传入call，apply或bind

传入null的情况：
```js

function foo(a,b) {
  console.log( "a:" + a + ", b:" + b );
}
// 把数组“展开”成参数
foo.apply( null, [2, 3] ); // a:2, b:3
//es6可以这样
foo(...[2,3])

// 使用 bind(..) 进行柯里化
var bar = foo.bind( null, 2 ); 
bar( 3 ); // a:2, b:3
```
## 间接引用
```js
function foo() { 
  console.log( this.a );
}

var a = 2;
var o = { a: 3, foo: foo }; 
var p = { a: 4 };

o.foo(); // 3
(p.foo = o.foo)(); // 2

```
解析：赋值表达式`p.foo = o.foo` 的返回值是目标函数的引用，因此调用位置是foo()而不是p.foo()或o.foo()，所以会使用`默认绑定`

## 软绑定
硬绑定的this无法再使用隐式绑定或显式绑定来修改this，大大降低了函数的灵活性。
如果可以给默认绑定指定一个全局对象和undefined以外的值，那就可以实现和硬绑定相同的效果，同时保留隐式绑定或显式绑定this的能力。

```js
if (!Function.prototype.softBind) { 
  Function.prototype.softBind = function(obj) {
    var fn = this;
    // 捕获所有 curried 参数
    var curried = [].slice.call( arguments, 1 ); 

    var bound = function() {
      return fn.apply(
      (!this || this === (window || global)) ? obj : this
      curried.concat.apply( curried, arguments )
      ); 
    };

    bound.prototype = Object.create( fn.prototype );
    return bound; 
  };
}
```

## ES6中的箭头函数
箭头函数不适用this的四种标准规则，而是根据外层作用域来决定this。
箭头函数的绑定无法被修改。