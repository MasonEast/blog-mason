/*
 * @Description:
 * @Date: 2021-01-12 10:45:26
 * @Author: mason
 */
//第一题： 

window.onload = function () {
    document.getElementById("container").onclick = function (e) {
        if (e.target.id !== 'itemx') {
            alert(e.target.innerText)
        }
    }
}



//第二题：
class EventEmitter {
    constructor() {
        this._listeners = {}
    }
    /**
    添加事件监听 * 
     *@params eventName 事件名称
     *@params handler 事件回调处理
     */
    public addEventListener (eventName: string, handler: Function) {
        let listener = this._listeners[eventName] || [];
        listener.push(handler);
        this._listeners[eventName] = listener;
    }
    /**
     * 移除事件监听
     *@params eventName 事件名称
     *@params handler 事件回调处理
     */
    public removeEventListener (eventName: string, handler: Function) {
        const listener = this._listeners[eventName]
        if (!listener) {
            console.log('该事件不存在')
            return
        }
        delete this._listeners[eventName]
        handler()
    }
    /**
     * 派发事件
     *@params eventName 事件名称
     *@params handler 事件回调处理
     */
    public dispatch (eventName: string, params: any) {
        const listener = this._listeners[eventName];
        listener.forEach((callback) => {
            callback.apply(this, params);
        })
    }
}



//第三题：回文字符串
function isPlaindrome (str) {
    const len = str.length;
    let str1 = "";
    for (let i = len - 1; i >= 0; i--) {
        str1 += str[i];
    }
    return str1 === str
}



/*
 设计题：
    1. 首先，这是一个可以无限嵌套的数据结构。 最小的粒度应该是Resource， Operator， Value三个表单组成的单一查询语句。
    所以我们第一个需要做的组件就是封装Resource， Operator， Value三个表单。后续的添加Condition或者Group实际上都是在
    这个组件的基础上实现的。
    2. 然后， 我们可以考虑这个sql语句是顺序执行的， 有点类似于数组的遍历， 数据结构可以考虑使用数组嵌套数组的形式。
    3. 弄明白添加Condition和添加Group的区别： Condition可以使用对象结构体现， Group需要使用数组嵌套对象的结构体现
 */

//数据结构：
let sql = [
    {
        condition: '',
        resource: 'xxx',
        operator: '=',
        value: '张三',
    },
    [
        {
            condition: 'AND',
            resource: 'code',
            operator: '>',
            value: '1270',
        },
        {
            condition: 'AND',
            resource: 'code',
            operator: '>',
            value: '1270',
        },
        {
            condition: 'AND',
            resource: 'code',
            operator: '>',
            value: '1270',
        },
    ]
]

//组件结构：
//这一块没有太多可说的， 像上面提到的， 主要是有一个Resource， Operator， Value三个表单最小粒度的组件， 剩下的主要就是通过按钮不断添加就ok。

//执行逻辑:
//因为涉及到无限嵌套， 肯定是要考虑递归调用的， 在我设想的数据结构中就是遇到对象， 就是同级sql语句， 可以直接添加的， 遇到数组说明就是一个Group， 需要
//进入到内部拆分组装成一个sql
let sqlStr = ''
function searchSql (param) {
    param.forEach(item => {
        if (Object.prototype.toString.call(item) === '[object Object]') {
            return sqlStr += `${item.condition} ${item.resource} ${item.operator} ${item.value}`
        } else {
            searchSql(param)
        }
    })
}
