import { ChatsAPI, type ChatItem } from "../api/ChatsAPI";
import { store } from "../core/storeInstance";
import { userAPI } from "./UserController";

export const chatsAPI = new ChatsAPI();

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

class ChatsController {
  public async createChat(title: string): Promise<void> {
    try {
      const xhr = await chatsAPI.createChat({ title });

      if (xhr.status === 200) {
        await this.fetchChats();
        return;
      }

      alert(getReason(xhr, "Не удалось создать чат"));
    } catch (e) {
      console.error("Network error while createChat", e);
      alert("Проблема с сетью. Попробуйте ещё раз.");
    }
  }

  public async fetchChats(): Promise<void> {
    try {
      const xhr = await chatsAPI.getChats();

      if (xhr.status === 200) {
        const chats = tryParseJSON<ChatItem[]>(xhr.responseText || "") ?? [];
        store.set("chats", chats);
        return;
      }

      alert(getReason(xhr, "Не удалось загрузить чаты"));
    } catch (e) {
      console.error("Network error while fetchChats", e);
      alert("Проблема с сетью. Попробуйте ещё раз.");
    }
  }

  public async deleteChat(chatId: number): Promise<void> {
    try {
      const xhr = await chatsAPI.deleteChat({ chatId });

      if (xhr.status === 200) {
        const selectedChatId =
          (store.getState().selectedChatId as number | null) ?? null;
        if (selectedChatId === chatId) {
          store.set("selectedChatId", null);
        }

        await this.fetchChats();
        return;
      }

      alert(getReason(xhr, "Не удалось удалить чат"));
    } catch (e) {
      console.error("Network error while deleteChat", e);
      alert("Проблема с сетью. Попробуйте ещё раз.");
    }
  }

  public async addUserByLogin(chatId: number, login: string): Promise<void> {
    try {
      const searchXhr = await userAPI.searchUser({ login });

      if (searchXhr.status !== 200) {
        alert(getReason(searchXhr, "Не удалось найти пользователя"));
        return;
      }

      const users =
        tryParseJSON<Array<{ id: number; login: string }>>(
          searchXhr.responseText || ""
        ) ?? [];
      const found = users[0];

      if (!found) {
        alert("Пользователь не найден");
        return;
      }

      const addXhr = await chatsAPI.addUsers({ chatId, users: [found.id] });

      if (addXhr.status === 200) {
        alert(`Пользователь ${found.login} добавлен`);
        await this.fetchChatUsers(chatId);
        return;
      }

      alert(getReason(addXhr, "Не удалось добавить пользователя в чат"));
    } catch (e) {
      console.error("Network error while addUserByLogin", e);
      alert("Проблема с сетью. Попробуйте ещё раз.");
    }
  }

  public async fetchChatUsers(chatId: number): Promise<void> {
    try {
      const xhr = await chatsAPI.getUsers(chatId);

      if (xhr.status === 200) {
        const users =
          tryParseJSON<Array<{ id: number; login: string }>>(
            xhr.responseText || ""
          ) ?? [];
        console.log("Chat users:", users);
        alert(
          `Пользователи в чате: ${
            users.map((u) => u.login).join(", ") || "пусто"
          }`
        );
        return;
      }

      alert(getReason(xhr, "Не удалось получить пользователей чата"));
    } catch (e) {
      console.error("Network error while fetchChatUsers", e);
      alert("Проблема с сетью. Попробуйте ещё раз.");
    }
  }

  public async removeUserByLogin(chatId: number, login: string): Promise<void> {
    try {
      const searchXhr = await userAPI.searchUser({ login });

      if (searchXhr.status !== 200) {
        alert(getReason(searchXhr, "Не удалось найти пользователя"));
        return;
      }

      const users =
        tryParseJSON<Array<{ id: number; login: string }>>(
          searchXhr.responseText || ""
        ) ?? [];
      const found = users[0];

      if (!found) {
        alert("Пользователь не найден");
        return;
      }

      const delXhr = await chatsAPI.deleteUsers({ chatId, users: [found.id] });

      if (delXhr.status === 200) {
        console.log(`User ${found.login} removed from chat ${chatId}`);
        await this.fetchChatUsers(chatId); 
        return;
      }

      alert(getReason(delXhr, "Не удалось удалить пользователя из чата"));
    } catch (e) {
      console.error("Network error while removeUserByLogin", e);
      alert("Проблема с сетью. Попробуйте ещё раз.");
    }
  }
}

export const chatsController = new ChatsController();
