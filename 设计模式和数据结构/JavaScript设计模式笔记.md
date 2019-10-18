
# 富有表现力的JavaScript

匿名函数最有趣的用途是用来创建闭包，闭包是一个受到保护的变量空间，由内嵌函数生成。JS具有函数级的作用域，这意味着定义在函数内部的变量在函数外部不能被访问。JS的作**用域是词法性质**的，这意味着**函数运行在定义它的作用域**中。而不是在调用它的作用域中。

结合**词法作用域**和**函数级作用域**，就能通过把变量包裹在匿名函数中加以保护。

## 对象的易变性

在js中，一切都是对象。任何东西都可以在运行时修改。


# 接口

接口提供了一种用以说明一个对象应该具有哪些方法的手段。


# 继承

## 类式继承

```js
//Class Person

function Person(name){
    this.name = name
}

Person.prototype.getName = function(){
    return this.name
}

//一个person类，创建实例属性使用this关键字，类的方法则被添加到其prototype对象中。

let reader = new Person('mason')
reader.name()
```

## 原型链

创建继承Person的类则要复杂一些：

```js
//让一个类继承另一个类，首先要做的是创建一个构造函数，在构造函数中调用超类的构造函数，并将name参数传给他。
function Author(name, books) {
    Person.call(this, name)
    this.books = books
}

Author.prototype = new Person()
Author.prototype.constructor = Author
Author.prototype.getBooks = () => this.book
```

加强版

```js
//定义一个extend方法

function extend(sub, sup) {
    let F = function(){}
    F.prtotype = sup.prototype
    sub.prototype = new F()
    sub.prototype.constructor = sub

    sub.sup = sup.prototype
    if(sup.prototype.constructor == Object.prototype.constructor){
        sup.prototype.constructor = sup
    }
}

//给sub提供sup属性，可以弱化父类和子类的耦合。这在既想要重定义超类的某个方法而又想访问其在超类中的实现时可以排上用处。

Author.prototype.getName = function() {
    let name = Author.superclass.getName.call(this)
    return name + this.getBooks()
}
```

## 原型式继承

使用原型式继承，并不需要用类来定义对象的结构，只需要创建一个对象即可。这个对象随后可以被新的对象重用，这得益于原型链查找的工作机制。





