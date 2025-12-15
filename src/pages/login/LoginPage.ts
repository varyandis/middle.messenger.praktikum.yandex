import Handlebars from "handlebars";
import { authController } from "../../controllers/AuthController";
import { Block } from "../../core/Block";
import { showFieldError } from "../../utils/showFieldError";
import { validateField } from "../../utils/validation";
import "./login.css";
import template from "./login.hbs?raw";
import { router } from "../../core/routerInstance";

export class LoginPage extends Block {
  constructor() {
    super("div", {
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;

          const link = target.closest(
            'a[href="/sign-up"]'
          ) as HTMLAnchorElement | null;
          if (link) {
            e.preventDefault();
            router.go("/sign-up");
            return;
          }
        },

        blur: (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (!target.classList.contains("form-input")) return;

          const name = target.name;
          const value = target.value;

          const result = validateField(name, value);
          showFieldError(target, result);
        },

        submit: (e: Event) => {
          const form = e.target as HTMLFormElement;
          if (form.name !== "login") return;

          e.preventDefault();
          e.stopPropagation();

          const inputs =
            form.querySelectorAll<HTMLInputElement>("input.form-input");
          let isFormValid = true;

          inputs.forEach((input) => {
            const { name, value } = input;
            const result = validateField(name, value);

            showFieldError(input, result);

            if (!result.isValid) {
              isFormValid = false;
            }
          });

          if (!isFormValid) return;

          const formData = new FormData(form);
          const raw = Object.fromEntries(formData.entries());

          const data = {
            login: String(raw.login),
            password: String(raw.password),
          };

          void authController.signin(data);
        },
      },
    });
  }

  render(): string {
    return Handlebars.compile(template)({});
  }
}
