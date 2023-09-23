import { CSSProperties } from 'react';
import { GameScreenProps } from '../types/components'
import { Utility, Janus } from '../utils';
import Text from './Text';


function GameScreen(props: GameScreenProps) {
  // Extract values from the props
  const { game } = props;
  
  return (
    <div style={styles.screen}>
      <img style = {{width: 500, height: 500}} src={game.getCoverURL()}/>
      <Text>{game.getName()}</Text>
    </div>
  );
}

let styles: {[key: string]: CSSProperties} = {
  screen: {
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'center', 
    alignContent: 'center', 
    height: '100vh',
    backgroundColor: '#0e0e0e',
    background: `linear-gradient(${Utility.getTint('#0e0e0e', 15)}, #0e0e0e)`
  }
}
  


export default GameScreen;
