import { Block } from "../../core/Block";
import "./error404.css";
import template from "./error404.hbs?raw";
import Handlebars from "handlebars";
import { Router } from "../../core/Router";

const router = new Router("#app");

export class Error404Page extends Block {
  constructor() {
    super("div", {
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;

          const link = target.closest(
            ".error-page__link"
          ) as HTMLAnchorElement | null;
          if (link) {
            e.preventDefault();
            router.go("/messenger");
            return;
          }
        },
      },
    });
  }

  render(): string {
    return Handlebars.compile(template)({});
  }
}
