## worker

适用于需要大量计算的场景，独立开启一个线程，完成计算后返回结果。

比如：视频网站视频解码，imgcook 解析设计图稿

## shared worker

支持在同一主域名下不同浏览器环境的数据共享。

这些浏览器环境可以是多个 window, iframes 或者甚至是多个 Worker，只要这些 Workers 处于同一主域。为跨浏览器 tab 共享数据提供了一种解决方案。

## service worker

缓存资源文件，加快渲染速度。
