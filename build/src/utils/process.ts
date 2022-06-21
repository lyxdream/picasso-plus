import { spawn } from "child_process";
import { projectRoot } from "./paths";
import consola from "consola";

//在node中使用子进程来运行脚本
export const run = async (command: string, cwd: string = projectRoot) => {
  //rf -rf
  return new Promise((resolve) => {
    const [cmd, ...args] = command.split(" ");
    consola.info(`${cmd} ${args.join(" ")}`);
    const app = spawn(cmd, args, {
      cwd,
      stdio: "inherit", //直接将这个子进程的输出传给父进程
      shell: process.platform === "win32", //默认情况下 linux才支持rm -rf
    });
    app.on("close", resolve);
  });
};
