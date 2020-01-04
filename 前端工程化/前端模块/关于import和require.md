# 基本概念

require用于读取并执行js文件， 并返回该模块的exports对象， 若无指定模块， 会报错。
Node使用CommonJS模块规范， CommonJS规范加载模块是**同步**的， 只有加载完成， 才能执行后续操作。

import用于引入外部模块， 其他脚本等的函数， 对象或者基本类型。
import属于ES6的命令， 它和require不一样， 它会生成外部模块的引用而不是加载模块， 等到真正使用到该模块的时候才会去加载模块中的值。

# 静态编译和动态编译

## require静态编译

第一次加载某个模块时， Node会缓存该模块， 后续加载就从缓存中获取。

require是**运行时调用**，所以require理论上可以运用在代码的任何地方。

```js
//example.js
module.exports = {
    say: 'hi'
}

//main.js
require('./example').say = 'hello'
const test = require('./example').say
console.log(test)       //hello
```
上面的test重新引入example， 但它的say属性还是上面的`hello`， 说明并没有从新加载example模块， 而是从缓存中获取的该模块， 所以say属性不是`hi`

## import动态编译

ES6模块的动态编译： import模块时只是生成引用， 等到需要时才去取值， 所以不存在缓存的问题， 而且模块里的变量， 绑定其所在的模块。

import是**编译时调用**，虽然import命令具有提升效果，会提升到整个模块的头部， 但还是建议放在文件开头。

```js
// base.js
export var foo = 'bar';
setTimeout(() => foo = 'baz change', 500);

// main.js
import { foo } from './base';
console.log(foo); // bar
setTimeout(() => console.log(foo), 600);// baz changed
```

上面代码可以看到， 两次获取的foo值是不同的， 因为import是动态加载， 可以感知到`base.js`中的变化.

这样的设计，可以提高编译器效率，但是没有办法实现运行时加载。

因为require是运行时加载，所以import命令没有办法代替require的动态加载功能。

import为了实现动态加载， 引入了`import()`函数， 该函数返回一个promise对象。

```js

import(`./xxxx.js`)
  .then(module => {
    ...
  })
  .catch(err => {
    ...
  });
```

但是， 这样存在一个问题： 就是可能出现模块还没有加载完就被调用的情况， 此时会调用失败。

```js
// base.js
export var fish;

setTimeout(() => fish = 'fish', 500);


// main.js
import { fish } from './base';

console.log(fish); //undefined
```

# babel对于import的转码

因为当前浏览器并不完全支持import， 所以我们需要通过babel将import转码成require。

```js
// es6Test.js
import * as actions from './searchAccount.actions';
import kdbTheme from '../../../common/Dialog/panguTheme.css';
import { createCommonAccount } from './createDialog.actions';

console.log('createCommonAccount###', createCommonAccount);
// babel编译es6Test.js
/* import * as actions from './searchAccount.actions' */
var _searchAccount = require('./searchAccount.actions'); 

var actions = _interopRequireWildcard(_searchAccount);

/* import kdbTheme from '../../../common/Dialog/panguTheme.css' */
var _panguTheme = require('../../../common/Dialog/panguTheme.css');

var _panguTheme2 = _interopRequireDefault(_panguTheme);

/* import { createCommonAccount } from './createDialog.actions'*/
var _createDialog = require('./createDialog.actions');

console.log('createCommonAccount###', _createDialog.createCommonAccount);

function _interopRequireWildcard(obj) { 
    if (obj && obj.__esModule) { return obj; } 
    else {
        var newObj = {}; 
        if (obj != null) { 
            for (var key in obj) { 
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; 
            } 
        } 
        newObj.default = obj; 
        return newObj; 
    } 
}

function _interopRequireDefault(obj) { 
    return obj && obj.__esModule ? obj : { default: obj }; 
}
```

# 关于两者的使用

## require

1. require： 函数，用于导入模块

2. module.exports： 变量，用于导出模块


```js
module.exports = ...

exports.xxx = ...

const xxx = require('/xxx')
const {xxx1, xxx2, xxx3} = require('/xxx')

```

## import

1. import: 导入

2. export： 导出

```js
import xxx from '/xxx'

import * as xxx from '/xxx'

import {xxx1, xxx2, xxx3} from '/xxx'

export xxx

export {xxx1, xxx2, xxx3}

export default xxx
```


