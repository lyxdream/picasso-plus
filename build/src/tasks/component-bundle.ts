import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import vue from "rollup-plugin-vue";
import typescript from "rollup-plugin-typescript2";

import { series } from "gulp";
import { sync } from "fast-glob";
import { compRoot } from "../utils/paths";
import path from "path";
import { OutputOptions, rollup } from "rollup";
import { buildConfig } from "../utils/config";
import { pathRewriter } from "../utils/index";

//打包单个组件
const buildEachComponent = async () => {
  //打包每个组件
  const files = sync("*", {
    cwd: compRoot,
    onlyDirectories: true,
  });
  console.log(files, "---file");
  // 分别把components 文件夹下的组件 放到dist/es/components下 和 dist/lib/compmonents
  const builds = files.map(async (file: string) => {
    const input = path.resolve(compRoot, file, "index.ts");
    const bundle = await rollup({
      input,
      plugins: [nodeResolve(), typescript(), vue(), commonjs()],
      external: (id) => /^vue/.test(id) || /^@picasso-plus/.test(id),
    });
    const options = Object.entries(buildConfig).map(([module, config]) => ({
      format: config.format,
      exports: module === "cjs" ? "named" : undefined,
      file: path.resolve(config.output.path, `components/${file}/index.js`),
      paths: pathRewriter(config.output.name), // @picasso-plus => picasso-plus/es  picasso-plus/lib
    }));

    await Promise.all(
      options.map((option) => bundle.write(option as OutputOptions))
    );
  });
  return Promise.all(builds);
};

//生成入口文件
async function buildComponentEntry() {
  const config = {
    input: path.resolve(compRoot, "index.ts"),
    plugins: [typescript()],
    external: () => true,
  };
  const bundle = await rollup(config);
  return Promise.all(
    Object.values(buildConfig)
      .map((config) => ({
        format: config.format,
        file: path.resolve(config.output.path, "components/index.js"),
      }))
      .map((config) => bundle.write(config as OutputOptions))
  );
}

export const buildComponent = series(buildEachComponent, buildComponentEntry);
