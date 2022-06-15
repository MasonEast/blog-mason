/**
 * object: 对象
 * path: 输入的路径
 * defaultVal: 默认值
 **/

function get(object, path, defaultVal = "undefined") {
  // 先将path处理成统一格式
  let newPath = [];
  if (Array.isArray(path)) {
    newPath = path;
  } else {
    // 先将字符串中的'['、']'去除替换为'.'，split分割成数组形式
    newPath = path.replace(/\[/g, ".").replace(/\]/g, "").split(".");
  }

  // 递归处理，返回最后结果
  return (
    newPath.reduce((o, k) => {
      console.log(o, k); // 此处o初始值为下边传入的 object，后续值为每次取的内部值
      return (o || {})[k];
    }, object) || defaultVal
  );
}
