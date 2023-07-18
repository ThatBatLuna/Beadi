export type AnyInputAdapterDef = InputAdapterDef<any>;
export type InputAdapterDef<T> = {
  id: string;
  label: string;
  getData: (nodeId: string) => T;
};

export type AnyOutputAdapterDef = OutputAdapterDef<any>;
export type OutputAdapterDef<T> = {
  id: string;
  label: string;
  pushData: (nodeId: string, data: T) => void;
};
