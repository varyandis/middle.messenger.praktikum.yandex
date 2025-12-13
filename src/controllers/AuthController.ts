import {
  AuthAPI,
  type SignInRequest,
  type SignUpRequest,
} from "../api/AuthAPI";
import { router } from "../core/routerInstance";

const authAPI = new AuthAPI();

class AuthController {
  public async signin(data: SignInRequest): Promise<void> {
    try {
      const xhr = await authAPI.signin(data);

      if (xhr.status === 200) {
        router.go("/messenger");
      } else {
        let errorMessage = "Ошибка авторизации";

        try {
          const response = JSON.parse(xhr.responseText || "{}") as {
            reason?: string;
          };
          if (response.reason) {
            errorMessage = response.reason;
          }
        } catch {
          // если не JSON — оставляем дефолт
        }

        console.error(errorMessage);
        alert(errorMessage);
      }
    } catch (e) {
      console.error("Network error while signin", e);
      alert("Проблема с сетью. Попробуйте ещё раз.");
    }
  }

  public async signup(data: SignUpRequest): Promise<void> {
    try {
      const xhr = await authAPI.signup(data);

      if (xhr.status === 200) {
        router.go("/messenger");
      } else {
        let errorMessage = "Ошибка регистрации";

        try {
          const response = JSON.parse(xhr.responseText || "{}") as {
            reason?: string;
          };
          if (response.reason) {
            errorMessage = response.reason;
          }
        } catch {
          //
        }

        console.error(errorMessage);
        alert(errorMessage);
      }
    } catch (e) {
      console.error("Network error while signup", e);
      alert("Проблема с сетью. Попробуйте ещё раз.");
    }
  }

  public async logout(): Promise<void> {
    try {
      const xhr = await authAPI.logout();

      if (xhr.status === 200 || xhr.status === 401) {
        router.go("/");
        return;
      }

      console.error("Logout failed", xhr.status, xhr.responseText);
    } catch (e) {
      console.error("Network error while logout", e);
      router.go("/");
    }
  }

  public async fetchUser(): Promise<unknown> {
    try {
      const xhr = await authAPI.getUser();

      if (xhr.status === 200) {
        try {
          return JSON.parse(xhr.responseText);
        } catch {
          return null;
        }
      }

      return null;
    } catch (e) {
      console.error("Network error while getUser", e);
      return null;
    }
  }
}

export const authController = new AuthController();
