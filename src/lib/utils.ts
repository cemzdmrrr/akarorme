import { clsx, type ClassValue } from 'clsx';

/** Merge Tailwind classes — thin wrapper around clsx */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
