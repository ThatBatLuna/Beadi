import {
  ChangeEventHandler,
  FocusEventHandler,
  FunctionComponent,
  PointerEventHandler,
  useCallback,
  useRef,
  useState,
} from "react";

type ChangeEvent = {
  value: number;
};

type NumberInputProps = {
  id: string;
  name: string;
  onChange: (e: ChangeEvent) => void;
};

const NumberInput: FunctionComponent<NumberInputProps> = ({
  id,
  name,
  onChange,
}) => {
  const [value, setValue] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [textEdit, setTextEdit] = useState(true);

  const inputElement = useRef(null);

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const value = parseFloat(e.target.value);
      setValue(value);
      onChange({ value: value });
    },
    [setValue, onChange]
  );

  const beginSliding: PointerEventHandler<HTMLElement> = useCallback(
    (e) => {
      if (!textEdit) {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        setSliding(true);
        setStartX(e.pageX);
      }
    },
    [setSliding, textEdit]
  );

  const endSliding: PointerEventHandler<HTMLElement> = useCallback(
    (e) => {
      if (!textEdit) {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        setSliding(false);
        if (startX === e.pageX) {
          setTextEdit(true);
        }
        setStartX(null);
      }
    },
    [setSliding, startX, textEdit]
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
        setValue((old) => Number((old + e.movementX * multiplier).toFixed(3)));
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
      className="w-40 px-1 pointer-events-auto"
      onPointerDownCapture={beginSliding}
      onPointerUpCapture={endSliding}
      onPointerMoveCapture={slide}
      onMouseDownCapture={stopProp}
    >
      {textEdit ? (
        <input
          className="w-full h-full min-w-0 px-2 text-white rounded-md bg-neutral-800 focus:outline-none"
          type="number"
          id={id}
          name={name}
          onChange={handleOnChange}
          value={value}
          onBlur={onBlur}
          autoFocus={true}
        />
      ) : (
        <div className="block w-full h-full px-2 text-center text-white rounded-md bg-slate-800 cursor-ew-resize hover:bg-neutral-800">
          <span>{value}</span>
        </div>
      )}
    </div>
  );
};

export default NumberInput;
