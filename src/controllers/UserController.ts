import {
  UserAPI,
  type UpdatePasswordRequest,
  type UpdateProfileRequest,
} from "../api/UserAPI";
import { store } from "../core/storeInstance";
import type { User } from "./AuthController";

const userAPI = new UserAPI();

function tryParseJSON<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function getReason(xhr: XMLHttpRequest, fallback: string): string {
  const parsed = tryParseJSON<{ reason?: string }>(xhr.responseText || "");
  return parsed?.reason || fallback;
}

class UserController {
  public async updateProfile(data: UpdateProfileRequest): Promise<void> {
    try {
      const xhr = await userAPI.updateProfile(data);

      if (xhr.status === 200) {
        const user = tryParseJSON<User>(xhr.responseText || "");
        if (user) store.set("user", user);
        return;
      }

      const msg = getReason(xhr, "Не удалось обновить профиль");
      console.error(msg);
      alert(msg);
    } catch (e) {
      console.error("Network error while updateProfile", e);
      alert("Проблема с сетью. Попробуйте ещё раз.");
    }
  }

  public async updatePassword(data: UpdatePasswordRequest): Promise<void> {
    try {
      const xhr = await userAPI.updatePassword(data);

      if (xhr.status === 200) {
        return;
      }

      const msg = getReason(xhr, "Не удалось обновить пароль");
      console.error(msg);
      alert(msg);
    } catch (e) {
      console.error("Network error while updatePassword", e);
      alert("Проблема с сетью. Попробуйте ещё раз.");
    }
  }

  public async updateAvatar(formData: FormData): Promise<void> {
    try {
      const xhr = await userAPI.updateAvatar(formData);

      if (xhr.status === 200) {
        const user = tryParseJSON<User>(xhr.responseText || "");
        if (user) store.set("user", user);
        return;
      }

      const msg = getReason(xhr, "Не удалось обновить аватар");
      console.error(msg);
      alert(msg);
    } catch (e) {
      console.error("Network error while updateAvatar", e);
      alert("Проблема с сетью. Попробуйте ещё раз.");
    }
  }
}

export const userController = new UserController();
