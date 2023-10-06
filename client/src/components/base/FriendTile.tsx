import { CSSProperties, useState, useRef } from 'react';
import { FriendTileProps } from '../../types/components'
import { Styles } from '../../types';
import { Icon, ProfilePic, Text } from '..';
import { Janus } from '../../utils';

function FriendTile(props: FriendTileProps) {
  // Extract values from the props
  const { user, onClick, editing, onDeleteClick } = props;
  const [hovering, setHovering] = useState<boolean>(false);

  return (
    <div 
      style = {{
        ...styles.container, 
        transform: hovering ? 'scale(1.03)' : 'scale(1)', 
        borderColor: hovering ? 'white': 'gray',
        zIndex: hovering ? 3 : 1,
      }} 
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)} 
      onClick={!editing ? () => onClick(user) : () => onDeleteClick(user)}
    >
      {/* Profile pic */}
      <ProfilePic user={user}/>
      {/* Title text */}
      <Text style={styles.name} size={'12pt'}>{user.getName()}</Text>
      {/* Delete button */}
      {editing && <Icon style={{position: 'absolute', top: 0, left: 20}} name={'close-circle'} color={hovering ? undefined : undefined}/>}
    </div>
  );
}


let styles: Styles = {
  container: {
    width: 150,
    margin: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  name: {
    textAlign: 'center', 
    display: '-webkit-box',
    WebkitUserSelect: 'none',
    WebkitLineClamp: 2, // Set the maximum number of lines to display
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden', 
    fontWeight:'bold',
    paddingRight: 2, 
    paddingLeft: 2,
    marginTop: 10
  },
}


export default FriendTile;
