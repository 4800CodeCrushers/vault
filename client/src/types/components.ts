import { CSSProperties, HTMLInputTypeAttribute } from "react"
import Game from "../classes/Game";


export type TextProps = {
  /** The color of the text. */
  color?: string,
  /** The text size. The default size is 12pt. */
  size?: number | string,
  /** The text to render. */
  children?: string | null | (string | JSX.Element)[]
  /** Additional styling to be applied to the text */
  style?: CSSProperties,
  /** What happens if the text is clicked? */
  onClick?: (e: any) => void,
}

export type TextInputProps = {
  /** The width of the textbox. */
  width?: number | string,
  /** The height of the textbox. */
  height?: number | string,
  /** The width the textbox will grow to when focused. */
  growWidth?: number| string,
  /** The minimum width of the textbox. */
  minWidth?: number| string,
  /** The max characters that can be inputted. */
  maxCharacters?: number,
  /** Additional styling to be applied to the text input */
  style?: CSSProperties,
  /** The palceholder text for the text input. */
  placeholder?: string,
  /** Name of the right icon. */
  rightIcon?: IconName,
  /** Name of the left icon. */
  leftIcon?: IconName,
  /** Function to call when left icon is clicked. */
  onRightIconClick?: () => void,
  /** What type of input is this?  */
  type?: HTMLInputTypeAttribute,
  /** Function to call on submit. */
  onSubmit?: () => void,
  /** Function to call on text change. */
  onChange?: (text: string) => void,
    /** Title of the text input field */
  title?: string,
  /** Color of the text input field */
  backgroundColor?: string,
  /** The text of the text input field */
  value?: string | null,
  /** Can the text input be editted */
  canEdit?: boolean,
  /** Is the textbox automatically focused? */
  autoFocus?: boolean
};

export type MenuTabProps = {
  /** The name of the tab. */
  name: string,
  /** The icon of the tab. */
  icon: IconName,
   /** Is the tab selected?. */
  selected: boolean,
  /** What happens if the option is clicked? */
  onClick: (e: any) => void,
}


export type IconName = 'members' | 'search' | 'eye' | 'eye-closed' | 'close' | 'close-circle' | 'home' | 'catelog' | 'hamburger' | 'back';

export type IconProps = {
  /** The name of the icon. */
  name: IconName,
  /** The icon size. The default size is 30 */
  size?: number | string,
  /** The icon color. The default size is colors.icon */
  color?: string,
  /** What happens if the icon is clicked? */
  onClick?: (e: any) => void,
  /** What should the cursor look like when hovering over the icon? */
  cursor?: 'pointer' | 'default' | 'text'
  /** Additional styling to be applied to the icon */
  style?: CSSProperties,
};

export type GameProps = {
  /** The game to render */
  game: Game,
  /** What happens if the game is clicked? */
  onClick: (game: Game) => void,
}

export type HomePanelProps = {
  /** On Game Select */
  onGameSelect: (game: Game) => void,
}

export type Screens = "main" | "login" | "create";
export type Tabs = "home" | "collection" | "friends" | 'game';
