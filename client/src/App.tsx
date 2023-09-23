import { CSSProperties, useEffect, useRef, useState } from "react";
import { Text, GameScreen } from "./components";
import { Janus, Utility } from "./utils";
import Game from "./classes/Game";
import data from './data.json';
// troublesome IDs - 15471, 15472, 1945

function App() {
  // A reference to the input field
  const inputRef: any = useRef(null);
  const [showResult, setShowResult] = useState<boolean>(false);

  const [id, setId] = useState<number>(1942);
  const [query, setQuery] = useState<string>("Call of Duty Black Ops");

  // All of these hooks can be replaced with a Game object

  const [title, setTitle] = useState<string>();
  const [developer, setDeveloper] = useState<string>();
  const [summary, setSummary] = useState<string>();
  const [imageID, setImageID] = useState<string>();
  const [logoUrl, setLogoUrl] = useState<string>();
  const [release, setRelease] = useState<number>();
  const [screenshot, setScreenshot] = useState<string>();

  async function getGame() {
    if (!query) return;
    setShowResult(false);
    // let response = await Janus.GET_GAME(545);
    let response = await Janus.SEARCH_GAME(query);
    // let response = await Janus.GET_GAME(id);
    if (response.success) {
      setTitle(response.data.name);
      setSummary(response.data.summary);
      console.log(response.data);

      for (let i = 0; i < response.data.involved_companies.length; i++) {
        if (response.data.involved_companies[i].developer) {
          setDeveloper(response.data.involved_companies[i].company.name);
          break;
        }
      }

      setImageID(response.data.cover.image_id);
      setRelease(response.data.first_release_date);
      setLogoUrl(response.data.involved_companies[0].company.logo.image_id);
      setScreenshot(response.data.screenshots[Math.floor(Math.random() * response.data.screenshots.length)].image_id);
      // What for a split sec for the image to load
      setTimeout(() => {setShowResult(true);}, 200);
    }

    
  }

  function onTextChange() {
    setQuery(inputRef.current.value);
    setId(parseInt(inputRef.current.value));
  }

  // let game: Game = new Game(data);
  // return (
  //   <GameScreen game={game}/>
  // );

  return (
    <div style = {styles.screen}>
      {/* Render game info */}
      <div style={styles.gameContainer}>
        {/* Render image */}
        <img style={{...styles.image, opacity: showResult ? 1 : 0}} src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${imageID}.png`}/>
        {/* Render text */}
        <div style = {{...styles.gameInfoContainer, opacity: showResult ? 1 : 0}}>
          {/* Title */}
          <Text size={30} style = {{textAlign: 'center', marginBottom: 15, fontWeight: 'bold'}} color={"#29916e"}>{title}</Text>
          {/* Release date and developer */}
          <div style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-evenly', alignContent: 'center', padding: 5}}>
            <Text size={22} style={{alignSelf: 'center'}}>{Utility.getRelativeDay(release)}</Text>
            <img style={{...styles.image, opacity: showResult ? 1 : 0}} src={`https://images.igdb.com/igdb/image/upload/t_logo_med/${logoUrl}.png`}/>
            {/* <Text size={22} style={{alignSelf: 'center'}}>{developer}</Text> */}
          </div>
          {/* Summary */}
          <Text size={20} color={"#757575"} style={{ textAlign: 'center', alignSelf: 'center', padding: 20}}>{summary}</Text>

        </div>
      </div>
      <img style={{...styles.screenShot, opacity: showResult ? 1 : 0}} src={`https://images.igdb.com/igdb/image/upload/t_screenshot_big/${screenshot}.png`}/>


      {/* Render Input Section */}
      <div style = {styles.inputContainer}>
        <input style = {styles.input} value={query} ref={inputRef} placeholder="enter id" onChange={onTextChange}/>
        <button style={styles.button} onClick={() => getGame()}>Get Game</button>
      </div>
    </div>
  );
}


let styles: {[key: string]: CSSProperties} = {
  screen: {
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'center', 
    alignContent: 'center', 
    height: '100vh',
    backgroundColor: '#0e0e0e',
    background: `linear-gradient(${Utility.getTint('#0e0e0e', 15)}, #0e0e0e)`
  },
  gameContainer: {
    display: 'flex', 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    height: '70%',
  },
  gameInfoContainer: {
    marginLeft: 45,
    display: 'flex', 
    flexDirection: 'column',
    width: 500,
    maxHeight: "50%",
    minWidth: "20%",
    maxWidth: "40%",
    overflow: 'auto',
    overflowX: 'clip',
    scrollbarWidth: "none",
    backgroundColor: '#27292b',
    borderRadius: 15,
    boxShadow: '5px rgba(0, 0, 0, 0.5)'
  },
  image: {
    borderRadius: 15,
    height: "60%",
    borderColor: "white",
    borderWidth: 10,
    boxShadow: '15px rgba(0, 0, 0, 0.5)',
  },
  screenShot: {
    borderRadius: 15,
    height: "600px",
    borderColor: "white",
    borderWidth: 10,
    boxShadow: '15px rgba(0, 0, 0, 0.5)',
    width: '1000px'
  },
  logo: {
    height: 50,
  },

  inputContainer: {
    marginTop: 25,
    display: 'flex', 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  input: {
    border: "none",
    outline: "none",
    borderRadius: 20,
    backgroundColor: '#363636',
    color: 'white',
    paddingLeft: 10,
    fontSize: 40,
    height: 100,
    width: 600
  },
  button: {
    border: 'none',
    backgroundColor: '#29916e',
    color: 'white',
    width: '120px',
    height: '100px',
    borderRadius: 25,
    fontSize: "16pt",
    marginLeft: 15
  }
}


export default App;
