<!--
 * @Description: 
 * @Date: 2019-10-12 15:40:55
 * @Author: mason
-->
# 1. 关于清除浮动
清除浮动主要是为了解决父级元素因子元素浮动导致内部高度为0的问题。
    - 额外标签法（不推荐）
       clear: both
       优点： 简单
       缺点： 增加额外标签， 语义化差
    -  父元素添加overflow： hidden，通过触发BFC，实现清除浮动（不推荐： 溢出可能隐藏）
    -  使用after伪元素清除浮动
```js

.clearfix:after{/*伪元素是行内元素 正常浏览器清除浮动方法*/
    content: "";
    display: block;
    height: 0;
    clear:both;
    visibility: hidden;
}

```
    - 使用before和after双伪元素清除浮动

# 2. 关于BFC
BFC(Block formatting context)直译为"块级格式化上下文"，就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。

### 如何创建BFC
1、float的值不是none。
2、position的值不是static或者relative。
3、display的值是inline-block、table-cell、flex、table-caption或者inline-flex
4、overflow的值不是visible

### BFC的作用
1、 一个BFC内部的两个Box会发生margin重叠， 而BFC可以避免margin重叠
2、 BFC不会与float的box重叠， 可以用于两栏自适应布局
3、 避免高度塌陷， 当子元素浮动可能导致父元素高度塌陷， 但通过激活父元素的BFC可以避免塌陷。