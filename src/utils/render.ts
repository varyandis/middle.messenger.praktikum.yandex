import Handlebars from 'handlebars';

export const render = (selector: string, template: string, context: unknown = {}) => {
  const root = document.querySelector(selector)
  if (!root) return
  const html = Handlebars.compile(template)(context)
  root.innerHTML = html
}
