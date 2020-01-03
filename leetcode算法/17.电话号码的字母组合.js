/*
 * @lc app=leetcode.cn id=17 lang=javascript
 *
 * [17] 电话号码的字母组合
 *
 * https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number/description/
 *
 * algorithms
 * Medium (49.85%)
 * Likes:    528
 * Dislikes: 0
 * Total Accepted:    66.6K
 * Total Submissions: 128.4K
 * Testcase Example:  '"23"'
 *
 * 给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。
 * 
 * 给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。
 * 
 * 
 * 
 * 示例:
 * 
 * 输入："23"
 * 输出：["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"].
 * 
 * 
 * 说明:
 * 尽管上面的答案是按字典序排列的，但是你可以任意选择答案输出的顺序。
 * 
 */

// @lc code=start
/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function (digits) {
    // let res = [], digitsArr = []
    // const arr = [
    //     ['a', 'b', 'c'],
    //     ['d', 'e', 'f'],
    //     ['g', 'h', 'i'],
    //     ['j', 'k', 'l'],
    //     ['m', 'n', 'o'],
    //     ['p', 'q', 'r'],
    //     ['s', 's', 't'],
    //     ['u', 'v', 'w'],
    //     ['x', 'y', 'z']
    // ]
    // for (let i = 0; i < digits.length; i++) {
    //     digitsArr.push(digits.charAt(i))
    // }
    // // let digitsArr = digits.split(',')
    // digitsArr.forEach((item, index) => {
    //     digitsArr[index] = arr[item - 2]
    // })
    // console.log(digitsArr)
    // let j = 0

    // while (j < digitsArr.length + 1) {

    //     // for (let i = 0; i < digitsArr.length; i++) {
    //     // res.push(digitsArr[i][k])
    //     // for (let j = 0; j < 3; j++) {
    //     //     console.log(j)
    //     //     res.push((digitsArr[i][k] + digitsArr[1][j]))
    //     // }
    //     // k++

    //     // for (let j = 0; j < 3; j++) {
    //     //     let k = 0, str = '', m = 0

    //     //     while (m < digitsArr.length) {
    //     //         while (k < digitsArr.length) {
    //     //             str += digitsArr[k][m]
    //     //             k++
    //     //         }
    //     //         res.push(str)
    //     //         m++
    //     //     }

    //     // }
    //     for (let k = 0; k < 3; k++) {
    //         let m = 0, str = ''
    //         while (m < digitsArr.length) {
    //             str = digitsArr[0][j] + digitsArr[m][k]
    //             m++
    //         }
    //         res.push(str)
    //     }

    //     // }
    //     j++
    // }
    // for (let i = 0; i < digitsArr.length; i++) {
    //     let j = 0
    //     while (j < 3) {
    //         // console.log(digitsArr[i][j])
    //         for (let k = 0; k < digitsArr.length; k++) {
    //             console.log(digitsArr[k][k])
    //             str = digitsArr[]
    //         }
    //         j++
    //     }
    // }
    // console.log(res)
    // 建立电话号码键盘映射
    let map = ['', 1, 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz']
    // 把输入字符串按单字符分隔变成数组，234=>[2,3,4]
    let num = digits.split('')
    // 保存键盘映射后的字母内容，如 23=>['abc','def']
    let code = []
    num.forEach(item => {
        if (map[item]) {
            code.push(map[item])
        }
    })
    let comb = (arr) => {
        // 临时变量用来保存前两个组合的结果
        let tmp = []
        // 最外层的循环是遍历第一个元素，里层的循环是遍历第二个元素
        console.log(111, arr)

        for (let i = 0, il = arr[0].length; i < il; i++) {
            for (let j = 0, jl = arr[1].length; j < jl; j++) {
                tmp.push(`${arr[0][i]}${arr[1][j]}`)
            }
        }
        arr.splice(0, 2, tmp)
        if (arr.length > 1) {
            comb(arr)
        } else {
            return tmp
        }
        return arr[0]
    }
    if (code.length < 2) {
        return code.length === 0 ? [] : code[0].split('')
    }
    return comb(code)
};
// @lc code=end

