import { FunctionComponent, useCallback, useState } from "react";
import { NodeHandleValuePreviewProps } from "../NodeHandleValuePreview";
import { useAnimationFrame } from "../../../hooks/useAnimationFrame";
import { usePreviewStore } from "../../../storage";

const HISTORY_LENGTH = 10.0;
const REFRESH_RATE = 30.0;

export const ImpuulseHandleValuePreview: FunctionComponent<NodeHandleValuePreviewProps> = (props) => {
  const signals = usePreviewStore((s) => s.signalLog[props.nodeId]?.[props.handleId]) ?? [];

  const [oldest, setOldest] = useState(new Date().getTime() - HISTORY_LENGTH * 1000.0);

  const update = useCallback(() => {
    let timeout = setInterval(() => {
      setOldest(new Date().getTime() - HISTORY_LENGTH * 1000.0);
    }, 1000 / REFRESH_RATE);
    return () => {
      clearInterval(timeout);
    };
  }, [setOldest]);

  useAnimationFrame(update);

  const blobs = signals.map((it) => ({
    age: (it.getTime() - oldest) / (HISTORY_LENGTH * 1000.0),
  }));

  return (
    <div className="bg-primary-1000 relative flex flex-row overflow-hidden">
      <div className="relative grow h-4">
        {blobs.map((it, index) => (
          // <rect key={index} className="fill-purple-700" x={it.begin * 100} width={(it.end - it.begin) * 100} y={0} height={10}></rect>
          <div key={index} className="absolute top-0 h-2 w-2 my-1 rounded-full bg-purple-700" style={{ left: `${it.age * 100.0}%` }}></div>
        ))}
      </div>
    </div>
  );
};
