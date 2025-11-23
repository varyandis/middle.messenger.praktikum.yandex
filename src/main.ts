import './styles/main.css';
import './styles/layout.css';
import './style.css';
import { EditProfilePage } from './pages/editProfile';


const root = document.querySelector('#app');

if (root) {
  const page = new EditProfilePage();
  const content = page.getContent();

  if (content) {
    root.append(content);
    page.dispatchComponentDidMount();
  }
}
