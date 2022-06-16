import { series, parallel } from "gulp";
import { withTaskName, run } from "./src/utils";

//gulp不叫打包 做代码转化
//控制构建流程

//1、打包样式 打包工具 2、打包所有组件库 3、打包每个组件 4、生成一个组件库 5、发布组件
// pnpm run -C packages/theme-chalk build
// withTaskName("clean", () => run("rm -rf ./dist")),
// withTaskName("buildPackages", () =>
//       run("pnpm run --filter ./packages/** --parallel build")
//    ),
export default series(
  withTaskName("clean", () => run("pnpm run clean")),
  parallel(
    //单独打包每个组件
    withTaskName("buildComponent", () => run("pnpm run build buildComponent")),
    // // 执行build命令时会调用rollup, 我们给rollup传递参数buildFullComponent 那么就会执行导出任务叫 buildFullComponent
    withTaskName("buildFullComponent", () =>
      run("pnpm run build buildFullComponent")
    ),
    //生成.d.ts文件
    withTaskName("typesDefinition", () =>
      run("pnpm run build typesDefinition")
    ),
    //打包css文件 和工具文件
    series(
      withTaskName("buildThemeChalk", () =>
        run("pnpm run -C packages/theme-chalk build")
      ),
      withTaskName("buildUtils", () => run("pnpm run -C packages/utils build"))
    )
    // withTaskName("buildPackages", () =>
    //   run("pnpm run --filter ./packages/** --parallel build")
    // ),
  )
);

export * from "./src/tasks/index";
