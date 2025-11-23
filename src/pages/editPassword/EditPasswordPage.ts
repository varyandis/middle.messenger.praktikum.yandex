import { Block } from '../../core/Block';
import { showFieldError } from '../../utils/showFieldError';
import { validateField } from '../../utils/validation';
import './editPassword.css';
import template from './editPassword.hbs?raw';
import Handlebars from 'handlebars';

export class EditPasswordPage extends Block {
  constructor() {
    super('div');
  }

  protected componentDidMount(): void {
    const form = this.element?.querySelector(
      'form[name="changePassword"]'
    ) as HTMLFormElement | null;

    if (!form) return;

    const inputs = form.querySelectorAll<HTMLInputElement>('input.form-input');

    const mapNameForValidation = (name: string): string => {
      if (name === 'oldPassword' || name === 'newPassword') {
        return 'password';
      }
      if (name === 'newPassword_repeat') {
        return 'password_repeat';
      }
      return name;
    };

    inputs.forEach((input) => {
      input.addEventListener('blur', () => {
        const { name, value } = input;
        const validationName = mapNameForValidation(name);
        const result = validateField(validationName, value);

        showFieldError(input, result);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;

      inputs.forEach((input) => {
        const { name, value } = input;
        const validationName = mapNameForValidation(name);
        const result = validateField(validationName, value);

        if (!result.isValid) {
          isFormValid = false;
        }

        showFieldError(input, result);
      });

      const newPasswordInput = form.querySelector<HTMLInputElement>(
        'input[name="newPassword"]'
      );
      const newPasswordRepeatInput = form.querySelector<HTMLInputElement>(
        'input[name="newPassword_repeat"]'
      );

      if (newPasswordInput && newPasswordRepeatInput) {
        if (newPasswordInput.value !== newPasswordRepeatInput.value) {
          isFormValid = false;
          showFieldError(newPasswordRepeatInput, {
            isValid: false,
            error: 'Пароли должны совпадать',
          });
        }
      }

      if (!isFormValid) return;

      const formData = new FormData(form);
      const raw = Object.fromEntries(formData.entries());

      console.log('Изменение пароля:', raw);
    });
  }

  render(): string {
    return Handlebars.compile(template)({});
  }
}
