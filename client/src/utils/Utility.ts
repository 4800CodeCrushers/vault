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

}

