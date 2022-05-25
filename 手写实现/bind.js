/**
 *
 *思路：将调用bind方法的对象作为属性添加到context中，并返回一个函数，函数执行调用context的该属性。
 */
Function.prototype.bind = function (context, ...args) {
  context = context || global;
  const fn = Symbol("fn");

  context[fn] = this;
  return function (..._args) {
    args = args.concat(_args);
    context[fn](...args);
    delete context[fn];
  };
};

var a = {
  b: 1,
};

function foo(a, b) {
  console.log(this.b, a, b);
}

var bar = foo.bind(a, 3);
console.log(bar(2));

Function.prototype.call = function (context, ...args) {
  context = context || global;
  const fn = Symbol("fn");

  context[fn] = this;
  context[fn](...args);

  delete context[fn];
};

Function.prototype.apply = function (context, argsArr) {
  context = context || global;
  const fn = Symbol("fn");

  context[fn] = this;
  context[fn](...argsArr);

  delete context[fn];
};
