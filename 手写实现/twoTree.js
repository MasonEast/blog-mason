const data = [
  {
    id: "1",
    sub: [
      {
        id: "2",
        sub: [
          {
            id: "3",
            sub: null,
          },
          {
            id: "4",
            sub: [
              {
                id: "6",
                sub: null,
              },
            ],
          },
          {
            id: "5",
            sub: null,
          },
        ],
      },
    ],
  },
  {
    id: "7",
    sub: [
      {
        id: "8",
        sub: [
          {
            id: "9",
            sub: null,
          },
        ],
      },
    ],
  },
  {
    id: "10",
    sub: null,
  },
];
// 现在给定一个id，要求实现一个函数

function findPath(data, id) {
  let path = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      path.push(data[i].id);
      return path;
    }

    if (Array.isArray(data[i].sub)) {
      path = path.concat(data[i].id, findPath(data[i].sub, id));
    }

    if (!path.includes(id)) {
      path = [];
    }
  }

  return path;
}
console.log(findPath(data, "1"));
// 返回给定id在 data 里的路径
// 示例:

// id = "1" => ["1"]
// id = "9" => ["7", "8", "9"]
// id = "100"=> []
// PS: id 全局唯一，无序
// ```

/**
 * 获取当前 URL 所有 GET 查询参数
 * 入参：要解析的 URL，不传则默认为当前 URL
 * 返回：一个<key, value>参数对象
 */
function getUrlQueryParams(url = location.search) {
  const params = {};
  const keys = url.match(/([^?&]+)(?==)/g);
  const values = url.match(/(?<==)([^&]*)/g);
  for (const index in keys) {
    params[keys[index]] = values[index];
  }
  return params;
}
console.log(
  getUrlQueryParams(
    "https://hango.amh-group.com/#/appMange/initGuide?name=beidou-api&a=b"
  )
);

console.log(
  (function (str) {
    const i = str.indexOf("_");
    return str.substring(0, i) + str.substring(i + 1).toUpperCase();
  })("gaa_b")
);
