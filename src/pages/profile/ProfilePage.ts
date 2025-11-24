import { Block } from '../../core/Block';
import './profile.css';
import template from './profile.hbs?raw';
import Handlebars from 'handlebars';

export class ProfilePage extends Block {
  constructor() {
    super('div', {
      name: 'Иван',
      email: 'pochta@yandex.ru',
      login: 'ivanivanov',
      first_name: 'Иван',
      second_name: 'Иванов',
      display_name: 'Иван',
      phone: '+7 (909) 967 30 30',
    });
  }

  render(): string {
    const context = this.props;
    return Handlebars.compile(template)(context);
  }
}
