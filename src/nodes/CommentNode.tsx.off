import { FunctionComponent, useState } from "react";
import { NodeProps } from "reactflow";
import { NodeDef } from "../engine/node";
import { useHandleData } from "../engine/store";
import { categories } from "./category";

export const CommentNode: FunctionComponent<NodeProps> = ({ id }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useHandleData<string>("input", id, "text");

  const className = "bg-transparent outline-none w-full h-full";
  return (
    <div className="bg-black/50 w-[200px] min-h-[4em] p-2 rounded-md border-primary-700 border-2">
      {editing ? (
        <textarea
          className={className}
          value={text}
          onChange={(it) => setText(it.target.value)}
          onPointerMoveCapture={(e) => e.stopPropagation()}
          onMouseMoveCapture={(e) => e.stopPropagation()}
          onMouseDownCapture={(e) => e.stopPropagation()}
          onBlur={() => setEditing(false)}
          autoFocus={true}
        ></textarea>
      ) : (
        <div onClick={() => setEditing(true)} className={className}>
          {text}
        </div>
      )}
    </div>
  );
};

export const commentNodeDef: NodeDef = {
  nodeComponent: CommentNode,
  label: "Comment",
  category: categories["extra"],
  type: "comment",
  outputs: [],
  inputs: [],
  executor: () => [],
};
