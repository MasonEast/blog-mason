
传统的javascript中只有对象，没有类的概念。它是基于原型的面向对象语言。原型对象特点就是将自身的属性共享给新对象。这样的写法相对于其它传统面向对象语言来讲，很有一种独树一帜的感脚！非常容易让人困惑！
如果要生成一个对象实例，需要先定义一个构造函数，然后通过new操作符来完成。构造函数示例：

```js
//函数名和实例化构造名相同且大写（非强制，但这么写有助于区分构造函数和普通函数）
function Person(name,age) {
    this.name = name;
    this.age=age;
}
Person.prototype.say = function(){
    return "我的名字叫" + this.name+"今年"+this.age+"岁了";
}
var obj=new Person("laotie",88);//通过构造函数创建对象，必须使用new 运算符
console.log(obj.say());//我的名字叫laotie今年88岁了

//构造函数生成实例的过程：

// 1.当使用了构造函数，并且new 构造函数(),后台会隐式执行new Object()创建对象;
// 2.将构造函数的作用域给新对象，（即new Object()创建出的对象），而函数体内的this就代表new Object()出来的对象。
// 3.执行构造函数的代码。
// 4.返回新对象（后台直接返回）;
```

# 将上面的代码改成es6 的Class

```js

class Person{//定义了一个名字为Person的类
    constructor(name,age){//constructor是一个构造方法，用来接收参数
        this.name = name;//this代表的是实例对象
        this.age=age;
    }
    say(){//这是一个类的方法，注意千万不要加上function
        return "我的名字叫" + this.name+"今年"+this.age+"岁了";
    }
}
var obj=new Person("laotie",88);
console.log(obj.say());//我的名字叫laotie今年88岁了

```

实际上类的所有方法都在`prototype`上:

```js
Person.prototype.say=function(){//定义与类中相同名字的方法。成功实现了覆盖！
    return "我是来证明的，你叫" + this.name+"今年"+this.age+"岁了";
}
var obj=new Person("laotie",88);
console.log(obj.say());//我是来证明的，你叫laotie今年88岁了

//通过prototype新增方法：

Person.prototype.addFn=function(){
    return "我是通过prototype新增加的方法,名字叫addFn";
}
var obj=new Person("laotie",88);
console.log(obj.addFn());//我是通过prototype新增加的方法,名字叫addFn

//通过Object.assign动态为对象增加方法：

Object.assign(Person.prototype,{
    getName:function(){
        return this.name;
    },
    getAge:function(){
        return this.age;
    }
})
var obj=new Person("laotie",88);
console.log(obj.getName());//laotie
console.log(obj.getAge());//88

```

## constructor方法
是类的构造函数的默认方法，通过new命令生成对象实例时，自动调用该方法

```js
class Box{
    constructor(){
        console.log("啦啦啦，今天天气好晴朗");//当实例化对象时该行代码会执行。
    }
}
var obj=new Box();
```

**注意:**constructor方法如果没有显式定义，会隐式生成一个constructor方法。所以即使你没有添加构造函数，构造函数也是存在的。constructor方法默认返回实例对象this，但是也可以指定constructor方法返回一个全新的对象，让返回的实例对象不是该类的实例。

```js
class Desk{
    constructor(){
        this.xixi="我是一只小小小小鸟！哦";
    }
}
class Box{
    constructor(){
       return new Desk();// 这里没有用this哦，直接返回一个全新的对象
    }
}
var obj=new Box();
console.log(obj.xixi);//我是一只小小小小鸟！哦
```

constructor中定义的属性可以称为实例属性（即定义在this对象上），constructor外声明的属性都是定义在原型上的，可以称为原型属性（即定义在class上)。hasOwnProperty()函数用于判断属性是否是实例属性。其结果是一个布尔值， true说明是实例属性，false说明不是实例属性。in操作符会在通过对象能够访问给定属性时返回true,无论该属性存在于实例中还是原型中

```js
class Box{
    constructor(num1,num2){
        this.num1 = num1;
        this.num2=num2;
    }
    sum(){
        return num1+num2;
    }
}
var box=new Box(12,88);
console.log(box.hasOwnProperty("num1"));//true
console.log(box.hasOwnProperty("num2"));//true
console.log(box.hasOwnProperty("sum"));//false
console.log("num1" in box);//true
console.log("num2" in box);//true
console.log("sum" in box);//true
console.log("say" in box);//false
```

## 类的所有实例共享一个原型对象
它们的原型都是Person.prototype，所以proto属性是相等的

```js
class Box{
    constructor(num1,num2){
        this.num1 = num1;
        this.num2=num2;
    }
    sum(){
        return num1+num2;
    }
}
//box1与box2都是Box的实例。它们的__proto__都指向Box的prototype
var box1=new Box(12,88);
var box2=new Box(40,60);
console.log(box1.__proto__===box2.__proto__);//true
```

## class的继承

和其他面向对象的语言一样，class用extends实现继承。

1. 子类没用constructor的情况：

子类American继承父类Person，**子类没用定义constrcutor,则默认添加一个，并且在constrcutor中调用super函数,相当于调用父类的构造函数。**调用super函数是为了在子类中获得父类的this，调用之后this指向子类。也就是`父类.prototype.constructor.call(this)`。

```js
class American extends Person{
    aboutMe(){
        console.log(this.skin+' '+this.language)
    }
}
```

2. 子类有constructor函数

子类必须在constructor方法中调用super方法，否则new实例时会报错。因为子类没有自己的this对象，而是继承父类的this对象。如果不调用super函数，子类就得不到this对象。super()作为父类的构造函数，只能出现在子类的constructor()中；但是super指向父类的原型对象，可以调用父类的属性和方法。

```js
class Chinese extends Person{
    constructor(skin,language,positon){
        //console.log(this);//在没有调用super之前输出this会报错
        super(skin,language);
        //super();//不给父类构造函数传参，父类的构造数的值为undefined
        console.log(this);
        this.positon=positon;
    }
    aboutMe(){
        console.log(this.x+' '+this.y+' '+this.positon);
    }
}
```

