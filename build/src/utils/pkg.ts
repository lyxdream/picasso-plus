export const pathRewriter = (format) => {
  return (id: string) => {
    id = id.replaceAll("@picasso-plus", `picasso-plus/${format}`);
    return id;
  };
};

export const excludeFiles = (files: string[]) => {
  const excludes = ["node_modules", "test", "mock", "gulpfile", "dist"];
  return files.filter(
    (path) => !excludes.some((exclude) => path.includes(exclude))
  );
};
