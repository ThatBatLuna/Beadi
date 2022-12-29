export const handleConversions: Record<
  string,
  Record<string, (s: any) => any>
> = {
  boolean: {
    number: (source: boolean) => (source ? 1.0 : 0.0),
  },
  number: {
    boolean: (source: number) => source > 0,
  },
};

export function handlesCompatible(
  sourceType: string,
  targetType: string
): boolean {
  return (
    sourceType === targetType ||
    handleConversions[sourceType]?.[targetType] !== undefined
  );
}
