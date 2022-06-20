<!--
 * @Description: 
 * @Date: 2022-06-18 15:30:31
 * @Author: mason
-->

## 递归方法

深度优先遍历就是先序遍历。

```js
const result = []
function DFS(root) {
  if(!root) return 

  result.push(root.val)
  DFS(root.left)
  DFS(root.right)
}
```

## 遍历方法

```js
// 后进先出

function DFS(root) {
  if(!root) return

  const result = [], stack = [root]

  while(stack.length) {
    const node = stack.pop()  // 从栈的底部取
    result.push(node.val)

    if(node.right) stack.push(node.right) // 先压入右子树再压左子树
    if(node.left) stack.push(node.left)
  }
}
```