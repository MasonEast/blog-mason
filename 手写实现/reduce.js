Array.prototype._reudce = function (fn, initialValue) {
  const arr = [].concat(this);
  if (!arr.length) return;

  let pre = initialValue ? initialValue : null;
  for (let i = 0; i < arr.length; i++) {
    pre = fn.call(null, pre, arr[i], i, this);
  }
  return pre;
};

console.log([1, 2, 3]._reudce((pre, cur) => pre + cur, 1));
