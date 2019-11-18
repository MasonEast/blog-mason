# 前言
1. CORS ： Cross Origin Resourse-Sharing  跨站资源共享

2. CSRF ： Cross-Site Request Forgery  跨站请求伪造

3. XSS ： Cross Site Scrit 跨站脚本攻击（为与 CSS 区别，所以在安全领域叫 XSS）

## CORS

CORS是一个W3C标准，它允许浏览器向跨源服务器，发出XMLHttpRequest 请求，从而克服 AJAX 只能同源使用的限制。

浏览器将CORS请求分为两种：
简单请求：
    请求方法为： HEAD， GET 或 POST
    HTTP头信息：
        |- Accept-Language
        |- Content-Language
        |- Last-Event-ID
        |— Content-Type: 三种之一： application/x-www-form-urlencoded、multipart/form-data、text/plain

凡是不同时满足上面两个条件的就是非简单请求。

### 简单请求的CORS流程

当浏览器发现是简单请求时， 便会自动在头信息中， 增加`Origin`字段.

`Origin` 字段用来说明本次请求的来源（包括协议 + 域名 + 端口号），服务端根据这个值来决定是否同意此次请求。

当 `Origin` 指定的源不在许可范围，服务器会返回一个正常的 HTTP 回应，但浏览器会在响应头中发现 `Access-Control-Allow-Origin` 字段，便抛出异常。

除了上面图中的头信息，一般会有以下三个相关头信息：

1. Access-Control-Allow-Origin

该字段是必须的。表示许可范围的域名，通常有两种值：请求时 Origin 字段的值或者 *（星号）表示任意域名。

2. Access-Control-Allow-Credentials

该字段可选。布尔值，表示是否允许在 CORS 请求之中发送 Cookie 。若不携带 Cookie 则不需要设置该字段。
当设置为 true 则  Cookie 包含在请求中，一起发送给服务器。还需要在 AJAX 请求中开启 withCredentials 属性，否则浏览器也不会发送 Cookie 。
let xhr = new XMLHttpRequest();
xhr.withCredentials = true;
复制代码注意： 如果前端设置 Access-Control-Allow-Credentials 为 true 来携带 Cookie 发起请求，则服务端 Access-Control-Allow-Origin 不能设置为 *。

3. Access-Control-Expose-Headers

该字段可选。可以设置需要获取的字段。因为默认 CORS 请求时，XMLHttpRequest 对象的getResponseHeader()方法只能拿到以下 6 个基本字段：
Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。

### 非简单请求的CORS流程

请求方法是**PUT/DELETE**或者`Content-Type:application/json `类型的请求。

在非简单请求发出 CORS 请求时，会在正式通信之前增加一次 “预检”请求（OPTIONS方法），来询问服务器，本次请求的域名是否在许可名单中，以及使用哪些头信息。

当 “预检”请求 通过以后，才会正式发起 AJAX 请求，否则报错。

#### 预检请求

```js
OPTIONS /cors HTTP/1.1
Origin: http://api.bob.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
User-Agent: Mozilla/5.0...
...
```

#### 预检响应

当预检请求通过以后，在预检响应头中，会返回 Access-Control-Allow- 开头的信息，其中 Access-Control-Allow-Origin 表示许可范围，值也可以是 *。
当预检请求拒绝以后，在预检响应头中，不会返回 Access-Control-Allow- 开头的信息，并在控制台输出错误信息。

## CSRF

跨站点请求伪造请求

常见场景： 以你名义发送邮件，发消息，盗取你的账号，甚至于购买商品，虚拟货币转账等等。

![CSRF](img/CSRF攻击流程.png)

简单理解流程：
    登录信任网站生成登录cookie， 携带cookie访问危险网站， 危险网站带着cookie去访问信任网站并伪造用户进行操作

### 服务端防御CSRF攻击

1. 在表单里增加Hash值， 随用户的请求一起发给服务端进行认证。
2. 验证码
   

## XSS

XSS 攻击，一般是指攻击者通过在网页中注入恶意脚本，当用户浏览网页时，恶意脚本执行，控制用户浏览器行为的一种攻击方式。

常见 XSS 危害有：

1. 窃取用户Cookie，获取用户隐私，盗取用户账号。

2. 劫持用户（浏览器）会话，从而执行任意操作，例如进行非法转账、强制发表日志、发送电子邮件等。
   
3. 强制弹出广告页面，刷流量，传播跨站脚本蠕虫，网页挂马等。
   
4. 结合其他漏洞，如 CSRF 漏洞，实施进一步的攻击。

### 防御方法

1. 浏览器自带防御（x-xss-Protection)
   
2. 白名单

3. 内容安全策略（CSP）

通过HTTP头信息的Content-Security-Policy的字段：

```js
Content-Security-Policy: script-src 'self'; 
                         object-src 'none';
                         style-src cdn.example.org third-party.org; 
                         child-src https:
```

通过网页的<meta>标签：

```js

<meta http-equiv="Content-Security-Policy" content="script-src 'self'; object-src 'none'; style-src cdn.example.org third-party.org; child-src https:">

```

上面代码中，CSP 做了如下配置：

脚本： 只信任当前域名

<object>标签： 不信任任何 URL，即不加载任何资源

样式表： 只信任 cdn.example.org和third-party.org

页面子内容，如 <frame>、<iframe>： 必须使用HTTPS协议加载

其他资源： 没有限制

启用后，不符合 CSP 的外部资源就会被阻止加载。


