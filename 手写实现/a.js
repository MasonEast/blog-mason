//fn([['a', 'b'], ['n', 'm'], ['0', '1']]) => ['an0', 'am0', 'an1', 'am1', 'bn0', 'bm0', 'bn1', 'bm0']
function fn(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      result = result.concat(arr[i][j]);
    }
  }
}

function f(matrix) {
  const result = [];
  const len = matrix.length;
  function dfs(res, curr) {
    if (res.length === len) {
      result.push(res.join(""));
      return;
    }
    for (let i = 0; i < matrix[curr].length; i++) {
      res.push(matrix[curr][i]);
      dfs(res, curr + 1);
      res.pop();
    }
  }
  dfs([], 0);
  return result;
}

class U {
  constructor() {
    this.promise = Promise.resolve();
  }

  console(val) {
    this.promise = this.promise.then(() => {
      console.log(val);
    });
    return this;
  }

  setTimeout(wait) {
    this.promise = this.promise.then(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, wait);
      });
    });
    return this;
  }
}
const u = new U();
// u.console("breakfast")
//   .setTimeout(3000)
//   .console("lunch")
//   .setTimeout(3000)
//   .console("dinner");

var length = 10;
function fn() {
  return this.length + 1;
}
var obj1 = {
  length: 5,
  test1: function () {
    return fn();
  },
};
obj1.test2 = fn;
obj1.test1.call();
obj1.test1();
obj1.test2.call();
obj1.test2();

console.log(obj1.length, length);

function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function buildLinkList(values) {
  return values.reverse().reduce((acc, val) => new ListNode(val, acc), null);
}

// ---- Generate our linked list ----
const linkedList = buildLinkList(["ab", "c", "ab"]);

var isPalindrome = function (head) {
  // 左侧指针
  let left = head;
  return traverse(head);

  function traverse(right) {
    if (right === null) return true;
    let res = traverse(right.next);
    // 后序遍历代码
    res = res && right.val === left.val;
    left = left.next;
    return res;
  }
};

console.log(isPalindrome(linkedList));

var removeDuplicates = function (nums) {
  if (!nums[0]) return 0;
  let m = 0,
    n = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[m] !== nums[n]) {
      m++;
      nums[m] = nums[n];
    }
    n++;
  }
  console.log(nums);
  return m + 1;
};

removeDuplicates([0, 0, 1]);
