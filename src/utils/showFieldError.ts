import type { ValidationResult } from "./validation";

export function showFieldError(input: HTMLInputElement, result: ValidationResult) {
  let errorSpan = input.nextElementSibling as HTMLElement | null;

  if (!errorSpan) {
    const wrapper = input.closest('.profile__row-wrapper');
    if (wrapper) {
      errorSpan = wrapper.querySelector('.form-error') as HTMLElement | null;
    }
  }

  if (!errorSpan) return;

  if (!result.isValid) {
    input.classList.add('form-input--error');
    errorSpan.textContent = result.error ?? '';
  } else {
    input.classList.remove('form-input--error');
    errorSpan.textContent = '';
  }
}
