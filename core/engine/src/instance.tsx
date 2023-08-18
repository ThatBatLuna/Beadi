import { FunctionComponent, ReactNode, createContext, useContext } from "react";
import { UnknownBeadiNode } from "./engine/store";
import { Storage, beadiStorageShard } from "./storage";
import { AnyPlugin, BeadiContext, InputHandleDefs, OutputHandleDefs, notNull } from ".";
import _ from "lodash";
import { watchForChanges } from "./engine";
import { createStore } from "zustand";

type BeadiInstanceProps = {
  beadiContext: BeadiContext<any>;
  //shard name => saved shard data
  initialData: Record<string, any>;
  writePersistentData: (data: Record<string, any>) => void;
};

function makeSaveUpdater(initialData: Record<string, any>, writePersistentData: (data: Record<string, any>) => void) {
  let saveStore = createStore(() => _.cloneDeep(initialData));

  const update = (shard: string, partial: object) => {
    saveStore.setState((state) => {
      if (shard in state) {
        return {
          [shard]: {
            ...state[shard],
            ...partial,
          },
        };
      } else {
        return {
          [shard]: partial,
        };
      }
    });
  };

  saveStore.subscribe((n, o) => {
    // console.log("SaveStore updated from ", o, " to ", n);
    writePersistentData(n);
  });

  return update;
}

export class BeadiInstance {
  storage: Storage;
  context: BeadiContext;

  constructor(props: BeadiInstanceProps) {
    this.context = props.beadiContext;

    const updateSave = makeSaveUpdater(props.initialData, props.writePersistentData);

    //This has to be the last assignment in the constructor, as there is a "this" reference in here...
    //Making this the last assignment should at least calm the chaos of that "this" a bit...
    this.storage = new Storage([
      ...[beadiStorageShard, ...props.beadiContext.plugins.map((it) => it.storageShard ?? null).filter(notNull)].map((it) => ({
        name: it.name,
        shard: _.mapValues(it.makeShards, (maker) =>
          maker({
            //REVIEW This this in the constructor is a recipe for disaster, but sadly the current architecture seems to require it...
            //At least it requires that storage is the very last thing in here
            beadiInstance: this,
            initialData: props.initialData[it.name],
            updateSavedData: (partial) => {
              updateSave(it.name, partial);
            },
          })
        ),
      })),
    ]);
    this.runHooks("finalizedContext");
    watchForChanges(this);
  }

  getStorage(): Storage {
    return this.storage;
  }

  getNodeOutputs<TSettings>(nodeType: UnknownBeadiNode["type"], settings: TSettings): OutputHandleDefs {
    const outputs = this.context.nodeDefs[nodeType]?.outputs;
    if (typeof outputs === "function") {
      return outputs(settings, this);
    } else {
      return outputs;
    }
  }

  getNodeInputs<TSettings>(nodeType: UnknownBeadiNode["type"], settings: TSettings): InputHandleDefs {
    const inputs = this.context.nodeDefs[nodeType]?.inputs;
    if (typeof inputs === "function") {
      return inputs(settings, this);
    } else {
      return inputs;
    }
  }
  runHooks(hook: keyof NonNullable<AnyPlugin["processingHooks"]>) {
    this.context.plugins.forEach((it) =>
      it.processingHooks?.[hook]?.({
        beadiInstance: this,
      })
    );
  }
}

const BeadiInstanceContext = createContext<BeadiInstance | null>(null);

type BeadiInstanceProviderProps = {
  context: BeadiInstance;
  children?: ReactNode;
};
export const BeadiInstanceProvider: FunctionComponent<BeadiInstanceProviderProps> = ({ context, children }) => {
  return <BeadiInstanceContext.Provider value={context}>{children}</BeadiInstanceContext.Provider>;
};

export function useBeadiInstance(): BeadiInstance {
  const beadi = useContext(BeadiInstanceContext);
  //The only way beadi === null is when no BeadiContextInstance was provided.
  if (import.meta.env.DEV) {
    if (beadi === null) {
      throw new Error("Couldn't find BeadiInstance. Did you forget to wrap this in a <BeadiInstanceProvider>?");
    }
  }
  return beadi!!;
}
