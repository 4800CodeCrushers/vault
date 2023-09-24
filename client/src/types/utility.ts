import { CSSProperties } from "react";

export type Styles = {
  /** The CSS props associated with a key. */
  [key: string]: CSSProperties;
};

export type ContactAPIProps = {
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

export type APIResponse<T> = {
	/** The reponse data */
	data: T,
	/** Was the response a success? */
	success: boolean,
	/** The message of the response */
	message: string,
}
