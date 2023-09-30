import { GameInfo, UserInfo, PicNames } from "../types";
import { Utility}  from ".";

export default class Janus {

  static BASE_URL = "http://127.0.0.1:17777/api/";

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
      loggingIn: true
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
    });
  }

  /** Send the user's updated info to the server */
  static async PATCH_ME(data: {picture: PicNames, name: string}) {
    return Utility.contactAPI<{}>({
      method: "PATCH",
      url: `user/me`,
      body: data,
    });
  }
  //#endregion

  //#region list
  static async GET_COLLECTION(wishedGames: boolean = false, offset: number = 0) {
    let urlParams = `&offset=${offset}` + `&wished=${wishedGames}`;
    return Utility.contactAPI<GameInfo[]>({
      url: `list/collection?` + urlParams,
      method: "GET"
    });
  }

  static async ADD_TO_COLLECTION(id: number, wished: boolean = false) {
    let urlParams = `&wished=${wished}`;
    return Utility.contactAPI<{}>({
      url: `list/collection?` + urlParams,
      method: "POST",
      body: {id: id}
    });
  }

  static async REMOVE_FROM_COLLECTION(id: number, wished: boolean = false) {
    let urlParams = `&wished=${wished}`;
    return Utility.contactAPI<{}>({
      url: `list/collection?` + urlParams,
      method: "DELETE",
      body: {id: id}
    });
  }

  //#endregion

  //#region trivia
  
  //#endregion

}
