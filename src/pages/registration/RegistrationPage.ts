import Handlebars from "handlebars";
import { authController } from "../../controllers/AuthController";
import { Block } from "../../core/Block";
import { showFieldError } from "../../utils/showFieldError";
import { validateField } from "../../utils/validation";
import "./registration.css";
import template from "./registration.hbs?raw";
import { router } from "../../core/routerInstance";

export class RegistrationPage extends Block {
  constructor() {
    super("div", {
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;

          const link = target.closest(
            'a[href="/"]'
          ) as HTMLAnchorElement | null;
          if (link) {
            e.preventDefault();
            router.go("/");
            return;
          }
        },

        blur: (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (!target.classList.contains("form-input")) return;

          const { name, value } = target;
          const result = validateField(name, value);

          showFieldError(target, result);
        },

        submit: (e: Event) => {
          const form = e.target as HTMLFormElement;
          if (form.name !== "signup") return;

          e.preventDefault();
          e.stopPropagation();

          const inputs =
            form.querySelectorAll<HTMLInputElement>("input.form-input");
          let isFormValid = true;

          inputs.forEach((input) => {
            const { name, value } = input;
            const result = validateField(name, value);

            if (!result.isValid) {
              isFormValid = false;
            }

            showFieldError(input, result);
          });

          const passwordInput = form.querySelector<HTMLInputElement>(
            'input[name="password"]'
          );
          const passwordRepeatInput = form.querySelector<HTMLInputElement>(
            'input[name="password_repeat"]'
          );

          if (passwordInput && passwordRepeatInput) {
            if (passwordInput.value !== passwordRepeatInput.value) {
              isFormValid = false;
              showFieldError(passwordRepeatInput, {
                isValid: false,
                error: "Пароли должны совпадать",
              });
            }
          }

          if (!isFormValid) return;

          const formData = new FormData(form);
          const raw = Object.fromEntries(formData.entries());

          const data = {
            first_name: String(raw.first_name),
            second_name: String(raw.second_name),
            login: String(raw.login),
            email: String(raw.email),
            phone: String(raw.phone),
            password: String(raw.password),
          };

          void authController.signup(data);
        },
      },
    });
  }

  render(): string {
    return Handlebars.compile(template)({});
  }
}
