import './styles/main.css';
import './styles/layout.css';

import { Router } from './core/Router';

import { LoginPage } from './pages/login/LoginPage';
import { RegistrationPage } from './pages/registration/RegistrationPage';
import { ChatsPage } from './pages/chats/ChatsPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { EditProfilePage } from './pages/editProfile/EditProfilePage';
import { EditPasswordPage } from './pages/editPassword/EditPasswordPage';
import { Error404Page } from './pages/error404/Error404';
import { Error500Page } from './pages/error500/Error500';

const router = new Router('#app');

router
  .use('/', LoginPage)
  .use('/sign-up', RegistrationPage)
  .use('/messenger', ChatsPage)
  .use('/settings', ProfilePage)
  .use('/settings/edit', EditProfilePage)
  .use('/settings/password', EditPasswordPage)
  .use('/500', Error500Page)
  .use('/404', Error404Page);

router.start();
