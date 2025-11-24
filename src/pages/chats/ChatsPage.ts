import { Block } from '../../core/Block';
import Handlebars from 'handlebars';
import template from './chats.hbs?raw';
import './chats.css';
import { validateField } from '../../utils/validation';


export class ChatsPage extends Block {
  constructor() {
    super('div');
  }

protected componentDidMount(): void {
  const menuBtn = this.element?.querySelector('.chat__menu-btn') as HTMLButtonElement | null;
  const menu = this.element?.querySelector('.chat__menu') as HTMLElement | null;

  if (menuBtn && menu) {
    menu.classList.add('chat__menu--hidden');

    menuBtn.addEventListener('click', () => {
      menu.classList.toggle('chat__menu--hidden');
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target as Node) && !menuBtn.contains(e.target as Node)) {
        menu.classList.add('chat__menu--hidden');
      }
    });
  }

  const input = this.element?.querySelector('.chat__input') as HTMLInputElement | null;
  const sendBtn = this.element?.querySelector('.chat__send-btn') as HTMLButtonElement | null;
  const form = this.element?.querySelector('form[name="messageForm"]') as HTMLFormElement | null;

  if (!input || !sendBtn || !form) return;

  sendBtn.disabled = true;

  input.addEventListener('input', () => {
    const { isValid } = validateField('message', input.value);
    sendBtn.disabled = !isValid;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { isValid } = validateField('message', input.value);

    if (!isValid) {
      return;
    }

    const data = new FormData(form);
    const raw = Object.fromEntries(data.entries());

    console.log(raw);

    input.value = '';
    sendBtn.disabled = true;
  });
}

  render(): string {
    return Handlebars.compile(template)({});
  }
}
