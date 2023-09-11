import { GameInfo } from "../types/classes";

export default class Janus {

  static BASE_URL = "http://127.0.0.1:17777/";

  static async GET_GAME(id: number) {
    return this.contactAPI<GameInfo>({
      url: `vg/${id}`,
      method: "GET",
      authorizationRequired: false
    });
  }

  static async SEARCH_GAME(query: string) {
    return this.contactAPI<GameInfo>({
      url: `vg/`,
      method: "POST",
      authorizationRequired: false,
      body: {query: query}
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
      }
    }
    // Return the result
    return result;
  }

}



type ContactAPIProps = {
	/** The url to get data from. Default is an empty string. */
	url: string,
	/** What request method to use. Default is "GET" */
	method: "POST" | "DELETE" | "PATCH" | "GET" | "PUT",
	/** The item to upload. Default is null. */
	upload?: any, 
	/** Print the contact process for debugging. Default is false. */
	print?: boolean,
	/** Is a session key required to make this request  Default is true. */
	authorizationRequired?: boolean,
	/** The request body. Default is undefined.  */
	body?: any,
	/** Are we logging in? Used to make sure we extract the session key.  */
  loggingIn?: boolean
}

type APIResponse<T> = {
	/** The reponse data */
	data: T,
	/** Was the response a success? */
	success: boolean,
	/** The message of the response */
	message: string,
}