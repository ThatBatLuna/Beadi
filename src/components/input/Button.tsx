import clsx from "clsx";
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FunctionComponent,
  ReactNode,
} from "react";

type ButtonProps = {
  children?: ReactNode;
  disabledNotice?: string;
  icon?: ReactNode;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button: FunctionComponent<ButtonProps> = ({
  children,
  disabled,
  icon,
  disabledNotice,
  className,
  ...buttonProps
}) => {
  const isIcon = icon !== undefined;
  return (
    <button
      {...buttonProps}
      disabled={disabled}
      className={clsx(
        "bg-primary-500 rounded-md hover:bg-primary-400 text-white shadow-[1px_1px_1px_0_black] disabled:text-slate-400 disabled:bg-primary-500 disabled:hover:bg-primary-500",
        className,
        {
          "px-2 py-2 h-8 w-8": isIcon,
          "px-2 h-6": !isIcon,
        }
      )}
    >
      {icon}
      {children && <div>{children}</div>}
    </button>
  );
};
