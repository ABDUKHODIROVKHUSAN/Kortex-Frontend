import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div className={`glass-card p-6 ${className}`}>{children}</div>
  );
}

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  const variants = {
    primary:
      "btn-primary border border-accent-primary shadow-glow-btn hover:border-accent-secondary hover:shadow-glow-btn-hover",
    secondary:
      "btn-secondary-themed border border-border text-text-primary",
    ghost:
      "text-text-secondary hover:bg-bg-tertiary hover:text-accent-primary",
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`themed-input w-full rounded-lg px-4 py-3 outline-none transition focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/30 ${className}`}
      {...props}
    />
  );
}

export function Badge({
  children,
  color = "default",
}: {
  children: ReactNode;
  color?: "default" | "success" | "warning" | "error";
}) {
  const colors = {
    default: "bg-accent-primary/10 text-accent-primary border border-accent-primary/20",
    success: "bg-success/10 text-success border border-success/20",
    warning: "bg-warning/10 text-warning border border-warning/20",
    error: "bg-error/10 text-error border border-error/20",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${colors[color]}`}
    >
      {children}
    </span>
  );
}

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-5 w-5 animate-spin rounded-full border-2 border-accent-primary/20 border-t-accent-primary ${className}`}
    />
  );
}
