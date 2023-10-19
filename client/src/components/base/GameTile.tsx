import { CSSProperties, useState, useRef } from 'react';
import { GameTileProps } from '../../types/components'
import { Styles } from '../../types';
import { Icon, Text } from '..';
import { Janus, Utility } from '../../utils';
import { User } from '../../classes';

function GameTile(props: GameTileProps) {
  // Extract values from the props
  const { game, onClick, sort } = props;
  const [hovering, setHovering] = useState<boolean>(false);
  const [collected, setCollected] = useState<boolean>(game.getCollected());
  const [wished, setWished] = useState<boolean>(game.getWished());

  async function onWishlistClick() {
    game.setWished(!game.getWished());
    if (game.getWished()) Utility.addToCache(game, false);
    else Utility.removeFromCache(game, false);
    if (props.onWishlistClick) props.onWishlistClick(game);
    let response = game.getWished() ? await Janus.ADD_TO_WISHLIST(game.getID()) : await Janus.REMOVE_FROM_WISHLIST(game.getID());
    setWished(game.getWished());
  }

  async function onCollectionClick() {
    game.setCollected(!game.getCollected());
    if (game.getCollected()) Utility.addToCache(game);
    else Utility.removeFromCache(game);
    if (props.onCollectionClick) props.onCollectionClick(game);
    let response = game.getCollected() ? await Janus.ADD_TO_COLLECTION(game.getID()) : await Janus.REMOVE_FROM_COLLECTION(game.getID());
    setCollected(game.getCollected());
  }

  return (
    <div 
      style = {{
        ...styles.container, 
        transform: hovering ? 'scale(1.03)' : 'scale(1)', 
        borderColor: hovering ? 'white': 'gray',
        zIndex: hovering ? 3 : 1,
      }} 
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)} 
    >
      {/* Cover Art */}
      <img style={{ zIndex: -1, opacity: (hovering) ? .7 : 1, ...styles.image}} src={game?.getCoverURL()}/>
      {/* Buttons on hover */}
      <div style={styles.buttonContainer}>
        <div onClick={() => onClick(game)} style={{width: '100%', height: 250, position: 'absolute'}}/>
        {User.me && hovering && <Icon size={50} name={wished ? 'wishlist-fill' : 'wishlist'} style={{marginRight: 20, zIndex: 4}} onClick={() => onWishlistClick()}/>}
        {User.me && hovering && <Icon size={50} name={collected ? 'minus' : 'plus'} style={{zIndex: 4}} onClick={() => onCollectionClick()}/>}
      </div>
      {/* Title text */}
      <Text style={styles.title} size={'10pt'}>{game.getName()}</Text>
      {sort === 'Rating' && <Text color={'#fab400'} style={{...styles.title, marginTop: 5}} size={'10pt'}>{`${Math.round(game.getRating() * 20)}%`}</Text>}
    </div>
  );
}


let styles: Styles = {
  container: {
    width: 200,
    margin: 10
  },
  image: {
    width: '100%',
    height: 250,
    pointerEvents: 'none',
    position: 'absolute',
    alignSelf: 'center',
    userSelect: 'none',
  },
  title: {
    textAlign: 'center', 
    display: '-webkit-box',
    WebkitUserSelect: 'none',
    WebkitLineClamp: 2, // Set the maximum number of lines to display
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden', 
    paddingRight: 2, 
    paddingLeft: 2,
  },
  buttonContainer: {
    width: '100%', 
    height: 250,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
}


export default GameTile;
