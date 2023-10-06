import { ContactAPIProps, APIResponse, GameInfo } from "../types";
import { Janus } from ".";
import { Game } from "../classes";

export default class Utility {

  /** Get time of day of this timestamp. Ex - 4:32 PM. */
  static getTimeOfDay(timestamp: number): string {
    // Extract the hour and minute from the given timestamp
    let time = new Date(timestamp);
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let suffix = time.getHours() >= 12 ? 'PM' : 'AM'; 
    // Find current hour in AM-PM Format. 
    hours = hours % 12;  
    // To display "0" as "12" from the last line
    if(hours == 0) hours = 12;
    // Return the result
    return (hours) + ':' + (minutes < 10 ? ("0" + minutes) : minutes) + ' ' + suffix;
  }
  
  /** Get the day of this timestamp. Ex - Today, Yesterday, Monday, 11/21/2020, etc.  */
  static getRelativeDay(timestamp?: number) {
    if (!timestamp) return "";
    // Extract info from the current date
    let t = new Date(timestamp * 1000);
    let date = t.getDate();
    let dayOfWeek = (t.toString().split(' ')[0]);
    let month = t.getMonth() + 1;
    let year = t.getFullYear();
    // convert day of week to full string
    if(dayOfWeek ==  "Mon") dayOfWeek = "Monday";
    else if(dayOfWeek ===  "Tue") dayOfWeek = "Tuesday";
    else if(dayOfWeek ===  "Wed") dayOfWeek = "Wednesday";
    else if(dayOfWeek ===  "Thu") dayOfWeek = "Thursday";
    else if(dayOfWeek ===  "Fri") dayOfWeek = "Friday";
    else if(dayOfWeek ===  "Sat") dayOfWeek = "Saturday";
    else dayOfWeek = "Sunday";
    // Check to see if the current time is close to the given timestamp 
    let currentTime = new Date();
    let isClose = year === currentTime.getFullYear() && month === (currentTime.getMonth() + 1);
    // Return a special date if we are within the same week as the given timestamp
    if (isClose) {
      if(date === currentTime.getDate()) return "Today";
      else if(date === currentTime.getDate() - 1) return "Yesterday";
      else if( date >= (currentTime.getDate() - 7)) return dayOfWeek;
    }
    // if we are not close in time, return a basic timestamp format
    return (month + "/" + date + "/" + year);
  }

  /** Get a greeting depending on the time of day. Ex - Good Afternoon. */
  static getGreeting() {
    // Extract info from the current time
    let time = Utility.getTimeOfDay(new Date().getTime());
    let isAm = time.endsWith("AM");
    let colonPosition = time[2] === ":" ? 2 : 1;
    let hour = Number.parseInt(time.substring(0,colonPosition));
    // Give specific greetings for the morning
    if(isAm) {
    if(hour === 12) return "Time for bed";
    else if(hour < 4) return "Go Sleep";
    return "Good Morning";
    } 
    // And other greetings for the night.
    else {
    if(hour === 12 || hour < 4) return "Good Afternoon";
    else if(hour < 8) return "Good Evening";
    else return "Goodnight";
    }
  }

  /** Get the shade of a given hex value. Amount is a number from 0-100. Default is 30.  */
  static getShade (hex: string, amount: number = 30) {
    // Ensure amount is within the proper bounds
    if (amount > 100) amount = 100;
    if (amount < 0) amount = 0;
    // Extract the r,g,b values from the given hex value
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    // Get the shade amount
    let shadowAmount = amount / 100;
    // Calculated the new r,g,b values
    let newR = (Math.floor(r * shadowAmount)).toString(16);
    let newG = (Math.floor(g * shadowAmount)).toString(16);
    let newB = (Math.floor(b * shadowAmount)).toString(16);
    // Ensure each value is two characters long
    if(newR.length === 1) newR = "0" + newR;
    if(newB.length === 1) newB = "0" + newB;
    if(newG.length === 1) newG = "0" + newG;
    // Return the shade color
    return "#" + newR + newG + newB;
  }

  /** Get the tint of a given hex value. Amount is a number from 0-100. Default is 30.  */
  static getTint (hex: string, amount: number = 30) {
    // Ensure amount is within the proper bounds
    if (amount > 100) amount = 100;
    if (amount < 0) amount = 0;
    // Extract the r,g,b values from the given hex value
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    // Get the tint amount
    let tintAmount = amount / 100;
    // Calculated the new r,g,b values
    let newR = (r + Math.floor((256 - r) * tintAmount)).toString(16);
    let newG = (g + Math.floor((256 - g) * tintAmount)).toString(16);
    let newB = (b + Math.floor((256 - b) * tintAmount)).toString(16);
    // Ensure each value is two characters long
    if(newR.length === 1) newR = "0" + newR;
    if(newB.length === 1) newB = "0" + newB;
    if(newG.length === 1) newG = "0" + newG;
    // Return the tint color
    return "#" + newR + newG + newB;
  }

  /** Contact the Vault API */
  static async contactAPI<T>(props: ContactAPIProps): Promise<APIResponse<T>> {
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
            ...((sessionKey != null) ? {authorization: sessionKey} : {})
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
        // If logging in, save session key
        if (loggingIn) {
          let key = response.headers?.get('Authorization');
          console.log(`Recieved key: ${key}`);
          if(key != null) window.localStorage.setItem('key', key);
        }
        // jsonify the response
        let json = await response.json();
        if(props.print) console.log(json.data)
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

  /** Print the size of the cache.  */
  static printCacheSize() {
    const usedStorage = Object.keys(localStorage).map(key => {
      return window.localStorage[key].length * 2; // string data, multiply by 2 for UTF-16 encoding
    }).reduce((acc, cur) => acc + cur, 0);
    console.log(`Total Storage: ${usedStorage} bytes`);
  }

  /** Add a game to the cache. */
  static addToCache(game: Game, toCollection: boolean = true) {
    // Get the cache
    let cache = toCollection ? window.localStorage.getItem('collection') : window.localStorage.getItem('wishlist');
    if (cache) {
      // Extract the info from the string
      let info: GameInfo[] = JSON.parse(cache);
      // Add the game to the list
      info = info.concat(game.getInfo());
      // Sort the games by id after adding a new game
      let sortedInfo = [...info].sort((a, b) => a.id - b.id);
      // Put the sorted info back in the cache
      window.localStorage.setItem(toCollection ? 'collection' : 'wishlist', JSON.stringify(sortedInfo));
    }
    else {
      // Create the cache since it does not exist
      window.localStorage.setItem(toCollection ? 'collection' : 'wishlist', JSON.stringify([game.getInfo()]));
    }
  }

  /** Remove a game to the cache. */
  static removeFromCache(game: Game, fromCollection: boolean = true) {
    // Get the cache
    let cache = fromCollection ? window.localStorage.getItem('collection') : window.localStorage.getItem('wishlist');
    if (cache) {
      // Extract the info from the string
      let info: GameInfo[] = JSON.parse(cache);
      // Remove the game from the list
      let index = -1;
      for (let i = 0; i < info.length; i++) {
        if (info[i].id === game.getID()) {
          index = i;
          break;
        }
      }
      info = info.slice(0, index).concat(info.slice(index+1));
      // Put the sorted info back in the cache
      window.localStorage.setItem(fromCollection ? 'collection' : 'wishlist', JSON.stringify(info));
    }
  }

}

