/*
 * @lc app=leetcode.cn id=15 lang=javascript
 *
 * [15] 三数之和
 *
 * https://leetcode-cn.com/problems/3sum/description/
 *
 * algorithms
 * Medium (23.05%)
 * Likes:    1348
 * Dislikes: 0
 * Total Accepted:    94.8K
 * Total Submissions: 395.6K
 * Testcase Example:  '[-1,0,1,2,-1,-4]'
 *
 * 给定一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0
 * ？找出所有满足条件且不重复的三元组。
 * 
 * 注意：答案中不可以包含重复的三元组。
 * 
 * 例如, 给定数组 nums = [-1, 0, 1, 2, -1, -4]，
 * 
 * 满足要求的三元组集合为：
 * [
 * ⁠ [-1, 0, 1],
 * ⁠ [-1, -1, 2]
 * ]
 * 
 * 
 */
/**
 * @param {number[]} nums
 * @return {number[][]}
 * 解题思路：排序➕双指针遍历
 */
var threeSum = function (nums) {
    if (nums.length < 3) {
        return [];
    }

    let res = [];
    // 排序
    nums.sort((a, b) => a - b);
    for (let i = 0; i < nums.length; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) {
            // 去重
            continue;
        }
        if (nums[i] > 0) {
            // 若当前元素大于0，则三元素相加之后必定大于0
            break;
        }
        // l为左下标，r为右下标
        let l = i + 1; r = nums.length - 1;
        while (l < r) {
            let sum = nums[i] + nums[l] + nums[r];
            if (sum == 0) {
                res.push([nums[i], nums[l], nums[r]]);
                while (l < r && nums[l] == nums[l + 1]) {
                    l++
                }
                while (l < r && nums[r] == nums[r - 1]) {
                    r--;
                }
                l++;
                r--;
            }
            else if (sum < 0) {
                l++;
            }
            else if (sum > 0) {
                r--;
            }
        }
    }

    return res;
};

