# sqlite

SQLite是一个进程内的库，实现了自给自足的、无服务器的、零配置的、事务性的 SQL 数据库引擎。它是一个零配置的数据库，这意味着与其他数据库一样，您不需要在系统中配置。

就像其他数据库，SQLite 引擎不是一个独立的进程，可以按应用程序需求进行静态或动态连接。SQLite 直接访问其存储文件。

# 使用sequelize映射sqlite

## 创建sqlite数据库

```js

var sequelize = new Sequelize('database', 'username', 'password', {

  host: 'localhost',                       //连接数据库的主机
  sync: { force: true },                  //每次新建数据库就删除之前的
  dialect: 'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql',       //要连接的数据库类型

  pool: {                                   //对数据库连接池的配置
    max: 5,
    min: 0,
    idle: 10000
  },
  storage: 'path/to/database.sqlite'   // 仅 SQLite 适用

});
```

上面的代码就可以创建一个`database.sqlite`数据库

## 定义model

```js
var Project = db.define('projects', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
});
```

## 创建表

有个很逗的问题， 每次创建表， 如果你定义的模型里有必填项， 还必须传参， 这样表里就会有一个初始数据， 不知道有没有办法规避。
```js
Project.sync({
    force: true     //可不传， 若为true则会删除之前的同名表，  如果为false 创建表，如果原来存在，则不创建
    }).then(function () {
    // Table created
    return Project.create({
        name: 'mason'
    });
});
```