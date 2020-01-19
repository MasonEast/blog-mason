# 字体
**加粗**
快捷键： cmd + B

*斜体*

***斜体加粗***

~~删除线~~

>>引用
>>>引用2
>>>>引用3

分割线
***
---

# 图片
图片
![图片alt](图片地址 ''图片title'')

图片alt就是显示在图片下面的文字，相当于对图片内容的解释。
图片title是图片的标题，当鼠标移到图片上时显示的内容。title可加可不加

# 超链接
超链接
[简书](http://jianshu.com)
[百度](http://baidu.com)

# 列表
## 无序列表

- 列表内容
+ 列表内容
* 列表内容

注意：- + * 跟内容之间都要有一个空格

## 有序列表

1.列表内容
2.列表内容
3.列表内容

注意：序号跟内容之间要有空格

## 列表嵌套

上一级和下一级之间敲三个空格即可

- 1
   - 2
   - 3

# 表格

| 表头 | 表头  | 表头 |
| ---- | :---: | ---: |
| 内容 | 内容  | 内容 |
| 内容 | 内容  | 内容 |

第二行分割表头和内容。
- 有一个就行，为了对齐，多加了几个
文字默认居左
-两边加：表示文字居中
-右边加：表示文字居右
注：原生的语法两边都要用 | 包起来。此处省略

# 代码

## 单行代码

`单行代码`

## 代码块

```
代码块
```

# 流程图

```flow
st=>start: 开始
op=>operation: My Operation
cond=>condition: Yes or No?
e=>end
st->op->cond
cond(yes)->e
cond(no)->op
&```

```flow
st=>start: Web浏览器
op=>operation: TCP/IP
op2=>operation: 网卡驱动
op3=>operation: 集线器
op4=>operation: 路由器
op5=>operation: 电话局
op6=>operation: 网络运营商
op7=>operation: 防火墙
op8=>operation: 缓存服务器
op9=>operation: 网卡驱动
op10=>operation: TCP/IP
op11=>operation: Web服务器程序
e=>end
st->op->op2->op3->op4->op5->op6->op7->op8->op9->op10->op11->e
&```