import { FunctionComponent, useEffect, useRef, useState } from "react";
import { NodeProps } from "reactflow";
import { nodeDef } from "../engine/node";
import { categories } from "./category";
import { BeadiNodeData } from "../engine/store";
import { useFileStore } from "../storage";

type CommentNodeSettings = {
  text: string;
  height: number;
};
export const CommentNode: FunctionComponent<NodeProps<BeadiNodeData<{}, CommentNodeSettings, any>>> = ({ id, data }) => {
  const [editing, setEditing] = useState(false);
  // const [text, setText] = useHandleData<string>("input", id, "text");
  const text = data.settings.text;
  const updateNode = useFileStore((s) => s.updateNode);
  const setText = (t: string) => {
    updateNode(id, (r) => {
      (r.data.settings as CommentNodeSettings).text = t;
    });
  };
  const setHeight = (t: number) => {
    console.log(t);
    updateNode(id, (r) => {
      (r.data.settings as CommentNodeSettings).height = t;
    });
  };

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textAreaRef.current !== null) {
      const obs = new ResizeObserver((e) => {
        console.log("Resize: ", e);
        for (const entry of e) {
          if (entry.target === textAreaRef.current) {
            setHeight(entry.target.clientHeight);
          }
        }
      });
      obs.observe(textAreaRef.current);
      return () => {
        obs.disconnect();
      };
    }
  });

  const className =
    "bg-transparent p-2 w-full h-full whitespace-pre-wrap border-none font-mono box-border block rounded-md overflow-y-scroll";
  return (
    <div
      className="bg-black/50 w-[200px] min-h-[4em] rounded-md border-primary-700 border-2"
      onDoubleClick={() => setEditing(true)}
      onMouseDownCapture={(e) => {
        if (editing) {
          e.stopPropagation();
        }
      }}
    >
      {editing ? (
        <textarea
          ref={textAreaRef}
          className={className}
          value={text}
          style={{ height: data.settings.height }}
          onChange={(it) => setText(it.target.value)}
          onPointerMoveCapture={(e) => e.stopPropagation()}
          onMouseMoveCapture={(e) => e.stopPropagation()}
          onMouseDownCapture={(e) => e.stopPropagation()}
          onBlur={() => setEditing(false)}
          autoFocus={true}
          onResize={(e) => setHeight((e.target as HTMLTextAreaElement).clientHeight)}
        ></textarea>
      ) : (
        <div className={className} style={{ height: data.settings.height }}>
          {text}
        </div>
      )}
    </div>
  );
};

export const commentNodeDef = nodeDef()({
  nodeComponent: CommentNode,
  label: "Comment",
  category: categories["extra"],
  type: "comment",
  outputs: {},
  inputs: {},
  executor: {
    initialPersistence: {},
    executor: () => ({ outputs: {}, driverOutputs: {}, persistentData: {} }),
  },
});
