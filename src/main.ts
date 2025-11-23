import './styles/main.css';
import './styles/layout.css';
import './style.css';
import { EditPasswordPage } from './pages/editPassword/EditPasswordPage';


const root = document.querySelector('#app');

if (root) {
  const page = new EditPasswordPage();
  const content = page.getContent();

  if (content) {
    root.append(content);
    page.dispatchComponentDidMount();
  }
}
