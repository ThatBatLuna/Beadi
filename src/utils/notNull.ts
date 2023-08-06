export function notNull<T>(t: T | null): t is T {
  return t !== null;
}
