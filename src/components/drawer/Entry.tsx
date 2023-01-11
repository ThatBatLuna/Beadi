import { FunctionComponent } from "react";
import { useDrag } from "react-dnd";
import { NodeDef } from "../../engine/node";

type EntryProps = {
  nodeDef: NodeDef;
};
export const Entry: FunctionComponent<EntryProps> = ({ nodeDef }) => {
  //eslint-disable-next-line
  const [_, drag] = useDrag(() => ({
    type: "Node",
    item: { type: nodeDef.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  return (
    <li
      draggable
      className="p-1 px-4 text-white cursor-pointer"
      ref={drag}
      // onClick={() => handleClick(node.type)}
    >
      {nodeDef.label}
    </li>
  );
};
