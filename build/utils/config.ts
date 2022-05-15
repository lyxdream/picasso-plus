import path from "path";
import { outDir } from "./paths";
export const buildConfig = {
  esm: {
    module: "ESNext", //tsconfig 输出的结果
    format: "esm", //需要配置格式化后的模块规范
    output: { 
      name: "es",
      path: path.resolve(outDir, "es"), //打包到那个目录
    },
    bundle: {
      path: "p-plus/es",
    },
  },
  cjs: {
    module: "CommonJS",
    format: "cjs",
    output: {
      name: "lib",
      path: path.resolve(outDir, "lib"),
    },
    bundle: {
      path: "p-plus/lib",
    },
  },
};
export type BuildConfig = typeof buildConfig;