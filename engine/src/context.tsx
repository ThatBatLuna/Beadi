import { Plugin } from "./plugin";
import { AnyNodeDef, InputHandleDefs, OutputHandleDefs } from "./engine/node";

import { timerNodeDef } from "./nodes/TimerNode";
import { inputAdapterNode } from "./nodes/InputAdapterNode";
import { toggleNodeDef } from "./nodes/ToggleNode";
import { AnyInputAdapterDef, AnyOutputAdapterDef } from "./engine/adapter";
import { outputAdapterNode } from "./nodes/OutputAdapterNode";
import { randomNodeDef } from "./nodes/RandomNode";
import { memoryNodeDef } from "./nodes/MemoryNode";
import { Tab, fileTab as fileTabDef } from "./components/Settings";
import { switchNodeDef } from "./nodes/SwitchNode";
import { positiveWaveNodeDef } from "./nodes/WaveNode";
import { delayNodeDef } from "./nodes/DelayNode";
import { mathNodeDef } from "./nodes/MathNode";
import { constantValueNodeDef } from "./nodes/ConstantValueNode";
import { curveNodeDef } from "./nodes/CurveNode";
import { hysteresisNodeDef } from "./nodes/HysteresisNode";
import { commentNodeDef } from "./nodes/CommentNode";
import { edgeDetectorNodeDef } from "./nodes/EdgeDetector";
import { FunctionComponent, ReactNode, createContext, useContext, useState } from "react";
import { UnknownBeadiNode } from "./engine/store";

type BeadiContextProps = {
  plugins: Plugin[];
};

export class BeadiContext {
  nodeDefs: Record<string, AnyNodeDef>;
  inputAdapterDefs: Record<string, AnyInputAdapterDef>;
  outputAdapterDefs: Record<string, AnyOutputAdapterDef>;
  settingsTabs: Record<string, Tab>;
  plugins: Plugin[];

  constructor(props: BeadiContextProps) {
    console.log("BeadiContextProps");
    const nodeDefList: AnyNodeDef[] = [
      constantValueNodeDef as any,
      mathNodeDef as any,
      hysteresisNodeDef as any,
      memoryNodeDef as any,
      randomNodeDef as any,
      timerNodeDef as any,
      toggleNodeDef as any,
      inputAdapterNode as any,
      outputAdapterNode as any,
      switchNodeDef as any,
      positiveWaveNodeDef as any,
      curveNodeDef as any,
      delayNodeDef as any,
      commentNodeDef as any,
      edgeDetectorNodeDef as any,
    ];

    this.nodeDefs = Object.assign({}, ...nodeDefList.map((it) => ({ [it.type]: it })));

    const inputAdapterDefList: AnyInputAdapterDef[] = [...props.plugins.flatMap((it) => it.inputAdapterDefs ?? [])];

    this.inputAdapterDefs = Object.assign({}, ...inputAdapterDefList.map((it) => ({ [it.id]: it })));

    const outputAdapterDefList: AnyOutputAdapterDef[] = [...props.plugins.flatMap((it) => it.outputAdapterDefs ?? [])];

    this.outputAdapterDefs = Object.assign({}, ...outputAdapterDefList.map((it) => ({ [it.id]: it })));

    const settingsTabsList: Tab[] = [fileTabDef, ...props.plugins.flatMap((it) => it.settingsTabs ?? [])];

    this.settingsTabs = Object.assign({}, ...settingsTabsList.map((it) => ({ [it.id]: it })));

    this.plugins = props.plugins;
  }

  getNodeOutputs<TSettings>(nodeType: UnknownBeadiNode["type"], settings: TSettings): OutputHandleDefs {
    const outputs = this.nodeDefs[nodeType]?.outputs;
    if (typeof outputs === "function") {
      return outputs(settings, this);
    } else {
      return outputs;
    }
  }

  getNodeInputs<TSettings>(nodeType: UnknownBeadiNode["type"], settings: TSettings): InputHandleDefs {
    const inputs = this.nodeDefs[nodeType]?.inputs;
    if (typeof inputs === "function") {
      return inputs(settings, this);
    } else {
      return inputs;
    }
  }
  runHooks(hook: keyof Plugin["processingHooks"]) {
    this.plugins.forEach((it) => it.processingHooks[hook]?.());
  }
}

const BeadiContextInstance = createContext<BeadiContext | null>(null);

type BeadiContextProviderProps = {
  context: BeadiContext;
  children?: ReactNode;
};
export const BeadiContextProvider: FunctionComponent<BeadiContextProviderProps> = ({ context, children }) => {
  return <BeadiContextInstance.Provider value={context}>{children}</BeadiContextInstance.Provider>;
};

export function useBeadi(): BeadiContext {
  const beadi = useContext(BeadiContextInstance);
  //The only way beadi === null is when no BeadiContextInstance was provided.
  if (import.meta.env.DEV) {
    if (beadi === null) {
      throw new Error("Couldn't find BeadiContextInstance. Did you forget to wrap this in a <BeadiContextProvider>?");
    }
  }
  return beadi!!;
}
