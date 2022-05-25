// 继承
// 属性写在构造函数中，方法写在原型上

function Foo(name) {
  this.name = name;
}

Foo.prototype.say = function () {
  console.log("hello");
};

function Bar(name, age) {
  Foo.call(this, name);
  this.age = age;
}

Bar.prototype = Object.create(Foo.prototype);
Bar.prototype.constructor = Bar;

Bar.prototype.go = function () {
  console.log("go");
};

const a = new Bar("a", 13);

console.log(a);

a.go();
a.say();
