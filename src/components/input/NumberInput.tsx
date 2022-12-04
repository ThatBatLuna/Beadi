import {
  ChangeEventHandler,
  FocusEventHandler,
  FunctionComponent,
  PointerEventHandler,
  ReactNode,
  useCallback,
  useEffect,
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
};

const NumberInput: FunctionComponent<NumberInputProps> = ({
  id,
  name,
  onChange,
  value: officialValue,
  label,
  min,
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
        <div className="flex flex-row w-full h-full px-4 text-white rounded-md bg-slate-800 cursor-ew-resize hover:bg-neutral-800">
          {label && <span className="grow">{label}</span>}
          <span>{value}</span>
        </div>
      )}
    </div>
  );
};

export default NumberInput;
