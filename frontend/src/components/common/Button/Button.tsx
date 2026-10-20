import ButtonLoader from "../ButtonLoader/ButtonLoader";
import "./Button.scss";
import type { ButtonHTMLAttributes, PointerEvent } from "react";

const MAX_TILT = 6;

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  className,
  children,
  disabled,
  type = "button",
  onPointerMove,
  onPointerLeave,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const handlePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    onPointerMove?.(e);
    if (isDisabled || e.pointerType === "touch") return;

    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    el.style.setProperty("--tilt-x", `${-y * MAX_TILT * 2}deg`);
    el.style.setProperty("--tilt-y", `${x * MAX_TILT * 2}deg`);
  };

  const handlePointerLeave = (e: PointerEvent<HTMLButtonElement>) => {
    onPointerLeave?.(e);
    e.currentTarget.style.setProperty("--tilt-x", "0deg");
    e.currentTarget.style.setProperty("--tilt-y", "0deg");
  };

  const classes = [
    "button",
    `button--${variant}`,
    `button--${size}`,
    fullWidth && "button--full-width",
    loading && "button--loading",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...props}
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="button__content">{children}</div>
      <ButtonLoader />
    </button>
  );
}
