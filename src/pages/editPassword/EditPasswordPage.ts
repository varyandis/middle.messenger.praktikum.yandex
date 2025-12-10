import { Block } from "../../core/Block";
import { Router } from "../../core/Router";
import { showFieldError } from "../../utils/showFieldError";
import { validateField } from "../../utils/validation";
import "./editPassword.css";
import template from "./editPassword.hbs?raw";
import Handlebars from "handlebars";

const router = new Router("#app");

export class EditPasswordPage extends Block {
  constructor() {
    super("div", {
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;

          const backButton = target.closest(
            ".back__button"
          ) as HTMLButtonElement | null;
          if (backButton) {
            e.preventDefault();
            router.go("/settings");
            return;
          }
        },
        
        blur: (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (!target.classList.contains("form-input")) return;

          const name = target.name;
          const value = target.value;

          const validationName = mapNameForValidation(name);
          const result = validateField(validationName, value);

          showFieldError(target, result);
        },

        submit: (e: Event) => {
          const form = e.target as HTMLFormElement;
          if (form.name !== "changePassword") return;

          e.preventDefault();

          const inputs =
            form.querySelectorAll<HTMLInputElement>("input.form-input");

          let isFormValid = true;

          inputs.forEach((input) => {
            const validationName = mapNameForValidation(input.name);
            const result = validateField(validationName, input.value);
            if (!result.isValid) {
              isFormValid = false;
            }
            showFieldError(input, result);
          });

          const newPasswordInput = form.querySelector<HTMLInputElement>(
            'input[name="newPassword"]'
          );
          const repeatInput = form.querySelector<HTMLInputElement>(
            'input[name="newPassword_repeat"]'
          );

          if (newPasswordInput && repeatInput) {
            if (newPasswordInput.value !== repeatInput.value) {
              isFormValid = false;
              showFieldError(repeatInput, {
                isValid: false,
                error: "Пароли должны совпадать",
              });
            }
          }

          if (!isFormValid) return;

          const formData = new FormData(form);
          const raw = Object.fromEntries(formData.entries());
          console.log("Изменение пароля:", raw);
        },
      },
    });

    function mapNameForValidation(name: string): string {
      if (name === "oldPassword" || name === "newPassword") {
        return "password";
      }
      if (name === "newPassword_repeat") {
        return "password_repeat";
      }
      return name;
    }
  }

  render(): string {
    return Handlebars.compile(template)({});
  }
}
