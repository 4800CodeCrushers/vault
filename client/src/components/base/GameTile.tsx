import { CSSProperties, useState, useRef } from 'react';
import { GameTileProps } from '../../types/components'
import { Styles } from '../../types';
import { Icon, Text } from '..';
import { Janus } from '../../utils';

function GameTile(props: GameTileProps) {
  // Extract values from the props
  const { game, onClick } = props;
  const [hovering, setHovering] = useState<boolean>(false);
  const [collected, setCollected] = useState<boolean>(game.getCollected());
  const [wished, setWished] = useState<boolean>(game.getWished());

  async function onWishlistClick() {
    let response = !game.getWished() ? await Janus.ADD_TO_COLLECTION(game.getID(), true) : await Janus.REMOVE_FROM_COLLECTION(game.getID(), true);
    game.setWished(!game.getWished());
    setWished(game.getWished());
  }

  async function onCollectionClick() {
    let response = !game.getCollected() ? await Janus.ADD_TO_COLLECTION(game.getID()) : await Janus.REMOVE_FROM_COLLECTION(game.getID());
    game.setCollected(!game.getCollected());
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
      onClick={() => onClick(game)}
    >
      {/* Cover Art */}
      <img style={{ zIndex: -1, opacity: (hovering) ? .7 : 1, ...styles.image}} src={game?.getCoverURL()}/>
      {/* Buttons on hover */}
      <div style={styles.buttonContainer}>
        {hovering && <Icon size={60} name={wished ? 'wishlist-fill' : 'wishlist'} style={{marginRight: 20}} onClick={() => onWishlistClick()}/>}
        {hovering && <Icon size={60} name={collected ? 'minus' : 'plus'} onClick={() => onCollectionClick()}/>}
      </div>
      {/* Title text */}
      <Text style={styles.title} size={'10pt'}>{game.getName()}</Text>
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
