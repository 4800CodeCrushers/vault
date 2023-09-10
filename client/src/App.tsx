import { useEffect, useState } from "react";
import { Text } from "./components";
import Janus from "./utils/Janus";


function App() {

  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    async function getGame() {
      await Janus.GET_GAME(89386);
      await Janus.GET_GAME_COVER(89386);
    }
   getGame();
  }, [counter]);

  return (
    <div>
      <button style={{left: 100, top: 100}} onClick={() => setCounter(counter + 1)}>Contact Api</button>
    </div>
  );
}

export default App;
