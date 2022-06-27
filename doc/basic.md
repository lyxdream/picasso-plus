1、unbuild
2、Element Plus 提供了基于 ES Module 开箱即用的 Tree Shaking 功能。

```vue
<template>
  <el-button>I am ElButton</el-button>
</template>
<script>
import { ElButton } from "element-plus";
export default {
  components: { ElButton },
};
</script>
```

```js
// element-plus\packages\components\index.ts
export * from "./button";
```

```js
// element-plus\packages\components\button.ts
import { withInstall } from "@element-plus/utils";

import Button from "./src/button.vue";

export const ElButton = withInstall(Button);
export default ElButton;

export * from "./src/button";

// export *  导出文件里面的所有内容
```

3. 按需导入

(1)element-ui 2.0
借助 babel-plugin-component，我们可以只引入需要的组件，以达到减小项目体积的目的。

```
npm install babel-plugin-component -D
```

```
将 .babelrc 修改为：
  {
    "presets": [["es2015", { "modules": false }]],
    "plugins": [
      [
        "component",
        {
          "libraryName": "element-ui",
          "styleLibraryName": "theme-chalk"
        }
      ]
    ]
  }
```

```
  import { Button, Select } from 'element-ui';
```

**插件的作用**

```js
//编译之前：

import { Button } from "element-ui";

//编译之后：

var button = require("element-ui/lib/button");
require("element-ui/lib/theme-chalk/button/button.css");

//require('element-ui/lib/button/style.css')
```

(2)element-plus

首先你需要安装 unplugin-vue-components 和 unplugin-auto-import 这两款插件

```
 npm install -D unplugin-vue-components unplugin-auto-import
```

**插件的作用**

> unplugin-auto-import 自动导入 js 依赖部分，无需再手动引入

```js
import { ref } from "vue";
const count = ref(0);
//用插件之后：
const count = ref(0);
```

> unplugin-vue-components 自动导入 components，无需再手动引入

```js
<template>
  <div>
    <HelloWorld msg="Hello Vue 3.0 + Vite" />
  </div>
</template>

<script>
 import HelloWorld from './src/components/HelloWorld.vue'
  export default {
    name: 'App',
    components: {
      HelloWorld
    }
  }
</script>
 //使用插件之后：
 <template>
  <div>
    <HelloWorld msg="Hello Vue 3.0 + Vite" />
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>
```

> 插件使用

Vite 和 webpack 的使用方式：

https://element-plus.gitee.io/zh-CN/guide/quickstart.html#%E6%8C%89%E9%9C%80%E5%AF%BC%E5%85%A5

4. 写完项目搭建一个项目，使用组件库(按需引入)

> 插件 babel-plugin-import

功能：

```
import { Button } from 'antd';
ReactDOM.render(<Button>xxxx</Button>);

      ↓ ↓ ↓ ↓ ↓ ↓

var _button = require('antd/lib/button');
ReactDOM.render(<_button>xxxx</_button>);


{
  "libraryName": "antd",
  "libraryDirectory": "lib",   // default: lib
  "camel2DashComponentName": false,  // default: true
  "style": true
}

```

```
// .babelrc
"plugins": [
["import", { "libraryName": "antd", "libraryDirectory": "lib"}, "antd"],
["import", { "libraryName": "antd-mobile", "libraryDirectory": "lib"}, "antd-mobile"]
]

[
  "import",
    {
      "libraryName": "antd",
      "customName": require('path').resolve(__dirname, './customName.js')
    }
]

 plugins: [
  [
    "import",
    {
      libraryName: "antd",
      camel2DashComponentName: false,
      customName: (name) => `@antd/packages/${name}`,
    },
  ],
],
```

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

6. import \* as xx
<!-- 导出文件里面的所有内容 -->

```1.js
  const b = {
  test: 1,
};

export const a = {
  test: 1,
};

export default {
  b,
};

```

```js
import * as test1 from "./1.js";
console.log(test1)

//打印
[Module: null prototype] {
  a: { test: 1 },
  default: { b: { test: 1 } }
} ===test1
```

7. exports 和 module.exports 区别

- exports 只能使用语法来向外暴露内部变量：如 exports.xxx = xxx;
- module.exports 既可以通过语法，也可以直接赋值一个对象。

```js
console.log(module.exports === exports);
//true
```

> 改变 exports 的指向

```js
exports = [0, 1];
console.log(exports === module.exports); //false
```

> 如果直接通过 exports.xxx 的形式赋值，那么他们依然会指向同一个地址：

```js
exports.array = [0, 1];
console.log(exports === module.exports);
```
