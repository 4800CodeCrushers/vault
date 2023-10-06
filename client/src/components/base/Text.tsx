import { CSSProperties } from 'react';
import { TextProps } from '../../types/components'

function Text(props: TextProps) {
  // Extract values from the props
  const { color = "white", children, style, size, onClick } = props;
  // The default style applied to the text
  let defaultStyle: CSSProperties = {
    color,
    fontSize: size ?? `calc(12pt + .2vmin)`,
    userSelect: !onClick ? "none" : undefined,
    WebkitUserSelect: !onClick ? "none" : undefined,
    pointerEvents:  !onClick ? 'none' : undefined,
    cursor: !onClick ? undefined : 'pointer'
  };

  return (
    <div dangerouslySetInnerHTML={{__html: props.children ?? ''}} style={{ ...defaultStyle, ...style }} onClick={onClick}/>
  );
}

export default Text;
