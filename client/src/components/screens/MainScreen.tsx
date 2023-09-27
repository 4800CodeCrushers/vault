import { CSSProperties, useEffect, useRef, useState } from "react";
import { ProfilePic, HomePanel, GamePanel, Icon, MenuTab, Text } from '..';
import { Styles, Tabs } from '../../types'
import { Game } from "../../classes";
import { Utility, Janus } from '../../utils';

// troublesome IDs - 15471, 15472, 1945

let lastSelectedTab: "home" | "collection" | "friends" = 'home';
function MainScreen(props: {}) {

  const [selectedTab, setSelectedTab] = useState<Tabs>('home');
  const [showSideMenu, setShowSideMenu] = useState<boolean>(false);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [copiedRecently, setCopiedRecently] = useState<boolean>(false);
  const [game, setGame] = useState<Game>();

  function renderMenu() {
    if (!showSideMenu) return <></>;
    return (
      <div style = {styles.sideMenuContainer}>
        <div style={{width: '100%'}}>
          <div style={styles.sideMenuHeaderContainer}>
            <ProfilePic picture={'Xbox 360'}/>
            <Text style={styles.name} size={'14pt'}>John Smith</Text>
            <div style={{backgroundColor: 'white', width: '85%', height: 1}}/>
          </div>
          <MenuTab name={'Home'} icon={'home'} onClick={() => {setSelectedTab('home'); lastSelectedTab = 'home';}} selected={selectedTab === 'home'}/>
          <MenuTab name={'Collection'} icon={'catelog'} onClick={() => {setSelectedTab('collection'); lastSelectedTab = 'collection';}} selected={selectedTab === 'collection'}/>
          <MenuTab name={'Friends'} icon={'members'} onClick={() => {setSelectedTab('friends'); lastSelectedTab = 'friends';}} selected={selectedTab === 'friends'}/>
        </div>
        <div style={{backgroundColor: 'white', width: 1, height: '100%'}}/>
      </div>
    );
  }

  function renderDropDown() {
    if (!showDropDown) return <></>;

    function onCodeCopy() {
      navigator.clipboard.writeText('123-456-789');
      setCopiedRecently(true);
      setTimeout(() => setCopiedRecently(false), 3500);
    }

    return (
      <div style={styles.dropDownContainer}>
        <ProfilePic picture={'Xbox 360'} size={60}/>
        <Text style={styles.name} size={'14pt'}>John Smith</Text>
        <div style={styles.friendCodeContainer}>
          <Text size={'10pt'} style={{marginRight: 20}} color = {'gray'}>Code: 123-456-789</Text>
          <Icon name={copiedRecently ? 'check' : 'copy'} size={20} onClick={() => onCodeCopy()}/>
        </div>
        <div style={{backgroundColor: 'white', width: '100%', height: 1}}/>
        <MenuTab name={'Settings'} fontSize={18} height={35} onClick={() => {}}/>
        <MenuTab name={'Sign Out'} fontSize={18} height={35} color={'red'} onClick={() => {}}/>
      </div>
    );
  }

  function renderToolbar() {
    return (
      <div style={styles.toolbarContainer}>
        <div style={styles.toolbarContainer}>
          <Icon name="hamburger" size={35} onClick={() => setShowSideMenu(!showSideMenu)} style={{marginRight: 15}}/>
          <Icon name="back" size={35} onClick={lastSelectedTab !== selectedTab ? () => setSelectedTab(lastSelectedTab) : undefined} style={{opacity: lastSelectedTab === selectedTab ? .3 : 1}}/>
        </div>
        <ProfilePic picture={'Xbox 360'} size = {35} padding={5} onClick={() => setShowDropDown(!showDropDown)}/>
        { renderDropDown() }
      </div>  
    );
  }

  return (
    <div style = {styles.screen}>
      { renderMenu() }
      <div style = {styles.panelContainer}>
        { renderToolbar() }
        { selectedTab == 'home' && <HomePanel onGameSelect={game => {setGame(game); setSelectedTab('game');}}/>}
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
  sideMenuContainer: {
    display: 'flex', 
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '15%',
    height: '100vh',
    minWidth: 250,
    overflow: 'hidden',
  },
  sideMenuHeaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 5,
  },
  dropDownContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'absolute', 
    width: 250,
    right: 25, 
    top: 75, 
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#202629',
    boxShadow: '50px rgba(0, 0, 0, 1)'
  },
  friendCodeContainer: {
    flexDirection: 'row', 
    display: 'flex', 
    justifyContent: 'center', 
    marginBottom: 10, 
    alignItems: 'center',

  },
  panelContainer: {
    display: 'flex', 
    flexDirection: 'column',
    height: '100vh',
    width: '100%'
  },
  toolbarContainer: {
    backgroundColor: Utility.getTint('#0e0e0e', 10),
    padding: 10,
    paddingRight: 25,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'

  },
  name: {
    textAlign: 'center', 
    fontWeight: 'bolder',
    display: '-webkit-box',
    WebkitLineClamp: 2, // Set the maximum number of lines to display
    WebkitBoxOrient: 'vertical',
    WebkitUserSelect: 'none',
    overflow: 'hidden', 
    paddingRight: 2, 
    paddingLeft: 2,
    marginTop: 10,
    marginBottom: 10,
  }

}
  
export default MainScreen;
