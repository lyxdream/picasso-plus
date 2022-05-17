import { series, parallel } from "gulp";
import { withTaskName, run } from "./utils";

//gulp不叫打包 做代码转化
//控制构建流程

//1、打包样式 打包工具 2、打包所有组件库 3、打包每个组件 4、生成一个组件库 5、发布组件
// pnpm run -C packages/theme-chalk build
export default series(
  withTaskName("clean", () => run("rm -rf ./dist")),
  parallel(
    withTaskName("buildPackages", () =>
      run("pnpm run --filter ./packages/** --parallel build")
    ),
    // 执行build命令时会调用rollup, 我们给rollup传递参数buildFullComponent 那么就会执行导出任务叫 buildFullComponent
    withTaskName("buildFullComponent", () =>
      run("pnpm run build buildFullComponent")
    ),
    withTaskName("buildComponent", () => run("pnpm run build buildComponent"))
  )
);

export * from "./full-component";
export * from "./component";
