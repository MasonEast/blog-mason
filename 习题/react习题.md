<!--
 * @Description: 
 * @Date: 2019-10-12 15:41:40
 * @Author: mason
-->
## 1. 关于router的一些理解：

主要有hashRouter和BrowserRouter两种， hashRouter的实现主要依赖于url中的hash值变化， 浏览器通过监听hash值的变化实现局部更新；BrowserRouter主要建立在浏览器的history相关api的基础之上， 依靠相关api实现路由跳转。

## 2. 关于redux的理解：

在我的理解就是加了限制的发布订阅模式，使用redux有三个原则： 单一数据源， state是只读的， 使用纯函数进行修改。Redux主要由Store， action， Reducer三部分组成， Store负责数据的存储， Action负责数据来源， Reducer负责使用纯函数进行数据处理（纯函数： 传入参数相同， 返回结果必然相同，没有副作用。）

## 3. 关于React源码的理解：
