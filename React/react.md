对于开发者来说，重要的是区分开哪些属于 data，哪些属于 render，想要更新用户界面，要做的就是更新 data，用户界面自然会做出响应，所以 react 实践的也是“函数式编程”的思想。
纯函数指的是没有任何副作用，输出完全依赖于输入的函数，两次函数调用如果输入相同，得到的结果也绝对相同。

React 的优势：让开发者专注于描述用户界面“显示成什么样子”，而不是重复思考“如何去显示”，这样可以大大提高开发效率，也让代码更加容易管理

软件设计的通则：高内聚和低耦合
高内聚指的是把逻辑紧密相关的内容放在一个组件中
低耦合指的是不同组件之间的依赖关系要尽量弱化，也就是每个组件要尽量独立

React 组件的数据分为两种：prop 和 state
无论 prop 或者 state 的改变，都可能引发组件的重新渲染。
Prop：组件的对外接口
开发模式可以使用 propTypes 来避免犯错，发布时可以通过 babel-react-optimize 去掉这些东西。
defaultProps 可以给组件一个默认值，省去判断条件。
组件绝不应该去修改传入的 props 值

State：组件的内部状态，相当于组件的记忆，其存在的意义就是被修改，每一次通过 this.setState 函数修改 state 就改变了组件的状态。

组件的生命周期：
装载过程：组件第一次在 DOM 树中渲染的过程；
更新过程：当组件被重新渲染的过程；
卸载过程：组件从 DOM 中删除的过程

装载过程依次调用的函数：
Constructor
//getInitialState
//getDefaultProps
componentWillMount
Render
componentDidMount

值得一提，不是每个组件都需要定义自己的构造函数，一个 react 组件需要构造函数，往往是为了下面的目的：
初始化 state
绑定成员函数的 this 环境

更新过程依次调用的函数：
componentWillReceiverProps
shouldComponentUpdate
componentWillUpdate
Render
componentDidUpdate
每个 React 组件都可以通过 forceUpdate 函数强行引发依次重新渲染。
在 React 组件的组合中，完全可以只渲染一个子组件，而其他组件完全不需要渲染，这是提高 react 性能的重要方式.

除了 render 函数，shouldComponentUpdate 可能是 react 组件生命周期中最重要的一个函数了。
说 render 重要，是因为 render 函数决定了该渲染什么，说 shouldCpmponentUpdate 重要是因为他决定了一个组件什么时候不需要渲染
若我们要追求更高的性能，就不能满足于默认实现，需要定制 shouldComponentUpdate

卸载过程只涉及一个函数 componentWillUnmount，当 react 组件要从 DOM 树上删除掉之前会调用

第三章从 Flux 到 Redux

Flux 一族框架（包括 Redux）贯彻的最重要的观点就是单向数据流
MVC 框架：
Model，View，Controller
在 MVC 中让 View 和 Model 直接对话就是灾难，而 MVC 最大的问题就是无法禁止 View 和 Model 之间的直接对话。

Redux 的三个基本原则：
唯一数据源
保持状态只读：不能直接修改状态，要修改 store 的状态，必须要通过派发一个 action 对象完成。
数据改变只能通过纯函数完成：这里说的纯函数是 Reducer

“如果你愿意限制做事方式的灵活度，你几乎总会发现可以做得更好
一一－John earmark

**模块接口**
在最理想的情况下，我们应该通过增加代码就能增加系统的功能，而不是通过对现有代码的修改来增加功能。

### 状态树的设计

设计原则：
一个模块控制一个状态节点 state；
避免冗余数据；
树形结构扁平；

store 中的 state 只能对应一个 reducer 来做修改，

归根到底，JSX 会被 babel 转移成一个嵌套的函数调用，在这个函数调用中自然无法插入一个语句进去。

高阶组件就是根据一个组件类产生一个新的组件类。

### 定义高阶组件的意义：

1.重用代码 2.修改现有 React 组件的行为。

#### 高阶组件的实现方式可以分为两大类：

##### 1.代理方式的高阶组件：

特点：返回的新组件类直接继承自 React.Component 类，新组件扮演的角色是传入参数组件的一个“代理”，在新组件的 render 函数中，把被包裹组件渲染出来，除了高阶组件自己要做的工作，其余功能全都转手给了被包裹的组件。
**应用场景：**
操纵 prop：新组件的 render 函数相当于一个代理，完全决定如何使用被包裹的组件，所以可以操作 this.props
访问 ref：

```javascript
const refsHoc = (WrappedComponent) => {
constructor(){
  super(...arguments);
  this.linkRef = this.linkRef.bind(this);
}

      linkRef(wrappedInstance) {
        this._root = warppedInstance;
      }

      render () {
        const props = {...this.props, ref: this.linkRef};
        return <WrappedComponent {...props} />
      }
    }
```

    这个refsHoc的工作原理其实也是增加传递给被包裹组件的props，只是利用了ref这个特殊的prop，ref这个prop可以是一个函数，在被包裹组件的装载过程完成的时候被调用，参数就是被装载的组件本身。
    我们只要、需要知道高阶组件有访问ref这种可能，并不意味着我们必须要使用这种高阶组件。
    抽取状态：在傻瓜组件和容器组件的关系中，通常让傻瓜组件不要管理自己的状态，只要做一个无状态的组件就好，所有状态的管理都交给外面的容器组件，这个模式就是“抽取状态”。

包装组件：到目前为止，通过高阶组件产生的新组件，render 函数都是直接返回被包裹的组件，修改的只是 props 部分。其实 render 函数的 JSX 中完全可以引入其他元素，甚至可以组合多个 React 组件，这样就会得到更贱丰富多彩的行为。

##### 2.继承方式的高阶组件

继承方式的高阶组件采用**继承关系**关联作为参数的组件和返回的组件，假如传入的组件参数是 WrappedComponent，name 返回的组件就直接继承自 WrappedComponent。

```js
function removeUserProp(WrappedComponent) {
  return class NewComponent extends WrappedComponent {
    render() {
      const { user, ...otherProps } = this.props
      this.props = otherProps
      return super.render()
    }
  }
}
```

代理方式和继承方式最大的区别，**是使用被包裹组件的方式**

代理方式：
`return <WrapedComponent {...otherProps} />`
继承方式：
`return super.render()`
因为我们创建的新组件继承自传入的 WrappedComponent，所以直接调用 super.render 就能够得到渲染出来的元素。
需要注意：在代理方式下 WrappedComponent 经历了一个完整的生命周期，但在继承方式下 super.render 只是一个生命周期中的一个函数而已；
在代理方式下产生的新组件和参数组件是两个不同的组件，一次渲染，两个组件都要经历各自的生命周期，在继承方式下两者合二为一，只有一个生命周期
**使用场景**：
操纵生命周期函数

```js
const onluForLog = WrappedComponent => {
  return class NewComponent extends WrappedComponent {
    render() {
      if (this.props.loggedIn) {
        return super.render()
      } else {
        return null
      }
    }
  }
}
```

### 业界有句老话： 优先考虑组合，然后才考虑继承。我们应该尽量使用代理方式来构建高阶组件。

### 以函数为子组件

高阶组件有个局限：对原组件的 props 有了固化的要求

```js
const addUserProp = WrapComponent => {
  class WrappingComponent extends React.Component {
    render() {
      const newProps = { user: loggedinUser }
      return <WrapComponent {...this.props} {...newProps} />
    }
  }
  return WrappingComponent
}
```

要使用这个高阶组件，作为参数的组件必须要能够接受名为 user 的 prop。

以函数为子组件的模式就是为了克服高阶组件的这种局限而生的。在这种模式下，实现代码重用的不是一个函数，而是一个真正的 React 组件，这样 React 组件有个特点，**要求必须有子组件存在**，而且这个子组件必须是一个函数。
在组件实例的生命周期函数中，this.props.children 引用的就是子组件，render 函数会直接把`this.props.children`当做函数来调用，得到的结果就可以作为 render 返回结果的一部分。

```js
const loggedinUser = 'mock user'

class AddUserProp extends React.Component {
  render() {
    const user = loggedinUser
    return this.props.children(user)
  }
}
AddUserProp.propTypes = {
  children: React.PropTypes.func.isRequired
}
```

## Redux 和服务器通信

一个趋势是在 React 应用中使用浏览器原生支持的 fetch 函数来访问网络资源，fetch 函数返回的结果是一个**Promise 对象**。
解决跨域访问 API 的限制的一个方式就是通过代理，让我们的网页应用访问所属域名下的一个服务器 API 接口，这个服务器接口做的工作就是把这个请求发给另一个域名下的 API，拿到结果之后再转交给发起请求的浏览器网页应用。
代理：
在 package.json 添加：`"proxy":"http://www.123.com"`

### React 组件访问服务器

#### React 组件访问服务器的生命周期

1.在装载过程中，因为 Weather 组件并没有获得服务器结果，就不显示结果。

### Redux-thunk 中间件

使用 Redux 访问服务器，同样要解决的是异步问题。
Redux 的单向数据流是**同步操作**。
Redux 单向数据流是由 action 对象驱动的。而异步 action 对象不是一个普通的对象，而是一个函数。这个函数会在 redux-thunk 中间件被处理成对象发送给 reducer 函数。

说白了，redux-thunk 的工作是检查 action 对象是不是函数，如果不是函数就放行，完成普通 action 对象的生命周期，而如果发现 action 对象是函数，那就执行这个函数，并把 store 的 dispatch 函数和 getState 函数作为参数传递到函数中，处理过程到此为止。

## 单元测试

因为 React 和 Redux 基于函数式编程的思想，所以应用功能更容易拆分成容易测试的模块，对应产出代码的可测试性也更高。

### 单元测试的原则

从不同的角度，可将测试划分为：
手工测试和自动化测试；
白盒测试和黑盒测试；
单元测试，集成测试和端到端测试；
功能测试，性能测试和压力测试；

单元测试是一种自动化测试，测试代码和被测的对象非常相关。可以说，单元测试是保证代码质量的第一道防线。

### 单元测试环境的搭建

####单元测试框架
最常见的有以下两种： 1.用 Mocha 测试框架，但是 Mocha 并没有断言库，所以一般会配合 Chai 断言库来使用。 2.使用 React 本家出品的 Jest，Jest 自带断言功能。

在 create-react-app 创建的应用中自带了 Jest 库，使用`npm run test`就会进入单元测试的界面。

Jest 会自动在当前目录下寻找满足下列任一条件的 js 文件作为单元测试代码来执行： 1.文件名以.test.js 为后缀的代码文件； 2.存于**test**目录下的文件

#### 单元测试代码组织

单元测试代码的最小单位是测试用例，每一个测试用例考验的是被测试对象在某一个特定场景下是否有正确的行为。
每一个测试用例用一个`it`函数代码，第一个参数是字符串，代表测试用例名称，第二参数是一个函数，包含的就是实际的测试用例过程。

```js
it('should return object when invoked', () => {
  //增加断言语句
})
```

比较好的测试用例名遵循这样的模式：**它在什么样的情况下是什么行为**，应该尽量在 it 函数的第一个参数中使用这样有意义的字符串。

当有多个单元测试用例，就要考虑如何组织多个 it 函数实例，也就是 **测试套件** 的构建。
在 Jest 中用 **describe**函数描述测试套件：

```js
describe('actions', () => {
  it('should return object when invoked', () => {})
  //可以有更多的it函数调用
})
```

describe 函数包含于 it 函数一样的参数，主要区别就是 describe 可以包含 it 或者另一个 describe 函数调用，但是 it 却不能。

describe 有如下特殊函数可以帮助重用代码：
1.beforeAll，在开始测试套件之前执行一次；
2.afterAll
3.beforeEach
4.afterEach

#### 辅助工具

特定于 React 和 Redux 的单元测试
1.Enzyme
2.sinon.js
3.redux-mock-store

### 单元测试实例

```js
it('should create an action to add todo', () => {
  const text = 'first todo'
  const action = addTodo(text)

  expect(action.text).toBe(text)
  expect(action.completed).toBe(false)
  expect(action.type).toBe(actionTypes.ADD_TODO)
})
```

从上面的代码可以看出单元测试的基本套路： 1.预设参数； 2.调用纯函数； 3.调用 expect 验证纯函数的返回结果；

#### 异步 action 构造函数测试

一个异步 action 对象就是一个函数，被派发到 redux-thunk 中间件时会被执行、

使用 redux-mock-store 模拟：

```js
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
const middlewares = { thunk }
const createMockStore = configureStore(middleWares)
```

。。。。。。。。

## 扩展 Redux

### 中间件

特点： 1.中间件时独立的函数 2.中间件可以组合使用 3.中间件有一个统一的接口

#### 中间件接口

在 Redux 框架中，中间件处理的是 action 对象，。
每个中间件都会接收到`action`对象，在处理完毕之后，就会把 action 对象交给下一个中间件来处理，只有所有的中间件都处理完 action 对象之后，才轮到 reducer 来处理 action 对象。
每个中间件必须要定义成一个函数，返回一个接受`next`参数的函数，而这个接受 next 参数的函数又会返回一个接受 action 对象参数的函数。
一个实际上什么事都不做的中间件：

```js
function doNothingMiddleware({ dispatch, getState }) {
  return function(next) {
    return function(action) {
      return next(action)
    }
  }
}
```

以为 js 支持闭包，在这个函数里可以访问上两层函数的参数，所以可以根据需要做很多事情： 1.调用 dispatch 派发出一个新的 action 对象； 2.调用 getState 获得当前 Redux Store 上的状态； 3.调用 next 告诉 Redux 当前中间件工作完毕，让 Redux 调用下一个中间件； 4.访问 action 对象 action 上的所有数据

看下 redux-thunk：

```js
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument)
    }
    return next(action)
  }
}
```

#### 使用中间件

使用中间件有两种方法，两种方法都离不开 Redux 提供的 applyMiddleware。 1.

```js
import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'

const configureStore = applyMiddleware(thunkMiddleware){createStore}
const store = configureStore(reducer, initialState)
```

2.

```js
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

const win = window
const storeEnhancers = compose(
  applyMiddleware(...middlewares),
  win && win.devToolsExtension ? win.devToolsExtension() : f => f
)

const store = createStore(reducer, storeEnhancers)
```

createStore 最多可以接收三个参数，第一个参数 reducer，第二个参数如果是对象，就会被认为是创建 Store 时的**初始状态**，这样第三个参数如果存在就是增强器。

#### Promise 中间件

。。。。。。

#### 中间件开发原则

开发一个 Redux 中间件，首先要明确这个中间件的目的，尽量让一个中间件只完成一个功能，通过中间件的组合来完成丰富的功能。
每个中间件必须是独立存在的，但是也要考虑到其他中间件的存在。
**独立存在**指中间件不依赖和其他中间件的顺序，
**考虑其他中间件**指尊重其他件可能存在的事实。

一个中间件如果产生了新的 ation 对象，正确的方式是使用 dispatch 函数派发，而不是使用 next 函数

### Store Enhancer

中间件可以用来增强 Redux Store 的 dispatch 方法，但也仅限于 dispatch 方法，如果想要对 Redux Store 进行更深层次的增强定制，就需要 Store Enhancer。
在前面可以看到，applyMiddleware 函数的返回值被作为增强器传入 create Store,所以其实中间件功能就是利用增强器来实现的，毕竟定制 dispatch 只是 Store Enhancer 所能带来的改进之一。

#### 增强器接口

一个什么都不做的增强器：

```js
cosnt doNothingEnhancer = (createStore) => (reducer, preloadedState, enhancer) => {
  const store = createStore(reducer, preloadedState, enhancer)
  return store
}
```

基本的套路就是**利用所给的参数创造出一个 store 对象，然后定制 store 对象，最后把 store 对象返回去就可以**。

一个 store 对象中包含下列接口：
1.dispatch
2.subscribe
3.getState
4.replaceReducer
每一个接口都可以被修改。

增强器给每个 dispatch 函数的调用都输出一个日志：

```js
const logEnhancer = createStore => (reducer, preloadedState, enhancer) => {
  const sote = createStore(reducer, preloadedState, enhancer)

  const originalDispatch = store.dispatch
  store.dispatch = action => {
    console.log('dispatch action:', action)
    originalDispatch(action)
  }
  return store
}
```

增强器通常都使用这样的模式，将 store 上某个函数的引用存下来，给这个函数一个新的实现，但是在完成增强功能之后，还是要调用原有的函数，保持原有的功能。

创造一个增强器，给创造出来的 store 对象一个新的函数 reset，通过这一个函数就完成替换 reducer 和状态的功能：

```js
const RESET_ACTION_TYPE = '@@RESET'

const resetReducerCreator = (reducer, resetState) => (state, action) => {
  if (action.type === RESET_ACTION_TYPE) {
    return resetState
  } else {
    return reducer(state, action)
  }
}

const reset = createStore => (reducer, preloadedState, enhancer) => {
  const store = createStore(reducer, preloacedState, enhancer)

  const reset = (resetReducer, resetState) => {
    const newReducer = resetReducerCreator(resetReducer, resetState)
    store.replaceReducer(newReducer)
    store.dispatch({ type: RESET_ACTION_TYPE, state: resetState })
  }

  return {
    ...store,
    reset
  }
}

export default reset
```

## 动画

### 动画的实现方式

1.css3，利用浏览器对 css3 的原生支持实现动画 2.脚本方式，通过间隔一段时间用 js 来修改页面元素样式来实现动画。

#### css3 方式

缺点： CSS3 的 Transition 对一个动画规则的定义是基于时间和速度曲线的规则，也就是“在什么时间范围内，以什么样的运动节奏完成动画。”

#### 脚本方式

脚本方式最大的好处就是更强的灵活度，开发者可以任意控制动画的时间长度，亦可以控制每个时间点上元素渲染出来的样式，缺点就是消耗的计算资源更多。
最原始的脚本方式就是利用 setInterval 或者 setTimeout 来实现。

注：1000/60 约等于 16.每 16ms 渲染一次画面，就能达到比较流畅的动画效果。

### ReactCSSTransitionGroup

主要采用 CSS3 方式。

首先安装 react-addons-css-transition-group 这个库并导入

主要帮助在装载和卸载过程中实现动画。

### React-Motion 动画库

主要是采用脚本方式

## 多页面应用

### 单页应用

如果使用传统的多页面实现方式，那就是每次页面切换都是一次刷新： 1.浏览器发起 http 请求 2.浏览器解析 HTML 3.浏览器根据解析 HTML 内容判断是否还要下载其他资源 4.浏览器渲染页面内容。

单页面应用： 1.不同页面之间切换不会造成网页的刷新； 2.页面内容和 URL 保持一致。

### React-Router

React-Router 提供了两个组件来完成路由功能，一个是 Router，另一个是 Route。
Router 在整个应用中只需要一个实例，代表整个路由器。Route 则代表每一个路径对应页面的路由规则，一个应用中应该会有多个 Route 实例。




----------------------------------------------------------------




# day01
## 1. 项目开发准备
    1). 描述项目
    2). 技术选型 
    3). API接口/接口文档/测试接口
    
## 2. 启动项目开发
    1). 使用react脚手架创建项目
    2). 开发环境运行: npm start
    3). 生产环境打包运行: npm run build   serve build

## 3. git管理项目
    1). 创建远程仓库
    2). 创建本地仓库
        a. 配置.gitignore
        b. git init
        c. git add .
        d. git commit -m "init"
    3). 将本地仓库推送到远程仓库
        git remote add origin url
        git push origin master
    4). 在本地创建dev分支, 并推送到远程
        git checkout -b dev
        git push origin dev
    5). 如果本地有修改
        git add .
        git commit -m "xxx"
        git push origin dev
    6). 新的同事: 克隆仓库
        git clone url
        git checkout -b dev origin/dev
        git pull origin dev
    7). 如果远程修改
        git pull origin dev
        
## 4. 创建项目的基本结构
    api: ajax请求的模块
    components: 非路由组件
    pages: 路由组件
    App.js: 应用的根组件
    index.js: 入口js
    
## 5 引入antd
    下载antd的包
    按需打包: 只打包import引入组件的js/css
        下载工具包
        config-overrides.js
        package.json
    自定义主题
        下载工具包
        config-overrides.js
    使用antd的组件
        根据antd的文档编写
        
## 6. 引入路由
    下载包: react-router-dom
    拆分应用路由:
      Login: 登陆
      Admin: 后台管理界面
    注册路由:
      <BrowserRouter>
      <Switch>
      <Route path='' component={}/>
      
## 7. Login的静态组件
    1). 自定义了一部分样式布局
    2). 使用antd的组件实现登陆表单界面
      Form  / Form.Item
      Input
      Icon
      Button

## 8. 收集表单数据和表单的前台验证
    1). form对象
        如何让包含<Form>的组件得到form对象?  WrapLoginForm = Form.create()(LoginForm)
        WrapLoginForm是LoginForm的父组件, 它给LoginForm传入form属性
        用到了高阶函数和高阶组件的技术
    2). 操作表单数据
        form.getFieldDecorator('标识名称', {initialValue: 初始值, rules: []})(<Input/>)包装表单项组件标签
        form.getFieldsValue(): 得到包含所有输入数据的对象
        form.getFieldValue(id): 根据标识得到对应字段输入的数据
    
    3). 前台表单验证
        a. 声明式实时表单验证:
            form.getFieldDecorator('标识名称', {rules: [{min: 4, message: '错误提示信息'}]})(<Input/>)
        b. 自定义表单验证
            form.getFieldDecorator('标识名称', {rules: [{validator: this.validatePwd}]})(<Input/>)
            validatePwd = (rule, value, callback) => {
              if(有问题) callback('错误提示信息') else callack()
            } 
        c. 点击提示时统一验证
            form.validateFields((error, values) => {
              if(!error) {通过了验证, 发送ajax请求}
            })
            
## 9. 高阶函数与高阶组件
    1. 高阶函数
        1). 一类特别的函数
            a. 接受函数类型的参数
            b. 返回值是函数
        2). 常见
            a. 定时器: setTimeout()/setInterval()
            b. Promise: Promise(() => {}) then(value => {}, reason => {})
            c. 数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()
            d. 函数对象的bind()
            e. Form.create()() / getFieldDecorator()()
        3). 高阶函数更新动态, 更加具有扩展性
    
    2. 高阶组件
        1). 本质就是一个函数
        2). 接收一个组件(被包装组件), 返回一个新的组件(包装组件), 包装组件会向被包装组件传入特定属性
        3). 作用: 扩展组件的功能
        
    3. 高阶组件与高阶函数的关系
        高阶组件是特别的高阶函数
        接收一个组件函数, 返回是一个新的组件函数
        
# day02
## 1. 后台应用
    启动后台应用: mongodb服务必须启动
    使用postman测试接口(根据接口文档):
        访问测试: post请求的参数在body中设置
        保存测试接口
        导出/导入所有测试接口
        
## 2. 编写ajax代码
    1). ajax请求函数模块: api/ajax.js
        封装axios + Promise
        函数的返回值是promise对象  ===> 后面用上async/await
        自己创建Promise
          1. 内部统一处理请求异常: 外部的调用都不用使用try..catch来处理请求异常
          2. 异步返回是响应数据(而不是响应对象): 外部的调用异步得到的就直接是数据了(response --> response.data)
    2). 接口请求函数模块: api/index.js
        根据接口文档编写(一定要具备这个能力)
        接口请求函数: 使用ajax(), 返回值promise对象
    3). 解决ajax跨域请求问题(开发时)
        办法: 配置代理  ==> 只能解决开发环境
        编码: package.json: proxy: "http://localhost:5000"
    4). 对代理的理解
        1). 是什么?
            具有特定功能的程序
        2). 运行在哪?
            前台应用端
            只能在开发时使用
        3). 作用?
            解决开发时的ajax请求跨域问题
            a. 监视并拦截请求(3000)
            b. 转发请求(4000)
        4). 配置代理
            告诉代理服务器一些信息: 比如转发的目标地址
            开发环境: 前端工程师
            生产环境: 后端工程师
    5). async和await
        a. 作用?
           简化promise对象的使用: 不用再使用then()来指定成功/失败的回调函数
           以同步编码(没有回调函数了)方式实现异步流程
        b. 哪里写await?
            在返回promise的表达式左侧写await: 不想要promise, 想要promise异步执行的成功的value数据
        c. 哪里写async?
            await所在函数(最近的)定义的左侧写async
            
## 3. 实现登陆(包含自动登陆)
    login.jsx
        1). 调用登陆的接口请求
        2). 如果失败, 显示错误提示信息
        3). 如果成功了:
            保存user到local/内存中
            跳转到admin
        4). 如果内存中的user有值, 自动跳转到admin
    src/index.js
        读取local中user到内存中保存
    admin.jsx
        判断如果内存中没有user(_id没有值), 自动跳转到login
    storageUtils.js
        包含使用localStorage来保存user相关操作的工具模块
        使用第三库store
            简化编码
            兼容不同的浏览器
    memoryUtils.js
        用来在内存中保存数据(user)的工具类
        
## 4. 搭建admin的整体界面结构
    1). 整体布局使用antd的Layout组件
    2). 拆分组件
        LeftNav: 左侧导航
        Header: 右侧头部
    3). 子路由
        定义路由组件
        注册路由
        
## 5. LeftNav组件
    1). 使用antd的组件
        Menu / Item / SubMenu
    
    2). 使用react-router
        withRouter(): 包装非路由组件, 给其传入history/location/match属性
        history: push()/replace()/goBack()
        location: pathname属性
        match: params属性
    
    3). componentWillMount与componentDidMount的比较
        componentWillMount: 在第一次render()前调用一次, 为第一次render()准备数据(同步)
        componentDidMount: 在第一次render()之后调用一次, 启动异步任务, 后面异步更新状态重新render
    
    4). 根据动态生成Item和SubMenu的数组
        map() + 递归: 多级菜单列表
        reduce() + 递归: 多级菜单列表
    
    5). 2个问题?
        刷新时如何选中对应的菜单项?
            selectedKey是当前请求的path
        刷新子菜单路径时, 自动打开子菜单列表?
            openKey是 一级列表项的某个子菜单项是当前对应的菜单项
            
# day03

## 1. Header组件
    1). 界面静态布局
        三角形效果
    2). 获取登陆用户的名称显示
        MemoryUtils
    3). 当前时间
        循环定时器, 每隔1s更新当前时间状态
        格式化指定时间: dateUtils
    4). 天气预报
        使用jsonp库发jsonp请求百度天气预报接口
        对jsonp请求的理解
    5). 当前导航项的标题
        得到当前请求的路由path: withRouter()包装非路由组件
        根据path在menuList中遍历查找对应的item的title
    6). 退出登陆
        Modal组件显示提示
        清除保存的user
        跳转到login
    7). 抽取通用的类链接按钮组件
        通过...透传所有接收的属性: <Button {...props} />    <LinkButton>xxxx</LinkButton>
        组件标签的所有子节点都会成为组件的children属性
        
## 2. jsonp解决ajax跨域的原理
    1). jsonp只能解决GET类型的ajax请求跨域问题
    2). jsonp请求不是ajax请求, 而是一般的get请求
    3). 基本原理
        浏览器端:
            动态生成<script>来请求后台接口(src就是接口的url)
            定义好用于接收响应数据的函数(fn), 并将函数名通过请求参数提交给后台(如: callback=fn)
        服务器端:
            接收到请求处理产生结果数据后, 返回一个函数调用的js代码, 并将结果数据作为实参传入函数调用
        浏览器端:
            收到响应自动执行函数调用的js代码, 也就执行了提前定义好的回调函数, 并得到了需要的结果数据
           
# day04: Category组件

## 1. 使用antd组件构建分类列表界面
    Card
    Table
    Button
    Icon
        
## 2. 相关接口请求函数
    获取一级/二级分类列表
    添加分类
    更新分类
        
## 3. 异步显示一级分类列表    
    设计一级分类列表的状态: categorys
    异步获取一级分类列表: componentDidMount(){}
    更新状态, 显示

## 4. 显示二级分类列表
    设计状态: subCategorys / parentId / parentName
    显示二级分类列表: 根据parentId状态值, 异步获取分类列表
    setState()的问题
        setState()更新状态是异步更新的, 直接读取状态值还是旧的状态值
        setState({}, [callback]), 回调函数是在状态更新且界面更新之后执行, 可以在此获取最新的状态
        
## 5. 更新分类
    1). 界面
        antd组件: Modal, Form, Input
        显示/隐藏: showStatus状态为2/0
        
    2). 功能
        父组(Category)件得到子组件(AddForm)的数据(form)
        调用更新分类的接口
        重新获取分类列表
        
        
# day05

## 1. 添加分类
    1). 界面
        antd组件: Modal, Form, Select, Input
        显示/隐藏: showStatus状态为1/0
        
    2). 功能
        父组(Category)件得到子组件(AddForm)的数据(form)
        调用添加分类的接口
        重新获取分类列表

## 2. Product整体路由
    1). 配置子路由: 
        ProductHome / ProductDetail / ProductAddUpdate
        <Route> / <Switch> / <Redirect>
    
    2). 匹配路由的逻辑:
        默认: 逐层匹配   <Route path='/product' component={ProductHome}/>
        exact属性: 完全匹配
        
## 3. 分页实现技术(2种)
    1). 前台分页
        请求获取数据: 一次获取所有数据, 翻页时不需要再发请求
        请求接口: 
            不需要指定请求参数: 页码(pageNum)和每页数量(pageSize)
            响应数据: 所有数据的数组
    
    2). 基于后台的分页
        请求获取数据: 每次只获取当前页的数据, 翻页时要发请求
        请求接口: 
            需要指定请求参数: 页码(pageNum)和每页数量(pageSize)
            响应数据: 当前页数据的数组 + 总记录数(total)
    
    3). 如何选择?
        基本根据数据多少来选择
        
## 4. ProductHome组件
    1). 分页显示
       界面: <Card> / <Table> / Select / Icon / Input / Button
       状态: products / total
       接口请求函数需要的数据: pageNum, pageSize
       异步获取第一页数据显示
           调用分页的接口请求函数, 获取到当前页的products和总记录数total
           更新状态: products / total
       翻页:
           绑定翻页的监听, 监听回调需要得到pageNum
           异步获取指定页码的数据显示  
     
    2). 搜索分页
       接口请求函数需要的数据: 
           pageSize: 每页的条目数
           pageNum: 当前请求第几页 (从1开始)
           productDesc / productName: searchName 根据商品描述/名称搜索
       状态:  searchType / searchName  / 在用户操作时实时收集数据
       异步搜索显示分页列表
           如果searchName有值, 调用搜索的接口请求函数获取数据并更新状态
           
    3). 更新商品的状态
       初始显示: 根据product的status属性来显示  status = 1/2
       点击切换:
           绑定点击监听
           异步请求更新状态
    
    4). 进入详情界面
       history.push('/product/detail', {product})
    
    5). 进入添加界面
        history.push('/product/addupdate')
        
## 5. ProductDetail组件
    1). 读取商品数据: this.props.location.state.product
    2). 显示商品信息: <Card> / List 
    3). 异步显示商品所属分类的名称
        pCategoryId==0 : 异步获取categoryId的分类名称
        pCategoryId!=0: 异步获取 pCategoryId/categoryId的分类名称
    4). Promise.all([promise1, promise2])
        返回值是promise
        异步得到的是所有promsie的结果的数组
        特点: 一次发多个请求, 只有当所有请求都成功, 才成功, 并得到成功的数据,一旦有一个失败, 整个都失败

# day06
## 1. ProductAddUpdate
    1). 基本界面
        Card / Form / Input / TextArea / Button
        FormItem的label标题和layout
        
    2). 分类的级联列表
        Cascader的基本使用
        异步获取一级分类列表, 生成一级分类options
        如果当前是更新二级分类的商品, 异步获取对应的二级分类列表, 生成二级分类options, 并添加为对应option的children
        async函数返回值是一个新promise对象, promise的结果和值由async函数的结果决定
        当选择某个一级分类项时, 异步获取对应的二级分类列表, 生成二级分类options, 并添加为当前option的children
    
    3). 表单数据收集与表单验证
    
## 2. PicturesWall
    1). antd组件
        Upload / Modal / Icon
        根据示例DEMO改造编写
    2). 上传图片
        在<Upload>上配置接口的path和请求参数名
        监视文件状态的改变: 上传中 / 上传完成/ 删除
        在上传成功时, 保存好相关信息: name / url
        为父组件提供获取已上传图片文件名数组的方法
    3). 删除图片
        当文件状态变为删除时, 调用删除图片的接口删除上传到后台的图片
    4). 父组件调用子组件对象的方法: 使用ref技术
        1. 创建ref容器: thi.pw = React.createRef()
        2. 将ref容器交给需要获取的标签元素: <PicturesWall ref={this.pw} />  // 自动将将标签对象添加为pw对象的current属性
        3. 通过ref容器读取标签元素: this.pw.current

# day07

## 1. RichTextEditor
    1). 使用基于react的富文本编程器插件库: react-draft-wysiwyg
    2). 参考库的DEMO和API文档编写
    3). 如果还有不确定的, 百度搜索, 指定相对准确的关键字
    
## 2. 完成商品添加与修改功能
    1). 收集输入数据
        通过form收集: name/desc/price/pCategoryId/categoryId
        通过ref收集: imgs/detail
        如果是更新收集: _id
        将收集数据封装成product对象
    2). 更新商品
        定义添加和更新的接口请求函数
        调用接口请求函数, 如果成功并返回商品列表界面

## 3. 角色管理
    1). 角色前台分页显示
    2). 添加角色
    3). 给指定角色授权
        界面: Tree
        状态: checkedKeys, 根据传入的role的menus进行初始化
        勾选某个Node时, 更新checkedKeys
        点击OK时: 通过ref读取到子组件中的checkedKeys作为要更新product新的menus
                发请求更新product
        解决默认勾选不正常的bug: 利用组件的componentWillReceiveProps()

# day08

## 1. setState()的使用
    1). setState(updater, [callback]),
        updater为返回stateChange对象的函数: (state, props) => stateChange
        接收的state和props被保证为最新的
    2). setState(stateChange, [callback])
        stateChange为对象,
        callback是可选的回调函数, 在状态更新且界面更新后才执行
    3). 总结:
        对象方式是函数方式的简写方式
            如果新状态不依赖于原状态 ===> 使用对象方式
            如果新状态依赖于原状态 ===> 使用函数方式
        如果需要在setState()后获取最新的状态数据, 在第二个callback函数中读取

## 2. setState()的异步与同步
    1). setState()更新状态是异步还是同步的?
        a. 执行setState()的位置?
            在react控制的回调函数中: 生命周期勾子 / react事件监听回调
            非react控制的异步回调函数中: 定时器回调 / 原生事件监听回调 / promise回调 /...
        b. 异步 OR 同步?
            react相关回调中: 异步
            其它异步回调中: 同步
    
    2). 关于异步的setState()
        a. 多次调用, 如何处理?
            setState({}): 合并更新一次状态, 只调用一次render()更新界面 ---状态更新和界面更新都合并了
            setState(fn): 更新多次状态, 但只调用一次render()更新界面  ---状态更新没有合并, 但界面更新合并了
        b. 如何得到异步更新后的状态数据?
            在setState()的callback回调函数中

## 3. Component与PureComponent
    1). Component存在的问题?
        a. 父组件重新render(), 当前组件也会重新执行render(), 即使没有任何变化
        b. 当前组件setState(), 重新执行render(), 即使state没有任何变化
  
    2). 解决Component存在的问题
        a. 原因: 组件的shouldcomponentUpdate()默认返回true, 即使数据没有变化render()都会重新执行
        b. 办法1: 重写shouldComponentUpdate(), 判断如果数据有变化返回true, 否则返回false
        c. 办法2: 使用PureComponent代替Component
        d. 说明: 一般都使用PureComponent来优化组件性能
  
    3). PureComponent的基本原理
        a. 重写实现shouldComponentUpdate()
        b. 对组件的新/旧state和props中的数据进行浅比较, 如果都没有变化, 返回false, 否则返回true
        c. 一旦componentShouldUpdate()返回false不再执行用于更新的render()
  
    4). 面试题:
        组件的哪个生命周期勾子能实现组件优化?
        PureComponent的原理?
        区别Component与PureComponent?

## 4. 用户管理
    1). 显示用户分页列表
    2). 添加用户
    3). 修改用户
    4). 删除用户
    
## 5. 导航菜单权限控制
    1). 基本思路(依赖于后台): 
        角色: 包含所拥有权限的所有菜单项key的数组: menus=[key1, key2, key3]
        用户: 包含所属角色的ID: role_id
        当前登陆用户: user中已经包含了所属role对象
        遍历显示菜单项时: 判断只有当有对应的权限才显示
    2). 判断是否有权限的条件?
        a. 如果当前用户是admin
        b. 如果当前item是公开的
        c. 当前用户有此item的权限: key有没有menus中
        d. 如果当前用户有此item的某个子item的权限

## 高阶函数：
  一类特别的函数：  接受函数类型的参数；返回值是函数
  eg：定时器，
  Promise，
  数组遍历相关方法：forEach,filter,map,reduce,find,findIndex
  函数对象的bind()方法

  高阶函数更新动态，更加具有扩展性。
## 高阶组件：
  本质就是一个函数。
  特点：接受一个组件（被包装组件），返回一个新的组件（包装组件），包装组件会向被包装组件传入特定属性
  作用：扩展组件的功能
    
