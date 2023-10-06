import { CSSProperties, useState, useRef, useEffect } from 'react';
import { Text, TextInput, GameTile, Button } from '..';
import { CollectionPanelProps, GameInfo, Styles } from '../../types';
import { Utility, Janus, State } from '../../utils';
import { Game, User } from '../../classes';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { json } from 'node:stream/consumers';


function CollectionPanel(props: CollectionPanelProps) {
  const { onGameSelect, user } = props;
  let viewingMyStuff = user?.getID() === User.me?.getID();
  const [filterText, setFilterText] = useState<string | null>(viewingMyStuff ? State.myFilterText : State.otherFilterText);
  const [listRef, animationEnabled] = useAutoAnimate();
  const [collection, setCollection] = useState<Game[]>([]);
  const [wishlist, setWishlist] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewingCollection, setViewingCollection] = useState<boolean>(true);
 
  useEffect(() => {
    getStuff();
  }, []);

  async function getStuff() {
    if (!user) return;
    setLoading(true);
    // Get your data from the cache
    if (viewingMyStuff) {
      let collectionCache = window.localStorage.getItem('collection');
      let wishlistCache = window.localStorage.getItem('wishlist');
      if (collectionCache) {
        let info: GameInfo[] = JSON.parse(collectionCache);
        setCollection(info.map(i => new Game(i)));
      }
      if (wishlistCache) {
        let info: GameInfo[] = JSON.parse(wishlistCache);
        setWishlist(info.map(i => new Game(i)));
      }
      if (collectionCache || wishlistCache) return;
    }
    // If not viewing my stuff or nothing is cached,
    // Alternate getting the collection and wishlist
    let getWishlist = false;
    let loadedAllCollection = false;
    let loadedAllWishlist = false;
    let loadedCollection: Game[] = [];
    let loadedWishlist: Game[] = [];
    do {
      // Get wishlist
      if (getWishlist && !loadedAllWishlist) {
        let response = await Janus.GET_WISHLIST(user, loadedWishlist.length);
        let loadedGames = response.success ? response.data.map(info => new Game(info)) : [];
        if (loadedGames.length == 0) loadedAllWishlist = true;
        loadedWishlist = loadedWishlist.concat(loadedGames);
        setWishlist(loadedWishlist);
      }
      // get collection
      else if (!getWishlist && !loadedAllCollection) {
        let response = await Janus.GET_COLLECTION(user, loadedCollection.length);
        let loadedGames = response.success ? response.data.map(info => new Game(info)) : [];
        if (loadedGames.length == 0) loadedAllCollection = true;
        loadedCollection = loadedCollection.concat(loadedGames);
        setCollection(loadedCollection);
      }
      // swap the flag that decides the list we are getting
      if (!loadedAllCollection && !loadedAllWishlist) getWishlist = !getWishlist;
      else if (loadedAllCollection && !loadedAllWishlist) getWishlist = true;
      else if (!loadedAllCollection && loadedAllWishlist) getWishlist = false;
      else break;
    } while (true);
    // Put the loaded games in the cache if this is our stuff
    if (viewingMyStuff) {
      window.localStorage.setItem('collection', JSON.stringify(Game.getInfo(loadedCollection)));
      window.localStorage.setItem('wishlist', JSON.stringify(Game.getInfo(loadedWishlist)));
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
          placeholder={`Find a game in ${user?.getID() !== User.me?.getID() ? user?.getName() + "'s" : 'your'} collection`} 
          leftIcon={'search'} 
          rightIcon={filterText ? 'close' : undefined} 
          onRightIconClick={() => {
            setFilterText(null);
            if (viewingMyStuff) State.myFilterText = null;
            else  State.otherFilterText = null;
          }} 
          onChange={(text) => { 
            setFilterText(text); 
            if (viewingMyStuff) State.myFilterText = text;
            else  State.otherFilterText = text;
          }} 
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
            onCollectionClick={(g) => g.getCollected() ? setCollection(removeGame(g, collection)) : setCollection(collection.concat(g))}
            onWishlistClick={(g) => g.getWished() ? setWishlist(removeGame(g, wishlist)) : setWishlist(wishlist.concat(g))}
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
    height: '100%',
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
    gap: 7,
    width: '80%',
    alignSelf: 'center',
  },
}
  


export default CollectionPanel;
