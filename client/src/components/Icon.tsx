import { CSSProperties } from "react";
import { IconProps, IconName } from "../types/components";

import { MdPushPin, MdGroups2, MdSettings, MdSearch, MdCreate } from "react-icons/md";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { AiOutlineClose, AiOutlineCloseCircle } from "react-icons/ai";


function Icon(props: IconProps) {
  // Extract values from the props
  const {name = "pin", color = "white", size = 30, onClick, style, cursor = "pointer"} = props;
  // The default style applied to the button
  let defaultStyle: CSSProperties = {
      color,
      cursor: onClick ? cursor : undefined, 
      width: size ?? "2em", 
      height: size ?? "2em", 
  };
  // Get the icon based on the name
  const icon: JSX.Element = getIcon(name);

  return <icon.type style={{...defaultStyle, ...style}} onClick = {onClick}/>;
}


/** Return the corresponding JSX.Element given an icon name  */
function getIcon (name: IconName) {
  // Keep adding new icons to this case statement
  // Kinda annoying, but clean way to render icons
  switch (name) {
    case 'pin': return <MdPushPin/>;
    case 'members': return <MdGroups2/>;
    case 'settings': return <MdSettings/>;
    case 'search': return <MdSearch/>;
    case 'pencil': return <MdCreate/>;
    case 'eye': return <GoEye/>;
    case 'eye-closed': return <GoEyeClosed/>;
    case 'close': return <AiOutlineClose/>;
    case 'close-circle': return <AiOutlineCloseCircle/>;
  }
}

export default Icon;
