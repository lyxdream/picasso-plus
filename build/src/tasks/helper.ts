//专门打包util 命令 hook

import { dest, parallel, series, src } from "gulp";
import { buildConfig } from "../utils/config";
import ts from "gulp-typescript";
import { projectRoot, buildOutput, epOutput } from "../utils/paths";
import path from "path";
import { withTaskName } from "../utils";

//打包  模块化规范cjs es模块  umd浏览器
export const buildPackages = (pkgPath: string, packageName: string) => {
  //可以用rollup ,这个逻辑ts->js即可  类库打包
  const tsConfig = path.resolve(projectRoot, "tsconfig.json");
  const inputs = ["**/*.ts", "!gulpfile.ts", "!node_modules"];
  const tasks = Object.entries(buildConfig).map(([module, config]) => {
    const output = path.resolve(pkgPath, config.output.name);
    return series(
      withTaskName(`build:${packageName}`, () => {
        return src(inputs)
          .pipe(
            ts.createProject(tsConfig, {
              declaration: true, // 需要生成声明文件
              strict: false,
              moduleResolution: "node",
              module: config.module,
            })()
          )
          .pipe(dest(output));
      }),
      withTaskName(`copy:${packageName}`, () => {
        // 放到es-> utils 和 lib -> utils
        // 将utils 模块拷贝到dist 目录下的picasso-plus 的 es目录和lib目录
        return src(`${output}/**`).pipe(
          dest(path.resolve(epOutput, config.output.name, packageName))
        );
      })
    );
  });
  return parallel(...tasks);
};
