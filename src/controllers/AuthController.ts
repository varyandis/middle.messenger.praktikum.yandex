import {
  AuthAPI,
  type SignInRequest,
  type SignUpRequest,
} from "../api/AuthAPI";
import { router } from "../core/routerInstance";
import { store } from "../core/storeInstance";

const authAPI = new AuthAPI();

export type User = {
  id: number;
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  display_name?: string;
  phone: string;
  avatar?: string;
};

class AuthController {
  public async signin(data: SignInRequest): Promise<void> {
    try {
      const xhr = await authAPI.signin(data);

      if (xhr.status === 200) {
        const user = await this.fetchUser();
        if (user) {
          store.set("user", user);
        }

        router.go("/messenger");
        return;
      }

      let errorMessage = "Ошибка авторизации";

      try {
        const response = JSON.parse(xhr.responseText || "{}") as {
          reason?: string;
        };
        if (response.reason) errorMessage = response.reason;
      } catch {
        //
      }

      console.error(errorMessage);
      alert(errorMessage);
    } catch (e) {
      console.error("Network error while signin", e);
      alert("Проблема с сетью. Попробуйте ещё раз.");
    }
  }

  public async signup(data: SignUpRequest): Promise<void> {
    try {
      const xhr = await authAPI.signup(data);

      if (xhr.status === 200) {
        const user = await this.fetchUser();
        if (user) {
          store.set("user", user);
        }

        router.go("/messenger");
        return;
      }

      let errorMessage = "Ошибка регистрации";

      try {
        const response = JSON.parse(xhr.responseText || "{}") as {
          reason?: string;
        };
        if (response.reason) errorMessage = response.reason;
      } catch {
        //
      }

      console.error(errorMessage);
      alert(errorMessage);
    } catch (e) {
      console.error("Network error while signup", e);
      alert("Проблема с сетью. Попробуйте ещё раз.");
    }
  }

  public async logout(): Promise<void> {
    try {
      const xhr = await authAPI.logout();

      if (xhr.status === 200 || xhr.status === 401) {
        store.set("user", null); 
        router.go("/");
        return;
      }

      console.error("Logout failed", xhr.status, xhr.responseText);
    } catch (e) {
      console.error("Network error while logout", e);
      store.set("user", null);
      router.go("/");
    }
  }

  public async fetchUser(): Promise<User | null> {
    try {
      const xhr = await authAPI.getUser();

      if (xhr.status === 200) {
        try {
          return JSON.parse(xhr.responseText) as User;
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
