import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Функция для правильного склонения "стаж попечительства" в русском языке
export function getTrusteeshipText(years: number): string {
  const lastDigit = years % 10
  const lastTwoDigits = years % 100

  // Исключения для 11-14
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${years} лет стажа попечительства`
  }

  // Основные правила склонения
  if (lastDigit === 1) {
    return `${years} год стажа попечительства`
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return `${years} года стажа попечительства`
  } else {
    return `${years} лет стажа попечительства`
  }
}
