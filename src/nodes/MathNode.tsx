import { FunctionComponent } from "react";
import { InputHandleDef, InputHandleDefs, InputTypesOf, NodeDef, NodeHeaderProps, nodeDef } from "../engine/node";
import { categories } from "./category";
import { useFileStore } from "../engine/store";
import { Select } from "../components/input/Select";

const operations = [
  "add",
  "multiply",
  "divide",
  "subtract",
  "multiplyAdd",
  "mix",
  "power",
  "logarithm",
  "squareRoot",
  "invSquareRoot",
  "absolute",
  "exponent",
  "min",
  "max",
  "clamp",
  "smoothMin",
  "smoothMax",
  "sign",
] as const;
type Operator = (typeof operations)[number];

type MathNodeSettings = {
  operation: Operator;
};

export const MathNodeHeader: FunctionComponent<NodeHeaderProps<{}, MathNodeSettings, any>> = ({ id, data }) => {
  const updateNode = useFileStore((s) => s.updateNode);

  const setOperation = (s: Operator | null) => {
    if (s !== null) {
      updateNode(id, (r) => {
        (r.data.settings as MathNodeSettings).operation = s;
      });
    }
  };

  return (
    <div className="w-full p-2">
      <Select
        options={operations}
        selected={data.settings.operation ?? "add"}
        onSelect={(s) => setOperation(s)}
        renderOption={(s) => funcs[s].label}
      ></Select>
    </div>
  );
};

function oneCompMath(
  label: string,
  execute: (i: { a: number }) => number,
  inputLabels: [string] = ["Value"]
): MathNodeFuncDef<{ a: InputHandleDef; b: InputHandleDef }> {
  return {
    execute: execute as any,
    label: label,
    inputs: {
      a: {
        label: inputLabels[0],
        type: "number",
        default: 0.0,
      },
    },
  };
}
function twoCompMath(
  label: string,
  execute: (i: { a: number; b: number }) => number,
  inputLabels: [string, string] = ["Value a", "Value b"]
): MathNodeFuncDef<{ a: InputHandleDef; b: InputHandleDef }> {
  return {
    execute: execute as any,
    label: label,
    inputs: {
      a: {
        label: inputLabels[0],
        type: "number",
        default: 0.0,
      },
      b: {
        label: inputLabels[1],
        type: "number",
        default: 0.0,
      },
    },
  };
}
function threeCompMath(
  label: string,
  execute: (i: { a: number; b: number; c: number }) => number,
  inputLabels: [string, string, string]
): MathNodeFuncDef<{ a: InputHandleDef; b: InputHandleDef; c: InputHandleDef }> {
  return {
    execute: execute as any,
    label: label,
    inputs: {
      a: {
        label: inputLabels[0],
        type: "number",
        default: 0.0,
      },
      b: {
        label: inputLabels[1],
        type: "number",
        default: 0.0,
      },
      c: {
        label: inputLabels[2],
        type: "number",
        default: 0.0,
      },
    },
  };
}

function smoothMin(a: number, b: number, c: number): number {
  if (Math.abs(c) < 0.000001) {
    return Math.min(a, b);
  } else {
    const h = Math.max(c - Math.abs(a - b), 0.0) / c;
    return Math.min(a, b) - h * h * h * c * (1 / 6);
  }
}

type MathNodeFuncDef<TInputHandles extends InputHandleDefs> = {
  execute: (inputs: Record<string, any>) => number;
  label: string;
  inputs: InputHandleDefs;
};
const funcs: Record<Operator, MathNodeFuncDef<any>> = {
  add: twoCompMath("Add", ({ a, b }) => a + b),
  multiply: twoCompMath("Multiply", ({ a, b }) => a + b),
  subtract: twoCompMath("Subtract", ({ a, b }) => a + b),
  divide: twoCompMath("Divide", ({ a, b }) => a + b),
  multiplyAdd: threeCompMath("Multiply Add", ({ a, b, c }) => a * b + c, ["Value", "Multiplier", "Addend"]),
  mix: threeCompMath("Mix", ({ a, b, c: amount }) => b * amount + a * (1 - amount), ["Value 0", "Value 1", "Mix Amount"]),
  power: twoCompMath("Power", ({ a, b }) => Math.pow(a, b), ["Base", "Exponent"]),
  logarithm: twoCompMath("Logarithm", ({ a, b }) => Math.log(a) / Math.log(b), ["Value", "Base"]),
  squareRoot: oneCompMath("Square Root", ({ a }) => Math.sqrt(a)),
  invSquareRoot: oneCompMath("Inverse Square Root", ({ a }) => 1.0 / Math.sqrt(a)),
  absolute: oneCompMath("Absolute", ({ a }) => Math.abs(a)),
  exponent: oneCompMath("Exp", ({ a }) => Math.exp(a)),
  min: twoCompMath("Minimum", ({ a, b }) => Math.min(a, b)),
  max: twoCompMath("Maximum", ({ a, b }) => Math.max(a, b)),
  clamp: threeCompMath("Clamp", ({ a, b, c }) => Math.max(b, Math.min(c, a)), ["Value", "Minimum", "Maximum"]),
  smoothMin: threeCompMath("Smooth Minimum", ({ a, b, c }) => smoothMin(a, b, c), ["Value", "Value", "Distance"]),
  smoothMax: threeCompMath("Smooth Maximum", ({ a, b, c }) => -smoothMin(-a, -b, c), ["Value", "Value", "Distance"]),
  sign: oneCompMath("Sign", ({ a }) => Math.sign(a)),
} as const;

export const mathNodeDef = nodeDef<MathNodeSettings>()({
  label: "Math",
  category: categories["math"],
  type: "math",
  // component: makeNodeRenderer,
  outputs: {
    result: {
      label: "Result",
      type: "number",
    },
  },
  inputs: (settings: MathNodeSettings) => funcs[settings?.operation ?? "add"].inputs,
  executor: {
    initialPersistence: undefined,
    inputDriver: (context) => {
      return {
        operation: context.settings.operation ?? "add",
      };
    },
    executor: (inputs, _a, { operation }) => {
      return {
        outputs: { result: funcs[operation].execute(inputs) },
        driverOutputs: {},
        persistentData: undefined,
      };
    },
  },
  header: MathNodeHeader,
});
