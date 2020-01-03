/*
 * @lc app=leetcode.cn id=7 lang=javascript
 *
 * [7] 整数反转
 *
 * https://leetcode-cn.com/problems/reverse-integer/description/
 *
 * algorithms
 * Easy (32.59%)
 * Likes:    1191
 * Dislikes: 0
 * Total Accepted:    155.2K
 * Total Submissions: 474.6K
 * Testcase Example:  '123'
 *
 * 给出一个 32 位的有符号整数，你需要将这个整数中每位上的数字进行反转。
 * 
 * 示例 1:
 * 
 * 输入: 123
 * 输出: 321
 * 
 * 
 * 示例 2:
 * 
 * 输入: -123
 * 输出: -321
 * 
 * 
 * 示例 3:
 * 
 * 输入: 120
 * 输出: 21
 * 
 * 
 * 注意:
 * 
 * 假设我们的环境只能存储得下 32 位的有符号整数，则其数值范围为 [−2^31,  2^31 − 1]。请根据这个假设，如果反转后整数溢出那么就返回
 * 0。
 * 
 */
/**
 * @param {number} x
 * @return {number}
 */

var reverse = function (x) {
  if (Math.pow(2, 31) - 1 < x || Math.pow(-2, 31) > x) {
    return 0
  }
  let arr = x.toString().split('')
  arr.reverse()


  if (arr[arr.length - 1] === '-') {
    console.log(['-'].concat(arr.slice(0, arr.length - 1)))
    return Number(['-'].concat(arr.slice(0, arr.length - 1)).join(''))
  }
  else {
    return Number(arr.join(''))
  }
};


