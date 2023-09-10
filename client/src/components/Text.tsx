import { TextProps } from '../types/components'

function Text(props: TextProps) {
  const {children = 'Vault', color = 'black', size='12pt'} = props;
  return (
    <div style = {{color: color, fontSize: size}}>
      {children}
    </div>
  );
}

export default Text;
