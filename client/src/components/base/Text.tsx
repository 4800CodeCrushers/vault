import { CSSProperties } from 'react';
import { TextProps } from '../../types/components'

function Text(props: TextProps) {
  // Extract values from the props
  const { color = "white", children, style, size, onClick } = props;
  // The default style applied to the text
  let defaultStyle: CSSProperties = {
    color,
    fontSize: size ?? `calc(12pt + .2vmin)`,
    userSelect: "none",
    pointerEvents: 'none'
    
  };

  return (
    <div style={{ ...defaultStyle, ...style }} onClick={onClick}>
      {children}
    </div>
  );
}

export default Text;
