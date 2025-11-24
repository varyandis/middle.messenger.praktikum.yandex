import { Block } from '../../core/Block';
import { showFieldError } from '../../utils/showFieldError';
import { validateField } from '../../utils/validation';
import './login.css';
import template from './login.hbs?raw';
import Handlebars from 'handlebars';

export class LoginPage extends Block {
  constructor() {
    super('div');
  }

  componentDidMount() {
  const form = this.element?.querySelector('form[name="login"]') as HTMLFormElement | null;

  if (!form) {
    return;
  }

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const inputs = form.querySelectorAll<HTMLInputElement>('input.form-input');
  let isFormValid = true;

  inputs.forEach((input) => {
    const name = input.name;
    const value = input.value;

    const result = validateField(name, value);
    showFieldError(input, result);

    if (!result.isValid) {
      isFormValid = false;
    }
  });

    if (!isFormValid) {
      return;
    }

    const formData = new FormData(form);
    const raw = Object.fromEntries(formData.entries());

    console.log(raw);
});

  const inputs = form.querySelectorAll<HTMLInputElement>('input.form-input');
  inputs.forEach((input) => {
  input.addEventListener('blur', () => {
    const name = input.name;
    const value = input.value;
    const result = validateField(name, value);
    showFieldError(input, result)
  });
});
  }

  render(): string {
    const compile = Handlebars.compile(template);
    return compile({});
  }
}
