'use client';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';

interface LinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  children: ReactNode;
}

export default function Link({
  icon: Icon,
  children,
  className = '',
  ...props
}: LinkProps) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center gap-1 rounded px-1 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer ${className}`}
    >
      {children}
      {Icon && <Icon className="h-4 w-4" />}
    </button>
  );
}
