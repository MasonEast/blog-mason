/*
 * @lc app=leetcode.cn id=14 lang=javascript
 *
 * [14] 最长公共前缀
 *
 * https://leetcode-cn.com/problems/longest-common-prefix/description/
 *
 * algorithms
 * Easy (33.89%)
 * Likes:    699
 * Dislikes: 0
 * Total Accepted:    122.4K
 * Total Submissions: 351.8K
 * Testcase Example:  '["flower","flow","flight"]'
 *
 * 编写一个函数来查找字符串数组中的最长公共前缀。
 * 
 * 如果不存在公共前缀，返回空字符串 ""。
 * 
 * 示例 1:
 * 
 * 输入: ["flower","flow","flight"]
 * 输出: "fl"
 * 
 * 
 * 示例 2:
 * 
 * 输入: ["dog","racecar","car"]
 * 输出: ""
 * 解释: 输入不存在公共前缀。
 * 
 * 
 * 说明:
 * 
 * 所有输入只包含小写字母 a-z 。
 * 
 */
/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
    var firstStrs = strs[0];
    var result = '';
    if (!strs.length) {
        return result;
    }
    for (var i = 0; i < firstStrs.length; i++) {
        for (var j = 1; j < strs.length; j++) {
            if (firstStrs[i] != strs[j][i]) {
                return result;
            }
        }
        result += firstStrs[i];
    }
    return result;
};

