import path from 'path';

export const alias = (...paths: string[]) =>
  path.resolve(__dirname, '..', ...paths);

export const parseAliasesFromTsConfig = (paths: Record<string, string[]>) => {
  const getOnlyAliasName = (path: string) => path.replace(/\/\*$/, '');

  return Object.entries(paths).reduce(
    (paths, [aliasPath, [path]]) => ({
      [getOnlyAliasName(aliasPath)]: alias(getOnlyAliasName(path)),
      ...paths,
    }),
    {},
  );
};
