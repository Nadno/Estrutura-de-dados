export const createEmptyObject = <
  TKey extends string | number | symbol,
  TValue,
>(
  source?: unknown,
): Record<TKey, TValue> => {
  const result = Object.create(null);
  if (!source) return result;
  return Object.assign(result, source);
};
