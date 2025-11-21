import './styles/main.css';
import './styles/layout.css';
import './style.css';
import { Error500Page } from './pages/error500';

const root = document.querySelector('#app');

if (root) {
  const page = new Error500Page();

  const content = page.getContent();

  if (content) {
    root.append(content);
    page.dispatchComponentDidMount();
  }
}
