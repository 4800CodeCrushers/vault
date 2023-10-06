import { useState } from "react";
import { Text, Button, TextInput } from '..';
import { Styles, LandingScreenProps } from '../../types'
import { User } from "../../classes";
import { Janus, State } from '../../utils';
import { useAutoAnimate } from '@formkit/auto-animate/react';

let createFields: string[] = ['Name', 'Email', 'Password', 'Confirm password'];
let loginFields: string[] = ['Email', 'Password'];

function LandingScreen(props: LandingScreenProps) {

  const [listRef, animationEnabled] = useAutoAnimate();
  const [creating, setCreating] = useState<boolean>(State.creatingAccount);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [name, setName] = useState<string>();

  async function onButtonPress() {
    setLoading(true);
    if (creating) {
      if (!email || !password || !name) return;
      let response = await Janus.CREATE_ACCOUNT(email, password, name);
      console.log(response.message);
      if (response.success) {
        
      }
    }
    else {
      if (!email || !password) return;
      let response = await Janus.LOGIN(email, password);
      if (response.success) {
        User.me = new User(response.data);
        props.onLogin();
      }
      else {
        setError(response.message);
        setTimeout(() => setError(undefined), 3500);
      }
    }
    setLoading(false);
  }

  function onFieldChange(field: string, text: string) {
    if (field === 'Email') setEmail(text);
    else if (field === 'Password') setPassword(text);
    else if (field === 'Confirm password') setConfirmPassword(text);
    else if (field === 'Name') setName(text);
  }

  function getValue(field: string) {
    if (field === 'Email') return email;
    else if (field === 'Password') return password;
    else if (field === 'Confirm password') return confirmPassword;
    else if (field === 'Name') return name;
  }

  return (
    <div style = {styles.screen}>
      {/* Title */}
      <Text style={{textAlign: 'center'}}>Welcome to</Text>
      <Text style={styles.title}>MyGamesVault.com</Text>
      {/* Logo */}
      <img style = {{width: 300, height: 300, margin: 25,  alignSelf: 'center'}} src = {require('../../assets/logo.png')}/>
      {/* Input fields */}
      <div style = {styles.inputsContainer} ref = {listRef}>
        {(creating ? createFields : loginFields).map(field => 
          <TextInput 
            key={field} 
            placeholder={field}
            width={400} 
            value={getValue(field)}
            height={50} 
            fontSize={22}
            onChange={(text) => onFieldChange(field, text)}
            style={{margin: 10}}
            type={field === 'Password' || field === 'Confirm password' ? 'password' : undefined}
            onSubmit={() => onButtonPress()}
          />
        )}
        <Button name = {creating ? "Create" : "Login"} style={{marginTop: 20}} width = {200} onClick={() => onButtonPress()} disabled={!email || !password || loading}/>
      </div>
      {/* Status Text */}
      <div style={styles.errorContainer}>
          {error && <Text>{error}</Text>}
      </div>
      {/* Link text */}
      <div style={styles.linksContainer}>
        <Text style={{textDecorationLine: 'underline', margin: 5}} onClick={() => setCreating(!creating)}>{creating ? 'Sign in' : 'Create'}</Text>
        <Text>{creating ? 'to your account or' : 'an account or'}</Text>
        <Text style={{textDecorationLine: 'underline', margin: 5}} onClick={props.onTryit}>try it now.</Text>
      </div>
    </div>
  );
}


let styles: Styles = {
  screen: {
    display: 'flex', 
    flexDirection: 'column',
    width: '100%',
    height: '100vh',
    overflowY: 'auto',
  },
  title: {
    textAlign: 'center',
    fontSize: 42,
    fontWeight: 'bold',
  },
  linksContainer: {
    display: 'flex', 
    flexDirection: 'row', 
    width: '100%', 
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputsContainer: {
    display: 'flex', 
    flexDirection: 'column', 
    width: '100%', 
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  errorContainer: {
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 10
  },

}
  
export default LandingScreen;
