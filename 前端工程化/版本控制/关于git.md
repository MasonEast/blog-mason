# 版本控制系统的作用

1. 从当前版本回退到任意版本

2. 查看历史版本

3. 对比两个版本差异

## git
### 相关术语

```js
repository  仓库
branch      分支
summary     摘要
track       跟踪
modify      修改
stage       暂存
commit      提交
push        推送
pull        拉取
clone       克隆
amend       修改
merge       合并
conflict    冲突
origin      源
upstream    上游
downstream  下游
verbose     详情
reflog      回流
```

### git基础

1. modified： 已修改， 修改了项目但没有提交到本地数据库， 也就是没有`git add`

2. staged： 已暂存， 就是执行了`git add`，但是没有`git commit`

3. committed： 已提交， 保存在本地数据库， 就是执行了`git commit`

#### git基本工作流程

- 写代码
- 对修改的文件进行快照， 保存到暂存区域中
- 提交代码， 将暂存区域中的文件快照上传到git中

#### 基本配置

查看当前的git配置：
```js
git config --list
git config user.name
git config user.email

//通过git config -h了解更多的git配置查询
```

修改当前配置(一般只需要配置一次， 但是如果换了电脑， 或者更换了系统我们就需要从新配置）：
```js
//用户名配置
git config --global user.name "xiaohuochai"

//邮箱配置
git config --global user.email "121631835@qq.com"
```

#### 项目配置.gitignore

当我们提交项目到git时， 有很多文件是不需要提交的， 比如`node_modules, .vscode, .idea`等等

这是我们需要在项目的根目录下新建`.gitignore`文件
```js
node_modules/
/*/node_modules/
.idea
.vscode

```

#### 配置ssh

当我们从github远程服务器`pull`和`push`代码时， 如何验证提交和拉取的代码是谁？ 为了避免每次输入用户名， 密码的麻烦， 我们可以通过配置ssh来解决。

查看本机的ssh：

```js
//ssh一般存在.ssh中
//打开命令行
cd ~/.ssh           //进入对应目录
ls                  //如果有可以看到私钥id_rsa文件和公钥id_rsa.pub
cat id_rsa.pub 或者 vim id_rsa.pub      //查看文件内容
```
如果没有， 我们可以通过下面命令生成
```js
ssh-keygen
```

接下来， 我们复制公钥的内容，登录github

在右上角头像下拉`settings` -> `SSH and GPG Keys`中点击 `New SSH Key`进行添加。

通过`ssh -T git@github.com`命令来验证SSH是否配置成功。

### git基本操作

- 初始化新仓库

```js
git init
```

- 查看文件状态

```js
git status
```

- 文件跟踪

```js
git add xxx         //跟踪某个文件
git add .           //批量跟踪
```

文件是否`add`成功， 我们可以通过`git status`再检查一次

- 文件提交本地仓库

```js
git commit              //提交文件到本地仓库
git commit -m 'xxx'     //xxx是你本次提交的信息说明
git commit -am 'xxx'
```

- 推送远程仓库

```js
git push origin xxx
//你可以通过-u指定一个默认的源， 这样以后push就不用加origin
git push -u origin xxx
//以后就可以
git push

```

- 拉取远程仓库

```js
git pull origin xxx
//可以简写git pull， 如果提示no tracking information， 我们可以通过下面方法建立追踪，后续就可以直接git pull了
git branch --set-upstream branch-name origin/branch-name
```


- 差异比较

```js
git diff
```

- 查看提交历史

```js
git log                 //按提交时间列出所有的更新，最近的更新排在最上面
git log --oneline       //查看简要的历史记录
git reflog              //用来记录每一次命令， 常用来辅助版本切换
```

**一次正常的代码提交流程**

```js
git pull
git add .
git commit -m 'xxx'
git push
```

### git版本切换

有时候业务场景， 或者需求变更等各种因素， 需要我们切换回之前的某个版本。

要进行版本切换， 我们就得知道当前处于哪个版本：

```js
git log --oneline
```
带有`HEAD`字样的就是我们当前所在版本， 通过`git reset --hard id`命令切换版本。 id可以是：
    - HEAD^ : 上个版本
    - HEAD^^: 上上个版本
    - HEAD~10: 上10个版本

当你切换回上某个版本之后， 通过`git log`你就看不到最新版本了，这时我们就可以使用`git reflog`了， 这个命令会按照之前经过的所有的`commit`路径排列。

### git分支管理

我们一般开发都会从`master`分支分离出`dev`或者其他开发分支， 用来开发， 这样即使开发出现问题也不会影响主分支。

使用`git branch xxx`创建一个新的分支。

使用`git checkout xxx`切换到新的分支

`branch, checkout`常用命令:

```js
git checkout -b xxx         //可以快速新建并切换到新的分支

git branch -d xxx           //当分支合并到主分支， 这个分支就可以通过-d删除了

git branch -D xxx           //删除那些没有被合并的分支

git branch -a               //查看所有分支
```
#### 分支合并

**注意： 分支合并时， 你一定要保证你在要合并到这个分支的目标分支上**

使用`git merge xxx`即可将xxx分支合并到你当前所在的分支。

正常的合并分支很简单， 这样就ok了， 但是分支合并， 如果在不同的分支修改了同一个文件的同一部分， 此时git是无法判断该使用哪个分支的代码的， 这样就会产生冲突，虽然git进行了合并， 但并没有提交，  需要我们解决冲突， 重新提交。

我们可以通过`git status`查看是哪些文件发生了冲突，然后逐一解决， 当我们把冲突的代码按正确的代码修复后， 需要重新`git add`, `git commit`, `git push`。

### 操作远程仓库

#### clone远程仓库

通过`git clone url`来克隆远程仓库

比如：
```js
//这个默认会在你拉取的路径下新建一个blog-mason的文件夹
git clone https://github.com/MasonEast/blog-mason.git   

//如果你不想要文件夹blog-mason， 你可以这样, 在url后面，空格加新名字
git clone https://github.com/MasonEast/blog-mason.git newName

//如果你就想要在当前路径下放项目文件， 不要那个外面的文件夹了， 可以用.
git clone https://github.com/MasonEast/blog-mason.git .
```

#### 查看远程仓库git remote

我们克隆的仓库通过`git remote`会看到一个叫origin的远程库， 这是git默认标识克隆的原始仓库

通过`git remote -v`或`git remote --verbose`我们可以查看到更加详细的信息，即对应的项目地址， 正常会有两个， 但如果你没有push权限的话就只能看到一个fetch的地址。

```js
git remote -v

origin  git@github.com:MasonEast/blog-mason.git (fetch)
origin  git@github.com:MasonEast/blog-mason.git (push)
```

#### 删除远程分支

```js
git push origin :xxx
//也可以
git push origin --delete xxx
```

#### 删除远程仓库

```js
git remote rm xxx
```

#### 重命名远程仓库

```
git remote rename oldName newName
```








### 关于误操作

git主要用于版本控制， 协同开发， 误操作可以撤销， 但是有的撤销是不可逆的， 我们一定要慎重对待， 不然可能导致部分代码丢失。

#### 修改最后一次提交

场景： 某次提交完后， 发现少提交了文件， 我们需要撤销刚才的提交， 然后重新提交。

```js
git add xxx             //添加少提交的文件到暂存区
git commit --amend      //往最后一次提交中追加少提交的文件， 这次提交不会产生记录
```

#### 移除本地仓库的文件

场景： 我们通过`git commit`将文件提交到本地仓库后， 才想起来把不想提交的文件加进去了。

```js
git rm xxx  
```

#### 移除暂存区的文件

场景： 有时候我们习惯性`git add .`， 但有的文件我们不应该提交， 这时要从暂存区中移除文件。

```js
git reset HEAD xxx      //从暂存区中移除xxx文件
```

