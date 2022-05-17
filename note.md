# Vue3 组件库搭建

## 1.搭建 monorepo 环境

> 使用 pnpm 安装包速度快，磁盘空间利用率高效，使用 pnpm 可以快速建立 monorepo

```
npm install pnpm -g # 全局安装pnpm
pnpm init # 初始化package.json配置文件
pnpm install vue@next typescript -D 全局下添加依赖
npx tsc --init # 初始化ts配置文件
```

> 使用 pnpm 必须要建立.npmrc 文件，shamefully-hoist = true，否则安装的模块无法放置到 node_modules 目录下

```json
{
  "compilerOptions": {
    "module": "ESNext", // 打包模块类型ESNext
    "declaration": false, // 默认不要声明文件
    "noImplicitAny": false, // 支持类型不标注可以默认any
    "removeComments": true, // 删除注释
    "moduleResolution": "node", // 按照node模块来解析
    "esModuleInterop": true, // 支持es6,commonjs模块
    "jsx": "preserve", // jsx 不转
    "noLib": false, // 不处理类库
    "target": "es6", // 遵循es6版本
    "sourceMap": true,
    "lib": [
      // 编译时用的库
      "ESNext",
      "DOM"
    ],
    "allowSyntheticDefaultImports": true, // 允许没有导出的模块中导入
    "experimentalDecorators": true, // 装饰器语法
    "forceConsistentCasingInFileNames": true, // 强制区分大小写
    "resolveJsonModule": true, // 解析json模块
    "strict": true, // 是否启动严格模式
    "skipLibCheck": true // 跳过类库检测
  },
  "exclude": [
    // 排除掉哪些类库
    "node_modules",
    "**/__tests__",
    "dist/**"
  ]
}
```

在项目根目录下建立 pnpm-workspace.yaml 配置文件

```
packages:
  - 'packages/**' # 存放编写组件的
  - docs # 存放文档的
  - play # 测试组件的
```

## 2.创建组件测试环境

```
mkdir play && cd play
pnpm init
pnpm install vite @vitejs/plugin-vue # 安装vite及插件
```

```
play
  ├─app.vue
  ├─index.html
  ├─main.ts
  ├─package.json
  └─vite.config.ts
```

> 配置 play/package.json

```json
{
  "name": "@picasso-plus/play",
  "version": "1.0.0",
  "description": "测试组件",
  "main": "index.js",
  "scripts": {
    "dev": "vite"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@vitejs/plugin-vue": "^2.3.3",
    "vite": "^2.9.9"
  }
}
```

> play/vite.config.ts

```ts
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue()],
});
```

> play/app.vue

```vue
<template>
  <div>1111</div>
</template>
```

> play/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

> play/main.ts

```ts
import { createApp } from "vue";
import App from "./app.vue";
createApp(App).mount("#app");
```

> 提供 typescript 声明文件 根目录下 typings/vue-shim.d.ts

```
//定义所有.vue结尾的类型的
declare module "*.vue"{
  import type { defineComponent } from "vue";
  const component:defineComponent<{},{},any>
  export default component
}
```

启动服务

- 切到 play 目录下

```bash
pnpm run dev
```

- 或者在根目录得 package.json 配置：

```json
"scripts": {
    "dev": "pnpm -C play dev"
  },
```

则可以在根目录直接访问：

```
pnpm run dev
```

## 3.编写组件

安装 sass

```
pnpm install sass -w

```

## 4.字体图标

## 5.打包组件库

1、打包样式 2、打包所有组件 3、打包每个组件 4、生成一个组件库 5、发布组件

### 打包样式

```
gulp
@types/gulp  gulp的类型声明文件
sucrase 编译器

pnpm install gulp @types/gulp sucrase -w -D

pnpm add  @types/sass --filter @picasso-plus/theme-chalk

```

```
pnpm add gulp-sass @types/gulp-sass @types/sass @types/gulp-autoprefixer gulp-autoprefixer @types/gulp-clean-css gulp-clean-css  -D --filter @picasso-plus/theme-chalk
```

### 打包所有组件

```

pnpm install rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs rollup-plugin-typescript2 rollup-plugin-vue -D -w

rollup
@rollup/plugin-node-resolve  解析第三方模块
@rollup/plugin-commonjs
rollup-plugin-typescript2   //编译ts
rollup-plugin-vue   //.vue文件
 -w 安装到跟目录下
```

对打包之后的路径做处理
```
import { withInstall } from '@picasso-plus/utils/install';

改为：

import { withInstall } from  'picasso-plus/es/utils/install'
```


扩展：

"inherit":通过相应的标准输入输出流传入/传出父进程

- sucrase

> sucrase 是一款 JavaScript/TypeScript 编译器，目标是提供比标准 Babel 编译器更快的构建速度，在 npm 的 sucrase 的介绍中，被称之为 babel 的替代品，号称比 babel 快 20 倍
> sucrase 允许超快速开发，但它只能在最新 node 6 以上及非 ie 浏览器中使用。
> sucrase 是从 babel 派生而来，算是 babel 的子集

- spawn

> child_process.spawn(command[, args][, options])

command <string> 要运行的命令。
args <string[]> 字符串参数列表。
options <Object>

```
  - cwd <string> | <URL> 子进程的当前工作目录。
  - env <Object> 环境变量键值对。 默认值: process.env。
  - argv0 <string> 显式设置发送给子进程的 argv[0] 的值。 如果未指定，这将设置为 command。
  - stdio <Array> | <string> 子进程的标准输入输出配置（参见 options.stdio）。
  - shell <boolean> | <string> 如果是 true，则在 shell 内运行 command。 在 Unix 上使用 '/bin/sh'，在 Windows 上使用 process.env.ComSpec。 可以将不同的 shell 指定为字符串。 请参阅 shell 的要求和默认的 Windows shell。 默认值: false （没有 shell）
```

- series 将任务函数和/或组合操作组合成更大的操作，这些操作将按顺序依次执行。
- parallel 将任务功能和/或组合操作组合成同时执行的较大操作。
  --filter ./packages
  --parallel

```
完全不考虑并发性和拓扑排序，在所有匹配的包中立即运行给定的脚本，并带有前缀流式输出。对于长时间运行的流程，这是优于许多包的首选标志，例如，长时间的构建流程。
```

- moduleResolution 的两种配置，node 会先到 node_modules 目录去查找，classic 会优先到外层去查找，找不到才会去 node_modules 目录去查找
