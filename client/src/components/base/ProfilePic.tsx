import { CSSProperties, useState, useRef } from 'react';
import { ProfilePicProps } from '../../types/components'
import { Styles } from '../../types';
import { Icon, Text } from '..';
import { Utility } from '../../utils';
import { updateInterfaceDeclaration } from 'typescript';

function ProfilePic(props: ProfilePicProps) {
  // Extract values from the props
  const { picture, size = 80, color = '#29916e', padding = 15, onClick, style} = props;
  let width = size; let height = size; let borderRadius = "100%";
  let background = `linear-gradient(${Utility.getShade(color, 75)}, ${color})`;
  const [hovering, setHovering] = useState<boolean>();


  return (
    <div 
      style={{ background, width, height, borderRadius, padding, 
        opacity: (hovering || onClick == undefined) ? 1 : .85, 
        ...styles.imageContainer, ...style
      }} 
      onClick={onClick} 
      onMouseEnter={() => setHovering(true)} 
      onMouseLeave={() => setHovering(false)}
    >
      <img style={styles.image} src={require(`../../assets/icons/${picture}.png`)}/>
    </div>
  );
}


let styles: Styles = {
  imageContainer: {
    display: 'flex', 
    justifyContent: 'center', 
    alignContent: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'white',
  },
  image: {
    width: '100%', 
    pointerEvents: 'none', 
    userSelect: 'none',
    WebkitBoxOrient: 'vertical',
    WebkitUserSelect: 'none',
  },
}


export default ProfilePic;
