import { FunctionComponent, useCallback } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import NumberInput from "../components/input/NumberInput";

const ConstantValueNode: FunctionComponent<NodeProps<any>> = ({ data }) => {
  const onChange = useCallback((evt: any) => {
    console.log(evt);
  }, []);

  return (
    <>
      <div className="flex flex-col p-1 text-white rounded-sm bg-slate-800">
        <div className="">
          <h1 className="px-1">Constant Value</h1>
        </div>
        <div className="flex-col p-4 rounded-sm bg-slate-900">
          <div>
            <label htmlFor="value">Value: </label>
            <NumberInput
              id="value"
              name="value"
              onChange={onChange}
            ></NumberInput>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right}></Handle>
    </>
  );
};

export default ConstantValueNode;
