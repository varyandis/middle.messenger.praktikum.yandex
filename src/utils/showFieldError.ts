import type { ValidationResult } from "./validation";

export function showFieldError(input: HTMLInputElement, result: ValidationResult) {
  const errorSpan  = input.nextElementSibling as HTMLSpanElement | null

  if (!errorSpan) return

  if(!result.isValid) {
    input.classList.add('form-input--error')
    errorSpan.textContent = result.error
  } else {
    input.classList.remove('form-input--error')
    errorSpan.textContent = ''
  }
}
