// Object.creaate

function _create(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}

// instanceof

function _instanceoof(left, right) {
  let proto = Object.getPrototypeOf(left),
    prototype = right.prototype;

  while (true) {
    if (!proto) return false;
    if (proto === prototype) return true;
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

// call

Function.prototype._call = function (ctx = window || global) {
  ctx.fn = this;
  const args = [...arguments].slice(1);
  const result = ctx.fn(...args);
  delete ctx.fn;
  return result;
};

// bind

Function.prototype._bind = function (ctx = window || global) {
  ctx.fn = this;
  const args = [...arguments].slice(1);

  return function (...args2) {
    ctx.fn(...args.concat(args2));
    delete ctx.fn;
  };
};

// 柯里化

function curry(fn, ...args) {
  return fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args);
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
