import { BaseAPI } from "./BaseAPI";
import { HTTPTransport } from "../core/HTTPTransport";
import { API_BASE_URL } from "../config/api";

const userHTTP = new HTTPTransport(API_BASE_URL + "/user");

export type UpdateProfileRequest = {
  first_name: string;
  second_name: string;
  display_name?: string;
  login: string;
  email: string;
  phone: string;
};

export type UpdatePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export class UserAPI extends BaseAPI {
  public updateProfile(data: UpdateProfileRequest): Promise<XMLHttpRequest> {
    return userHTTP.put("/profile", { data });
  }

  public updatePassword(data: UpdatePasswordRequest): Promise<XMLHttpRequest> {
    return userHTTP.put("/password", { data });
  }

  public updateAvatar(data: FormData): Promise<XMLHttpRequest> {
    return userHTTP.put("/profile/avatar", { data });
  }
}
