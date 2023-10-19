import { CSSProperties, useEffect, useState } from 'react';
import { Icon, Text } from '..';
import { GamePanelProps, Styles } from '../../types';
import { Utility, Janus } from '../../utils';
import { Rating } from 'react-simple-star-rating';


function GamePanel(props: GamePanelProps) {
  // Extract values from the props
  const { game } = props;

  const [index1, setIndex1] = useState<number>(0);
  const [targetBGOpacity, setTargetBGOpacity] = useState<1 | 0>(1);
  const [collected, setCollected] = useState<boolean>(game.getCollected());
  const [wished, setWished] = useState<boolean>(game.getWished());


  useEffect(() => {
    bgImageLoop(0);
  }, []); 

  async function bgImageLoop(cur: number) {
    let i = cur + 1 < game.getInfo().screenshots.length ? cur + 1 : 0; 
    await new Promise(resolve => setTimeout(resolve, 6000));
    setTargetBGOpacity(0);
    await new Promise(resolve => setTimeout(resolve, 400));
    setIndex1(i);
    setTargetBGOpacity(1);
    bgImageLoop(i);
  } 

  async function onWishlistClick() {
    game.setWished(!game.getWished());
    if (game.getWished()) Utility.addToCache(game, false);
    else Utility.removeFromCache(game, false);
    let response = game.getWished() ? await Janus.ADD_TO_WISHLIST(game.getID()) : await Janus.REMOVE_FROM_WISHLIST(game.getID());
    setWished(game.getWished());
  }

  async function onCollectionClick() {
    game.setCollected(!game.getCollected());
    if (game.getCollected()) Utility.addToCache(game);
    else Utility.removeFromCache(game);
    let response = game.getCollected() ? await Janus.ADD_TO_COLLECTION(game.getID()) : await Janus.REMOVE_FROM_COLLECTION(game.getID());
    setCollected(game.getCollected());
  }
  
  return (
    <div style = {styles.panel}>
      <div style={{height: '100%', overflow: 'scroll'}}>
        {/* Render screenshot */}
        <div style={{width: '100%', height: 400, overflow: 'hidden'}}>
          <img style={{opacity: targetBGOpacity, ...styles.backgroundImage}} src={game?.getScreenshot(index1)}/>
        </div>
        {/* Render cover, title, date, rating, and buttons */}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
          <div style={{ display: 'flex', flexDirection: 'row', paddingLeft: 100}}>
            <img style={styles.cover} src={game?.getCoverURL()}/>
            <div style={{paddingLeft: 25}}>
              <Text size={30} style = {{marginBottom: 10, fontWeight: 'bolder'}}>{game?.getName()}</Text>
              <Text size={22}>{game?.getReleaseDate()}</Text>
              <div style={{marginTop: 10, display: 'flex', flexDirection: 'row', alignContent: 'center'}}>
                <Text size={22} style={{marginRight: 20}}>{game?.getRating().toFixed(2)}</Text>
                <Rating size={25} readonly allowFraction initialValue={game?.getRating()}/>
              </div>
            </div>
          </div>
          {/* Wishlist and  collection */}
          <div style={{ display: 'flex', flexDirection: 'row', paddingRight: 100}}>
            <div style={styles.icon}>
              <Icon size={30} name={wished ? 'wishlist-fill' : 'wishlist'} onClick={() => onWishlistClick()}/>
            </div>
            <div style={styles.icon}>
              <Icon size={30} name={collected ? 'minus' : 'plus'} onClick={() => onCollectionClick()}/>
            </div>
          </div>
        </div>
        {/* Render genres, summary, platforms, screenshot */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', position: 'relative', bottom: 150}}>
          {/* Genre */}
          <Text size={20} style={{margin: '20px 0px 20px 20px', fontWeight: 'bolder'}}>{game.getGenres().length > 1 ? "Genres" : "Genre"}</Text>
          <div style={{display: 'flex', flexDirection: 'row', width: '95%', overflowX: 'auto', marginLeft: 20}}>
            {game?.getGenres().map(g => <Text size={15} style={{padding: 10, backgroundColor: '#fab400', borderRadius: 25, margin: 2, fontWeight: 'bolder'}}>{g}</Text>)}
          </div>
          {/* Summary */}
          <Text size={20} style={{margin: '20px 0px 20px 20px', fontWeight: 'bolder'}}>Summary</Text>
          <Text size={20} style={{margin: '0px 40px 0px 20px'}}>{game?.getSummary()}</Text>
          {/* Platform */}
          <Text size={20} style={{margin: '20px 0px 20px 20px', fontWeight: 'bolder'}}>{game.getPlatforms().length > 1 ? "Platforms" : "Platform"}</Text>
          <div style={{display: 'flex', flexDirection: 'row', width: '95%', overflowX: 'auto', marginLeft: 20}}>
            {game?.getPlatforms().map(p => <Text size={15} style={{padding: 10, backgroundColor: '#fab400', borderRadius: 25, margin: 2, fontWeight: 'bolder'}}>{p}</Text>)}
          </div>
          {/* Screenshots */}
          <Text size={20} style={{margin: '20px 0px 20px 20px', fontWeight: 'bolder'}}>Gallery</Text>
          <div style={{display: 'flex', flexDirection: 'row', height: 300, alignSelf: 'center', width: '95%', overflowX: 'auto'}}>
            {game?.getScreenshots().map(i => <img style={{margin: '0px 10px 0px 10px'}} src={i}/>)}
          </div>
        </div>
      </div>
    </div>
  );
}

let styles: Styles = {
  panel: {
    display: 'flex', 
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    overflowY: 'auto',
  },
  backgroundImage: {
    width: '100%',
    // filter: `blur(${0}px)`,
    transition: 'opacity .4s',
    
  },
  cover: {
    borderRadius: 15,
    height: 300,
    position: 'relative',
    bottom: 150,
    border: '1px solid white',
  },
  icon: {
    width: 60,
    height: 60,
    border: '1px solid white',
    borderRadius: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    top: 60,
    cursor: 'pointer',
    marginRight: 15
  },
  
}
  


export default GamePanel;
