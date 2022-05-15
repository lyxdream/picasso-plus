//结构出来使用  import {PIcon} from 'pplus'    export * from '@p-plus/components'
import { PIcon } from "@picasso-plus/components";
import type { App } from "vue"; // ts中的优化只获取类型

const components = [PIcon];
// 每个组件在编写的时候都提供了install方法
const install = (app: App) => {
  // 有的是组建 有的可能是指令 xxx.install = ()=>{app.directive()}
  components.forEach((component) => app.use(component));
};

export default {
  install,
};

export * from "@picasso-plus/components";
