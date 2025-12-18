import Handlebars from "handlebars";
import { authController, type User } from "../../controllers/AuthController";
import { Block } from "../../core/Block";
import "./profile.css";
import template from "./profile.hbs?raw";
import { router } from "../../core/routerInstance";
import { store } from "../../core/storeInstance";
import { API_BASE_URL } from "../../config/api";


const getUserProps = () => {
  const user = store.getState().user as User | undefined;
  const avatarUrl = user?.avatar
    ? `${API_BASE_URL}/resources${user.avatar}`
    : "";

  return {
    name: user?.first_name ?? "",
    email: user?.email ?? "",
    login: user?.login ?? "",
    first_name: user?.first_name ?? "",
    second_name: user?.second_name ?? "",
    display_name: user?.display_name ?? "",
    phone: user?.phone ?? "",
    avatarUrl,
  };
};

export class ProfilePage extends Block {
  private handleStoreUpdate = () => {
    this.setProps(getUserProps());
  };

  constructor() {
    super("div", {
      ...getUserProps(),
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;

          const backButton = target.closest(
            ".back__button"
          ) as HTMLButtonElement | null;
          if (backButton) {
            e.preventDefault();
            router.go("/messenger");
            return;
          }

          const actionLink = target.closest(
            ".profile__action"
          ) as HTMLAnchorElement | null;
          if (!actionLink) return;

          e.preventDefault();
          const href = actionLink.getAttribute("href");

          if (href === "/settings/edit") return router.go("/settings/edit");
          if (href === "/settings/password")
            return router.go("/settings/password");
          if (href === "/") return void authController.logout();
        },
      },
    });

    store.onUpdated(this.handleStoreUpdate);
  }

  render(): string {
    return Handlebars.compile(template)(this.props);
  }
}
