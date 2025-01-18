import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
// import {setGlobalFont} from './src/utils/fonts';
// import {Buffer} from 'buffer';
// import SessionStorage from 'react-native-session-storage';
import {AlertNotificationRoot} from 'react-native-alert-notification';
import SplashScreen from 'react-native-splash-screen';
import Main_Nav from './navigation/main';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  // useEffect(() => {
  //   const token = SessionStorage.getItem('@token_data');
  //   if (token) {
  //     const parts = token
  //       .split('.')
  //       .map(part =>
  //         Buffer.from(
  //           part.replace(/-/g, '+').replace(/_/g, '/'),
  //           'base64',
  //         ).toString(),
  //       );
  //     const payload = JSON.parse(parts[1]);
  //     console.log('JWT payload', payload);
  //     setUserProfile(payload);
  //     setIsLoggedIn(true);
  //   }
  //   setGlobalFont('Inter-Regular');
  // }, []);

  return (
    <NavigationContainer>
      <AlertNotificationRoot>
        <Main_Nav />
      </AlertNotificationRoot>
    </NavigationContainer>
  );
};

export default App;
