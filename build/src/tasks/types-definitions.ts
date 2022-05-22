
import glob from "fast-glob";
import { compRoot, buildOutput, projectRoot } from "../utils/paths";
import path from "path";
import { pathRewriter } from "../utils/index";
import { Project, SourceFile } from "ts-morph";
import fs from "fs/promises";
import * as VueCompiler from "@vue/compiler-sfc";

const TSCONFIG_PATH = path.resolve(projectRoot, "tsconfig.json");

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
        const { script } = sfc.descriptor;
        if (script) {
          const content = script.content; // 拿到脚本  icon.vue.ts  => icon.vue.d.ts
          const sourceFile = project.createSourceFile(file + ".ts", content);
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
    const emitOutput = sourceFile.getEmitOutput();
    const task = emitOutput.getOutputFiles().map(async (outPutFile) => {
      const filePath = outPutFile.getFilePath();
      console.log(filePath, "===filePath");
      await fs.mkdir(path.dirname(filePath), {
        recursive: true, //递归
      });
      // @z-plus -> z-plus/es -> .d.ts 肯定不用去lib下查找
      await fs.writeFile(filePath, pathRewriter("es")(outPutFile.getText()));
    });
    await Promise.all(task);
  });
  await Promise.all(tasks);
};
