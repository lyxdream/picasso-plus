export const withTaskName = <T>(name: string, fn: T) =>
  Object.assign(fn, { displayName: name });

export const pathRewriter = (format) => {
  return (id: string) => {
    id = id.replaceAll("@picasso-plus", `picasso-plus/${format}`);
    return id;
  };
};
