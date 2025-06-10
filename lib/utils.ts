import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Функция для правильного склонения слова "год" в русском языке
export function getYearsText(years: number): string {
  const lastDigit = years % 10
  const lastTwoDigits = years % 100

  // Исключения для 11-14
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${years} лет`
  }

  // Основные правила склонения
  if (lastDigit === 1) {
    return `${years} год`
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return `${years} года`
  } else {
    return `${years} лет`
  }
}
