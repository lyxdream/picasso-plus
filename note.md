# Vue3组件库搭建

## 1.搭建monorepo环境

> 使用pnpm安装包速度快，磁盘空间利用率高效，使用pnpm可以快速建立monorepo

```
npm install pnpm -g # 全局安装pnpm
pnpm init # 初始化package.json配置文件
pnpm install vue@next typescript -D 全局下添加依赖
npx tsc --init # 初始化ts配置文件 
```
> 使用pnpm必须要建立.npmrc文件，shamefully-hoist = true，否则安装的模块无法放置到node_modules目录下

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
    "lib": [ // 编译时用的库
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
  "exclude": [ // 排除掉哪些类库
    "node_modules",
    "**/__tests__",
    "dist/**"
  ]
}
```

在项目根目录下建立pnpm-workspace.yaml配置文件

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

> 配置play/package.json

```json
{
  "name": "@picasso-plus/play",
  "version": "1.0.0",
  "description": "测试组件",
  "main": "index.js",
  "scripts": {
   "dev":"vite"
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
import vue from '@vitejs/plugin-vue'
import {defineConfig} from 'vite'

export default defineConfig({
   plugins:[vue()]
})

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
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
    <div id="app"></div>
    <script type="module" src="./main.ts" ></script>
</body>
</html>
```
> play/main.ts

```ts
import {createApp} from 'vue'
import App from './app.vue'
createApp(App).mount("#app")
```


> 提供typescript声明文件 根目录下 typings/vue-shim.d.ts

```
//定义所有.vue结尾的类型的
declare module "*.vue"{
  import type { defineComponent } from "vue";
  const component:defineComponent<{},{},any>
  export default component
}
```

启动服务

- 切到play目录下

```bash
pnpm run dev
```

- 或者在根目录得package.json配置：

```json
"scripts": {
    "dev": "pnpm -C play dev"
  },
```
则可以在根目录直接访问：

```
pnpm run dev
```


## 编写组件

