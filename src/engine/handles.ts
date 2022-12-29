export const handleConversions: Record<
  string,
  Record<string, (s: any) => any>
> = {
  boolean: {
    number: (source: boolean) => {
      return source ? 1.0 : 0.0;
    },
  },
  number: {
    boolean: (source: number) => source > 0,
  },
};

export function handlesCompatible(
  sourceType: string,
  targetType: string
): boolean {
  if (sourceType === targetType) {
    return true;
  }
  const func = getConversionFunction(sourceType, targetType);
  console.log(func);
  return func !== undefined;
}

export function getConversionFunction(sourceType: string, targetType: string) {
  console.log(sourceType, targetType);
  if (sourceType === targetType) {
    return undefined;
  }
  return handleConversions[sourceType]?.[targetType];
}
