# 类型别名

类型别名用来给一个类型起个新名字

```js
//使用type创建类型别名,常用于联合类型

type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}
```

# 字符串字面量类型

用来约束取值只能是某几个字符串中的一个。

```js
//也是使用type来定义的

type EventNames = 'click' | 'scroll' | 'mousemove';
function handleEvent(ele: Element, event: EventNames) {
    // do something
}

handleEvent(document.getElementById('hello'), 'scroll');  // 没问题
handleEvent(document.getElementById('world'), 'dbclick'); // 报错，event 不能为 'dbclick'
```

# 元组

数组合并了相同类型的对象，而元组合并了不同类型的对象。

# 枚举

枚举（Enum）类型用于取值被限定在一定范围内的场景，比如一周只有七天。

```js
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};

//枚举成员会被赋值为从0开始递增的数字
console.log(Days["Tue"] === 2); // true
console.log(Days["Sat"] === 6); // true

console.log(Days[0] === "Sun"); // true
console.log(Days[1] === "Mon"); // true
```

## 常数项和计算所得项

枚举项有两种类型： 常数项和计算所得项

```js
enum Color {Red, Green, Blue = "blue".length}
```

## 常数枚举

常数枚举是使用 `const enum`定义的枚举类型
```js
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

## 外部枚举

```js
declare enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

# 类

JavaScript通过构造函数实现类的概念，通过原型链实现继承。ES6中使用了class

类相关的概念：

1. 类： 定义了一件事物的抽象特点，包含它的属性和方法
2. 对象： 类的实例，通过new生成
3. 面向对象（OOP）的三大特性： **封装， 继承， 多态**
4. 多态： 由继承而产生了相关的不同的类，对同一个方法可以有不同的响应。
5. 修饰符： 一些关键字，用于限定成员或类型的性质，比如`public`
6. 抽象类： 抽象类是供其他类继承的基类，抽象类不允许被实例化。抽象类中的抽象方法必须在子类中被实现
7. 接口： 不同类之间公有的属性或方法，可以抽象成一个接口。接口可以被类实现，一个类只能继承自另一个类，但是可以实现多个接口。

## TypeScript中类的用法

ts可以使用三种访问修饰符，分别是`public`, `private`和`protected`

public: 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 public 的

private: 修饰的属性或方法是私有的，不能在声明它的类的外部访问

protected: 修饰的属性或方法是受保护的，它和 private 类似，区别是它在子类中也是允许被访问的

```js
class Animal {
    private name;
    public constructor(name) {
        this.name = name;
    }
}

let a = new Animal('Jack');
console.log(a.name); // Jack
a.name = 'Tom';
```

## 抽象类

abstract用于定义抽象类和其中的抽象方法。

1. 抽象类不允许被实例化
2. 抽象类中的抽象方法必须被子类实现

```js
abstract class Animal {
    public name;
    public constructor(name) {
        this.name = name;
    }
    public abstract sayHi();
}

let a = new Animal('Jack');   //报错

class Cat extends Animal {
    public eat() {
        console.log(`${this.name} is eating.`);
    }
}

let cat = new Cat('Tom');    //报错，因为没有实现抽象方法sayHi

```

## 给类加上ts的类型

```js
class Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    sayHi(): string {
      return `My name is ${this.name}`;
    }
}

let a: Animal = new Animal('Jack');
console.log(a.sayHi()); // My name is Jack
```

# 类与接口

接口可以用于对对象的形状进行描述，也可以对类的一部分行为进行抽象。

## 类实现接口

```js
interface Alarm {
    alert();
}

class Door {
}

class SecurityDoor extends Door implements Alarm {
    alert() {
        console.log('SecurityDoor alert');
    }
}

class Car implements Alarm {
    alert() {
        console.log('Car alert');
    }
}
```

## 一个类可以实现多个接口

```js
interface Alarm {
    alert();
}

interface Light {
    lightOn();
    lightOff();
}

class Car implements Alarm, Light {
    alert() {
        console.log('Car alert');
    }
    lightOn() {
        console.log('Car light on');
    }
    lightOff() {
        console.log('Car light off');
    }
}
```

## 接口继承接口

```js
interface Alarm {
    alert();
}

interface LightableAlarm extends Alarm {
    lightOn();
    lightOff();
}
```

## 接口继承类

```js
class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```

# 泛型

泛型是指在定义函数， 接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

```js
function createArray(length: number, value: any): Array<any> {    //数组泛型
    let result = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```

上面代码的缺陷就是它没有准确的定义返回值得类型。

```js
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray<string>(3, 'x'); // ['x', 'x', 'x']
```
我们在函数名后添加了 <T>，其中 T 用来指代任意输入的类型，在后面的输入 value: T 和输出 Array<T> 中即可使用了。


