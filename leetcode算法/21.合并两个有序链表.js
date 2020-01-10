/*
 * @lc app=leetcode.cn id=21 lang=javascript
 *
 * [21] 合并两个有序链表
 *
 * https://leetcode-cn.com/problems/merge-two-sorted-lists/description/
 *
 * algorithms
 * Easy (55.46%)
 * Likes:    789
 * Dislikes: 0
 * Total Accepted:    160.3K
 * Total Submissions: 272.1K
 * Testcase Example:  '[1,2,4]\n[1,3,4]'
 *
 * 将两个有序链表合并为一个新的有序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 
 * 
 * 示例：
 * 
 * 输入：1->2->4, 1->3->4
 * 输出：1->1->2->3->4->4
 * 
 * 
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function (l1, l2) {
    var l3 = new ListNode(-1);
    var c3 = l3;

        while(l1 !== null && l2 !== null) {
        if(l1.val <= l2.val) {
            c3.next = l1;
            l1 = l1.next;
        } else {
            c3.next = l2;
            l2 = l2.next;
        }
        c3 = c3.next;
    }
    //循环完某一链表后，将另一链表剩下的部分直接加入到l3
    c3.next = (l1===null) ? l2 : l1;
    return l3.next;
};
// @lc code=end

