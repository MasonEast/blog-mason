<!--
 * @Description: 
 * @Date: 2022-06-18 15:30:37
 * @Author: mason
-->

## 遍历方法 

```js
// 先进先出
function BFS(root) {
  const result = []
  const stack = [root]
  while(stack.length) {
    const len = stack.length
    for(let i = 0; i < len; i++){
      const node = stack.shift()
      result.push(node.val)

      if(node.left) stack.push(node.left)
      if(node.right) stack.push(node.right)
    }
  }
  return result
}
```

## 递归方法

```js
const result = []
const stack = [root]

function BFS() {
    const node = stack.shift()
    if(node) {
      result.push(node.val)
      if(node.left) stack.push(node.left)
      if(node.right) stack.push(node.right)
      BFS()
    }
}
```
