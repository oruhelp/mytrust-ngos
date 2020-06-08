import React, {useState} from 'react';
import {StatusBar, ActivityIndicator, View, Text, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import {ThemeContext} from './services/ThemeContext';
import {AppDataContext} from './services/AppDataContext';
import {UserContext} from './services/UserContext';
import database from '@react-native-firebase/database';
import {theme} from './constants/theme';
import Index from './screens/Index';
import messaging from '@react-native-firebase/messaging';
import {MenuProvider} from 'react-native-popup-menu';
import {name, trustName} from './app.json';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [loadingAppData, setLoadingAppData] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [role, setRole] = useState();
  const [appData, setAppData] = useState();
  const [afterTenSeconds, setAfterTenSeconds] = useState(false);
  const [oruHelp, setOruHelp] = useState();
  const [disableAdmin, setDiableAdmin] = useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setAfterTenSeconds(true);
    }, 60000);
  }, []);

  React.useEffect(() => {
    database()
      .ref(`orgs/${name.toLowerCase()}/appData`)
      .once('value')
      .then(snapshot => {
        setAppData(snapshot.val());
        setLoadingAppData(false);
      });

    database()
      .ref('oruhelp')
      .once('value')
      .then(snapshot => {
        setOruHelp(snapshot.val());
      });

    setLoading(false);
  }, []);

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
      );
    });

    return unsubscribe;
  }, []);

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  function onAuthStateChanged(_user) {
    setUser(_user);

    if (_user && !role) {
      database()
        .ref(`orgs/${name.toLowerCase()}/users/${_user.uid}`)
        .once('value')
        .then(snapshot => {
          const _userRole = snapshot.val();
          if (_userRole && _userRole.role) {
            setRole(_userRole.role);
          }
        });
    }
    if (!_user) {
      setRole();
    }
    if (initializing) {
      setInitializing(false);
    }
  }

  React.useEffect(() => {
    messaging()
      .subscribeToTopic(`${name.toLowerCase()}-all`)
      .then(() => console.log('Subscribed to topic!'));
  }, []);

  return loading || loadingAppData || initializing ? (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: theme.palette.primary.dark,
          fontSize: 25,
          marginBottom: 20,
        }}>
        {trustName}
      </Text>
      <ActivityIndicator size="large" color={theme.palette.primary.dark} />
      {afterTenSeconds && (
        <Text style={{color: theme.palette.primary.dark, marginBottom: 20}}>
          Close and reopen the application if it takes more time
        </Text>
      )}
    </View>
  ) : (
    <AppDataContext.Provider value={{appData: appData}}>
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider
          value={{
            role: role,
            user: user,
            disableAdmin: disableAdmin,
            setDiableAdmin: setDiableAdmin,
          }}>
          <StatusBar backgroundColor={theme.palette.primary.dark + 'e0'} />
          <MenuProvider>
            <Index appData={appData} oruHelp={oruHelp} />
          </MenuProvider>
        </UserContext.Provider>
      </ThemeContext.Provider>
    </AppDataContext.Provider>
  );
}
