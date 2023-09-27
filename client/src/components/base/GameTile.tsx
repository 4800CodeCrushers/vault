import { CSSProperties, useState, useRef } from 'react';
import { GameTileProps } from '../../types/components'
import { Styles } from '../../types';
import { Icon, Text } from '..';

function GameTile(props: GameTileProps) {
  // Extract values from the props
  const { game, onClick } = props;
  const [hovering, setHovering] = useState<boolean>(false);

  function renderOnHover() {
    return (
      <div style={{ position: 'absolute', top: 0, width: 200, height: 300, backgroundColor: 'gray', opacity: hovering ? .5 : 0}}>

      </div>
    );
  }

  return (
    <div 
      style = {{
        ...styles.container, 
        transform: hovering ? 'scale(1.03)' : 'scale(1)', 
        borderColor: hovering ? 'white': 'gray'
      }} 
      key={game.getID()} 
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)} 
      onClick={() => onClick(game)}
    >
      <img 
        style={{
          zIndex: hovering ? 1 : undefined, 
          ...styles.image
        }} 
        src={game?.getCoverURL()}
      />
      <Text style={styles.title} size={'10pt'}>{game.getName()}</Text>
      {/* { hovering && renderOnHover()} */}
    </div>
  );
}


let styles: Styles = {
  container: {
    borderWidth: 2,
    width: 200,
  },
  image: {
    width: '100%',
    height: 300,
    display: 'block',
    pointerEvents: 'none',
    userSelect: 'none'
  },
  title: {
    textAlign: 'center', 
    display: '-webkit-box',
    WebkitUserSelect: 'none',
    WebkitLineClamp: 2, // Set the maximum number of lines to display
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden', 
    paddingRight: 2, 
    paddingLeft: 2
  }
}


export default GameTile;
