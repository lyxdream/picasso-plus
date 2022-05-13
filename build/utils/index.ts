import { spawn } from "child_process";
// import { spawn } from "cross-spawn";
import { projectRoot } from "./paths";

export const withTaskName = <T>(name: string, fn: T) =>
  Object.assign(fn, { displayName: name });

//在node中使用子进程来运行脚本
export const run = async (command: string) => {
  //rf -rf
  return new Promise((resolve) => {
    const [cmd, ...args] = command.split(" ");
    const app = spawn(cmd, args, {
      cwd: projectRoot,
      stdio: "inherit", //直接将这个子进程的输出传给父进程
      shell: true, //默认情况下 linux才支持rm -rf
    });
    app.on("close", resolve);
  });
};
