import { GameInfo, APIResponse, ContactAPIProps } from "../types";

export default class Janus {

  static BASE_URL = "http://127.0.0.1:17777/api/";

  static async LOGIN(id: number) {
    return this.contactAPI<GameInfo>({
      url: `auth/${id}`,
      method: "GET",
      authorizationRequired: false
    });
  }

  static async GET_GAME(id: number) {
    return this.contactAPI<GameInfo>({
      url: `vg/`,
      method: "POST",
      authorizationRequired: false,
      body: {id: id }
    });
  }

  static async SEARCH_GAMES(query: string, offset: number = 0) {
    return this.contactAPI<GameInfo[]>({
      url: `vg/search`,
      method: "POST",
      authorizationRequired: false,
      body: {query: query, offset: offset},
      print: true
    });
  }

  /** Contact the Vault API */
  private static async contactAPI<T>(props: ContactAPIProps): Promise<APIResponse<T>> {
    // The default response
    let result: APIResponse<T> = { data: {} as T, success: false, message: "" };

    try {
      // Extract the request options from the props
      const { method, body = undefined, authorizationRequired = true, upload = null, url = "", loggingIn = false} = props;
      // Get the session key
      let sessionKey: string | null = window.localStorage.getItem('key');
      // A request can be made if authorization is not required or a session key has been located
      if(!authorizationRequired || (sessionKey != null && authorizationRequired)) {
        // Format request options for the request 
        let requestOptions: RequestInit = { 
          method: method, 
          headers: { 
            "Content-Type": "application/json", 
            ...((sessionKey != null && authorizationRequired) ? {authorization: sessionKey} : {})
          },
          body: (body ? JSON.stringify(body) : undefined),
          mode: 'cors'
        };
        // Print request options to console for debudding
        if (props.print) {
          console.log(Janus.BASE_URL + url);
          console.log(JSON.stringify(requestOptions, null, "  "));
        } 
        // Wait for the server to respond
        let response: Response = await fetch(Janus.BASE_URL + url, requestOptions);

        // Print response to console for debugging
        if(props.print) {
          console.log(response);
        }
        
        // If logging in, save session key
        if (loggingIn) {
          let key = response.headers?.get('Authorization');
          console.log(`Recieved key: ${key}`);
          if(key != null) window.localStorage.setItem('key', key);
        }
        // jsonify the response
        let json = await response.json();
        // Check to see if we are authorized in making the request
        if (json.message === "Unauthorized") {
            throw new Error('Unauthorized');
        }
        else {
          // Put response in result
          result.data = json.data;
          result.success = json.success;
          result.message = json.message;
        }
      }
      // This runs if authorization is required, but we do not have a session key
      else {
        throw new Error('Unauthorized');
      }
    } 
    catch (error: any) { 
      // Failure means no internet connection, no response from server, or unauthorized
      if (error.message === 'Unauthorized'){
        console.log('Not allowed to do that.');
      }
      else if (!navigator.onLine) {
        console.log('No internet connection.');
      } 
      else {
        console.log('Could not reach the server.');
        console.log(error);
      }
    }
    // Return the result
    return result;
  }

}
