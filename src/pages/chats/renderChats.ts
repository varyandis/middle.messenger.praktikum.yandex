import Handlebars from 'handlebars'
import template from './chats.hbs?raw'

const loginTemplate = Handlebars.compile(template)
const html = loginTemplate({})

document.querySelector('.data')!.innerHTML = html
