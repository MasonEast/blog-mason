# 前言
webpack 只支持JS模块，所有其他类型的模块，比如图片，css等，都需要通过对应的loader转成JS模块。所以在webpack中无论任何类型的资源，本质上都被当成JS模块处理。

Webpack 源码是一个插件的架构，他的很多功能都是通过诸多的内置插件实现的。

从配置文件读取 entry 开始，到最后输出 bundle.js 的过程，就是主线

应该关心如下几点：

webpack 的编译过程主要有哪些阶段？（生命周期）

before-run
run
before-compile
compile
this-compilation
compilation 这里进行一些代码编译的准备工作
make 这里进行代码编译
after-compile 这里会根据编译结果 合并出我们最终生成的文件名和文件内容。

webpack 是如何 从 entry 开始解析出整个依赖树的？

loaders 是在何时被调用的？

最终是如何知道要生成几个文件，以及每个文件的内容的？ 而其他一些不重要的问题我们尽量忽略，比如如何解析配置，如何处理错误，HASH 规则等。

编译源码分为以下几步：

1. 根据我们的webpack配置注册号对应的插件；

2. 调用 compile.run 进入编译阶段，

3. 在编译的第一阶段是 compilation，他会注册好不同类型的module对应的 factory，不然后面碰到了就不知道如何处理了

4. 进入 make 阶段，会从 entry 开始进行两步操作：

5. 第一步是调用 loaders 对模块的原始代码进行编译，转换成标准的JS代码

6. 第二步是调用 acorn 对JS代码进行语法分析，然后收集其中的依赖关系。每个模块都会记录自己的依赖关系，从而形成一颗关系树

7. 最后调用 compilation.seal 进入 render 阶段，根据之前收集的依赖，决定生成多少文件，每个文件的内容是什么

##
当我们`const webpack = require('webpack')`时：

会从webpack包的`package.json`文件的`main`字段找到入口文件， 这里是：

```js
"main": "lib/index.js",
```

## 入口

我们找到`lib/index.js`文件： 发现它通过module.exports对外暴露了`webpack`及其他一些方法。

这里有个有意思的函数：

```js
const exportPlugins = (obj, mappings) => {
	for (const name of Object.keys(mappings)) {
		Object.defineProperty(obj, name, {
			configurable: false,
			enumerable: true,
			get: mappings[name]
		});
	}
};

exportPlugins((module.exports.cache = {}), {
	MemoryCachePlugin: () => require("./cache/MemoryCachePlugin")
});
```

通过这个函数， 实现了往`module.exports`这个对象上添加属性， 并设置属性的`configurable`, `enumerable`, `get`等特性。

## webpack

我们顺着index.js找到`webpack.js`。

```js
const webpack = (options, callback) => {
    if (Array.isArray(options)) {
        compiler = createMultiCompiler(options);
    } else {
        compiler = createCompiler(options);
    }
    if (callback) {}

    return compiler;
};

module.exports = webpack;
```

简化一下发现webpack是一个方法， 支持两个参数， callback是一个可选的回调。 options支持数组形式，这里我们暂时按只传一个非数组的options往下走（options就是我们在项目里配置的`webpack.config.js`文件）

这里进入 `createCompiler`方法, 发现了compiler原来是一个构造函数的实例，

```js
const createCompiler = options => {
    options = new WebpackOptionsDefaulter().process(options);   //针对webpack的默认设置，主要功能内容都在原型上面
    const compiler = new Compiler(options.context);             //根据配置的option生成compiler实例, 此时的options.context是process.cwd() 方法返回 Node.js 进程的当前工作目录。
    compiler.options = options;
    new NodeEnvironmentPlugin({
        infrastructureLogging: options.infrastructureLogging
    }).apply(compiler);
    if (Array.isArray(options.plugins)) {                   ///这里会解析webpack.config.js的plugins
        for (const plugin of options.plugins) {
            if (typeof plugin === "function") {
                plugin.call(compiler, compiler);
            } else {
                plugin.apply(compiler);
            }
        }
    }
    compiler.hooks.environment.call();
    compiler.hooks.afterEnvironment.call();
    compiler.options = new WebpackOptionsApply().process(options, compiler);            ////这里会解析webpack.config.js的entry
    return compiler;
};

```

##  Compiler
我们进到`compiler.js`中来看这个Compiler构造函数。 当我们执行编译时， 我从`create-react-app`的cli上发现会执行compiler实例的`run`方法。 

```js
   run (callback) {                                 //compiler实例编译要执行的run方法
        this.cache.endIdle(err => {
            if (err) return finalCallback(err);

            this.hooks.beforeRun.callAsync(this, err => {
                if (err) return finalCallback(err);

                this.hooks.run.callAsync(this, err => {
                    if (err) return finalCallback(err);

                    this.readRecords(err => {
                        if (err) return finalCallback(err);

                        this.compile(onCompiled);
                    });
                });
            });
        });
    }
```

发现这里出现了`hooks`， 在Compiler不难找到hooks在constructor中已经注册， 来自`tapable`这个库。

beforerun， run都是来自这个库的`AsyncSeriesHook`的实例
compile是来自这个库的`SyncHook`的实例

```js
beforeRun: new AsyncSeriesHook(["compiler"]),
run: new AsyncSeriesHook(["compiler"]),
compile: new SyncHook(["params"]),
```

为了下一步的解读， 我们首先就要去弄清`tapable`这个库都有些什么东西。

## tapable

Webpack为此专门自己写一个插件系统，叫 Tapable ， 主要提供了注册和调用插件的功能。

我们先弄清楚这里需要用到的 `SyncHook`和`AsyncSeriesHook`。

### SyncHook

`SyncHook` 为串行同步执行，不关心事件处理函数的返回值，在触发事件之后，会按照事件注册的先后顺序执行所有的事件处理函数。

在 tapable 解构的 SyncHook 是一个类，注册事件需先创建实例，创建实例时支持传入一个数组，数组内存储事件触发时传入的参数，实例的 tap 方法用于注册事件，支持传入两个参数，第一个参数为事件名称，在 Webpack 中一般用于存储事件对应的插件名称（名字随意，只是起到注释作用）， 第二个参数为事件处理函数，函数参数为执行 call 方法触发事件时所传入的参数的形参。

### AsyncSeriesHook
AsyncSeriesHook 为异步串行执行，通过 tapAsync 注册的事件，通过 callAsync 触发，通过 tapPromise 注册的事件，通过 promise 触发，可以调用 then 方法。

注： 异步串行是指，事件处理函数内三个定时器的异步执行时间分别为 1s、2s 和 3s，而三个事件处理函数执行完总共用时接近 6s，所以三个事件处理函数执行是需要排队的，必须一个一个执行，当前事件处理函数执行完才能执行下一个。

AsyncSeriesHook 的 next 执行机制更像 Express 和 Koa 中的中间件，在注册事件的回调中如果不调用 next，则在触发事件时会在没有调用 next 的事件处理函数的位置 “卡死”，即不会继续执行后面的事件处理函数，只有都调用 next 才能继续，而最后一个事件处理函数中调用 next 决定是否调用 callAsync 的回调。

### 总结

在 tapable 源码中，注册事件的方法 tab、tapSync、tapPromise 和触发事件的方法 call、callAsync、promise 都是通过 compile 方法快速编译出来的，我们本文中这些方法的实现只是遵照了 tapable 库这些 “钩子” 的事件处理机制进行了模拟，以方便我们了解 tapable，为学习 Webpack 原理做了一个铺垫，在 Webpack 中，这些 “钩子” 的真正作用就是将通过配置文件读取的插件与插件、加载器与加载器之间进行连接，“并行” 或 “串行” 执行。

## 

我们对`tapable`的hooks有了一定理解， 继续往下走：

如果没有出错， 我们会执行下面这个方法

```js
this.compile(onCompiled);
```


### compile方法

这个compile不是上面的对象实例`compile`， 而是在Compiler中定义的compile方法

代码中的`new Compilation(params)`， `Compilation`是一个2000多行代码的构造函数， 获取到的compilation实例，它就是我们需要的**编译对象**.

compilation 会存储编译一个 entry 的所有信息，包括他的依赖，对应的配置等

```js
compile (callback) {
    const params = this.newCompilationParams();
    this.hooks.beforeCompile.callAsync(params, err => {
        if (err) return callback(err);

        this.hooks.compile.call(params);

        const compilation = this.newCompilation(params);       //最主要的在这里， 获取compliation实例

        const logger = compilation.getLogger("webpack.Compiler");

        logger.time("make hook");
        this.hooks.make.callAsync(compilation, err => {
            logger.timeEnd("make hook");
            if (err) return callback(err);

            process.nextTick(() => {    //将 callback 添加到下一个时间点的队列。 在 JavaScript 堆栈上的当前操作运行完成之后以及允许事件循环继续之前，此队列会被完全耗尽。
                logger.time("finish compilation");
                compilation.finish(err => {             //下面的finish方法
                    logger.timeEnd("finish compilation");
                    if (err) return callback(err);

                    logger.time("seal compilation");
                    compilation.seal(err => {
                        logger.timeEnd("seal compilation");
                        if (err) return callback(err);

                        logger.time("afterCompile hook");
                        this.hooks.afterCompile.callAsync(compilation, err => {
                            logger.timeEnd("afterCompile hook");
                            if (err) return callback(err);

                            return callback(null, compilation);
                        });
                    });
                });
            });
        });
    });
}
```

#### compilation.finish()

收集依赖

```js
finish(callback) {
    const { moduleGraph, modules } = this;
    for (const module of modules) {
        moduleGraph.finishModule(module);
    }
    this.hooks.finishModules.callAsync(modules, err => {
        if (err) return callback(err);

        // extract warnings and errors from modules
        for (const module of modules) {
            this.reportDependencyErrorsAndWarnings(module, [module]);
            const errors = module.getErrors();
            if (errors !== undefined) {
                if (module.isOptional(this.moduleGraph)) {
                    for (const error of errors) {
                        if (!error.module) {
                            error.module = module;
                        }
                        this.warnings.push(error);
                    }
                } else {
                    for (const error of errors) {
                        if (!error.module) {
                            error.module = module;
                        }
                        this.errors.push(error);
                    }
                }
            }
            const warnings = module.getWarnings();
            if (warnings !== undefined) {
                for (const warning of warnings) {
                    if (!warning.module) {
                        warning.module = module;
                    }
                    this.warnings.push(warning);
                }
            }
        }

        callback();
    });
}
```

#### compilation.seal()

把所有依赖的模块都通过对应的模板 render 出一个拼接好的字符串

```js
seal(callback) {
    const chunkGraph = new ChunkGraph(this.moduleGraph);
    this.chunkGraph = chunkGraph;

    for (const module of this.modules) {
        ChunkGraph.setChunkGraphForModule(module, chunkGraph);
    }

    this.hooks.seal.call();

    while (this.hooks.optimizeDependencies.call(this.modules)) {
        /* empty */
    }
    this.hooks.afterOptimizeDependencies.call(this.modules);

    this.hooks.beforeChunks.call();
    for (const [name, dependencies] of this.entryDependencies) {
        const chunk = this.addChunk(name);
        chunk.name = name;
        const entrypoint = new Entrypoint(name);
        entrypoint.setRuntimeChunk(chunk);
        this.namedChunkGroups.set(name, entrypoint);
        this.entrypoints.set(name, entrypoint);
        this.chunkGroups.push(entrypoint);
        connectChunkGroupAndChunk(entrypoint, chunk);

        for (const dep of dependencies) {
            entrypoint.addOrigin(null, { name }, dep.request);

            const module = this.moduleGraph.getModule(dep);
            if (module) {
                chunkGraph.connectChunkAndModule(chunk, module);
                chunkGraph.connectChunkAndEntryModule(chunk, module, entrypoint);
                this.assignDepth(module);
            }
        }
    }
    buildChunkGraph(
        this,
        /** @type {Entrypoint[]} */ (this.chunkGroups.slice())
    );
    this.hooks.afterChunks.call(this.chunks);

    this.hooks.optimize.call();

    while (this.hooks.optimizeModules.call(this.modules)) {
        /* empty */
    }
    this.hooks.afterOptimizeModules.call(this.modules);

    while (this.hooks.optimizeChunks.call(this.chunks, this.chunkGroups)) {
        /* empty */
    }
    this.hooks.afterOptimizeChunks.call(this.chunks, this.chunkGroups);

    this.hooks.optimizeTree.callAsync(this.chunks, this.modules, err => {
        if (err) {
            return callback(
                makeWebpackError(err, "Compilation.hooks.optimizeTree")
            );
        }

        this.hooks.afterOptimizeTree.call(this.chunks, this.modules);

        while (this.hooks.optimizeChunkModules.call(this.chunks, this.modules)) {
            /* empty */
        }
        this.hooks.afterOptimizeChunkModules.call(this.chunks, this.modules);

        const shouldRecord = this.hooks.shouldRecord.call() !== false;

        this.hooks.reviveModules.call(this.modules, this.records);
        this.hooks.beforeModuleIds.call(this.modules);
        this.hooks.moduleIds.call(this.modules);
        this.hooks.optimizeModuleIds.call(this.modules);
        this.hooks.afterOptimizeModuleIds.call(this.modules);

        this.hooks.reviveChunks.call(this.chunks, this.records);
        this.hooks.beforeChunkIds.call(this.chunks);
        this.hooks.chunkIds.call(this.chunks);
        this.hooks.optimizeChunkIds.call(this.chunks);
        this.hooks.afterOptimizeChunkIds.call(this.chunks);

        this.sortItemsWithChunkIds();

        if (shouldRecord) {
            this.hooks.recordModules.call(this.modules, this.records);
            this.hooks.recordChunks.call(this.chunks, this.records);
        }

        this.hooks.optimizeCodeGeneration.call(this.modules);

        this.hooks.beforeModuleHash.call();
        this.createModuleHashes();
        this.hooks.afterModuleHash.call();

        this.hooks.beforeCodeGeneration.call();
        this.codeGenerationResults = this.codeGeneration();
        this.hooks.afterCodeGeneration.call();

        this.hooks.beforeRuntimeRequirements.call();
        this.processRuntimeRequirements(this.entrypoints.values());
        this.hooks.afterRuntimeRequirements.call();

        this.hooks.beforeHash.call();
        this.createHash();
        this.hooks.afterHash.call();

        if (shouldRecord) {
            this.hooks.recordHash.call(this.records);
        }

        this.clearAssets();

        this.hooks.beforeModuleAssets.call();
        this.createModuleAssets();

        const cont = () => {
            this.hooks.additionalChunkAssets.call(this.chunks);
            this.summarizeDependencies();
            if (shouldRecord) {
                this.hooks.record.call(this, this.records);
            }

            this.hooks.additionalAssets.callAsync(err => {
                if (err) {
                    return callback(
                        makeWebpackError(err, "Compilation.hooks.additionalAssets")
                    );
                }
                this.hooks.optimizeChunkAssets.callAsync(this.chunks, err => {
                    if (err) {
                        return callback(
                            makeWebpackError(err, "Compilation.hooks.optimizeChunkAssets")
                        );
                    }
                    this.hooks.afterOptimizeChunkAssets.call(this.chunks);
                    this.hooks.optimizeAssets.callAsync(this.assets, err => {
                        if (err) {
                            return callback(
                                makeWebpackError(err, "Compilation.hooks.optimizeAssets")
                            );
                        }
                        this.hooks.afterOptimizeAssets.call(this.assets);
                        if (this.hooks.needAdditionalSeal.call()) {
                            this.unseal();
                            return this.seal(callback);
                        }
                        this.hooks.finishAssets.callAsync(this.assets, err => {
                            if (err) {
                                return callback(
                                    makeWebpackError(err, "Compilation.hooks.finishAssets")
                                );
                            }
                            this.hooks.afterFinishAssets.call(this.assets);
                            this.cache.storeBuildDependencies(
                                this.buildDependencies,
                                err => {
                                    if (err) {
                                        return callback(err);
                                    }
                                    return this.hooks.afterSeal.callAsync(callback);
                                }
                            );
                        });
                    });
                });
            });
        };

        if (this.hooks.shouldGenerateChunkAssets.call() !== false) {
            this.hooks.beforeChunkAssets.call();
            this.createChunkAssets(err => {
                if (err) {
                    return callback(err);
                }
                cont();
            });
        } else {
            cont();
        }
    });
}
```

### compile方法的params参数

```js
createNormalModuleFactory () {
    const normalModuleFactory = new NormalModuleFactory({       
        context: this.options.context,                      //node工作进程的文件目录
        fs: this.inputFileSystem,
        resolverFactory: this.resolverFactory,
        options: this.options.module || {}                  //这里就是webpack.config.js的module对象
    });
    this.hooks.normalModuleFactory.call(normalModuleFactory);
    return normalModuleFactory;
}

createContextModuleFactory () {
    const contextModuleFactory = new ContextModuleFactory(this.resolverFactory);
    this.hooks.contextModuleFactory.call(contextModuleFactory);
    return contextModuleFactory;
}

const params = {
    normalModuleFactory: this.createNormalModuleFactory(),          //这里会解析webpack.config.js的loaders， 并通过loaders将它们转换成js代码
    contextModuleFactory: this.createContextModuleFactory()
};
return params;
```

### onCompiled方法
```js
const onCompiled = (err, compilation) => {
    if (err) return finalCallback(err);

    if (this.hooks.shouldEmit.call(compilation) === false) {
        const stats = new Stats(compilation);
        stats.startTime = startTime;
        stats.endTime = Date.now();
        this.hooks.done.callAsync(stats, err => {
            if (err) return finalCallback(err);
            return finalCallback(null, stats);
        });
        return;
    }

    process.nextTick(() => {
        logger = compilation.getLogger("webpack.Compiler");
        logger.time("emitAssets");
        this.emitAssets(compilation, err => {
            logger.timeEnd("emitAssets");
            if (err) return finalCallback(err);

            if (compilation.hooks.needAdditionalPass.call()) {
                compilation.needAdditionalPass = true;

                const stats = new Stats(compilation);
                stats.startTime = startTime;
                stats.endTime = Date.now();
                logger.time("done hook");
                this.hooks.done.callAsync(stats, err => {
                    logger.timeEnd("done hook");
                    if (err) return finalCallback(err);

                    this.hooks.additionalPass.callAsync(err => {
                        if (err) return finalCallback(err);
                        this.compile(onCompiled);               //递归调用对下一层进行编译
                    });
                });
                return;
            }

            logger.time("emitRecords");
            this.emitRecords(err => {
                logger.timeEnd("emitRecords");
                if (err) return finalCallback(err);

                const stats = new Stats(compilation);
                stats.startTime = startTime;
                stats.endTime = Date.now();
                logger.time("done hook");
                this.hooks.done.callAsync(stats, err => {
                    logger.timeEnd("done hook");
                    if (err) return finalCallback(err);
                    return finalCallback(null, stats);
                });
            });
        });
    });
};
```
