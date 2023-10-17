import { CSSProperties } from 'react';
import { Text } from '..';
import { GamePanelProps, Styles } from '../../types';
import { Utility, Janus } from '../../utils';
import NewRatting from '../base/Rating';



function GamePanel(props: GamePanelProps) {
  // Extract values from the props
  const { game } = props;

  // splitting this up just to visualize it better
  // sorry if it looks bad
  return (
    <div style = {styles.panel}>
      {/* Render game info */}

      {/* <div style={styles.gameContainer}> */}

        {/* Render Background image*/}

        <img style={{...styles.backgroundImage, opacity: game ? 1: 0}} src={game?.getScreenshotURL()} alt='Visual Preview of Game'/>

        {/* Render game info */}

        <div style={styles.testGameContainer}>

        {/* Render image */}

        <img style={{...styles.testCover, opacity: game ? 1 : 0}} src={game?.getCoverURL()}/>

        {/* Render text */}

        {/* <div style = {{...styles.gameInfoContainer, opacity: game ? 1 : 0}}> */}

        <div style = {{...styles.testgameInfoContainer, opacity: game ? 1 : 0}}>

          {/* Title */}

          {/* <Text size={30} style = {{textAlign: 'left', fontWeight: 'bold', padding:50}} color={"#29916e"}>{game?.getName()}</Text> */}

          <Text size={30} style = {{textAlign: 'left', fontWeight: 'bold'}} color={"#29916e"}>{game?.getName()}</Text>

          {/* Release date and developer */}

          {/* <div style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-evenly', alignContent: 'center', padding: 5}}> */}
          <div style={{width: '100%', alignContent: 'left'}}>

            {/* <Text size={22} style={{alignSelf: 'center'}}>{game?.getReleaseDate()}</Text> */}
            <Text size={22} style={{textAlign: 'left'}}>{game?.getReleaseDate()}</Text>
            
            <Text size={22} style={{textAlign: 'left'}}>{String(calculateRating(game?.getRating()))}</Text>

            <NewRatting> 
              intitalRating = {3.5}
              readonly
              emptySymbol="fa fa-star-o fa-2x"
              fullSymbol="fa fa-star fa-2x"
              fractions = {2}
            </NewRatting>

          </div>

          {/* Summary */}

          {/* <Text size={20} color={"#757575"} style={{ textAlign: 'center', alignSelf: 'center', padding: 20}}>{game?.getSummary()}</Text> */}

        </div>

      </div>

      <Text size={20} color={"#757575"} style={{ textAlign: 'center', alignSelf: 'center', padding: 20}}>{game?.getSummary()}</Text>

      {/* Render screenshot */}

      <img style={{...styles.screenShot, opacity: game ? 1 : 0}} src={game?.getScreenshotURL()}/>

    </div>
  );
}

function calculateRating(num: number)
{
  num /= 20;
  let n = num.toFixed(1);
  return n;
}

let styles: Styles = {
  panel: {
    display: 'flex', 
    flexDirection: 'column',
    height: '100%',
    overflowY: 'auto',
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
    backgroundColor: '#383533',
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
    height: '100%',
    overflowY: 'auto',
    flexFlow: 'row nowrap'
  },
  testGameContainer: {
    display: 'flex', 
    flexDirection: 'row',
    // justifyContent: 'center', 
    backgroundColor: '#383533',
    // alignItems: 'center',
    // height: '1000px',
    // boxShadow: '5px rgba(0, 0, 0, 0.5)'
  },
  backgroundImage:{
    // objectFit: 'cover',
    backgroundAttachment: 'fixed',
    backgroundColor: '#cccccc',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height:'400px',
    // backgroundPositionX: 'center',
    // backgroundPositionY: 'center',
  },
  testCover: {
    borderRadius: 15,
    height: "60%",
    borderColor: "white",
    borderWidth: 10,
    boxShadow: '15px rgba(0, 0, 0, 0.5)',
    padding: '50px',
    justifyContent: 'left',
  },
  // testGameInfoContainer: {
  //   marginLeft: 45,
  //   display: 'flex', 
  //   flexDirection: 'column',
  //   width: 500,
  //   // maxHeight: "50%",
  //   // minWidth: "20%",
  //   // maxWidth: "40%",
  //   overflow: 'auto',
  //   overflowX: 'clip',
  //   scrollbarWidth: "none",
  //   backgroundColor: '#4DFFA6',
  //   borderRadius: 15,
  //   boxShadow: '5px rgba(0, 0, 0, 0.5)'
  // },

  gameInfoPanel:{
    boxSizing: 'border-box',
    width: '100%',
    flex: 'none',
    padding: '15px',
    marginLeft: '-100%'
  },
  testGameInfoContainer: {
    // marginLeft: 45,
    display: 'flex', 
    flexDirection: 'column',
    // width: 500,
    overflow: 'auto',
    overflowX: 'clip',
    scrollbarWidth: "none",
    // backgroundColor: '#428FA6',
    borderRadius: 15,
    // boxShadow: '5px rgba(0, 0, 0, 0.5)'
  },


  // testButtonContainer: {
  //   width: '100%', 
  //   height: 250,
  //   display: 'flex',
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center'
  // } 
  // ???????????????
  // <div style={styles.buttonContainer}>
  // <div onClick={() => onClick(game)} style={{width: '100%', height: 250, position: 'absolute'}}/>
  // {User.me && hovering && <Icon size={50} name={wished ? 'wishlist-fill' : 'wishlist'} style={{marginRight: 20, zIndex: 4}} onClick={() => onWishlistClick()}/>}
  // {User.me && hovering && <Icon size={50} name={collected ? 'minus' : 'plus'} style={{zIndex: 4}} onClick={() => onCollectionClick()}/>}
}
  


export default GamePanel;