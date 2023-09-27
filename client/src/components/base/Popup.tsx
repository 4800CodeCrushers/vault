import { CSSProperties, useState, useRef } from 'react';
import { PopupProps } from '../../types/components'
import { Styles } from '../../types';
import { Icon, Text } from '..';
import { Utility } from '../../utils';

function Popup(props: PopupProps) {
  // Extract values from the props
  const { game, shown, children, onClose} = props;

  if (!shown) return <></>;

  return (
    <div>
      <div style = {styles.popupContainer}>
        {children}
      </div>
      <div style={styles.backdrop} onClick={onClose}/>
    </div>
  );
}


let styles: Styles = {
  popupContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'white',
    borderRadius: 30,
    width: 650,
    height: 550,
    minHeight: '40%',
    maxHeight: '60%',
    minWidth: '40%',
    maxWidth: '60%',
    zIndex: 2,
    background: `linear-gradient(${Utility.getTint('#101010', 15)}, #0e0e0e)`,
    textAlign: 'center',
    overflowY: 'scroll'
  },
  backdrop: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '100%',
    minHeight: '100%',
    opacity: .26,
    backgroundColor: 'black'
  }
}


export default Popup;
