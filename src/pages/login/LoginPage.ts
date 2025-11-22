import { Block } from '../../core/Block';
import { getLoginFormValues } from '../../utils/form';
import './login.css';
import template from './login.hbs?raw';
import Handlebars from 'handlebars';

export class LoginPage extends Block {
  constructor() {
    super('div');
  }

  componentDidMount() {
  const form = this.element?.querySelector('form[name="login"]') as HTMLFormElement | null;

  form?.addEventListener('submit', (e) => {
    e.preventDefault()

    const values = getLoginFormValues(form)
    console.log(values)
  })
  }

  render(): string {
    const compile = Handlebars.compile(template);
    return compile({});
  }
}
