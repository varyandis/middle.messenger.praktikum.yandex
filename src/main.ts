import './styles/main.css';
import './styles/layout.css';
import './style.css';

import { ChatsPage } from './pages/chats/ChatsPage';


const root = document.querySelector('#app');

if (root) {
  const page = new ChatsPage();
  const content = page.getContent();

  if (content) {
    root.append(content);
    page.dispatchComponentDidMount();
  }
}
