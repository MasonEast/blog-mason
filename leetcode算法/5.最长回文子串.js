/*
 * @lc app=leetcode.cn id=5 lang=javascript
 *
 * [5] 最长回文子串
 *
 * https://leetcode-cn.com/problems/longest-palindromic-substring/description/
 *
 * algorithms
 * Medium (25.75%)
 * Likes:    1055
 * Dislikes: 0
 * Total Accepted:    79.3K
 * Total Submissions: 303.7K
 * Testcase Example:  '"babad"'
 *
 * 给定一个字符串 s，找到 s 中最长的回文子串。你可以假设 s 的最大长度为 1000。
 * 
 * 示例 1：
 * 
 * 输入: "babad"    'aghdgflba'
 * 输出: "bab"
 * 注意: "aba" 也是一个有效答案。
 * 
 * 
 * 示例 2：
 * 
 * 输入: "cbbd"
 * 输出: "bb"
 * 
 * 
 */
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
  const arr = s.split('')
  let arr1 = [], result = []
  function defer (i, j, arr) {
    let a = arr[i], b = arr[j]

    if (i === j || i === (j - 1)) {

      return arr
    } else if (j - i > 1 && a !== b) {
      return 0
    } else {

      let m = i + 1, n = j - 1
      return defer(m, n, arr)
    }

  }
  for (let i = 0; i < arr.length; i++) {
    let m = arr.indexOf(arr[i]), n = arr.lastIndexOf(arr[i])
    let g = defer(m, n, arr)

    if (g) {

      arr1.push(arr.slice(m, n + 1))
    }
  }
  for (let m = 0; m < arr1.length; m++) {

    result.length > arr1[m].length ? result : result = arr1[m]
  }

  return result.join('')
};

