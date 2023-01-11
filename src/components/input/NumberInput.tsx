import clsx from "clsx";
import {
  ChangeEventHandler,
  FocusEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
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
    [setValue, sliding, textEdit, min, max]
  );

  const onBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    setTextEdit(false);
  };

  const blurOnEnter: KeyboardEventHandler = (e) => {
    if (e.code === "Enter") {
      (e.target as HTMLElement).blur();
    }
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
          className="flex w-full h-full min-w-0 px-2 text-white rounded-md bg-primary-1100 focus:outline-none"
          type="number"
          id={id}
          name={name}
          onChange={handleOnChange}
          onKeyDown={blurOnEnter}
          value={value}
          onBlur={onBlur}
          autoFocus={true}
          ref={inputElement}
        />
      ) : (
        <div
          className={clsx(
            "relative flex flex-row w-full h-full px-4 overflow-hidden text-white rounded-md bg-primary-600 cursor-ew-resize hover:bg-primary-500",
            {
              "hover:bg-primary-1100": sliding,
            }
          )}
        >
          {sliderWidth !== null && (
            <div
              className="absolute top-0 left-0 z-0 h-full bg-blue-900"
              style={{ width: sliderWidth }}
            ></div>
          )}
          {label && <span className="z-10 grow">{label}</span>}
          <span className="z-10">{value}</span>
        </div>
      )}
    </div>
  );
};

export default NumberInput;
