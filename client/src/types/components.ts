import { CSSProperties } from "react"

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