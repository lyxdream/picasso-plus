1、unbuild

2、写完组件库搭建一个项目，使用组件库(按需引入)

5. webpack 的 externals 配置

> webpack 中的 externals 配置提供了不从 bundle 中引用依赖的方式。解决的是，所创建的 bundle 依赖于那些存在于用户环境(consumer environment)中的依赖。

> 意思是如果需要引用一个库，但是又不想让 webpack 打包（减少打包的时间），并且又不影响我们在程序中以 CMD、AMD 或者 window/global 全局等方式进行使用（一般都以 import 方式引用使用），那就可以通过配置 externals。

> 目的就是将不怎么需要更新的第三方库脱离 webpack 打包，不被打入 bundle 中，从而减少打包时间，但又不影响运用第三方库的方式，例如 import 方式等。

externals 支持模块上下文的方式

```
global - 外部 library 能够作为全局变量使用。用户可以通过在 script 标签中引入来实现。这是 externals 的默认设置。

commonjs - 用户(consumer)应用程序可能使用 CommonJS 模块系统，因此外部 library 应该使用 CommonJS 模块系统，并且应该是一个 CommonJS 模块。

commonjs2 - 类似上面几行，但导出的是 module.exports.default。

amd - 类似上面几行，但使用 AMD 模块系统。

```
