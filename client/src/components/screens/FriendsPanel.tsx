import { CSSProperties, useState, useRef, useEffect } from 'react';
import { Text, TextInput, GameTile, Button, FriendTile } from '..';
import { FriendPanelProps, Styles } from '../../types';
import { Utility, Janus, State } from '../../utils';
import { Game, User } from '../../classes';
import { useAutoAnimate } from '@formkit/auto-animate/react';


function FriendsPanel(props: FriendPanelProps) {
  const { onFriendSelect } = props;
  
  const [listRef, animationEnabled] = useAutoAnimate();
  const [filterText, setFilterText] = useState<string | null>(State.friendCodeText);
  const [loading, setLoading] = useState<boolean>(true);
  const [friends, setFriends] = useState<User[]>([]);
 
  useEffect(() => {
    getMyFriends();
  }, []);

  async function getMyFriends() {
    setLoading(true);
    let response = await Janus.GET_FRIENDS();
    setFriends(response.data.map(info => new User(info)));
    console.log(response);
    setLoading(false);
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
          onRightIconClick={() => {setFilterText(null); State.friendCodeText = null;}} 
          onChange={(text) => { setFilterText(text); State.friendCodeText = text;}} 
        />
      </div>
      {/* Render friend tiles */}
      { !loading && friends.length == 0  && <Text style={{textAlign: 'center'}}>No Friends Added!</Text>}
      <div style = {styles.grid} ref = {listRef}>
        {friends.map(f => <FriendTile key={f.getID()} user={f} onClick={() => onFriendSelect(f)}/>)}
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
    marginBottom: 15
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    width: '80%',
    alignSelf: 'center',
  },
}
  


export default FriendsPanel;
