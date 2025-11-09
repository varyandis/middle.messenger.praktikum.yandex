import Handlebars from 'handlebars'
import template from './error404.hbs?raw'

const loginTemplate = Handlebars.compile(template)
const html = loginTemplate({})

document.querySelector('.page-centered')!.innerHTML = html
