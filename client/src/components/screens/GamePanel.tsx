import { CSSProperties } from 'react';
import { Text } from '..';
import { GamePanelProps, Styles } from '../../types';
import { Utility, Janus } from '../../utils';



function GamePanel(props: GamePanelProps) {
  // Extract values from the props
  const { game } = props;
  
  return (
    // <div style = {styles.panel}>

      <div style = {styles.testPanel}>
      {/* Render game info */}

      {/* <div style={styles.gameContainer}> */}

        {/* Render Background image*/}
        <img style={{...styles.backgroundImage, opacity: game ? 1: 0}} src={game?.getScreenshotURL()}/>
        {/* Render game info */}
        <div style={styles.testGameContainer}>
        {/* Render image */}
        <img style={{...styles.cover, opacity: game ? 1 : 0}} src={game?.getCoverURL()}/>
        {/* Render text */}
        <div style = {{...styles.gameInfoContainer, opacity: game ? 1 : 0}}>
          {/* Title */}
          <Text size={30} style = {{textAlign: 'center', marginBottom: 15, fontWeight: 'bold'}} color={"#29916e"}>{game?.getName()}</Text>
          {/* Release date and developer */}
          <div style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-evenly', alignContent: 'center', padding: 5}}>
            <Text size={22} style={{alignSelf: 'center'}}>{game?.getReleaseDate()}</Text>
            <img style={{opacity: game ? 1 : 0}} src={game?.getDevURL()}/>
          </div>
          {/* Summary */}
          <Text size={20} color={"#757575"} style={{ textAlign: 'center', alignSelf: 'center', padding: 20}}>{game?.getSummary()}</Text>
        </div>
      </div>
      {/* Render screenshot */}
      <img style={{...styles.screenShot, opacity: game ? 1 : 0}} src={game?.getScreenshotURL()}/>
    </div>
  );
}

let styles: Styles = {
  panel: {
    display: 'flex', 
    flexDirection: 'column',
    maxHeight: '100vh',
  },
  gameContainer: {
    display: 'flex', 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    height: 700,
  },
  gameInfoContainer: {
    marginLeft: 45,
    display: 'flex', 
    flexDirection: 'column',
    width: 500,
    maxHeight: "50%",
    minWidth: "20%",
    maxWidth: "40%",
    overflow: 'auto',
    overflowX: 'clip',
    scrollbarWidth: "none",
    backgroundColor: '#27292b',
    borderRadius: 15,
    boxShadow: '5px rgba(0, 0, 0, 0.5)'
  },
  cover: {
    borderRadius: 15,
    height: "60%",
    borderColor: "white",
    borderWidth: 10,
    boxShadow: '15px rgba(0, 0, 0, 0.5)',
  },
  screenShot: {
    borderRadius: 15,
    height: "300px",
    borderColor: "white",
    borderWidth: 10,
    boxShadow: '15px rgba(0, 0, 0, 0.5)',
    width: '500px',
    alignSelf: 'center'
  },
  logo: {
    height: 50,
  },
  testPanel: {
    display: 'flex', 
    flexDirection: 'column',
    maxHeight: '100vh',
    overflowY: 'auto',
  },
  testGameContainer: {
    display: 'flex', 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    height: 1000,
  },
  backgroundImage:{
    backgroundAttachment: 'fixed',
    backgroundColor: '#cccccc',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height:'300px',
    // backgroundPositionX: 'center',
    // backgroundPositionY: 'center',
  }
}
  


export default GamePanel;