import './styles/main.css';
import './styles/layout.css';
import './style.css';

import { RegistrationPage } from './pages/registration';

const root = document.querySelector('#app');

if (root) {
  const page = new RegistrationPage();
  const content = page.getContent();

  if (content) {
    root.append(content);
    page.dispatchComponentDidMount();
  }
}
