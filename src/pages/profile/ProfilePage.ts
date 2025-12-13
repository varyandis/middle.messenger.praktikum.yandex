import Handlebars from "handlebars";
import { authController } from "../../controllers/AuthController";
import { Block } from "../../core/Block";
import "./profile.css";
import template from "./profile.hbs?raw";
import { router } from "../../core/routerInstance";

export class ProfilePage extends Block {
  constructor() {
    super("div", {
      name: "Иван",
      email: "pochta@yandex.ru",
      login: "ivanivanov",
      first_name: "Иван",
      second_name: "Иванов",
      display_name: "Иван",
      phone: "+7 (909) 967 30 30",

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
          if (actionLink) {
            e.preventDefault();

            const href = actionLink.getAttribute("href");

            if (href === "/settings/edit") {
              router.go("/settings/edit");
              return;
            }

            if (href === "/settings/password") {
              router.go("/settings/password");
              return;
            }

            if (href === "/") {
              void authController.logout();
              return;
            }
          }
        },
      },
    });
  }

  render(): string {
    return Handlebars.compile(template)(this.props);
  }
}
