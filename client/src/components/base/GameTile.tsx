import { CSSProperties, useState, useRef } from 'react';
import { GameProps } from '../../types/components'
import { Styles } from '../../types';
import { Icon, Text } from '..';

function GameTile(props: GameProps) {
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
    <div style = {{...styles.container,  borderColor: hovering ? 'white': 'gray'}} key={game.getID()} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
      <img style={styles.image} src={game?.getCoverURL()} onClick={() => onClick(game)}/>
      {/* { hovering && renderOnHover()} */}
    </div>
  );
}


let styles: Styles = {
  container: {
    borderWidth: 2,
   
    borderStyle: 'solid',
    width: 200,
  },
  image: {
    width: '100%',
    height: 300,
    display: 'block',
  },
}


export default GameTile;
