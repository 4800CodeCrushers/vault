import { CSSProperties, useState, useRef, useEffect } from 'react';
import { Text, TextInput, GameTile, Button } from '..';
import { HomePanelProps, Styles } from '../../types';
import { Utility, Janus, State } from '../../utils';
import { Game, User } from '../../classes';
import { useAutoAnimate } from '@formkit/auto-animate/react';


function CollectionPanel(props: HomePanelProps) {
  const { onGameSelect } = props;

  const [filterText, setFilterText] = useState<string | null>(State.filterText);
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
    let games = response.success ? response.data.map(info => new Game(info)) : [];
    setCollection(games);
    setLoading(false);

    while (response.data.length > 0) {
      response = await Janus.GET_COLLECTION(games.length);
      games = games.concat(response.success ? response.data.map(info => new Game(info)) : []);
      setCollection(games);
    }

    let response2 = await Janus.GET_WISHLIST();
    setWishlist(response2.success ? response2.data.map(info => new Game(info)) : []);
    let games2 = response2.success ? response2.data.map(info => new Game(info)) : [];

    while (response2.data.length > 0) {
      response2 = await Janus.GET_WISHLIST(games2.length);
      games2 = games2.concat(response2.success ? response2.data.map(info => new Game(info)) : []);
      setWishlist(games2);
    }
   
  }

  function getListToRender(): Game[] {
    let games: Game[] = viewingCollection ? collection : wishlist;
    let filteredGames: Game[] = [];
    if (filterText) {
      games.forEach(game => {
        let name = game.getName().toLowerCase();
        if (name.includes(filterText.toLowerCase())) 
          filteredGames.push(game);
      });
    }
    else {
      filteredGames = games;
    }
    return filteredGames;
  }

  /** Runs when the user scrolls through the games */
  function onScroll (e: React.UIEvent<HTMLElement>) {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
    if(bottom) {
      console.log('here');
    }
  }

  function removeGame(game: Game, list: Game[]): Game[] {
    let result: Game[] = [];
    list.forEach( g => {
      if (g.getID() !== game.getID()) result.push(g);
    });
    return result;
  }

  let renderList: Game[] = getListToRender();
  let showNoGamesText = !loading && ((viewingCollection && collection.length == 0) || (!viewingCollection && wishlist.length == 0));
  return (
    <div onScroll={onScroll} style = {styles.panel}>
      {/* Render Input Section */}
      <div style = {styles.inputContainer}>
        <TextInput 
          value={filterText} 
          defaultValue={filterText}
          placeholder="Find a game in your collection" 
          leftIcon={'search'} 
          rightIcon={filterText ? 'close' : undefined} 
          onRightIconClick={() => {setFilterText(null); State.filterText = null;}} 
          onChange={(text) => { setFilterText(text); State.filterText = text;}} 
        />
      </div>
      {/* Collection or Wishlist */}
      <div style = {styles.changeListContainer}>
        <Text size={25} onClick={() => setViewingCollection(true)} style={{fontWeight: 'bolder', textDecorationLine: viewingCollection ? 'underline' : undefined, marginRight: 50}}>Collection</Text>
        <Text size={25} onClick={() => setViewingCollection(false)} style={{fontWeight: 'bolder', textDecorationLine: !viewingCollection ? 'underline' : undefined}}>Wishlist</Text>
      </div>
      { showNoGamesText && <Text style={{textAlign: 'center'}}>No Games Added!</Text>}
      {/* Result Grid */}
      <div style = {styles.grid} ref = {listRef}>
        {renderList.map(game => 
          <GameTile 
            key={game.getID()} 
            game={game} 
            onClick={() => onGameSelect(game)}
            onCollectionClick={(g) => setCollection(removeGame(g, collection))}
            onWishlistClick={(g) => setWishlist(removeGame(g, wishlist))}
          />
        )}
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
