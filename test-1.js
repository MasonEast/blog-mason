/*
 * @Description: 
 * @Date: 2021-01-10 10:52:46
 * @Author: mason
 */

/*
 * 题目1: 简单实现一个queryString，具有parse和stringify的能力，
 * parse，用于把一个URL查询字符串解析成一个键值对的集合。
 * 输入：查询字符串 'foo=bar&abc=xyz&abc=123'
 * 输出：一个键值对的对象
 * {
 *   foo: 'bar',
 *   abc: ['xyz', '123'],
 * }
 * stringify，相反的，用于序列化给定对象的自身属性，生成URL查询字符串。
 * 输入：一个键值对的对象
 * {
 *   foo: 'bar',
 *   abc: ['xyz', '123'],
 * }
 * 输出：查询字符串 'foo=bar&abc=xyz&abc=123'
 */

// 测试代码


const queryString = {
    parse: (str) => {
        let obj = {}
        const arr = str.split('&')
        arr.forEach((item) => {
            const itemArr = item.split('=')
            if (!obj[itemArr[0]]) {
                obj[itemArr[0]] = itemArr[1]
            } else {
                Array.isArray(obj[itemArr[0]])
                    ?
                    obj[itemArr[0]] = obj[itemArr[0]].push(itemArr[1])
                    :
                    obj[itemArr[0]] = [obj[itemArr[0]], itemArr[1]]
            }
        })
        return obj
    },
    stringify: (obj) => {
        let str = ''
        for (let i in obj) {
            Array.isArray(obj[i])
                ?
                obj[i].forEach(item => {
                    str += `&${i}=${item}`
                })
                :
                str += `&${i}=${obj[i]}`
        }
        return str.substr(1)
    }
}

queryString.parse('foo=bar&abc=xyz&abc=123');
queryString.stringify({ foo: 'bar', abc: ['xyz', '123'] });
queryString.stringify({ a: 1, b: 2, c: [3, 2] });