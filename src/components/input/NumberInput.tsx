import {
  ChangeEventHandler,
  FocusEventHandler,
  FunctionComponent,
  PointerEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ChangeEvent = {
  value: number;
};

type NumberInputProps = {
  id: string;
  name: string;
  onChange?: (e: ChangeEvent) => void;
  value?: number;
  label?: ReactNode | string;
  min?: number;
  max?: number;
};

const NumberInput: FunctionComponent<NumberInputProps> = ({
  id,
  name,
  onChange,
  value: officialValue,
  label,
  min,
  max,
}) => {
  const [value, setValue] = useState(officialValue || 0);
  const [sliding, setSliding] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [textEdit, setTextEdit] = useState(false);

  useEffect(() => {
    if (officialValue !== undefined) {
      setValue(officialValue);
    }
  }, [setValue, officialValue]);

  const inputElement = useRef<HTMLInputElement>(null);

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      let value = parseFloat(e.target.value);
      if (isNaN(value)) {
        value = 0;
      }

      setValue(value);
      onChange?.({ value: value });
    },
    [setValue, onChange]
  );

  const beginSliding: PointerEventHandler<HTMLElement> = useCallback(
    (e) => {
      if (!textEdit) {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        setSliding(true);
        setStartX(e.pageX);
        // (e.target as HTMLElement).requestPointerLock();
      }
    },
    [setSliding, textEdit]
  );

  const endSliding: PointerEventHandler<HTMLElement> = useCallback(
    (e) => {
      if (!textEdit) {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        setSliding(false);
        onChange?.({ value: value });
        if (startX === e.pageX) {
          setTextEdit(true);
        }
        setStartX(null);
      }
    },
    [setSliding, startX, textEdit, onChange, value]
  );

  const slide: PointerEventHandler<HTMLElement> = useCallback(
    (e) => {
      if (sliding && !textEdit) {
        let multiplier = 0.1;
        if (!e.ctrlKey) {
          multiplier *= 0.1;
        }
        if (e.shiftKey) {
          multiplier *= 0.1;
        }

        e.stopPropagation();

        setValue((old) => {
          let num = old + e.movementX * multiplier;

          if (min !== undefined) {
            num = Math.max(num, min);
          }
          if (max !== undefined) {
            num = Math.min(num, max);
          }

          return Number(num.toFixed(3));
        });
      }
    },
    [setValue, sliding, textEdit]
  );

  const onBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    setTextEdit(false);
  };

  const stopProp = useCallback((e: any) => {
    e.stopPropagation();
  }, []);

  const sliderWidth = useMemo(() => {
    if (min !== undefined && max !== undefined) {
      return `${(value / (max - min)) * 100}%`;
    }
    return null;
  }, [min, max, value]);
  console.log(sliderWidth);

  return (
    <div
      data-blub="Hi"
      className="w-full px-1 pointer-events-auto"
      onPointerDownCapture={beginSliding}
      onPointerUpCapture={endSliding}
      onPointerMoveCapture={slide}
      onMouseDownCapture={stopProp}
    >
      {textEdit ? (
        <input
          className="flex w-full h-full min-w-0 px-2 text-white rounded-md bg-neutral-800 focus:outline-none"
          type="number"
          id={id}
          name={name}
          onChange={handleOnChange}
          value={value}
          onBlur={onBlur}
          autoFocus={true}
          ref={inputElement}
        />
      ) : (
        <div className="flex flex-row w-full h-full px-4 text-white rounded-md bg-slate-800 cursor-ew-resize hover:bg-neutral-800 relative overflow-hidden">
          {sliderWidth !== null && (
            <div
              className="bg-blue-900 absolute h-full top-0 left-0 z-0"
              style={{ width: sliderWidth }}
            ></div>
          )}
          {label && <span className="grow z-10">{label}</span>}
          <span className="z-10">{value}</span>
        </div>
      )}
    </div>
  );
};

export default NumberInput;
