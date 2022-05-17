import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import vue from "rollup-plugin-vue";
import typescript from "rollup-plugin-typescript2";

import { series } from "gulp";
import { sync } from "fast-glob";
import { compRoot } from "./utils/paths";
import path from "path";
import { OutputOptions, rollup } from "rollup";
import { buildConfig } from "./utils/config";
import { pathRewriter } from "./utils/index";
const buildEachComponent = async () => {
  //打包每个组件
  const files = sync("*", {
    cwd: compRoot,
    onlyDirectories: true,
  });
  console.log(files, "---file");
  // 分别把components 文件夹下的组件 放到dist/es/components下 和 dist/lib/compmonents
  const builds = files.map(async (file: string) => {
    const entry = path.resolve(compRoot, file, "index.ts");
    const config = {
      input: entry,
      plugins: [nodeResolve(), typescript(), vue(), commonjs()],
      external: (id) => /^vue/.test(id) || /^@picasso-plus/.test(id),
    };
    const bundle = await rollup(config);
    const options = Object.values(buildConfig).map((config) => ({
      format: config.format,
      file: path.resolve(config.output.path, `components/${file}/index.js`),
      paths: pathRewriter(config.output.name), // @picasso-plus => picasso-plus/es  picasso-plus/lib
    }));

    await Promise.all(
      options.map((option) => bundle.write(option as OutputOptions))
    );
  });
  return Promise.all(builds);
};

export const buildComponent = series(buildEachComponent);
