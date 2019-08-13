/*
 * @lc app=leetcode.cn id=3 lang=javascript
 *
 * [3] 无重复字符的最长子串
 *
 * https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/description/
 *
 * algorithms
 * Medium (30.20%)
 * Likes:    2011
 * Dislikes: 0
 * Total Accepted:    151.2K
 * Total Submissions: 500.7K
 * Testcase Example:  '"abcabcbb"'
 *
 * 给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。
 * 
 * 示例 1:
 * 
 * 输入: "abcabcbb"
 * 输出: 3 
 * 解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
 * 
 * 
 * 示例 2:
 * 
 * 输入: "bbbbb"
 * 输出: 1
 * 解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
 * 
 * 
 * 示例 3:
 * 
 * 输入: "pwwkew" dvdf
 * 输出: 3
 * 解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
 * 请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
 * 
 * 
 */
/**
 * @param {string} s
 * @return {number}
 */
var s = "pwwkew"
var lengthOfLongestSubstring = function (s) {
  let arr = s.split('');
  let arr2 = [];
  let result = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr2.indexOf(arr[i]) === -1) {

      arr2.push(arr[i])

    } else {
      console.log(arr2)
      if (result < arr2.length) {
        result = arr2.length
      }
      console.log('index', arr2.indexOf(arr[i]))
      arr2 = arr2.slice(arr2.indexOf(arr[i]) + 1)
      console.log('ii', arr2)
      // arr2.push(arr[i])

    }
  }
  console.log(arr2)
  if (result < arr2.length) {
    result = [...new Set(arr2)].length
    console.log(arr2)
  }
  console.log(result)
  return result
};
lengthOfLongestSubstring(s)

