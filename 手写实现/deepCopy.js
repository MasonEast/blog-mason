function shallowCopy(obj) {
  let result;
  if (typeof obj === "object") {
    for (let i in obj) {
      result[i] = obj[i];
    }
  } else {
    result = obj;
  }
  return result;
}

function deepCopy(obj) {
  let result;
  if (typeof obj === "object") {
    result = obj.constructor === Array ? [] : {};
    for (let i in obj) {
      result[i] = typeof obj[i] === "object" ? deepCopy(obj[i]) : obj[i];
    }
  } else {
    result = obj;
  }
  return result;
}

const obj = {
  a: 1,
  b: {
    c: 2,
  },
  d: [5, 6, 7],
};

const obj2 = deepCopy(obj);

obj2.b.c = 4;

console.log(obj2, obj);
