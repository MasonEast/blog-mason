# Node.js事件循环机制是什么样的

当Node.js进程启动时， 会创建一个类似于while(true)的循环， 每执行一次循环体的过程我们称之为一次Tick, 每次Tick的过程就是查看是否有事件待处理， 如果有， 就取出事件相关毁掉函数， 如果存在关联的回调函数， 就执行它们， 然后进行下一次循环， 如果不再有事件处理， 就退出进程。

# Node.js有哪些核心模块

全局对象:console、process等;

常用工具:util

事件机制:event,核心对象events.EventEmitter, error事件,以及基于event的stream和buffer.

文件系统访问:fs

网络模块:net/http