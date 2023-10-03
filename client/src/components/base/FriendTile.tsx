import { CSSProperties, useState, useRef } from 'react';
import { FriendTileProps } from '../../types/components'
import { Styles } from '../../types';
import { Icon, ProfilePic, Text } from '..';
import { Janus } from '../../utils';

function FriendTile(props: FriendTileProps) {
  // Extract values from the props
  const { user, onClick } = props;
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
      onClick={() => onClick(user)}
    >
      {/* Profile pic */}
      <ProfilePic user={user}/>
      {/* Title text */}
      <Text style={styles.name} size={'10pt'}>{user.getName()}</Text>
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
    paddingRight: 2, 
    paddingLeft: 2,
    marginTop: 10
  },
}


export default FriendTile;
