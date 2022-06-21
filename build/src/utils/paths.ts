import path from "path";
import { resolve } from "path";
export const projectRoot = resolve(__dirname, "../../../");
export const pkgRoot = resolve(projectRoot, "packages");
export const compRoot = resolve(pkgRoot, "components");
export const epRoot = resolve(pkgRoot, "picasso-plus");
export const themeRoot = resolve(pkgRoot, "theme-chalk");
export const utilRoot = resolve(pkgRoot, "utils");
export const buildOutput = resolve(projectRoot, "dist");
export const epOutput = resolve(buildOutput, "picasso-plus"); //dist/picasso-plus
export const buildRoot = resolve(projectRoot, "build");

// export const hookRoot = resolve(pkgRoot, 'hooks')
// export const localeRoot = resolve(pkgRoot, 'locale')
// export const directiveRoot = resolve(pkgRoot, 'directives')
// export const buildRoot = resolve(projRoot, 'internal', 'build')
