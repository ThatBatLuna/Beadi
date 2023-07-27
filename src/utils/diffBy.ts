import _ from "lodash";

type DiffByResult<TKey> = {
  extra: TKey[];
  missing: TKey[];
};
/**
 * Creates a two way difference of base and changed.
 *
 * See the following Venn-Diagram
 *   BASE CHANGED
 *  /    X       \
 * (    ( )       )
 *    |        |
 *   extra    missing
 * @param baseKeys
 * @param changedKeys
 * @returns
 */
export function diffBy<TKey>(baseKeys: TKey[], changedKeys: TKey[]): DiffByResult<TKey> {
  console.log("Diffing: Base ", baseKeys, " Changed ", changedKeys);
  const inBaseNotInChanged = _.difference(baseKeys, changedKeys);
  const inChangedNotInBase = _.difference(changedKeys, baseKeys);
  return {
    extra: inBaseNotInChanged,
    missing: inChangedNotInBase,
  };
}

type DiffByKeysResult<TKey extends string, TA, TB> = {
  extra: Record<TKey, TA>;
  missing: Record<TKey, TB>;
  changed: Record<TKey, [TA, TB]>;
};
export function diffByKeys<TKey extends string, TA, TB>(
  base: Record<TKey, TA>,
  changed: Record<TKey, TB>,
  isEqual?: (a: TA, b: TB) => boolean
): DiffByKeysResult<TKey, TA, TB> {
  console.log("Diffing: Base ", base, " Changed ", changed);
  const { extra, missing } = diffBy(Object.keys(base), Object.keys(changed));
  const changedEntries =
    isEqual === undefined
      ? {}
      : Object.assign(
          {},
          ...Object.entries(base)
            .filter(([key, value]) => {
              if (key in changed) {
                return !isEqual(value as TA, changed[key as TKey]);
              }
              return false;
            })
            .map(([key, value]) => ({ [key]: [value as TA, changed[key as TKey]] }))
        );

  return {
    extra: _.pick(base, extra) as Record<TKey, TA>,
    missing: _.pick(changed, missing) as Record<TKey, TB>,
    changed: changedEntries,
  };
}
