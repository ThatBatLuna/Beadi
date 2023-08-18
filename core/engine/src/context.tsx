import { AnyPlugin } from "./plugin";
import { AnyNodeDef } from "./engine/node";

import { timerNodeDef } from "./nodes/TimerNode";
import { inputAdapterNode } from "./nodes/inputAdapterNode";
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
import { ComponentType, FunctionComponent, ReactNode, createContext, useContext } from "react";
import { UnknownBeadiNodeData } from "./engine/store";
import _ from "lodash";
import { NodeProps } from "reactflow";
import { BeadiNodeRenderer } from "./components/node/NodeRenderer";

type BeadiContextProps = {
  plugins: AnyPlugin[];
  rootUrl: string;
};

export type BeadiContextOf<TPlugin extends AnyPlugin> = BeadiContext<{ [Key in TPlugin["id"]]: TPlugin["globals"] }>;
export class BeadiContext<TGlobals extends Record<string, any> = {}> {
  nodeDefs: Record<string, AnyNodeDef>;
  nodeRenderers: Record<string, ComponentType<NodeProps<UnknownBeadiNodeData>>>;
  inputAdapterDefs: Record<string, AnyInputAdapterDef>;
  outputAdapterDefs: Record<string, AnyOutputAdapterDef>;
  settingsTabs: Record<string, Tab>;
  plugins: AnyPlugin[];
  globals: TGlobals;
  rootUrl: string;

  constructor(props: BeadiContextProps) {
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
      ...props.plugins.flatMap((it) => it.nodeDefs ?? []),
    ];
    this.rootUrl = props.rootUrl;

    this.nodeDefs = Object.assign({}, ...nodeDefList.map((it) => ({ [it.type]: it })));

    this.nodeRenderers = Object.assign(
      {},
      _.mapValues(this.nodeDefs, (it) => it.nodeComponent ?? BeadiNodeRenderer),
      ...props.plugins.map((it) => it.extraNodeRenderers)
    );

    const inputAdapterDefList: AnyInputAdapterDef[] = [...props.plugins.flatMap((it) => it.inputAdapterDefs ?? [])];

    this.inputAdapterDefs = Object.assign({}, ...inputAdapterDefList.map((it) => ({ [it.id]: it })));

    const outputAdapterDefList: AnyOutputAdapterDef[] = [...props.plugins.flatMap((it) => it.outputAdapterDefs ?? [])];

    this.outputAdapterDefs = Object.assign({}, ...outputAdapterDefList.map((it) => ({ [it.id]: it })));

    const settingsTabsList: Tab[] = [fileTabDef, ...props.plugins.flatMap((it) => it.settingsTabs ?? [])];

    this.settingsTabs = Object.assign({}, ...settingsTabsList.map((it) => ({ [it.id]: it })));

    this.globals = Object.fromEntries(props.plugins.map((plugin) => [plugin.id, plugin.globals]));

    this.plugins = props.plugins;
  }

  createRoutes() {
    return [
      ...Object.values(this.settingsTabs).map((it) => ({
        path: it.id,
        element: it.tab,
      })),
    ];
  }
}

const BeadiContextInstance = createContext<BeadiContext<any> | null>(null);

type BeadiContextProviderProps = {
  context: BeadiContext<{}>;
  children?: ReactNode;
};
export const BeadiContextProvider: FunctionComponent<BeadiContextProviderProps> = ({ context, children }) => {
  return <BeadiContextInstance.Provider value={context}>{children}</BeadiContextInstance.Provider>;
};

export function useBeadi(): BeadiContext<{}> {
  const beadi = useContext(BeadiContextInstance);
  //The only way beadi === null is when no BeadiContextInstance was provided.
  if (import.meta.env.DEV) {
    if (beadi === null) {
      throw new Error("Couldn't find BeadiContextInstance. Did you forget to wrap this in a <BeadiContextProvider>?");
    }
  }
  return beadi!!;
}
