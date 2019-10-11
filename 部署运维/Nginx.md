# Nginx

Nginx是一个高性能轻量级的HTTP和反向代理web服务器。

优点：
    代码采用C编写，较低的系统资源开销和CPU使用效率
    无缓存的反向代理加速，简单的负载均衡和容错
    支持SSL和TLSSNI
    模块化的结构，有自己的函数库，比如zlib，PCRE和OpenSSL等


## 阿里云安装Nginx

`yum install nginx`

## 打开Nginx的配置文件：vim /etc/nginx/nginx.conf

Nginx配置文件结构：

```js
...              #全局块

events {         #events块
   ...
}

http      #http块
{
    ...   #http全局块
    server        #server块
    { 
        ...       #server全局块
        location [PATTERN]   #location块
        {
            ...
        }
        location [PATTERN] 
        {
            ...
        }
    }
    server
    {
      ...
    }
    ...     #http全局块
}
```

1、全局块：配置影响nginx全局的指令。一般有运行nginx服务器的用户组，nginx进程pid存放路径，日志存放路径，配置文件引入，允许生成worker process数等。
2、events块：配置影响nginx服务器或与用户的网络连接。有每个进程的最大连接数，选取哪种事件驱动模型处理连接请求，是否允许同时接受多个网路连接，开启多个网络连接序列化等。
3、http块：可以嵌套多个server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。如文件引入，mime-type定义，日志自定义，是否使用sendfile传输文件，连接超时时间，单连接请求数等。
4、server块：配置虚拟主机的相关参数，一个http中可以有多个server。
5、location块：配置请求的路由，以及各种页面的处理情况。

Nginx配置项详解：

```js
########### 每个指令必须有分号结束。#################
#user administrator administrators;  //配置用户或者组，默认为nobody nobody。
//worker_processes 2;  //允许生成的进程数，默认为1
//pid /nginx/pid/nginx.pid;   //指定nginx进程运行文件存放地址
error_log log/error.log debug;  //制定日志路径，级别。这个设置可以放入全局块，http块，server块，级别以此为：debug|info|notice|warn|error|crit|alert|emerg
events {
    accept_mutex on;   //设置网路连接序列化，防止惊群现象发生，默认为on
    multi_accept on;  //设置一个进程是否同时接受多个网络连接，默认为off
    //use epoll;      //事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
    worker_connections  1024;    //最大连接数，默认为512
}
http {
    include       mime.types;   //文件扩展名与文件类型映射表
    default_type  application/octet-stream; //默认文件类型，默认为text/plain
    //access_log off; //取消服务日志    
    log_format myFormat '$remote_addr–$remote_user [$time_local] $request $status $body_bytes_sent $http_referer $http_user_agent $http_x_forwarded_for'; //自定义格式
    access_log log/access.log myFormat;  //combined为日志格式的默认值
    sendfile on;   //允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。
    sendfile_max_chunk 100k;  //每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。
    keepalive_timeout 65;  //连接超时时间，默认为75s，可以在http，server，location块。

    upstream mysvr {   
      server 127.0.0.1:7878;
      server 192.168.10.121:3333 backup;  //热备
    }
    error_page 404 https://www.baidu.com; //错误页
    server {
        keepalive_requests 120; //单连接请求上限次数。
        listen       4545;   //监听端口
        server_name  127.0.0.1;   //监听地址       
        location  ~*^.+$ {       //请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。
           root path;  //根目录
           index vv.txt;  //设置默认页
           proxy_pass  http://mysvr;  //请求转向mysvr 定义的服务器列表
           deny 127.0.0.1;  //拒绝的ip
           allow 172.18.5.54; //允许的ip           
        } 
    }
}
```

root 、alias指令区别

```js
location /img/ {
    alias /var/www/image/;
}
#若按照上述配置的话，则访问/img/目录里面的文件时，ningx会自动去/var/www/image/目录找文件
location /img/ {
    root /var/www/image;
}
#若按照这种配置的话，则访问/img/目录下的文件时，nginx会去/var/www/image/img/目录下找文件。] 
```

alias是一个目录别名的定义，root则是最上层目录的定义。

还有一个重要的区别是alias后面必须要用“/”结束，否则会找不到文件的。。。而root则可有可无~~

上面是nginx的基本配置，需要注意的有以下几点：

1、几个常见配置项：

    1.$remote_addr 与 $http_x_forwarded_for 用以记录客户端的ip地址；
    2.$remote_user ：用来记录客户端用户名称；
    3.$time_local ： 用来记录访问时间与时区；
    4.$request ： 用来记录请求的url与http协议；
    5.$status ： 用来记录请求状态；成功是200；
    6.$body_bytes_s ent ：记录发送给客户端文件主体内容大小；
    7.$http_referer ：用来记录从那个页面链接访问过来的；
    8.$http_user_agent ：记录客户端浏览器的相关信息；

2、惊群现象：一个网路连接到来，多个睡眠的进程被同事叫醒，但只有一个进程能获得链接，这样会影响系统性能。

3、每个指令必须有分号结束。


## Nginx正向代理和反向代理

实践中客户端无法直接与服务端发起请求时，我们就需要代理服务。

正向代理和反向代理的区别在于代理的对象不一样，正向代理的代理对象是客户端，反向代理的代理对象是服务端。

Nginx通过proxy_pass可以设置代理服务。