function _flat(arr) {
  return arr.reduce(
    (pre, cur) => pre.concat(Array.isArray(cur) ? _flat(cur) : cur),
    []
  );
}

console.log(_flat([1, 2, [3]]));

// 如果是纯数字
console.log([1, 2, [3]].toString().split(","));
