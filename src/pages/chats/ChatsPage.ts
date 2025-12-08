import { Block } from '../../core/Block';
import Handlebars from 'handlebars';
import template from './chats.hbs?raw';
import './chats.css';
import { validateField } from '../../utils/validation';


export class ChatsPage extends Block {
  constructor() {
    super('div', {
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;

          const menuBtn = this.element?.querySelector('.chat__menu-btn') as HTMLElement | null;
          const menu = this.element?.querySelector('.chat__menu') as HTMLElement | null;

          if (menuBtn && menu) {
            if (menuBtn.contains(target)) {
              menu.classList.toggle('chat__menu--hidden');
              return;
            }

            if (!menu.contains(target) && !menuBtn.contains(target)) {
              menu.classList.add('chat__menu--hidden');
            }
          }
        },

        input: (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (!target.classList.contains('chat__input')) return;

          const sendBtn = this.element?.querySelector('.chat__send-btn') as HTMLButtonElement | null;
          if (!sendBtn) return;

          const { isValid } = validateField('message', target.value);
          sendBtn.disabled = !isValid;
        },

        submit: (e: Event) => {
          const form = e.target as HTMLFormElement;
          if (form.name !== 'messageForm') return;

          e.preventDefault();

          const input = form.querySelector('.chat__input') as HTMLInputElement;
          const sendBtn = form.querySelector('.chat__send-btn') as HTMLButtonElement;

          const { isValid } = validateField('message', input.value);
          if (!isValid) return;

          const data = new FormData(form);
          const raw = Object.fromEntries(data.entries());
          console.log(raw);

          input.value = '';
          sendBtn.disabled = true;
        },
      },
    });
  }

  protected componentDidMount(): void {
    const menu = this.element?.querySelector('.chat__menu') as HTMLElement | null;
    if (menu) {
      menu.classList.add('chat__menu--hidden');
    }

    const sendBtn = this.element?.querySelector('.chat__send-btn') as HTMLButtonElement | null;
    if (sendBtn) {
      sendBtn.disabled = true;
    }
  }

  render(): string {
    return Handlebars.compile(template)({});
  }
}


