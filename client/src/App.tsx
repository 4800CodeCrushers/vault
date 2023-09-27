import { CSSProperties, useEffect, useRef, useState } from "react";
import { MainScreen } from "./components";
import { Screens, Styles } from "./types";
import { Janus, Utility } from "./utils";

function App() {

  let key = window.localStorage.getItem('key'); // Get the session key from local storage
  const [screen, setScreen] = useState<Screens>(key ? "main" : "main"); // Set the start screen based on if the key exists
  
  return (
    <div style = {styles.screen}>
      { screen === "main" && <MainScreen/>}
    </div>
  );

}

let styles: Styles = {
  screen: {
    height: '100vh',
    background: `linear-gradient(${Utility.getTint('#0e0e0e', 15)}, #0e0e0e)`,
  }
}


export default App;
