import { GameInfo, UserInfo, PicNames, TriviaInfo } from "../types";
import { Utility}  from ".";
import { User } from "../classes";
import config from '../../../config.json';

export default class Janus {

  // static BASE_URL = `http://mygamesvault.com/api/`;
  static BASE_URL = `http://${config.host}:${config.port}/api/`;

  //#region vg
  static async SEARCH_GAMES(query: string, offset: number = 0) {
    let urlParams = `query=${query}` + `&offset=${offset}`;
    return Utility.contactAPI<GameInfo[]>({
      url: `vg/search?` + urlParams,
      method: "GET",
      authorizationRequired: false
    });
  }
  //#endregion

  //#region auth
  static async LOGIN(email: string, password: string) {
    return Utility.contactAPI<UserInfo>({
      url: `auth/login`,
      method: "POST",
      authorizationRequired: false,
      body: {email: email, password: password},
      loggingIn: true,
      print: true
    });
  }

  static async LOGOUT() {
    // Remove the session key from local secured storage
    window.localStorage.removeItem('key');
    // contacy the server
    return await Utility.contactAPI<{}>({
      method: "POST",
      url: `auth/logout`,
    });
  }

  static async CREATE_ACCOUNT(email: string, password: string, name: string) {
    return Utility.contactAPI<UserInfo>({
      url: `auth/create`,
      method: "POST",
      authorizationRequired: false,
      body: {email: email, password: password, name: name}
    });
  }
  //#endregion

  //#region user
  /** Get the user's info from the server */
  static async GET_ME() {
    return Utility.contactAPI<UserInfo>({
      method: "GET",
      url: `user/me`,
      print: true
    });
  }

  /** Send the user's updated info to the server */
  static async PATCH_ME(data: {picture: PicNames, name: string, color: string}) {
    return Utility.contactAPI<{}>({
      method: "PATCH",
      url: `user/me`,
      body: data,
    });
  }
  //#endregion

  //#region list

  static async GET_COLLECTION(user: User, offset: number = 0) {
    let urlParams = `?&offset=${offset}`;
    let idPath = user.getID() === User.me?.getID() ? "" : `/${user.getID()}`
    return Utility.contactAPI<GameInfo[]>({
      url: `list/collection` + idPath + urlParams,
      method: "GET",
      print: true
    });
  }

  static async GET_WISHLIST(user: User, offset: number = 0) {
    let urlParams = `?&offset=${offset}`;
    let idPath = user.getID() === User.me?.getID() ? "" : `/${user.getID()}`
    return Utility.contactAPI<GameInfo[]>({
      url: `list/wishlist` + idPath + urlParams,
      method: "GET"
    });
  }

  static async GET_FRIENDS(offset: number = 0) {
    let urlParams = `&offset=${offset}`;
    return Utility.contactAPI<UserInfo[]>({
      url: `list/friends?` + urlParams,
      method: "GET",
      print: true
    });
  }

  static async ADD_TO_COLLECTION(id: number) {
    return Utility.contactAPI<{}>({
      url: `list/collection`,
      method: "POST",
      body: {id: id}
    });
  }

  static async ADD_TO_WISHLIST(id: number) {
    return Utility.contactAPI<{}>({
      url: `list/wishlist`,
      method: "POST",
      body: {id: id}
    });
  }

  static async ADD_TO_FRIENDS(code: string) {
    return Utility.contactAPI<UserInfo>({
      url: `list/friends`,
      method: "POST",
      body: {code: code}
    });
  }

  static async REMOVE_FROM_COLLECTION(id: number) {
    return Utility.contactAPI<{}>({
      url: `list/collection`,
      method: "DELETE",
      body: {id: id}
    });
  }

  static async REMOVE_FROM_WISHLIST(id: number) {
    return Utility.contactAPI<{}>({
      url: `list/wishlist`,
      method: "DELETE",
      body: {id: id}
    });
  }

  static async REMOVE_FROM_FRIENDS(id: number) {
    return Utility.contactAPI<{}>({
      url: `list/friends`,
      method: "DELETE",
      body: {id: id}
    });
  }

  //#endregion

  //#region trivia
  static async GET_TRIVIA(): Promise<TriviaInfo> {
    let requestOptions: RequestInit = { 
      method: 'GET', 
      headers: { 
        "Content-Type": "application/json", 
      },
      mode: 'cors'
    };
    // Wait for the server to respond
    let response: Response = await fetch("https://opentdb.com/api.php?amount=1&category=15");
    let json = await response.json();
    return json.results[0];
  }
  //#endregion

}
