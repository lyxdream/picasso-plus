import path from "path";
import { epOutput } from "./paths";
export const PKG_NAME = "picasso-plus";
export const buildConfig = {
  esm: {
    module: "ESNext", //tsconfig 输出的结果
    format: "esm", //需要配置格式化后的模块规范
    output: {
      name: "es",
      path: path.resolve(epOutput, "es"), //打包到那个目录
    },
    bundle: {
      path: `${PKG_NAME}/es`,
    },
  },
  cjs: {
    module: "CommonJS",
    format: "cjs",
    output: {
      name: "lib",
      path: path.resolve(epOutput, "lib"),
    },
    bundle: {
      path: `${PKG_NAME}/lib`,
    },
  },
};
export type BuildConfig = typeof buildConfig;
