import React, { useRef, useState } from "react";
import { TextInputProps, Styles } from "../../types"; 
import {Icon, Text} from "../";


function TextInput(props: TextInputProps) {
  // Extract values from the props
  const { minWidth, placeholder = 'Search', width = "50%", height = 70, canEdit = true, backgroundColor = '#363636', autoFocus = false} = props;
  // A reference to the input field
  const inputRef: any = useRef(null);
  // The text in the textbox
  const [text, setText] = useState<string>('');

  /** Render the text input */
  function renderTextInput() {
    /** Function to call when the text changes */ 
    function onChange() {
      setText(inputRef.current.value);
      if(props.onChange) props.onChange(inputRef.current.value);
    }
    /** Function to call when the user presses the Enter key */
    function onEnter(event: React.KeyboardEvent<HTMLInputElement>) {
      if (event.key === 'Enter' && props.onSubmit) {
        props.onSubmit();
      }
    }
    
    return <input ref={inputRef} style={{...styles.text, backgroundColor}} placeholder = {placeholder} maxLength={props.maxCharacters} onChange={() => onChange()} onKeyDown={(event) => onEnter(event)} type = {props.type} value={props.value ?? undefined} readOnly = {!canEdit} autoFocus = {autoFocus}/> 
        
  }
  
  /** Render the left icon */  
  function renderLeftIcon() {
    if (!props.leftIcon) return <></>;
    return(
      <div style={styles.leftIconContainer}>
          <Icon size = {50} name={props.leftIcon} onClick = {() => inputRef.current.focus()} cursor = {'text'}/>
      </div>
    );
  }
  /** Render the right icon */
  function renderRightIcon() {
    if (!props.rightIcon) return <></>;
    return(
      <div style={styles.rightIconContainer}>
        <Icon size = {40} name={props.rightIcon} onClick = {props.onRightIconClick}/>
      </div>
    );
  }
    
  return (
    <div style={{...styles.container,...props.style, height, minWidth, width }}>
      {/* The title of the text input */}
      {props.title && <Text size={'12pt'} style={styles.title}>{props.title}</Text>}
      {/* The text input and icons */}
      <div style = {{...styles.textInputContainer, backgroundColor }}>
        {renderLeftIcon()}
        {renderTextInput()}
        {renderRightIcon()}
      </div>
    </div>
  );
}


const styles: Styles = {
  container: {
    display: 'flex', 
    flexDirection: 'column',
  },
  textInputContainer: {
    borderRadius: 25,
    display: "flex",
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 5,
    paddingRight: 5,
    borderWidth: 3,
    borderColor: 'white',
    borderStyle: 'solid',
  },
  leftIconContainer: {
    height: "100%",
    marginRight: 2,
    display:'flex',
    alignItems:'center',
  },
  rightIconContainer: {
    height: "100%",
    marginLeft: 2,
    display:'flex',
    alignItems:'center',
  },
  text: { 
    border: "none",
    outline: "none", 
    flexGrow: 1,
    width: "100%",
    fontSize: 40,
    color: 'white',
    borderRadius: 25,
    margin: '0px 10px 0px 0px',
  },
  title: { 
    marginBottom: 5,
    marginLeft: 5,
    userSelect: 'none',
  },
  
};

export default TextInput;
