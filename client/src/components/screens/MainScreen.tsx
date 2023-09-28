import { CSSProperties, useEffect, useRef, useState } from "react";
import { ProfilePic, HomePanel, GamePanel, Icon, MenuTab, Text, Popup, TextInput } from '..';
import { Styles, Tabs, PicNames, MainScreenProps } from '../../types'
import { Game, User } from "../../classes";
import { Utility, Janus, State } from '../../utils';
import { useAutoAnimate } from '@formkit/auto-animate/react';

// troublesome IDs - 15471, 15472, 1945

let lastSelectedTab: "home" | "collection" | "friends" = 'home';
function MainScreen(props: MainScreenProps) {
  
  const [listRef] = useAutoAnimate();
  const [selectedTab, setSelectedTab] = useState<Tabs>('home');
  const [showSideMenu, setShowSideMenu] = useState<boolean>(false);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [copiedRecently, setCopiedRecently] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [game, setGame] = useState<Game>();
  const [name, setName] = useState<string | undefined>(User.me?.getName());
  const [selectedImage, setSelectedImage] = useState<PicNames>(User.me?.getPicture() ?? 'Xbox 360');

  useEffect(() => {
    State.creatingAccount = true; 
 }, []);


  async function onUpdateClick() {
    if (!name || !selectedImage) return;
    setLoading(true);
    let response = await Janus.PATCH_ME({name: name, picture: selectedImage});
    if (response.success) {
      setShowPopup(false);
    }
    else {
      setError(response.message);
      setTimeout(() => setError(undefined), 3500);
    }
    setLoading(false);
  }

  function rendeSideMenu() {
    if (!showSideMenu) return <></>;
    return (
      <div style = {styles.sideMenuContainer}>
        <div style={{width: '100%'}}>
          <div style={styles.sideMenuHeaderContainer}>
            <ProfilePic picture={selectedImage}/>
            <Text style={styles.name} size={'14pt'}>{name}</Text>
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
      if (User.me?.getCode()) navigator.clipboard.writeText(User.me.getCode());
      setCopiedRecently(true);
      setTimeout(() => setCopiedRecently(false), 3500);
    }

    return (
      <div style={styles.dropDownContainer}>
        <ProfilePic picture={selectedImage} size={60}/>
        <Text style={styles.name} size={'14pt'}>{name}</Text>
        <div style={styles.friendCodeContainer}>
          <Text size={'10pt'} style={{marginRight: 20}} color = {'gray'}>{`Code: ${User.me?.getCode()}`}</Text>
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
          <Icon name="hamburger" size={35} onClick={() => setShowSideMenu(!showSideMenu)} style={{marginRight: 15}}/>
          <Icon name="back" size={35} onClick={lastSelectedTab !== selectedTab ? () => setSelectedTab(lastSelectedTab) : undefined} style={{opacity: lastSelectedTab === selectedTab ? .3 : 1}}/>
        </div>
        {User.me && <ProfilePic picture={selectedImage} size = {35} padding={5} onClick={() => setShowDropDown(!showDropDown)}/>}
        {!User.me && <button style={styles.createAccountButton} onClick={() => props.onAccountCreate()}>Create Account</button>}
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
          <ProfilePic picture={selectedImage} size={75} style={{marginRight: 20}}/>
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
        <button style={{...styles.updateButton, opacity: loading ? .5 : 1}} onClick={() => onUpdateClick()}>Update</button>
        {/* Status Text */}
        {error && <Text color={'red'} style={{marginTop: 25}}>{error}</Text>}
      </div>
    );
  }

  return (
    <div style = {styles.screen}>
      { rendeSideMenu() }
      {/* Render main panel */}
      <div style = {styles.panelContainer}>
        { renderToolbar() }
        { selectedTab == 'home' && <HomePanel onGameSelect={game => {setGame(game); setSelectedTab('game');}}/>}
        { game && selectedTab == 'game' && <GamePanel game={game}/>}
      </div>
      {/* Render popup */}
      {showPopup && <Popup onClose={() => setShowPopup(false)}>{renderSettings()}</Popup>}
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
    alignItems: 'center',
    zIndex: 4,
    marginBottom: 20
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
    padding: 15
  },
  iconsGrid: {
    gridTemplateColumns: 'repeat(auto-fill, minmax(45px, 1fr))',
    gap: '2px',
    display: 'grid',
    width: '100%',
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
  updateButton: {
    border: 'none',
    backgroundColor: '#29916e',
    color: 'white',
    width: 100,
    height: 50,
    borderRadius: 25,
    fontSize: "16pt",
    marginTop: 40
  },
  createAccountButton: {
    border: 'none',
    backgroundColor: '#29916e',
    color: 'white',
    borderRadius: 25,
    padding: 10,
    fontSize: 13,
  },

}
  
export default MainScreen;
