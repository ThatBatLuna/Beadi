import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button } from "../input/Button";
import { TextInput } from "../input/TextInput";
import { Typo } from "../Typo";
import { DateTime } from "luxon";
import { useDisplayStore } from "../../engine/store";
import _ from "lodash";
import FileSaver from "file-saver";
import { IDBPDatabase, openDB } from "idb";
import create from "zustand";
import { Edge, Node } from "reactflow";
import clsx from "clsx";
import { ImportFromLitterbox, UploadToLitterbox } from "./Litterbox";
import { ImportFromJson } from "./JsonExport";

export function getNewFileName(): string {
  const time = DateTime.now().toFormat("yyyy-LL-dd-HH-mm");

  return `MyBeadi-${time}`;
}

interface SaveFile {
  fileName: string;
}

interface SavedData extends SaveFile {
  nodes: Node<any>[];
  edges: Edge[];
  handles: Record<string, any>;
}

type DatabaseStore = {
  database: IDBPDatabase | null;
  files: SaveFile[];
  setDatabase: (d: IDBPDatabase | null) => void;
  open: () => void;
  save: (it: any) => void;
  refresh: () => void;
  load: (filename: string) => Promise<SavedData>;
  remove: (filename: string) => void;
};
const useDatabaseStore = create<DatabaseStore>()((set, get) => ({
  database: null,
  files: [],
  setDatabase: (d) => {
    set(() => ({
      database: d,
    }));
  },
  open: () => {
    openDB("beadi-saves", 1, {
      async upgrade(database, oldVersion, newVersion, transaction, event) {
        if (!database.objectStoreNames.contains("saves")) {
          console.log("Creating Store");
          await database.createObjectStore("saves", { keyPath: "fileName" });
        }
      },
    }).then((db) => {
      get().refresh();
      set((store) => {
        if (store.database !== null) {
          store.database.close();
        }
        return {
          database: db,
        };
      });
    });
  },
  save: (it: any) => {
    const db = get().database;
    const refresh = get().refresh;
    if (db) {
      db.put("saves", it).then(() => refresh());
    }
  },
  refresh: () => {
    const db = get().database;

    if (db === null) {
      set(() => ({
        files: [],
      }));
    } else {
      db.getAll("saves").then((it) => {
        console.log("REFRESHING", it);
        set(() => ({
          files: it.map((it) => ({ fileName: it.fileName })),
        }));
      });
    }
  },
  load: async (filename) => {
    const db = get().database;
    if (db !== null) {
      return await db?.get("saves", filename);
    } else {
      return null;
    }
  },
  remove: (filename) => {
    const db = get().database;
    const refresh = get().refresh;
    if (db !== null) {
      db.delete("saves", filename).then(() => refresh());
    }
  },
}));

export const FileSettings: FunctionComponent<{}> = () => {
  const [name, setName] = useState(getNewFileName());

  const openDb = useDatabaseStore((store) => store.open);
  const [save, loadFromDb, removeInDb] = useDatabaseStore((store) => [
    store.save,
    store.load,
    store.remove,
  ]);
  useEffect(() => {
    openDb();
  }, [openDb]);

  const saves = useDatabaseStore((store) => store.files);

  const overwriteStoreData = useDisplayStore((store) => store.overwrite);
  const resetStoreData = useDisplayStore((store) => store.reset);
  const data = useDisplayStore((store) => ({
    nodes: store.nodes.map((node) =>
      _.pick(node, ["data", "id", "position", "type", "width", "height"])
    ),
    edges: store.edges,
    handles: store.handles,
  }));

  const exp = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, undefined, 2)], {
      type: "text/plain;charset=utf-8",
    });
    FileSaver.saveAs(blob, `${name}.beadi.json`);
  }, [data, name]);

  const saveToDb = useCallback(
    (name: string) => {
      save({ ...data, fileName: name });
    },
    [data, save]
  );

  const load = useCallback(
    async (name: string) => {
      const it = await loadFromDb(name);
      console.log(it);
      overwriteStoreData(it.nodes, it.edges, it.handles);
      setName(it.fileName);
    },
    [loadFromDb, overwriteStoreData, setName]
  );

  const remove = useCallback(
    (it: string) => {
      removeInDb(it);
    },
    [removeInDb]
  );

  const overwrite = useMemo(() => {
    return saves.findIndex((it) => it.fileName === name) >= 0;
  }, [name, saves]);

  return (
    <div className="flex flex-col w-full gap-2 p-2">
      <Typo>File</Typo>
      <TextInput
        label="Name"
        id="name"
        value={name}
        onChange={setName}
      ></TextInput>
      <Button onClick={resetStoreData}>Discard current File</Button>
      <Typo>Save</Typo>

      <Button onClick={exp}>Export</Button>
      <ImportFromJson></ImportFromJson>
      <Typo>Local Saves</Typo>
      <Button
        onClick={() => saveToDb(name)}
        disabled={name.trim().length === 0}
      >
        {overwrite
          ? "Overwrite existing Save with given Name"
          : "Create new Save (In Browser)"}
      </Button>

      <ul className="flex flex-col gap-1 p-2 rounded-md bg-primary-1000">
        {saves.map((it) => (
          <li
            key={it.fileName}
            className={clsx("rounded-md border-primary-800 border p-1", {})}
          >
            <div className="font-bold">{it.fileName}</div>
            <div className="flex flex-row justify-end gap-2">
              <Button onClick={() => load(it.fileName)}>Load</Button>
              <Button onClick={() => remove(it.fileName)}>Remove</Button>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-slate-500">
        Yes, I know this saving thingy is a bit wonky at the moment, but it
        works for now...
      </p>
      <Typo>Litterbox</Typo>
      <p className="text-slate-500">
        Upload this beadi to{" "}
        <a
          href="https://litterbox.catbox.moe/"
          target="_blank"
          rel="noreferrer"
        >
          litterbox.catbox.moe
        </a>
        . The uploaded Link will become invalid after an hour. This can be used
        to quickly share generated Beadis, or transfer them to your smartphone.
      </p>
      <UploadToLitterbox></UploadToLitterbox>
      <Typo element="h2">Import from Litterbox</Typo>
      <ImportFromLitterbox></ImportFromLitterbox>
    </div>
  );
};
