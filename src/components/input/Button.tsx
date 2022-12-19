import clsx from "clsx";
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FunctionComponent,
  HTMLProps,
  ReactNode,
} from "react";

type ButtonProps = {
  children: ReactNode;
  disabledNotice?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button: FunctionComponent<ButtonProps> = ({
  children,
  disabled,
  disabledNotice,
  ...buttonProps
}) => {
  return (
    <button
      {...buttonProps}
      disabled={disabled}
      className={clsx(
        "bg-primary-500 rounded-md hover:bg-primary-400 h-6 text-white shadow-[1px_1px_1px_0_black] disabled:text-slate-400 disabled:bg-primary-500 disabled:hover:bg-primary-500"
      )}
    >
      <div>{children}</div>
    </button>
  );
};
