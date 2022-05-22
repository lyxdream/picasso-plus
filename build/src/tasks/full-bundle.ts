import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import vue from "rollup-plugin-vue";
import typescript from "rollup-plugin-typescript2";
import path from "path";
import { rollup, OutputOptions } from "rollup";
import { buildOutput, epRoot } from "../utils/paths";
import { parallel } from "gulp";
import { writeBundles } from "../utils";

const buildFull = async () => {
  // rollup打包的配置信息
  const bundle = await rollup({
    input: path.resolve(epRoot, "index.ts"), //// 打包的入口
    plugins: [nodeResolve(), typescript(), vue(), commonjs()],
    external: (id) => /^vue/.test(id), // 表示打包的时候不打包vue代码
  });
  // 整个组件库 两种使用方式 import 导入组件库 在浏览器中使用 script
  // esm umd
  const buildConfig = [
    {
      format: "umd", // 打包的格式
      file: path.resolve(buildOutput, "index.js"),
      name: "PPlus", // 全局的名字
      exports: "named", // 导出的名字 用命名的方式导出  liraryTarget:"var" name:""
      globals: {
        // 表示使用的vue是全局的
        vue: "Vue",
      },
    },
    {
      format: "esm",
      file: path.resolve(buildOutput, "index.esm.js"),
    },
  ];
  await writeBundles(bundle, buildConfig as OutputOptions[]);
  // return Promise.all(
  //   buildConfig.map((config) => bundle.write(config as OutputOptions))
  // );
};
export const buildFullComponent = parallel(buildFull);