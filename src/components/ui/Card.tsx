interface CardProps {
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
}

export default function Card({ children, className = "", bgColor }: CardProps) {
  return (
    <div
      className={`rounded-3xl ${className}`}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
    >
      {children}
    </div>
  );
}
