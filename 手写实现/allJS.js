// Object.create

function _create(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}

// instanceof

function _instanceof(left, right) {
  // 获取对象的原型
  let proto = Object.getPrototypeOf(left);
  // 获取构造函数的 prototype 对象
  let prototype = right.prototype;

  // 判断构造函数的 prototype 对象是否在对象的原型链上
  while (true) {
    if (!proto) return false;
    if (proto === prototype) return true;
    // 如果没有找到，就继续从其原型上找，Object.getPrototypeOf方法用来获取指定对象的原型
    proto = Object.getPrototypeOf(proto);
  }
}
// new
// _new(构造函数, 初始化参数)
function _new() {
  let newObject = null;
  let constructor = Array.prototype.shift.call(arguments);
  let result = null;
  if (typeof constructor !== "function") {
    console.error("type error");
    return;
  }

  // 创建一个以构造函数原型为参数的新对象
  newObject = Object.create(constructor.prototype);
  // 执行构造函数，将参数传入
  result = constructor.apply(newObject, arguments);
  // 如果result是对象则返回执行构造函数的结果，否则返回新创建的对象
  const flag =
    result && (typeof result === "object" || typeof result === "function");
  return flag ? result : newObject;
}

// reduce

Array.prototype._reudce = function (fn, initialValue) {
  const arr = [].concat(this);
  if (!arr.length) return;

  let pre = initialValue ? initialValue : null;
  for (let i = 0; i < arr.length; i++) {
    pre = fn.call(null, pre, arr[i], i, this);
  }
  return pre;
};

// call

Function.prototype.call = function (context, ...args) {
  context = context || global;
  const fn = Symbol("fn");

  context[fn] = this;
  context[fn](...args);

  delete context[fn];
};

// bind

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

// Promise

class _Promise {
  constructor(fn) {
    this.callback = [];
    this.state = "PENDING";
    this.value = null;

    fn(this._resolve.bind(this), this._reject.bind(this));
  }

  _resolve(value) {
    if ((value && typeof value === "object") || typeof value === "function") {
      let then = value.then;

      if (typeof then === "function") {
        then.call(value, this._resolve.bind(this), this._reject.bind(this));

        return;
      }
    }

    this.state = "FULFILLED";
    this.value = value;
    this.callback.forEach((cb) => this._handle(cb));
  }

  _reject(error) {
    this.state = "REJECTED";
    this.value = error;
    this.callback.forEach((cb) => this._handle(cb));
  }

  _handle(callback) {
    if (this.state === "PENDING") {
      this.callback.push(callback);
      return;
    }
    let cb =
      this.state === "FULFILLED" ? callback.onFulfilled : callback.onRejected;
    if (!cb) {
      cb = this.state === "FULFILLED" ? callback.resolve : callback.reject;
      cb(this.value);
      return;
    }

    let ret;
    try {
      ret = cb(this.value);
      cb = this.state === "FULFILLED" ? callback.resolve : callback.reject;
    } catch (error) {
      ret = error;
      cb = callback.reject;
    } finally {
      cb(ret);
    }
  }

  then(onFulfilled, onRejected) {
    return new _Promise((resolve, reject) => {
      return this._handle({
        onFulfilled,
        onRejected,
        resolve,
        reject,
      });
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

// Promise all

Promise.myAll = (list) => {
  return new Promise((resolve, reject) => {
    let result = [];
    let count = 0;
    list.forEach((p, i) => {
      // 可能会出现 非promise
      Promise.resolve(p)
        .then((res) => {
          result[i] = res;
          console.log("res", res, list.length, count);
          console.log("result", result, result.length);
          console.log("count", count);
          count++;
          if (count === list.length) resolve(result); // 不能拿 list.length === result.length 做结束条件,因为 length是根据最大值来的,有了2|3 就直接认定长度是2|3了.坑在这里了
        })
        .catch(reject);
    });
  });
};

// 柯里化

function curry(fn, ...args) {
  return fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args);
}

function toCurry(func, ...args) {
  // ↑需要柯里化的函数作为参数
  // ↑也可以有初始参数传入
  // ↑缓存在args中
  return function () {
    // 合并上一次缓存的参数和本次传入的参数
    args = [...args, ...arguments];
    // 判断参数数量是否足够
    if (args.length < func.length) {
      // 如果不够，继续递归
      // 注意，这里每一次递归都会形成新的闭包
      // 保证柯里化函数每一步调用都是独立的，互不影响
      return toCurry(func, ...args);
    }
    // 如果参数满足数量，执行函数并返回结果
    else return func.apply(null, args);
  };
}

// 防抖

function _debounce(fn, wait) {
  let timer = null;

  return function (...args) {
    let ctx = this;
    // 如果重复触发就移除之前的定时器，重新计数
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(ctx, args);
    }, wait);
  };
}

// 节流

function _throttle(fn, wait) {
  let varTime = Date.now();

  return function (...args) {
    const ctx = this;
    const curTime = Date.now();

    // 如果两次时间间隔超过了指定时间，则执行函数。
    if (curTime - varTime >= wait) {
      varTime = Date.now();
      fn.apply(ctx, args);
    }
  };
}

// 类型判断

function getType(value) {
  if (value === null) {
    return "null";
  }

  // type可以准确判断基础类型，引用类型只能判断函数，其他都是object
  const type = typeof value;
  if (type !== "object") {
    return type;
  }

  return Object.prototype.toString
    .call(value)
    .replace(/^\[object (\S+)\]$/, "$1");
}

// 浅拷贝

function shallowCopy(obj) {
  let result;
  if (typeof obj === "object") {
    for (let i in obj) {
      result[i] = obj[i];
    }
  } else {
    result = obj;
  }
  return result;
}

// 深拷贝

function deepCopy(obj) {
  let result;
  if (typeof obj === "object") {
    result = obj.constructor === Array ? [] : {};
    for (let i in obj) {
      result[i] = typeof obj[i] === "object" ? deepCopy(obj[i]) : obj[i];
    }
  } else {
    result = obj;
  }
  return result;
}

// lodash get

function get(object, path, defaultVal = "undefined") {
  // 先将path处理成统一格式
  let newPath = [];
  if (Array.isArray(path)) {
    newPath = path;
  } else {
    // 先将字符串中的'['、']'去除替换为'.'，split分割成数组形式
    newPath = path.replace(/\[/g, ".").replace(/\]/g, "").split(".");
  }

  // 递归处理，返回最后结果
  return (
    newPath.reduce((o, k) => {
      console.log(o, k); // 此处o初始值为下边传入的 object，后续值为每次取的内部值
      return (o || {})[k];
    }, object) || defaultVal
  );
}
