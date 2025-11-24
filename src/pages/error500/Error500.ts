import { Block } from '../../core/Block';
import './error500.css';
import template from './error500.hbs?raw'
import Handlebars from 'handlebars';

export class Error500Page extends Block {
  constructor() {
    super('div');
  }

  render(): string {
    return Handlebars.compile(template)({});
  }
}
