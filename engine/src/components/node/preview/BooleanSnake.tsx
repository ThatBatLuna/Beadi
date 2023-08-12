import { FunctionComponent, useEffect, useState } from "react";
import { usePreviewStore } from "../../../engine/preview";
import { NodeHandleValuePreviewProps } from "../NodeHandleValuePreview";
import { timerNodeDef } from "../../../nodes/TimerNode";
import produce from "immer";
import _ from "lodash";
import clsx from "clsx";

type Entry = {
  begin: number;
  end: number;
  value: boolean;
};

const SAMPLE_RATE = 30.0;
const LENGTH = 5.0;
export const BooleanSnakeHandleValuePreview: FunctionComponent<NodeHandleValuePreviewProps> = (props) => {
  const value = usePreviewStore<boolean>((s) => s.outputHandlePreviews[props.nodeId]?.[props.handleId]);

  const [data, setData] = useState<Entry[]>([
    {
      begin: new Date().getTime(),
      end: new Date().getTime(),
      value: value,
    },
  ]);

  useEffect(() => {
    let timeout = setInterval(() => {
      const value = usePreviewStore.getState().outputHandlePreviews[props.nodeId]?.[props.handleId];

      const oldest = new Date().getTime() - LENGTH * 1000.0;

      setData((old) =>
        produce(old, (draft) => {
          if (draft[draft.length - 1].value !== value) {
            draft.push({
              begin: new Date().getTime(),
              end: new Date().getTime(),
              value: value,
            });
          } else {
            draft[draft.length - 1].end = new Date().getTime();
          }
          while (draft[0].end < oldest) {
            draft.splice(0, 1);
          }
          draft[0].begin = oldest;
        })
      );
    }, 1000 / SAMPLE_RATE);
    return () => {
      clearInterval(timeout);
    };
  }, [props.nodeId, props.handleId, setData]);

  const begin = data[0].begin;
  const end = data[data.length - 1].end;
  const duration = Math.max(end - begin, 1);

  const blocks = data
    .filter((v) => v.value)
    .map((block) => ({
      begin: (block.begin - begin) / duration,
      end: (block.end - begin) / duration,
    }));

  return (
    <div className="bg-primary-1000 relative flex flex-row overflow-hidden">
      <div className="relative grow">
        {blocks.map((it, index) => (
          // <rect key={index} className="fill-purple-700" x={it.begin * 100} width={(it.end - it.begin) * 100} y={0} height={10}></rect>
          <div
            className="absolute top-0 h-full bg-purple-700"
            style={{ left: `${it.begin * 100}%`, width: `${(it.end - it.begin) * 100}%` }}
          ></div>
        ))}
      </div>
      <div className={clsx("w-16 text-center border-l border-l-black", value ? "bg-purple-700" : "bg-primary-800")}>
        {value ? "true" : "false"}
      </div>
    </div>
  );
};
