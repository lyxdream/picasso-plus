import path from "path";
import gulpSass from "gulp-sass"; // 处理sass
import dartSass from "sass";
import autoprefixer from "gulp-autoprefixer"; // 添加前缀
import cleanCss from "gulp-clean-css"; // 压缩css
import { series, src, dest } from "gulp";
function complie() {
  const sass = gulpSass(dartSass);
  return src(path.resolve(__dirname, "./src/*.scss"))
    .pipe(sass.sync())
    .pipe(autoprefixer())
    .pipe(cleanCss())
    .pipe(dest("./dist/css"));
} // 处理scss文件

function copyfont() {
  return src(path.resolve(__dirname, "./src/fonts/**"))
    .pipe(cleanCss())
    .pipe(dest("./dist/fonts"));
} // 拷贝字体样式

function copyFullStyle() {
  return src(path.resolve(__dirname, "./dist/**")).pipe(
    dest(path.resolve(__dirname, "../../dist/theme-chalk"))
  );
}
export default series(complie, copyfont, copyFullStyle);
