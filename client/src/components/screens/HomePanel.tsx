import { CSSProperties, useState, useRef } from 'react';
import { Text, TextInput, GameTile } from '..';
import { HomePanelProps, Styles } from '../../types';
import { Utility, Janus, State } from '../../utils';
import { Game } from '../../classes';



function HomePanel(props: HomePanelProps) {
  const { onGameSelect } = props;

  const [query, setQuery] = useState<string>(State.query);
  const [searchedOnce, setSearchedOnce] = useState<boolean>(State.loadedGames.length > 0);
  const [games, setGames] = useState<Game[]>(State.loadedGames);

  async function getGames() {
    if (!query) return;
    let response = await Janus.SEARCH_GAMES(query);
    setSearchedOnce(true);
    if (response.success) {
      State.loadedGames = response.data.map(info => new Game(info));
      setGames(State.loadedGames);
    }
    else {
      setGames([]);
    }
  }

  function reset() {
    setSearchedOnce(false);
    setGames([]);
    setQuery("");
    State.query = "";
  }

  return (
    <div style = {{...styles.panel, justifyContent: !searchedOnce ? 'center' : undefined}}>
      {/* Render Greeting */}
      {!searchedOnce && <Text style={styles.greeting}>{Utility.getGreeting() + ", John Smith!"}</Text>}
      {/* Render Input Section */}
      <div style = {styles.inputContainer}>
        <TextInput value={query} placeholder="Search for a game..." leftIcon={'search'} rightIcon={query ? 'close' : undefined} onRightIconClick={() => reset()} onChange={(text) => {setQuery(text); State.query = text;}} onSubmit={() => getGames()}/>
        <button style={styles.button} onClick={() => getGames()}>Get Games</button>
      </div>
      {/* Result Grid */}
      <div style = {styles.grid}>
        {games?.map(game => <GameTile game={game} onClick={() => onGameSelect(game)}/>)}
      </div>
      { searchedOnce && games.length == 0 && <Text style={{textAlign: 'center'}}>No Games Found!</Text>}
    </div>
  );
}


let styles: Styles = {
  panel: {
    display: 'flex', 
    flexDirection: 'column',
    height: '100vh',
    overflowY: 'auto',
  },
  greeting: {
    textAlign: 'center',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 60
  },
  inputContainer: {
    display: 'flex', 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  button: {
    border: 'none',
    backgroundColor: '#29916e',
    color: 'white',
    width: '120px',
    height: 75,
    borderRadius: 25,
    fontSize: "16pt",
    marginLeft: 15
  },
  grid: {
    margin: 30,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '2px',
    width: '80%',
    alignSelf: 'center',
  },
}
  


export default HomePanel;
