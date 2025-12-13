import "./styles/main.css";
import "./styles/layout.css";

import { LoginPage } from "./pages/login/LoginPage";
import { RegistrationPage } from "./pages/registration/RegistrationPage";
import { ChatsPage } from "./pages/chats/ChatsPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { EditProfilePage } from "./pages/editProfile/EditProfilePage";
import { EditPasswordPage } from "./pages/editPassword/EditPasswordPage";
import { Error404Page } from "./pages/error404/Error404";
import { Error500Page } from "./pages/error500/Error500";

import { router } from "./core/routerInstance";
import { authController } from "./controllers/AuthController";

router
  .use("/", LoginPage)
  .use("/sign-up", RegistrationPage)
  .use("/messenger", ChatsPage)
  .use("/settings", ProfilePage)
  .use("/settings/edit", EditProfilePage)
  .use("/settings/password", EditPasswordPage)
  .use("/500", Error500Page)
  .use("/404", Error404Page);

async function initApp() {
  const protectedPaths = [
    "/messenger",
    "/settings",
    "/settings/edit",
    "/settings/password",
  ];

  const path = window.location.pathname;

  if (protectedPaths.includes(path)) {
    const user = await authController.fetchUser();

    if (!user) {
      router.go("/");
      return;
    }
  }

  router.start();
}

initApp();
