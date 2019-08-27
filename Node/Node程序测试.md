自动测试是指编写代码来测试代码，而不 是手动运行程序中的功能。

# 单元测试

单元测试是直接测试代码逻辑，通常是在函数或方法层面，适用于所有类型的程序。

单元测试可以分为两大形态：
  测试驱动开发（TDD）
  行为驱动开发（BDD）

## assert模块

它可以测试一个条件，如果条件不满足，则抛出错误。

```js
class Todo {
  constructor(){
    this.todo = []    //定义待办事项数据库
  }

  add(item) {
    if(!item) throw new Error('Todo.prototype.add requires an item')
  }

  deleteAll(){
    this.todos = []
  }

  get
}