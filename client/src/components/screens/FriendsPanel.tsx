import { CSSProperties, useState, useRef, useEffect } from 'react';
import { Text, TextInput, GameTile, Button } from '..';
import { HomePanelProps, Styles } from '../../types';
import { Utility, Janus, State } from '../../utils';
import { Game, User } from '../../classes';
import { useAutoAnimate } from '@formkit/auto-animate/react';


function FriendsPanel(props: {}) {
  const {  } = props;

  const [filterText, setFilterText] = useState<string | null>(State.filterText);
  const [loading, setLoading] = useState<boolean>(true);
 
  useEffect(() => {
    getMyFriends();
  }, []);

  async function getMyFriends() {
    setLoading(true);
    let response = await Janus.GET_FRIENDS();
  }

  /** Runs when the user scrolls through the games */
  function onScroll (e: React.UIEvent<HTMLElement>) {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
    if(bottom) {
      console.log('here');
    }
  }

  return (
    <div onScroll={onScroll} style = {styles.panel}>
      {/* Render Input Section */}
      <div style = {styles.inputContainer}>
        <TextInput 
          value={filterText} 
          defaultValue={filterText}
          placeholder="Enter a friend code" 
          leftIcon={'search'} 
          rightIcon={filterText ? 'close' : undefined} 
          // onRightIconClick={() => {setFilterText(null); State.filterText = null;}} 
          // onChange={(text) => { setFilterText(text); State.filterText = text;}} 
        />
      </div>
    </div>
  );
}


let styles: Styles = {
  panel: {
    display: 'flex', 
    flexDirection: 'column',
    height: '100vh',
    overflowY: 'auto',
  },
  inputContainer: {
    display: 'flex', 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    width: '80%',
    alignSelf: 'center',
  },
}
  


export default FriendsPanel;
