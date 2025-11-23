import { Block } from '../../core/Block';
import Handlebars from 'handlebars';
import template from './editProfile.hbs?raw';
import './editProfile.css';
import { validateField } from '../../utils/validation';
import { showFieldError } from '../../utils/showFieldError';

interface EditProfileProps {
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  display_name?: string;
  phone: string;
}

export class EditProfilePage extends Block<EditProfileProps> {
  constructor() {
    super('div', {
      email: 'pochta@yandex.ru',
      login: 'ivanivanov',
      first_name: 'Иван',
      second_name: 'Иванов',
      display_name: 'Иван',
      phone: '+7 (909) 967 30 30',
    });
  }

  protected componentDidMount(): void {
    const form = this.element?.querySelector(
      'form[name="editProfile"]'
    ) as HTMLFormElement | null;

    if (!form) return;

    const inputs = form.querySelectorAll<HTMLInputElement>('input.form-input');

    // blur-валидация
    inputs.forEach((input) => {
      input.addEventListener('blur', () => {
        const { name, value } = input;
        const result = validateField(name, value);

        showFieldError(input, result);
      });
    });

    // submit
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      let isFormValid = true;

      inputs.forEach((input) => {
        const { name, value } = input;
        const result = validateField(name, value);

        if (!result.isValid) {
          isFormValid = false;
        }

        showFieldError(input, result);
      });

      if (!isFormValid) return;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      console.log('Редактирование профиля:', data);
    });
  }

  public render(): string {
    return Handlebars.compile(template)(this.props);
  }
}
