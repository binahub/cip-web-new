import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "accent-outline" | "accent-ghost";
  isLoading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", isLoading, leadingIcon, trailingIcon, className = "", disabled, children, ...props }, ref) => {
    const base =
      "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary: "bg-brand text-white hover:bg-brand-dark",
      secondary: "bg-surface-dim text-text border border-border hover:bg-border",
      danger: "bg-danger text-white hover:opacity-90",
      "accent-outline": "border border-accent text-accent rounded-xl hover:bg-cta-pill-bg",
      "accent-ghost": "bg-cta-pill-bg text-accent rounded-full hover:opacity-80",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {leadingIcon}
        {children}
        {trailingIcon}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
