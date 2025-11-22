import './styles/main.css';
import './styles/layout.css';
import './style.css';
import { LoginPage } from './pages/login';

// import { RegistrationPage } from './pages/registration';

const root = document.querySelector('#app');

if (root) {
  const page = new LoginPage;
  const content = page.getContent();

  if (content) {
    root.append(content);
    page.dispatchComponentDidMount();
  }
}
