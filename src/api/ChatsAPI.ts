import { BaseAPI } from "./BaseAPI";
import { HTTPTransport } from "../core/HTTPTransport";
import { API_BASE_URL } from "../config/api";

export const chatsHTTP = new HTTPTransport(API_BASE_URL + "/chats");

export type ChatItem = {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  last_message: null | {
    user: {
      first_name: string;
      second_name: string;
      avatar: string | null;
      email: string;
      login: string;
      phone: string;
    };
    time: string;
    content: string;
  };
};

export type CreateChatRequest = {
  title: string;
};

export type DeleteChatRequest = {
  chatId: number;
};

export type ManageChatUsersRequest = {
  users: number[];
  chatId: number;
};

export class ChatsAPI extends BaseAPI {
  public getChats(): Promise<XMLHttpRequest> {
    return chatsHTTP.get("");
  }

  public createChat(data: CreateChatRequest): Promise<XMLHttpRequest> {
    return chatsHTTP.post("", { data });
  }

  public deleteChat(data: DeleteChatRequest): Promise<XMLHttpRequest> {
    return chatsHTTP.delete("", { data });
  }

  public addUsers(data: ManageChatUsersRequest): Promise<XMLHttpRequest> {
    return chatsHTTP.put("/users", { data });
  }

  public deleteUsers(data: ManageChatUsersRequest): Promise<XMLHttpRequest> {
    return chatsHTTP.delete("/users", { data });
  }

  public getToken(chatId: number): Promise<XMLHttpRequest> {
    return chatsHTTP.post(`/token/${chatId}`);
  }

  public getUsers(chatId: number): Promise<XMLHttpRequest> {
    return chatsHTTP.get(`/${chatId}/users`);
  }
}
