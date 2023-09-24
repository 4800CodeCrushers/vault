import { CSSProperties, useState } from 'react';
import { MenuTabProps } from '../../types/components'
import { Styles } from '../../types';
import { Icon, Text } from '../';

function MenuTab(props: MenuTabProps) {
  // Extract values from the props
  const { name, icon, onClick, selected } = props;

  const [hovering, setHovering] = useState<boolean>(false);

  let containerStyle: CSSProperties =  {
    display: 'flex', 
    flexDirection: 'row',
    opacity: selected || hovering ? 1 : .5,
    height: 50,
    alignItems: 'center',
    margin: '10px 10px 10px 30px',
  }

  return (
    <div style={containerStyle} onClick={onClick} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
      <Icon name={icon} size={40} color={selected ? '#29916e' : undefined}/>
      <Text size={24} style={{fontWeight: 'bold', marginLeft: 15}} color={selected ? '#29916e' : undefined}>{name}</Text>
    </div>
  );
}




export default MenuTab;
