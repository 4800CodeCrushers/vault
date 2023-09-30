import { CSSProperties, useState, useRef, useEffect } from 'react';
import { Text, TextInput, GameTile, Button } from '..';
import { HomePanelProps, Styles } from '../../types';
import { Utility, Janus, State } from '../../utils';
import { Game, User } from '../../classes';
import { useAutoAnimate } from '@formkit/auto-animate/react';



function CollectionPanel(props: HomePanelProps) {
  const { onGameSelect } = props;

  const [query, setQuery] = useState<string | undefined>(State.query);
  const [listRef, animationEnabled] = useAutoAnimate();
  const [collection, setCollection] = useState<Game[]>([]);
  const [wishlist, setWishlist] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewingCollection, setViewingCollection] = useState<boolean>(true);
 
  useEffect(() => {
    getStuff();
  }, []);

  async function getStuff() {
    setLoading(true);
    let response = await Janus.GET_COLLECTION();
    setCollection(response.success ? response.data.map(info => new Game(info)) : []);
    let response2 = await Janus.GET_COLLECTION(true);
    setWishlist(response2.success ? response2.data.map(info => new Game(info)) : []);
    setLoading(false);
  }


  let games: Game[] = viewingCollection ? collection : wishlist;
  return (
    <div style = {styles.panel}>
      {/* Render Input Section */}
      <div style = {styles.inputContainer}>
        <TextInput 
          value={query} 
          placeholder="Find a game in your collection" 
          leftIcon={'search'} 
          rightIcon={query ? 'close' : undefined} 
          onRightIconClick={() => {setQuery(undefined); State.query = undefined;}} 
          onChange={(text) => {setQuery(text); State.query = text;}} 
        />
      </div>
      {/* Collection or Wishlist */}
      <div style = {styles.changeListContainer}>
        <Text size={25} onClick={() => setViewingCollection(true)} style={{fontWeight: 'bolder', textDecorationLine: viewingCollection ? 'underline' : undefined, marginRight: 50}}>Collection</Text>
        <Text size={25} onClick={() => setViewingCollection(false)} style={{fontWeight: 'bolder', textDecorationLine: !viewingCollection ? 'underline' : undefined}}>Wishlist</Text>
      </div>
      { !loading && games.length == 0 && <Text style={{textAlign: 'center'}}>No Games Added!</Text>}
      {/* Result Grid */}
      <div style = {styles.grid} ref = {listRef}>
        {games.map(game => <GameTile key={game.getID()} game={game} onClick={() => onGameSelect(game)}/>)}
      </div>
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
  inputContainer: {
    display: 'flex', 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  changeListContainer: {
    display: 'flex', 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    margin: 15
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    width: '80%',
    alignSelf: 'center',
  },
}
  


export default CollectionPanel;
