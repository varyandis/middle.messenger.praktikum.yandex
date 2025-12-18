import { BaseAPI } from "./BaseAPI";
import { HTTPTransport } from "../core/HTTPTransport";
import { API_BASE_URL } from "../config/api";

const authHTTP = new HTTPTransport(API_BASE_URL + "/auth");

export type SignUpRequest = {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  phone: string;
  password: string;
};

export type SignInRequest = {
  login: string;
  password: string;
};

export class AuthAPI extends BaseAPI {
  public signup(data: SignUpRequest): Promise<XMLHttpRequest> {
    return authHTTP.post("/signup", { data });
  }

  public signin(data: SignInRequest): Promise<XMLHttpRequest> {
    return authHTTP.post("/signin", { data });
  }

  public logout(): Promise<XMLHttpRequest> {
    return authHTTP.post("/logout");
  }

  public getUser(): Promise<XMLHttpRequest> {
    return authHTTP.get("/user");
  }
}
