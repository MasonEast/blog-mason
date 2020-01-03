/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var threeSumClosest = function (nums, target) {
    nums = nums.sort(function (a, b) { return a - b })
    var i = 0;
    var num = nums[0] + nums[1] + nums[2];
    var and = num
    for (var i = 0; i < nums.length - 2; i++) {//和三数之和一样，我先用的while循环，现在用的
        //for循环
        var k = nums.length - 1
        for (var j = i + 1; j < nums.length - 1 && j != k;) {
            sum = nums[i] + nums[j] + nums[k];
            if (Math.abs(target - sum) <= Math.abs(target - and)) {
                and = sum
                num = Math.abs(target - sum)
            }
            if (target - sum > 0) {
                j++;
            }
            else {
                k--
            }
        }
    }
    return and

};