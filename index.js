
// let arr = [], index = 0
// function bst (tree, index) {
//     arr.push(tree.value)
//     if (tree.left) {
//         bst(tree.left, index++);
//     }
//     if (tree.right) {
//         bst(tree.right);
//     }
// }
var tree = {
    value: 1,
    left: {
        value: 2,
        left: {
            value: 5
        },
        right: {
            value: 6
        }
    },
    right: {
        value: 3,
    }
}
let arr = []
var levelOrderTraversal = function (tree) {
    if (!tree) {
        return
    }
    var que = []
    que.push(tree)
    while (que.length !== 0) {
        tree = que.shift()
        arr.push(tree.value)
        console.log(que)
        if (tree.left) {
            que.push(tree.left)
        }
        if (tree.right) {
            que.push(tree.right)
        }
    }
}
levelOrderTraversal(tree)