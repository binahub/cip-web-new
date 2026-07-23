import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: "default" | "accent";
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = "default", className = "", ...props }, ref) => {
    const base =
      "inline-flex cursor-pointer items-center justify-center rounded-xl transition-colors disabled:cursor-not-allowed";
    const variants = {
      default: "text-text-nav hover:text-white",
      accent: "bg-login-pill-bg text-accent hover:opacity-80",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`}
        {...props}
      >
        {icon}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";

export default IconButton;
