import { series, parallel } from "gulp";
import { withTaskName, run } from "./utils";

//gulp不叫打包 做代码转化
//控制构建流程

//1、打包样式 打包工具 2、打包所有组件库 3、打包每个组件 4、生成一个组件库 5、发布组件
export default series(
  withTaskName("clean", () => run("rm -rf ./dist")),
  parallel(
    withTaskName("buildPackages", () => {
      run("pnpm run --filter ./packages --parallel build");
    })
  )
);
