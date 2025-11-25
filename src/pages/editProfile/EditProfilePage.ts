import { Block, type Props } from '../../core/Block';
import Handlebars from 'handlebars';
import template from './editProfile.hbs?raw';
import './editProfile.css';
import { validateField } from '../../utils/validation';
import { showFieldError } from '../../utils/showFieldError';

interface EditProfileProps extends Props {
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

      events: {
        blur: (e: Event) => {
          const target = e.target as HTMLInputElement | null;
          if (!target || !target.classList.contains('form-input')) return;

          const { name, value } = target;
          const result = validateField(name, value);

          showFieldError(target, result);
        },

        submit: (e: Event) => {
          const form = e.target as HTMLFormElement;
          if (form.name !== 'editProfile') return;

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

          if (!isFormValid) return;

          const formData = new FormData(form);
          const data = Object.fromEntries(formData.entries());

          console.log('Редактирование профиля:', data);
        },
      },
    } satisfies EditProfileProps);
  }

  public render(): string {
    return Handlebars.compile(template)(this.props);
  }
}
