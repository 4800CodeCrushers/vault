import { useState } from "react";
import { Text, Button, TextInput } from '..';
import { Styles, LandingScreenProps } from '../../types'
import { User } from "../../classes";
import { Janus, State } from '../../utils';
import { useAutoAnimate } from '@formkit/auto-animate/react';

let createFields: string[] = ['name', 'email', 'password', 'confirm password'];
let loginFields: string[] = ['email', 'password'];

function LandingScreen(props: LandingScreenProps) {

  const [listRef, animationEnabled] = useAutoAnimate();
  const [creating, setCreating] = useState<boolean>(State.creatingAccount);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [name, setName] = useState<string>();

  async function onButtonPress() {
    setLoading(true);
    if (creating) {
      if (!email || !password || !name) return;
      let response = await Janus.CREATE_ACCOUNT(email, password, name);
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
    if (field === 'email') setEmail(text);
    else if (field === 'password') setPassword(text);
    else if (field === 'name') setName(text);
  }

  return (
    <div style = {styles.screen}>
      {/* Title */}
      <Text>Welcome to</Text>
      <Text style={styles.title}>MyGamesVault.com</Text>
      {/* Logo */}
      <img style = {{width: 400, height: 400, margin: 25,  alignSelf: 'center'}} src = {require('../../assets/logo.png')}/>
      {/* Input fields */}
      <div style = {styles.inputsContainer} ref = {listRef}>
        {(creating ? createFields : loginFields).map(field => 
          <TextInput 
            key={field} 
            placeholder={field}
            width={400} 
            height={50} 
            fontSize={22}
            onChange={(text) => onFieldChange(field, text)}
            style={{margin: 10}}
            type={field === 'password' || field === 'confirm password' ? 'password' : undefined}
            onSubmit={() => onButtonPress()}
          />
        )}
        <Button name = {creating ? "Create" : "Login"} width = {200} onClick={() => onButtonPress()} disabled={!email || !password || loading}/>
      </div>
      {/* Status Text */}
      <div style={styles.errorContainer}>
          {error && <Text color={'red'}>{error}</Text>}
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
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    height: '100%',
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
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 10
  },

}
  
export default LandingScreen;
