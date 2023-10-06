import { CSSProperties, useEffect, useRef, useState } from "react";
import { ProfilePic, HomePanel, GamePanel, Icon, MenuTab, Text, Popup, TextInput, Button, CollectionPanel, FriendsPanel } from '..';
import { Styles, Tabs, PicNames, MainScreenProps } from '../../types'
import { Game, User } from "../../classes";
import { Utility, Janus, State } from '../../utils';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { HexColorPicker } from "react-colorful";

// troublesome IDs - 15471, 15472, 1945


function MainScreen(props: MainScreenProps) {
  
  const [listRef] = useAutoAnimate();
  const [selectedTab, setSelectedTab] = useState<Tabs>('home');
  const [lastSelectedTab, setLastSelectedTab] = useState<Tabs>('home');
  const [showSideMenu, setShowSideMenu] = useState<boolean>(false);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [copiedRecently, setCopiedRecently] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [homeGame, setHomeGame] = useState<Game>();
  const [collectionGame, setCollectionGame] = useState<Game>();
  const [friendGame, setFriendGame] = useState<Game>();
  const [viewedFriend, setViewedFriend] = useState<User | null>(null);
  const [name, setName] = useState<string | undefined>(User.me?.getName());
  const [color, setColor] = useState<string | undefined>(User.me?.getColor());
  const [selectedImage, setSelectedImage] = useState<PicNames | null>(User.me?.getPicture() ?? null);

  useEffect(() => {
    State.creatingAccount = true; 
 }, []);


  async function onUpdateClick() {
    if (!name || !selectedImage || !color) return;
    setLoading(true);
    let response = await Janus.PATCH_ME({name: name, picture: selectedImage, color: color});
    if (response.success) {
      setShowPopup(false);
    }
    else {
      setError(response.message);
      setTimeout(() => setError(undefined), 3500);
    }
    setLoading(false);
  }

  function onBackClick() {
    if (lastSelectedTab === 'home') setHomeGame(undefined);
    else if (lastSelectedTab === 'collection') setCollectionGame(undefined);
    else setFriendGame(undefined);

    if (selectedTab === 'collection' && lastSelectedTab === 'friends' && viewedFriend) setViewedFriend(null);
    
    if (selectedTab === 'game' && lastSelectedTab === 'friends' && viewedFriend) setSelectedTab('collection');
    else setSelectedTab(lastSelectedTab);
  }

  function renderSideMenu() {
    if (!showSideMenu) return <></>;

    function onCodeCopy() {
      if (User.me?.getCode()) navigator.clipboard.writeText(User.me.getCode());
      setCopiedRecently(true);
      setTimeout(() => setCopiedRecently(false), 3500);
    }

    return (
      <div style = {styles.sideMenuContainer}>
        <div style={{width: '100%'}}>
          <div style={styles.sideMenuHeaderContainer}>
            <ProfilePic user={User.me}/>
            <Text style={styles.name} size={'14pt'}>{name}</Text>
            <div style={styles.friendCodeContainer}>
              <Text size={'10pt'} style={{marginRight: 20}}>{`Code: ${User.me?.getCode()}`}</Text>
              <Icon name={copiedRecently ? 'check' : 'copy'} size={20} onClick={() => onCodeCopy()}/>
            </div>  
            <div style={{backgroundColor: 'white', width: '85%', height: 1}}/>
          </div>
          <MenuTab name={'Home'} icon={'home'} onClick={() => {setSelectedTab(homeGame ? 'game':'home'); setLastSelectedTab('home');}} selected={!showPopup && lastSelectedTab === 'home'}/>
          {User.me &&  <MenuTab name={'Collection'} icon={'catelog'} onClick={() => {setSelectedTab(collectionGame ?'game':'collection'); setLastSelectedTab('collection');}} selected={!showPopup && lastSelectedTab === 'collection'}/>}
          {User.me && <MenuTab name={'Friends'} icon={'members'} onClick={() => {setSelectedTab(friendGame ? 'game': (viewedFriend ? 'collection' : 'friends')); setLastSelectedTab('friends');}} selected={!showPopup && lastSelectedTab === 'friends'}/>}
          {User.me && <MenuTab name={'Profile'} icon={'user'} selected = {showPopup} onClick={() => setShowPopup(true)}/> }
          {User.me && <MenuTab name={'Sign Out'} icon={'logout'} onClick={() => props.onLogout()}/>}
        </div>
        <div style={{backgroundColor: 'white', width: 1, height: '100%'}}/>
      </div>
    );
  }
  
  function renderDropDown() {
    if (!showDropDown) return <></>;

    function onCodeCopy() {
      if (User.me?.getCode()) navigator.clipboard.writeText(User.me.getCode());
      setCopiedRecently(true);
      setTimeout(() => setCopiedRecently(false), 3500);
    }

    return (
      <div style={styles.dropDownContainer}>
        <ProfilePic user={User.me} size={60}/>
        <Text style={styles.name} size={'14pt'}>{name}</Text>
        <div style={styles.friendCodeContainer}>
          <Text size={'10pt'} style={{marginRight: 20}}>{`Code: ${User.me?.getCode()}`}</Text>
          <Icon name={copiedRecently ? 'check' : 'copy'} size={20} onClick={() => onCodeCopy()}/>
        </div>
        <div style={{backgroundColor: 'white', width: '100%', height: 1}}/>
        <MenuTab name={'Settings'} fontSize={18} height={35} onClick={() => {setShowPopup(true);setShowDropDown(false);}}/>
        <MenuTab name={'Sign Out'} fontSize={18} height={35} color={'red'} onClick={() => props.onLogout()}/>
      </div>
    );
  }

  function renderToolbar() {
    return (
      <div style={styles.toolbarContainer}>
        <div>
          <Icon 
            name="hamburger" 
            size={35} 
            onClick={() => setShowSideMenu(!showSideMenu)} 
            style={{marginRight: 15}}
            color={showSideMenu ? '#fab400' : undefined}
          />
          <Icon 
            name="back" 
            size={35} 
            onClick={() => onBackClick()} 
            style={{opacity: lastSelectedTab === selectedTab ? .3 : 1}}
          />
        </div>
        {/* {User.me && <ProfilePic user={User.me} size = {35} padding={5} onClick={() => setShowDropDown(!showDropDown)}/>} */}
        {!User.me && <Button name = {'Create Account'} onClick={() => props.onAccountCreate()}/>}
        { renderDropDown() }
      </div>  
    );
  }

  function renderSettings() {

    const images: PicNames[] = [
      'Atari CX40',
      'Gameboy Advance',
      'Gameboy Micro',
      'Gravis Joypad',
      'MAME',
      'Microsoft Xbox',
      'Nintendo 64',
      'Nintendo Family Computer Player 1 Classic',
      'Nintendo Family Computer Player 1',
      'Nintendo Family Computer Player 2 Classic',
      'Nintendo Family Computer Player 2',
      'Nintendo Gamecube',
      'Nintendo NES',
      'Nintendo SNES Alternate',
      'Nintendo SNES',
      'Nintendo Wii',
      'SNK Neo Geo',
      'Sega Dreamcast',
      'Sega Genesis',
      'Sega Mega Drive Alternate',
      'Sega Mega Drive',
      'Sega Saturn',
      'Sony Playstation 2',
      'Sony Playstation 3',
      'Sony Playstation Blue',
      'Sony Playstation Dual Shock',
      'Sony Playstation Green',
      'Sony Playstation Portable',
      'Sony Playstation',
      'Xbox 360'
    ];

    return (
      <div style={styles.settingsContainer}>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 15}}>
          <ProfilePic user={User.me} size={75} style={{marginRight: 20}}/>
          <TextInput 
            placeholder={'Enter name'} 
            value={name} 
            onChange={(text) => {setName(text); User.me?.setName(text)}}
            defaultValue={User.me?.getName()}
            height={40}
            width={275}
            fontSize={20}
          />
        </div>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 15}}>
          <div style={styles.iconsGrid} ref = {listRef}>
            {images.map((image, index) => (
              <img 
                style={{width: 40, height: 40, margin: 5, opacity: selectedImage === image ? 1 : .35}} 
                src={require(`../../assets/icons/${image}.png`)}
                onClick={() => {setSelectedImage(image); User.me?.setPicture(image);}}
                key={index}
              />
            ))}
          </div>
          <HexColorPicker color={User.me?.getColor()} onChange={(c) => { setColor(c); User.me?.setColor(c);}} style={{height: 200}}/>
        </div>
        

        <Button name = {'Update'} disabled = {loading} onClick={() => onUpdateClick()}/>
        {/* Status Text */}
        {error && <Text color={'red'} style={{marginTop: 25}}>{error}</Text>}
      </div>
    );
  }

  return (
    <div style = {styles.screen}>
      { renderToolbar() }
      {/* Render main panel */}
      <div style = {styles.panelContainer}>
        { renderSideMenu() }
        <div style={{width: '100%', paddingTop: 25}}>
          { selectedTab === 'home' && <HomePanel onGameSelect={game => {setHomeGame(game); setSelectedTab('game');}}/>}
          { lastSelectedTab === 'collection' && selectedTab === 'collection' && <CollectionPanel user={User.me} onGameSelect={game => {setCollectionGame(game); setSelectedTab('game');}}/>}
          { selectedTab === 'friends' && <FriendsPanel onFriendSelect={(f) => {setViewedFriend(f); setSelectedTab('collection');}}/>}
          { viewedFriend && lastSelectedTab === 'friends' && selectedTab == 'collection' && <CollectionPanel user = {viewedFriend} onGameSelect={game => {setFriendGame(game); setSelectedTab('game');}}/>}
          { lastSelectedTab === 'home' && homeGame && selectedTab === 'game' && <GamePanel game={homeGame}/>}
          { lastSelectedTab === 'collection' && collectionGame && selectedTab === 'game' && <GamePanel game={collectionGame}/>}
          { lastSelectedTab === 'friends' && friendGame && selectedTab === 'game' && <GamePanel game={friendGame}/>}
        </div>
      </div>
      {/* Render popup */}
      {showPopup && <Popup onClose={() => setShowPopup(false)}>{renderSettings()}</Popup>}
    </div>
  );

}


let styles: Styles = {

  screen: {
    display: 'flex', 
    flexDirection: 'column',
  },
  sideMenuContainer: {
    display: 'flex', 
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '15%',
    height: '95vh',
    minWidth: 250,
    overflow: 'hidden',
  },
  sideMenuHeaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 5,
    marginTop: 10
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
    backgroundColor: '#2b3134',
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
    flexDirection: 'row',
    height: '90vh',
    width: '100%',
  },
  toolbarContainer: {
    backgroundColor: Utility.getTint('#0e0e0e', 10),
    height: '5vh',
    padding: 10,
    paddingRight: 25,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 4,
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
  },
  settingsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    padding: 15,
    paddingRight: 30,
    paddingLeft: 30
  },
  iconsGrid: {
    gridTemplateColumns: 'repeat(auto-fill, minmax(45px, 1fr))',
    gap: '2px',
    display: 'grid',
    width: '100%',
    marginRight: 50
  },
  backdrop: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '100%',
    minHeight: '100%',
    opacity: .26,
    backgroundColor: 'red'
  },

}
  
export default MainScreen;
