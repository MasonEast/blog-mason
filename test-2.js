/*
 * @Description:
 * @Date: 2021-01-10 13:05:01
 * @Author: mason
 */
/**
 * 题目2： 对象扁平化，不考虑环引用的情况
 * 说明：请实现 flatten(input) 函数，input 为一个 javascript 对象（Object 或者 Array），返回值为扁平化后的结果。
 * 示例：
 *   const input = {
 *     a: 1,
 *     b: [ 1, 2, { c: true }, [ 3 ] ],
 *     d: { e: 2, f: 3 },
 *     g: null, 
 *   }
 *
 *   const output = flatten(input);
 *   
 *   output:
 *   {
 *     "a": 1,
 *     "b[0]": 1,
 *     "b[1]": 2,
 *     "b[2].c": true,
 *     "b[3][0]": 3,
 *     "d.e": 2,
 *     "d.f": 3,
 *     // "g": null,  值为null或者undefined，丢弃
 *  }
 */

const flatten = (obj, key, type) => {
    let res = {}

    for (let i in obj) {
        let rKey = i
        if (key) {
            switch (type) {
                case 'array':
                    rKey = `${key}[${i}]`
                    break
                case 'object':
                    rKey = `${key}.${i}`
                    break
            }
        }
        if (Array.isArray(obj[i])) {

            Object.assign(res, flatten(obj[i], rKey, 'array'))

        } else if (Object.prototype.toString.call(obj[i]) === '[object Object]') {

            Object.assign(res, flatten(obj[i], rKey, 'object'))

        } else {
            if (obj[i] !== null && obj[i] !== undefined) {
                res[rKey] = obj[i]
            }
        }
    }
    return res
}

const input = {
    a: 1,
    b: [1, 2, { c: true }, [3, [4]]],
    d: { e: 2, f: 3 },
    g: null,
}

const output = flatten(input);
