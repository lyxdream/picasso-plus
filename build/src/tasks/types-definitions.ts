import glob from "fast-glob";
import { compRoot, buildOutput, projectRoot, pkgRoot } from "../utils/paths";
import path from "path";
import { pathRewriter, withTaskName } from "../utils/index";
import { Project, SourceFile } from "ts-morph";
import fs from "fs/promises";
import * as VueCompiler from "@vue/compiler-sfc";
import consola from "consola";
import chalk from "chalk";
import { parallel, series, TaskFunction } from "gulp";
import { copy } from "fs-extra";
import { buildConfig } from "./../utils";

const TSCONFIG_PATH = path.resolve(projectRoot, "tsconfig.json");
export const modules = ["esm", "cjs"] as const;
export type Module = typeof modules[number];

//生成声明文件到dist/types
export const generateTypesDefinitions = async () => {
  // 生成.d.ts 我们需要有一个tsconfig
  const project = new Project({
    compilerOptions: {
      allowJs: true,
      declaration: true,
      emitDeclarationOnly: true, // 仅仅抛出声明
      noEmitOnError: true, //不抛出错误
      outDir: path.resolve(buildOutput, "types"),
      baseUrl: projectRoot,
      paths: {
        "@picasso-plus/*": ["packages/*"], //在packages模块里面查找以@picasso-plus开头的
      },
      skipLibCheck: true, //跳过类库检测
      strict: false,
    },
    tsConfigFilePath: TSCONFIG_PATH,
    skipAddingFilesFromTsConfig: true, //从tsconfig去添加
  });
  const filePaths = await glob("**/*", {
    // ** 任意目录  * 任意文件
    cwd: compRoot,
    onlyFiles: true,
    absolute: true, //当前文件的任意目录
  });
  const sourceFiles: SourceFile[] = [];
  console.log(filePaths, "---");
  await Promise.all(
    filePaths.map(async (file) => {
      if (file.endsWith(".vue")) {
        const content = await fs.readFile(file, "utf8");
        const sfc = VueCompiler.parse(content);
        const { script, scriptSetup } = sfc.descriptor;
        if (script || scriptSetup) {
          let content = script?.content ?? ""; // 拿到脚本  icon.vue.ts  => icon.vue.d.ts
          if (scriptSetup) {
            const compiled = VueCompiler.compileScript(sfc.descriptor, {
              id: "xxx",
            });
            content += compiled.content;
          }
          const lang = scriptSetup?.lang || script?.lang || "js";
          const sourceFile = project.createSourceFile(
            `${file}.${lang}`,
            content
          );
          sourceFiles.push(sourceFile);
        }
      } else if (file.endsWith(".ts")) {
        const sourceFile = project.addSourceFileAtPath(file); // 把所有的ts文件都放在一起 发射成.d.ts文件
        sourceFiles.push(sourceFile);
      }
    })
  );
  //生成声明文件
  await project.emit({
    // 默认是放到内存中的
    emitOnlyDtsFiles: true,
  });
  const tasks = sourceFiles.map(async (sourceFile: any) => {
    // components/icon/src/icon.vue.ts ===relativePath
    const relativePath = path.relative(pkgRoot, sourceFile.getFilePath());
    consola.trace(
      chalk.yellow(
        `Generating definition for file: ${chalk.bold(relativePath)}`
      )
    );

    const emitOutput = sourceFile.getEmitOutput();
    const emitFiles = emitOutput.getOutputFiles();
    if (emitFiles.length === 0) {
      throw new Error(`Emit no file: ${chalk.bold(relativePath)}`);
    }

    const tasks = emitFiles.map(async (outPutFile) => {
      const filePath = outPutFile.getFilePath(); //生成d.ts文件
      await fs.mkdir(path.dirname(filePath), {
        recursive: true, //递归
      });
      // @z-plus -> z-plus/es -> .d.ts 肯定不用去lib下查找
      await fs.writeFile(
        filePath,
        pathRewriter("es")(outPutFile.getText()),
        "utf8"
      );

      consola.success(
        chalk.green(
          `Definition for file: ${chalk.bold(relativePath)} generated`
        )
      );
    });
    await Promise.all(tasks);
  });
  await Promise.all(tasks);
};

//拷贝声明文件到dist对应的模块
export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = path.resolve(buildOutput, "types");
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, () =>
      copy(src, buildConfig[module].output.path)
    );
  return parallel(copyTypes("esm"), copyTypes("cjs"))(done);
};

// // -r  循环拷贝
// function copyTypes(){
//   const src = path.resolve(outDir,'types/components/')
//   const copy = (module)=>{
//       let output = path.resolve(outDir,module,'components')
//       return ()=>run(`cp -r ${src}/* ${output}`)
//   }
//   return parallel(copy('es'),copy('lib'))
// }
export const typesDefinition = series(generateTypesDefinitions,copyTypesDefinitions)