import './styles/main.css';
import './styles/layout.css';
import './style.css';

import { ProfilePage } from './pages/profile/ProfilePage';

const root = document.querySelector('#app');

if (root) {
  const page = new ProfilePage();
  const content = page.getContent();

  if (content) {
    root.append(content);
    page.dispatchComponentDidMount();
  }
}
