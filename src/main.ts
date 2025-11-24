import './styles/main.css';
import './styles/layout.css';

import { Block } from './core/Block';

import { LoginPage } from './pages/login/LoginPage';
import { RegistrationPage } from './pages/registration/RegistrationPage';
import { ChatsPage } from './pages/chats/ChatsPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { EditProfilePage } from './pages/editProfile/EditProfilePage';
import { EditPasswordPage } from './pages/editPassword/EditPasswordPage';
import { Error404Page } from './pages/error404/Error404';
import { Error500Page } from './pages/error500/Error500';

type PageClass = new () => Block;

const routes: Record<string, PageClass> = {
  '/': LoginPage,
  '/login': LoginPage,
  '/registration': RegistrationPage,
  '/chats': ChatsPage,
  '/profile': ProfilePage,
  '/profile/edit': EditProfilePage,
  '/profile/password': EditPasswordPage,
  '/500': Error500Page,
};

function renderPage(Page: PageClass): void {
  const root = document.querySelector('#app');

  if (!root) return;

  root.innerHTML = '';

  const page = new Page();
  const content = page.getContent();

  if (content) {
    root.append(content);
    page.dispatchComponentDidMount();
  }
}


const path = window.location.pathname;

const PageClass = routes[path] ?? Error404Page;

renderPage(PageClass);
