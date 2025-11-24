import { Block } from '../../core/Block';
import { showFieldError } from '../../utils/showFieldError';
import { validateField } from '../../utils/validation';
import './registration.css';
import template from './registration.hbs?raw';
import Handlebars from 'handlebars';

export class RegistrationPage extends Block {
  constructor() {
    super('div');
  }

  protected componentDidMount(): void {
    const form = this.element?.querySelector('form[name="signup"]') as HTMLFormElement | null;

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputs = form.querySelectorAll<HTMLInputElement>('input.form-input');
      let isFormValid = true;

      inputs.forEach((input) => {
        const { name, value } = input;
        const result = validateField(name, value);

        if (!result.isValid) {
          isFormValid = false;
        }

        showFieldError(input, result);
      });

      const passwordInput = form.querySelector<HTMLInputElement>('input[name="password"]');
      const passwordRepeatInput = form.querySelector<HTMLInputElement>('input[name="password_repeat"]');

      if (passwordInput && passwordRepeatInput) {
        if (passwordInput.value !== passwordRepeatInput.value) {
          isFormValid = false;
          showFieldError(passwordRepeatInput, {
            isValid: false,
            error: 'Пароли должны совпадать',
          });
        }
      }

      if (!isFormValid) return;

      const formData = new FormData(form);
      const raw = Object.fromEntries(formData.entries());

      console.log(raw);
    });

    const inputs = form.querySelectorAll<HTMLInputElement>('input.form-input');

    inputs.forEach((input) => {
      input.addEventListener('blur', () => {
        const { name, value } = input;
        const result = validateField(name, value);
        showFieldError(input, result);
      });
    });
  }

  render(): string {
    return Handlebars.compile(template)({});
  }
}
