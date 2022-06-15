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

// const u = new U();
// u.console("breakfast")
//   .setTimeout(3000)
//   .console("lunch")
//   .setTimeout(3000)
//   .console("dinner");
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

// '()' // true
// ‘({})’ // true
// '[()' // false
// '[(])' // false

function validatek(str) {
  let left = 0,
    right = str.length - 1,
    bol = true,
    flag = true;
  while (flag && left < right) {
    switch (str[left]) {
      case "(":
        if (str[right] !== ")") {
          flag = false;
          bol = false;
          return;
        }
      case "{":
        if (str[right] !== "}") {
          flag = false;
          bol = false;
          return;
        }
      case "[":
        if (str[right] !== "]") {
          flag = false;
          bol = false;
          return;
        }
    }
    left++;
    right--;
  }
  return bol;
}
