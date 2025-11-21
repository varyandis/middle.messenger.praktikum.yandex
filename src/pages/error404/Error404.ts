import { Block } from '../../core/Block';
import './error404.css';
import template from './error404.hbs?raw'
import Handlebars from 'handlebars';

export class Error404Page extends Block {
  constructor() {
    super('div');
  }

  render(): string {
    return Handlebars.compile(template)({});
  }
}
