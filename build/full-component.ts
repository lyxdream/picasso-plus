import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import vue from "rollup-plugin-vue";
import typescript from "rollup-plugin-typescript2";
import path from "path";
import { rollup, OutputOptions } from "rollup";
import { outDir, pRoot } from "./utils/paths";
import { parallel } from "gulp";

const buildFull = async () => {
  const config = {
    input: path.resolve(pRoot, "index.ts"), //// 打包的入口
    plugins: [nodeResolve(), typescript(), vue(), commonjs()],
    external: (id) => /^vue/.test(id),
  };
  const buildConfig = [
    {
      format: "umd",
      file: path.resolve(outDir, "index.js"),
      name: "PPlus",
      exports: "named",
      globals: {
        // 表示使用的vue是全局的
        vue: "Vue",
      },
    },
    {
      format: "esm",
      file: path.resolve(outDir, "index.esm.js"),
    },
  ];
  const bundle = await rollup(config);
  return Promise.all(
    buildConfig.map((config) => bundle.write(config as OutputOptions))
  );
};
export const buildFullComponent = parallel(buildFull);
