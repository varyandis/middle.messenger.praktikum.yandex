import { Block, type Props } from "../../core/Block";
import Handlebars from "handlebars";
import template from "./editProfile.hbs?raw";
import "./editProfile.css";
import { validateField } from "../../utils/validation";
import { showFieldError } from "../../utils/showFieldError";
import { router } from "../../core/routerInstance";
import { store } from "../../core/storeInstance";
import { userController } from "../../controllers/UserController";
import type { UpdateProfileRequest } from "../../api/UserAPI";
import type { User } from "../../controllers/AuthController";
import { API_BASE_URL } from "../../config/api";

interface EditProfileProps extends Props {
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  display_name?: string;
  phone: string;
  avatarUrl: string;
}

const getUserProps = (): EditProfileProps => {
  const user = store.getState().user as User | undefined;

  const avatarUrl = user?.avatar
    ? `${API_BASE_URL}/resources${user.avatar}`
    : "";

  return {
    email: user?.email ?? "",
    login: user?.login ?? "",
    first_name: user?.first_name ?? "",
    second_name: user?.second_name ?? "",
    display_name: user?.display_name ?? "",
    phone: user?.phone ?? "",
    avatarUrl,
  };
};

export class EditProfilePage extends Block<EditProfileProps> {
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
            router.go("/settings");
            return;
          }
        },

        blur: (e: Event) => {
          const target = e.target as HTMLInputElement | null;
          if (!target || !target.classList.contains("form-input")) return;

          const { name, value } = target;
          const result = validateField(name, value);
          showFieldError(target, result);
        },

        change: async (e: Event) => {
          const target = e.target as HTMLInputElement | null;
          if (!target || target.name !== "avatar") return;

          const file = target.files?.[0];
          if (!file) return;

          const formData = new FormData();
          formData.append("avatar", file);

          await userController.updateAvatar(formData);

          target.value = "";
        },

        submit: async (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          const form = e.target as HTMLFormElement;
          if (form.name !== "editProfile") return;

          const inputs =
            form.querySelectorAll<HTMLInputElement>("input.form-input");
          let isFormValid = true;

          inputs.forEach((input) => {
            const { name, value } = input;
            const result = validateField(name, value);

            if (!result.isValid) isFormValid = false;
            showFieldError(input, result);
          });

          if (!isFormValid) return;

          const formData = new FormData(form);
          const data = Object.fromEntries(formData.entries()) as Record<
            string,
            string
          >;

          const payload: UpdateProfileRequest = {
            email: data.email,
            login: data.login,
            first_name: data.first_name,
            second_name: data.second_name,
            display_name: data.display_name || "",
            phone: data.phone,
          };

          await userController.updateProfile(payload);

          router.go("/settings");
        },
      },
    });
    store.onUpdated(this.handleStoreUpdate);
  }

  public render(): string {
    return Handlebars.compile(template)(this.props);
  }
}
