import { CSSProperties, useState, useRef } from 'react';
import { Text, TextInput, GameTile, Button } from '..';
import { HomePanelProps, Styles } from '../../types';
import { Utility, Janus, State } from '../../utils';
import { Game, User } from '../../classes';
import { useAutoAnimate } from '@formkit/auto-animate/react';



function HomePanel(props: HomePanelProps) {
  const { onGameSelect } = props;

  const [query, setQuery] = useState<string | undefined>(State.query);
  const [listRef, animationEnabled] = useAutoAnimate();
  const [searchedOnce, setSearchedOnce] = useState<boolean>(State.loadedGames.length > 0);
  const [games, setGames] = useState<Game[]>(State.loadedGames);
  const [loading, setLoading] = useState<boolean>(false);

  async function getGames() {
    if (!query) return;
    setLoading(true);
    animationEnabled(true);
    let response = await Janus.SEARCH_GAMES(query);

    if (response.success) {
      State.loadedGames = response.data.map(info => new Game(info));
      setGames(State.loadedGames);
    }
    else {
      setGames([]);
    }
    setSearchedOnce(true);
    setLoading(false);
  }

  function reset() {
    setSearchedOnce(false);
    setGames([]);
    setQuery(undefined);
    State.query = undefined;
    animationEnabled(false);
  }

  

  return (
    <div style = {{...styles.panel, justifyContent: !searchedOnce ? 'center' : undefined}}>
      {/* Render Greeting */}
      {!searchedOnce && User.me && <Text style={styles.greeting}>{Utility.getGreeting() + ", " + User.me?.getName()}</Text>}
      {/* Render Input Section */}
      <div style = {styles.inputContainer}>
        <TextInput 
          value={query} 
          placeholder="Search for a game" 
          leftIcon={'search'} 
          rightIcon={query ? 'close' : undefined} 
          onRightIconClick={() => reset()} 
          onChange={(text) => {setQuery(text); State.query = text;}} 
          onSubmit={() => getGames()}
        />
        <Button name = {"GO"} disabled = {!query || loading} width={100} style={{marginLeft: 15}} onClick={() => getGames()}/>
      </div>
      {/* Result Grid */}
      <div style = {styles.grid} ref = {listRef}>
        {games?.map(game => <GameTile key={game.getID()} game={game} onClick={() => onGameSelect(game)}/>)}
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
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 60,
  },
  inputContainer: {
    display: 'flex', 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  grid: {
    margin: 30,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    width: '80%',
    alignSelf: 'center',
  },
}
  


export default HomePanel;
