import { CSSProperties, useState } from 'react';
import { MenuTabProps } from '../../types/components'
import { Styles } from '../../types';
import { Icon, Text } from '../';
import { Utility } from '../../utils';

function MenuTab(props: MenuTabProps) {
  // Extract values from the props
  const { name, icon, onClick, selected = false, fontSize = 24, height = 50, color } = props;

  const [hovering, setHovering] = useState<boolean>(false);

  let containerStyle: CSSProperties =  {
    display: 'flex', 
    flexDirection: 'row',
    opacity: selected || hovering ? 1 : .8,
    height,
    width: '100%',
    alignItems: 'center',
    backgroundColor: hovering ? Utility.getTint('#0e0e0e', 25) : undefined,
    paddingLeft: 30,
    overflow: 'hidden',

  }

  return (
    <div 
      style={containerStyle} 
      onClick={onClick} 
      onMouseEnter={() => setHovering(true)} 
      onMouseLeave={() => setHovering(false)}
    >
      {icon && <Icon name={icon} size={40} color={selected ? '#fab400' : undefined} style={{marginRight: 15}}/>}
      <Text size={fontSize} style={{fontWeight: 'bold'}} color={color ?? (selected ? '#fab400' : undefined)}>{name}</Text>
    
    </div>
  );
}




export default MenuTab;
