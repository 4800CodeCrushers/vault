import { CSSProperties } from "react"

export type IconName = 'pin' | 'settings' | 'members' | 
'search' | 'eye' | 'eye-closed' | 
'close' | 'close-circle' | 'pencil';

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
