# Promise定义
一个Promise是创建promise时不一定知道的值的代理。它允许将处理程序与异步操作的最终成功值或失败原因相关联。这允许异步方法返回类似于同步方法的值：**异步方法返回一个承诺，以便在将来的某个时刻提供值**
三种状态：
  pending：待定，初始值，既没有解决，也没有拒绝
  Fulfilled：操作成功
  Rejected：操作失败

状态改变：
  resolve：将Promise对象的状态从Pending变为Fulfilled
  reject：将Promise对象的状态从Pending变为Rejected


# Promise方法
Promise.all：只有所有承诺成功才会成功，否则会返回失败

Promise.allSettled：等到所有承诺都已解决（每个承诺可以被解决或拒绝）。返回一个promie，每个对象都描述每个promise的结果

Promise.race：就像所有promise比赛，谁先解析完成就返回谁。

Promise.reject：返回Promise因给定原因而被拒绝的新对象

Promise.resolve：返回Promise使用给定值解析的新对象

# Promise原型方法
Promise.prototype.catch：将拒绝处理程序回调附加到promise，并返回一个新的promise，如果调用它，则解析为回调的返回值，如果履行了promise，则返回其原始的履行值。

Promise.prototype.then：将履行和拒绝处理程序附加到promise，并返回一个新的promise

Promise.prototype.finally：在promise中附加一个处理程序，并返回一个新的promise，当promise结算时，无论履行还是拒绝，都会调用该处理程序。

## Promise.prototype.then()和Promise.prototype.catch()返回Promise，所以他们可以链接使用
eg：.then().then()

# Promise的使用
Promise接受一个函数作为参数，该函数又包含resolve和reject两个方法参数
```js
const p1 = new Promise((resolve, reject) => {
  if(xxx){
    resolve(xxxx)
  }else{
    reject(xxxxx)
  }
})
//此时的p1就是一个Promise对象实例,具有Promise原型上的三个方法
p1.then(res => {}).catch(rej => {}).finally(data => {})
```
# Promise的使用场景
1.串行执行若干异步任务
```js
job1.then(job2).then(job3).catch(err)
```
2.并行执行若干异步任务
```js
const p1 = new Promise(...)
const p2 = new Promise(...)
//同时执行p1和p2两个任务，并且在他们都执行完成后才进行下一步操作
Promise.all([p1, p2]).then(...)
//如果多个异步任务是为了容错，可以使用race
Promise.race([p1,p2]).then(...)
```

# 实现一个自己的Promise
1.因为Promise只接受一个函数作为参数，我们第一步先写一个方法判断这个参数是否合法
```js
const isFunc = value => typeof value === 'function'
```

2.因为Promise有三种状态，定义三个常量用于标记Promise对象的三种状态
```js
// 定义Promise的三种状态常量
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'
```

3.定义自己的Promise构造函数，并添加状态改变逻辑
```js
class MyPromise {
  //接受一个传入的参数，并判断其合法性
  constructor(handle){
    if(!isFunc(handle)){
      throw new Error('传入的参数不合法，要求参数是函数!')
    }
    //赋予初始状态
    this._state = PENDING

    this._value = undefined

    handle(this._resolve.bind(this), this._reject.bind(this))
  }
  _resolve(v){
    this._status = FULFILLED
    this._value = v
  }
  _reject(err){
    this._status = REJECTED
    this._value = err
  }
}
```

4.接下来是比较复杂的then方法
then方法可以接受两个参数，第一个参数执行成功的回调，第二个参数执行失败的回调，而且then方法返回的也是一个Promise对象
```js
      _then(fn1, fn2) {
        return new MyPromise((resolve, reject) => {
          function sucback(value) {
            let ret = typeof fn1 === 'function' && fn1(value) || value;
            if (ret && typeof ret['then'] == 'function') {    //判断 then中的 返回的是否是promise对象，如果是注册then方法
              ret.then(function (value) {
                resolve(value);
              });
            } else {
              resolve(ret);
            }
          }
          function errback(reason) {  //失败
            reason = typeof fn2 === 'function' && fn2(reason) || reason;

            reject(reason);
          }
          if (this._status === 'PENDING') {
          } else if (this._status === 'FULFILLED') {
            sucback(this._value);
          } else {
            errback(this._value);
          }
        })
      }
    }
```

5.一个简易版的Promise构造函数就完成了，完整代码
```js
    class MyPromise {

      //接受一个传入的参数，并判断其合法性
      constructor(handle) {
        const isFunc = v => typeof v === 'function'
        if (!isFunc(handle)) {
          throw new Error('传入的参数不合法，要求参数是函数!')
        }
        //赋予初始状态
        this._status = 'PENDING'

        this._value = undefined

        handle(this._resolve.bind(this), this._reject.bind(this))
      }
      _resolve(v) {
        this._status = 'FULFILLED'
        this._value = v
      }
      _reject(err) {
        this._status = 'err'
        this._value = err
      }
      _then(fn1, fn2) {
        return new MyPromise((resolve, reject) => {
          function sucback(value) {
            let ret = typeof fn1 === 'function' && fn1(value) || value;
            if (ret && typeof ret['then'] == 'function') {    //判断 then中的 返回的是否是promise对象，如果是注册then方法
              ret.then(function (value) {
                resolve(value);
              });
            } else {
              resolve(ret);
            }
          }
          function errback(reason) {  //失败
            reason = typeof fn2 === 'function' && fn2(reason) || reason;

            reject(reason);
          }
          if (this._status === 'PENDING') {
          } else if (this._status === 'FULFILLED') {
            sucback(this._value);
          } else {
            errback(this._value);
          }
        })
      }
    }


    //测试
    const p1 = new MyPromise((resolve, reject) => {
      if (false) {
        resolve('success')
      } else {
        reject('error')
      }
    })
    p1._then(res => {
      console.log(res)
    }, err => {
      console.log(err)
    })._then(res => {
      console.log(res)
    }, err => {
      console.log(err)
    })
```