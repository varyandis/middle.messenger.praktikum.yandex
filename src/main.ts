import './styles/main.css';
import './styles/layout.css';
import './style.css';

import { Error404Page } from './pages/error404';

const root = document.querySelector('#app');

if (root) {
  const page = new Error404Page();

  const content = page.getContent();

  if (content) {
    root.append(content);
    page.dispatchComponentDidMount();
  }
}
