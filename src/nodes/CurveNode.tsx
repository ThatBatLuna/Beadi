import _ from "lodash";
import React, {
  FunctionComponent,
  MouseEventHandler,
  PointerEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { createSemanticDiagnosticsBuilderProgram } from "typescript";
import { NodeDef, NodeHeaderProps } from "../engine/node";
import { useCommittedData, useInputHandleData } from "../engine/store";
import { categories } from "./category";

type CurvePoint = {
  x: number;
  y: number;
};

const CurveNode: FunctionComponent<NodeHeaderProps> = ({ id }) => {
  const editor = useRef<SVGSVGElement | null>(null);
  const value = useCommittedData<number>(id, "value") || 0.0;
  const [pts, setPoints] = useInputHandleData<CurvePoint[]>(id, "curve");
  const points = useMemo(() => pts || [], [pts]);

  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const addPoint = useCallback(
    (e: React.PointerEvent) => {
      if (dragIndex === null) {
        const rect = editor.current?.getBoundingClientRect()!!;
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const newPointsSorted = _.sortBy(
          [...(points || []), { x, y: 1.0 - y }],
          (it) => it.x
        );
        setDragIndex(
          newPointsSorted.findIndex((it) => it.x === x && it.y === 1.0 - y)
        );
        setPoints(newPointsSorted);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        e.stopPropagation();
      }
    },
    [setPoints, editor, points, dragIndex]
  );

  const beginDrag = useCallback(
    (e: React.PointerEvent, index: number) => {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDragIndex(index);
      e.stopPropagation();
    },
    [setDragIndex]
  );

  const doDrag: MouseEventHandler = useCallback(
    (e) => {
      if (dragIndex !== null) {
        const newPoints = [...points];
        e.stopPropagation();

        const rect = editor.current?.getBoundingClientRect()!!;
        const x = Math.min(
          1.0,
          Math.max(0.0, (e.clientX - rect.left) / rect.width)
        );
        const y = Math.min(
          1.0,
          Math.max(0.0, (e.clientY - rect.top) / rect.height)
        );

        newPoints[dragIndex] = { x, y: 1.0 - y };
        const newPointsSorted = _.uniqWith(
          _.sortBy(newPoints, (it) => it.x),
          _.isEqual
        );

        setDragIndex(
          newPointsSorted.findIndex(
            (it) =>
              it.x === newPoints[dragIndex].x && it.y === newPoints[dragIndex].y
          )
        );
        setPoints(newPointsSorted);
      }
    },
    [dragIndex, points, setPoints]
  );

  const endDrag: PointerEventHandler = useCallback(
    (e) => {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDragIndex(null);
    },
    [setDragIndex]
  );

  return (
    <div className="w-full bg-black aspect-square">
      <svg
        viewBox="0 0 100 100"
        onPointerDown={(e) => addPoint(e)}
        ref={editor}
        className="stroke-white stroke_[0.01] cursor-crosshair"
        onPointerUp={endDrag}
        onPointerMoveCapture={(e) => doDrag(e)}
        onMouseMoveCapture={(e) => e.stopPropagation()}
        onMouseDownCapture={(e) => e.stopPropagation()}
      >
        <line
          x1={value * 100}
          x2={value * 100}
          y1="0"
          y2="100"
          className="stroke-primary-600"
        ></line>
        {points[0] !== undefined && (
          <line
            x1={0}
            y1={(1.0 - points[0].y) * 100}
            x2={points[0].x * 100}
            y2={(1.0 - points[0].y) * 100}
          ></line>
        )}
        {points?.map((point, index) => {
          let next = points?.[index + 1] || {
            y: point.y,
            x: 1.0,
          };
          return (
            <line
              x1={point.x * 100}
              y1={(1.0 - point.y) * 100}
              x2={next.x * 100}
              y2={(1.0 - next.y) * 100}
              key={index}
            ></line>
          );
        })}
        {points?.map((point, index) => (
          <circle
            cx={point.x * 100}
            cy={(1.0 - point.y) * 100}
            r={3}
            key={index}
            className="stroke-primary-800 fill-white hover:fill-blue-700 cursor-grab"
            onPointerDown={(e) => beginDrag(e, index)}
          ></circle>
        ))}
      </svg>
    </div>
  );
};

export const curveNodeDef: NodeDef = {
  label: "Curve",
  category: categories["math"],
  type: "curve",
  header: CurveNode,
  outputs: [
    {
      id: "value",
      label: "Value",
      type: "number",
    },
  ],
  inputs: [
    {
      id: "curve",
      label: "Curve",
      type: "object",
      hidden: true,
      default: [],
    },
    {
      id: "value",
      label: "Value",
      type: "number",
      default: 1.0,
      min: 0.0,
      max: 1.0,
    },
  ],
  executor: ([crv, val], { commit }) => {
    const curve = crv as CurvePoint[];
    const value = val as number;

    if (isNaN(value)) {
      return [0];
    }
    commit("value", value);

    if (curve.length === 0) {
      return [value];
    }
    let a: CurvePoint | null = null;
    let b: CurvePoint | null = null;

    for (const point of curve) {
      if (point.x < value) {
        a = point;
      }
      if (point.x >= value) {
        b = point;
        break;
      }
    }
    if (a === null) {
      a = { x: 0.0, y: b!!.y };
    }
    if (b === null) {
      b = { x: 1.0, y: a.y };
    }

    let amount = (value - a.x) / (b.x - a.x);

    return [a.y + (b.y - a.y) * amount];
  },
};
