import Link from "next/link";
import { ReactNode } from "react";

export function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-4xl px-4 py-8">{children}</div>;
}

export function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border bg-white p-5 shadow-sm">{children}</div>;
}

export function Button({
  children,
  type = "button",
  onClick,
  disabled,
  variant = "primary",
}: {
  children: ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost" | "danger";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-black/90 focus:ring-black"
      : variant === "danger"
        ? "bg-red-600 text-white hover:bg-red-600/90 focus:ring-red-600"
        : "bg-transparent text-black hover:bg-gray-100 focus:ring-gray-400";
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles} ${disabled ? "opacity-60" : ""}`}>
      {children}
    </button>
  );
}

export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100">
      {children}
    </Link>
  );
}
