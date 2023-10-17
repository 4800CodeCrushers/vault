import { CSSProperties, useState, useRef, useEffect } from 'react';
import { Text, TextInput, GameTile, Button, FriendTile, Icon } from '..';
import { FriendPanelProps, Styles } from '../../types';
import { Utility, Janus, State } from '../../utils';
import { Game, User } from '../../classes';
import { useAutoAnimate } from '@formkit/auto-animate/react';


function FriendsPanel(props: FriendPanelProps) {
  const { onFriendSelect } = props;
  
  const [listRef, animationEnabled] = useAutoAnimate();
  const [codeText, setCodeText] = useState<string | null>(State.friendCodeText);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [friends, setFriends] = useState<User[]>([]);
  const [statusText, setStatusText] = useState<string | null>(null);
 
  useEffect(() => {
    getMyFriends();
  }, []);

  async function getMyFriends() {
    setLoading(true);
    let response = await Janus.GET_FRIENDS();
    if (response.success) {
      setFriends(response.data.map(info => new User(info)));
    }
    setLoading(false);
  }

  async function addFriend() {
    if (!codeText) return;
    let response = await Janus.ADD_TO_FRIENDS(codeText);
    if (response.success) {
      setFriends(old => old.concat(new User(response.data)));
    }
    setStatusText(response.message);
    setTimeout(() => setStatusText(null), 3000);
  }

  async function removeFriend(friend: User) {
    let index = friends.indexOf(friend);
    setFriends(friends.slice(0,index).concat(friends.slice(index + 1)));
    let response = await Janus.REMOVE_FROM_FRIENDS(friend.getID());
    setStatusText(response.message);
    setTimeout(() => setStatusText(null), 3000);
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
        {/* <Button name = {editing ? 'Stop' : "Edit"} disabled = {loading} style={{marginRight: 15}} onClick={() => setEditing(!editing)}/> */}
        <TextInput 
          value={codeText} 
          defaultValue={codeText}
          placeholder="Enter a friend code" 
          leftIcon={'search'} 
          rightIcon={codeText ? 'close' : undefined} 
          onRightIconClick={() => {setCodeText(null); State.friendCodeText = null;}} 
          onChange={(text) => { setCodeText(text.length > 0 ? text : null); State.friendCodeText = text;}} 
          onSubmit={() => addFriend()}
        />
        <Icon style={{marginLeft: 15}} size={35} name={editing ? 'pencil-stop' : 'pencil'} onClick={() => setEditing(!editing)}/>
        {/* <Button name = {"Add"} disabled = {codeText == null || loading} style={{marginLeft: 15}} onClick={() => addFriend()}/> */}
      </div>
      {/* Render friend tiles */}
      <div style={{height: 30}}>
        { statusText && <Text style={{textAlign: 'center'}}>{statusText}</Text>}
      </div>
      <div style = {styles.grid} ref = {listRef}>
        {friends.map(f => 
          <FriendTile 
            key={f.getID()} 
            user={f} 
            editing = {editing}
            onClick={() => onFriendSelect(f)}
            onDeleteClick={() => removeFriend(f)}
          />
        )}
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
    padding: '20px 20px 0px 20px',
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
