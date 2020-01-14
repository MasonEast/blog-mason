/*
 * @lc app=leetcode.cn id=22 lang=javascript
 *
 * [22] 括号生成
 *
 * https://leetcode-cn.com/problems/generate-parentheses/description/
 *
 * algorithms
 * Medium (70.89%)
 * Likes:    678
 * Dislikes: 0
 * Total Accepted:    63.3K
 * Total Submissions: 87.1K
 * Testcase Example:  '3'
 *
 * 给出 n 代表生成括号的对数，请你写出一个函数，使其能够生成所有可能的并且有效的括号组合。
 * 
 * 例如，给出 n = 3，生成结果为：
 * 
 * [
 * ⁠ "((()))",
 * ⁠ "(()())",
 * ⁠ "(())()",
 * ⁠ "()(())",
 * ⁠ "()()()"
 * ]
 * 
 * 
 */

// @lc code=start
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function (n) {

    let res = [];
    function generate (left, right, result) {
        if (left == n && right == n) {
            console.log(result)
            res.push(result);
            return;
        }
        if (left < n) {
            generate(left + 1, right, result + "(");
        }
        if (left > right && right < n) generate(left, right + 1, result + ")");
    }
    generate(0, 0, "");
    return res;

};
generateParenthesis(3)
// @lc code=end

