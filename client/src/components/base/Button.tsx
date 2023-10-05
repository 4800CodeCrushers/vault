import { CSSProperties } from 'react';
import { ButtonProps } from '../../types/components'

function Button(props: ButtonProps) {
  // Extract values from the props
  const { color = "#29916e", name, style, disabled = false, onClick, width } = props;
  // The default style applied to the text
  let defaultStyle: CSSProperties = {
    border: 'none',
    color: 'white',
    borderRadius: 25,
    width,
    backgroundColor: color,
    fontSize: "16pt",
    padding: 10,
    paddingRight: 25, 
    paddingLeft: 25, 
    opacity: disabled ? .65 : 1,
    cursor: disabled ? undefined : 'pointer'
  };

  return (
    <button style={{ ...defaultStyle, ...style }} onClick={onClick} disabled = {disabled}>
      {name}
    </button>
  );
}

export default Button;
