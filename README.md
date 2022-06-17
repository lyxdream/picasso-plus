- build 负责打包的文件夹 gulp 编译 ts， 打包样式， 打包单文件组件
- dist 就是我们最终生成的打包结果
- packages 放着我们组件的代码 monorepo
- play 用来测试代码 写的组件是否 ok， 调试用的
- typings 放上我们的类型声明
- .npmrc 需要增加此文件安装依赖才会正常
- tsconfig ts 的配置

## packages

> components 存放所有组件的 最终通过 index.ts 导出所有的组件
> theme-chalk 做样式的 BEM （后续控制样式）
> utils 主要存放着多个模块之间的公共方法

## build 打包模块 gulp 来控制流程的

build 目前我们实现了打包样式 、 工具方法

## dist 目录打包出的整体结果

es/lib 两种规范
theme-chalk
最终发布的模块就是 dist 模块 -》 element-plus -》 z-plus

z-plus 就是我们组件库的整合入口

- gulp 适合流程控制和代码的转义
