import { CSSProperties, useState, useRef, useEffect } from 'react';
import { Text, TextInput, GameTile, Button, ProfilePic, Icon, MenuTab } from '..';
import { CollectionPanelProps, GameInfo, Styles, Sort } from '../../types';
import { Utility, Janus, State } from '../../utils';
import { Game, User } from '../../classes';
import { useAutoAnimate } from '@formkit/auto-animate/react';

function CollectionPanel(props: CollectionPanelProps) {
  const { onGameSelect, user } = props;
  let viewingMyStuff = user?.getID() === User.me?.getID();
  const [filterText, setFilterText] = useState<string | null>(viewingMyStuff ? State.myFilterText : State.otherFilterText);
  const [listRef, animationEnabled] = useAutoAnimate();
  const [collection, setCollection] = useState<Game[]>([]);
  const [wishlist, setWishlist] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewingCollection, setViewingCollection] = useState<boolean>(true);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [sort, setSort] = useState<Sort>('Title');
  const dropdownRef: any = useRef(null);
  
  useEffect(() => {
    getStuff();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (showDropDown && dropdownRef.current) {
        const parentRect = dropdownRef.current.parentElement.getBoundingClientRect();
        dropdownRef.current.style.left = `${parentRect.left}px`;
        dropdownRef.current.style.top = `${parentRect.bottom}px`;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [showDropDown])


  async function getStuff() {
    if (!user) return;
    setLoading(true);
    // Get your data from the cache
    if (viewingMyStuff) {
      let collectionCache = window.localStorage.getItem('collection');
      let wishlistCache = window.localStorage.getItem('wishlist');
      if (collectionCache) {
        let info: GameInfo[] = JSON.parse(collectionCache);
        let c: Game[] = info.map(i => new Game(i));
        setCollection(c.sort((a,b) => {
          if(a.getName() < b.getName()) return -1;
          else return 1;
        }));
      }
      if (wishlistCache) {
        let info: GameInfo[] = JSON.parse(wishlistCache);
        let w: Game[] = info.map(i => new Game(i));
        setWishlist(w.sort((a,b) => {
          if(a.getName() < b.getName()) return -1;
          else return 1;
        }));
      }
      if (collectionCache || wishlistCache) {
        setLoading(false);
        return;
      }
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
        setWishlist(loadedWishlist.sort((a,b) => {
          if(a.getName() < b.getName()) return -1;
          else return 1;
        }));
      }
      // get collection
      else if (!getWishlist && !loadedAllCollection) {
        let response = await Janus.GET_COLLECTION(user, loadedCollection.length);
        let loadedGames = response.success ? response.data.map(info => new Game(info)) : [];
        if (loadedGames.length == 0) loadedAllCollection = true;
        loadedCollection = loadedCollection.concat(loadedGames);
        setCollection(loadedCollection.sort((a,b) => {
          if(a.getName() < b.getName()) return -1;
          else return 1;
        }));
      }
      // swap the flag that decides the list we are getting
      if (!loadedAllCollection && !loadedAllWishlist) getWishlist = !getWishlist;
      else if (loadedAllCollection && !loadedAllWishlist) getWishlist = true;
      else if (!loadedAllCollection && loadedAllWishlist) getWishlist = false;
      else break;
    } while (true);
    // We are no longer loading
    setLoading(false);
    // Put the loaded games in the cache if this is our stuff
    if (viewingMyStuff) {
      window.localStorage.setItem('collection', JSON.stringify(Game.getInfoInList(loadedCollection)));
      window.localStorage.setItem('wishlist', JSON.stringify(Game.getInfoInList(loadedWishlist)));
    }
  }

  function getListToRender(): Game[] {
    // What list are we looking at
    let games: Game[] = viewingCollection ? collection : wishlist;
    // Remove games based on the filter text
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

  function onCollectionClick(game: Game) {
    if (!viewingMyStuff) return;
    setCollection(game.getCollected() ? collection.concat(game) : removeGame(game, collection));
  }

  function onWishlistClick(game: Game) {
    if (!viewingMyStuff) return;
    setWishlist(game.getCollected() ? wishlist.concat(game) : removeGame(game, wishlist));
  }

  function removeGame(game: Game, list: Game[]): Game[] {
    let result: Game[] = [];
    list.forEach( g => {
      if (g.getID() !== game.getID()) result.push(g);
    });
    return result;
  }

  function sortGames(option: Sort) {
    setSort(option);
    setShowDropDown(false);
    console.log(collection.length);

    // Do not resort if we are selecting the same option
    if (option == sort) return;
    // Sort the lists depending on the option
    if (option === 'Title') {
      setCollection(collection.sort((a,b) => {
        if(a.getName() < b.getName()) return -1;
        else return 1;
      }));
      setWishlist(wishlist.sort((a,b) => {
        if(a.getName() < b.getName()) return -1;
        else return 1;
      }));
    }
    else if (option === 'Rating') {
      setCollection(collection.sort((a,b) => {
        return a.getRating() - b.getRating();
      }));
      setWishlist(wishlist.sort((a,b) => {
        if(b.getName() < a.getName()) return -1;
        else return 1;
      }));
    }
    else if (option === 'Genre') {

    }
  }

  function renderDropDown() {
    if (!showDropDown) return <></>;
    const options: Sort[] = ['Title', 'Genre', 'Platform', 'Rating']
    return (
      <div ref = {dropdownRef} style={styles.dropDownContainer}>
        { options.map(o => <MenuTab name={o} fontSize={15} height={35} onClick={() => sortGames(o)}/>) }
      </div>
    );
  }

  function renderGrid() {
    let renderList: Game[] = getListToRender();

    if (sort === 'Title' || sort === 'Rating') {
      return(
        <div style = {styles.grid} ref = {listRef}>
          {renderList.map(game => 
            <GameTile 
              key={game.getID()} 
              game={game} 
              onClick={() => onGameSelect(game)}
              onCollectionClick={(g) => onCollectionClick(g)}
              onWishlistClick={(g) => onWishlistClick(g)}
              sort={sort}
            />
          )}
        </div>
      );
    }
    else if (sort === 'Genre') {
      let genres: string[] = Array.from(Game.getGenresInList(renderList)).sort();
      return(
        <div style={{display: 'flex', flexDirection: 'column'}}>
          {genres.map(genre => 
            <div key={genre} style={{}}>
              <Text style={{width: '100%', textAlign: 'center'}}>{genre}</Text>
              <div style = {styles.grid} ref = {listRef}>
                {renderList.map(game => game.fromGenre(genre) ? 
                  <GameTile 
                    key={game.getID()} 
                    game={game} 
                    onClick={() => onGameSelect(game)}
                    onCollectionClick={(g) => onCollectionClick(g)}
                    onWishlistClick={(g) => onWishlistClick(g)}
                    sort={sort}
                  /> : <></>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }
    else if (sort === 'Platform') {
      let platforms: string[] = Array.from(Game.getPlatformsInList(renderList)).sort();
      return(
        <div style={{display: 'flex', flexDirection: 'column'}}>
          {platforms.map(platform => 
            <div key={platform} style={{}}>
              <Text style={{width: '100%', textAlign: 'center'}}>{platform}</Text>
              <div style = {styles.grid} ref = {listRef}>
                {renderList.map(game => game.fromPlatform(platform) ? 
                  <GameTile 
                    key={game.getID()} 
                    game={game} 
                    onClick={() => onGameSelect(game)}
                    onCollectionClick={(g) => onCollectionClick(g)}
                    onWishlistClick={(g) => onWishlistClick(g)}
                    sort={sort}
                  /> : <></>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }  
  }

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
        {/* Render Drop down */}
        <div style={{width: 130, marginLeft: 10}}>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer'}} onClick={() => setShowDropDown(!showDropDown)}>
            <div style = {{margin: '0px 5px 0px 0px', display: 'flex', flexDirection: 'row'}}><Text style={{marginRight: 5}}>By</Text>{<Text color={'#fab400'} style={{fontWeight: 'bolder'}}>{sort}</Text>}</div>
            <Icon name={showDropDown ? 'up' :'down'} size={15}/>
          </div>
          { renderDropDown() }
        </div>
      </div>
      {/* Collection or Wishlist */}
      <div style = {styles.changeListContainer}>
        <Text size={25} onClick={() => setViewingCollection(true)} style={{fontWeight: 'bolder', textDecorationLine: viewingCollection ? 'underline' : undefined, marginRight: 50}}>Collection</Text>
        <Text size={25} onClick={() => setViewingCollection(false)} style={{fontWeight: 'bolder', textDecorationLine: !viewingCollection ? 'underline' : undefined}}>Wishlist</Text>
      </div>
      { showNoGamesText && <Text style={{textAlign: 'center'}}>No Games Added!</Text>}
      { renderGrid() }
    </div>
  );
}


let styles: Styles = {
  panel: {
    display: 'flex', 
    flexDirection: 'column',
    height: '100%',
    overflowY: 'auto',
    padding: '0px 20px 0px 20px',
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
    width: '100%',
  },
  dropDownContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'absolute', 
    zIndex: 5,
    width: 100,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#2b3134',
  },
}
  


export default CollectionPanel;
