import { series, parallel, TaskFunction } from "gulp";
import {
  withTaskName,
  run,
  epRoot,
  epOutput,
  projectRoot,
  buildOutput,
  buildConfig,
} from "./src/utils";
import { copyFile, mkdir } from "fs/promises";
import path from "path";
import { copy } from "fs-extra";

//gulp不叫打包 做代码转化
//控制构建流程

//1、打包样式 打包工具 2、打包所有组件库 3、打包每个组件 4、生成一个组件库 5、发布组件
// pnpm run -C packages/theme-chalk build
// withTaskName("clean", () => run("rm -rf ./dist")),
// withTaskName("buildPackages", () =>
//       run("pnpm run --filter ./packages/** --parallel build")
//    ),

export const modules = ["esm", "cjs"] as const;
export type Module = typeof modules[number];

//拷贝picasso-plus/json
export const copyFiles = () =>
  copyFile(
    path.resolve(epRoot, "package.json"),
    path.join(epOutput, "package.json")
  );

export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = path.resolve(buildOutput, "types");
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, () =>
      copy(src, buildConfig[module].output.path)
    );
  return parallel(copyTypes("esm"), copyTypes("cjs"))(done);
};

export default series(
  // withTaskName("clean", () => run("pnpm run clean")),
  // withTaskName("createOutput", () => mkdir(buildOutput, { recursive: true })),
  parallel(
    //单独打包每个组件
    withTaskName("buildComponent", () => run("pnpm run build buildComponent")),
    // // 执行build命令时会调用rollup, 我们给rollup传递参数buildFullComponent 那么就会执行导出任务叫 buildFullComponent
    withTaskName("buildFullComponent", () =>
      run("pnpm run build buildFullComponent")
    ),
    // // 生成.d.ts文件
    withTaskName("typesDefinition", () =>
      run("pnpm run build typesDefinition")
    ),
    // 打包css文件 和工具文件
    // series(
    //   withTaskName("buildThemeChalk", () =>
    //     run("pnpm run -C packages/theme-chalk build")
    //   ),
    //   withTaskName("buildUtils", () => run("pnpm run -C packages/utils build"))
    //   // parallel(copyFiles)
    // ),
    // withTaskName("buildPackages", () =>
    //   run("pnpm run --filter ./packages/** --parallel build")
    // )
    withTaskName("buildPackages", () =>
      run("pnpm run --filter ./packages/** --parallel build")
    )
  ),
  parallel(copyTypesDefinitions, copyFiles)
);

export * from "./src/tasks/index";
