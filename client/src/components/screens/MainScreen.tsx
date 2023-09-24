import { CSSProperties, useEffect, useRef, useState } from "react";
import { Text, HomePanel, GamePanel, Icon, MenuTab } from '..';
import { Styles, Tabs } from '../../types'
import { Game } from "../../classes";
import { Utility, Janus } from '../../utils';

// troublesome IDs - 15471, 15472, 1945

let lastSelectedTab: "home" | "collection" | "friends" = 'home';

function MainScreen(props: {}) {

  const [selectedTab, setSelectedTab] = useState<Tabs>('home');
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [game, setGame] = useState<Game>();

  function renderMenu() {
    if (!showMenu) return <></>;
    return (
      <div style = {styles.menuContainer}>
        <div>
          <MenuTab name={'Home'} icon={'home'} onClick={() => {setSelectedTab('home'); lastSelectedTab = 'home';}} selected={selectedTab === 'home'}/>
          <MenuTab name={'Collection'} icon={'catelog'} onClick={() => {setSelectedTab('collection'); lastSelectedTab = 'collection';}} selected={selectedTab === 'collection'}/>
          <MenuTab name={'Friends'} icon={'members'} onClick={() => {setSelectedTab('friends'); lastSelectedTab = 'friends';}} selected={selectedTab === 'friends'}/>
        </div>
        <div style={{backgroundColor: 'white', width: 1, height: '100%'}}/>
      </div>
    );
  }

  return (
    <div style = {styles.screen}>
      { renderMenu() }
      <div style = {{...styles.panelContainer, width: !showMenu ? '100%' : '85%'}}>
        <div style={styles.menuIconsContainer}>
          <Icon name="hamburger" size={35} onClick={() => setShowMenu(!showMenu)}/>
          <Icon name="back" size={35} onClick={lastSelectedTab !== selectedTab ? () => setSelectedTab(lastSelectedTab) : undefined} style={{opacity: lastSelectedTab === selectedTab ? .3 : 1, marginLeft: 20}}/>
        </div>  
        { selectedTab == 'home' && <HomePanel onGameSelect={game => {setGame(game); setSelectedTab('game')}}/>}
        { game && selectedTab == 'game' && <GamePanel game={game}/>}
      </div>
    </div>
  );

}


let styles: Styles = {

  screen: {
    display: 'flex', 
    flexDirection: 'row',
  },
  menuContainer: {
    display: 'flex', 
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '15%',
    height: '100vh'
  },
  panelContainer: {
    display: 'flex', 
    flexDirection: 'column',
    height: '100vh'
  },
  menuIconsContainer: {
    backgroundColor: Utility.getTint('#0e0e0e', 10),
    padding: 10
  },

}
  
export default MainScreen;
