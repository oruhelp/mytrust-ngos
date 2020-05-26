import React from 'react';
import {Text, StyleSheet, View, Alert} from 'react-native';
import {Button, Input} from 'react-native-elements';
import {ThemeContext} from '../services/ThemeContext';
import {AppDataContext} from '../services/AppDataContext';
import auth from '@react-native-firebase/auth';

const Login = props => {
  const theme = React.useContext(ThemeContext);
  const {appData} = React.useContext(AppDataContext);
  const INITIAL_STATE = {
    email: '',
    password: '',
  };
  const [credential, setCredential] = React.useState(INITIAL_STATE);
  const [loading, setLoading] = React.useState({
    signup: false,
    login: false,
    google: false,
    twitter: false,
    facebook: false,
  });

  const onLoginOrSignup = () => {
    if (!credential || !credential.email || !credential.password) {
      Alert.alert('Enter proper credentials');
      return;
    }
    if (!loading.login) {
      setLoading({...loading, login: true});
      auth()
        .signInWithEmailAndPassword(credential.email, credential.password)
        .then(() => {
          props.navigation.navigate('InitialPage');
          setCredential(INITIAL_STATE);
          setLoading({...loading, login: false});
        })
        .catch(error => {
          if (error.code === 'auth/user-not-found') {
            return auth()
              .createUserWithEmailAndPassword(
                credential.email,
                credential.password,
              )
              .then(() => {
                props.navigation.navigate('InitialPage');
                setCredential(INITIAL_STATE);
                setLoading({...loading, login: false});
              })
              .catch(_error => {
                setLoading({...loading, login: false});
                if (_error.code === 'auth/email-already-in-use') {
                  Alert.alert('That email address is already in use!');
                  setCredential(INITIAL_STATE);
                  return;
                }
                if (_error.code === 'auth/weak-password') {
                  Alert.alert('Please enter strong password');
                  setCredential({...credential, password: ''});
                  return;
                }

                if (_error.code === 'auth/invalid-email') {
                  Alert.alert('That email address is invalid!');
                  setCredential(INITIAL_STATE);
                  return;
                }
                Alert.alert('Some error occured');
                setCredential(INITIAL_STATE);
                return;
              });
          } else {
            setLoading({...loading, login: false});

            if (error.code === 'auth/invalid-email') {
              Alert.alert('That email address is invalid');
              setCredential(INITIAL_STATE);
              return;
            }
            if (error.code === 'auth/user-disabled') {
              Alert.alert('Your account is disabled');
              setCredential(INITIAL_STATE);
              return;
            }

            if (error.code === 'auth/wrong-password') {
              Alert.alert('Wrong password');
              setCredential({...credential, password: ''});
              return;
            }
            Alert.alert('Some error occured');
            setCredential(INITIAL_STATE);
            return;
          }
        });
    }
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    button: {
      margin: 10,
      height: 40,
      backgroundColor: theme.palette.primary.dark,
      borderRadius: 0,
    },
  });

  return (
    <View style={styles.container}>
      <View style={{width: '90%'}}>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 25,
            marginTop: 30,
            marginBottom: 20,
            color: theme.palette.primary.dark,
          }}>
          {appData && appData.title}
        </Text>
        <Input
          placeholder="Email"
          keyboardType="email-address"
          value={credential.email}
          onChangeText={_value => setCredential({...credential, email: _value})}
          style={styles.modalElements}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          value={credential.password}
          onChangeText={_value =>
            setCredential({...credential, password: _value})
          }
          style={styles.modalElements}
        />
        <Text
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 5,
            color: theme.palette.primary.dark,
          }}>
          You will login with OruHelp account
        </Text>
        <Button
          title={loading.login ? 'Loading...' : 'Login / Signup'}
          buttonStyle={styles.button}
          onPress={() => onLoginOrSignup()}
        />
      </View>
    </View>
  );
};

export default Login;
