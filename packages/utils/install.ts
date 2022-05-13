import type { App } from "vue";
import { SFCWithInstall } from "./typescript";
export const withInstall = <T>(comp: T) => {
  (comp as SFCWithInstall<T>).install = (app: App): void => {
    app.component((comp as any).name, comp);
  };
  return comp as SFCWithInstall<T>;
};
