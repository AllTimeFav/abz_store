import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateVerificationCode(length: number = 6): string {
  return Math.random()
    .toString()
    .slice(2, 2 + length)
}
