// 异步加法
function asyncAdd(a, b, cb) {
  setTimeout(() => {
    cb(null, a + b);
    console.log("settimeout");
  }, Math.random());
}
async function total() {
  const res1 = await sum(1, 2, 3, 4, 5, 6, 4);
  const res2 = await sum(1, 2, 3, 4, 5, 6, 4);
  return [res1, res2];
}
console.log(total());
// 实现下sum函数。注意不能使用加法，在sum中借助asyncAdd完成加法。尽可能的优化这个方法的时间。
async function sum(...args) {
  let res = args;
  let arr = [];

  function p(...args) {
    const arr = [];
    for (let i = 0; i < args.length - 1; i += 2) {
      arr.push(
        new Promise((resolve) => {
          asyncAdd(args[i], args[i + 1], (c, d) => {
            resolve(d);
          });
        })
      );
    }
    return arr;
  }

  while (res.length >= 2) {
    arr = p(...res);
    if (arr.length % 2) arr.push(arr.at(-1));
    res = await Promise.all(arr);
  }

  console.log(res);
  return res;
}
