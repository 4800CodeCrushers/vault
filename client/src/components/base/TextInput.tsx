import React, { useRef, useState } from "react";
import { TextInputProps, Styles } from "../../types"; 
import {Icon, Text} from "../";


function TextInput(props: TextInputProps) {
  // Extract values from the props
  const { minWidth, placeholder = 'Search', width = "50%", height = 50, canEdit = true, backgroundColor = '#363636', autoFocus = false, fontSize = 24} = props;
  // A reference to the input field
  const inputRef: any = useRef(null);
  // Is the textbox focused
  const [focused, setFocused] = useState<boolean>(false);

  /** Render the text input */
  function renderTextInput() {
    /** Function to call when the text changes */ 
    function onChange() {
      if(props.onChange) props.onChange(inputRef.current.value);
    }
    /** Function to call when the user presses the Enter key */
    function onEnter(event: React.KeyboardEvent<HTMLInputElement>) {
      if (event.key === 'Enter' && props.onSubmit) {
        props.onSubmit();
      }
    }
    
    return <input 
      ref={inputRef} 
      style={{...styles.text, backgroundColor, fontSize}} 
      placeholder = {placeholder} 
      maxLength={props.maxCharacters} 
      onChange={() => onChange()} 
      onKeyDown={(event) => onEnter(event)} 
      type = {props.type} 
      defaultValue={props.defaultValue ?? ""}
      value={props.value ?? ""} 
      readOnly = {!canEdit} 
      autoFocus = {autoFocus}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    /> 
        
  }
  /** Render the left icon */  
  function renderLeftIcon() {
    if (!props.leftIcon) return <></>;
    return(
      <div style={styles.leftIconContainer}>
          <Icon size = {35} name={props.leftIcon} onClick = {() => inputRef.current.focus()} cursor = {'text'}/>
      </div>
    );
  }
  /** Render the right icon */
  function renderRightIcon() {
    if (!props.rightIcon) return <></>;
    return(
      <div style={styles.rightIconContainer}>
        <Icon size = {30} name={props.rightIcon} onClick = {props.onRightIconClick}/>
      </div>
    );
  }
    
  return (
    <div style={{...styles.container,...props.style, height, minWidth, width }}>
      {/* The title of the text input */}
      {props.title && <Text size={'12pt'} style={styles.title}>{props.title}</Text>}
      {/* The text input and icons */}
      <div style = {{...styles.textInputContainer, backgroundColor,  borderWidth: focused ? 2 : 1 }}>
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
    borderColor: 'white',
    borderStyle: 'solid',
  },
  leftIconContainer: {
    height: "100%",
    display:'flex',
    alignItems:'center',
    marginLeft: 5
  },
  rightIconContainer: {
    height: "100%",
    marginLeft: 2,
    display:'flex',
    alignItems:'center',
    marginRight: 5
  },
  text: { 
    border: "none",
    outline: "none", 
    flexGrow: 1,
    width: "100%",
    color: 'white',
    borderRadius: 25,
    padding: 5,
  },
  title: { 
    marginBottom: 5,
    marginLeft: 5,
    userSelect: 'none',
  },
  
};

export default TextInput;
