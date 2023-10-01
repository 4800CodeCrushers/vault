import { CSSProperties, useEffect, useRef, useState } from "react";
import { MainScreen, LandingScreen } from "./components";
import { Screens, Styles } from "./types";
import { Janus, State, Utility } from "./utils";
import { User } from "./classes";

function App() {
  // Get the session key from local storage
  let key = window.localStorage.getItem('key'); 
  // Set the start screen based on if the key exists
  const [screen, setScreen] = useState<Screens>(key ? "loading" : "landing");

  useEffect(() => {
     // Get the user while the loading screen is shown
    if (screen === "loading") getMe();
  }, []);

  // Get the user from the server
  async function getMe() {
    // Get data from the server
    let response = await Janus.GET_ME();
    if (response.success) {
      User.me = new User(response.data);
    }
    else {
      // Remove the session key from local secured storage
      window.localStorage.removeItem('key');
    }
    // Delay transition from loading screen to see its beauty 
    setTimeout(() => {
      setScreen(response.success ? 'main' : 'landing');
    }, 500);
  }
  // Log the user out 
  async function logout() {
    await Janus.LOGOUT();
    setScreen("landing");
    State.loadedGames = [];
    State.query = "";
    State.creatingAccount = false;
    User.me = null;
  }

  return (
    <div style = {styles.screen}>
      { screen === "main" && <MainScreen onAccountCreate={() => {State.creatingAccount = true; setScreen('landing');}} onLogout={() => logout()}/>}
      { screen === "landing" && <LandingScreen onTryit={() => setScreen('main')} onLogin={() => setScreen('main')}/>}
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
