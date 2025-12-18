import { ChatsAPI, type ChatItem } from "../api/ChatsAPI";
import { store } from "../core/storeInstance";
import { userAPI } from "./UserController";
import { WSTransport } from "../core/WSTransport";

let ws: WSTransport | null = null;

export const chatsAPI = new ChatsAPI();

type WSChatMessage = {
  user_id: number;
  content: string;
  time: string;
  id?: number;
  type?: string;
};

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

function setMessagesForChat(chatId: number, next: WSChatMessage[]): void {
  const state = store.getState();
  const current =
    (state.messagesByChat as Record<number, WSChatMessage[]> | undefined) ?? {};

  store.set("messagesByChat", { ...current, [chatId]: next });
}

function addMessageToChat(chatId: number, msg: WSChatMessage): void {
  const state = store.getState();
  const current =
    (state.messagesByChat as Record<number, WSChatMessage[]> | undefined) ?? {};
  const prev = current[chatId] ?? [];

  store.set("messagesByChat", { ...current, [chatId]: [...prev, msg] });
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
          localStorage.removeItem("selectedChatId");
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

  public async fetchChatUsers(chatId: number): Promise<void> {
    try {
      const xhr = await chatsAPI.getUsers(chatId);

      if (xhr.status === 200) {
        const users =
          tryParseJSON<Array<{ id: number; login: string }>>(
            xhr.responseText || ""
          ) ?? [];
        console.log("Chat users:", users);
        return;
      }

      alert(getReason(xhr, "Не удалось получить пользователей чата"));
    } catch (e) {
      console.error("Network error while fetchChatUsers", e);
      alert("Проблема с сетью. Попробуйте ещё раз.");
    }
  }

  public async connectToChat(chatId: number): Promise<void> {
    try {
      const user = store.getState().user as { id: number } | null;
      if (!user) {
        alert("Нет пользователя. Перезайди.");
        return;
      }

      const tokenXhr = await chatsAPI.getToken(chatId);
      if (tokenXhr.status !== 200) {
        alert(getReason(tokenXhr, "Не удалось получить токен"));
        return;
      }

      const tokenObj = tryParseJSON<{ token: string }>(
        tokenXhr.responseText || ""
      );
      const token = tokenObj?.token;
      if (!token) {
        alert("Токен не получен");
        return;
      }

      ws?.close();

      const url = `wss://ya-praktikum.tech/ws/chats/${user.id}/${chatId}/${token}`;
      ws = new WSTransport(url);

      await ws.connect();

      ws.onMessage((data) => {
        if (Array.isArray(data)) {
          const history = data as WSChatMessage[];
          setMessagesForChat(chatId, history.slice().reverse());
          return;
        }

        if (data && typeof data === "object") {
          const msg = data as WSChatMessage;

          if (!msg.content || !msg.time || !msg.user_id) return;

          addMessageToChat(chatId, msg);
        }
      });

      ws.send({ type: "get old", content: "0" });
    } catch (e) {
      console.error("WS connect error", e);
      alert("Не удалось подключиться к WebSocket");
    }
  }

  public sendMessage(content: string): void {
    const text = content.trim();
    if (!text) return;

    ws?.send({ type: "message", content: text });
  }

  public disconnect(): void {
    ws?.close();
    ws = null;
  }
}

export const chatsController = new ChatsController();
