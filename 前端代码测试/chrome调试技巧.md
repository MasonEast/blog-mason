1. copy（）可以在console中copy到任何能拿到的资源
2. store as global
- 相对数据做额外的操作，但不想影响原来的值
- 对console中打印的数据，右击 它，并选择 “Store as global variable” (保存为全局变量) 选项。
- 第一次使用的话，它会创建一个名为 temp1 的变量，第二次创建 temp2……
3. 保存堆栈信息( Stack trace )
- 用console打印出堆栈跟踪信息保存成文件给同事降低沟通成本。
4. 直接Copy HTML

# 快捷操作

切换 DevTools 窗口的展示布局: `ctrl + shift + D` (`⌘ + shift + D` Mac) 来实现位置的切换

按下 `ctrl + [` 和 `ctrl + ]` 可以从当前面板的分别向左和向右切换面板。

`ctrl + [1...9]`同样可以跳到对应的网页

打开Command： 在 Chrome 的调试打开的情况下 按下 `[ Ctrl] + [Shift] + [P]` (Mac： `[⌘] + [Shift]+ [P]` )

chrome截屏： 当你只想对一个特别的 DOM 节点进行截图时，你可能需要使用其他工具弄半天，但现在你直接选中那个节点，打开 Command 菜单输入`screen`对应截取。

切换主题： 打开Command， 输入`theme`

#

进入到 Sources 面板，在导航栏里选中 Snippets 这栏，点击 New snippet(新建一个代码块) ，然后输入你的代码之后保存，大功告成！现在你可以通过右击菜单或者快捷键： [ctrl] + [enter] 来运行它了

这就是 `Snippets` 的用武之地：它允许你存放 JavaScript 代码到 DevTools 中，方便你复用这些 JavaScript 代码块

当我在 DevTools 中预设了一组很棒的代码块以后，甚至都不必再通过 Sources 来运行它们。使用 Command Menu 或 `command p`才是最快的方式。只需在它的输入框中输入 ! ，就可以根据名字来筛选预设代码块

# console
console.table 这个小技巧在开发者中可能并没有多少人知道: 如果有一个 数组 (或者是 类数组 的对象，或者就是一个 对象 )需要打印，你可以使用 console.table 方法将它以一个漂亮的表格的形式打印出来。它不仅会根据数组中包含的对象的所有属性，去计算出表中的列名，而且这些列都是可以 缩放 甚至 还可以排序!!!

想要查看 这个节点所关联到的真实的js对象 呢？并且想要查看他的 属性 等等？

在那样的情况下，就可以使用console.dir

如果你想要给你的应用中发生的事件加上一个确切的时间记录，开启 timestamps 。你可以在设置(在调试工具中的 ⋮ 下拉中找到它，或者按下 F1 )中来开启或者使用 Commands Menu

监测执行时间：

与其在所有事上展示一个时间戳，或许你对脚本中的特殊的节点之间执行的时间跨度更加感兴趣，对于这样的情况，我们可以采用一对有效的 console 方法

`console.time()` — 开启一个计时器
`console.timeEnd()` — 结束计时并且将结果在 console 中打印出来
```js
console.time('init')

setTimeOut(() => {
    console.timeEnd('init')
}, 2000)
```


# Network

## 请求过滤

Network 面板中的过滤器输入框接受字符串或正则表达式，对应显示匹配的请求。 但是你也可以使用它来过滤很多属性。

只需输入 例如 `method` 或者 `mime-type`

## 重新发送 XHR 的请求

右键请求， 使用`replay XHR`

# Elements

## 通过 'h' 来隐藏元素

## 拖动 & 放置 元素

使用 control (按钮) 来移动元素!
如果你只是想移动你当前选中的元素，在 DOM 结构中往上挪一点或者往下挪一点，而不是拖动和放置，你同样可以使用[ctrl] + [⬆] / [ctrl] + [⬇] ([⌘] + [⬆] / [⌘] + [⬇] on Mac).

## 一个一个的去点击级联的 ▶ 按钮太慢了，不如使用右击节点后的 `expand recursively` 命令

# Drawer

当你在 DevTools（任何选项卡）中时，按 [esc] 来显示它，再次按 [esc] 隐藏它

检查你修改的内容: changes

# WorkSpace

## 在 Chrome 中修改你的文件

有时在代码执行的位置也是最容易编辑代码的位置（对于前端来说也就是浏览器）。如果你把项目的文件夹直接拖到 Source 面板，DevTools 会将你做出的修改同步到系统的文件中。

# chrome的技巧

* copy & saving
* `copy(location)`，复制控制台信息
* 右击控制台输出的信息，可以保存为全局变量
* 右击控制台的错误信息，可以将信息导出到文件

* 快捷键
* `command + shift + d`切换控制台的位置
* `command + [`可以快速切换控制台的各个面板
* `option + ↑`让数值增加0.1，`shift + ↑`让数值增加10，`↑`让数值增加1
* 在elements面板里，`command+f`支持选择器查找，惊呆了。`logs sources network`也可以查找

* command面板
* 控制台`command + shift + p`，对，类似vscode的快捷键，酷炫！
* 输入`screen`可以选择对当前网页`full size`全部截屏
* 输入`layout`可以将elements面板，竖直分割或者横向分割
* 输入`theme`可以切换黑白模式
* 输入`time`可以显示控制台的打印数据的时间

* 代码块snippets的使用，快速在console执行某些代码
* `command + shift + p`打开command面板
* 输入`snippet`选择创建代码块
* 删掉`>`，输入`!`，可以选择执行相应的代码块

* console
* `$('h1')`可以直接拿到h1，`$$('h1')`可以将元素列表直接变成数组列表，没有jquery照样能用，炸裂
<!-- * $i没成功。。。。 [安装这个插件](https://chrome.google.com/webstore/detail/console-importer/hgajpakhafplebkdljleajgbpdmplhie)，$i('moment')，就可以在控制台，玩玩这个包了 -->
* 可直接使用await，输入`response = await fetch('https://jsonplaceholder.typicode.com/todos/1');json = await response.json()`
<!-- * 好麻烦，需要再说。可自定义打印对象的格式，有时候不想显示过多的key时。控制台打开的情况下，按f1，在console列表里勾选`enbale custom formatters` -->
* 输入`queryObjects(Vue)`，会展示所有的vue实例，其他类也是一样的
<!-- * monitor有点难，先跳过 -->
* 输入`value=null;console.assert(value,'value是空的')`，value是falsy值是就会打印后面的
* 输入`var a=1;var b=2;console.log({a,b});console.table({a,b})`，就能将打印的值和变量对应
* 输入`console.table($$('li'),['textContent','className'])`，打印json数组的时候，特别方便，第二个参数是只想显示的key。当然对象也是没问题的~~~
* 输入`console.dir($('body'))`，dir可以轻松打印节点的具体信息
* 输入`console.time('for');console.timeEnd('for')`可以打印这两行代码执行的时间差，这个可以很方便的测试比如for循环执行了多长时间
* 输入`console.log('%c需要输出的信息','color:#f69')`，%c加style样式即可花样log
* 输入`function log(message) { console.log(' '.repeat(new Error().stack.match(/\n/g).length - 2) + message ); };function a(){log('a');b()};function b(){log('b')};a()`这时候log基于调用堆栈自动缩进
* console.log可以直接在回调里。

* source面板的断点
* 右击断点的行号，可以编辑断点的执行条件，让断点在某种情况下才是断点
* 上面的是为这个功能服务的。既然每次在执行到断点的时候都执行编辑条件，索性可以在编辑条件这里打印想要的东西。然后不要的时候在`breakpoints`那里可以清除掉所有的条件。好处是，不污染代码，再也不用手动注释或者开始console代码。炸裂

* network面板
* 右击请求在`initiator`可以看到请求调用的堆栈
* 右击`Name`可以选择看请求的哪些数据，比如添加`method`
* 右击某条请求，可以`replay xhr`重新发送请求

* elements面板
* 选中某个节点，按`h键`显示或隐藏该节点
* 选中某个节点，任意拖拽到任意的位置，视图将直接变化
* 选中某个节点，按住`command`，在按上下键，也可以快捷改变节点位置
* 选中某个节点，右击`edit html`的时候可以使用`command+z`撤销
* 选中某个节点，右击`expand recuirsively`可以一次性展开所有子节点
* 选中某个节点，右击`break on`可以给节点打断点，具体三种形式：子节点，当前节点，当前节点移除
* style里`box-shodow`里可以直接打开阴影编辑器
* style里`animation`的动画效果，可以直接编辑贝塞尔曲线
* style里每个元素的右下角有能快速编辑元素的`color background-color  text-shadow  box-shadow`
* 颜色面板能直接用吸色器，其他玩法炸裂

* Drawer
* 一般只有一个控制台面板，但是你也可以像抽屉一样打开很多控制台面板，不同的控制台面板显示不同的tab，在一定情况哎也是很方便调试的。`command+ shift+p`输入`drawer`，选择玩法
* 可以模拟你在任何位置！`command+ shift+p`输入`drawer`，选择`sensor`就可以输入虚拟的位置。选定的值将被 navigator.geolocation.watchPosition（或 .getCurrentPosition ）报告。
* 可以模拟网速和ua！`command+ shift+p`输入`drawer`，选择`network`就可以随意了
* 可以快速看源码！`command+ shift+p`输入`drawer`，选择`quick source`就可以随意了
* 可以快速看多余的代码！`command+ shift+p`输入`drawer`，选择`coverage`，点击小圆点开始，然后点击具体的文件就看到红色和绿色区域了
* 可以快速比较修改前后的样式！`command+ shift+p`输入`drawer`，选择`change`

* workspace