import { CSSProperties } from "react";
import { IconProps, IconName } from "../../types/components";

import { MdGroups2, MdSearch } from "react-icons/md";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { AiOutlineClose, AiFillCaretDown, AiFillCaretUp, AiFillHome, AiFillCopy, AiFillCloseCircle } from "react-icons/ai";
import { BiSolidCategoryAlt, BiLogOut } from "react-icons/bi";
import { BsFillCheckCircleFill, BsBookmarkStar, BsFillBookmarkStarFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiArrowLeft } from "react-icons/hi";
import { ImPlus, ImMinus } from "react-icons/im";
import { CgProfile } from "react-icons/cg";
import { PiPencilSimple, PiPencilSimpleSlash } from "react-icons/pi";


function Icon(props: IconProps) {
  // Extract values from the props
  const {name = "members", color = "white", size = 30, onClick, style, cursor = "pointer"} = props;
  // The default style applied to the icon
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
    case 'members': return <MdGroups2/>;
    case 'search': return <MdSearch/>;
    case 'eye': return <GoEye/>;
    case 'eye-closed': return <GoEyeClosed/>;
    case 'close': return <AiOutlineClose/>;
    case 'close-circle': return <AiFillCloseCircle/>;
    case 'home': return <AiFillHome/>;
    case 'catelog': return <BiSolidCategoryAlt/>;
    case 'hamburger': return <GiHamburgerMenu/>;
    case 'back': return <HiArrowLeft/>;
    case 'copy': return <AiFillCopy/>;
    case 'check': return <BsFillCheckCircleFill/>;
    case 'wishlist': return <BsBookmarkStar/>;
    case 'wishlist-fill': return <BsFillBookmarkStarFill/>;
    case 'plus': return <ImPlus/>;
    case 'minus': return <ImMinus/>;
    case 'user': return <CgProfile/>;
    case 'logout': return <BiLogOut/>;
    case 'up': return <AiFillCaretUp/>;
    case 'down': return <AiFillCaretDown/>;
    case 'pencil': return <PiPencilSimple/>;
    case 'pencil-stop': return <PiPencilSimpleSlash/>;
  }
}

export default Icon;
