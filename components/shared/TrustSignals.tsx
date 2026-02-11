"use client";

export type TrustSignalsProps = {
  signals: string[];
  variant?: "light" | "dark";
  className?: string;
};

export default function TrustSignals({
  signals,
  variant = "light",
  className = "",
}: TrustSignalsProps) {
  if (!signals?.length) return null;

  const isDark = variant === "dark";
  const textClass = isDark ? "text-white/90" : "text-muted-foreground";
  const borderClass = isDark ? "border-white/25" : "border-border";

  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:gap-x-4 sm:gap-y-2 ${className}`}
      role="complementary"
      aria-label="Trust and credentials"
    >
      {signals.map((label) => (
        <span
          key={label}
          className={`inline-flex items-center text-xs sm:text-sm font-medium ${textClass} border ${borderClass} rounded-full px-3 py-1.5`}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
