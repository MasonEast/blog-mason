class MyPromise {
  constructor(fn) {
    this.callbacks = [];
    this.state = "PENDING";
    this.value = null;

    fn(this._resolve.bind(this), this._reject.bind(this));
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) =>
      this._handle({
        onFulfilled: onFulfilled || null,
        onRejected: onRejected || null,
        resolve,
        reject,
      })
    );
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  _handle(callback) {
    if (this.state === "PENDING") {
      this.callbacks.push(callback);

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

  _resolve(value) {
    if (value && (typeof value === "object" || typeof value === "function")) {
      let then = value.then;

      if (typeof then === "function") {
        then.call(value, this._resolve.bind(this), this._reject.bind(this));

        return;
      }
    }

    this.state === "FULFILLED";
    this.value = value;
    this.callbacks.forEach((fn) => this._handle(fn));
  }

  _reject(error) {
    this.state === "REJECTED";
    this.value = error;
    this.callbacks.forEach((fn) => this._handle(fn));
  }
}

const p1 = new MyPromise(function (resolve, reject) {
  setTimeout(() => reject(new Error("fail")), 3000);
});

const p2 = new MyPromise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000);
});

p2.then((result) => console.log(result)).catch((error) => console.log(error));

Promise.myAll = (list) => {
  return new Promise((resolve, reject) => {
    let result = [];
    let count = 0;
    list.forEach((p, i) => {
      // 可能会出现 非promise
      Promise.resolve(p)
        .then((res) => {
          result[i] = res;
          console.log("res", res);
          console.log("result", result, result.length);
          console.log("count", count);
          count++;
          if (count == list.length) resolve(result); // 不能拿 list.length === result.length 做结束条件,因为 length是根据最大值来的,有了2|3 就直接认定长度是2|3了.坑在这里了
        })
        .catch(reject);
    });
  });
};

Promise.myAll([1, Promise.resolve(2), Promise.reject(3)])
  .then((v) => console.log(v))
  .catch((v) => console.log(v)); // 3
Promise.myAll([
  new Promise((res) => setTimeout(() => res(1), 5000)),
  2,
  Promise.resolve(3),
])
  .then((v) => console.log(v))
  .catch((err) => console.log(err)); // [1, 2, 3]
Promise.myAll([Promise.resolve(1), 2]).then((res) => {
  console.log(res);
}); // [1, 2]
