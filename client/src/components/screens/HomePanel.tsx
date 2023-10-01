import { CSSProperties, useState, useRef, useEffect } from 'react';
import { Text, TextInput, GameTile, Button } from '..';
import { HomePanelProps, Styles } from '../../types';
import { Utility, Janus, State } from '../../utils';
import { Game, Trivia, User } from '../../classes';
import { useAutoAnimate } from '@formkit/auto-animate/react';


function HomePanel(props: HomePanelProps) {
  const { onGameSelect } = props;

  const [query, setQuery] = useState<string | null>(State.query);
  const [listRef, animationEnabled] = useAutoAnimate();
  const [searchedOnce, setSearchedOnce] = useState<boolean>(State.loadedGames.length > 0);
  const [games, setGames] = useState<Game[]>(State.loadedGames);
  const [loading, setLoading] = useState<boolean>(false);

  const [targetTriviaOpacity, setTargetTriviaOpacity] = useState<1 | 0>(0);
  const [trivia, setTrivia] = useState<Trivia>();
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  useEffect(() => {
    triviaLoop();
  }, []); 

  async function triviaLoop() {
    setShowOptions(false);
    setShowAnswer(false);
    let trivia = new Trivia(await Janus.GET_TRIVIA());
    setTargetTriviaOpacity(1);
    setTrivia(trivia);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowOptions(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setShowAnswer(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTargetTriviaOpacity(0);
    await new Promise(resolve => setTimeout(resolve, 4000));
    triviaLoop();
  } 

  async function getGames() {
    if (query === null) return;
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
    State.query = null;
    State.loadedGames = [];
    setQuery(null);
    setSearchedOnce(false);
    setGames([]);
    animationEnabled(false);
  }

  function onTextChange(text: string) {
    State.query = text.length > 0 ? text : null; 
    setQuery(text.length > 0 ? text : null);
  }

  function renderTrvia() {
    return(
      <div style={{opacity: targetTriviaOpacity, transition: 'opacity 2s', height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '50%', alignSelf: 'center'}}>
        <Text style={styles.trivia}>{trivia?.getQuestion()}</Text>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20}}>
          {trivia?.getOptions().map((o) => 
            <Text style={{
              opacity: showOptions ? targetTriviaOpacity : 0, 
              transition: 'opacity 1s', 
              ...((o === trivia.getAnswer() && showAnswer) ? styles.triviaAnswerCorrect : styles.triviaAnswer)
            }}>
              {o}
            </Text>
          )}
        </div>
      </div>
    );
  }


  
  return (
    <div style = {{...styles.panel, justifyContent: !searchedOnce ? 'center' : undefined}}>
      {/* Render Greeting */}
      {!searchedOnce && User.me && <Text style={styles.greeting}>{Utility.getGreeting() + ", " + User.me?.getName()}</Text>}
      {/* Render Input Section */}
      <div style = {styles.inputContainer}>
        <TextInput 
          value={query} 
          defaultValue={query}
          placeholder="Search for a game" 
          leftIcon={'search'} 
          rightIcon={(query && !loading) ? 'close' : undefined} 
          onRightIconClick={() => reset()} 
          onChange={(text) => onTextChange(text)} 
          onSubmit={() => getGames()}
        />
        <Button name = {"GO"} disabled = {query == null || loading} width={100} style={{marginLeft: 15}} onClick={() => getGames()}/>
      </div>
      {!searchedOnce && renderTrvia()}
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
  trivia: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  triviaAnswer: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  triviaAnswerCorrect: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: 'green'
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
